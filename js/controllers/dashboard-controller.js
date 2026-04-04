import { DB } from '../database.js';
import { getDashboardHTML } from '../views/dashboard-view.js';

// The exhaustive list of 8 routine base habits
const ALL_HABITS = [
    { id: 'wakeup_early', name: 'Acordar cedo', icon: 'wb_sunny' },
    { id: 'gym', name: 'Academia', icon: 'fitness_center' },
    { id: 'breakfast', name: 'Café da manhã', icon: 'coffee' },
    { id: 'lunch', name: 'Almoço', icon: 'restaurant' },
    { id: 'study_dio', name: 'Estudos DIO', icon: 'school' },
    { id: 'reading', name: 'Leitura', icon: 'menu_book' },
    { id: 'dinner', name: 'Janta', icon: 'restaurant_menu' },
    { id: 'fill_notion', name: 'Preencher Notion', icon: 'edit_note' }
];

function getDashboardBalances(allLogs, todayStr) {
    const logs = Object.values(allLogs || {});
    const diaBalance = logs.reduce((sum, log) => {
        return sum + Number(log.income_dia || 0) - Number(log.expense_dia || 0);
    }, 0);
    const dinheiroBalance = logs.reduce((sum, log) => {
        return sum + Number(log.income_din || 0) - Number(log.expense_din || 0);
    }, 0);

    return { diaBalance, dinheiroBalance };
}

function calcDayPctFromLog(log) {
    if (!log) return 0;
    if (log.rest_day) return 100;

    let habitsCompleted = 0;
    const habits = log.habits || {};
    for (const habit of ALL_HABITS) {
        if (habits[habit.id]) habitsCompleted++;
    }
    return Math.round((habitsCompleted / ALL_HABITS.length) * 100);
}

export async function renderDashboard() {
    const root = document.getElementById('dashboard-root');
    try {
        const todayLog = await DB.getTodayLog();
        const libraryItems = await DB.getLibrary();

        // Store globally for view/edit lookups
        window._libraryItems = libraryItems;

        // Calculate completion metrics
        let habitsCompleted = 0;
        if (!todayLog.habits) todayLog.habits = {};
        for (const habit of ALL_HABITS) {
            if (todayLog.habits[habit.id]) habitsCompleted++;
        }

        const isRestDay = !!todayLog.rest_day;
        const todayPct = calcDayPctFromLog(todayLog);
        const missing = ALL_HABITS.length - habitsCompleted;
        const isAllDone = isRestDay || habitsCompleted === ALL_HABITS.length;

        // Build weekly snap from real data (last 5 weekdays)
        const dayNames = ['D','S','T','Q','Q','S','S'];
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const allLogs = await DB.getAllDailyLogs();
        const balances = getDashboardBalances(allLogs, todayStr);
        const yearMonth = todayStr.substring(0, 7);
        const monthLogs = await DB.getMonthlyLogs(yearMonth);

        // Find the current weekday position in Mon-Fri (0-4)
        const todayDow = now.getDay(); // 0=Sun .. 6=Sat
        // Build last 5 weekdays ending on today (or nearest weekday)
        const weekDays = [];
        const d = new Date(now);
        // Go back to Monday of this week
        const mondayOffset = todayDow === 0 ? -6 : -(todayDow - 1);
        d.setDate(d.getDate() + mondayOffset);
        for (let i = 0; i < 5; i++) {
            const ds = d.toISOString().split('T')[0];
            const log = monthLogs[ds];
            const pct = calcDayPctFromLog(log);
            const isRestDayLog = !!(log && log.rest_day);
            const state = ds === todayStr ? 'today' : (ds < todayStr ? 'past' : 'future');
            weekDays.push({ day: dayNames[d.getDay()], state, pct, isRestDay: isRestDayLog });
            d.setDate(d.getDate() + 1);
        }
        const weekData = weekDays;

        // Dynamic snap message
        const perfectDaysCount = weekData.filter(d => d.pct === 100 && !d.isRestDay).length;
        const isMonday = now.getDay() === 1;
        const todayIdx = weekData.findIndex(d => d.state === 'today');
        
        let snapMessage = `${perfectDaysCount} dias perfeitos. <span class="text-primary accent-text">Não quebre a sequência hoje!</span>`;
        if (isRestDay) {
            snapMessage = "Hoje é dia de descanso. Recuperar também é disciplina.";
        }
        
        if (perfectDaysCount === 5) {
            snapMessage = "Semana Lendária concluída! Descanse nos fins de semana.";
        } else if (isMonday && todayPct === 0) {
            snapMessage = "Tela em branco. Vamos desenhar uma semana perfeita?";
        } else if (todayIdx > 0 && weekData[todayIdx - 1].pct < 100) {
            snapMessage = "Ontem foi dia de descanso, mas hoje é foco total!";
        } else if (todayPct === 0) {
            snapMessage = "O dia está voando. Hora do primeiro check-in!";
        }
        // Generate the dynamic view UI
        root.innerHTML = getDashboardHTML({ 
            todayLog, balances, todayPct, missing, isAllDone, weekData, DEFAULT_HABITS: ALL_HABITS, snapMessage, libraryItems 
        });

        // Ensure dynamic dom texts are synced
        await recalculateProgress();
    } catch (e) {
        console.error(e);
        root.innerHTML = `<div style="color:red; padding:20px; word-break:break-all;"><h3>Erro no Dashboard:</h3><pre>${e.message}\n${e.stack}</pre></div>`;
    }
}

