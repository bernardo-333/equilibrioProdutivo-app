export function getDashboardHTML({ 
    todayLog, balances, todayPct, missing, isAllDone, weekData, weekProgressPct = 0, DEFAULT_HABITS, snapMessage, libraryItems 
}) {
    const formatCurrency = (value) => Number(value || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Helper: render a library carousel card
    const renderLibCard = (item) => {
        const pct = item.total > 0 ? Math.round((item.current / item.total) * 100) : 0;
        const isBook = item.type === 'book';
        const statusLabels = { to_do: 'Para Iniciar', in_progress: 'Em Andamento', done: 'Concluído' };
        const statusColors = { to_do: 'text-on-surface-variant/60 bg-white/5 border-white/10', in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20', done: 'text-green-400 bg-green-400/10 border-green-400/20' };
        const barColor = isBook ? 'bg-cyan-400 shadow-[0_0_8px_rgba(136,235,255,0.4)]' : 'bg-primary accent-bg shadow-[0_0_8px_rgba(114,254,143,0.4)] accent-glow';
        const pctColor = isBook ? 'text-cyan-400' : 'text-primary accent-text';
        const unitLabel = isBook ? 'Pág' : 'Aula';
        const sc = statusColors[item.status] || statusColors.to_do;
        return `
            <div class="min-w-[240px] bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-5 flex flex-col relative cursor-pointer active:scale-95 transition-transform" onclick="window.openLibraryView('${item.id}')">
                <div class="flex justify-between items-start">
                    <span class="text-3xl">${item.emoji || (isBook ? '📘' : '🎓')}</span>
                    <span class="text-[8px] font-bold ${sc} px-2 py-1 rounded-lg uppercase tracking-widest border">${statusLabels[item.status] || 'Para Iniciar'}</span>
                </div>
                <div>
                    <h4 class="font-bold text-[var(--text-primary)] text-base leading-tight">${item.title}</h4>
                    <span class="text-[10px] text-on-surface-variant/50">${item.author || ''}</span>
                </div>
                <div class="space-y-3 mt-auto">
                    <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div class="h-full ${barColor} rounded-full" style="width:${pct}%"></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-medium text-on-surface-variant">${unitLabel} ${item.current || 0} / ${item.total || 0}</span>
                        <span class="text-[10px] font-extrabold ${pctColor}">${pct}%</span>
                    </div>
                </div>
            </div>`;
    };

    const courses = (libraryItems || []).filter(i => i.type === 'course');
    const books = (libraryItems || []).filter(i => i.type === 'book');
    const emptyCard = (label) => `<div class="min-w-[240px] bg-surface-container rounded-3xl p-5 border border-dashed border-white/10 flex items-center justify-center"><span class="text-sm text-on-surface-variant/30">Nenhum ${label} cadastrado</span></div>`;

    // Helper for generating progress rings
    const generateRing = (dayToken, state, percent, isRestDay = false) => {
        if (state === 'future') {
            // Rule 1: Ghost Rings
            return `
            <div class="flex flex-col items-center gap-2 flex-shrink-0 min-w-[40px]">
                <span class="text-[10px] font-bold text-on-surface-variant">${dayToken}</span>
                <div class="relative w-10 h-10 flex items-center justify-center">
                    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/5" />
                    </svg>
                </div>
            </div>`;
        }

        const c = 100.53; // 2 * pi * 16 (circumference)
        const offset = c - (c * percent) / 100;
        const isPerfect = percent === 100;

        let innerContent = isRestDay
            ? `<span class="material-symbols-outlined text-black opacity-90" style="font-size: 18px; font-variation-settings: 'FILL' 1;">hotel</span>`
            : isPerfect 
            ? `<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">local_fire_department</span>`
            : `<span class="text-[9px] font-extrabold tracking-tight text-on-surface-variant">${percent}%</span>`; 

        const idCircle = state === 'today' ? 'id="snap-ring-today-circle"' : '';
        const idText = state === 'today' ? 'id="snap-ring-today-text"' : '';

        let circleHTML = '';
        if (isRestDay) {
            circleHTML = `<circle cx="20" cy="20" r="16" fill="#fbbf24" stroke="transparent" />`;
        } else if (isPerfect) {
            circleHTML = `<circle cx="20" cy="20" r="16" fill="var(--accent-color)" stroke="transparent" class="accent-bg" />`;
        } else {
            circleHTML = `
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/10" />
                <circle ${idCircle} cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" 
                        class="text-primary accent-text drop-shadow-[0_0_4px_currentColor]" 
                        stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round" />
            `;
        }

        const todayPulse = state === 'today' ? `<div class="absolute inset-0 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] border border-primary/40 accent-border scale-125"></div>` : '';
        const glowStyle = isRestDay
            ? `style="box-shadow: 0 0 15px rgba(251,191,36,0.45);"`
            : (isPerfect ? `style="box-shadow: 0 0 15px var(--accent-color);"` : '');

        return `
        <div class="flex flex-col items-center gap-2 flex-shrink-0 min-w-[40px]">
            <span class="text-[10px] font-bold ${state === 'today' ? 'text-primary accent-text' : 'text-on-surface-variant'}">${dayToken}</span>
            <div class="relative w-10 h-10 flex items-center justify-center rounded-full" ${glowStyle} ${state === 'today' ? 'id="snap-ring-today-container"' : ''}>
                ${todayPulse}
                <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                    ${circleHTML}
                </svg>
                <div class="z-10 flex items-center justify-center" ${idText}>${innerContent}</div>
            </div>
        </div>`;
    };

    return `
        <div class="space-y-8 pb-12">
            <!-- Weekly Snap & Finance Block -->
            <section class="space-y-6">
                <!-- Weekly Snap Card -->
                <div class="relative rounded-3xl p-[2px] overflow-hidden" style="background: conic-gradient(from 180deg, rgba(255,255,255,0.10) 0deg, rgba(255,255,255,0.10) ${weekProgressPct * 3.6}deg, var(--accent-color) ${weekProgressPct * 3.6}deg, var(--accent-color) ${Math.min(weekProgressPct * 3.6 + 0.2, 360)}deg, rgba(255,255,255,0.06) ${Math.min(weekProgressPct * 3.6 + 0.2, 360)}deg, rgba(255,255,255,0.06) 360deg); box-shadow: 0 0 20px rgba(var(--accent-color-rgb, 114,254,143), 0.18);">
                    <div class="bg-surface-container-low rounded-[22px] p-6 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-3xl -mr-16 -mt-16 opacity-20"></div>
                        <div class="flex justify-between items-end mb-6">
                            <div>
                                <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1 block font-headline">Snap Semanal</span>
                                <p class="text-[var(--text-primary)] font-semibold tracking-tight">${snapMessage}</p>
                            </div>
                            <div class="text-right shrink-0">
                                <span class="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50 block">Semana</span>
                                <span class="text-[10px] font-extrabold text-primary accent-text">${weekProgressPct}%</span>
                            </div>
                        </div>
                        
                        <div class="flex justify-between items-center relative mt-4">
                            <div class="flex flex-wrap justify-between gap-y-6 gap-x-2 w-full pb-2 px-1">
                                ${weekData.map(d => generateRing(d.day, d.state, d.pct, d.isRestDay)).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Finance Card -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-amber-400/5 rounded-3xl p-6 border border-amber-300/20 opacity-90">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-amber-200/80 block mb-2 font-headline">Dia a Dia</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-amber-200/70">R$</span>
                            <span class="block w-full max-w-full truncate text-[clamp(1.1rem,4.8vw,1.85rem)] font-extrabold tracking-tighter text-[var(--text-primary)] font-headline" title="R$ ${formatCurrency(balances?.diaBalance)}">${formatCurrency(balances?.diaBalance)}</span>
                        </div>
                    </div>
                    <div class="bg-emerald-400/10 rounded-3xl p-6 border border-emerald-300/25 opacity-90">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-emerald-200 block mb-2 font-headline">Meu Dinheiro</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-emerald-200/80">R$</span>
                            <span class="block w-full max-w-full truncate text-[clamp(1.1rem,4.8vw,1.85rem)] font-extrabold tracking-tighter text-[var(--text-primary)] font-headline" title="R$ ${formatCurrency(balances?.dinheiroBalance)}">${formatCurrency(balances?.dinheiroBalance)}</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Check-in Trigger Block -->
            <section>
                <div class="bg-surface-container-highest rounded-[32px] overflow-hidden relative group transition-all duration-700 ${isAllDone ? 'border border-primary/50 accent-border shadow-[0_0_20px_var(--accent-color)] accent-glow' : 'border border-transparent'}" id="checkin-container" onclick="window.openCheckinModal()">
                    <div class="p-6 flex items-center justify-between hover:bg-surface-highest transition-colors cursor-pointer active:scale-95 transition-transform duration-300">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span class="material-symbols-outlined text-primary accent-text" style="font-variation-settings: 'FILL' 1;">edit_document</span>
                            </div>
                            <div class="flex flex-col gap-1 w-32 sm:w-40">
                                <h3 class="font-bold text-[16px] text-[var(--text-primary)] leading-tight">Check-in Diário</h3>
                                <div class="flex items-center gap-2">
                                    <div class="h-1.5 flex-1 bg-black/40 rounded-full overflow-hidden">
                                        <div id="checkin-internal-bar" class="h-full bg-primary accent-bg transition-all duration-500 ease-out" style="width: ${todayPct}%"></div>
                                    </div>
                                    <span class="text-[10px] font-bold text-on-surface-variant" id="checkin-pct-text">${todayPct}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 bg-surface-highest px-4 py-2 rounded-full border border-white/5">
                            <span class="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">Abrir</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Learning Section — Livros -->
            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold tracking-tight text-[var(--text-primary)] font-headline">Meus Livros</h3>
                    <span class="text-xs font-bold text-cyan-400 tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity" onclick="window.openLibraryModal('book')">Ver Todos</span>
                </div>
                <div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4" style="scrollbar-width: none; -ms-overflow-style: none;">
                    ${books.length > 0 ? books.map(renderLibCard).join('') : emptyCard('livro')}
                </div>
            </section>

            <!-- Learning Section — Cursos -->
            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold tracking-tight text-[var(--text-primary)] font-headline">Meus Cursos</h3>
                    <span class="text-xs font-bold text-primary accent-text tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity" onclick="window.openLibraryModal('course')">Ver Todos</span>
                </div>
                <div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4" style="scrollbar-width: none; -ms-overflow-style: none;">
                    ${courses.length > 0 ? courses.map(renderLibCard).join('') : emptyCard('curso')}
                </div>
            </section>
        </div>

        <!-- Fullscreen Daily Check-in Modal -->
        <div id="checkin-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
            <!-- Overlay -->
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="checkin-modal-overlay" onclick="window.closeCheckinModal()"></div>
            
            <!-- Modal Body (Sliding up from bottom) -->
            <div class="relative w-full h-[95vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="checkin-modal-sheet">
                
                <!-- Fixed Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <h2 class="text-3xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none" id="lbl-checkin-date">09 ABR</h2>
                            <span class="text-[12px] font-bold tracking-widest uppercase text-primary accent-text mt-1" id="lbl-checkin-day">Domingo</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeCheckinModal()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>

                <!-- Scrollable Form Area -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-28 space-y-10 hide-scrollbar" id="checkin-modal-scroll">
                    
                    <!-- Qualitativos -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Como você se sentiu?</h3>
                        
                        <div class="bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-6">
                            <!-- Humor -->
                            <div class="space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] block">Humor Geral</span>
                                <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width: none;">
                                    ${[
                                        { label: 'Nervoso', val: 'nervoso', active: 'border-red-500 bg-red-500/20 text-red-500' },
                                        { label: 'Feliz', val: 'feliz', active: 'border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]' },
                                        { label: 'Produtivo', val: 'produtivo', active: 'border-cyan-400 bg-cyan-400/20 text-cyan-400' },
                                        { label: 'Normal', val: 'normal', active: 'border-white/50 bg-white/10 text-white' },
                                        { label: 'Ansioso', val: 'ansioso', active: 'border-orange-400 bg-orange-400/20 text-orange-400' },
                                        { label: 'Cansado', val: 'cansado', active: 'border-purple-400 bg-purple-400/20 text-purple-400' },
                                        { label: 'Triste', val: 'triste', active: 'border-blue-400 bg-blue-400/20 text-blue-400' }
                                    ].map(m => {
                                        const isActive = todayLog.mood === m.val;
                                        return `<button onclick="window.selectChip(this, 'mood-btn')" data-active-class="${m.active}" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border ${isActive ? m.active + ' opacity-100' : 'border-transparent bg-surface-highest text-on-surface-variant opacity-60'} text-sm font-bold hover:opacity-100 transition-all">${m.label}</button>`;
                                    }).join('')}
                                </div>
                            </div>
                            
                            <div class="h-px w-full bg-white/5"></div>

                            <!-- Sono -->
                            <div class="space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] block">Qualidade do Sono</span>
                                <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width: none;">
                                    ${[
                                        { label: 'Perfeito', val: 'perfeito', active: 'border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
                                        { label: 'Muito bom', val: 'muito_bom', active: 'border-blue-400 bg-blue-400/20 text-blue-400' },
                                        { label: 'Bom', val: 'bom', active: 'border-cyan-400 bg-cyan-400/20 text-cyan-400' },
                                        { label: 'Mais ou menos', val: 'mais_ou_menos', active: 'border-orange-400 bg-orange-400/20 text-orange-400' },
                                        { label: 'Ruim', val: 'ruim', active: 'border-red-500 bg-red-500/20 text-red-500' }
                                    ].map(s => {
                                        const isActive = todayLog.sleep === s.val;
                                        return `<button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="${s.active}" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border ${isActive ? s.active + ' opacity-100' : 'border-transparent bg-surface-highest text-on-surface-variant opacity-60'} text-sm font-bold hover:opacity-100 transition-all">${s.label}</button>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Quantitativos e Horários -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Seu corpo e tempo</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Tempo de Tela -->
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                <span class="text-xs font-bold text-on-surface-variant px-1">Tempo de Tela</span>
                                <input id="input-screen-time" type="time" value="${todayLog.screen_time || ''}" placeholder="00:00" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">
                            </div>
                            <!-- Instagram -->
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                <span class="text-xs font-bold text-on-surface-variant px-1">Instagram</span>
                                <input id="input-instagram" type="time" value="${todayLog.instagram || ''}" placeholder="00:00" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">
                            </div>
                            <!-- Água -->
                            <div class="col-span-2 bg-surface-container rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col items-center justify-center">
                                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Água Consumida (1 Gota = 1 Litro)</span>
                                <div class="flex items-center gap-3">
                                    ${[1,2,3,4,5].map(i => {
                                        const isActive = i <= (todayLog.water || 0);
                                        return `<button onclick="window.setWaterInput(${i})" id="water-drop-${i}" class="text-4xl transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none' : 'grayscale opacity-30'} hover:scale-110 active:scale-90">💧</button>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Hábitos Base -->
                    <section class="space-y-4">
                        <div class="flex items-center justify-between gap-3 px-2">
                            <button id="rest-day-toggle-checkin" data-active="false" onclick="window.toggleRestDay()" class="w-full h-12 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant font-bold text-sm transition-all active:scale-95">
                                Dia de Descanso
                            </button>
                            <span id="rest-day-badge-checkin" class="hidden flex-shrink-0 px-3 py-2 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-200 text-[10px] font-extrabold uppercase tracking-widest">Descanso</span>
                        </div>
                        <div class="flex justify-between items-center pl-2 pr-1">
                            <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">As 8 Rotinas</h3>
                            <span class="text-[10px] font-bold text-primary accent-text" id="lbl-habit-counter">0/8</span>
                        </div>
                        <div id="checkin-habits-section" class="bg-surface-container rounded-[32px] p-2 space-y-1 border border-white/5 transition-opacity">
                            ${DEFAULT_HABITS.map((h, i) => {
                                const isChecked = todayLog.habits ? todayLog.habits[h.id] : false;
                                return `
                                <div class="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-highest transition-colors cursor-pointer group active:scale-[0.98]" onclick="window.toggleHabit('${h.id}', ${!isChecked})">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center text-on-surface-variant group-hover:text-[var(--text-primary)] transition-colors">
                                            <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' ${isChecked ? 1 : 0};">${h.icon}</span>
                                        </div>
                                        <span id="txt-${h.id}" class="text-base font-bold transition-all ${isChecked ? 'line-through opacity-50 text-on-surface-variant' : 'text-[var(--text-primary)]'}">${h.name}</span>
                                    </div>
                                    <div id="circle-${h.id}" class="w-7 h-7 rounded-full border-2 ${isChecked ? 'bg-primary accent-bg border-primary accent-border' : 'border-on-surface-variant/30 group-hover:border-on-surface-variant/60'} flex items-center justify-center transition-all">
                                        ${isChecked ? '<span class="material-symbols-outlined text-black font-bold mix-blend-color-burn" style="font-size:16px;">check</span>' : ''}
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </section>

                    <!-- Fluxo Financeiro Diário -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Fluxo do Caixa</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Dia a dia -->
                            <div class="col-span-2 space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Dia a Dia"</span>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-red-400">
                                        <span class="text-xs font-bold text-on-surface-variant">Gasto Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-red-400 font-bold mr-1">R$</span>
                                            <input id="input-fluxo-dia-expense" value="${todayLog.expense_dia || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input id="input-fluxo-dia-income" value="${todayLog.income_dia || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Meu Dinheiro -->
                            <div class="col-span-2 space-y-3 mt-4">
                                <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Meu Dinheiro"</span>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-red-400">
                                        <span class="text-xs font-bold text-on-surface-variant">Gasto Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-red-400 font-bold mr-1">R$</span>
                                            <input id="input-fluxo-din-expense" value="${todayLog.expense_din || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input id="input-fluxo-din-income" value="${todayLog.income_din || ''}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                
                <!-- Fixed Footer Area -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-[0_10px_30px_rgba(var(--accent-color-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-transform" onclick="window.closeCheckinModal()">
                        Salvar e Concluir Diário
                    </button>
                </div>
            </div>
        </div>

        <!-- Library VIEW Modal (bottom sheet, read-only) -->
        <div id="library-view-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="library-view-overlay" onclick="window.closeLibraryView()"></div>
            <div class="relative w-full h-[80vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="library-view-sheet">
                <!-- Handle + Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl" id="lbl-lv-emoji">📘</span>
                            <div>
                                <h2 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-tight" id="lbl-lv-title">Título</h2>
                                <span id="lbl-lv-author" class="text-[11px] font-bold text-on-surface-variant/50">Autor</span>
                            </div>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeLibraryView()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>
                <!-- Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-28 space-y-4 hide-scrollbar" id="library-view-content"></div>
                <!-- Footer -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-[0_10px_30px_rgba(var(--accent-color-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2" onclick="window.openLibraryEditFromView()">
                        <span class="material-symbols-outlined">edit</span> Editar Obra
                    </button>
                </div>
            </div>
        </div>

        <!-- Library List Modal -->
        <div id="library-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="library-modal-overlay" onclick="window.closeLibraryModal()"></div>
            
            <div class="relative w-full h-[95vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="library-modal-sheet">
                <!-- Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <h2 class="text-3xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none">Minha Biblioteca</h2>
                            <span class="text-[12px] font-bold tracking-widest uppercase text-on-surface-variant mt-1">Seus livros e cursos</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeLibraryModal()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                    <!-- Filter tabs -->
                    <div class="flex gap-2 pt-2">
                        <button class="lib-filter-btn px-5 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95" data-filter="all" onclick="window.filterLibrary('all')">Todos</button>
                        <button class="lib-filter-btn px-5 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95" data-filter="course" onclick="window.filterLibrary('course')">📚 Cursos</button>
                        <button class="lib-filter-btn px-5 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95" data-filter="book" onclick="window.filterLibrary('book')">📖 Livros</button>
                    </div>
                </div>

                <!-- Scrollable List Area -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-4 hide-scrollbar" id="library-modal-list">
                    ${(libraryItems || []).length === 0 
                        ? '<p class="text-center text-on-surface-variant/30 text-sm py-12">Nenhuma obra cadastrada ainda.</p>'
                        : (libraryItems || []).map(item => {
                            const pct = item.total > 0 ? Math.round((item.current / item.total) * 100) : 0;
                            const isBook = item.type === 'book';
                            const statusLabels = { to_do: 'Para Iniciar', in_progress: 'Em Andamento', done: 'Concluído' };
                            const statusColors = { to_do: 'text-on-surface-variant/60 bg-white/5 border-white/10', in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20', done: 'text-green-400 bg-green-400/10 border-green-400/20' };
                            const barColor = isBook ? 'bg-cyan-400 shadow-[0_0_10px_rgba(136,235,255,0.5)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]';
                            const pctColor = isBook ? 'text-cyan-400' : 'text-blue-400';
                            const unitLabel = isBook ? 'Pág' : 'Aula';
                            const typeLabel = isBook ? 'Livro' : 'Curso';
                            const sc = statusColors[item.status] || statusColors.to_do;
                            return `
                            <div class="w-full bg-surface-container-highest rounded-[28px] p-5 border border-white/5 space-y-5 flex flex-col relative cursor-pointer active:scale-[0.98] transition-transform shadow-lg" data-lib-type="${item.type}" onclick="window.openLibraryView('${item.id}')">
                                <div class="flex justify-between items-start">
                                    <span class="text-3xl filter drop-shadow-md">${item.emoji || (isBook ? '📘' : '🎓')}</span>
                                    <span class="text-[10px] font-bold ${sc} px-3 py-1.5 rounded-xl uppercase tracking-widest border">${statusLabels[item.status] || 'Para Iniciar'}</span>
                                </div>
                                <div>
                                    <span class="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1 block">${typeLabel} • ${item.author || ''}</span>
                                    <h4 class="font-bold text-[var(--text-primary)] text-[18px] leading-tight">${item.title}</h4>
                                </div>
                                <div class="space-y-3 mt-auto">
                                    <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
                                        <div class="h-full ${barColor} rounded-full" style="width:${pct}%"></div>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-bold text-on-surface-variant">${unitLabel} ${item.current || 0} de ${item.total || 0}</span>
                                        <span class="text-xs font-extrabold ${pctColor}">${pct}%</span>
                                    </div>
                                </div>
                            </div>`;
                        }).join('')
                    }
                </div>

                <!-- Floating Bottom Button -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-surface-highest border border-white/10 text-[var(--text-primary)] font-extrabold text-lg shadow-xl hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2" onclick="window.openLibraryForm()">
                        <span class="material-symbols-outlined">add</span> Adicionar Obra
                    </button>
                </div>
            </div>
        </div>

        <!-- Library CRUD Form Modal (Overlays Library List) -->
        <div id="library-form-modal" class="fixed inset-0 z-[300] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="library-form-overlay" onclick="window.closeLibraryForm()"></div>
            
            <div class="relative w-full h-[90vh] bg-surface-container rounded-t-[40px] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)] transform translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="library-form-sheet">
                
                <div class="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-surface-container/50 backdrop-blur top-0 z-10 sticky rounded-t-[40px]">
                    <h3 class="font-extrabold text-xl text-[var(--text-primary)] font-headline" id="lbl-lib-form-title">Nova Obra</h3>
                    <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeLibraryForm()">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <!-- Form Scroll -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-6 hide-scrollbar">
                    
                    <div class="flex gap-4">
                        <!-- Emoji -->
                        <div class="bg-surface-highest rounded-[24px] w-20 flex flex-col items-center justify-center border border-white/5 p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ícone</span>
                            <input type="text" id="lib-emoji" placeholder="🎓" maxlength="2" class="w-full bg-transparent text-center text-4xl p-0 border-none focus:ring-0">
                        </div>
                        <!-- Tipo -->
                        <div class="bg-surface-highest p-1.5 flex flex-1 rounded-[24px] border border-white/5 relative">
                            <button class="flex-1 rounded-2xl py-2 font-bold text-sm bg-primary/20 text-primary accent-text transition-all" id="btn-type-course" onclick="window.setLibraryType('course')">Curso</button>
                            <button class="flex-1 rounded-2xl py-2 font-bold text-sm text-on-surface-variant transition-all hover:bg-white/5" id="btn-type-book" onclick="window.setLibraryType('book')">Livro</button>
                        </div>
                    </div>

                    <!-- Texts -->
                    <div class="space-y-4">
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Título</span>
                            <input type="text" id="lib-title" placeholder="Ex: Hábitos Atômicos" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-lg p-0 focus:ring-0">
                        </div>
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Autor / Instrutor</span>
                            <input type="text" id="lib-author" placeholder="Ex: James Clear" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-lg p-0 focus:ring-0">
                        </div>
                    </div>

                    <!-- Progress & Numbers -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-surface-highest rounded-[24px] p-4 flex flex-col items-center border border-white/5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 text-center">Já li/Fiz</span>
                            <input type="number" id="lib-current" placeholder="0" class="w-full text-center bg-transparent border-none text-3xl font-extrabold text-[var(--text-primary)] p-0 focus:ring-0 font-headline">
                        </div>
                        <div class="bg-surface-highest rounded-[24px] p-4 flex flex-col items-center border border-white/5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 text-center">Total (Págs/Aulas)</span>
                            <input type="number" id="lib-total" placeholder="100" class="w-full text-center bg-transparent border-none text-3xl font-extrabold text-[var(--text-primary)] p-0 focus:ring-0 font-headline">
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="space-y-2">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block px-2">Status da Obra</span>
                        <div class="flex gap-2 pb-1 overflow-x-auto hide-scrollbar -mx-2 px-2" style="scrollbar-width:none;">
                            <button class="lib-status-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="to_do" onclick="window.setLibraryStatus(this)">Para Iniciar</button>
                            <button class="lib-status-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-blue-400 bg-blue-400/20 text-blue-400 shadow-[0_4px_15px_rgba(96,165,250,0.15)] text-sm font-bold transition-all hover:bg-blue-400/30 active:scale-95" data-val="in_progress" onclick="window.setLibraryStatus(this)">Em Andamento</button>
                            <button class="lib-status-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="done" onclick="window.setLibraryStatus(this)">Concluído</button>
                        </div>
                    </div>

                    <!-- Gênero e Opinião -->
                    <div class="space-y-4 pt-2">
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Gênero</span>
                            <input type="text" id="lib-genre" placeholder="Ex: Produtividade" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0">
                        </div>
                        
                        <!-- Rating 5 Stars -->
                        <div class="bg-surface-highest rounded-[24px] p-5 border border-white/5 flex flex-col items-center gap-4">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Sua Nota Pessoal</span>
                            <div class="flex gap-1 sm:gap-4">
                                ${[1,2,3,4,5].map(v => `<button class="lib-star text-4xl grayscale opacity-30 hover:scale-110 active:scale-90 transition-all text-yellow-500 drop-shadow-lg" onclick="window.setLibraryRating(${v})">⭐</button>`).join('')}
                            </div>
                        </div>

                        <!-- Review Textarea -->
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-2">Suas Notas e Resumo</span>
                            <textarea id="lib-review" placeholder="Quais os principais aprendizados que você teve com essa obra?" class="w-full bg-transparent border-none text-[var(--text-primary)] text-sm p-0 focus:ring-0 resize-none min-h-[120px] leading-relaxed"></textarea>
                        </div>
                    </div>

                </div>

                <!-- Footer Action Buttons -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container via-surface-container to-transparent flex gap-4" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-16 h-16 rounded-[24px] bg-red-500/10 text-red-500 font-extrabold flex items-center justify-center border border-red-500/20 active:scale-95 transition-transform hidden" id="btn-lib-delete" onclick="window.deleteLibraryItem()">
                        <span class="material-symbols-outlined">delete_forever</span>
                    </button>
                    <button class="flex-1 h-16 rounded-[24px] bg-[var(--text-primary)] text-surface-highest font-extrabold text-lg shadow-xl active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2" onclick="window.saveLibraryForm()">
                        <span class="material-symbols-outlined">save</span> Salvar Obra
                    </button>
                </div>
            </div>
        </div>
    `;
}
