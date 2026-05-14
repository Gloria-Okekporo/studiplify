import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DashboardClient from '@/components/Dashboard/DashboardClient';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Single call to get session for the entire page
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const userId = session.user.id;

  // Optimized parallel fetching directly through Supabase client
  // This bypasses the overhead of multiple server action calls and redundant auth checks
  const [plansRes, tasksRes, analyticsRes, insightsRes] = await Promise.all([
    supabase.from('study_plans').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('productivity_analytics').select('*').eq('user_id', userId).order('date', { ascending: false }),
    supabase.from('daily_ai_insights').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1)
  ]);

  // Normalize data with fallbacks
  const studyPlans = plansRes.data || [];
  const tasks = tasksRes.data || [];
  const analytics = analyticsRes.data || [];
  const initialInsight = insightsRes.data?.[0] || null;

  // Construct a clean user object for the client components
  const userData = {
    ...session.user,
    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Student',
    avatar_url: session.user.user_metadata?.avatar_url,
  };

  return (
    <DashboardClient 
      user={userData}
      studyPlans={studyPlans}
      tasks={tasks}
      analytics={analytics}
      initialInsight={initialInsight}
    />
  );
}
