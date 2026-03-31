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

export async function renderDashboard() {
    const root = document.getElementById('dashboard-root');
    try {
        const todayLog = await DB.getTodayLog();
        const finances = await DB.getFinances();

        // Calculate completion metrics
        let completedCheckins = 0;
        let habitsCompleted = 0;
        const totalCheckins = ALL_HABITS.length + 3; // 8 Habits + Sleep + Mood + Water
        
        if (!todayLog.habits) todayLog.habits = {};

        for (const habit of ALL_HABITS) {
            if (todayLog.habits[habit.id]) {
                completedCheckins++;
                habitsCompleted++;
            }
        }

        if (todayLog.sleep) completedCheckins++;
        if (todayLog.mood) completedCheckins++;
        if ((todayLog.water || 0) > 0) completedCheckins++;

        const todayPct = Math.round((completedCheckins / totalCheckins) * 100);
        const missing = totalCheckins - completedCheckins;
        const isAllDone = completedCheckins === totalCheckins;

        // MVP Mock of weekly data (Monday-Friday)
        const weekData = [
            { day: 'S', state: 'past', pct: 100 },
            { day: 'T', state: 'past', pct: 33 },
            { day: 'Q', state: 'today', pct: todayPct },
            { day: 'Q', state: 'future', pct: 0 },
            { day: 'S', state: 'future', pct: 0 }
        ];

        // Rule 4: Dynamic logic for Weekly Snap Message
        const perfectDaysCount = weekData.filter(d => d.pct === 100).length;
        const isMonday = new Date().getDay() === 1;
        const todayIdx = weekData.findIndex(d => d.state === 'today');
        
        let snapMessage = `${perfectDaysCount} dias perfeitos. <span class="text-primary accent-text">Não quebre a sequência hoje!</span>`;
        
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
            todayLog, finances, todayPct, missing, isAllDone, weekData, DEFAULT_HABITS: ALL_HABITS, snapMessage 
        });

        // Ensure dynamic dom texts are synced
        await recalculateProgress();
    } catch (e) {
        console.error(e);
        root.innerHTML = `<div style="color:red; padding:20px; word-break:break-all;"><h3>Erro no Dashboard:</h3><pre>${e.message}\n${e.stack}</pre></div>`;
    }
}

window.openCheckinModal = () => {
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
    
    // Trigger animations smooth slide up
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });
};

window.closeCheckinModal = () => {
    const el = document.getElementById('checkin-modal');
    const overlay = document.getElementById('checkin-modal-overlay');
    const sheet = document.getElementById('checkin-modal-sheet');

    // Trigger animations smoothly slide down
    overlay.classList.add('opacity-0');
    sheet.classList.add('translate-y-full');
    
    // Wait for the transition to finish to hide elements
    setTimeout(() => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }, 500); // matches duration-500
};

// ----- LIBRARY SECTION LOGIC -----

window.openLibraryModal = () => {
    const el = document.getElementById('library-modal');
    const overlay = document.getElementById('library-modal-overlay');
    const sheet = document.getElementById('library-modal-sheet');

    el.classList.remove('hidden');
    el.classList.add('flex');
    
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('translate-y-full');
    });
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

