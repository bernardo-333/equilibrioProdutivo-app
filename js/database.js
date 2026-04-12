/**
 * database.js
 * Abstraction layer for data storage using Firebase Realtime Database (Fase 2)
 * Includes a one-time migration from LocalStorage for seamless UX.
 */

const STORAGE_KEY = 'equilibrio_produtivo_data';

const initialState = {
  daily_logs: {},
  finances: {
    transactions: [],
    balance: 0
  },
  learning: [],
  kanban: {
    ideas: [],
    doing: [],
    done: []
  },
  settings: {
    accent_color: '#72fe8f'
  }
};

function getLocalDb() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return JSON.parse(JSON.stringify(initialState));
  try {
    const parsed = JSON.parse(data);
    return {
      daily_logs: parsed.daily_logs || {},
      finances: parsed.finances || { transactions: [], balance: 0 },
      learning: Array.isArray(parsed.learning) ? parsed.learning : [],
      kanban: parsed.kanban || { ideas: [], doing: [], done: [] },
      settings: parsed.settings || { accent_color: '#72fe8f' }
    };
  } catch (e) {
    return JSON.parse(JSON.stringify(initialState));
  }
}

const formatDateKeyLocal = (dateObj = new Date()) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getTodayStr = () => formatDateKeyLocal(new Date());

export const DB = {
  _uid: null,

  init: async (uid) => {
    DB._uid = uid;
    try {
      const snap = await firebase.database().ref(`users/${uid}`).once('value');
      if (!snap.exists()) {
        const localData = getLocalDb();
        await firebase.database().ref(`users/${uid}`).set(localData);
      }
    } catch(err) {
      console.error('[DB] Erro de inicialização', err);
    }
  },

  getRef: (path) => {
      if(!DB._uid) throw new Error("Usuário não autenticado");
      return firebase.database().ref(`users/${DB._uid}/${path}`);
  },

  // -- Settings --
  getSettings: async () => {
    const snap = await DB.getRef('settings').once('value');
    return snap.exists() ? snap.val() : { accent_color: '#72fe8f' };
  },
  saveSettings: async (settings) => {
    const current = await DB.getSettings();
    const updated = { ...current, ...settings };
    await DB.getRef('settings').set(updated);
    return updated;
  },

  // -- Daily Logs / Habits --
  getTodayLog: async () => {
    const today = getTodayStr();
    const snap = await DB.getRef(`daily_logs/${today}`).once('value');
    if (!snap.exists()) {
      const blank = { habits: {}, mood: null, sleep: null, water: 0, screen_time: 0, instagram: 0, rest_day: false };
      await DB.getRef(`daily_logs/${today}`).set(blank);
      return blank;
    }
    return snap.val();
  },

  updateHabit: async (habitId, isCompleted, customDate = null) => {
    const date = customDate || getTodayStr();
    // Using update so we don't overwrite mood/sleep
    await DB.getRef(`daily_logs/${date}/habits`).update({
        [habitId]: isCompleted
    });
  },
  updateDailyMetrics: async (metric, value, customDate = null) => {
    const date = customDate || getTodayStr();
    await DB.getRef(`daily_logs/${date}`).update({
        [metric]: value
    });
  },

  updateDailyFinances: async (dateStr, payload) => {
    // Mantem os 4 campos financeiros no daily_logs de forma deterministica.
    const cleanPayload = {
      income_dia: Number(payload?.income_dia || 0),
      expense_dia: Number(payload?.expense_dia || 0),
      income_din: Number(payload?.income_din || 0),
      expense_din: Number(payload?.expense_din || 0)
    };

    const logRef = DB.getRef(`daily_logs/${dateStr}`);
    await logRef.update(cleanPayload);
  },
  getMonthlyLogs: async (yearMonth) => {
    // Busca logs diários que começam com o ano/mês "YYYY-MM"
    const snap = await DB.getRef('daily_logs').orderByKey().startAt(yearMonth).endAt(yearMonth + '\uf8ff').once('value');
    return snap.exists() ? snap.val() : {};
  },

  getDailyLog: async (dateStr) => {
    const snap = await DB.getRef(`daily_logs/${dateStr}`).once('value');
    return snap.exists() ? snap.val() : null;
  },

  getAllDailyLogs: async () => {
    const snap = await DB.getRef('daily_logs').once('value');
    return snap.exists() ? snap.val() : {};
  },

  // -- Finance --
  getFinances: async () => {
    const snap = await DB.getRef('finances').once('value');
    if(!snap.exists()) return { transactions: [], balance: 0 };
    const val = snap.val();
    return {
        transactions: val.transactions || [],
        balance: val.balance || 0
    };
  },

  getEmergencyFund: async () => {
    const snap = await DB.getRef('finances/emergency_fund').once('value');
    return snap.exists() ? Number(snap.val()) : 0;
  },
  saveEmergencyFund: async (value) => {
    await DB.getRef('finances/emergency_fund').set(Number(value));
  },

  addTransaction: async (transaction) => {
    transaction.id = Date.now().toString();
    const finances = await DB.getFinances();
    if (!finances.transactions) finances.transactions = [];
    
    finances.transactions.push(transaction);
    if (transaction.type === 'income') finances.balance += Number(transaction.amount);
    else finances.balance -= Number(transaction.amount);
    
    await DB.getRef('finances').set(finances);
    return transaction;
  },

  // -- Library (Livros & Cursos) --
  getLibrary: async () => {
    const snap = await DB.getRef('learning').once('value');
    return snap.exists() ? snap.val() : [];
  },

  saveLibraryItem: async (item) => {
    let list = await DB.getLibrary();
    if (!Array.isArray(list)) list = [];

    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item; // update
    } else {
      list.push(item); // create
    }
    await DB.getRef('learning').set(list);
    return item;
  },

  deleteLibraryItem: async (itemId) => {
    let list = await DB.getLibrary();
    list = (list || []).filter(i => i.id !== itemId);
    await DB.getRef('learning').set(list);
  },

  // -- Kanban --
  getKanbanData: async () => {
    const snap = await DB.getRef('kanban').once('value');
    if(!snap.exists()) return { ideas: [], doing: [], done: [] };
    const val = snap.val();
    return {
        ideas: val.ideas || [],
        doing: val.doing || [],
        done: val.done || []
    };
  },

  saveKanbanData: async (kanbanData) => {
    await DB.getRef('kanban').set(kanbanData);
  }
};
