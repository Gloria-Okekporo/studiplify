import TasksClient from '@/components/Dashboard/TasksClient';
import { getTasks } from '@/lib/actions/tasks';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/Dashboard/Sidebar';
import DashboardHeader from '@/components/Dashboard/Header';
import MobileNav from '@/components/Dashboard/MobileNav';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const metadata = {
  title: 'Task Management - Studiplify',
};

export default async function TasksPage() {
  const tasksRes = await getTasks();
  const tasks = tasksRes.success ? tasksRes.data : [];
  
  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        <DashboardHeader title="Tasks" badge={`${tasks.filter((t: any) => !t.completed).length} Pending`} />
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[800px] mx-auto px-8 lg:px-12 py-12">
            <TasksClient initialTasks={tasks} />
          </div>
        </div>
        <MobileNav />
      </main>
    </div>
  );
}
