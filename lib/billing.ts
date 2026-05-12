import { createActionSupabaseClient } from './supabase-server';

export async function checkFeatureAccess(feature: 'ai_insights' | 'summarizer' | 'quiz') {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return { allowed: false, reason: 'Unauthorized' };

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  const plan = subscription?.plan_type || 'free';

  // Example logic: Free users are restricted from the Summarizer
  if (plan === 'free' && feature === 'summarizer') {
    return { allowed: false, reason: 'upgrade_required' };
  }

  // Everyone else has access to basics
  return { allowed: true };
}

export async function getPlanLimits() {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  const plan = subscription?.plan_type || 'free';

  return {
    plan,
    isPro: plan === 'pro' || plan === 'team',
    isTeam: plan === 'team'
  };
}