window.openLibraryForm = (id = null) => {
    const el = document.getElementById('library-form-modal');
    const overlay = document.getElementById('library-form-overlay');
    const sheet = document.getElementById('library-form-sheet');
    const title = document.getElementById('lbl-lib-form-title');
    const btnDel = document.getElementById('btn-lib-delete');

    // Default to 'course' UI state
    window.setLibraryType('course');
    window.setLibraryRating(0); // Clear stars
    
    // Simulate setting 'in_progress' by default
    const progBtn = document.querySelector('.lib-status-btn[data-val="in_progress"]');
    if (progBtn) window.setLibraryStatus(progBtn);

    if (id && id.startsWith('mock_')) {
        title.innerText = 'Editar Obra';
        btnDel.classList.remove('hidden'); // Show delete button
        // Fake populate logic for MVP UI
        document.getElementById('lib-emoji').value = '🎓';
        document.getElementById('lib-title').value = 'UI Design Avançado';
        document.getElementById('lib-author').value = 'Figma Master';
        document.getElementById('lib-current').value = '12';
        document.getElementById('lib-total').value = '50';
        window.setLibraryRating(5);
    } else {
        title.innerText = 'Nova Obra';
        btnDel.classList.add('hidden');
        // Clear inputs
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

window.saveLibraryForm = () => {
    // Fake UX trigger. Closes Form Modal returning users to Library List UI feeling accomplished.
    window.closeLibraryForm();
};

window.setWaterInput = (liters) => {
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

window.selectChip = (element, groupClass) => {
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
};

window.toggleHabit = async (habitId, isCompleted) => {
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

async function recalculateProgress() {
    const todayLog = await DB.getTodayLog();
    let comp = 0;
    let habitsCompleted = 0;
    
    if (!todayLog.habits) todayLog.habits = {};
    for (const habit of ALL_HABITS) {
        if (todayLog.habits[habit.id]) {
            comp++;
            habitsCompleted++;
        }
    }

    if (todayLog.sleep) comp++;
    if (todayLog.mood) comp++;
    if ((todayLog.water || 0) > 0) comp++;
    
    const tota = ALL_HABITS.length + 3;
    const progressW = (comp / tota) * 100;
    
    const lblHabitCounter = document.getElementById('lbl-habit-counter');
    if (lblHabitCounter) lblHabitCounter.innerText = `${habitsCompleted}/${ALL_HABITS.length}`;
    
    const internalBar = document.getElementById('checkin-internal-bar');
    if (internalBar) internalBar.style.width = `${progressW}%`;
    
    const pctText = document.getElementById('checkin-pct-text');
    if (pctText) pctText.innerText = `${Math.round(progressW)}%`;
    
    const container = document.getElementById('checkin-container');

    if (comp === tota) {
        if (container) {
            container.classList.remove('border-transparent');
            container.classList.add('border', 'border-primary/50', 'accent-border', 'shadow-[0_0_20px_var(--accent-color)]', 'accent-glow');
        }
        
        // Auto Close the accordion smoothly
        const el = document.getElementById('checkin-content');
        const icon = document.getElementById('checkin-icon');
        if (el && icon && !el.classList.contains('hidden')) {
            setTimeout(() => {
                el.style.maxHeight = '0px';
                el.style.opacity = '0';
                el.style.paddingBottom = '0px';
                icon.classList.remove('rotate-180');
                setTimeout(() => {
                    el.classList.add('hidden');
                    // Fully Re-render the dashboard to update Weekly Snap glow!
                    renderDashboard();
                }, 300);
            }, 600); // 600ms reward feeling before sliding up
        } else {
            renderDashboard();
        }
    } else {
        if (container) {
            container.classList.add('border-transparent');
            container.classList.remove('border', 'border-primary/50', 'accent-border', 'shadow-[0_0_20px_var(--accent-color)]', 'accent-glow');
        }
    }
}

window.openFinanceModal = async (type) => {
    const el = document.getElementById('finance-modal');
    const overlay = document.getElementById('finance-modal-overlay');
    const sheet = document.getElementById('finance-modal-sheet');
    const title = document.getElementById('finance-modal-title');
    const content = document.getElementById('finance-modal-content');

    if (type === 'dia') {
        title.innerText = 'Dia a Dia';
        content.innerHTML = `
            <div class="bg-surface-container rounded-2xl p-4 border border-white/5 space-y-1 mb-2">
                <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant block">Saldo Atual</span>
                <span class="text-2xl font-extrabold tracking-tighter text-[var(--text-primary)] font-headline">R$ 0,00</span>
            </div>
            <div class="flex justify-between items-center py-2 px-1">
                <span class="text-on-surface-variant font-medium text-sm">Gasto na semana</span>
                <span class="text-red-400 font-bold">- R$ 120,50</span>
            </div>
            <div class="flex justify-between items-center py-2 px-1 border-t border-white/5">
                <span class="text-on-surface-variant font-medium text-sm">Gasto no mês</span>
                <span class="text-red-400 font-bold">- R$ 450,00</span>
            </div>
        `;
    } else {
        const balance = document.querySelector('#finance-modal').ownerDocument ? "..." : await DB.getFinances(); 
        title.innerText = 'Meu Dinheiro';
        content.innerHTML = `
            <div class="bg-primary/10 rounded-2xl p-4 border border-primary/20 accent-border space-y-1 mb-2">
                <span class="text-[10px] font-bold tracking-widest uppercase text-primary accent-text block">Saldo Atual</span>
                <span class="text-2xl font-extrabold tracking-tighter text-[var(--text-primary)] font-headline">R$ 1.250,00</span>
            </div>
            <div class="flex justify-between items-center py-2 px-1">
                <span class="text-on-surface-variant font-medium text-sm">Balanço da semana</span>
                <span class="text-primary accent-text font-bold">+ R$ 150,00</span>
            </div>
            <div class="flex justify-between items-center py-2 px-1 border-t border-white/5">
                <span class="text-on-surface-variant font-medium text-sm">Balanço do mês</span>
                <span class="text-primary accent-text font-bold">+ R$ 1.250,00</span>
            </div>
        `;
    }

    // Display modal
    el.classList.remove('hidden');
    el.classList.add('flex');
    
    // Animate smoothly
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        sheet.classList.remove('scale-95', 'opacity-0');
        sheet.classList.add('scale-100', 'opacity-100');
    });
};

window.closeFinanceModal = () => {
    const overlay = document.getElementById('finance-modal-overlay');
    const sheet = document.getElementById('finance-modal-sheet');
    const el = document.getElementById('finance-modal');
    
    overlay.classList.add('opacity-0');
    sheet.classList.remove('scale-100', 'opacity-100');
    sheet.classList.add('scale-95', 'opacity-0');
    
    // Wait for translation to finish before dropping flex
    setTimeout(() => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }, 300);
};
