import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserPurpose,
  Task,
  Goal,
  Habit,
  ScheduleEvent,
  Note,
  Transaction,
  SavingsTarget,
  VaultDocument,
  UniversalInboxItem,
  FocusSession,
  NotificationItem,
  MoneyToReceive,
  MoneyToReceivePayment,
  PinnedHomeItem,
  PinnedItemType
} from '../types';
import {
  sendSystemNotification,
  requestBrowserNotificationPermission
} from '../utils/notifications';

export type NavTab =
  | 'Dashboard'
  | 'My Tasks'
  | 'Calendar'
  | 'Notes'
  | 'Goals'
  | 'Habits'
  | 'My Money'
  | 'Smart Vault'
  | 'Universal Inbox'
  | 'Analytics'
  | 'Focus Mode'
  | 'AI Assistant'
  | 'Settings';

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  purpose: UserPurpose;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  currencySymbol: string;
  timezone: string;
  theme: 'light' | 'dark';
  createdAt: string;
}

interface UserWorkspaceData {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  scheduleEvents: ScheduleEvent[];
  notes: Note[];
  transactions: Transaction[];
  savings: SavingsTarget;
  moneyToReceive: MoneyToReceive[];
  vaultDocuments: VaultDocument[];
  universalInbox: UniversalInboxItem[];
  focusSessions: FocusSession[];
  notifications: NotificationItem[];
  pinnedHomeItems?: PinnedHomeItem[];
}

const emptyWorkspace: UserWorkspaceData = {
  tasks: [],
  goals: [],
  habits: [],
  scheduleEvents: [],
  notes: [],
  transactions: [],
  savings: {
    id: 'savings-default',
    title: 'Monthly Savings Goal',
    targetAmount: 0,
    currentAmount: 0,
    monthlyTarget: 0,
    deadline: ''
  },
  moneyToReceive: [],
  vaultDocuments: [],
  universalInbox: [],
  focusSessions: [],
  notifications: [],
  pinnedHomeItems: []
};

