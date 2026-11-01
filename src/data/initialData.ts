import {
  UserProfile,
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
  NotificationItem
} from '../types';

export const initialUser: UserProfile = {
  id: 'user-priya-01',
  name: 'Priya',
  email: 'priya.sharma@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  purpose: 'Working Professional',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata (IST)',
  theme: 'light',
  isPro: false,
  onboardingCompleted: true
};

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete project proposal',
    description: 'Finalize scope, architectural milestones, and delivery timeline for client review.',
    completed: true,
    priority: 'high',
    category: 'Work',
    dueDate: '2026-10-26',
    dueTime: '10:00 AM',
    subtasks: [
      { id: 'st-1', title: 'Review technical requirements', completed: true },
      { id: 'st-2', title: 'Draft budget estimation', completed: true },
      { id: 'st-3', title: 'Export PDF copy', completed: true }
    ],
    createdAt: '2026-10-26T08:00:00.000Z',
    completedAt: '2026-10-26T10:15:00.000Z'
  },
  {
    id: 'task-2',
    title: 'Study DSA - Arrays',
    description: 'Practice two-pointer problems, sliding window algorithm, and binary search.',
    completed: true,
    priority: 'medium',
    category: 'Study',
    dueDate: '2026-10-26',
    dueTime: '12:00 PM',
    subtasks: [
      { id: 'st-4', title: 'Leetcode 3Sum problem', completed: true },
      { id: 'st-5', title: 'Maximum Subarray (Kadane)', completed: true }
    ],
    linkedGoalId: 'goal-1',
    createdAt: '2026-10-26T08:15:00.000Z',
    completedAt: '2026-10-26T12:45:00.000Z'
  },
  {
    id: 'task-3',
    title: 'Gym workout',
    description: 'Leg day routine: squats, Romanian deadlifts, calf raises, core stability.',
    completed: true,
    priority: 'medium',
    category: 'Health',
    dueDate: '2026-10-26',
    dueTime: '5:00 PM',
    subtasks: [],
    linkedGoalId: 'goal-4',
    createdAt: '2026-10-26T08:20:00.000Z',
    completedAt: '2026-10-26T17:40:00.000Z'
  },
  {
    id: 'task-4',
    title: 'Read 20 pages of book',
    description: 'Read Chapter 4 of "Atomic Habits" by James Clear on environment cue design.',
    completed: false,
    priority: 'low',
    category: 'Personal',
    dueDate: '2026-10-26',
    dueTime: '7:00 PM',
    subtasks: [],
    linkedGoalId: 'goal-3',
    createdAt: '2026-10-26T08:30:00.000Z'
  },
  {
    id: 'task-5',
    title: "Plan tomorrow's schedule",
    description: 'Check Google Calendar sync, review tasks backlog, set 3 highlight priorities.',
    completed: false,
    priority: 'low',
    category: 'Personal',
    dueDate: '2026-10-26',
    dueTime: '9:00 PM',
    subtasks: [],
    createdAt: '2026-10-26T09:00:00.000Z'
  },
  // Additional completed tasks for the 8/10 count
  {
    id: 'task-6',
    title: 'Morning review & meditation',
    completed: true,
    priority: 'low',
    category: 'Health',
    dueDate: '2026-10-26',
    dueTime: '7:30 AM',
    subtasks: [],
    createdAt: '2026-10-26T07:00:00.000Z',
    completedAt: '2026-10-26T07:45:00.000Z'
  },
  {
    id: 'task-7',
    title: 'Respond to urgent client emails',
    completed: true,
    priority: 'high',
    category: 'Work',
    dueDate: '2026-10-26',
    dueTime: '9:15 AM',
    subtasks: [],
    createdAt: '2026-10-26T08:00:00.000Z',
    completedAt: '2026-10-26T09:40:00.000Z'
  },
  {
    id: 'task-8',
    title: 'Review weekly budget spreadsheet',
    completed: true,
    priority: 'medium',
    category: 'Finance',
    dueDate: '2026-10-26',
    dueTime: '1:30 PM',
    subtasks: [],
    createdAt: '2026-10-26T09:00:00.000Z',
    completedAt: '2026-10-26T14:00:00.000Z'
  },
  {
    id: 'task-9',
    title: 'Sync team sprint updates',
    completed: true,
    priority: 'medium',
    category: 'Work',
    dueDate: '2026-10-26',
    dueTime: '2:30 PM',
    subtasks: [],
    createdAt: '2026-10-26T09:00:00.000Z',
    completedAt: '2026-10-26T15:10:00.000Z'
  },
  {
    id: 'task-10',
    title: 'Update LinkedIn technical portfolio',
    completed: true,
    priority: 'low',
    category: 'Career' as any,
    dueDate: '2026-10-26',
    dueTime: '4:15 PM',
    subtasks: [],
    createdAt: '2026-10-26T09:00:00.000Z',
    completedAt: '2026-10-26T16:45:00.000Z'
  }
];

