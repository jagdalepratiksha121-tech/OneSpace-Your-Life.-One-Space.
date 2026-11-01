export type UserPurpose = 'Student' | 'Working Professional' | 'Freelancer' | 'Entrepreneur' | 'Personal Use';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  purpose: UserPurpose;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  currencySymbol: string;
  timezone: string;
  theme: 'light' | 'dark';
  isPro: boolean;
  onboardingCompleted: boolean;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'Work' | 'Study' | 'Health' | 'Personal' | 'Finance';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "10:00 AM"
  subtasks: SubTask[];
  linkedGoalId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Career' | 'Study' | 'Financial' | 'Fitness' | 'Personal';
  targetValue: number;
  currentValue: number;
  unit: string; // e.g. '%', 'books', 'kg', '₹'
  timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Long-term';
  startDate: string;
  deadline: string;
  milestones: GoalMilestone[];
  color: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  bestStreak: number;
  color: string;
  // History key is YYYY-MM-DD: boolean
  history: Record<string, boolean>;
  createdAt: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  category: 'Work' | 'Study' | 'Meeting' | 'Health' | 'Personal';
  color: string;
  notes?: string;
  reminderMinutes?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  linkedTaskId?: string;
  linkedGoalId?: string;
  updatedAt: string;
  createdAt: string;
}

export type ExpenseCategory = 'Food & Dining' | 'Transport' | 'Shopping' | 'Bills' | 'Health' | 'Education' | 'Entertainment' | 'Others';

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  notes?: string;
  recurring?: boolean;
}

export interface MoneyToReceivePayment {
  id: string;
  date: string;
  amount: number;
  notes?: string;
}

export interface MoneyToReceive {
  id: string;
  personName: string;
  originalAmount: number;
  remainingAmount: number;
  dateGiven: string; // YYYY-MM-DD
  reminderDateTime?: string; // YYYY-MM-DDTHH:mm
  reminderFired?: boolean;
  notes?: string;
  status: 'pending' | 'partially_received' | 'received';
  receivedAt?: string;
  payments?: MoneyToReceivePayment[];
  createdAt: string;
}

export type PinnedItemType = 'money' | 'task' | 'goal' | 'note' | 'information' | 'document';

export interface PinnedHomeItem {
  id: string; // unique pin id
  itemId: string; // referenced record id
  type: PinnedItemType;
  customLabel?: string;
  order: number;
  pinnedAt: string;
}

export interface SavingsTarget {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyTarget: number;
  deadline: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  originalFileName: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image' | 'text' | 'other';
  sizeBytes: number;
  category: 'Work' | 'Academic' | 'Identity' | 'Finance' | 'Receipts' | 'Other';
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  uploadedAt: string;
  fileUrl?: string;
  fileContentPreview?: string;
}

export type UniversalSource = 'WhatsApp' | 'Gmail' | 'Telegram' | 'Web Link' | 'YouTube' | 'Instagram' | 'Manual Upload' | 'Quick Note';

export interface UniversalInboxItem {
  id: string;
  title: string;
  source: UniversalSource;
  type: 'link' | 'document' | 'snippet' | 'media';
  url?: string;
  description: string;
  category: string;
  tags: string[];
  savedAt: string;
  processed: boolean;
}

export interface FocusSession {
  id: string;
  taskTitle?: string;
  durationMinutes: number;
  completedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'task' | 'goal' | 'habit' | 'system';
}
