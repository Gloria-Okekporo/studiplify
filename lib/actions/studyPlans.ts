'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function generateAIStudyPlan(subject: string, difficulty: string) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  try {
    // Check if profile exists to prevent foreign key violations
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
    if (!profile) {
      await supabase.from('profiles').insert([{ 
        id: session.user.id, 
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || 'Student'
      }]);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let aiData = {
      recommendation: "Stay consistent and focus on fundamentals.",
      schedule: [
        { day: "Monday", focus: "Introduction", tasks: ["Read syllabus", "Basic concepts"] },
        { day: "Wednesday", focus: "Deep Dive", tasks: ["Problem solving", "Case study"] },
        { day: "Friday", focus: "Review", tasks: ["Quiz", "Summary notes"] }
      ]
    };

    if (apiKey) {
      const prompt = `You are an elite AI Academic Advisor. Create a professional study plan for a student.
      Subject: ${subject}
      Difficulty: ${difficulty}
      
      Requirements:
      1. Provide a specific, actionable recommendation.
      2. Create a weekly schedule with 3 key study days.
      3. Format the response strictly as a JSON object:
      {
        "recommendation": "detailed 2-sentence recommendation",
        "schedule": [
          { "day": "Day Name", "focus": "Topic", "tasks": ["task 1", "task 2"] }
        ]
      }`;

      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        if (res.ok) {
          const responseData = await res.json();
          const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (text) {
            // Extract JSON using regex to handle potential markdown wrappers
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              aiData = JSON.parse(jsonMatch[0]);
            }
          }
        }
      } catch (aiError) {
        console.error('AI Processing Error:', aiError);
        // Continue with mock data
      }
    }

    // Normalize AI data keys (Gemini sometimes returns different casing)
    const normalizedData = {
      recommendation: (aiData as any).recommendation || (aiData as any).ai_recommendation || (aiData as any).Recommendation || "Follow the structured syllabus for optimal results.",
      schedule: (aiData as any).schedule || (aiData as any).Schedule || (aiData as any).plan || []
    };

    // Safety check for schedule format
    if (!normalizedData.schedule || !Array.isArray(normalizedData.schedule)) {
      normalizedData.schedule = [
        { day: "Day 1", focus: "Fundamentals", tasks: ["Review core concepts", "Initial assessment"] },
        { day: "Day 3", focus: "Deep Dive", tasks: ["Practice problems", "Topic mastery"] },
        { day: "Day 5", focus: "Evaluation", tasks: ["Comprehensive review", "Mock test"] }
      ];
    }

    const { data, error } = await supabase
      .from('study_plans')
      .insert([{
        user_id: session.user.id,
        title: subject,
        description: normalizedData.recommendation,
        difficulty
      }])
      .select();

    if (error) {
      console.error('Supabase Insertion Error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    const insertedPlan = data?.[0];
    if (!insertedPlan) throw new Error('Failed to retrieve inserted plan.');

    // 2. Generate and Insert Tasks for each milestone in the schedule
    if (normalizedData.schedule && normalizedData.schedule.length > 0) {
      const taskInserts = normalizedData.schedule.map((item: any, index: number) => ({
        user_id: session.user.id,
        study_plan_id: insertedPlan.id,
        title: `${item.day}: ${item.focus}`,
        description: item.tasks ? item.tasks.join(', ') : '',
        priority: index === 0 ? 'Urgent' : 'Medium',
        due_date: new Date(Date.now() + (index * 86400000 * 2)).toISOString(), // Space tasks out
        status: 'pending'
      }));

      const { error: tasksError } = await supabase.from('tasks').insert(taskInserts);
      if (tasksError) console.error('Milestone Sync Error:', tasksError);
    }

    revalidatePath('/dashboard/study-plan');
    revalidatePath('/dashboard');
    return { success: true, data: insertedPlan };

  } catch (error: any) {
    console.error('Study Plan Generation Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getStudyPlans() {
  const supabase = createActionSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePlanProgress(planId: string, progress: number) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('study_plans')
    .update({ 
      progress: progress,
      updated_at: new Date().toISOString() 
    })
    .eq('id', planId)
    .eq('user_id', session.user.id);

  if (error) throw error;
  revalidatePath('/dashboard/study-plan');
  return { success: true };
}

export async function deleteStudyPlan(planId: string) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('study_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', session.user.id);

  if (error) throw error;
  revalidatePath('/dashboard/study-plan');
  return { success: true };
}

export async function getStudyPlanById(id: string) {
  const supabase = createActionSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