export const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Complete DSA course',
    description: 'Master Data Structures & Algorithms (Trees, Graphs, Dynamic Programming) on NeetCode.',
    category: 'Career',
    targetValue: 100,
    currentValue: 65,
    unit: '%',
    timeframe: 'Monthly',
    startDate: '2026-09-01',
    deadline: '2026-11-30',
    color: '#8B5CF6',
    createdAt: '2026-09-01T00:00:00.000Z',
    milestones: [
      { id: 'm-1', title: 'Arrays & Two Pointers', completed: true },
      { id: 'm-2', title: 'Linked Lists & Stack', completed: true },
      { id: 'm-3', title: 'Binary Search & Sliding Window', completed: true },
      { id: 'm-4', title: 'Trees & Heaps', completed: false },
      { id: 'm-5', title: 'Dynamic Programming', completed: false }
    ]
  },
  {
    id: 'goal-2',
    title: 'Build savings fund',
    description: 'Accumulate an emergency cushion of 6 months essential living expenses.',
    category: 'Financial',
    targetValue: 50000,
    currentValue: 36000,
    unit: '₹',
    timeframe: 'Monthly',
    startDate: '2026-01-01',
    deadline: '2026-12-31',
    color: '#14B8A6',
    createdAt: '2026-01-01T00:00:00.000Z',
    milestones: [
      { id: 'm-6', title: 'Initial ₹10,000 baseline reserve', completed: true },
      { id: 'm-7', title: 'Deposit ₹25,000 milestone', completed: true },
      { id: 'm-8', title: 'Reach ₹36,000 target', completed: true },
      { id: 'm-9', title: 'Final goal ₹50,000', completed: false }
    ]
  },
  {
    id: 'goal-3',
    title: 'Read 12 books this year',
    description: 'Broaden perspectives on product design, behavioral psychology, and systems thinking.',
    category: 'Personal',
    targetValue: 12,
    currentValue: 5,
    unit: 'books',
    timeframe: 'Yearly',
    startDate: '2026-01-01',
    deadline: '2026-12-31',
    color: '#3B82F6',
    createdAt: '2026-01-01T00:00:00.000Z',
    milestones: [
      { id: 'm-10', title: 'The Design of Everyday Things', completed: true },
      { id: 'm-11', title: 'Thinking in Systems', completed: true },
      { id: 'm-12', title: 'Deep Work - Cal Newport', completed: true },
      { id: 'm-13', title: 'Atomic Habits - James Clear', completed: false },
      { id: 'm-14', title: 'Show Your Work! - Austin Kleon', completed: false }
    ]
  },
  {
    id: 'goal-4',
    title: 'Get fit & healthy',
    description: 'Achieve 80kg bench, 5k sub-25min run, and 15% body fat conditioning.',
    category: 'Fitness',
    targetValue: 100,
    currentValue: 80,
    unit: '%',
    timeframe: 'Monthly',
    startDate: '2026-03-01',
    deadline: '2026-11-30',
    color: '#F59E0B',
    createdAt: '2026-03-01T00:00:00.000Z',
    milestones: [
      { id: 'm-15', title: 'Consistent 4x weekly workouts', completed: true },
      { id: 'm-16', title: 'Run continuous 5km outdoors', completed: true },
      { id: 'm-17', title: 'Hit 80% strength benchmark', completed: true },
      { id: 'm-18', title: 'Target body composition', completed: false }
    ]
  },
  {
    id: 'goal-5',
    title: 'Launch SaaS Micro-Tool',
    description: 'Ship MVP product to Product Hunt, acquire first 100 organic beta signups.',
    category: 'Career',
    targetValue: 100,
    currentValue: 40,
    unit: '%',
    timeframe: 'Yearly',
    startDate: '2026-06-01',
    deadline: '2026-12-15',
    color: '#EC4899',
    createdAt: '2026-06-01T00:00:00.000Z',
    milestones: [
      { id: 'm-19', title: 'Wireframes & UI prototype', completed: true },
      { id: 'm-20', title: 'Database schema & core API', completed: true },
      { id: 'm-21', title: 'Stripe integration & auth', completed: false }
    ]
  }
];

