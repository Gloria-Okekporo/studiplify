import DashboardClient from '@/components/Dashboard/DashboardClient';
import { getStudyPlans } from '@/lib/actions/studyPlans';
import { getTasks } from '@/lib/actions/tasks';
import { getProductivityAnalytics } from '@/lib/actions/analytics';
import { getLatestPersonalizedInsight } from '@/lib/actions/insights';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Suspense } from 'react';
import DashboardSkeleton from '@/components/Dashboard/DashboardSkeleton';

async function DashboardData() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  try {
    const [plansRes, tasksRes, analyticsRes, insightRes] = await Promise.all([
      getStudyPlans(),
      getTasks(),
      getProductivityAnalytics(),
      getLatestPersonalizedInsight()
    ]);

    const studyPlans = (plansRes as any).success ? (plansRes as any).data : [];
    const tasks = (tasksRes as any).success ? (tasksRes as any).data : [];
    const analytics = (analyticsRes as any).success ? (analyticsRes as any).data : [];
    const initialInsight = (insightRes as any).success ? (insightRes as any).data : null;

    return (
      <DashboardClient 
        user={session.user} 
        studyPlans={studyPlans} 
        tasks={tasks} 
        analytics={analytics} 
        initialInsight={initialInsight}
      />
    );
  } catch (error) {
    console.error('Dashboard Data Fetch Error:', error);
    return <DashboardClient user={session.user} studyPlans={[]} tasks={[]} analytics={[]} initialInsight={null} />;
  }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
