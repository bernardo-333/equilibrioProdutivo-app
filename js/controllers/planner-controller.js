import { DB } from '../database.js';
import { getPlannerHTML } from '../views/planner-view.js';
const HABITS = [
    { id: 'wakeup_early', name: 'Acordar cedo' },
    { id: 'gym', name: 'Academia' },
    { id: 'breakfast', name: 'Café da manhã' },
    { id: 'lunch', name: 'Almoço' },
    { id: 'study_dio', name: 'Estudos DIO' },
    { id: 'reading', name: 'Leitura' },
    { id: 'dinner', name: 'Janta' },
    { id: 'fill_notion', name: 'Preencher Notion' }
];
const TOTAL_CHECKINS = HABITS.length;

function calcDayPct(log) {
    if (!log) return 0;
    let c = 0;
    const habits = log.habits || {};
    for (const h of HABITS) { if (habits[h.id]) c++; }
    return Math.round((c / TOTAL_CHECKINS) * 100);
}

export async function renderPlanner() {
    const root = document.getElementById('planner-root');
    try {
    let kanbanData = await DB.getKanbanData();

    // Expose all cards globally for view modal lookup
    window._kanbanAllCards = [
        ...(kanbanData.ideas || []).map(c => ({...c, progress: 'ideas'})),
        ...(kanbanData.doing || []).map(c => ({...c, progress: 'doing'})),
        ...(kanbanData.done  || []).map(c => ({...c, progress: 'done'}))
    ];

    // --- Build calendar and history from REAL daily_logs ---
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayDate = now.getDate();

    const monthLogs = await DB.getMonthlyLogs(yearMonth);

    // Calendar heatmap data
    const calendarData = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = `${yearMonth}-${String(d).padStart(2, '0')}`;
        const log = monthLogs[ds];
        const pct = calcDayPct(log);
        let level = 0;
        if (pct > 0 && pct <= 33) level = 1;
        else if (pct > 33 && pct <= 66) level = 2;
        else if (pct > 66) level = 3;
        calendarData.push({ day: d, level, isFuture: d > todayDate });
    }

    // History days (most recent first, only days with data)
    const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const historyDays = [];
    for (let d = todayDate; d >= 1; d--) {
        const ds = `${yearMonth}-${String(d).padStart(2, '0')}`;
        const log = monthLogs[ds];
        if (!log) continue;
        const pct = calcDayPct(log);
        const habits = HABITS.map(h => ({ id: h.id, name: h.name, done: !!(log.habits && log.habits[h.id]) }));
        historyDays.push({
            date: `${String(d).padStart(2,'0')} ${monthNames[month]}`,
            rawDate: ds,
            pct,
            mood: log.mood || null,
            sleep: log.sleep || null,
            water: log.water || 0,
            telas: log.screen_time || 0,
            income_dia: log.income_dia || 0,
            expense_dia: log.expense_dia || 0,
            income_din: log.income_din || 0,
            expense_din: log.expense_din || 0,
            habits
        });
    }

    window._plannerHistory = historyDays;

    // Calculate real metrics
    const logsArr = Object.values(monthLogs);
    const perfectDays = logsArr.filter(l => calcDayPct(l) === 100).length;

    const sleepLabels = { 'perfeito': 5, 'muito_bom': 4, 'bom': 3, 'mais_ou_menos': 2, 'ruim': 1 };
    const sleepReverse = { 5: 'perfeito', 4: 'muito_bom', 3: 'bom', 2: 'mais_ou_menos', 1: 'ruim' };
    const moodLabels = { 'feliz': 5, 'produtivo': 4, 'normal': 3, 'cansado': 2, 'triste': 1 };
    const moodReverse = { 5: 'feliz', 4: 'produtivo', 3: 'normal', 2: 'cansado', 1: 'triste' };

    let sleepSum = 0, sleepCount = 0, moodSum = 0, moodCount = 0;
    for (const l of logsArr) {
        if (l.sleep && sleepLabels[l.sleep]) { sleepSum += sleepLabels[l.sleep]; sleepCount++; }
        if (l.mood && moodLabels[l.mood]) { moodSum += moodLabels[l.mood]; moodCount++; }
    }
    const avgSleep = sleepCount > 0 ? sleepReverse[Math.round(sleepSum / sleepCount)] || 'bom' : '—';
    const avgMood = moodCount > 0 ? moodReverse[Math.round(moodSum / moodCount)] || 'normal' : '—';

    const finances = await DB.getFinances();

    const metrics = {
        perfectDays,
        avgSleep,
        avgMood,
        totalGastoDia: (finances.transactions || []).filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
        totalGastoDinheiro: finances.balance || 0
    };

    root.innerHTML = getPlannerHTML({ calendarData, historyDays, metrics, kanbanData });
    initKanbanDragAndDrop();
    } catch (e) {
        console.error('Planner error:', e);
        root.innerHTML = `<div style="color:red; padding:20px; word-break:break-all;"><h3>Erro no Planner:</h3><pre>${e.message}\n${e.stack}</pre></div>`;
    }
}

