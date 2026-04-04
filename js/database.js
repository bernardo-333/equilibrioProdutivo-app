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

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const DB = {
  _uid: null,

  init: async (uid) => {
    DB._uid = uid;
    try {
      const snap = await firebase.database().ref(`users/${uid}`).once('value');
      if (!snap.exists()) {
        const localData = getLocalDb();
        await firebase.database().ref(`users/${uid}`).set(localData);
        console.log('[DB] Migração do LocalStorage para o Firebase realizada com sucesso.');
      } else {
        console.log('[DB] Dados sincronizados a partir da nuvem.');
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
      const blank = { habits: {}, mood: null, sleep: null, water: 0, screen_time: 0, instagram: 0 };
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
    // 1. Atualizar o log do dia pra manter a state (os 4 inputs)
    const logRef = DB.getRef(`daily_logs/${dateStr}`);
    await logRef.update(payload);

    // 2. Atualizar a timeline Global de transaÃ§Ãµes para bater o Saldo Resumo
    const financesRef = DB.getRef('finances');
    const snap = await financesRef.once('value');
    const finances = snap.val() || { transactions: [], balance: 0 };
    
    let trans = finances.transactions || [];
    let balance = Number(finances.balance || 0);

    // Encontrar transaÃ§Ãµes aninhadas do "Dia" e revertÃª-las no saldo para limpar (Overwrite behavior)
    const oldTrans = trans.filter(t => t.description === 'Registro Diario' && (t.date || '').startsWith(dateStr));
    oldTrans.forEach(t => {
       // sÃ³ reverte balance se for da conta "Meu Dinheiro", assumindo que a do Dia a Dia nÃ£o afeta "balance" principal e sim transaÃ§Ãµes isoladas.
       // na dÃºvida, revertemos de volta o balance para Meu Dinheiro:
       if (t.category === 'ganho_dinheiro') balance -= Number(t.amount);
       if (t.category === 'gasto_dinheiro') balance += Number(t.amount);
    });

    // Filtra array original, deletando as "oldTrans"
    trans = trans.filter(t => !(t.description === 'Registro Diario' && (t.date || '').startsWith(dateStr)));

    const createDateStamp = () => new Date(dateStr + "T12:00:00").toISOString();

    const addT = (amt, type, cat) => {
      if (amt && amt > 0) {
        trans.push({ id: DB.generateId(), type: type, amount: Math.abs(amt), description: 'Registro Diario', category: cat, date: createDateStamp() });
        // atualiza global apenas carteira "dinheiro" pra nÃ£o somar dia a dia repetindo dados fÃ­sicos
        if (cat === 'ganho_dinheiro') balance += Math.abs(amt);
        if (cat === 'gasto_dinheiro') balance -= Math.abs(amt);
      }
    };

    addT(payload.income_dia, 'income', 'ganho_dia');
    addT(payload.expense_dia, 'expense', 'gasto_dia');
    addT(payload.income_din, 'income', 'ganho_dinheiro');
    addT(payload.expense_din, 'expense', 'gasto_dinheiro');

    // Salva back ao Firebase
    await financesRef.update({ balance, transactions: trans });
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
