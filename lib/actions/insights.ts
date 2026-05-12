'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';
import { checkRateLimit, handleServerError } from '../rate-limit';

export async function generatePersonalizedAIInsight(providedUserId?: string) {
  const supabase = createActionSupabaseClient();
  let userId: string;

  if (providedUserId) {
    userId = providedUserId;
  } else {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, message: 'Unauthorized' };
    userId = session.user.id;
  }

  try {
    // 1. Production Rate Limiting (only for web triggers, skip for automation)
    if (!providedUserId) {
      const limitCheck = await checkRateLimit('ai_insight', 10);
      if (!limitCheck.allowed) {
        return { success: false, message: limitCheck.reason };
      }
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();

    // 2. Optimized Data Fetching
    const [tasksRes, sessionsRes, quizzesRes, analyticsRes, plansRes] = await Promise.all([
      supabase.from('tasks').select('id, status').eq('user_id', userId),
      supabase.from('focus_sessions').select('duration_minutes').eq('user_id', userId).gte('created_at', sevenDaysAgo),
      supabase.from('quizzes').select('score').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('productivity_analytics').select('date, study_time_minutes, tasks_completed').eq('user_id', userId).order('date', { ascending: false }).limit(14),
      supabase.from('study_plans').select('title, description').eq('user_id', userId).limit(1)
    ]);

    const tasks = tasksRes.data || [];
    const sessions = sessionsRes.data || [];
    const quizzes = quizzesRes.data || [];
    const analytics = analyticsRes.data || [];
    const studyPlan = plansRes.data?.[0];

    const completedTasks = tasks.filter(t => t.status === 'completed' || (t as any).completed === true).length;
    const pendingTasks = tasks.filter(t => t.status === 'pending' || (t as any).completed === false).length;
    const focusTime = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);
    const avgQuizScore = quizzes.length > 0 
      ? quizzes.reduce((acc, q) => acc + (q.score || 0), 0) / quizzes.length 
      : 0;
    
    let streak = 0;
    for (let i = 0; i < analytics.length; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStr = day.toISOString().split('T')[0];
      if (analytics.some(a => a.date === dayStr && (a.study_time_minutes > 0 || a.tasks_completed > 0))) {
        streak++;
      } else if (i > 0) break;
    }

    // 3. Robust AI Analysis
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('AI Configuration Missing');

    const prompt = `You are an expert AI Study Coach for Studiplify. Analyze this student's performance and provide a personalized daily insight.
    
    Context:
    - User Study Plan: ${studyPlan ? `${studyPlan.title} (${studyPlan.description})` : 'No active study plan'}
    - Tasks: ${completedTasks} completed, ${pendingTasks} remaining.
    - Deep Work (Last 7 days): ${focusTime} minutes.
    - Knowledge: ${Math.round(avgQuizScore)}% average score on last 5 quizzes.
    - Consistency: ${streak} day active streak.
    
    Output MUST be a JSON object with these EXACT fields:
    {
      "today_insight": "A motivational and insightful summary of their current status (2 sentences).",
      "productivity_recommendation": "A specific, actionable tip based on their task/focus data.",
      "consistency_feedback": "Feedback on their streak and study habits.",
      "insight_type": "focus|knowledge|productivity",
      "title": "A short catchy title for today"
    }`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Gemini API Error:', errorData);
      throw new Error('AI Provider Unavailable');
    }

    const responseData = await res.json();
    const aiText = responseData.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiPayload = JSON.parse(aiText);

    // 4. Atomic Database Insert
    // We'll store the whole JSON in the 'insight' column as requested by the user
    const { data: savedInsight, error: saveError } = await supabase
      .from('daily_ai_insights')
      .insert([{
        user_id: userId,
        insight: aiPayload
      }])
      .select()
      .single();

    if (saveError) throw saveError;

    if (!providedUserId) revalidatePath('/dashboard');
    return { success: true, data: savedInsight };

  } catch (error: any) {
    console.error('Insight Generation Error:', error);
    return { success: false, message: error.message };
  }
}

export const generateAIProductivityInsights = generatePersonalizedAIInsight;

export async function getLatestPersonalizedInsight() {
  try {
    const supabase = createActionSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, message: 'Unauthorized' };

    const { data, error } = await supabase
      .from('daily_ai_insights')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    return { success: true, data: data?.[0] || null };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