// ----- DAILY DETAIL LOGIC -----

window.openDailyDetail = (date, isEditMode = false) => {
    // Busca novamente do history (que pode ou não estar atualizado dependendo se ele acabou de editar)
    let day = window._plannerHistory.find(d => d.date === date || d.rawDate === date);
    if (!day) return;
    
    // Fallback pra date caso seja chamado com rawDate
    const displayDate = day.date || date;
    const rawDate = day.rawDate || date;

    const modal = document.getElementById('day-detail-modal');
    const overlay = document.getElementById('day-detail-overlay');
    const sheet = document.getElementById('day-detail-sheet');
    const content = document.getElementById('day-detail-content');

    document.getElementById('lbl-day-title').innerText = displayDate;
    document.getElementById('lbl-day-pct').innerText = `${day.pct}% Concluído`;

    const moodLabels = { nervoso:'Nervoso', feliz:'Feliz', produtivo:'Produtivo', normal:'Normal', ansioso:'Ansioso', cansado:'Cansado', triste:'Triste' };
    const moodClasses = {
        nervoso: 'border-red-500 bg-red-500/20 text-red-500',
        feliz: 'border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]',
        produtivo: 'border-cyan-400 bg-cyan-400/20 text-cyan-400',
        normal: 'border-white/50 bg-white/10 text-white',
        ansioso: 'border-orange-400 bg-orange-400/20 text-orange-400',
        cansado: 'border-purple-400 bg-purple-400/20 text-purple-400',
        triste: 'border-blue-400 bg-blue-400/20 text-blue-400'
    };
    const sleepLabels = { perfeito:'Perfeito', muito_bom:'Muito bom', bom:'Bom', mais_ou_menos:'Mais ou menos', ruim:'Ruim' };
    const sleepClasses = {
        perfeito: 'border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]',
        muito_bom: 'border-blue-400 bg-blue-400/20 text-blue-400',
        bom: 'border-cyan-400 bg-cyan-400/20 text-cyan-400',
        mais_ou_menos: 'border-orange-400 bg-orange-400/20 text-orange-400',
        ruim: 'border-red-500 bg-red-500/20 text-red-500'
    };

    const waterFilled = Math.round(day.water);
    const waterDrops = [1,2,3,4,5].map(i => {
        if (isEditMode) {
             return `<button onclick="window.setWaterForDate('${rawDate}', ${i})" class="text-4xl transition-all duration-300 ${i <= waterFilled ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none' : 'grayscale opacity-30'} hover:scale-110 active:scale-90">💧</button>`;
        }
        return `<span class="text-4xl transition-all duration-300 ${i <= waterFilled ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'grayscale opacity-30'}">💧</span>`;
    }).join('');

    content.innerHTML = `
        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${isEditMode ? 'text-primary accent-text' : 'text-on-surface-variant/70'} pl-2 flex items-center gap-2">
                Como você se sentiu? ${isEditMode ? '<span class="material-symbols-outlined text-[14px]">edit</span>' : ''}
            </h3>
            <div class="bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-6">

                <!-- Humor -->
                <div class="space-y-3">
                    <span class="text-sm font-bold text-[var(--text-primary)] block">Humor Geral</span>
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                        ${Object.keys(moodLabels).map(key => {
                            const active = key === day.mood;
                            if (isEditMode) {
                                return `<button onclick="window.setQualitativeForDate('${rawDate}', 'mood', '${key}')" class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${active ? moodClasses[key] + ' opacity-100' : 'border-transparent bg-surface-highest text-on-surface-variant opacity-30 hover:opacity-100'}">${moodLabels[key]}</button>`;
                            }
                            return `<span class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${active ? moodClasses[key] : 'border-transparent bg-surface-highest text-on-surface-variant opacity-30'}">${moodLabels[key]}</span>`;
                        }).join('')}
                    </div>
                </div>

                <div class="h-px w-full bg-white/5"></div>

                <!-- Sono -->
                <div class="space-y-3">
                    <span class="text-sm font-bold text-[var(--text-primary)] block">Qualidade do Sono</span>
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                        ${Object.keys(sleepLabels).map(key => {
                            const active = key === day.sleep;
                            if (isEditMode) {
                                return `<button onclick="window.setQualitativeForDate('${rawDate}', 'sleep', '${key}')" class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${active ? sleepClasses[key] + ' opacity-100' : 'border-transparent bg-surface-highest text-on-surface-variant opacity-30 hover:opacity-100'}">${sleepLabels[key]}</button>`;
                            }
                            return `<span class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${active ? sleepClasses[key] : 'border-transparent bg-surface-highest text-on-surface-variant opacity-30'}">${sleepLabels[key]}</span>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        </section>

        <!-- Corpo e Tempo -->
        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${isEditMode ? 'text-primary accent-text' : 'text-on-surface-variant/70'} pl-2 flex items-center gap-2">
                Seu corpo e tempo ${isEditMode ? '<span class="material-symbols-outlined text-[14px]">edit</span>' : ''}
            </h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 bg-surface-container rounded-3xl p-5 border border-white/5 flex flex-col items-center gap-4">
                    <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Água Consumida (1 Gota = 1 Litro)</span>
                    <div class="flex items-center gap-3">
                        ${waterDrops}
                    </div>
                    <span class="text-[10px] font-bold text-cyan-400 tracking-widest">${day.water}L no total</span>
                </div>
                
                <!-- Fluxo Financeiro Diário -->
                <div class="col-span-2 space-y-4 pt-2">
                    <h3 class="text-[11px] font-bold tracking-widest uppercase ${isEditMode ? 'text-primary accent-text' : 'text-on-surface-variant/70'} flex items-center gap-2">
                        Fluxo do Caixa ${isEditMode ? '<span class="material-symbols-outlined text-[14px]">edit</span>' : ''}
                    </h3>
                    
                    <!-- Carteira Dia a Dia -->
                    <div class="space-y-3">
                        <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Dia a Dia"</span>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${isEditMode ? 'focus-within:ring-2 focus-within:ring-red-400' : ''}">
                                <span class="text-xs font-bold text-on-surface-variant">Gasto do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-red-400 font-bold mr-1">R$</span>
                                    ${isEditMode ? 
                                        `<input id="input-planner-dia-expense" value="${day.expense_dia || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`
                                        : `<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(day.expense_dia || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>`
                                    }
                                </div>
                            </div>
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${isEditMode ? 'focus-within:ring-2 focus-within:ring-primary/50' : ''}">
                                <span class="text-xs font-bold text-on-surface-variant">Ganho do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-primary accent-text font-bold mr-1">R$</span>
                                    ${isEditMode ? 
                                        `<input id="input-planner-dia-income" value="${day.income_dia || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`
                                        : `<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(day.income_dia || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Carteira Meu Dinheiro -->
                    <div class="space-y-3 pt-2">
                        <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Meu Dinheiro"</span>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${isEditMode ? 'focus-within:ring-2 focus-within:ring-red-400' : ''}">
                                <span class="text-xs font-bold text-on-surface-variant">Gasto do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-red-400 font-bold mr-1">R$</span>
                                    ${isEditMode ? 
                                        `<input id="input-planner-din-expense" value="${day.expense_din || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`
                                        : `<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(day.expense_din || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>`
                                    }
                                </div>
                            </div>
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${isEditMode ? 'focus-within:ring-2 focus-within:ring-primary/50' : ''}">
                                <span class="text-xs font-bold text-on-surface-variant">Ganho do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-primary accent-text font-bold mr-1">R$</span>
                                    ${isEditMode ? 
                                        `<input id="input-planner-din-income" value="${day.income_din || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`
                                        : `<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(day.income_din || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- As 8 Rotinas -->
        <section class="space-y-4">
            <div class="flex justify-between items-center pl-2 pr-1">
                <h3 class="text-[11px] font-bold tracking-widest uppercase ${isEditMode ? 'text-primary accent-text' : 'text-on-surface-variant/70'} flex items-center gap-2">
                    As 8 Rotinas ${isEditMode ? '<span class="material-symbols-outlined text-[14px]">edit</span>' : ''}
                </h3>
                <span class="text-[10px] font-bold text-primary accent-text">${day.habits.filter(h=>h.done).length}/${day.habits.length}</span>
            </div>
            <div class="bg-surface-container rounded-[32px] p-2 space-y-1 border border-white/5">
                ${day.habits.map(h => {
                    if (isEditMode) {
                        return `
                        <div class="flex items-center justify-between p-3 rounded-2xl ${h.done ? 'bg-surface-highest/50' : ''} transition-colors cursor-pointer group active:scale-[0.98]" onclick="window.toggleHabitForDate('${rawDate}', '${h.id}', ${!h.done})">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
                                    <span class="material-symbols-outlined text-lg ${h.done ? 'text-primary accent-text' : 'text-on-surface-variant group-hover:text-white'}" style="font-variation-settings: 'FILL' ${h.done ? 1 : 0};">task_alt</span>
                                </div>
                                <span class="text-base font-bold transition-all ${h.done ? 'line-through opacity-50 text-on-surface-variant' : 'text-[var(--text-primary)]'}">${h.name}</span>
                            </div>
                            <div class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${h.done ? 'bg-primary accent-bg border-primary accent-border' : 'border-on-surface-variant/30 group-hover:border-white/40'}">
                                ${h.done ? '<span class="material-symbols-outlined text-black font-bold mix-blend-color-burn" style="font-size:16px;">check</span>' : ''}
                            </div>
                        </div>`;
                    }
                    // VIEW MODE UI FOR HABITS
                    return `
                        <div class="flex items-center justify-between p-3 rounded-2xl ${h.done ? 'bg-surface-highest/50' : 'opacity-60'} transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
                                    <span class="material-symbols-outlined text-lg ${h.done ? 'text-primary accent-text' : 'text-on-surface-variant'}" style="font-variation-settings: 'FILL' ${h.done ? 1 : 0};">task_alt</span>
                                </div>
                                <span class="text-base font-bold transition-all ${h.done ? 'line-through text-on-surface-variant' : 'text-on-surface-variant'}">${h.name}</span>
                            </div>
                            ${h.done ? '<div class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center"><span class="material-symbols-outlined text-primary accent-text font-bold" style="font-size:16px;">check</span></div>' : ''}
                        </div>`;
                }).join('')}
            </div>
        </section>

        <!-- Footer Buttons -->
        ${isEditMode ? `
        <button onclick="window.saveAndCloseDailyDetail('${rawDate}');" class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-xl active:scale-95 transition-transform mt-6">
            Salvar e Concluir
        </button>
        ` : `
        <button onclick="window.openDailyDetail('${rawDate}', true);" class="w-full h-16 rounded-[24px] bg-surface-highest border border-white/10 text-[var(--text-primary)] font-bold text-lg active:scale-95 transition-transform mt-6 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">edit</span> Editar Dia
        </button>
        `}
    `;

    // Only un-hide the modal if it's not currently open
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            sheet.classList.remove('translate-y-full');
        });
    }
};

