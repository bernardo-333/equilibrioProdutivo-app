import { DB } from './database.js';
import { renderDashboard } from './controllers/dashboard-controller.js';
import { renderMonthly } from './ui-monthly.js';
import { renderFinances } from './ui-finances.js';
import { renderSettings } from './ui-settings.js';

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .catch(err => console.error('SW registration failed:', err));
  });
}

// App Initialization
class App {
    constructor() {
        this.currentTab = 'tab-dashboard';
        this.initNavigation();
        this.loadSettings();
        
        // Initial Render
        this.renderTab(this.currentTab);
        
        // Update header date
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        let dateStr = new Date().toLocaleDateString('pt-BR', options);
        dateStr = dateStr.replace('.', '').replace(' de ', ' ').replace('.', '');
        document.getElementById('header-date').textContent = dateStr;

        this.initScrollHeader();
    }

    initScrollHeader() {
        let lastScroll = 0;
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 60 && currentScroll > lastScroll) {
                // Scroll down
                header.classList.add('-translate-y-full', 'opacity-0');
                header.classList.remove('shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]');
            } else {
                // Scroll up
                header.classList.remove('-translate-y-full', 'opacity-0');
                if(currentScroll > 10) header.classList.add('shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]');
            }
            lastScroll = currentScroll;
        });
    }

    async loadSettings() {
        const settings = await DB.getSettings();
        this.applyAccentColor(settings.accent_color);
    }

    applyAccentColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        // We could calculate a slightly darker container color for --accent-container
    }

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.target;
                const title = item.dataset.title;
                
                if (target === this.currentTab) return; // already active

                // Update UI state
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.getElementById(target).classList.add('active');

                // Update Bottom Nav Styling
                navItems.forEach(nav => {
                    nav.classList.remove('accent-text');
                    const icon = nav.querySelector('.material-symbols-outlined');
                    icon.classList.remove('filled');
                });
                
                item.classList.add('accent-text');
                const targetIcon = item.querySelector('.material-symbols-outlined');
                targetIcon.classList.add('filled');

                // Update App Bar Title
                document.getElementById('header-title').innerHTML = title;

                this.currentTab = target;
                this.renderTab(target);
            });
        });
    }

    renderTab(tabId) {
        switch(tabId) {
            case 'tab-dashboard':
                renderDashboard();
                break;
            case 'tab-monthly':
                renderMonthly();
                break;
            case 'tab-finances':
                renderFinances();
                break;
            case 'tab-settings':
                renderSettings();
                break;
        }
    }
}

// Start App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
