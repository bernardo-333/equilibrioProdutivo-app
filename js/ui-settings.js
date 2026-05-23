import { DB } from './database.js';
import { renderDashboard } from './controllers/dashboard-controller.js';
import { renderPlanner } from './controllers/planner-controller.js';

const HABIT_ICONS = [
    'wb_sunny', 'fitness_center', 'coffee', 'restaurant', 'school', 'menu_book',
    'restaurant_menu', 'edit_note', 'self_improvement', 'directions_run', 'bedtime',
    'water_drop', 'favorite', 'psychology', 'music_note', 'code', 'brush',
    'local_library', 'sports_soccer', 'hiking', 'spa', 'timer'
];

export async function renderSettings() {
    const root = document.getElementById('settings-root');
    const settings = await DB.getSettings();

    // List of pre-defined modern soft-dark colors
    const colors = [
        { name: 'Verde (Default)', hex: '#72fe8f' },
        { name: 'Azul', hex: '#4da6ff' },
        { name: 'Roxo', hex: '#d48bff' },
        { name: 'Vermelho', hex: '#ff5c5c' }
    ];

    root.innerHTML = `
        <section class="mb-12 mt-2">
            <h2 class="text-xl font-bold font-headline mb-6">Configurações</h2>
            
            <div class="glass-card p-6 rounded-2xl bg-[#2A2A2A] mb-6">
                <h3 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Tema e Cores</h3>
                
                <p class="text-xs text-on-surface-variant mb-4">Escolha a cor de destaque principal do aplicativo (Accent Color):</p>
                
                <div class="flex flex-wrap gap-4">
                    ${colors.map(color => `
                        <button onclick="window.changeAccentColor('${color.hex}')" 
                            class="w-12 h-12 rounded-full border-2 transition-transform active:scale-90 hover:scale-105 ${settings.accent_color === color.hex ? 'border-white scale-110' : 'border-transparent'}"
                            style="background-color: ${color.hex};"
                            title="${color.name}"></button>
                    `).join('')}
                </div>
            </div>

            <div class="glass-card p-6 rounded-2xl bg-[#2A2A2A]">
                <h3 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Dados</h3>
                <button onclick="window.openHabitsManager()" class="w-full text-left p-4 rounded-xl bg-surface-container-highest flex items-center justify-between group hover:bg-surface-highest transition-colors">
                    <span class="text-sm font-bold">Gerenciar Hábitos Diários</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-white">chevron_right</span>
                </button>
            </div>
        </section>
    `;
}

// ---- Habits Manager ----

function renderHabitsManagerContent() {
    const habits = window.APP_HABITS || [];
    const iconOptions = HABIT_ICONS.map(ic =>
        `<button data-icon="${ic}" onclick="window._habitIconPick('${ic}', this)" class="habit-icon-opt w-10 h-10 rounded-xl border border-white/10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all">
            <span class="material-symbols-outlined text-lg">${ic}</span>
        </button>`
    ).join('');

    return `
        <div class="space-y-4">
            <div class="space-y-2" id="habits-list-editable">
                ${habits.map((h, idx) => `
                <div class="flex items-center gap-3 p-3 bg-surface-container rounded-2xl border border-white/5">
                    <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-lg text-primary accent-text">${h.icon || 'check_circle'}</span>
                    </div>
                    <span class="flex-1 font-bold text-sm text-[var(--text-primary)]">${h.name}</span>
                    <button onclick="window._removeHabit('${h.id}')" class="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors flex-shrink-0">
                        <span class="material-symbols-outlined text-sm">remove</span>
                    </button>
                </div>`).join('')}
            </div>

            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-3">
                <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 block">Adicionar hábito</span>
                <input id="new-habit-name" type="text" placeholder="Nome do hábito..." class="w-full bg-surface-highest rounded-xl px-4 py-3 border border-white/10 text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Ícone</span>
                    <div class="flex flex-wrap gap-2" id="habit-icon-grid">
                        ${iconOptions}
                    </div>
                    <input type="hidden" id="new-habit-icon" value="check_circle">
                </div>
                <button onclick="window._addHabit()" class="w-full h-12 rounded-2xl bg-primary/20 border border-primary/30 text-primary font-bold text-sm hover:bg-primary/30 transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">add</span> Adicionar
                </button>
            </div>

            <button onclick="window._saveHabits()" class="w-full h-14 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-base shadow-xl active:scale-95 transition-transform">
                Salvar Hábitos
            </button>
            <p class="text-[11px] text-on-surface-variant/50 text-center">Os percentuais do dia serão calculados automaticamente com base nos hábitos ativos.</p>
        </div>
    `;
}