window.toggleHabitForDate = async (date, habitId, isCompleted) => {
    // 1. Update remote DB
    await DB.updateHabit(habitId, isCompleted, date);
    
    // 2. Update local state
    const day = window._plannerHistory.find(d => d.rawDate === date);
    if (day) {
        const h = day.habits.find(hx => hx.id === habitId);
        if (h) h.done = isCompleted;
        // recalculate simple local pct just for UI update speed
        let doneCount = day.habits.filter(hx => hx.done).length;
        day.pct = Math.round((doneCount / day.habits.length) * 100);
    }
    
    // 3. Immediately re-paint interior
    window.openDailyDetail(date, true);
};

window.setQualitativeForDate = async (date, type, value) => {
    await DB.updateDailyMetrics(type, value, date);
    const day = window._plannerHistory.find(d => d.rawDate === date);
    if (day) day[type] = value;
    window.openDailyDetail(date, true);
};

window.setWaterForDate = async (date, liters) => {
    await DB.updateDailyMetrics('water', liters, date);
    const day = window._plannerHistory.find(d => d.rawDate === date);
    if (day) day.water = liters;
    window.openDailyDetail(date, true);
};

window.saveAndCloseDailyDetail = async (date) => {
    // Busca os 4 campos se estiverem renderizados no HTML
    const incDiaId = document.getElementById('input-planner-dia-income');
    const expDiaId = document.getElementById('input-planner-dia-expense');
    const incDinId = document.getElementById('input-planner-din-income');
    const expDinId = document.getElementById('input-planner-din-expense');
    
    if (incDiaId || expDiaId || incDinId || expDinId) {
        const payload = {
            income_dia: incDiaId ? (parseFloat(incDiaId.value) || 0) : 0,
            expense_dia: expDiaId ? (parseFloat(expDiaId.value) || 0) : 0,
            income_din: incDinId ? (parseFloat(incDinId.value) || 0) : 0,
            expense_din: expDinId ? (parseFloat(expDinId.value) || 0) : 0
        };
        // Salva
        await DB.updateDailyFinances(date, payload);
    }

    // Fechar Modal
    window.closeDailyDetail();
    // Render Planner Completo (com os saldos reatualizados)
    setTimeout(() => {
        window.renderPlanner();
    }, 400); // aguarda a animaÃ§Ã£o de fechar iniciar
};

