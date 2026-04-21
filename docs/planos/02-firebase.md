# Tornar o App Funcional + Firebase (Blueprint UberCalc)

## Contexto

O app já tem toda a UI pronta. Vamos seguir **exatamente o padrão do UberCalc**: Firebase Compat SDK via CDN, Google Sign-In, Realtime Database com listener `.on('value')`, `saveData()` salvando estado inteiro, localStorage como backup offline.

**Diferença do UberCalc**: Mantemos a estrutura modular (controllers/views separados) porque o app é maior — mas o padrão de dados e Firebase é idêntico.

---

## Fase 1 — Tornar Funcional com localStorage

> Primeiro, tudo funcionando local. Depois conectamos Firebase.

### 1.1 Library (Livros/Cursos) — CRUD Real

**Problema**: Dados mock hardcoded no controller. `saveLibraryForm()` não salva.

**Solução**:
- Adicionar `learning: []` no `database.js` com `getLibrary()`, `saveLibraryItem()`, `deleteLibraryItem()`
- Dashboard renderiza cards dinamicamente a partir dos dados reais
- Salvar re-renderiza a seção
- View/Edit carrega dados do DB

---

### 1.2 Kanban — CRUD Real

**Problema**: `saveKanbanForm()` faz `console.log`. Mock fallback quando vazio.

**Solução**:
- `saveKanbanForm()` → monta o card object → salva via `DB.saveKanbanData()`
- `deleteKanbanCard()` → remove do array e salva
- Drag-and-drop → `DB.saveKanbanData()` com a nova posição
- Após cada operação: `renderPlanner()` para re-render

---

### 1.3 Planner — Dados Reais do Check-in

**Problema**: Calendário, métricas e diário de bordo são mock.

**Solução**:
- `renderPlanner()` lê `DB.getMonthlyLogs(currentMonth)`
- Calcula `calendarData`: nível 0-3 baseado em % de hábitos do dia
- Calcula `historyDays`: converte cada log em `{ date, pct, mood, sleep, water, habits }`
- Calcula métricas: `perfectDays`, média sono/humor, soma gastos
- Sem dados = mostra estado vazio elegante

---

### 1.4 Check-in — Conectar Água e Telas

**Problema**: `setWaterInput()` muda visual mas não salva. Telas não salva.

**Solução**:
- `setWaterInput()` → `DB.updateDailyMetrics('water', liters)`  
- Conectar inputs de `screen_time` e `instagram` ao DB

---

### 1.5 Weekly Snap — Dados Reais

**Problema**: `weekData` é `[100, 33, todayPct, 0, 0]` hardcoded.

**Solução**: Calcular a partir dos últimos 5 dias úteis no `daily_logs`

---

### 1.6 Aba Financeira — Banner "Em Breve"

**Solução**: Adicionar `<div>` bonito no topo com mensagem de futuro upgrade

---

## Fase 2 — Integrar Firebase (Padrão UberCalc)

### 2.1 Adicionar SDKs no `index.html`

```html
<!-- Firebase SDK Compat (CDN, sem npm) -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
```

### 2.2 Criar `js/firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const fbDb = firebase.database();
```

### 2.3 Tela de Login (overlay no `index.html`)

```html
<div id="login-screen" class="fixed inset-0 z-[9999] bg-[#1E1E1E] flex flex-col items-center justify-center gap-6">
    <span class="text-6xl">🌿</span>
    <h1 class="text-3xl font-extrabold font-headline">Equilíbrio Produtivo</h1>
    <p class="text-on-surface-variant text-sm">Seus dados salvos na nuvem.</p>
    <button id="btn-login-google" onclick="loginGoogle()" class="...">
        Entrar com o Google
    </button>
    <div id="login-loading" class="hidden">...</div>
</div>
```

### 2.4 Refatorar `database.js` — Mesma interface, backend Firebase

```javascript
// ANTES (localStorage):
function getDb() { return JSON.parse(localStorage.getItem(KEY)); }
function saveDb(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

// DEPOIS (Firebase + backup local):
let appData = { ...initialState };
let currentUser = null;

function loadData() {
    if (!currentUser) return;
    fbDb.ref('users/' + currentUser.uid).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) appData = { ...initialState, ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); // backup
        // Re-render tab ativa
        window.app?.renderTab(window.app.currentTab);
    });
}

