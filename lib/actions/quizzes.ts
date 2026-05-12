'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function generateAIQuiz(topic: string, context?: string) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    let questions = [];

    if (apiKey) {
      const prompt = `You are an expert academic examiner. Generate a high-quality multiple choice quiz.
      Topic: ${topic}
      ${context ? `Context/Notes: ${context}` : ''}
      
      Requirements:
      1. Generate 5 challenging questions.
      2. Each question must have 4 options.
      3. Provide the correct answer (index 0-3).
      4. Provide a 1-sentence explanation for the correct answer.
      5. Response must be a JSON array of objects:
      [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": number,
          "explanation": "string"
        }
      ]`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      if (res.ok) {
        const responseData = await res.json();
        const aiText = responseData.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '');
        questions = JSON.parse(aiText);
      }
    }

    const { data, error } = await supabase
      .from('quizzes')
      .insert([{
        user_id: session.user.id,
        topic,
        questions,
        difficulty: 'Medium'
      }])
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/quizzes');
    return { success: true, data };

  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    return { success: false, error: error.message };
  }
}

export async function saveQuizResult(quizId: string, score: number) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('quizzes')
    .update({ score })
    .eq('id', quizId)
    .eq('user_id', session.user.id);

  if (error) throw error;
  
  revalidatePath('/dashboard/quizzes');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getUserQuizzes() {
  const supabase = createActionSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