window.closeDailyDetail = () => {
    const modal = document.getElementById('day-detail-modal');
    const overlay = document.getElementById('day-detail-overlay');
    const sheet = document.getElementById('day-detail-sheet');

    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 500); // UI closes securely
};

// ----- FULL HISTORY LOGIC -----

window.openFullHistory = () => {
    const modal = document.getElementById('full-history-modal');
    const sheet = document.getElementById('full-history-sheet');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
        sheet.classList.remove('scale-95', 'opacity-0');
    });
};

window.closeFullHistory = () => {
    const modal = document.getElementById('full-history-modal');
    const sheet = document.getElementById('full-history-sheet');

    sheet.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
};

// ----- KANBAN VIEW & FORM LOGIC -----

const _typeLabels = { estudo:'📚 Estudo', hobbie:'🎮 Hobbie', crescimento:'🌱 Crescimento', trabalho:'💼 Trabalho', saude:'🏋️ Saúde', outro:'📌 Outro' };
const _progressLabels = { ideas:'A Iniciar', doing:'Em Progresso', done:'Feito ✅' };
const _progressColors = { ideas:'text-on-surface-variant/60', doing:'text-blue-400', done:'text-green-400' };

let _editingKanbanId = null;
let _viewingCard = null; // store current card for edit transition