function saveData() {
    if (!currentUser) return;
    fbDb.ref('users/' + currentUser.uid).set(appData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); // backup local
}
```

> [!IMPORTANT]
> A interface pública do `DB` (getSettings, updateHabit, etc) **não muda**. Só muda a implementação interna de `getDb()` e `saveDb()`. Nenhum controller precisa ser alterado.

### 2.5 Auth Flow no `app.js`

```javascript
// Entry point muda para:
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            document.getElementById('login-screen').style.display = 'none';
            loadData();  // Inicia listener realtime
            window.app = new App();
        } else {
            currentUser = null;
            document.getElementById('login-screen').style.display = 'flex';
        }
    });
});
```

### 2.6 Regras de Segurança do Realtime Database

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 2.7 Estrutura dos Dados no Firebase

```
users/
  └── {uid}/
      ├── daily_logs/
      │   └── "2026-04-02": { habits: {...}, mood, sleep, water, screen_time, instagram }
      ├── learning: [
      │     { id, emoji, title, author, type, status, current, total, genre, rating, review }
      │   ]
      ├── kanban/
      │   ├── ideas: [{ id, emoji, title, type, objective, description, start, end }]
      │   ├── doing: [...]
      │   └── done: [...]
      ├── finances/
      │   ├── transactions: [...]
      │   └── balance: 0
      └── settings/
          └── accent_color: "#72fe8f"
```

---

## Fase 3 — Deploy

### Opção A: GitHub Pages (igual UberCalc)
1. Push para GitHub
2. Settings → Pages → main branch
3. Adicionar domínio no Firebase Auth → Authorized Domains

### Opção B: Firebase Hosting (alternativa)
1. `npm install -g firebase-tools`
2. `firebase init hosting` → public: `./`
3. `firebase deploy`

---

## Service Worker — Upgrade (Network First)

O `sw.js` atual é básico. Vou atualizar para o padrão UberCalc:

```javascript
const CACHE_NAME = 'equilibrio-v1';
const ASSETS = ['./index.html', './css/style.css', './js/app.js', ...];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(names => 
        Promise.all(names.map(n => n !== CACHE_NAME ? caches.delete(n) : null))
    ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).then(r => {
            caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone()));
            return r;
        }).catch(() => caches.match(e.request))
    );
});
```

---

## Open Questions

> [!IMPORTANT]
> **Projeto Firebase**: Você já tem um projeto Firebase para este app? Se sim, me passe o `firebaseConfig`. Se não, preciso que você crie um no [Firebase Console](https://console.firebase.google.com/) e me envie as credenciais.

> [!IMPORTANT]
> **Ordem de execução**: Posso fazer a **Fase 1** (tudo funcional com localStorage) agora e a Fase 2 (Firebase) quando você criar o projeto. Concordas?

> [!NOTE]
> **Nome no header**: "Bom dia, Bernardo" está hardcoded. Com Google Auth, posso usar `user.displayName` automaticamente. Quer isso?

---

## Checklist de Implementação

### Fase 1 — Funcional (localStorage)
- [ ] `database.js` — Adicionar CRUD de Library (`getLibrary`, `saveLibraryItem`, `deleteLibraryItem`)
- [ ] `dashboard-controller.js` — Renderizar Library dynamically do DB
- [ ] `dashboard-controller.js` — `saveLibraryForm()` → salva no DB + re-render
- [ ] `dashboard-controller.js` — Conectar `setWaterInput()` ao DB
- [ ] `planner-controller.js` — `saveKanbanForm()` → salva no DB + re-render
- [ ] `planner-controller.js` — `deleteKanbanCard()` → funcional
- [ ] `planner-controller.js` — Calendário com dados reais do `getMonthlyLogs()`
- [ ] `planner-controller.js` — Diário de bordo com dados reais
- [ ] `planner-controller.js` — Métricas calculadas (perfectDays, avgSleep, avgMood)
- [ ] `dashboard-controller.js` — Weekly Snap com dados reais
- [ ] `ui-finances.js` — Banner "em breve melhorias"
- [ ] Testar tudo end-to-end

### Fase 2 — Firebase
- [ ] Adicionar Firebase SDK CDN no `index.html`
- [ ] Criar `js/firebase-config.js`
- [ ] Criar tela de login overlay no `index.html`
- [ ] Refatorar `database.js` para Firebase + backup localStorage
- [ ] Auth flow no `app.js` com `onAuthStateChanged`
- [ ] Regras de segurança no Realtime Database
- [ ] Upgrade `sw.js` para Network First
- [ ] Migrar dados existentes do localStorage para Firebase (first-run)

### Fase 3 — Deploy
- [ ] Push GitHub
- [ ] Ativar GitHub Pages
- [ ] Adicionar domínio autorizado no Firebase Auth
- [ ] Testar no mobile (instalar PWA)