window.openHabitsManager = () => {
    let modal = document.getElementById('habits-manager-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'habits-manager-modal';
        modal.className = 'fixed inset-0 z-[600] hidden flex-col justify-end';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="hm-overlay" onclick="window.closeHabitsManager()"></div>
        <div class="relative w-full h-[90vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="hm-sheet">
            <div class="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                <div>
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-3"></div>
                    <h2 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline">Gerenciar Hábitos</h2>
                    <span class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/60">${(window.APP_HABITS || []).length} hábitos ativos</span>
                </div>
                <button onclick="window.closeHabitsManager()" class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-6 pb-12 hide-scrollbar">
                ${renderHabitsManagerContent()}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
        document.getElementById('hm-overlay').classList.remove('opacity-0');
        document.getElementById('hm-sheet').classList.remove('translate-y-full');
    });

    // Mark selected icon
    window._habitIconPick('check_circle', null);
};

window.closeHabitsManager = () => {
    const modal = document.getElementById('habits-manager-modal');
    const overlay = document.getElementById('hm-overlay');
    const sheet = document.getElementById('hm-sheet');
    if (!modal) return;
    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 500);
};

window._habitIconPick = (icon, btnEl) => {
    document.querySelectorAll('.habit-icon-opt').forEach(b => {
        b.classList.remove('border-primary', 'bg-primary/20', 'text-primary');
        b.classList.add('border-white/10', 'text-on-surface-variant');
    });
    const target = btnEl || document.querySelector(`.habit-icon-opt[data-icon="${icon}"]`);
    if (target) {
        target.classList.add('border-primary', 'bg-primary/20', 'text-primary');
        target.classList.remove('border-white/10', 'text-on-surface-variant');
    }
    const input = document.getElementById('new-habit-icon');
    if (input) input.value = icon;
};

window._addHabit = () => {
    const nameInput = document.getElementById('new-habit-name');
    const iconInput = document.getElementById('new-habit-icon');
    const name = nameInput?.value.trim();
    if (!name) { nameInput?.focus(); return; }

    const icon = iconInput?.value || 'check_circle';
    const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + Date.now();
    const habits = window.APP_HABITS || [];
    habits.push({ id, name, icon });
    window.APP_HABITS = habits;

    if (nameInput) nameInput.value = '';
    // Re-render list content
    const modal = document.getElementById('habits-manager-modal');
    const scrollArea = modal?.querySelector('.flex-1.overflow-y-auto');
    if (scrollArea) scrollArea.innerHTML = renderHabitsManagerContent();
    window._habitIconPick('check_circle', null);
};

window._removeHabit = (habitId) => {
    if ((window.APP_HABITS || []).length <= 1) {
        window.showToast?.('Você precisa ter pelo menos 1 hábito.', 'error');
        return;
    }
    window.APP_HABITS = (window.APP_HABITS || []).filter(h => h.id !== habitId);
    const modal = document.getElementById('habits-manager-modal');
    const scrollArea = modal?.querySelector('.flex-1.overflow-y-auto');
    if (scrollArea) scrollArea.innerHTML = renderHabitsManagerContent();
};

window._saveHabits = async () => {
    const habits = window.APP_HABITS || [];
    if (habits.length === 0) return;
    await DB.saveHabits(habits);
    window.closeHabitsManager();
    window.showToast?.('Hábitos salvos com sucesso!', 'info');
    // Re-render both tabs so changes take effect immediately
    if (window.app?.currentTab === 'tab-dashboard') {
        renderDashboard();
    } else if (window.app?.currentTab === 'tab-planner') {
        renderPlanner();
    }
};

window.changeAccentColor = async (colorHex) => {
    // Save to DB
    await DB.saveSettings({ accent_color: colorHex });
    
    // Apply immediately to CSS root
    document.documentElement.style.setProperty('--accent-color', colorHex);
    // document.documentElement.style.setProperty('--accent-container', adjustColorBrightness(colorHex, -0.2)); 
    
    // re-render settings to show selected state
    renderSettings();
};