// --- VIEW MODAL ---

window.openKanbanView = (cardId) => {
    // Find card from all columns rendered on DOM
    const cardEl = document.querySelector(`.kanban-card[data-id="${cardId}"]`);
    // Build card object from data-attributes or window store
    const card = (window._kanbanAllCards || []).find(c => c.id === cardId) || {
        id: cardId,
        emoji: cardEl?.querySelector('span.text-2xl')?.innerText || '🎯',
        title: cardEl?.querySelector('p')?.innerText || '',
        type: '', objective: '', description: '', start: '', end: ''
    };
    _viewingCard = card;

    // Populate header
    document.getElementById('lbl-kv-emoji').innerText = card.emoji || '🎯';
    document.getElementById('lbl-kv-title').innerText = card.title || '';
    document.getElementById('lbl-kv-type').innerText = _typeLabels[card.type] || '';

    // Build body content
    const rows = [];
    if (card.objective) rows.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-1">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Objetivo</span>
            <p class="font-bold text-[var(--text-primary)] text-base leading-snug">${card.objective}</p>
        </div>`);
    if (card.start || card.end) rows.push(`
        <div class="grid grid-cols-2 gap-3">
            <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Início</span>
                <p class="font-bold text-[var(--text-primary)]">${card.start || '—'}</p>
            </div>
            <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Término</span>
                <p class="font-bold text-[var(--text-primary)]">${card.end || '—'}</p>
            </div>
        </div>`);
    const progColor = _progressColors[card.progress] || 'text-on-surface-variant/60';
    rows.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Progresso</span>
            <span class="font-bold text-sm ${progColor}">${_progressLabels[card.progress] || 'A Iniciar'}</span>
        </div>`);
    if (card.description) rows.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-2">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Descrição</span>
            <p class="text-[var(--text-primary)] text-sm leading-relaxed">${card.description}</p>
        </div>`);

    document.getElementById('kanban-view-content').innerHTML = rows.join('') || `<p class="text-center text-on-surface-variant/30 text-sm py-8">Sem detalhes adicionados.</p>`;

    const modal = document.getElementById('kanban-view-modal');
    const overlay = document.getElementById('kanban-view-overlay');
    const sheet = document.getElementById('kanban-view-sheet');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });
};

window.closeKanbanView = () => {
    const modal = document.getElementById('kanban-view-modal');
    const overlay = document.getElementById('kanban-view-overlay');
    const sheet = document.getElementById('kanban-view-sheet');

    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 500);
};

window.openKanbanEditFromView = () => {
    // Close view first, then open edit
    window.closeKanbanView();
    setTimeout(() => {
        window.openKanbanForm(_viewingCard?.id, _viewingCard);
    }, 200);
};

// --- FORM MODAL (Create / Edit) ---

window.openKanbanForm = (cardId, cardData) => {
    const modal = document.getElementById('kanban-form-modal');
    const overlay = document.getElementById('kanban-form-overlay');
    const sheet = document.getElementById('kanban-form-sheet');

    // Reset type + progress buttons first
    document.querySelectorAll('.kanban-type-btn').forEach(b => {
        b.classList.remove('border-primary', 'bg-primary/20', 'text-primary');
        b.classList.add('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    });
    document.querySelectorAll('.kanban-progress-btn').forEach(b => {
        b.classList.remove('border-blue-400', 'bg-blue-400/20', 'text-blue-400');
        b.classList.add('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    });

    if (cardId && cardData) {
        // EDIT mode — pre-fill all fields
        _editingKanbanId = cardId;
        document.getElementById('lbl-kanban-form-title').innerText = 'Editar Card';
        document.getElementById('btn-kanban-delete').classList.remove('hidden');

        document.getElementById('kanban-emoji').value = cardData.emoji || '';
        document.getElementById('kanban-title').value = cardData.title || '';
        document.getElementById('kanban-objective').value = cardData.objective || '';
        document.getElementById('kanban-description').value = cardData.description || '';
        document.getElementById('kanban-start').value = cardData.start || '';
        document.getElementById('kanban-end').value = cardData.end || '';

        if (cardData.type) {
            const typeBtn = document.querySelector(`.kanban-type-btn[data-val="${cardData.type}"]`);
            if (typeBtn) window.setKanbanType(typeBtn);
        }
        const progress = cardData.progress || 'ideas';
        const progBtn = document.querySelector(`.kanban-progress-btn[data-val="${progress}"]`);
        if (progBtn) window.setKanbanProgress(progBtn);
    } else {
        // CREATE mode
        _editingKanbanId = null;
        document.getElementById('lbl-kanban-form-title').innerText = 'Novo Card';
        document.getElementById('btn-kanban-delete').classList.add('hidden');

        document.getElementById('kanban-emoji').value = '';
        document.getElementById('kanban-title').value = '';
        document.getElementById('kanban-objective').value = '';
        document.getElementById('kanban-description').value = '';
        document.getElementById('kanban-start').value = '';
        document.getElementById('kanban-end').value = '';

        const defaultBtn = document.querySelector('.kanban-progress-btn[data-val="ideas"]');
        if (defaultBtn) window.setKanbanProgress(defaultBtn);
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });
};

window.closeKanbanForm = () => {
    const modal = document.getElementById('kanban-form-modal');
    const overlay = document.getElementById('kanban-form-overlay');
    const sheet = document.getElementById('kanban-form-sheet');

    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 400);
};

window.setKanbanType = (btn) => {
    document.querySelectorAll('.kanban-type-btn').forEach(b => {
        b.classList.remove('border-primary', 'bg-primary/20', 'text-primary');
        b.classList.add('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    });
    btn.classList.remove('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    btn.classList.add('border-primary', 'bg-primary/20', 'text-primary');
};

window.setKanbanProgress = (btn) => {
    document.querySelectorAll('.kanban-progress-btn').forEach(b => {
        b.classList.remove('border-blue-400', 'bg-blue-400/20', 'text-blue-400');
        b.classList.add('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    });
    btn.classList.remove('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    btn.classList.add('border-blue-400', 'bg-blue-400/20', 'text-blue-400');
};

window.saveKanbanForm = async () => {
    const title = document.getElementById('kanban-title').value.trim();
    if (!title) {
        document.getElementById('kanban-title').focus();
        return;
    }

    const card = {
        id: _editingKanbanId || Date.now().toString(),
        emoji: document.getElementById('kanban-emoji').value,
        title,
        type: document.querySelector('.kanban-type-btn.text-primary')?.dataset.val || '',
        start: document.getElementById('kanban-start').value,
        end: document.getElementById('kanban-end').value,
        objective: document.getElementById('kanban-objective').value,
        description: document.getElementById('kanban-description').value
    };

    const progress = document.querySelector('.kanban-progress-btn.text-blue-400')?.dataset.val || 'ideas';

    let kanbanData = await DB.getKanbanData();
    if (!kanbanData.ideas) kanbanData.ideas = [];
    if (!kanbanData.doing) kanbanData.doing = [];
    if (!kanbanData.done) kanbanData.done = [];

    // Remove card from all columns first (handles both edit and move)
    ['ideas', 'doing', 'done'].forEach(col => {
        kanbanData[col] = kanbanData[col].filter(c => c.id !== card.id);
    });

    // Add to the correct column
    kanbanData[progress].push(card);

    await DB.saveKanbanData(kanbanData);
    window.closeKanbanForm();
    setTimeout(() => renderPlanner(), 400);
};

window.deleteKanbanCard = async () => {
    if (_editingKanbanId && confirm('Tem certeza que deseja excluir este card?')) {
        let kanbanData = await DB.getKanbanData();
        ['ideas', 'doing', 'done'].forEach(col => {
            kanbanData[col] = (kanbanData[col] || []).filter(c => c.id !== _editingKanbanId);
        });
        await DB.saveKanbanData(kanbanData);
        window.closeKanbanForm();
        setTimeout(() => renderPlanner(), 400);
    }
};



function initKanbanDragAndDrop() {
    let draggedItem = null;
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');
    cards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            draggedItem = this;
            setTimeout(() => this.classList.add('opacity-30', 'scale-95'), 0);
        });
        card.addEventListener('dragend', function() {
            setTimeout(() => {
                this.classList.remove('opacity-30', 'scale-95');
                draggedItem = null;
            }, 0);
        });
    });
    columns.forEach(col => {
        col.addEventListener('dragover', function(e) { e.preventDefault(); });
        col.addEventListener('dragenter', function(e) { e.preventDefault(); this.classList.add('border-primary/50', 'bg-white/5'); });
        col.addEventListener('dragleave', function() { this.classList.remove('border-primary/50', 'bg-white/5'); });
        col.addEventListener('drop', async function() {
            this.classList.remove('border-primary/50', 'bg-white/5');
            if (draggedItem) {
                const emptyMsg = this.querySelector('p, .opacity-30');
                if (emptyMsg) emptyMsg.remove();
                this.appendChild(draggedItem);

                // Persist column move to DB
                const cardId = draggedItem.dataset.cardId;
                const newColumn = this.dataset.column; // 'ideas', 'doing', or 'done'
                if (cardId && newColumn) {
                    let kanbanData = await DB.getKanbanData();
                    let movedCard = null;
                    ['ideas', 'doing', 'done'].forEach(c => {
                        const idx = (kanbanData[c] || []).findIndex(card => card.id === cardId);
                        if (idx >= 0) {
                            movedCard = kanbanData[c].splice(idx, 1)[0];
                        }
                    });
                    if (movedCard) {
                        if (!kanbanData[newColumn]) kanbanData[newColumn] = [];
                        kanbanData[newColumn].push(movedCard);
                        await DB.saveKanbanData(kanbanData);
                    }
                }
            }
        });
    });
}
