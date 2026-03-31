/**
 * database.js
 * Abstraction layer for data storage. For the MVP, it uses localStorage.
 * It will act asynchronously (returning Promises) to easily replace with Firebase later.
 */

const STORAGE_KEY = 'equilibrio_produtivo_data';

// Default initial state
const initialState = {
  daily_logs: {},
  finances: {
    transactions: [],
    balance: 0
  },
  learning: {},
  kanban: {
    ideas: [],
    doing: [],
    done: []
  },
  settings: {
    accent_color: '#72fe8f' // Default green
  }
};

function getDb() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return initialState;
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialState;
  }
}

function saveDb(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Helpers
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
        db.daily_logs[today] = { habits: {}, mood: null, sleep: null, water: 0 };
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

  getMonthlyLogs: async (yearMonth) => { // format YYYY-MM
     const db = getDb();
     const result = {};
     for (const date in db.daily_logs) {
         if (date.startsWith(yearMonth)) {
             result[date] = db.daily_logs[date];
         }
     }
     return result;
  },

  // -- Finance --
  getFinances: async () => {
    return getDb().finances;
  },
  
  addTransaction: async (transaction) => {
      // transaction: { id, title, amount, type (income/expense), date, category }
      const db = getDb();
      transaction.id = Date.now().toString();
      db.finances.transactions.push(transaction);
      if (transaction.type === 'income') db.finances.balance += Number(transaction.amount);
      else db.finances.balance -= Number(transaction.amount);
      saveDb(db);
      return transaction;
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
