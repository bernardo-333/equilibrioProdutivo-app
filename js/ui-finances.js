import { DB } from './database.js';

// Module-level cache for re-use by modals
let _cachedLogs = {};
let _cachedEmergencyFund = 0;

// ─── Helpers ────────────────────────────────────────────────────────────────

function _fmt(v) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function _balanceColor(v) {
    if (v > 0) return 'text-green-400';
    if (v < 0) return 'text-red-400';
    return 'text-on-surface-variant';
}

function _calcBalances(allLogs) {
    const logs = Object.values(allLogs || {});
    const diaBalance = logs.reduce((s, l) => s + Number(l.income_dia || 0) - Number(l.expense_dia || 0), 0);
    const dinheiroBalance = logs.reduce((s, l) => s + Number(l.income_din || 0) - Number(l.expense_din || 0), 0);
    return { diaBalance, dinheiroBalance };
}

function _formatDateLabel(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${days[date.getDay()]}, ${String(d).padStart(2, '0')} ${months[m - 1]}`;
}

// ─── Cards HTML ──────────────────────────────────────────────────────────────

function _renderCards(diaBalance, dinheiroBalance, emergencyFund) {
    const diaColor = _balanceColor(diaBalance);
    const dinColor = _balanceColor(dinheiroBalance);

    return `
    <section class="px-4 pt-6 pb-10 space-y-4">
        <div class="px-1 mb-2">
            <h2 class="text-2xl font-extrabold">Finanças</h2>
            <p class="text-xs text-on-surface-variant mt-1">Visão geral das suas carteiras</p>
        </div>

        <!-- Card Dia a Dia -->
        <button onclick="window.openFinDetailModal('dia')"
            class="w-full text-left rounded-3xl bg-surface-container-low border border-white/[0.08] p-5 active:scale-[0.98] transition-transform cursor-pointer">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-blue-400" style="font-size:18px">wallet</span>
                    </div>
                    <span class="text-sm font-bold text-on-surface-variant">Dia a Dia</span>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant/40" style="font-size:20px">chevron_right</span>
            </div>
            <div class="px-1">
                <p class="text-2xl font-extrabold ${diaColor}">${_fmt(diaBalance)}</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">Saldo acumulado · toque para detalhes</p>
            </div>
        </button>

        <!-- Card Meu Dinheiro -->
        <button onclick="window.openFinDetailModal('din')"
            class="w-full text-left rounded-3xl bg-surface-container-low border border-white/[0.08] p-5 active:scale-[0.98] transition-transform cursor-pointer">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-violet-400" style="font-size:18px">savings</span>
                    </div>
                    <span class="text-sm font-bold text-on-surface-variant">Meu Dinheiro</span>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant/40" style="font-size:20px">chevron_right</span>
            </div>
            <div class="px-1">
                <p class="text-2xl font-extrabold ${dinColor}">${_fmt(dinheiroBalance)}</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">Saldo acumulado · toque para detalhes</p>
            </div>
        </button>

        <!-- Card Reserva de Emergência -->
        <div class="rounded-3xl bg-surface-container-low border border-white/[0.08] p-5">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-amber-400" style="font-size:18px">shield</span>
                    </div>
                    <span class="text-sm font-bold text-on-surface-variant">Reserva de Emergência</span>
                </div>
                <button onclick="window.openEmergencyEditModal()"
                    class="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size:18px">edit</span>
                </button>
            </div>
            <div class="px-1">
                <p class="text-2xl font-extrabold text-amber-400">${_fmt(emergencyFund)}</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">Valor definido manualmente</p>
            </div>
        </div>
    </section>
    `;
}

// ─── Modals HTML ─────────────────────────────────────────────────────────────

function _injectModals() {
    const host = document.createElement('div');
    host.id = 'fin-modals-host';
    host.innerHTML = `
    <!-- Finance Detail Modal -->
    <div id="fin-detail-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
        <div id="fin-detail-modal-overlay"
            class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500"
            onclick="window.closeFinDetailModal()"></div>
        <div id="fin-detail-modal-sheet"
            class="relative w-full h-[88vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
            <div class="w-12 h-[5px] bg-white/10 rounded-full mx-auto mt-3 mb-1 flex-none"></div>
            <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-none">
                <div class="flex items-center gap-3">
                    <div id="fin-detail-icon" class="w-9 h-9 rounded-xl flex items-center justify-center flex-none"></div>
                    <h3 id="fin-detail-title" class="text-lg font-extrabold"></h3>
                </div>
                <button onclick="window.closeFinDetailModal()"
                    class="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size:20px">close</span>
                </button>
            </div>
            <div id="fin-detail-content" class="flex-1 overflow-y-auto px-6 py-4 pb-10 hide-scrollbar"></div>
        </div>
    </div>

    <!-- Emergency Fund Edit Modal -->
    <div id="emergency-edit-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
        <div id="emergency-edit-modal-overlay"
            class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500"
            onclick="window.closeEmergencyEditModal()"></div>
        <div id="emergency-edit-modal-sheet"
            class="relative w-full bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
            <div class="w-12 h-[5px] bg-white/10 rounded-full mx-auto mt-3 mb-1 flex-none"></div>
            <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-none">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-amber-400" style="font-size:18px">shield</span>
                    </div>
                    <h3 class="text-lg font-extrabold">Reserva de Emergência</h3>
                </div>
                <button onclick="window.closeEmergencyEditModal()"
                    class="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size:20px">close</span>
                </button>
            </div>
            <div class="px-6 py-6 space-y-5">
                <div class="space-y-2">
                    <label class="text-xs font-bold tracking-widest uppercase text-on-surface-variant/70">Valor da Reserva</label>
                    <div class="flex items-center gap-3 bg-surface-container-highest rounded-2xl px-4 py-3 border border-white/[0.06]">
                        <span class="text-on-surface-variant font-bold text-sm">R$</span>
                        <input id="input-emergency-fund" type="number" step="0.01" min="0" inputmode="decimal"
                            class="flex-1 bg-transparent border-none outline-none text-xl font-extrabold text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0"
                            placeholder="0,00">
                    </div>
                </div>
                <button onclick="window.saveEmergencyFund()"
                    class="w-full h-14 rounded-[20px] bg-amber-400 text-black font-extrabold text-base active:scale-95 transition-transform">
                    Salvar
                </button>
            </div>
            <div class="h-8 flex-none"></div>
        </div>
    </div>
    `;
    document.body.appendChild(host);
}

// ─── Modal open / close ──────────────────────────────────────────────────────

function _openModal(id) {
    const el = document.getElementById(id);
    el.classList.remove('hidden');
    el.classList.add('flex');
    requestAnimationFrame(() => {
        document.getElementById(`${id}-overlay`).classList.remove('opacity-0');
        document.getElementById(`${id}-sheet`).classList.remove('translate-y-full');
    });
}

function _closeModal(id) {
    document.getElementById(`${id}-overlay`).classList.add('opacity-0');
    document.getElementById(`${id}-sheet`).classList.add('translate-y-full');
    setTimeout(() => {
        const el = document.getElementById(id);
        el.classList.add('hidden');
        el.classList.remove('flex');
    }, 500);
}

// ─── Detail modal content ─────────────────────────────────────────────────────

function _populateDetailModal(type) {
    const isDia = type === 'dia';

    const titleEl = document.getElementById('fin-detail-title');
    const iconEl = document.getElementById('fin-detail-icon');
    const contentEl = document.getElementById('fin-detail-content');

    if (isDia) {
        titleEl.textContent = 'Dia a Dia';
        iconEl.className = 'w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-none';
        iconEl.innerHTML = '<span class="material-symbols-outlined text-blue-400" style="font-size:18px">wallet</span>';
    } else {
        titleEl.textContent = 'Meu Dinheiro';
        iconEl.className = 'w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-none';
        iconEl.innerHTML = '<span class="material-symbols-outlined text-violet-400" style="font-size:18px">savings</span>';
    }

    const incomeKey = isDia ? 'income_dia' : 'income_din';
    const expenseKey = isDia ? 'expense_dia' : 'expense_din';

    const entries = Object.entries(_cachedLogs)
        .filter(([, log]) => Number(log[incomeKey] || 0) > 0 || Number(log[expenseKey] || 0) > 0)
        .sort((a, b) => b[0].localeCompare(a[0]));

    if (entries.length === 0) {
        contentEl.innerHTML = `
            <div class="flex flex-col items-center justify-center h-48 gap-3">
                <span class="material-symbols-outlined text-on-surface-variant/30" style="font-size:44px">receipt_long</span>
                <p class="text-sm text-on-surface-variant/60">Nenhuma movimentação registrada</p>
            </div>
        `;
        return;
    }

    // Totals
    const totalIncome  = entries.reduce((s, [, l]) => s + Number(l[incomeKey]  || 0), 0);
    const totalExpense = entries.reduce((s, [, l]) => s + Number(l[expenseKey] || 0), 0);
    const totalNet     = totalIncome - totalExpense;
    const totalColor   = _balanceColor(totalNet);

    // Accent color for income column matches the card icon color
    const incomeAccent = isDia ? 'text-blue-400' : 'text-violet-400';

    // Grid columns: date | ganho | gasto | saldo
    const COLS = '1fr 80px 80px 84px';

    // Column headers (sticky inside scroll area)
    const tableHeader = `
        <div class="grid items-center gap-2 px-3 py-2 border-b border-white/10 mb-1 sticky top-0 bg-surface-container-low z-10"
             style="grid-template-columns:${COLS}">
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Data</span>
            <span class="text-[10px] font-bold uppercase tracking-widest ${incomeAccent} text-right">Ganho</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-red-400 text-right">Gasto</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 text-right">Saldo</span>
        </div>
    `;

    // Data rows — same style as getDiaryTableRow in planner-view.js
    const rows = entries.map(([dateStr, log]) => {
        const income  = Number(log[incomeKey]  || 0);
        const expense = Number(log[expenseKey] || 0);
        const net     = income - expense;
        const netColor = _balanceColor(net);
        const netSign  = net > 0 ? '+' : '';
        const label    = _formatDateLabel(dateStr);

        const fmtCell = (v) => v > 0
            ? v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
            : `<span class="text-on-surface-variant/30">—</span>`;

        return `
            <div class="grid items-center gap-2 px-3 py-3 border-b border-white/5
                        hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors"
                 style="grid-template-columns:${COLS}">
                <span class="text-sm font-extrabold text-[var(--text-primary)] leading-none">${label}</span>
                <span class="text-xs font-bold ${incomeAccent} text-right">${fmtCell(income)}</span>
                <span class="text-xs font-bold text-red-400 text-right">${fmtCell(expense)}</span>
                <span class="text-xs font-extrabold ${netColor} text-right">${net !== 0 ? netSign + _fmt(net).replace('R$\u00a0','') : '—'}</span>
            </div>
        `;
    }).join('');

    // Totals footer row
    const totalsRow = `
        <div class="grid items-center gap-2 px-3 py-3 mt-1 bg-surface-container rounded-2xl border border-white/5"
             style="grid-template-columns:${COLS}">
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Total</span>
            <span class="text-xs font-extrabold ${incomeAccent} text-right">${totalIncome > 0 ? totalIncome.toLocaleString('pt-BR',{minimumFractionDigits:2}) : '—'}</span>
            <span class="text-xs font-extrabold text-red-400 text-right">${totalExpense > 0 ? totalExpense.toLocaleString('pt-BR',{minimumFractionDigits:2}) : '—'}</span>
            <span class="text-xs font-extrabold ${totalColor} text-right">${totalNet !== 0 ? (totalNet > 0 ? '+' : '') + _fmt(totalNet).replace('R$\u00a0','') : '—'}</span>
        </div>
    `;

    contentEl.innerHTML = tableHeader + rows + totalsRow;
}

// ─── Public API (window functions) ───────────────────────────────────────────

window.openFinDetailModal = (type) => {
    _populateDetailModal(type);
    _openModal('fin-detail-modal');
};

window.closeFinDetailModal = () => _closeModal('fin-detail-modal');

window.openEmergencyEditModal = () => {
    const input = document.getElementById('input-emergency-fund');
    if (input) {
        input.value = _cachedEmergencyFund > 0 ? _cachedEmergencyFund.toFixed(2) : '';
    }
    _openModal('emergency-edit-modal');
};

window.closeEmergencyEditModal = () => _closeModal('emergency-edit-modal');

window.saveEmergencyFund = async () => {
    const input = document.getElementById('input-emergency-fund');
    const val = parseFloat(input?.value) || 0;
    try {
        await DB.saveEmergencyFund(val);
        window.closeEmergencyEditModal();
        setTimeout(() => renderFinances(), 520);
        window.showToast('Reserva de emergência atualizada', 'success');
    } catch (e) {
        console.error('[Finances] Erro ao salvar reserva', e);
        window.showToast('Erro ao salvar reserva', 'error');
    }
};

// ─── Entry point ──────────────────────────────────────────────────────────────

export async function renderFinances() {
    const root = document.getElementById('finances-root');

    // Loading skeleton
    root.innerHTML = `
        <section class="px-4 pt-6 space-y-4">
            <div class="px-1 mb-2">
                <div class="h-7 w-28 rounded-xl bg-white/[0.06] mb-2 animate-pulse"></div>
                <div class="h-3 w-44 rounded-full bg-white/[0.04] animate-pulse"></div>
            </div>
            ${[1, 2, 3].map(() => `
                <div class="rounded-3xl bg-surface-container-low border border-white/[0.08] p-5 animate-pulse">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-9 h-9 rounded-xl bg-white/[0.06] flex-none"></div>
                        <div class="h-3 w-24 rounded-full bg-white/[0.06]"></div>
                    </div>
                    <div class="h-7 w-32 rounded-xl bg-white/[0.06] mb-2"></div>
                    <div class="h-3 w-40 rounded-full bg-white/[0.04]"></div>
                </div>
            `).join('')}
        </section>
    `;

    const [allLogs, emergencyFund] = await Promise.all([
        DB.getAllDailyLogs(),
        DB.getEmergencyFund()
    ]);

    _cachedLogs = allLogs || {};
    _cachedEmergencyFund = emergencyFund;

    const { diaBalance, dinheiroBalance } = _calcBalances(_cachedLogs);

    root.innerHTML = _renderCards(diaBalance, dinheiroBalance, emergencyFund);

    // Re-inject modals (remove stale ones first to handle re-renders)
    const existingHost = document.getElementById('fin-modals-host');
    if (existingHost) existingHost.remove();
    _injectModals();
}
