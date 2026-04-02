/**
 * database.js
 * Abstraction layer for data storage.
 * MVP: localStorage. Fase 2: Firebase Realtime Database.
 * All methods return Promises for easy Firebase migration.
 */

const STORAGE_KEY = 'equilibrio_produtivo_data';

const initialState = {
  daily_logs: {},
  finances: {
    transactions: [],
    balance: 0
  },
  learning: [], // Array of { id, emoji, title, author, type, status, current, total, genre, rating, review }
  kanban: {
    ideas: [],
    doing: [],
    done: []
  },
  settings: {
    accent_color: '#72fe8f'
  }
};

function getDb() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return JSON.parse(JSON.stringify(initialState));
  try {
    const parsed = JSON.parse(data);
    // Ensure all keys exist (migration safety)
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

function saveDb(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const DB = {

  // -- Settings --
  getSettings: async () => {
    return getDb().settings;
  },
  saveSettings: async (settings) => {
    const db = getDb();
    db.settings = { ...db.settings, ...settings };
    saveDb(db);
    return db.settings;
  },

  // -- Daily Logs / Habits --
  getTodayLog: async () => {
    const today = getTodayStr();
    const db = getDb();
    if (!db.daily_logs[today]) {
      db.daily_logs[today] = { habits: {}, mood: null, sleep: null, water: 0, screen_time: 0, instagram: 0 };
      saveDb(db);
    }
    return db.daily_logs[today];
  },

  updateHabit: async (habitId, isCompleted) => {
    const today = getTodayStr();
    const db = getDb();
    if (!db.daily_logs[today]) db.daily_logs[today] = { habits: {}, mood: null, sleep: null, water: 0 };
    db.daily_logs[today].habits[habitId] = isCompleted;
    saveDb(db);
  },

  updateDailyMetrics: async (metric, value) => {
    const today = getTodayStr();
    const db = getDb();
    if (!db.daily_logs[today]) db.daily_logs[today] = { habits: {}, mood: null, sleep: null, water: 0 };
    db.daily_logs[today][metric] = value;
    saveDb(db);
  },

  getMonthlyLogs: async (yearMonth) => {
    const db = getDb();
    const result = {};
    for (const date in db.daily_logs) {
      if (date.startsWith(yearMonth)) {
        result[date] = db.daily_logs[date];
      }
    }
    return result;
  },

  getDailyLog: async (dateStr) => {
    const db = getDb();
    return db.daily_logs[dateStr] || null;
  },

  // -- Finance --
  getFinances: async () => {
    return getDb().finances;
  },

  addTransaction: async (transaction) => {
    const db = getDb();
    transaction.id = Date.now().toString();
    db.finances.transactions.push(transaction);
    if (transaction.type === 'income') db.finances.balance += Number(transaction.amount);
    else db.finances.balance -= Number(transaction.amount);
    saveDb(db);
    return transaction;
  },

  // -- Library (Livros & Cursos) --
  getLibrary: async () => {
    return getDb().learning;
  },

  saveLibraryItem: async (item) => {
    const db = getDb();
    if (!Array.isArray(db.learning)) db.learning = [];

    const idx = db.learning.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      db.learning[idx] = item; // update
    } else {
      db.learning.push(item); // create
    }
    saveDb(db);
    return item;
  },

  deleteLibraryItem: async (itemId) => {
    const db = getDb();
    db.learning = (db.learning || []).filter(i => i.id !== itemId);
    saveDb(db);
  },

  // -- Kanban --
  getKanbanData: async () => {
    return getDb().kanban;
  },

  saveKanbanData: async (kanbanData) => {
    const db = getDb();
    db.kanban = kanbanData;
    saveDb(db);
  }
};
