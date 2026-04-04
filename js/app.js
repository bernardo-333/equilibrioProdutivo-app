import { DB } from './database.js';
import { renderDashboard } from './controllers/dashboard-controller.js';
import { renderPlanner } from './controllers/planner-controller.js';
import { renderFinances } from './ui-finances.js';
import { renderSettings } from './ui-settings.js';

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .catch(err => console.error('SW registration failed:', err));
  });
}

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIlCbxhxEucKdBNyMWEwRuFOpEo0dVQx8",
  authDomain: "equilibrioprodutivo-app.firebaseapp.com",
  databaseURL: "https://equilibrioprodutivo-app-default-rtdb.firebaseio.com",
  projectId: "equilibrioprodutivo-app",
  storageBucket: "equilibrioprodutivo-app.firebasestorage.app",
  messagingSenderId: "785521986199",
  appId: "1:785521986199:web:449d7fe7979e0aad8db7d2",
  measurementId: "G-2FZ69XYWZJ"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function ensureToastHost() {
    let host = document.getElementById('app-toast-host');
    if (!host) {
        host = document.createElement('div');
        host.id = 'app-toast-host';
        host.className = 'app-toast-host';
        document.body.appendChild(host);
    }
    return host;
}

window.showToast = (message, type = 'info') => {
    const host = ensureToastHost();
    const toast = document.createElement('div');
    toast.className = `app-toast app-toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 220);
    }, 2400);
};

// App Initialization
class App {
    constructor(user) {
        this.user = user;
        this.currentTab = 'tab-dashboard';
        this.initNavigation();
        
        // Initial Render
        this.renderTab(this.currentTab);
        
        // Update header date
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        let dateStr = new Date().toLocaleDateString('pt-BR', options);
        dateStr = dateStr.replace('.', '').replace(' de ', ' ').replace('.', '');
        document.getElementById('header-date').textContent = dateStr;

        // Update user avatar in header
        const avatar = document.getElementById('user-avatar');
        if (avatar && this.user.photoURL) {
             avatar.innerHTML = `<img src="${this.user.photoURL}" alt="User Avatar" class="w-full h-full object-cover">`;
        }

        this.initScrollHeader();
        this.updateDynamicGreeting();
    }

    getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Bom dia';
        if (hour >= 12 && hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    getGreetingMeta() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return { text: 'Bom dia', icon: 'wb_sunny', iconClass: 'text-amber-300' };
        }
        if (hour >= 12 && hour < 18) {
            return { text: 'Boa tarde', icon: 'partly_cloudy_day', iconClass: 'text-orange-300' };
        }
        return { text: 'Boa noite', icon: 'dark_mode', iconClass: 'text-blue-300' };
    }

    buildDashboardTitle() {
        const greeting = this.getGreetingMeta();
        const firstName = this.user.displayName ? this.user.displayName.split(' ')[0] : 'Usuário';
        return `<span class='inline-flex items-center gap-1.5 text-xl accent-text'><span>${greeting.text}</span><span class='material-symbols-outlined ${greeting.iconClass}' style="font-size: 19px; font-variation-settings: 'FILL' 1;">${greeting.icon}</span></span><br/>${firstName}`;
    }

    updateDynamicGreeting() {
        const dynamicTitle = this.buildDashboardTitle();
        
        if (this.currentTab === 'tab-dashboard') {
            document.getElementById('header-title').innerHTML = dynamicTitle;
        }
        
        // Also update the data-title attribute for future clicks
        const navDash = document.getElementById('nav-dashboard');
        if (navDash) navDash.setAttribute('data-title', dynamicTitle);
    }

    async signOut() {
        if(confirm('Tem certeza que deseja sair da sua conta?')) {
            await firebase.auth().signOut();
        }
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

    applyAccentColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        // We could calculate a slightly darker container color for --accent-container
    }

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.target;
                let title = item.dataset.title;
                
                if (target === 'tab-dashboard') {
                    title = this.buildDashboardTitle();
                }
                
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
            case 'tab-planner':
                renderPlanner();
                break;
            case 'tab-finances':
                renderFinances();
                break;
        }
    }
}

// Auth Lifecycle & UI State
document.addEventListener('DOMContentLoaded', () => {
    const authScreen = document.getElementById('auth-screen');
    const authLoading = document.getElementById('auth-loading');
    const authLoginBox = document.getElementById('auth-login-box');
    const btnGoogle = document.getElementById('btn-login-google');
    
    const appContainer = document.getElementById('app-container');
    const mainHeader = document.getElementById('main-header');
    const bottomNav = document.getElementById('bottom-nav');

    btnGoogle.addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.error("Erro no login com google:", error);
            window.showToast?.('Erro ao realizar login. Tente novamente.', 'error');
        }
    });

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // Logged in
            
            // Pass UID to database
            DB.init(user.uid);

            // Hide auth screen, show app UI
            authScreen.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                authScreen.classList.add('hidden');
                
                // Show Main App
                appContainer.classList.remove('opacity-0', 'pointer-events-none');
                mainHeader.classList.remove('opacity-0', 'pointer-events-none');
                
                bottomNav.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-full');
                document.body.classList.remove('overflow-hidden');
                
                if (!window.app) {
                    window.app = new App(user);
                } else {
                    window.app.renderTab(window.app.currentTab);
                }

            }, 500);

        } else {
            // Not logged in
            
            // Show auth blocks
            authScreen.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            authLoading.classList.add('hidden');
            authLoginBox.classList.remove('hidden');

            // Hide App UI
            appContainer.classList.add('opacity-0', 'pointer-events-none');
            mainHeader.classList.add('opacity-0', 'pointer-events-none');
            bottomNav.classList.add('opacity-0', 'pointer-events-none', 'translate-y-full');
            
            window.app = null;
        }
    });
});
