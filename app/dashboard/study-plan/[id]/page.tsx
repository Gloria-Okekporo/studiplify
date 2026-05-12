import { getStudyPlanById } from '@/lib/actions/studyPlans';
import { getTasks } from '@/lib/actions/tasks';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import DashboardSidebar from '@/components/Dashboard/Sidebar';
import DashboardHeader from '@/components/Dashboard/Header';
import MobileNav from '@/components/Dashboard/MobileNav';
import Link from 'next/link';

export default async function StudyPlanDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) redirect('/auth/login');

  try {
    const { data: plan, error: planError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (planError || !plan) {
      console.error('Plan Fetch Error:', planError);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-10">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="w-24 h-24 bg-accent-orange/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-accent-orange">
              <span className="material-symbols-outlined text-[48px] font-black">search_off</span>
            </div>
            <h2 className="text-4xl font-black text-text-dark tracking-tighter leading-tight">Roadmap Missing</h2>
            <p className="text-lg text-text-muted font-medium leading-relaxed italic">"The path you seek has been archived or never architected."</p>
            <Link href="/dashboard/study-plan" className="btn-primary !h-14 !rounded-full shadow-glow-primary inline-flex items-center gap-3">
              <span className="material-symbols-outlined font-black">arrow_back</span>
              Return to Control Center
            </Link>
          </div>
        </div>
      );
    }

    const { data: planTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    // Safely filter by study_plan_id in-memory to avoid DB column errors during migration
    const filteredTasks = planTasks ? planTasks.filter((t: any) => t.study_plan_id === plan.id) : [];

    const userForSidebar = {
      ...session.user,
      full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
    };

    return (
      <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
        <DashboardSidebar user={userForSidebar} />
        
        <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
          <DashboardHeader title="Strategic View" />

          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="max-w-[1000px] mx-auto px-8 lg:px-12 py-12 space-y-12">
              
              <div className="space-y-6">
                <Link href="/dashboard/study-plan" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent-orange transition-all group">
                  <span className="material-symbols-outlined text-[16px] font-bold group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Back to All Roadmaps
                </Link>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-orange/10 text-accent-orange rounded-full text-[10px] font-black uppercase tracking-widest border border-accent-orange/20 shadow-sm">
                      <span className="material-symbols-outlined text-[16px] font-black">bolt</span>
                      {plan.difficulty || 'Standard'} Mode
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-muted/40 uppercase tracking-[0.2em]">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Architected {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h1 className="text-6xl font-black text-text-dark tracking-tighter leading-none max-w-4xl">
                    {plan.title}
                  </h1>
                  <div className="p-8 bg-surface-dim/40 backdrop-blur-md rounded-[3rem] border border-border/20 shadow-soft-inner">
                    <p className="text-[18px] lg:text-[22px] font-medium text-text-dark/90 leading-relaxed italic">
                      "{plan.description}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-10 pb-32">
                <div className="flex items-center justify-between border-b border-border/20 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-text-dark tracking-tighter">Syllabus Milestones</h3>
                    <p className="text-sm font-medium text-text-muted opacity-60">Phase-by-phase execution roadmap</p>
                  </div>
                  <div className="px-5 py-2 bg-white border border-border/30 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-accent-orange">
                    {filteredTasks?.length || 0} Components
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {filteredTasks && filteredTasks.length > 0 ? (
                    filteredTasks.map((task: any) => (
                      <div key={task.id} className="group bg-white border border-border/40 rounded-[2.5rem] p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-soft hover:shadow-md hover:border-accent-orange/30 transition-all">
                        <div className="flex items-center gap-6">
                          <div className={`shrink-0 w-12 h-12 rounded-[1.2rem] border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-accent-green border-accent-green text-white shadow-glow-green' : 'border-border/30 text-transparent'}`}>
                            <span className="material-symbols-outlined text-[20px] font-black">check_circle</span>
                          </div>
                          <div>
                            <p className={`text-[19px] font-black tracking-tight leading-tight ${task.completed ? 'text-text-muted/40 line-through' : 'text-text-dark'}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm font-medium text-text-muted opacity-60 mt-1">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 self-end sm:self-auto">
                          {task.due_date && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-surface-dim rounded-xl border border-border/20">
                              <span className="material-symbols-outlined text-[16px] text-accent-orange font-bold">event</span>
                              <span className="text-[10px] font-black text-text-dark uppercase tracking-widest">
                                {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-24 bg-surface-dim/30 rounded-[3.5rem] border border-dashed border-border/40">
                      <div className="w-20 h-20 bg-white border border-border/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-text-muted/30">
                        <span className="material-symbols-outlined text-[40px] font-bold">architecture</span>
                      </div>
                      <p className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40">Milestones Pending Synchronization</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <MobileNav />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Fatal Navigation Error:', error);
    redirect('/dashboard/study-plan');
  }
}
