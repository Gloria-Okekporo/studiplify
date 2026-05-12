'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export type NotificationType = 'upcoming' | 'missed' | 'deadline' | 'streak' | 'exam' | 'system';

export interface StudyReminder {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export async function getReminders() {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  try {
    const now = new Date();
    const reminders: Partial<StudyReminder>[] = [];

    // 1. Fetch User Data
    const [tasksRes, plansRes, analyticsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', session.user.id).eq('status', 'pending'),
      supabase.from('study_plans').select('*').eq('user_id', session.user.id),
      supabase.from('productivity_analytics').select('*').eq('user_id', session.user.id).order('date', { ascending: false }).limit(5)
    ]);

    const tasks = tasksRes.data || [];
    const plans = plansRes.data || [];
    const analytics = analyticsRes.data || [];

    // 2. Upcoming Study Sessions & Deadlines
    tasks.forEach(task => {
      const dueDate = new Date(task.due_date);
      const diffHrs = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffHrs > 0 && diffHrs <= 24) {
        const messages = [
          `Ready for "${task.title}"? Your scheduled session starts soon. Let's keep the momentum!`,
          `High performance alert: "${task.title}" is coming up. Get your water ready!`,
          `Your future self will thank you for starting "${task.title}" on time. Ready?`
        ];
        reminders.push({
          id: `upcoming-${task.id}`,
          type: 'upcoming',
          title: 'Upcoming Session',
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: task.due_date,
          priority: diffHrs < 2 ? 'high' : 'medium',
          is_read: false
        });
      } else if (diffHrs < 0) {
        reminders.push({
          id: `missed-${task.id}`,
          type: 'missed',
          title: 'Missed Focus Block',
          message: `You missed "${task.title}". Don't let it weigh you down! Jump back into a quick 5-min session now to stay on track.`,
          timestamp: task.due_date,
          priority: 'high',
          is_read: false
        });
      }
    });

    // 3. Streak Maintenance
    const todayStr = now.toISOString().split('T')[0];
    const hasActivityToday = analytics.some(a => a.date === todayStr);
    
    if (!hasActivityToday) {
      const hoursLeft = 24 - now.getHours();
      reminders.push({
        id: 'streak-warning',
        type: 'streak',
        title: 'Protect Your Streak!',
        message: `Only ${hoursLeft} hours left to keep your streak alive! A quick review session is all it takes to maintain your progress.`,
        timestamp: now.toISOString(),
        priority: 'high',
        is_read: false
      });
    }

    // 4. Exam Preparation
    plans.forEach(plan => {
      if (plan.description?.includes('Target Exam:')) {
        const examDateMatch = plan.description.match(/Target Exam: (\d{4}-\d{2}-\d{2})/);
        if (examDateMatch) {
          const examDate = new Date(examDateMatch[1]);
          const daysLeft = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysLeft > 0 && daysLeft <= 14) {
            const motivationalTips = [
              "Remember: Consistency beats intensity.",
              "Small steps lead to big results.",
              "Focus on mastery, not just completion."
            ];
            reminders.push({
              id: `exam-${plan.id}`,
              type: 'exam',
              title: 'Exam Countdown',
              message: `${daysLeft} days until your target for "${plan.title}". ${motivationalTips[Math.floor(Math.random() * motivationalTips.length)]}`,
              timestamp: now.toISOString(),
              priority: daysLeft <= 3 ? 'high' : 'medium',
              is_read: false
            });
          }
        }
      }
    });

    // 5. System Welcome / Success (Show if empty to demonstrate functionality)
    if (reminders.length === 0) {
      reminders.push({
        id: 'system-welcome',
        type: 'system',
        title: 'Study Intel Active',
        message: "Your intelligent reminder automation is online. Add a task or study plan to start receiving personalized focus alerts!",
        timestamp: now.toISOString(),
        priority: 'medium',
        is_read: false
      });
    }

    // Sort by priority and timestamp
    return { 
      success: true, 
      data: reminders.sort((a, b) => {
        const priorityMap = { high: 0, medium: 1, low: 2 };
        return priorityMap[a.priority!] - priorityMap[b.priority!];
      }) 
    };

  } catch (error: any) {
    console.error('Reminder Generation Error:', error);
    return { success: false, error: error.message };
  }
}
