import { createActionSupabaseClient } from './supabase-server';

export async function checkRateLimit(actionName: string, maxPerDay: number = 20) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return { allowed: false, reason: 'Unauthorized' };

  const userId = session.user.id;
  const today = new Date().toISOString().split('T')[0];

  // For this simplified rate limiter, we'll check the count of specific actions in the DB
  // This is a cost-effective way to prevent API abuse
  
  let count = 0;
  
  if (actionName === 'ai_insight') {
    const { count: insightCount } = await supabase
      .from('ai_insights')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today);
    count = insightCount || 0;
  } else if (actionName === 'quiz') {
    const { count: quizCount } = await supabase
      .from('quizzes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today);
    count = quizCount || 0;
  } else if (actionName === 'summary') {
    const { count: summaryCount } = await supabase
      .from('summaries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today);
    count = summaryCount || 0;
  }

  if (count >= maxPerDay) {
    return { allowed: false, reason: 'Daily limit reached' };
  }

  return { allowed: true };
}

export async function handleServerError(error: any) {
  console.error('Server Error:', error);
  
  // Standardized error response
  return {
    success: false,
    message: error.message || 'An unexpected error occurred. Please try again.',
    code: error.code || 'UNKNOWN_ERROR'
  };
}