window.openCheckinModal = async () => {
    const el = document.getElementById('checkin-modal');
    const overlay = document.getElementById('checkin-modal-overlay');
    const sheet = document.getElementById('checkin-modal-sheet');

    // Display modal container
    el.classList.remove('hidden');
    el.classList.add('flex');
    
    // Set dynamic Date string in header
    const dt = new Date();
    const lblDate = document.getElementById('lbl-checkin-date');
    const lblDay = document.getElementById('lbl-checkin-day');
    if (lblDate) lblDate.textContent = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.','').toUpperCase();
    if (lblDay) lblDay.textContent = dt.toLocaleDateString('pt-BR', { weekday: 'long' });

    // Pre-select saved mood/sleep/water/screen_time/instagram
    const todayLog = await DB.getTodayLog();

    // Mood chips
    const moodMap = { nervoso: 'Nervoso', feliz: 'Feliz', produtivo: 'Produtivo', normal: 'Normal', ansioso: 'Ansioso', cansado: 'Cansado', triste: 'Triste' };
    if (todayLog.mood) {
        const label = moodMap[todayLog.mood];
        document.querySelectorAll('.mood-btn').forEach(btn => {
            if (btn.textContent.trim() === label) window.selectChip(btn, 'mood-btn', true);
        });
    }

    // Sleep chips
    const sleepMap = { perfeito: 'Perfeito', muito_bom: 'Muito bom', bom: 'Bom', mais_ou_menos: 'Mais ou menos', ruim: 'Ruim' };
    if (todayLog.sleep) {
        const label = sleepMap[todayLog.sleep];
        document.querySelectorAll('.sleep-btn').forEach(btn => {
            if (btn.textContent.trim() === label) window.selectChip(btn, 'sleep-btn', true);
        });
    }

    // Water drops
    const savedWater = todayLog.water || 0;
    if (savedWater > 0) {
        for (let i = 1; i <= 5; i++) {
            const drop = document.getElementById(`water-drop-${i}`);
            if (drop) {
                if (i <= savedWater) {
                    drop.classList.remove('grayscale', 'opacity-30');
                    drop.classList.add('drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]', 'filter-none');
                } else {
                    drop.classList.add('grayscale', 'opacity-30');
                    drop.classList.remove('drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]', 'filter-none');
                }
            }
        }
    }

    // Screen time inputs
    const screenInput = document.getElementById('input-screen-time');
    const instagramInput = document.getElementById('input-instagram');
    if (screenInput) screenInput.value = todayLog.screen_time || '';
    if (instagramInput) instagramInput.value = todayLog.instagram || '';

    // Rest day toggle
    window.toggleRestDay(!!todayLog.rest_day, true);
    
    // Trigger animations smooth slide up
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });
};

