// Authentication Types
export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  study_level?: string;
  preferred_hours?: number;
  study_style?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms_accepted: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  study_plan_id?: string;
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  due_date?: string;
  duration_minutes?: number;
}

// Study Plan Types
export interface StudyPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  weekly_hours: number;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateStudyPlanData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  weekly_hours: number;
  subjects: string[];
}

// Focus Session Types
export interface FocusSession {
  id: string;
  user_id: string;
  task_id?: string;
  duration_minutes: number;
  completed: boolean;
  distractions_count: number;
  notes?: string;
  session_date: string;
  created_at: string;
}

export interface CreateFocusSessionData {
  task_id?: string;
  duration_minutes: number;
  distractions_count?: number;
  notes?: string;
}

// Productivity Types
export interface ProductivityLog {
  id: string;
  user_id: string;
  date: string;
  total_study_minutes: number;
  tasks_completed: number;
  subjects: string[];
  focus_score?: number;
  mood?: 'excellent' | 'good' | 'okay' | 'poor';
  created_at: string;
}

// Notification Types
export type NotificationType = 'reminder' | 'achievement' | 'insight' | 'alert';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Dashboard Widget Types
export interface DashboardMetrics {
  totalStudyMinutes: number;
  tasksCompleted: number;
  currentStreak: number;
  focusScore: number;
}

export interface WidgetData {
  title: string;
  value: number | string;
  change?: number;
  unit?: string;
}

// Analytics Types
export interface AnalyticsData {
  date: string;
  studyMinutes: number;
  tasksCompleted: number;
  focusScore: number;
  mood?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}
