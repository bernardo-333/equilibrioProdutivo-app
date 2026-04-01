export function getPlannerHTML({ historyDays, metrics, kanbanData }) {
    // Helper to map mood/sleep qualitative values to emojis based on schema
    const moodEmojis = { "feliz": "🤩", "triste": "😢", "produtivo": "⚡", "normal": "😐", "ansioso": "😬", "cansado": "😫", "nervoso": "😡" };
    const sleepEmojis = { "perfeito": "🌟", "bom": "🟢", "muito_bom": "🔵", "mais_ou_menos": "🟡", "ruim": "🔴" };

    // Heatmap squares HTML (generating 30 days for month mock)
    const heatmapHTML = Array.from({length: 30}, (_, i) => {
        // Mock logic: randomly make some perfect days
        const isPerfect = (i % 3 === 0); 
        const isGood = (i % 2 === 0);
        
        let classes = 'bg-surface-highest border border-white/5 opacity-30'; // bad/empty day
        if (isPerfect) {
            classes = 'bg-primary accent-bg shadow-[0_0_8px_var(--accent-color)] glow';
        } else if (isGood) {
             classes = 'bg-primary/40 border border-primary/20 accent-border';
        }
        
        return `<div class="w-4 h-4 rounded-sm ${classes} hover:scale-125 transition-transform cursor-pointer"></div>`;
    }).join('');

    // Table rows HTML (Accordion)
    const dailyRowsHTML = historyDays.map(day => `
        <div class="glass-card rounded-3xl p-4 flex flex-col cursor-pointer hover:bg-white/5 transition-colors border-white/5 border accordeon-row group" data-day="${day.date}">
            <div class="flex justify-between items-center text-sm w-full">
                <span class="font-bold text-[var(--text-primary)] w-16 whitespace-nowrap">${day.date}</span>
                <div class="flex-1 mx-4 h-1.5 bg-surface-highest rounded-full overflow-hidden">
                    <div class="h-full bg-primary accent-bg transition-all duration-700" style="width: ${day.pct}%"></div>
                </div>
                <div class="flex gap-2 text-lg items-center">
                    <span class="opacity-80">${moodEmojis[day.mood] || '😐'}</span>
                    <span class="text-[10px] bg-surface-highest px-2 py-1 rounded-md ml-1 font-bold tracking-widest uppercase opacity-70">${sleepEmojis[day.sleep] || '🟡'} Sleep</span>
                </div>
            </div>
            
            <!-- Expanded Details (Hidden by default) -->
            <div class="accordeon-details hidden mt-5 pt-5 border-t border-white/5 space-y-4 animate-fade-in">
                 <div class="grid grid-cols-2 gap-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                     <div class="bg-surface-container p-3 rounded-2xl flex items-center justify-between border border-cyan-400/10">
                         <span>Água</span>
                         <span class="text-cyan-400 text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">${day.water}L</span>
                     </div>
                     <div class="bg-surface-container p-3 rounded-2xl flex items-center justify-between border border-red-400/10">
                         <span>Instagram</span>
                         <span class="text-red-400 text-sm drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">${day.telas}h</span>
                     </div>
                 </div>
                 <div class="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">
                     As 8 Rotinas
                 </div>
                 <div class="flex flex-wrap gap-2">
                     ${day.habits.map(h => `
                        <span class="px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold tracking-widest border transition-all ${h.done ? 'bg-primary/10 text-primary accent-text border-primary/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}">
                            ${h.name}
                        </span>
                     `).join('')}
                 </div>
                 <div class="flex justify-end pt-2">
                      <button class="px-4 py-2 rounded-full bg-surface-highest text-[var(--text-primary)] text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-colors">Editar Dia</button>
                 </div>
            </div>
        </div>
    `).join('');

    // Kanban generator
    const generateKanbanCol = (id, title, items) => `
        <div class="flex-shrink-0 w-[280px] flex flex-col gap-3">
            <h4 class="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant pl-2">${title} <span class="text-primary accent-text ml-1 opacity-80">${items.length}</span></h4>
            <div class="kanban-column flex-1 bg-surface-container-highest rounded-3xl p-4 min-h-[300px] border border-white/5 space-y-3 shadow-inner" data-col="${id}">
                ${items.map(item => `
                    <div class="kanban-card p-4 bg-surface-container rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-white/5 text-[var(--text-primary)] font-medium text-sm cursor-grab active:cursor-grabbing hover:bg-surface-highest transition-all relative overflow-hidden group" draggable="true" data-id="${item.id}">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary/50 accent-bg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        ${item.title}
                    </div>
                `).join('')}
                ${items.length === 0 ? '<p class="text-xs text-on-surface-variant text-center mt-6">Vazio</p>' : ''}
            </div>
        </div>
    `;

    return `
        <div class="space-y-8 pb-12 font-headline animate-[fade-in_0.4s_ease-out]">

            <!-- Topo: Resumo do Mês (Heatmap & Metrics) -->
            <section class="space-y-4">
                
                <!-- Heatmap Card -->
                <div class="bg-surface-container-low rounded-[32px] p-6 border border-white/5 relative overflow-hidden group">
                     <div class="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[50px] -mr-16 -mt-16 accent-bg opacity-30 transition-opacity"></div>
                     <div class="flex items-center justify-between mb-5">
                         <span class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant block">O Fator Consistência</span>
                         <span class="material-symbols-outlined text-primary accent-text opacity-70">local_fire_department</span>
                     </div>
                     
                     <div class="flex flex-wrap gap-[6px] justify-start content-start min-h-[100px]">
                         ${heatmapHTML}
                     </div>
                </div>

                <!-- Métricas Rápidas -->
                <div class="grid grid-cols-3 gap-3">
                    <div class="bg-surface-container rounded-[24px] p-4 flex flex-col items-center justify-center border border-white/5 text-center shadow-md active:scale-95 transition-transform cursor-pointer">
                        <span class="text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 block">Perfeitos</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-2xl font-extrabold tracking-tighter text-primary accent-text font-headline">${metrics.perfectDays}</span>
                            <span class="text-xs font-bold text-on-surface-variant">/30</span>
                        </div>
                    </div>
                    <div class="bg-surface-container rounded-[24px] p-4 flex flex-col items-center justify-center border border-white/5 text-center shadow-md active:scale-95 transition-transform cursor-pointer">
                        <span class="text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-1 block">Sono Médio</span>
                        <span class="text-3xl filter drop-shadow-md mt-1">${sleepEmojis[metrics.avgSleep] || '😴'}</span>
                    </div>
                    <div class="bg-surface-container rounded-[24px] p-4 flex flex-col items-center justify-center border border-white/5 text-center shadow-md active:scale-95 transition-transform cursor-pointer">
                        <span class="text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-1 block">Humor Médio</span>
                        <span class="text-3xl filter drop-shadow-md mt-1">${moodEmojis[metrics.avgMood] || '⚡'}</span>
                    </div>
                </div>
            </section>

            <!-- Meio: Diário de Bordo -->
            <section class="space-y-4">
                <div class="flex justify-between items-center px-1">
                    <h3 class="text-lg font-bold tracking-tight text-[var(--text-primary)] relative z-10 font-headline">Diário de Bordo</h3>
                    <span class="text-xs text-primary accent-text font-bold uppercase tracking-widest">Este Mês</span>
                </div>
                <div class="space-y-3">
                    ${dailyRowsHTML}
                </div>
            </section>

            <!-- Base: Kanban Cérebro -->
            <section class="space-y-4 pt-6">
                 <div class="flex justify-between items-end px-1 mb-2">
                    <h3 class="text-xl font-bold tracking-tight text-[var(--text-primary)] font-headline leading-none">Cérebro <span class="text-on-surface-variant">Kanban</span></h3>
                    <button class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary accent-text active:scale-90 transition-transform">
                        <span class="material-symbols-outlined text-[18px] font-bold">add</span>
                    </button>
                 </div>
                 <div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-6 pt-2 snap-x" style="scrollbar-width: none;">
                    ${generateKanbanCol('ideas', 'A Fazer', kanbanData.ideas || [])}
                    ${generateKanbanCol('doing', 'Em Progresso', kanbanData.doing || [])}
                    ${generateKanbanCol('done', 'Concluído', kanbanData.done || [])}
                 </div>
            </section>

        </div>
    `;
}
