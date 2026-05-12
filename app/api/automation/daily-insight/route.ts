import { createClient } from '@supabase/supabase-js';
import { generatePersonalizedAIInsight } from '@/lib/actions/insights';
import { NextResponse } from 'next/server';

/**
 * Daily AI Insight Automation Route
 * Triggered by Make.com or Cron Jobs
 * 
 * Requirements:
 * 1. Fetch users, study_plans, quizzes, productivity_analytics (handled in generatePersonalizedAIInsight)
 * 2. Generate personalized AI insights using Gemini API
 * 3. Save generated insights into public.daily_ai_insights
 * 4. Return JSON response
 * 
 * Security: Requires Authorization header with SUPABASE_SECRET_KEY
 */
export async function POST(req: Request) {
  try {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    const automationSecret = process.env.SUPABASE_SECRET_KEY;
    
    if (!automationSecret || authHeader !== `Bearer ${automationSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized flow' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const targetUserId = body.user_id;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    if (targetUserId) {
      // Process specific user
      const result = await generatePersonalizedAIInsight(targetUserId);
      return NextResponse.json({
        success: result.success,
        user_id: targetUserId,
        generated_insight: result.data?.insight || null,
        error: !result.success ? result.message : undefined
      });
    } else {
      // Process all active users
      // Note: In a large system, this should be a background job
      const { data: profiles, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id');
      
      if (profileError) throw profileError;

      const results = [];
      for (const profile of profiles) {
        const result = await generatePersonalizedAIInsight(profile.id);
        results.push({
          user_id: profile.id,
          success: result.success,
          insight: result.data?.insight || null
        });
      }

      return NextResponse.json({
        success: true,
        processed: profiles.length,
        results
      });
    }

  } catch (error: any) {
    console.error('Automation Router Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Support GET for simple testing if secret is in query (optional, but good for debug)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userId = searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ success: false, error: 'user_id required for GET debug' });
  }

  const result = await generatePersonalizedAIInsight(userId);
  return NextResponse.json(result);
}
