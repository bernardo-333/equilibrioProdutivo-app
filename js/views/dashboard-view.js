export function getDashboardHTML({ 
    todayLog, finances, todayPct, missing, isAllDone, weekData, DEFAULT_HABITS, snapMessage 
}) {
    // Helper for generating progress rings
    const generateRing = (dayToken, state, percent) => {
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

        let innerContent = isPerfect 
            ? `<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">local_fire_department</span>`
            : `<span class="text-[9px] font-extrabold tracking-tight text-on-surface-variant">${percent}%</span>`; 

        let circleHTML = '';
        if (isPerfect) {
            circleHTML = `<circle cx="20" cy="20" r="16" fill="var(--accent-color)" stroke="transparent" class="accent-bg" />`;
        } else {
            circleHTML = `
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/10" />
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" 
                        class="text-primary accent-text drop-shadow-[0_0_4px_currentColor]" 
                        stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round" />
            `;
        }

        const todayPulse = state === 'today' ? `<div class="absolute inset-0 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] border border-primary/40 accent-border scale-125"></div>` : '';
        const glowStyle = isPerfect ? `style="box-shadow: 0 0 15px var(--accent-color);"` : '';

        return `
        <div class="flex flex-col items-center gap-2 flex-shrink-0 min-w-[40px]">
            <span class="text-[10px] font-bold ${state === 'today' ? 'text-primary accent-text' : 'text-on-surface-variant'}">${dayToken}</span>
            <div class="relative w-10 h-10 flex items-center justify-center rounded-full" ${glowStyle}>
                ${todayPulse}
                <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                    ${circleHTML}
                </svg>
                <div class="z-10 flex items-center justify-center">${innerContent}</div>
            </div>
        </div>`;
    };

    return `
        <div class="space-y-8 pb-12">
            <!-- Weekly Snap & Finance Block -->
            <section class="space-y-6">
                <!-- Weekly Snap Card -->
                <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 accent-bg opacity-10"></div>
                    <div class="flex justify-between items-end mb-6">
                        <div>
                            <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1 block font-headline">Snap Semanal</span>
                            <p class="text-[var(--text-primary)] font-semibold tracking-tight">${snapMessage}</p>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center relative mt-4">
                        <div class="flex flex-wrap justify-between gap-y-6 gap-x-2 w-full pb-2 px-1">
                            ${weekData.map(d => generateRing(d.day, d.state, d.pct)).join('')}
                        </div>
                    </div>
                </div>

                <!-- Finance Card -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-surface-container rounded-3xl p-6 border border-white/5 cursor-pointer active:scale-95 transition-transform" onclick="window.openFinanceModal('dia')">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant block mb-2 font-headline">Dia a Dia</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-on-surface-variant">R$</span>
                            <span class="text-3xl font-extrabold tracking-tighter text-[var(--text-primary)] font-headline">0,00</span>
                        </div>
                    </div>
                    <div class="bg-primary/10 rounded-3xl p-6 border border-primary/20 accent-border cursor-pointer active:scale-95 transition-transform" onclick="window.openFinanceModal('geral')">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-primary accent-text block mb-2 font-headline">Meu Dinheiro</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-primary/70 accent-text">R$</span>
                            <span class="text-3xl font-extrabold tracking-tighter text-[var(--text-primary)] font-headline">${finances.balance.toFixed(2)}</span>
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

            <!-- Learning Carousel Block -->
            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold tracking-tight text-[var(--text-primary)] font-headline">Continuar de onde parou</h3>
                    <span class="text-xs font-bold text-primary accent-text tracking-widest uppercase">Ver Todos</span>
                </div>
                <!-- Hide scrollbar class is added dynamically or via css -->
                <div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4" style="scrollbar-width: none; -ms-overflow-style: none;">
                    
                    <!-- Course Card -->
                    <div class="min-w-[240px] bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-5 flex flex-col relative">
                        <div class="flex justify-between items-start">
                            <span class="text-3xl">🎓</span>
                            <span class="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest bg-surface-container px-2 py-1 rounded">Curso</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-[var(--text-primary)] text-base leading-tight">UI Design Avançado</h4>
                        </div>
                        <div class="space-y-3 mt-auto">
                            <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                <div class="h-full bg-primary accent-bg w-3/4 rounded-full shadow-[0_0_8px_rgba(114,254,143,0.4)] accent-glow"></div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs font-medium text-on-surface-variant">Aula 12 / 50</span>
                                <button class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary accent-text active:scale-90 transition-transform">
                                    <span class="material-symbols-outlined text-lg">add</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Book Card -->
                    <div class="min-w-[240px] bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-5 flex flex-col relative">
                        <div class="flex justify-between items-start">
                            <span class="text-3xl">📘</span>
                            <span class="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest bg-surface-container px-2 py-1 rounded">Livro</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-[var(--text-primary)] text-base leading-tight">Hábitos Atômicos</h4>
                        </div>
                        <div class="space-y-3 mt-auto">
                            <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                <div class="h-full bg-cyan-400 w-[42%] rounded-full shadow-[0_0_8px_rgba(136,235,255,0.4)]"></div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs font-medium text-on-surface-variant">Pág 45 / 300</span>
                                <button class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-cyan-400 active:scale-90 transition-transform">
                                    <span class="material-symbols-outlined text-lg">add</span>
                                </button>
                            </div>
                        </div>
                    </div>

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
                                    <button onclick="window.selectChip(this, 'mood-btn')" data-active-class="border-red-500 bg-red-500/20 text-red-500" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Nervoso</button>
                                    <button onclick="window.selectChip(this, 'mood-btn')" data-active-class="border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Feliz</button>
                                    <button onclick="window.selectChip(this, 'mood-btn')" data-active-class="border-cyan-400 bg-cyan-400/20 text-cyan-400" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Produtivo</button>
                                    <button onclick="window.selectChip(this, 'mood-btn')" data-active-class="border-white/50 bg-white/10 text-white" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Normal</button>
                                    <button onclick="window.selectChip(this, 'mood-btn')" data-active-class="border-orange-400 bg-orange-400/20 text-orange-400" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Ansioso</button>
                                    <button onclick="window.selectChip(this, 'mood-btn')" data-active-class="border-purple-400 bg-purple-400/20 text-purple-400" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Cansado</button>
                                    <button onclick="window.selectChip(this, 'mood-btn')" data-active-class="border-blue-400 bg-blue-400/20 text-blue-400" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Triste</button>
                                </div>
                            </div>
                            
                            <div class="h-px w-full bg-white/5"></div>

                            <!-- Sono -->
                            <div class="space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] block">Qualidade do Sono</span>
                                <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width: none;">
                                    <button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Perfeito</button>
                                    <button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="border-blue-400 bg-blue-400/20 text-blue-400" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Muito bom</button>
                                    <button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="border-cyan-400 bg-cyan-400/20 text-cyan-400" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Bom</button>
                                    <button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="border-orange-400 bg-orange-400/20 text-orange-400" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Mais ou menos</button>
                                    <button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="border-red-500 bg-red-500/20 text-red-500" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border border-transparent bg-surface-highest text-on-surface-variant text-sm font-bold opacity-60 hover:opacity-100 transition-all">Ruim</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Quantitativos e Horários -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Seu corpo e tempo</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Acordei as -->
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                <span class="text-xs font-bold text-on-surface-variant px-1">Acordei às</span>
                                <input type="time" value="06:30" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">
                            </div>
                            <!-- Instagram -->
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                <span class="text-xs font-bold text-on-surface-variant px-1">Instagram</span>
                                <input type="time" value="01:30" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">
                            </div>
                            <!-- Água -->
                            <div class="col-span-2 bg-surface-container rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col items-center justify-center">
                                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Água Consumida (1 Gota = 1 Litro)</span>
                                <div class="flex items-center gap-3">
                                    <button onclick="window.setWaterInput(1)" id="water-drop-1" class="text-4xl transition-all duration-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none hover:scale-110 active:scale-90">💧</button>
                                    <button onclick="window.setWaterInput(2)" id="water-drop-2" class="text-4xl transition-all duration-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none hover:scale-110 active:scale-90">💧</button>
                                    <button onclick="window.setWaterInput(3)" id="water-drop-3" class="text-4xl transition-all duration-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none hover:scale-110 active:scale-90">💧</button>
                                    <button onclick="window.setWaterInput(4)" id="water-drop-4" class="text-4xl transition-all duration-300 grayscale opacity-30 hover:scale-110 active:scale-90">💧</button>
                                    <button onclick="window.setWaterInput(5)" id="water-drop-5" class="text-4xl transition-all duration-300 grayscale opacity-30 hover:scale-110 active:scale-90">💧</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Hábitos Base -->
                    <section class="space-y-4">
                        <div class="flex justify-between items-center pl-2 pr-1">
                            <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">As 8 Rotinas</h3>
                            <span class="text-[10px] font-bold text-primary accent-text">4/8</span>
                        </div>
                        <div class="bg-surface-container rounded-[32px] p-2 space-y-1 border border-white/5">
                            ${DEFAULT_HABITS.map((h, i) => `
                                <div class="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-highest transition-colors cursor-pointer group active:scale-[0.98]">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center text-on-surface-variant group-hover:text-[var(--text-primary)] transition-colors">
                                            <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' ${i%2===0?1:0};">${h.icon}</span>
                                        </div>
                                        <span class="text-base font-bold text-[var(--text-primary)] ${i%2===0 ? 'line-through opacity-50 text-on-surface-variant' : ''}">${h.name}</span>
                                    </div>
                                    <div class="w-7 h-7 rounded-full border-2 ${i%2===0 ? 'bg-primary accent-bg border-primary accent-border' : 'border-on-surface-variant/30 group-hover:border-on-surface-variant/60'} flex items-center justify-center transition-all">
                                        ${i%2===0 ? '<span class="material-symbols-outlined text-black font-bold mix-blend-color-burn" style="font-size:16px;">check</span>' : ''}
                                    </div>
                                </div>
                            `).join('')}
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
                                            <input type="number" placeholder="0,00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input type="number" placeholder="0,00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
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
                                            <input type="number" placeholder="0,00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input type="number" placeholder="0,00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
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
    `;
}