window.closeCheckinModal = async () => {
    // Save screen_time and instagram before closing
    const screenInput = document.getElementById('input-screen-time');
    const instagramInput = document.getElementById('input-instagram');
    const updates = [];

    if (screenInput) {
        updates.push(DB.updateDailyMetrics('screen_time', screenInput.value || ''));
    }
    if (instagramInput) {
        updates.push(DB.updateDailyMetrics('instagram', instagramInput.value || ''));
    }

    const restBtn = document.getElementById('rest-day-toggle-checkin');
    const isRestDay = restBtn?.dataset.active === 'true';
    updates.push(DB.updateDailyMetrics('rest_day', !!isRestDay));

    // Save Daily Finances
    const incDiaId = document.getElementById('input-fluxo-dia-income');
    const expDiaId = document.getElementById('input-fluxo-dia-expense');
    const incDinId = document.getElementById('input-fluxo-din-income');
    const expDinId = document.getElementById('input-fluxo-din-expense');

    if (incDiaId || expDiaId || incDinId || expDinId) {
        const payload = {
            income_dia: incDiaId ? (parseFloat(incDiaId.value) || 0) : 0,
            expense_dia: expDiaId ? (parseFloat(expDiaId.value) || 0) : 0,
            income_din: incDinId ? (parseFloat(incDinId.value) || 0) : 0,
            expense_din: expDinId ? (parseFloat(expDinId.value) || 0) : 0
        };
        const todayStr = new Date().toISOString().split('T')[0];
        updates.push(DB.updateDailyFinances(todayStr, payload));
    }

    await Promise.all(updates);

    const el = document.getElementById('checkin-modal');
    const overlay = document.getElementById('checkin-modal-overlay');
    const sheet = document.getElementById('checkin-modal-sheet');

    // Trigger animations smoothly slide down
    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    
    // Wait for the transition to finish to hide elements and refresh data globally
    setTimeout(() => {
        el.classList.add('hidden');
        el.classList.remove('flex');
        renderDashboard(); 
    }, 500); // matches duration-500
};

// ----- LIBRARY SECTION LOGIC -----

let _viewingLibItem = null;

// --- LIBRARY VIEW MODAL ---

window.openLibraryView = (itemId) => {
    const items = window._libraryItems || [];
    const item = items.find(i => i.id === itemId) || { id: itemId, emoji:'📘', title:'', author:'', type:'book', status:'', current:0, total:0 };
    _viewingLibItem = item;

    document.getElementById('lbl-lv-emoji').innerText = item.emoji || '📘';
    document.getElementById('lbl-lv-title').innerText = item.title || '';
    document.getElementById('lbl-lv-author').innerText = item.author || '';

    const pct = item.total > 0 ? Math.round((item.current / item.total) * 100) : 0;
    const isBook = item.type === 'book';
    const progressColor = isBook ? 'bg-cyan-400 shadow-[0_0_10px_rgba(136,235,255,0.5)]' : 'bg-primary accent-bg shadow-[0_0_10px_rgba(var(--accent-color-rgb),0.4)]';
    const pctColor = isBook ? 'text-cyan-400' : 'text-primary accent-text';
    const unitLabel = isBook ? 'Pág' : 'Aula';
    const statusLabels = { to_do: 'Para Iniciar', in_progress: 'Em Andamento', done: 'Concluído' };
    const statusColors = { to_do: 'text-on-surface-variant/60 border-white/10', in_progress: 'text-blue-400 border-blue-400/20 bg-blue-400/10', done: 'text-green-400 border-green-400/20 bg-green-400/10' };

    const rows = [];
    // Status + Type row
    rows.push(`
        <div class="flex gap-3">
            <div class="flex-1 bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Tipo</span>
                <p class="font-bold text-[var(--text-primary)]">${isBook ? '📖 Livro' : '📚 Curso'}</p>
            </div>
            <div class="flex-1 bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Status</span>
                <span class="inline-block px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusColors[item.status] || ''}">${statusLabels[item.status] || '—'}</span>
            </div>
        </div>`);
    // Progress
    rows.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-5 border border-white/5 space-y-3">
            <div class="flex justify-between items-center">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Progresso</span>
                <span class="font-extrabold text-sm ${pctColor}">${pct}%</span>
            </div>
            <div class="h-2.5 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
                <div class="h-full ${progressColor} rounded-full transition-all" style="width:${pct}%"></div>
            </div>
            <p class="text-xs font-bold text-on-surface-variant">${unitLabel} ${item.current} de ${item.total}</p>
        </div>`);
    // Genre
    if (item.genre) rows.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gênero</span>
            <p class="font-bold text-[var(--text-primary)]">${item.genre}</p>
        </div>`);
    // Rating
    if (item.rating) rows.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Sua Nota</span>
            <span class="text-xl tracking-wide">${'⭐'.repeat(item.rating)}${'<span class="grayscale opacity-30">⭐</span>'.repeat(5 - item.rating)}</span>
        </div>`);
    // Review
    if (item.review) rows.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-2">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Suas Notas</span>
            <p class="text-[var(--text-primary)] text-sm leading-relaxed">${item.review}</p>
        </div>`);

    document.getElementById('library-view-content').innerHTML = rows.join('');

    const modal = document.getElementById('library-view-modal');
    const overlay = document.getElementById('library-view-overlay');
    const sheet = document.getElementById('library-view-sheet');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });
};

