export function getPlannerHTML({
    calendarData,
    historyDays,
    metrics,
    kanbanData,
    habitCatalog = [],
    habitFilterMonthLabel = '',
    fullHistoryRows = [],
    fullHistoryMonths = [],
    fullHistoryCurrentMonthKey = ''
}) {
    // Mood/Sleep visual config (Matches Check-in for UI consistency)
    const moodConfigs = {
        "nervoso": { label: "Nervoso", classes: "border-red-500 bg-red-500/20 text-red-500" },
        "feliz": { label: "Feliz", classes: "border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]" },
        "produtivo": { label: "Produtivo", classes: "border-cyan-400 bg-cyan-400/20 text-cyan-400" },
        "normal": { label: "Normal", classes: "border-white/50 bg-white/10 text-white" },
        "ansioso": { label: "Ansioso", classes: "border-orange-400 bg-orange-400/20 text-orange-400" },
        "cansado": { label: "Cansado", classes: "border-purple-400 bg-purple-400/20 text-purple-400" },
        "triste": { label: "Triste", classes: "border-blue-400 bg-blue-400/20 text-blue-400" }
    };
    const sleepConfigs = {
        "perfeito": { label: "Perfeito", classes: "border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.2)]" },
        "muito_bom": { label: "Muito bom", classes: "border-blue-400 bg-blue-400/20 text-blue-400" },
        "bom": { label: "Bom", classes: "border-cyan-400 bg-cyan-400/20 text-cyan-400" },
        "mais_ou_menos": { label: "Mais ou menos", classes: "border-orange-400 bg-orange-400/20 text-orange-400" },
        "ruim": { label: "Ruim", classes: "border-red-500 bg-red-500/20 text-red-500" }
    };

    const getMoodChip = (moodKey) => {
        if (!moodKey || !moodConfigs[moodKey]) return `<span class="text-xs font-bold text-on-surface-variant/60">—</span>`;
        const c = moodConfigs[moodKey];
        return `<span class="inline-flex items-center justify-center px-2.5 py-1 rounded-xl border text-[10px] font-bold ${c.classes}">${c.label}</span>`;
    };

    const getSleepChip = (sleepKey) => {
        if (!sleepKey || !sleepConfigs[sleepKey]) return `<span class="text-xs font-bold text-on-surface-variant/60">—</span>`;
        const c = sleepConfigs[sleepKey];
        return `<span class="inline-flex items-center justify-center px-2.5 py-1 rounded-xl border text-[10px] font-bold ${c.classes}">${c.label}</span>`;
    };

    const getWeekdayName = (rawDate) => {
        if (!rawDate) return '';
        const dt = new Date(`${rawDate}T00:00:00`);
        if (Number.isNaN(dt.getTime())) return '';
        return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(dt);
    };

    const getDiaryTableRow = (day, withMonthKey = false) => `
        <button class="${withMonthKey ? 'history-day-row' : ''} w-full text-left border-b border-white/5 hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors"
                ${withMonthKey ? `data-month-key="${day.monthKey || ''}"` : ''}
                onclick="window.openDailyDetail('${day.rawDate}')">
            <div class="grid items-center gap-3 px-3 py-3" style="grid-template-columns: 140px 130px 110px 95px 120px 95px 80px;">
                <div class="flex items-center gap-2 leading-none">
                    <span class="text-sm font-extrabold text-[var(--text-primary)]">${day.date}</span>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/65">${getWeekdayName(day.rawDate)}</span>
                </div>

                <div>
                    <div class="h-2 w-full bg-surface-highest rounded-full overflow-hidden border border-white/5">
                        <div class="h-full ${day.restDay ? 'bg-amber-300' : 'bg-primary accent-bg'}" style="width: ${day.pct}%"></div>
                    </div>
                    <div class="text-[10px] font-extrabold ${day.restDay ? 'text-amber-300' : 'text-primary accent-text'} mt-1">${day.restDay ? 'Descanso' : `${day.pct}%`}</div>
                </div>

                <div>${getMoodChip(day.mood)}</div>

                <div class="text-xs font-bold text-[var(--text-primary)]">${day.wake_time || '--:--'}</div>

                <div>${getSleepChip(day.sleep)}</div>

                <div class="text-xs font-bold text-[var(--text-primary)]">${day.instagram || '--:--'}</div>

                <div class="text-xs font-bold text-cyan-300">${Number(day.water || 0)}L</div>
            </div>
        </button>
    `;

    const getHistoryTableRow = (day) => getDiaryTableRow(day, true);

    // Calendar: calculate start-of-month weekday offset for correct alignment
    const now = new Date();
    const firstDayOffset = new Date(now.getFullYear(), now.getMonth(), 1).getDay(); // 0=Sun...6=Sat
    const emptyOffsets = Array.from({ length: firstDayOffset }, () =>
        `<div class="aspect-square w-full"></div>`
    ).join('');

    const calendarGridHTML = emptyOffsets + calendarData.map(d => {
        const isToday = d.day === now.getDate();
        const canOpen = !d.isFuture;
        const isPerfectDay = d.level === 3 && d.pct === 100;
        let levelClasses = '';
        switch(d.level) {
            case 0: levelClasses = 'bg-white/[0.04]'; break;
            case 1: levelClasses = 'bg-primary/25 opacity-50'; break;
            case 2: levelClasses = 'bg-primary/55 opacity-90 shadow-[0_0_6px_var(--accent-color)]'; break;
            case 3: levelClasses = isPerfectDay
                ? 'bg-primary accent-bg ring-1 ring-white/65 shadow-[0_0_20px_var(--accent-color)]'
                : 'bg-primary/70 border border-primary/45 shadow-[0_0_6px_var(--accent-color)]';
                break;
            case 4: levelClasses = 'bg-amber-200/70 border border-amber-200/35'; break;
        }
        const todayRing = isToday ? 'ring-2 ring-primary/80 accent-border scale-105' : '';
        const textColor = d.level === 4 ? 'text-amber-900/70' : isPerfectDay ? 'text-black/85' : d.level === 3 ? 'text-white/90' : d.level >= 2 ? 'text-white/70' : 'text-white/25';
        const perfectMarker = isPerfectDay ? '<span class="absolute top-1 right-1 material-symbols-outlined text-[10px] text-black/75" style="font-variation-settings: \'FILL\' 1;">auto_awesome</span>' : '';
        const interactions = canOpen ? 'cursor-pointer hover:scale-110 hover:brightness-125' : 'cursor-default';
        const clickHandler = canOpen ? `onclick="window.openDailyDetail('${d.rawDate}')"` : '';
        return `<div title="Dia ${d.day}" ${clickHandler} class="aspect-square w-full rounded-lg ${levelClasses} ${todayRing} relative flex items-center justify-center text-[9px] font-extrabold ${textColor} select-none transition-all duration-200 ${interactions}">${d.day}${perfectMarker}</div>`;
    }).join('');

    const initialRows = historyDays.slice(0, 6).map(day => getDiaryTableRow(day, false)).join('');

    return `
        <div class="space-y-6 pb-12 font-headline animate-[fade-in_0.4s_ease-out]">

            <!-- Calendário e Métricas Integradas -->
            <section class="bg-surface-container-low rounded-[40px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 blur-[100px] -mr-36 -mt-36 opacity-30 pointer-events-none"></div>

                <!-- Header da Seção -->
                <div class="flex items-center justify-between mb-5 px-1">
                    <div>
                        <h3 class="text-xl font-extrabold text-[var(--text-primary)] font-headline tracking-tighter leading-none">Consistência</h3>
                        <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 mt-0.5 block">${['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][now.getMonth()]} ${now.getFullYear()}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.openHabitFilterModal()" class="h-8 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-white/10 bg-surface-highest text-[9px] sm:text-[10px] font-extrabold tracking-[0.08em] sm:tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">
                            Filtrar hábitos
                        </button>
                        <div class="w-10 h-10 rounded-2xl bg-primary/10 accent-bg/10 flex items-center justify-center">
                            <span class="material-symbols-outlined text-primary accent-text text-xl">calendar_month</span>
                        </div>
                    </div>
                </div>

                <!-- Cabeçalho dias da semana -->
                <div class="grid grid-cols-7 text-[10px] font-bold text-on-surface-variant/30 text-center uppercase tracking-widest mb-2">
                    <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                </div>

                <!-- Grade do Calendário -->
                <div class="grid grid-cols-7 gap-[5px] mb-6">
                    ${calendarGridHTML}
                </div>

                <!-- Legenda de Níveis -->
                <div class="flex items-center gap-2 mb-6 px-1">
                    <span class="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Nada</span>
                    <div class="flex gap-1 items-center">
                        <div class="w-4 h-4 rounded-sm bg-white/[0.04]"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary/25 opacity-50"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary/55 opacity-90"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary/70 border border-primary/45"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary accent-bg ring-1 ring-white/70 relative"><span class="material-symbols-outlined text-[8px] text-black/75 absolute inset-0 flex items-center justify-center" style="font-variation-settings: 'FILL' 1;">auto_awesome</span></div>
                        <div class="w-4 h-4 rounded-sm bg-amber-300"></div>
                    </div>
                    <span class="text-[9px] font-bold text-white/60 uppercase tracking-widest">67-99%</span>
                    <span class="text-[9px] font-bold text-primary accent-text uppercase tracking-widest">100%</span>
                    <span class="text-[9px] font-bold text-amber-300 uppercase tracking-widest">Descanso</span>
                </div>

                <!-- Divisória elegante -->
                <div class="h-px w-full bg-white/5 mb-5"></div>

                <!-- Métricas Integradas -->
                <div class="space-y-3 relative z-10">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 text-center">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest mb-1.5 block">Perfeitos</span>
                            <div class="text-2xl font-extrabold tracking-tighter text-emerald-300 font-headline leading-none">${metrics.perfectDays}</div>
                            <div class="text-[9px] text-on-surface-variant/40 font-bold mt-0.5">dias</div>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-3 flex flex-col items-center justify-center border border-white/5 text-center gap-1.5">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest block">Sono</span>
                            <span class="px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${(sleepConfigs[metrics.avgSleep] || { classes: 'border-white/20 bg-white/5 text-on-surface-variant/50' }).classes}">${(sleepConfigs[metrics.avgSleep] || { label: metrics.avgSleep || '—' }).label}</span>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-3 flex flex-col items-center justify-center border border-white/5 text-center gap-1.5">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest block">Humor</span>
                            <span class="px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${(moodConfigs[metrics.avgMood] || { classes: 'border-white/20 bg-white/5 text-on-surface-variant/50' }).classes}">${(moodConfigs[metrics.avgMood] || { label: metrics.avgMood || '—' }).label}</span>
                        </div>
                    </div>

                    <!-- Financeiro -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 flex items-center justify-between">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gasto Dia a Dia</span>
                                <div class="text-base font-extrabold tracking-tighter text-red-500 font-headline leading-none">R$ ${metrics.totalGastoDia.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                            </div>
                            <span class="material-symbols-outlined text-red-500/25 text-2xl">payments</span>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 flex items-center justify-between">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gasto Meu Dinheiro</span>
                                <div class="text-base font-extrabold tracking-tighter text-red-400 font-headline leading-none">R$ ${metrics.totalGastoDinheiro.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                            </div>
                            <span class="material-symbols-outlined text-red-400/25 text-2xl">account_balance_wallet</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Diário de Bordo Compacto -->
            <section class="space-y-4">
                <div class="flex justify-between items-center px-1">
                    <h3 class="text-xl font-extrabold text-[var(--text-primary)] font-headline tracking-tighter leading-none">Diário de <span class="text-on-surface-variant">Bordo</span></h3>
                    <span class="text-[10px] text-cyan-300 font-bold uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">Abril</span>
                </div>
                
                <div class="bg-surface-container-low rounded-[32px] p-2 border border-white/5 flex flex-col">
                    <div class="overflow-x-auto rounded-2xl border border-white/5" style="scrollbar-width:none;">
                        <div class="min-w-[760px] bg-surface-container-low/70 backdrop-blur">
                            <div class="grid items-center gap-3 px-3 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70" style="grid-template-columns: 140px 130px 110px 95px 120px 95px 80px;">
                                <span>Data</span>
                                <span>Progresso</span>
                                <span>Humor</span>
                                <span>Acordou</span>
                                <span>Sono</span>
                                <span>Instagram</span>
                                <span>Água</span>
                            </div>
                            ${initialRows}
                        </div>
                    </div>
                    <button class="w-full py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors flex items-center justify-center gap-2" onclick="window.openFullHistory()">
                        Ver Tudo <span class="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                </div>
            </section>

            <!-- Kanban Cérebro -->
            <section class="space-y-4 pt-6">
                 <div class="flex justify-between items-end px-2 mb-2">
                    <h3 class="text-xl font-extrabold text-[var(--text-primary)] font-headline tracking-tighter leading-none">Brain <span class="text-on-surface-variant">Kanban</span></h3>
                    <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant border border-white/5 hover:text-emerald-300 active:scale-90 transition-all" onclick="window.openKanbanForm()">
                        <span class="material-symbols-outlined text-lg font-bold">add</span>
                    </button>
                 </div>
                 <div class="flex items-start gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-6 pt-2 snap-x" style="scrollbar-width: none;">
                    ${(() => {
                        const typeColors = {
                            estudo: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                            hobbie: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
                            crescimento: 'text-green-400 bg-green-400/10 border-green-400/20',
                            trabalho: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
                            saude: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
                            outro: 'text-on-surface-variant bg-white/5 border-white/10'
                        };
                        
                        const renderCard = (item) => {
                            const tColor = typeColors[item.type] || typeColors.outro;
                            return `
                    <div class="kanban-card flex-none p-4 bg-surface-container rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.3)] border border-white/5 cursor-pointer hover:bg-surface-highest hover:border-white/10 transition-all relative overflow-hidden group" draggable="true" data-card-id="${item.id}" onclick="window.openKanbanView('${item.id}')" ondragstart="event.stopPropagation()" >
                                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/40 accent-bg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div class="flex items-start justify-between mb-2">
                                    <span class="text-2xl leading-none filter drop-shadow-sm">${item.emoji || '🎯'}</span>
                                    ${item.type ? `<span class="text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${tColor}">${item.type}</span>` : ''}
                                </div>
                                <p class="text-[var(--text-primary)] font-bold text-[14px] leading-snug mb-1">${item.title}</p>
                                ${item.objective ? `<p class="text-on-surface-variant/50 text-[11px] leading-snug line-clamp-2">${item.objective}</p>` : ''}
                            </div>`;
                        };

                        const generateKanbanCol = (id, title, icon, items) => `
                        <div class="flex-shrink-0 self-start w-[290px] flex flex-col gap-3">
                            <h4 class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pl-4 flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm opacity-40">${icon}</span>
                                ${title} <span class="w-1 h-1 bg-white/20 rounded-full"></span> <span class="text-primary">${items.length}</span>
                            </h4>
                            <div class="kanban-column h-auto bg-surface-container-low/50 backdrop-blur rounded-[32px] p-4 min-h-[350px] border border-white/5 space-y-3 shadow-inner" data-column="${id}">
                                ${items.map(item => renderCard(item)).join('')}
                                ${items.length === 0 ? '<div class="kanban-empty-state h-full flex items-center justify-center opacity-20 flex-col gap-2 mt-20"><span class="material-symbols-outlined text-4xl">inbox</span><p class="text-[10px] uppercase font-bold tracking-widest">Nada por aqui</p></div>' : ''}
                            </div>
                        </div>`;
                        
                        return `
                            ${generateKanbanCol('ideas', 'A Fazer', 'lightbulb', kanbanData.ideas || [])}
                            ${generateKanbanCol('doing', 'Em Progresso', 'pending', kanbanData.doing || [])}
                            ${generateKanbanCol('done', 'Concluído', 'check_circle', kanbanData.done || [])}
                        `;
                    })()}
                 </div>
            </section>
        </div>

        <!-- Kanban VIEW Modal (click card) -->
        <div id="kanban-view-modal" class="fixed inset-0 z-[600] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="kanban-view-overlay" onclick="window.closeKanbanView()"></div>
            <div class="relative w-full h-[80vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="kanban-view-sheet">
                <!-- Handle + Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl" id="lbl-kv-emoji">🎯</span>
                            <div>
                                <h2 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-tight" id="lbl-kv-title">Título</h2>
                                <span id="lbl-kv-type" class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60"></span>
                            </div>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeKanbanView()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>
                <!-- Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-28 space-y-4 hide-scrollbar" id="kanban-view-content"></div>
                <!-- Footer -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-[0_10px_30px_rgba(var(--accent-color-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2" onclick="window.openKanbanEditFromView()">
                        <span class="material-symbols-outlined">edit</span> Editar Card
                    </button>
                </div>
            </div>
        </div>

        <!-- Kanban CRUD Form Modal -->
        <div id="kanban-form-modal" class="fixed inset-0 z-[700] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="kanban-form-overlay" onclick="window.closeKanbanForm()"></div>
            
            <div class="relative w-full h-[90vh] bg-surface-container rounded-t-[40px] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)] transform translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="kanban-form-sheet">
                
                <!-- Header -->
                <div class="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-surface-container/50 backdrop-blur top-0 z-10 sticky rounded-t-[40px]">
                    <h3 class="font-extrabold text-xl text-[var(--text-primary)] font-headline" id="lbl-kanban-form-title">Novo Card</h3>
                    <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeKanbanForm()">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <!-- Scrollable Form -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-6 hide-scrollbar">
                    
                    <!-- Emoji + Título -->
                    <div class="flex gap-4">
                        <div class="bg-surface-highest rounded-[24px] w-20 flex flex-col items-center justify-center border border-white/5 p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ícone</span>
                            <input type="text" id="kanban-emoji" placeholder="🎯" maxlength="2" class="w-full bg-transparent text-center text-4xl p-0 border-none focus:ring-0">
                        </div>
                        <div class="flex-1 bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors flex flex-col justify-center">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Título</span>
                            <input type="text" id="kanban-title" placeholder="Ex: Aprender Node.js" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-lg p-0 focus:ring-0">
                        </div>
                    </div>

                    <!-- Tipo / Área -->
                    <div class="space-y-2">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block px-2">Área</span>
                        <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="estudo" onclick="window.setKanbanType(this)">📚 Estudo</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="hobbie" onclick="window.setKanbanType(this)">🎮 Hobbie</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="crescimento" onclick="window.setKanbanType(this)">🌱 Crescimento</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="trabalho" onclick="window.setKanbanType(this)">💼 Trabalho</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="saude" onclick="window.setKanbanType(this)">🏋️ Saúde</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="outro" onclick="window.setKanbanType(this)">📌 Outro</button>
                        </div>
                    </div>

                    <!-- Progresso (coluna do kanban) -->
                    <div class="space-y-2">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block px-2">Progresso</span>
                        <div class="flex gap-2 pb-1 -mx-2 px-2">
                            <button class="kanban-progress-btn flex-1 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all active:scale-95" data-val="ideas" onclick="window.setKanbanProgress(this)">A Iniciar</button>
                            <button class="kanban-progress-btn flex-1 py-3 rounded-2xl border border-blue-400 bg-blue-400/20 text-blue-400 text-sm font-bold transition-all active:scale-95" data-val="doing" onclick="window.setKanbanProgress(this)">Em Progresso</button>
                            <button class="kanban-progress-btn flex-1 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all active:scale-95" data-val="done" onclick="window.setKanbanProgress(this)">Feito</button>
                        </div>
                    </div>

                    <!-- Datas -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-surface-highest rounded-[24px] p-4 border border-white/5 space-y-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Início</span>
                            <input type="date" id="kanban-start" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0" style="color-scheme: dark;">
                        </div>
                        <div class="bg-surface-highest rounded-[24px] p-4 border border-white/5 space-y-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Término</span>
                            <input type="date" id="kanban-end" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0" style="color-scheme: dark;">
                        </div>
                    </div>

                    <!-- Objetivo -->
                    <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Objetivo</span>
                        <input type="text" id="kanban-objective" placeholder="O que você quer alcançar?" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0">
                    </div>

                    <!-- Descrição -->
                    <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-2">Descrição</span>
                        <textarea id="kanban-description" placeholder="Detalhe o card: etapas, links, anotações..." class="w-full bg-transparent border-none text-[var(--text-primary)] text-sm p-0 focus:ring-0 resize-none min-h-[120px] leading-relaxed"></textarea>
                    </div>

                </div>

                <!-- Footer -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container via-surface-container to-transparent flex gap-4" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-16 h-16 rounded-[24px] bg-red-500/10 text-red-500 font-extrabold flex items-center justify-center border border-red-500/20 active:scale-95 transition-transform hidden" id="btn-kanban-delete" onclick="window.deleteKanbanCard()">
                        <span class="material-symbols-outlined">delete_forever</span>
                    </button>
                    <button class="flex-1 h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-xl active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2" onclick="window.saveKanbanForm()">
                        <span class="material-symbols-outlined">save</span> Salvar Card
                    </button>
                </div>
            </div>
        </div>

        <!-- Daily Detail Modal -->
        <div id="day-detail-modal" class="fixed inset-0 z-[500] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="day-detail-overlay" onclick="window.closeDailyDetail()"></div>
            <div class="relative w-full h-[95vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="day-detail-sheet">
                <!-- Header — igual ao check-in -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <h2 class="text-3xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none" id="lbl-day-title">15 ABR</h2>
                            <span id="lbl-day-pct" class="text-[12px] font-bold tracking-widest uppercase text-primary accent-text mt-1">100% Concluído</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeDailyDetail()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>
                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-12 space-y-10 hide-scrollbar" id="day-detail-content">
                    <!-- Dinamicamente preenchido -->
                </div>
            </div>
        </div>

        <!-- Full History Modal -->
        <div id="full-history-modal" class="fixed inset-0 z-[400] hidden flex-col">
            <div class="relative w-full h-full bg-surface-container-low flex flex-col pt-10 transform scale-95 opacity-0 transition-all duration-300" id="full-history-sheet">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant" onclick="window.closeFullHistory()">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h3 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline">Histórico Completo</h3>
                    </div>
                </div>
                <!-- Filter bar -->
                <div class="px-8 py-4 flex gap-3 overflow-x-auto hide-scrollbar">
                    ${(fullHistoryMonths || []).map(m => {
                        const active = m.key === fullHistoryCurrentMonthKey;
                        return `<button
                            class="history-month-btn px-5 py-2 rounded-2xl border font-bold text-xs transition-colors ${active ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-on-surface-variant border-transparent hover:bg-white/10'}"
                            data-month-key="${m.key}"
                            onclick="window.filterFullHistoryMonth('${m.key}')">
                            ${m.label} <span class="opacity-70">(${m.count})</span>
                        </button>`;
                    }).join('')}
                </div>
                <!-- List -->
                <div class="flex-1 overflow-y-auto px-6 py-2 hide-scrollbar">
                    <div class="overflow-x-auto rounded-2xl border border-white/5" style="scrollbar-width:none;">
                        <div class="min-w-[760px] bg-surface-container-low/70 backdrop-blur">
                            <div class="grid items-center gap-3 px-3 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70" style="grid-template-columns: 140px 130px 110px 95px 120px 95px 80px;">
                                <span>Data</span>
                                <span>Progresso</span>
                                <span>Humor</span>
                                <span>Acordou</span>
                                <span>Sono</span>
                                <span>Instagram</span>
                                <span>Água</span>
                            </div>
                            <div id="full-history-list">
                                ${(fullHistoryRows || []).map(day => getHistoryTableRow(day)).join('')}
                            </div>
                        </div>
                    </div>
                    <div id="full-history-empty" class="hidden text-center py-10 text-on-surface-variant/40 text-sm font-bold">
                        Nenhum dia encontrado para este mês.
                    </div>
                </div>
            </div>
        </div>

        <!-- Habit Filter Calendar Modal -->
        <div id="habit-filter-modal" class="fixed inset-0 z-[450] hidden flex-col justify-end">
            <div id="habit-filter-overlay" class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-400" onclick="window.closeHabitFilterModal()"></div>
            <div id="habit-filter-sheet" class="relative w-full h-[92vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.55)] transform translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h3 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none">Filtro de Hábitos</h3>
                            <span id="habit-filter-month-label" class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 mt-1 block">${habitFilterMonthLabel}</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeHabitFilterModal()">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto px-6 py-6 pb-12 space-y-5 hide-scrollbar">
                    <div class="space-y-3">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/70 px-2 block">Escolha o hábito</span>
                        <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                            ${habitCatalog.map(h => `<button data-habit="${h.id}" onclick="window.setHabitCalendarFilter('${h.id}')" class="habit-filter-chip flex-shrink-0 px-4 py-2.5 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-xs font-bold transition-all hover:bg-white/5">${h.name}</button>`).join('')}
                        </div>
                    </div>

                    <div class="bg-surface-highest/40 rounded-3xl p-4 border border-white/5">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50 block">Hábito selecionado</span>
                        <div class="flex items-center justify-between gap-4 mt-2">
                            <span id="habit-filter-selected-title" class="text-lg font-extrabold text-[var(--text-primary)]">Academia</span>
                            <span id="habit-filter-summary" class="text-[11px] font-bold text-primary accent-text text-right">0 de 0 dias</span>
                        </div>
                    </div>

                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5">
                        <div class="grid grid-cols-7 text-[10px] font-bold text-on-surface-variant/30 text-center uppercase tracking-widest mb-2">
                            <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                        </div>
                        <div id="habit-filter-grid" class="grid grid-cols-7 gap-[5px]"></div>
                    </div>
                    <p class="text-[11px] text-on-surface-variant/60 text-center">
                        Dica: toque em um dia destacado para abrir o Diário de Bordo desse dia.
                    </p>
                </div>
            </div>
        </div>
    `;
}