export const initialHabits: Habit[] = [
  {
    id: 'habit-1',
    title: 'Exercise',
    category: 'Health',
    frequency: 'daily',
    streak: 18,
    bestStreak: 24,
    color: '#10B981',
    createdAt: '2026-08-01',
    history: {
      '2026-10-20': true,
      '2026-10-21': true,
      '2026-10-22': true,
      '2026-10-23': true,
      '2026-10-24': true,
      '2026-10-25': true,
      '2026-10-26': true
    }
  },
  {
    id: 'habit-2',
    title: 'Read',
    category: 'Mindset',
    frequency: 'daily',
    streak: 14,
    bestStreak: 20,
    color: '#3B82F6',
    createdAt: '2026-08-01',
    history: {
      '2026-10-20': true,
      '2026-10-21': false,
      '2026-10-22': true,
      '2026-10-23': true,
      '2026-10-24': true,
      '2026-10-25': true,
      '2026-10-26': true
    }
  },
  {
    id: 'habit-3',
    title: 'Meditate',
    category: 'Mindfulness',
    frequency: 'daily',
    streak: 9,
    bestStreak: 15,
    color: '#8B5CF6',
    createdAt: '2026-08-01',
    history: {
      '2026-10-20': true,
      '2026-10-21': true,
      '2026-10-22': true,
      '2026-10-23': true,
      '2026-10-24': true,
      '2026-10-25': true,
      '2026-10-26': true
    }
  },
  {
    id: 'habit-4',
    title: 'Drink Water (3L)',
    category: 'Health',
    frequency: 'daily',
    streak: 21,
    bestStreak: 30,
    color: '#14B8A6',
    createdAt: '2026-08-01',
    history: {
      '2026-10-20': true,
      '2026-10-21': true,
      '2026-10-22': true,
      '2026-10-23': true,
      '2026-10-24': true,
      '2026-10-25': true,
      '2026-10-26': true
    }
  },
  {
    id: 'habit-5',
    title: 'No Social Media',
    category: 'Focus',
    frequency: 'daily',
    streak: 6,
    bestStreak: 12,
    color: '#F59E0B',
    createdAt: '2026-08-01',
    history: {
      '2026-10-20': true,
      '2026-10-21': true,
      '2026-10-22': true,
      '2026-10-23': true,
      '2026-10-24': false,
      '2026-10-25': false,
      '2026-10-26': false
    }
  }
];