window.closeLibraryView = () => {
    const modal = document.getElementById('library-view-modal');
    const overlay = document.getElementById('library-view-overlay');
    const sheet = document.getElementById('library-view-sheet');
    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 500);
};

window.openLibraryEditFromView = () => {
    const item = _viewingLibItem;
    window.closeLibraryView();
    setTimeout(() => {
        window.openLibraryForm(item?.id, item);
    }, 200);
};

// --- LIBRARY LIST MODAL ---

window.openLibraryModal = (initialFilter) => {
    const el = document.getElementById('library-modal');
    const overlay = document.getElementById('library-modal-overlay');
    const sheet = document.getElementById('library-modal-sheet');

    el.classList.remove('hidden');
    el.classList.add('flex');
    
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });

    // Apply initial filter
    window.filterLibrary(initialFilter || 'all');
};

window.closeLibraryModal = () => {
    const el = document.getElementById('library-modal');
    const overlay = document.getElementById('library-modal-overlay');
    const sheet = document.getElementById('library-modal-sheet');

    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }, 500);
};

window.filterLibrary = (filter) => {
    // Update tab buttons
    document.querySelectorAll('.lib-filter-btn').forEach(btn => {
        btn.classList.remove('bg-primary/20', 'text-primary', 'border', 'border-primary/30');
        btn.classList.add('bg-surface-highest', 'text-on-surface-variant', 'border', 'border-white/10');
    });
    const activeBtn = document.querySelector(`.lib-filter-btn[data-filter="${filter}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-surface-highest', 'text-on-surface-variant', 'border-white/10');
        activeBtn.classList.add('bg-primary/20', 'text-primary', 'border-primary/30');
    }
    // Filter list items
    document.querySelectorAll('#library-modal-list > [data-lib-type]').forEach(el => {
        if (filter === 'all' || el.dataset.libType === filter) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
};

window.openLibraryForm = (id = null, itemData = null) => {
    const el = document.getElementById('library-form-modal');
    const overlay = document.getElementById('library-form-overlay');
    const sheet = document.getElementById('library-form-sheet');
    const title = document.getElementById('lbl-lib-form-title');
    const btnDel = document.getElementById('btn-lib-delete');

    // Default to 'course' UI state
    window.setLibraryType('course');
    window.setLibraryRating(0);
    
    const progBtn = document.querySelector('.lib-status-btn[data-val="in_progress"]');
    if (progBtn) window.setLibraryStatus(progBtn);

    if (id && itemData) {
        // EDIT mode with real data from view
        window._editingLibId = id;
        title.innerText = 'Editar Obra';
        btnDel.classList.remove('hidden');

        document.getElementById('lib-emoji').value = itemData.emoji || '';
        document.getElementById('lib-title').value = itemData.title || '';
        document.getElementById('lib-author').value = itemData.author || '';
        document.getElementById('lib-current').value = itemData.current || '';
        document.getElementById('lib-total').value = itemData.total || '';
        document.getElementById('lib-genre').value = itemData.genre || '';
        document.getElementById('lib-review').value = itemData.review || '';

        window.setLibraryType(itemData.type === 'book' ? 'book' : 'course');
        window.setLibraryRating(itemData.rating || 0);

        if (itemData.status) {
            const statusBtn = document.querySelector(`.lib-status-btn[data-val="${itemData.status}"]`);
            if (statusBtn) window.setLibraryStatus(statusBtn);
        }
    } else {
        window._editingLibId = null;
        title.innerText = 'Nova Obra';
        btnDel.classList.add('hidden');
        document.querySelectorAll('#library-form-sheet input, #library-form-sheet textarea').forEach(inp => inp.value = '');
    }

    el.classList.remove('hidden');
    el.classList.add('flex');
    
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });
};

window.closeLibraryForm = () => {
    const el = document.getElementById('library-form-modal');
    const overlay = document.getElementById('library-form-overlay');
    const sheet = document.getElementById('library-form-sheet');

    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }, 300);
};

window.setLibraryType = (type) => {
    const btnCourse = document.getElementById('btn-type-course');
    const btnBook = document.getElementById('btn-type-book');

    if (type === 'course') {
        btnCourse.classList.add('bg-primary/20', 'text-primary', 'accent-text');
        btnCourse.classList.remove('text-on-surface-variant', 'bg-transparent', 'hover:bg-white/5');
        btnBook.classList.remove('bg-primary/20', 'text-primary', 'accent-text');
        btnBook.classList.add('text-on-surface-variant', 'bg-transparent', 'hover:bg-white/5');
    } else {
        btnBook.classList.add('bg-primary/20', 'text-primary', 'accent-text');
        btnBook.classList.remove('text-on-surface-variant', 'bg-transparent', 'hover:bg-white/5');
        btnCourse.classList.remove('bg-primary/20', 'text-primary', 'accent-text');
        btnCourse.classList.add('text-on-surface-variant', 'bg-transparent', 'hover:bg-white/5');
    }
};

window.setLibraryStatus = (element) => {
    // Reset all status buttons
    document.querySelectorAll('.lib-status-btn').forEach(btn => {
        // Clear all colored borders and bg overrides
        btn.classList.remove('border-blue-400', 'bg-blue-400/20', 'text-blue-400', 'border-primary', 'bg-primary/20', 'text-primary', 'accent-text', 'accent-border');
        btn.classList.add('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    });

    const val = element.getAttribute('data-val');
    element.classList.remove('border-white/10', 'bg-surface-highest', 'text-on-surface-variant');
    
    if (val === 'in_progress') {
        element.classList.add('border-blue-400', 'bg-blue-400/20', 'text-blue-400');
    } else if (val === 'done') {
        element.classList.add('border-primary', 'bg-primary/20', 'text-primary', 'accent-text', 'accent-border'); // Green
    } else {
        element.classList.add('text-white', 'border-white/50'); // to_do is highlighted white when selected
    }
};

window.setLibraryRating = (score) => {
    const stars = document.querySelectorAll('.lib-star');
    stars.forEach((star, index) => {
        if (index < score) {
            star.classList.remove('grayscale', 'opacity-30');
            star.classList.add('filter-none', 'opacity-100');
        } else {
            star.classList.add('grayscale', 'opacity-30');
            star.classList.remove('filter-none', 'opacity-100');
        }
    });
};

window.saveLibraryForm = async () => {
    const title = document.getElementById('lib-title').value.trim();
    if (!title) { document.getElementById('lib-title').focus(); return; }

    const isBook = document.getElementById('btn-type-book')?.classList.contains('text-primary');
    const statusBtn = document.querySelector('.lib-status-btn.text-blue-400, .lib-status-btn.text-primary, .lib-status-btn.text-white');
    const stars = document.querySelectorAll('.lib-star');
    let rating = 0;
    stars.forEach((s, i) => { if (!s.classList.contains('grayscale')) rating = i + 1; });

    const item = {
        id: window._editingLibId || Date.now().toString(),
        emoji: document.getElementById('lib-emoji').value || (isBook ? '📘' : '🎓'),
        title,
        author: document.getElementById('lib-author').value.trim(),
        type: isBook ? 'book' : 'course',
        status: statusBtn?.dataset.val || 'to_do',
        current: parseInt(document.getElementById('lib-current').value) || 0,
        total: parseInt(document.getElementById('lib-total').value) || 0,
        genre: document.getElementById('lib-genre').value.trim(),
        rating,
        review: document.getElementById('lib-review').value.trim()
    };

    await DB.saveLibraryItem(item);
    window.closeLibraryForm();
    setTimeout(() => renderDashboard(), 400);
};

window.deleteLibraryItem = async () => {
    if (window._editingLibId && confirm('Tem certeza que deseja excluir esta obra?')) {
        await DB.deleteLibraryItem(window._editingLibId);
        window.closeLibraryForm();
        setTimeout(() => renderDashboard(), 400);
    }
};

window.setWaterInput = async (liters) => {
    await DB.updateDailyMetrics('water', liters);
    for (let i = 1; i <= 5; i++) {
        const drop = document.getElementById(`water-drop-${i}`);
        if(drop) {
            if (i <= liters) {
                drop.classList.remove('grayscale', 'opacity-30');
                drop.classList.add('drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]', 'filter-none');
            } else {
                drop.classList.add('grayscale', 'opacity-30');
                drop.classList.remove('drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]', 'filter-none');
            }
        }
    }
};

window.selectChip = (element, groupClass, silent = false) => {
    // Map button text to DB values
    const moodValues = { 'Nervoso': 'nervoso', 'Feliz': 'feliz', 'Produtivo': 'produtivo', 'Normal': 'normal', 'Ansioso': 'ansioso', 'Cansado': 'cansado', 'Triste': 'triste' };
    const sleepValues = { 'Perfeito': 'perfeito', 'Muito bom': 'muito_bom', 'Bom': 'bom', 'Mais ou menos': 'mais_ou_menos', 'Ruim': 'ruim' };

    // Reset all buttons in this specific group to inactive state
    document.querySelectorAll(`.${groupClass}`).forEach(btn => {
        const activeClasses = btn.getAttribute('data-active-class').split(' ');
        btn.classList.remove(...activeClasses, 'opacity-100');
        btn.classList.add('border-transparent', 'bg-surface-highest', 'text-on-surface-variant', 'opacity-60');
    });

    // Activate the clicked button
    const activeClasses = element.getAttribute('data-active-class').split(' ');
    element.classList.remove('border-transparent', 'bg-surface-highest', 'text-on-surface-variant', 'opacity-60');
    element.classList.add(...activeClasses, 'opacity-100');

    // Save to DB (unless silent pre-selection)
    if (!silent) {
        const text = element.textContent.trim();
        if (groupClass === 'mood-btn' && moodValues[text]) {
            DB.updateDailyMetrics('mood', moodValues[text]);
            recalculateProgress();
        } else if (groupClass === 'sleep-btn' && sleepValues[text]) {
            DB.updateDailyMetrics('sleep', sleepValues[text]);
            recalculateProgress();
        }
    }
};

window.toggleHabit = async (habitId, isCompleted) => {
    const restBtn = document.getElementById('rest-day-toggle-checkin');
    if (restBtn?.dataset.active === 'true') {
        alert('Dia de descanso ativo. Desative para editar hábitos.');
        return;
    }

    await DB.updateHabit(habitId, isCompleted);
    recalculateProgress();
    
    // Visual DOM update for the habit row
    const txt = document.getElementById(`txt-${habitId}`);
    const circle = document.getElementById(`circle-${habitId}`);
    
    if (txt && circle) {
        if (isCompleted) {
            txt.classList.add('line-through', 'text-on-surface-variant', 'opacity-50');
            txt.classList.remove('text-[var(--text-primary)]');
            
            circle.classList.add('border-primary', 'accent-border', 'bg-primary', 'accent-bg');
            circle.classList.remove('border-on-surface-variant/30', 'group-hover/habit:border-on-surface-variant/50');
            circle.innerHTML = `<span class="material-symbols-outlined text-black mix-blend-color-burn" style="font-size: 16px; font-variation-settings: 'FILL' 1;">check</span>`;
            
            circle.parentElement.setAttribute('onclick', `window.toggleHabit('${habitId}', false)`);
        } else {
            txt.classList.remove('line-through', 'text-on-surface-variant', 'opacity-50');
            txt.classList.add('text-[var(--text-primary)]');
            
            circle.classList.remove('border-primary', 'accent-border', 'bg-primary', 'accent-bg');
            circle.classList.add('border-on-surface-variant/30', 'group-hover/habit:border-on-surface-variant/50');
            circle.innerHTML = "";
            
            circle.parentElement.setAttribute('onclick', `window.toggleHabit('${habitId}', true)`);
        }
    }
};

window.setQualitative = async (type, value) => {
    await DB.updateDailyMetrics(type, value);
    recalculateProgress();
    renderDashboard();
};

window.updateWater = async (diff) => {
    const todayLog = await DB.getTodayLog();
    const newCount = Math.max(0, (todayLog.water || 0) + diff);
    await DB.updateDailyMetrics('water', newCount);
    
    const lbl = document.getElementById('lbl-water');
    if (lbl) lbl.innerText = `${newCount.toFixed(1)} L`;
    recalculateProgress();
};

window.toggleRestDay = async (forceValue = null, silent = false) => {
    const btn = document.getElementById('rest-day-toggle-checkin');
    const badge = document.getElementById('rest-day-badge-checkin');
    const habitsSection = document.getElementById('checkin-habits-section');
    if (!btn || !badge || !habitsSection) return;

    const current = btn.dataset.active === 'true';
    const next = forceValue === null ? !current : !!forceValue;
    btn.dataset.active = String(next);

    if (next) {
        btn.classList.add('bg-amber-400/20', 'border-amber-300/40', 'text-amber-200');
        btn.classList.remove('bg-surface-highest', 'border-white/10', 'text-on-surface-variant');
        badge.classList.remove('hidden');
        habitsSection.classList.add('opacity-40');
    } else {
        btn.classList.remove('bg-amber-400/20', 'border-amber-300/40', 'text-amber-200');
        btn.classList.add('bg-surface-highest', 'border-white/10', 'text-on-surface-variant');
        badge.classList.add('hidden');
        habitsSection.classList.remove('opacity-40');
    }

    if (!silent) {
        await DB.updateDailyMetrics('rest_day', next);
        await recalculateProgress();
    }
};

async function recalculateProgress() {
    const todayLog = await DB.getTodayLog();
    let habitsCompleted = 0;
    
    if (!todayLog.habits) todayLog.habits = {};
    for (const habit of ALL_HABITS) {
        if (todayLog.habits[habit.id]) {
            habitsCompleted++;
        }
    }

    const tota = ALL_HABITS.length;
    const isRestDay = !!todayLog.rest_day;
    const progressW = isRestDay ? 100 : (habitsCompleted / tota) * 100;
    
    const lblHabitCounter = document.getElementById('lbl-habit-counter');
    if (lblHabitCounter) lblHabitCounter.innerText = isRestDay ? 'Descanso' : `${habitsCompleted}/${tota}`;
    
    const internalBar = document.getElementById('checkin-internal-bar');
    if (internalBar) internalBar.style.width = `${progressW}%`;
    
    const pctText = document.getElementById('checkin-pct-text');
    if (pctText) pctText.innerText = `${Math.round(progressW)}%`;
    
    const container = document.getElementById('checkin-container');

    if (isRestDay || habitsCompleted === tota) {
        if (container) {
            container.classList.remove('border-transparent');
            container.classList.add('border', 'border-primary/50', 'accent-border', 'shadow-[0_0_20px_var(--accent-color)]', 'accent-glow');
        }
    } else {
        if (container) {
            container.classList.add('border-transparent');
            container.classList.remove('border', 'border-primary/50', 'accent-border', 'shadow-[0_0_20px_var(--accent-color)]', 'accent-glow');
        }
    }

    // REACTIVE SNAP UPDATE: Update the "Today" ring in the background snap card
    const snapCircle = document.getElementById('snap-ring-today-circle');
    const snapText = document.getElementById('snap-ring-today-text');
    const snapContainer = document.getElementById('snap-ring-today-container');

    if (snapCircle && snapText && snapContainer) {
        const pct = Math.round(progressW);
        const circumference = 2 * Math.PI * 16;
        const offset = circumference - (progressW / 100) * circumference;
        
        if (isRestDay) {
            snapContainer.style.boxShadow = '0 0 15px rgba(251,191,36,0.45)';
            snapContainer.querySelector('svg').innerHTML = `<circle cx="20" cy="20" r="16" fill="#fbbf24" stroke="transparent" />`;
            snapText.innerHTML = `<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">hotel</span>`;
        } else if (pct === 100) {
            // Perfect day!
            snapContainer.style.boxShadow = '0 0 15px var(--accent-color)';
            snapContainer.querySelector('svg').innerHTML = `<circle cx="20" cy="20" r="16" fill="var(--accent-color)" stroke="transparent" class="accent-bg" />`;
            snapText.innerHTML = `<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">local_fire_department</span>`;
        } else {
            // Partial progress
            snapContainer.style.boxShadow = 'none';
            snapCircle.style.strokeDashoffset = offset;
            snapText.innerHTML = `<span class="text-[9px] font-extrabold tracking-tight text-on-surface-variant">${pct}%</span>`;
        }
    }
}

window.openFinanceModal = () => {
    // Financeiro em modo futuro: sem acao por enquanto.
};

window.closeFinanceModal = () => {
    // Financeiro em modo futuro: sem acao por enquanto.
};
