import { DB } from './database.js';

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
                <button class="w-full text-left p-4 rounded-xl bg-surface-container-highest flex items-center justify-between group hover:bg-surface-highest transition-colors">
                    <span class="text-sm font-bold">Gerenciar Hábitos Diários</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-white">chevron_right</span>
                </button>
                <div class="my-2"></div>
                <button class="w-full text-left p-4 rounded-xl bg-surface-container-highest flex items-center justify-between group hover:bg-surface-highest transition-colors">
                    <span class="text-sm font-bold">Exportar Dados</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-white">download</span>
                </button>
                <div class="my-2"></div>
                <button onclick="window.clearData()" class="w-full text-left p-4 rounded-xl bg-secondary/10 flex items-center justify-between group hover:bg-secondary/20 transition-colors">
                    <span class="text-sm font-bold text-secondary">Apagar todos os dados</span>
                    <span class="material-symbols-outlined text-secondary">delete</span>
                </button>
            </div>
        </section>
    `;
}

window.changeAccentColor = async (colorHex) => {
    // Save to DB
    await DB.saveSettings({ accent_color: colorHex });
    
    // Apply immediately to CSS root
    document.documentElement.style.setProperty('--accent-color', colorHex);
    // document.documentElement.style.setProperty('--accent-container', adjustColorBrightness(colorHex, -0.2)); 
    
    // re-render settings to show selected state
    renderSettings();
};

window.clearData = () => {
    if(confirm('Tem certeza? Isso apagará o MVP inteiro do localStorage.')){
        localStorage.removeItem('equilibrio_produtivo_data');
        window.location.reload();
    }
};