export const initialScheduleEvents: ScheduleEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Meeting',
    date: '2026-10-26',
    startTime: '09:00',
    endTime: '10:00',
    category: 'Work',
    color: '#3B82F6',
    notes: 'Weekly product roadmap sync and release checklist.'
  },
  {
    id: 'evt-2',
    title: 'Lunch Break',
    date: '2026-10-26',
    startTime: '12:00',
    endTime: '13:00',
    category: 'Personal',
    color: '#10B981',
    notes: 'Healthy home-cooked meal and mindful screen rest.'
  },
  {
    id: 'evt-3',
    title: 'Study Session',
    date: '2026-10-26',
    startTime: '15:00',
    endTime: '16:00',
    category: 'Study',
    color: '#8B5CF6',
    notes: 'Algorithms problem sets: Graph traversals (BFS/DFS).'
  },
  {
    id: 'evt-4',
    title: 'Gym Workout',
    date: '2026-10-26',
    startTime: '18:00',
    endTime: '19:00',
    category: 'Health',
    color: '#F59E0B',
    notes: 'Leg day and mobility stretches.'
  }
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Important points for exam',
    content: '• DSA revision: Heap, Graph Dijkstra, Binary Search Variations\n• System design concepts: Rate limiter, Consistent hashing, Sharding\n• Keep practicing daily: 2 problems morning, 1 in evening\n• Focus on time complexity and space bounds analysis',
    folder: 'Study',
    tags: ['DSA', 'Prep', 'Career'],
    pinned: true,
    favorite: true,
    updatedAt: '2026-10-26T05:30:00.000Z',
    createdAt: '2026-10-24T10:00:00.000Z'
  },
  {
    id: 'note-2',
    title: 'Q4 Product Roadmap Ideas',
    content: 'Core initiatives to explore:\n1. Frictionless universal sharing link generator\n2. Smart auto-tagging for receipts & invoice storage\n3. Export full weekly life recap as formatted PDF',
    folder: 'Work',
    tags: ['SaaS', 'Strategy'],
    pinned: false,
    favorite: true,
    updatedAt: '2026-10-25T14:20:00.000Z',
    createdAt: '2026-10-20T11:00:00.000Z'
  },
  {
    id: 'note-3',
    title: 'High-Protein Meal Prep Plan',
    content: 'Groceries: Paneer, Tofu, Greek Yogurt, Oats, Chia seeds, Eggs, Spinach, Almonds.\nTarget: 110g protein daily with clean hydration.',
    folder: 'Health',
    tags: ['Fitness', 'Diet'],
    pinned: false,
    favorite: false,
    updatedAt: '2026-10-23T09:00:00.000Z',
    createdAt: '2026-10-23T09:00:00.000Z'
  }
];

export const initialTransactions: Transaction[] = [
  { id: 'tx-1', type: 'income', title: 'Monthly Salary', amount: 28000, category: 'Others', date: '2026-10-01' },
  { id: 'tx-2', type: 'expense', title: 'Groceries & Organic Staples', amount: 3980, category: 'Food & Dining', date: '2026-10-05' },
  { id: 'tx-3', type: 'expense', title: 'Metro Pass & Uber Commute', amount: 2490, category: 'Transport', date: '2026-10-10' },
  { id: 'tx-4', type: 'expense', title: 'Office Stationery & Books', amount: 1870, category: 'Shopping', date: '2026-10-14' },
  { id: 'tx-5', type: 'expense', title: 'Electricity & High-Speed WiFi', amount: 1490, category: 'Bills', date: '2026-10-18' },
  { id: 'tx-6', type: 'expense', title: 'Gym Membership & Supplements', amount: 2620, category: 'Others', date: '2026-10-22' }
];

export const initialSavings: SavingsTarget = {
  id: 'sav-1',
  title: 'Monthly Savings Goal',
  targetAmount: 50000,
  currentAmount: 36000,
  monthlyTarget: 14000,
  deadline: '2026-12-31'
};

