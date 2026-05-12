'use server';

import { createActionSupabaseClient } from '../supabase-server';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: 'focus' | 'tasks' | 'knowledge' | 'consistency';
}

export interface ProgressionData {
  xp: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
  totalXPForNextLevel: number;
  streak: number;
  totalTasks: number;
  totalFocusHours: number;
  achievements: Achievement[];
}

export async function getProgressionData() {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  try {
    const [tasksRes, sessionsRes, quizzesRes, analyticsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', session.user.id).eq('status', 'completed'),
      supabase.from('focus_sessions').select('*').eq('user_id', session.user.id),
      supabase.from('quizzes').select('*').eq('user_id', session.user.id),
      supabase.from('productivity_analytics').select('*').eq('user_id', session.user.id).order('date', { ascending: false })
    ]);

    const tasksCount = tasksRes.data?.length || 0;
    const sessions = sessionsRes.data || [];
    const focusMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);
    const quizzesCount = quizzesRes.data?.length || 0;
    const analytics = analyticsRes.data || [];

    // Calculate XP
    // 50 per task, 4 per focus minute, 150 per quiz
    let xp = (tasksCount * 50) + (focusMinutes * 4) + (quizzesCount * 150);
    
    // Streak Bonus (200 XP per streak day)
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < analytics.length; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (analytics.some(a => a.date === dateStr && (a.study_time_minutes > 0 || a.tasks_completed > 0))) {
        streak++;
      } else if (i > 0) break;
    }
    xp += (streak * 200);

    // Calculate Level
    // Level 1: 0, Level 2: 500, Level 3: 1500, Level 4: 3000... (n^2 * 250)
    const level = Math.floor(Math.sqrt(xp / 250)) + 1;
    const totalXPForNextLevel = Math.pow(level, 2) * 250;
    const currentLevelBaseXP = Math.pow(level - 1, 2) * 250;
    const currentLevelXP = xp - currentLevelBaseXP;
    const xpToNextLevel = totalXPForNextLevel - xp;

    // Achievement Logic
    const achievements: Achievement[] = [
      { id: 'first-task', title: 'Action Taker', description: 'Complete your first task', icon: 'task_alt', category: 'tasks', unlocked: tasksCount >= 1 },
      { id: 'focus-5', title: 'Deep Work Novice', description: 'Complete 5 focus sessions', icon: 'bolt', category: 'focus', unlocked: sessions.length >= 5 },
      { id: 'focus-20', title: 'Flow Master', description: 'Complete 20 focus sessions', icon: 'psychology', category: 'focus', unlocked: sessions.length >= 20 },
      { id: 'streak-3', title: 'Consistency King', description: 'Maintain a 3-day streak', icon: 'local_fire_department', category: 'consistency', unlocked: streak >= 3 },
      { id: 'quiz-master', title: 'Knowledge Hunter', description: 'Complete 10 quizzes', icon: 'school', category: 'knowledge', unlocked: quizzesCount >= 10 },
      { id: 'task-50', title: 'Execution Expert', description: 'Complete 50 tasks', icon: 'verified', category: 'tasks', unlocked: tasksCount >= 50 },
    ];

    return {
      success: true,
      data: {
        xp,
        level,
        xpToNextLevel,
        currentLevelXP,
        totalXPForNextLevel: totalXPForNextLevel - currentLevelBaseXP,
        streak,
        totalTasks: tasksCount,
        totalFocusHours: Math.round(focusMinutes / 60 * 10) / 10,
        achievements
      } as ProgressionData
    };

  } catch (error: any) {
    console.error('Progression Fetch Error:', error);
    return { success: false, error: error.message };
  }
}
