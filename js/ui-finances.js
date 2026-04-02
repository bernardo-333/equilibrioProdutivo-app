import { DB } from './database.js';

export async function renderFinances() {
    const root = document.getElementById('finances-root');
    const finances = await DB.getFinances();

    // Sum recent transactions for quick insights (MVP mock)
    const income = finances.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = finances.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

    root.innerHTML = `
        <!-- Banner Em Breve -->
        <div class="mb-8 mt-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-5 border border-primary/20 accent-border flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary accent-text" style="font-size:28px">rocket_launch</span>
            </div>
            <div>
                <p class="text-sm font-bold text-[var(--text-primary)]">Em breve: melhorias financeiras</p>
                <p class="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">Categorias, gráficos mensais e metas de economia estão sendo preparados para uma atualização futura.</p>
            </div>
        </div>

        <!-- Saldo Geral -->
        <section class="mb-12 mt-2">
            <div class="flex flex-col gap-1">
                <span class="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant font-headline">Saldo Geral</span>
                <h1 class="text-5xl font-extrabold tracking-tight font-headline leading-none">R$ ${finances.balance.toFixed(2)}</h1>
                <div class="mt-4 flex items-center gap-2 accent-text font-medium text-sm">
                    <span class="material-symbols-outlined text-sm">account_balance_wallet</span>
                    <span>Atualizado hoje</span>
                </div>
            </div>
        </section>

        <!-- Insights -->
        <section class="grid grid-cols-2 gap-4 mb-12">
            <div class="glass-card p-5 rounded-lg border-l-4 accent-border bg-[#2A2A2A]">
                <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">Entradas</span>
                <p class="text-xl font-bold mt-1 text-primary accent-text">R$ ${income.toFixed(2)}</p>
            </div>
            <div class="glass-card p-5 rounded-lg border-l-4 border-secondary/40 bg-[#2A2A2A]">
                <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">Saídas</span>
                <p class="text-xl font-bold mt-1 text-secondary">R$ ${expense.toFixed(2)}</p>
            </div>
        </section>

        <!-- Transações -->
        <section class="mb-24">
            <div class="flex justify-between items-end mb-6 px-1">
                <h2 class="text-xl font-bold font-headline"><span class="accent-text">Histórico</span></h2>
                <span class="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">Recentes</span>
            </div>
            
            <div class="flex flex-col space-y-3">
                ${finances.transactions.length === 0 ? '<p class="text-sm text-on-surface-variant">Nenhuma transação registrada.</p>' : ''}
                
                ${[...finances.transactions].reverse().map(t => `
                    <div class="group flex items-center justify-between p-4 rounded-md bg-[#2A2A2A] hover:bg-surface-container-highest transition-all duration-300">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors">
                                <span class="material-symbols-outlined">${t.type === 'income' ? 'arrow_downward' : 'arrow_upward'}</span>
                            </div>
                            <div>
                                <p class="font-bold text-sm">${t.title}</p>
                                <p class="text-xs text-on-surface-variant">${t.date}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-bold ${t.type === 'income' ? 'accent-text' : 'text-secondary'}">${t.type === 'income' ? '+' : '-'} R$ ${Number(t.amount).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- FAB para Nova Transação -->
        <button onclick="window.showTransactionModal()" class="fixed right-6 bottom-32 w-16 h-16 rounded-full bg-primary accent-bg shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform duration-300">
            <span class="material-symbols-outlined text-3xl font-bold">add</span>
        </button>

        <!-- Dialog Mock (Hidden) -->
        <div id="tx-modal" class="fixed inset-0 bg-black/60 z-[100] hidden items-end sm:items-center justify-center transition-opacity">
            <div class="bg-surface w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 pb-12 sm:pb-6 relative animate-[fadeIn_0.3s]">
                <h3 class="text-lg font-bold mb-4 font-headline">Nova Transação</h3>
                
                <input type="text" id="tx-title" placeholder="Nome (Ex: Supermercado)" class="w-full bg-surface-container-highest border-0 rounded-lg p-4 mb-3 text-sm focus:ring-1 focus:ring-primary accent-border" />
                <input type="number" id="tx-amount" placeholder="Valor (R$)" class="w-full bg-surface-container-highest border-0 rounded-lg p-4 mb-3 text-sm focus:ring-1 focus:ring-primary accent-border" />
                
                <div class="flex gap-2 mb-6">
                    <button id="btn-expense" class="flex-1 bg-secondary/20 text-secondary p-3 rounded-lg font-bold text-sm" onclick="window.txType='expense'">Despesa</button>
                    <button id="btn-income" class="flex-1 bg-surface-container-highest text-on-surface-variant p-3 rounded-lg font-bold text-sm" onclick="window.txType='income'">Receita</button>
                </div>

                <div class="flex gap-3">
                    <button class="flex-1 p-4 rounded-xl bg-surface-highest text-sm font-bold" onclick="window.closeTransactionModal()">Voltar</button>
                    <button class="flex-1 p-4 rounded-xl accent-bg text-sm font-bold" onclick="window.saveTransaction()">Salvar</button>
                </div>
            </div>
        </div>
    `;
    
    // Initial type
    window.txType = 'expense';
}

window.showTransactionModal = () => {
    document.getElementById('tx-modal').style.display = 'flex';
};

window.closeTransactionModal = () => {
    document.getElementById('tx-modal').style.display = 'none';
};

window.saveTransaction = async () => {
    const title = document.getElementById('tx-title').value;
    const amount = document.getElementById('tx-amount').value;
    const type = window.txType;

    if (!title || !amount) return alert('Preencha os campos!');

    await DB.addTransaction({
        title, amount, type, date: new Date().toISOString().split('T')[0]
    });

    window.closeTransactionModal();
    renderFinances();
};
