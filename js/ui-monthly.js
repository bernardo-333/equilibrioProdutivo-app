import { DB } from './database.js';

export async function renderMonthly() {
    const root = document.getElementById('monthly-root');
    const kanbanData = await DB.getKanbanData();
    
    // MVP implementation: a simple static calendar view and a list-based Kanban mock
    root.innerHTML = `
        <section class="mb-8 mt-2">
            <h2 class="text-xl font-bold font-headline mb-4"><span class="accent-text">Mês</span> Atual</h2>
            
            <!-- Calendario Mock -->
            <div class="glass-card p-5 rounded-lg mb-6 border-l-4 accent-border">
                <p class="text-sm text-on-surface-variant font-medium">O heatmap de dias em breve aparecerá aqui. (No MVP, apenas log diário na Aba 1)</p>
            </div>
            
            <!-- Kanban MVP -->
            <div class="flex justify-between items-end mb-4">
                <h2 class="text-xl font-bold font-headline">Kanban <span class="text-on-surface-variant">Ideias</span></h2>
                <button class="text-xs accent-text font-bold" onclick="window.addKanbanItem()">+ Nova Ideia</button>
            </div>
            
            <div class="grid grid-cols-1 gap-4" id="kanban-columns">
                <!-- Todo Column -->
                <div class="rounded-xl bg-surface-container-highest p-4 min-h-[150px]">
                    <h4 class="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Backlog (${kanbanData.ideas?.length || 0})</h4>
                    <div class="flex flex-col gap-2">
                        ${(kanbanData.ideas || []).map(item => `
                            <div class="p-3 bg-surface rounded shadow border border-outline-variant/20 text-sm">
                                ${item.title}
                            </div>
                        `).join('') || '<p class="text-xs text-on-surface-variant">Nenhuma ideia ainda.</p>'}
                    </div>
                </div>
                
                <!-- Doing Column -->
                <div class="rounded-xl bg-surface-container-highest p-4 min-h-[150px]">
                    <h4 class="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Fazendo (${kanbanData.doing?.length || 0})</h4>
                    <div class="flex flex-col gap-2">
                         ${(kanbanData.doing || []).map(item => `
                            <div class="p-3 bg-surface rounded shadow border-l-2 accent-border text-sm">
                                ${item.title}
                            </div>
                        `).join('') || '<p class="text-xs text-on-surface-variant">Nenhuma tarefa em andamento.</p>'}
                    </div>
                </div>
            </div>
        </section>
    `;
}

window.addKanbanItem = async () => {
    const title = prompt('Qual é a nova ideia?');
    if (title) {
        const kanbanData = await DB.getKanbanData();
        if(!kanbanData.ideas) kanbanData.ideas = [];
        kanbanData.ideas.push({ id: Date.now().toString(), title });
        await DB.saveKanbanData(kanbanData);
        renderMonthly(); // re-render para MVP Kanban é ok, pois é pequeno
    }
};