interface AppContextType {
  // Authentication
  currentUser: UserProfile | null;
  signUp: (name: string, email: string, pass: string) => Promise<boolean>;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;

  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  setUserPurpose: (purpose: UserPurpose) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (v: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (v: boolean) => void;
  quickAddInitialTab: 'task' | 'note' | 'goal' | 'expense' | 'document';
  openQuickAdd: (tab?: 'task' | 'note' | 'goal' | 'expense' | 'document') => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (v: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (v: boolean) => void;

  // Real User Data
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;

  habits: Habit[];
  toggleHabitDay: (habitId: string, dateStr: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'history'>) => void;
  deleteHabit: (id: string) => void;

  scheduleEvents: ScheduleEvent[];
  addScheduleEvent: (evt: Omit<ScheduleEvent, 'id'>) => void;
  deleteScheduleEvent: (id: string) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNotePin: (id: string) => void;
  toggleNoteFavorite: (id: string) => void;

  transactions: Transaction[];
  savings: SavingsTarget;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateSavings: (updates: Partial<SavingsTarget>) => void;

  moneyToReceive: MoneyToReceive[];
  addMoneyToReceive: (record: Omit<MoneyToReceive, 'id' | 'remainingAmount' | 'status' | 'reminderFired' | 'createdAt'> & { initialRemaining?: number }) => void;
  updateMoneyToReceive: (id: string, updates: Partial<MoneyToReceive>) => void;
  deleteMoneyToReceive: (id: string) => void;
  recordPartialReceipt: (id: string, amountReceived: number, note?: string) => void;
  markAsFullyReceived: (id: string) => void;
  hasNotificationPermission: boolean;
  requestNotificationPermission: () => Promise<NotificationPermission>;

  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id' | 'uploadedAt'>) => void;
  deleteVaultDocument: (id: string) => void;
  toggleDocumentPin: (id: string) => void;
  toggleDocumentFavorite: (id: string) => void;

  universalInbox: UniversalInboxItem[];
  addUniversalItem: (item: Omit<UniversalInboxItem, 'id' | 'savedAt' | 'processed'>) => void;
  deleteUniversalItem: (id: string) => void;
  toggleUniversalProcessed: (id: string) => void;
  convertUniversalToTask: (id: string) => void;
  convertUniversalToNote: (id: string) => void;

  focusSessions: FocusSession[];
  logFocusSession: (durationMinutes: number, taskTitle?: string) => void;

  notifications: NotificationItem[];
  markNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;

  // Customizable Home Page / Reminder Board
  pinnedHomeItems: PinnedHomeItem[];
  pinItemToHome: (itemId: string, type: PinnedItemType, customLabel?: string) => void;
  unpinItemFromHome: (itemId: string) => void;
  isItemPinnedToHome: (itemId: string) => boolean;
  reorderPinnedHomeItems: (items: PinnedHomeItem[]) => void;
  movePinnedItem: (itemId: string, direction: 'up' | 'down') => void;

  // System
  exportDataJson: () => void;
  importDataJson: (jsonData: string) => boolean;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Account & User Data Storage Helpers
function getAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem('onespace_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem('onespace_accounts', JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed saving accounts', e);
  }
}

function getUserWorkspace(userId: string): UserWorkspaceData {
  try {
    const raw = localStorage.getItem(`onespace_userdata_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading user workspace', e);
  }
  return { ...emptyWorkspace };
}

function saveUserWorkspace(userId: string, data: UserWorkspaceData) {
  try {
    localStorage.setItem(`onespace_userdata_${userId}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed saving user workspace', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const activeId = localStorage.getItem('onespace_active_user_id');
      if (activeId) {
        const accounts = getAccounts();
        const found = accounts.find(a => a.id === activeId);
        if (found) {
          return {
            id: found.id,
            name: found.name,
            email: found.email,
            avatar: found.avatar,
            purpose: found.purpose,
            currency: found.currency,
            currencySymbol: found.currencySymbol,
            timezone: found.timezone,
            theme: found.theme,
            isPro: false,
            onboardingCompleted: true
          };
        }
      }
    } catch {}
    return null;
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialTab, setQuickAddInitialTab] = useState<'task' | 'note' | 'goal' | 'expense' | 'document'>('task');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 2. Real User Data States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savings, setSavings] = useState<SavingsTarget>(emptyWorkspace.savings);
  const [moneyToReceive, setMoneyToReceive] = useState<MoneyToReceive[]>([]);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(
    () => typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>([]);
  const [universalInbox, setUniversalInbox] = useState<UniversalInboxItem[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pinnedHomeItems, setPinnedHomeItems] = useState<PinnedHomeItem[]>([]);

  // Load user data on currentUser change
  useEffect(() => {
    if (currentUser) {
      const data = getUserWorkspace(currentUser.id);
      setTasks(data.tasks || []);
      setGoals(data.goals || []);
      setHabits(data.habits || []);
      setScheduleEvents(data.scheduleEvents || []);
      setNotes(data.notes || []);
      setTransactions(data.transactions || []);
      setSavings(data.savings || emptyWorkspace.savings);
      setMoneyToReceive(data.moneyToReceive || []);
      setVaultDocuments(data.vaultDocuments || []);
      setUniversalInbox(data.universalInbox || []);
      setFocusSessions(data.focusSessions || []);
      setNotifications(data.notifications || []);
      setPinnedHomeItems(data.pinnedHomeItems || []);
    } else {
      // Clear in-memory workspace when logged out
      setTasks([]);
      setGoals([]);
      setHabits([]);
      setScheduleEvents([]);
      setNotes([]);
      setTransactions([]);
      setSavings(emptyWorkspace.savings);
      setMoneyToReceive([]);
      setVaultDocuments([]);
      setUniversalInbox([]);
      setFocusSessions([]);
      setNotifications([]);
      setPinnedHomeItems([]);
    }
  }, [currentUser?.id]);

  // Sync workspace back to specific user storage on any change
  useEffect(() => {
    if (currentUser) {
      saveUserWorkspace(currentUser.id, {
        tasks,
        goals,
        habits,
        scheduleEvents,
        notes,
        transactions,
        savings,
        moneyToReceive,
        vaultDocuments,
        universalInbox,
        focusSessions,
        notifications,
        pinnedHomeItems
      });
    }
  }, [
    currentUser?.id,
    tasks,
    goals,
    habits,
    scheduleEvents,
    notes,
    transactions,
    savings,
    moneyToReceive,
    vaultDocuments,
    universalInbox,
    focusSessions,
    notifications,
    pinnedHomeItems
  ]);

  // Dark mode
  useEffect(() => {
    if (currentUser?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentUser?.theme]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Automated Scheduled Reminder Engine for "Money to Receive"
  useEffect(() => {
    if (!currentUser) return;

    const checkPendingReminders = () => {
      const now = Date.now();
      let hasFiredAny = false;

      setMoneyToReceive(prevList => {
        let changed = false;
        const updatedList = prevList.map(record => {
          // Skip if already received, no reminder date set, or already fired
          if (record.status === 'received' || !record.reminderDateTime || record.reminderFired) {
            return record;
          }

          const targetTime = new Date(record.reminderDateTime).getTime();
          if (!isNaN(targetTime) && targetTime <= now) {
            hasFiredAny = true;
            changed = true;
            const amountStr = `${currentUser.currencySymbol}${record.remainingAmount.toLocaleString()}`;
            const reminderText = `Reminder: Ask ${record.personName} to return ${amountStr}.`;

            // 1. Native OS desktop/mobile notification with chime
            sendSystemNotification(`Payment Reminder`, reminderText, `mtr-${record.id}`);

            // 2. In-app notification
            setNotifications(nPrev => [
              {
                id: `notif-${Date.now()}-${record.id}`,
                title: `Payment Reminder`,
                message: reminderText,
                time: 'Just now',
                read: false,
                type: 'system'
              },
              ...nPrev
            ]);

            return {
              ...record,
              reminderFired: true
            };
          }
          return record;
        });

        return changed ? updatedList : prevList;
      });
    };

    // Immediate check on mount/login
    checkPendingReminders();

    // Regular interval check every 10 seconds for timely delivery
    const timer = setInterval(checkPendingReminders, 10000);
    return () => clearInterval(timer);
  }, [currentUser?.id, currentUser?.currencySymbol]);

  // Authentication Handlers
  const signUp = async (name: string, email: string, pass: string): Promise<boolean> => {
    const accounts = getAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return false;
    }

    const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newAccount: StoredAccount = {
      id: newId,
      name,
      email,
      password: pass,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=2563eb&textColor=ffffff`,
      purpose: 'Working Professional',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata (IST)',
      theme: 'light',
      createdAt: new Date().toISOString()
    };

    saveAccounts([...accounts, newAccount]);
    localStorage.setItem('onespace_active_user_id', newId);

    // Save empty workspace for this new user
    saveUserWorkspace(newId, emptyWorkspace);

    setCurrentUser({
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      avatar: newAccount.avatar,
      purpose: newAccount.purpose,
      currency: newAccount.currency,
      currencySymbol: newAccount.currencySymbol,
      timezone: newAccount.timezone,
      theme: newAccount.theme,
      isPro: false,
      onboardingCompleted: true
    });

    setActiveTab('Dashboard');
    return true;
  };

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    const accounts = getAccounts();
    const found = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return false;
    }
    if (found.password && found.password !== pass) {
      return false;
    }

    localStorage.setItem('onespace_active_user_id', found.id);
    setCurrentUser({
      id: found.id,
      name: found.name,
      email: found.email,
      avatar: found.avatar,
      purpose: found.purpose,
      currency: found.currency,
      currencySymbol: found.currencySymbol,
      timezone: found.timezone,
      theme: found.theme,
      isPro: false,
      onboardingCompleted: true
    });

    setActiveTab('Dashboard');
    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    const accounts = getAccounts();
    const googleEmail = 'google.user@onespace.app';
    let found = accounts.find(a => a.email === googleEmail);

    if (!found) {
      const newId = `user_google_${Date.now()}`;
      found = {
        id: newId,
        name: 'Google User',
        email: googleEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=GoogleUser&backgroundColor=4285F4&textColor=ffffff`,
        purpose: 'Working Professional',
        currency: 'INR',
        currencySymbol: '₹',
        timezone: 'Asia/Kolkata (IST)',
        theme: 'light',
        createdAt: new Date().toISOString()
      };
      saveAccounts([...accounts, found]);
      saveUserWorkspace(newId, emptyWorkspace);
    }

    localStorage.setItem('onespace_active_user_id', found.id);
    setCurrentUser({
      id: found.id,
      name: found.name,
      email: found.email,
      avatar: found.avatar,
      purpose: found.purpose,
      currency: found.currency,
      currencySymbol: found.currencySymbol,
      timezone: found.timezone,
      theme: found.theme,
      isPro: false,
      onboardingCompleted: true
    });

    setActiveTab('Dashboard');
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const accounts = getAccounts();
    const found = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    return !!found;
  };

  const logout = () => {
    localStorage.removeItem('onespace_active_user_id');
    setCurrentUser(null);
    setActiveTab('Dashboard');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    const accounts = getAccounts();
    const newAccounts = accounts.map(a =>
      a.id === currentUser.id ? { ...a, ...updates } : a
    );
    saveAccounts(newAccounts);
  };

  const setUserPurpose = (purpose: UserPurpose) => {
    updateUser({ purpose });
  };

  const openQuickAdd = (tab: 'task' | 'note' | 'goal' | 'expense' | 'document' = 'task') => {
    setQuickAddInitialTab(tab);
    setIsQuickAddOpen(true);
  };

  // CRUD for Real User Data
  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const item: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [item, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextVal = !t.completed;
          return {
            ...t,
            completed: nextVal,
            completedAt: nextVal ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubs = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubs };
        }
        return t;
      })
    );
  };

  const addGoal = (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
    const item: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [item, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          const updated = g.milestones.map(m =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updated.filter(m => m.completed).length;
          const calculatedPct = updated.length > 0
            ? Math.round((completedCount / updated.length) * 100)
            : g.currentValue;

          return {
            ...g,
            milestones: updated,
            currentValue: g.unit === '%' ? calculatedPct : g.currentValue
          };
        }
        return g;
      })
    );
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const current = !!h.history[dateStr];
          const newHistory = { ...h.history, [dateStr]: !current };
          const newStreak = !current ? h.streak + 1 : Math.max(0, h.streak - 1);
          return {
            ...h,
            history: newHistory,
            streak: newStreak,
            bestStreak: Math.max(h.bestStreak, newStreak)
          };
        }
        return h;
      })
    );
  };

  const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'history'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const item: Habit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
      streak: 1,
      bestStreak: 1,
      history: { [todayStr]: true },
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, item]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addScheduleEvent = (evt: Omit<ScheduleEvent, 'id'>) => {
    const item: ScheduleEvent = {
      ...evt,
      id: `evt-${Date.now()}`
    };
    setScheduleEvents(prev => [...prev, item]);
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents(prev => prev.filter(e => e.id !== id));
  };

  const addNote = (newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const item: Note = {
      ...newNote,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setNotes(prev => [item, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const now = new Date().toISOString();
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: now } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const toggleNotePin = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const toggleNoteFavorite = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, favorite: !n.favorite } : n)));
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const item: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [item, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateSavings = (updates: Partial<SavingsTarget>) => {
    setSavings(prev => ({ ...prev, ...updates }));
  };

  const requestNotificationPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    setHasNotificationPermission(perm === 'granted');
    return perm;
  };

  const addMoneyToReceive = (
    record: Omit<MoneyToReceive, 'id' | 'remainingAmount' | 'status' | 'reminderFired' | 'createdAt'> & { initialRemaining?: number }
  ) => {
    const orig = Math.max(0, Number(record.originalAmount));
    const item: MoneyToReceive = {
      ...record,
      id: `mtr-${Date.now()}`,
      originalAmount: orig,
      remainingAmount: orig,
      status: 'pending', // Requirement: Always "Pending" on creation, never "Received"
      reminderFired: false,
      createdAt: new Date().toISOString(),
      payments: []
    };
    setMoneyToReceive(prev => [item, ...prev]);
  };

  const updateMoneyToReceive = (id: string, updates: Partial<MoneyToReceive>) => {
    setMoneyToReceive(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };

        if (updates.remainingAmount !== undefined) {
          const remaining = Math.max(0, updates.remainingAmount);
          updated.remainingAmount = remaining;
          if (remaining <= 0) {
            updated.remainingAmount = 0;
            updated.status = updates.status || 'received';
            updated.receivedAt = updated.receivedAt || new Date().toISOString();
            updated.reminderFired = true;
          } else {
            // Keep pending if balance remains unless explicitly set
            updated.status = updates.status || 'pending';
          }
        }

        // If reminder was rescheduled to the future, reset reminderFired flag
        if (updates.reminderDateTime && updates.reminderDateTime !== item.reminderDateTime) {
          const nextTime = new Date(updates.reminderDateTime).getTime();
          if (nextTime > Date.now()) {
            updated.reminderFired = false;
          }
        }

        return updated;
      })
    );
  };

  const deleteMoneyToReceive = (id: string) => {
    setMoneyToReceive(prev => prev.filter(m => m.id !== id));
    // Also remove from pinned if it was pinned
    setPinnedHomeItems(prev => prev.filter(p => p.itemId !== id));
  };

  const recordPartialReceipt = (id: string, amountReceived: number, note?: string) => {
    setMoneyToReceive(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newRemaining = Math.max(0, item.remainingAmount - amountReceived);
        const isDone = newRemaining === 0;
        const paymentItem: MoneyToReceivePayment = {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: amountReceived,
          notes: note || 'Partial payment received'
        };
        return {
          ...item,
          remainingAmount: newRemaining,
          // Requirement: "If the person has returned only part of the money, allow me to update the amount received and keep the remaining balance as 'Pending'."
          status: isDone ? 'received' : 'pending',
          receivedAt: isDone ? new Date().toISOString() : item.receivedAt,
          reminderFired: isDone ? true : item.reminderFired,
          reminderDateTime: isDone ? undefined : item.reminderDateTime,
          payments: [paymentItem, ...(item.payments || [])]
        };
      })
    );
  };

  const markAsFullyReceived = (id: string) => {
    setMoneyToReceive(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const collected = item.remainingAmount;
        const paymentItem: MoneyToReceivePayment = {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: collected,
          notes: 'Full payment received'
        };
        return {
          ...item,
          remainingAmount: 0,
          status: 'received',
          receivedAt: new Date().toISOString(),
          reminderFired: true, // Stop any future reminders
          reminderDateTime: undefined, // Remove reminder date
          payments: collected > 0 ? [paymentItem, ...(item.payments || [])] : (item.payments || [])
        };
      })
    );
  };

  // Pinned Home Items (Personal Reminder Board) Handlers
  const pinItemToHome = (itemId: string, type: PinnedItemType, customLabel?: string) => {
    setPinnedHomeItems(prev => {
      if (prev.some(p => p.itemId === itemId)) return prev;
      const newItem: PinnedHomeItem = {
        id: `pin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        itemId,
        type,
        customLabel,
        order: prev.length,
        pinnedAt: new Date().toISOString()
      };
      return [...prev, newItem];
    });
  };

  const unpinItemFromHome = (itemId: string) => {
    setPinnedHomeItems(prev => prev.filter(p => p.itemId !== itemId && p.id !== itemId));
  };

  const isItemPinnedToHome = (itemId: string) => {
    return pinnedHomeItems.some(p => p.itemId === itemId || p.id === itemId);
  };

  const reorderPinnedHomeItems = (items: PinnedHomeItem[]) => {
    setPinnedHomeItems(items.map((it, idx) => ({ ...it, order: idx })));
  };

  const movePinnedItem = (itemId: string, direction: 'up' | 'down') => {
    setPinnedHomeItems(prev => {
      const idx = prev.findIndex(p => p.itemId === itemId || p.id === itemId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      return copy.map((item, i) => ({ ...item, order: i }));
    });
  };

  const addVaultDocument = (doc: Omit<VaultDocument, 'id' | 'uploadedAt'>) => {
    const item: VaultDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    setVaultDocuments(prev => [item, ...prev]);
  };

  const deleteVaultDocument = (id: string) => {
    setVaultDocuments(prev => prev.filter(d => d.id !== id));
  };

  const toggleDocumentPin = (id: string) => {
    setVaultDocuments(prev => prev.map(d => (d.id === id ? { ...d, pinned: !d.pinned } : d)));
  };

  const toggleDocumentFavorite = (id: string) => {
    setVaultDocuments(prev => prev.map(d => (d.id === id ? { ...d, favorite: !d.favorite } : d)));
  };

  const addUniversalItem = (item: Omit<UniversalInboxItem, 'id' | 'savedAt' | 'processed'>) => {
    const newItem: UniversalInboxItem = {
      ...item,
      id: `ui-${Date.now()}`,
      savedAt: new Date().toISOString(),
      processed: false
    };
    setUniversalInbox(prev => [newItem, ...prev]);
  };

  const deleteUniversalItem = (id: string) => {
    setUniversalInbox(prev => prev.filter(u => u.id !== id));
  };

  const toggleUniversalProcessed = (id: string) => {
    setUniversalInbox(prev => prev.map(u => (u.id === id ? { ...u, processed: !u.processed } : u)));
  };

  const convertUniversalToTask = (id: string) => {
    const item = universalInbox.find(u => u.id === id);
    if (!item) return;
    addTask({
      title: item.title,
      description: `Imported from ${item.source}: ${item.description || item.url || ''}`,
      completed: false,
      priority: 'medium',
      category: 'Work',
      dueDate: new Date().toISOString().split('T')[0],
      subtasks: []
    });
    toggleUniversalProcessed(id);
    setActiveTab('My Tasks');
  };

  const convertUniversalToNote = (id: string) => {
    const item = universalInbox.find(u => u.id === id);
    if (!item) return;
    addNote({
      title: item.title,
      content: `Source: ${item.source}\nURL: ${item.url || 'N/A'}\n\n${item.description}`,
      folder: 'Inbox',
      tags: item.tags.length > 0 ? item.tags : ['UniversalSave'],
      pinned: false,
      favorite: false
    });
    toggleUniversalProcessed(id);
    setActiveTab('Notes');
  };

  const logFocusSession = (durationMinutes: number, taskTitle?: string) => {
    const session: FocusSession = {
      id: `fs-${Date.now()}`,
      taskTitle,
      durationMinutes,
      completedAt: new Date().toISOString()
    };
    setFocusSessions(prev => [session, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const exportDataJson = () => {
    if (!currentUser) return;
    const fullBackup = {
      user: currentUser,
      workspace: {
        tasks,
        goals,
        habits,
        scheduleEvents,
        notes,
        transactions,
        savings,
        vaultDocuments,
        universalInbox,
        focusSessions,
        notifications
      },
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OneSpace_${currentUser.name}_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      const data = parsed.workspace || parsed;
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.goals)) setGoals(data.goals);
      if (Array.isArray(data.habits)) setHabits(data.habits);
      if (Array.isArray(data.scheduleEvents)) setScheduleEvents(data.scheduleEvents);
      if (Array.isArray(data.notes)) setNotes(data.notes);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (data.savings) setSavings(data.savings);
      if (Array.isArray(data.moneyToReceive)) setMoneyToReceive(data.moneyToReceive);
      if (Array.isArray(data.vaultDocuments)) setVaultDocuments(data.vaultDocuments);
      if (Array.isArray(data.universalInbox)) setUniversalInbox(data.universalInbox);
      if (Array.isArray(data.focusSessions)) setFocusSessions(data.focusSessions);
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      return false;
    }
  };

  const clearUserData = () => {
    setTasks([]);
    setGoals([]);
    setHabits([]);
    setScheduleEvents([]);
    setNotes([]);
    setTransactions([]);
    setSavings(emptyWorkspace.savings);
    setMoneyToReceive([]);
    setVaultDocuments([]);
    setUniversalInbox([]);
    setFocusSessions([]);
    setNotifications([]);
  };

  // Safe fallback user when logged in
  const activeUserSafe: UserProfile = currentUser || {
    id: 'guest',
    name: 'Guest',
    email: '',
    avatar: '',
    purpose: 'Personal Use',
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata (IST)',
    theme: 'light',
    isPro: false,
    onboardingCompleted: true
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        signUp,
        signIn,
        signInWithGoogle,
        resetPassword,
        logout,
        user: activeUserSafe,
        updateUser,
        setUserPurpose,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        isSearchOpen,
        setIsSearchOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddInitialTab,
        openQuickAdd,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        toggleSubtask,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        habits,
        toggleHabitDay,
        addHabit,
        deleteHabit,
        scheduleEvents,
        addScheduleEvent,
        deleteScheduleEvent,
        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleNotePin,
        toggleNoteFavorite,
        transactions,
        savings,
        addTransaction,
        deleteTransaction,
        updateSavings,
        moneyToReceive,
        addMoneyToReceive,
        updateMoneyToReceive,
        deleteMoneyToReceive,
        recordPartialReceipt,
        markAsFullyReceived,
        hasNotificationPermission,
        requestNotificationPermission,
        vaultDocuments,
        addVaultDocument,
        deleteVaultDocument,
        toggleDocumentPin,
        toggleDocumentFavorite,
        universalInbox,
        addUniversalItem,
        deleteUniversalItem,
        toggleUniversalProcessed,
        convertUniversalToTask,
        convertUniversalToNote,
        focusSessions,
        logFocusSession,
        notifications,
        markNotificationsAsRead,
        dismissNotification,
        pinnedHomeItems,
        pinItemToHome,
        unpinItemFromHome,
        isItemPinnedToHome,
        reorderPinnedHomeItems,
        movePinnedItem,
        exportDataJson,
        importDataJson,
        clearUserData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
