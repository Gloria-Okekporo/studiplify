'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function generateStudyPlan(data: {
  subjects: string;
  examDate: string;
  studyHours: number;
  weakSubjects: string;
  learningGoals: string;
}) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  try {
    // Check for Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    let generatedTasks = [];

    if (apiKey) {
      const prompt = `You are an expert AI study planner. Create a study plan for a student.
      Subjects: ${data.subjects}
      Exam Date: ${data.examDate}
      Daily Study Hours: ${data.studyHours}
      Weak Subjects: ${data.weakSubjects}
      Goals: ${data.learningGoals}
      
      Generate a JSON array of tasks. Each task must have:
      - title (string)
      - description (string)
      - due_date (ISO string date between now and the exam date)
      Do not include any markdown, just pure JSON array.`;

      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        if (!res.ok) throw new Error('AI Generation failed');
        const responseData = await res.json();
        const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          const jsonMatch = text.match(/\[[\s\S]*\]/); // Looking for array
          if (jsonMatch) {
            generatedTasks = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Invalid AI response format');
          }
        }
      } catch (aiError) {
        console.error('AI Planner Generation Error:', aiError);
        throw aiError;
      }
    } else {
      // Fallback Mock Data if no API key is provided
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI thinking
      const subjectsArray = data.subjects.split(',').map(s => s.trim());
      const baseDate = new Date();
      generatedTasks = [
        {
          title: `Initial Review: ${subjectsArray[0] || 'Core Subject'}`,
          description: `Focus heavily on ${data.weakSubjects || 'foundations'} as per your weak areas.`,
          due_date: new Date(baseDate.getTime() + 86400000 * 1).toISOString(),
        },
        {
          title: `Deep Dive: ${data.weakSubjects ? data.weakSubjects.split(',')[0] : 'Concepts'}`,
          description: `Dedicated ${data.studyHours} hour session to master difficult topics.`,
          due_date: new Date(baseDate.getTime() + 86400000 * 3).toISOString(),
        },
        {
          title: `Practice Test & Evaluation`,
          description: `Evaluate progress towards: ${data.learningGoals}`,
          due_date: new Date(baseDate.getTime() + 86400000 * 5).toISOString(),
        },
        {
          title: `Final Revision Phase`,
          description: `Consolidate all notes across ${data.subjects}.`,
          due_date: new Date(baseDate.getTime() + 86400000 * 7).toISOString(),
        }
      ];
    }

    // Save to Database
    // 1. Create a Study Plan
    const { data: studyPlan, error: planError } = await supabase
      .from('study_plans')
      .insert([
        {
          user_id: session.user.id,
          title: `AI Plan: ${data.subjects.substring(0, 30)}...`,
          description: `Target Exam: ${data.examDate} | Goals: ${data.learningGoals}`,
        }
      ])
      .select()
      .single();

    if (planError) throw planError;

    // 2. Create tasks under this study plan
    const taskInserts = generatedTasks.map((t: any) => ({
      user_id: session.user.id,
      study_plan_id: studyPlan.id,
      title: t.title,
      description: t.description,
      due_date: t.due_date,
      status: 'pending'
    }));

    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(taskInserts);

    if (tasksError) throw tasksError;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/study-plan');
    return { success: true, planId: studyPlan.id };
  } catch (error: any) {
    console.error('AI Planner Error:', error);
    return { success: false, error: error.message };
  }
}