export const initialVaultDocuments: VaultDocument[] = [
  {
    id: 'doc-1',
    title: 'Project_Report.pdf',
    originalFileName: 'Project_Report.pdf',
    fileType: 'pdf',
    sizeBytes: 2450000,
    category: 'Work',
    tags: ['Report', 'Sprint', 'Q4'],
    pinned: true,
    favorite: true,
    uploadedAt: '2026-10-26T05:15:00.000Z',
    fileContentPreview: 'OneSpace Platform Technical Architecture and Comprehensive Deployment Overview.'
  },
  {
    id: 'doc-2',
    title: 'Resume.docx',
    originalFileName: 'Resume_Priya_Sharma.docx',
    fileType: 'docx',
    sizeBytes: 184000,
    category: 'Identity',
    tags: ['Career', 'CV', 'Updated'],
    pinned: true,
    favorite: true,
    uploadedAt: '2026-10-26T02:00:00.000Z',
    fileContentPreview: 'Priya Sharma - Senior Full Stack Product Developer & System Architect'
  },
  {
    id: 'doc-3',
    title: 'Study_Material.pdf',
    originalFileName: 'DSA_Advanced_Patterns.pdf',
    fileType: 'pdf',
    sizeBytes: 4120000,
    category: 'Academic',
    tags: ['Algorithms', 'Interview'],
    pinned: false,
    favorite: false,
    uploadedAt: '2026-10-25T08:00:00.000Z',
    fileContentPreview: 'Comprehensive Dynamic Programming Patterns and Graph Traversal Handouts'
  },
  {
    id: 'doc-4',
    title: 'Budget_2025.xlsx',
    originalFileName: 'Personal_Budget_Allocation.xlsx',
    fileType: 'xlsx',
    sizeBytes: 95000,
    category: 'Finance',
    tags: ['Budget', 'Tax', 'Savings'],
    pinned: false,
    favorite: true,
    uploadedAt: '2026-10-25T07:30:00.000Z',
    fileContentPreview: 'Monthly Cash Flow Forecast: 50/30/20 Rule Ledger and Investments'
  }
];

export const initialUniversalInbox: UniversalInboxItem[] = [
  {
    id: 'ui-1',
    title: 'YouTube - Productivity Tips (Ali Abdaal)',
    source: 'YouTube',
    type: 'link',
    url: 'https://youtube.com/watch?v=productivity-mastery',
    description: 'System for time blocking, task batching, and maintaining flow state throughout deep work hours.',
    category: 'Productivity',
    tags: ['Video', 'Focus', 'Workflow'],
    savedAt: '2026-10-26T01:30:00.000Z',
    processed: false
  },
  {
    id: 'ui-2',
    title: 'WhatsApp Document - Tax Proof Guidelines 2026',
    source: 'WhatsApp',
    type: 'document',
    url: '',
    description: 'HR update regarding 80C exemptions, medical insurance bills submission deadline before end of quarter.',
    category: 'Finance',
    tags: ['Taxes', 'Receipts', 'HR'],
    savedAt: '2026-10-25T18:40:00.000Z',
    processed: true
  },
  {
    id: 'ui-3',
    title: 'Gmail Attachment - Q3 Health Checkup Report',
    source: 'Gmail',
    type: 'document',
    url: '',
    description: 'Lab test results, lipid profile, vitamin D3 levels and doctor notes.',
    category: 'Health',
    tags: ['Medical', 'Reports'],
    savedAt: '2026-10-24T14:15:00.000Z',
    processed: true
  },
  {
    id: 'ui-4',
    title: 'Telegram Link - React 19 Architecture deep dive',
    source: 'Telegram',
    type: 'link',
    url: 'https://react.dev/blog/2026/react-19-patterns',
    description: 'In-depth notes on Server Actions, optimistic UI updates, and resource prefetching.',
    category: 'Development',
    tags: ['Code', 'React'],
    savedAt: '2026-10-23T11:00:00.000Z',
    processed: false
  }
];

export const initialFocusSessions: FocusSession[] = [
  { id: 'fs-1', taskTitle: 'Complete project proposal', durationMinutes: 50, completedAt: '2026-10-26T09:50:00.000Z' },
  { id: 'fs-2', taskTitle: 'Study DSA - Arrays', durationMinutes: 45, completedAt: '2026-10-26T12:30:00.000Z' },
  { id: 'fs-3', taskTitle: 'System Design Reading', durationMinutes: 25, completedAt: '2026-10-25T16:00:00.000Z' }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Goal Milestone Achieved!',
    message: 'You completed 65% of your DSA Course target. Keep pushing!',
    time: '2 hours ago',
    read: false,
    type: 'goal'
  },
  {
    id: 'notif-2',
    title: 'Habit Streak On Fire 🔥',
    message: '18-day workout streak logged. You are in the top 5% of consistent users.',
    time: '5 hours ago',
    read: true,
    type: 'habit'
  },
  {
    id: 'notif-3',
    title: 'Budget Alert',
    message: 'Monthly savings reached 72% (₹36,000 / ₹50,000).',
    time: '1 day ago',
    read: true,
    type: 'system'
  }
];
