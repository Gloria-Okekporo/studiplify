'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function getChatHistory() {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to get chat history', error);
    return { success: false, data: [] };
  }

  return { success: true, data: data || [] };
}

export async function sendMessage(content: string, previousMessages: any[]) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  // 1. Save user message to DB
  const { data: savedUserMsg } = await supabase.from('chat_messages').insert({
    user_id: session.user.id,
    role: 'user',
    content: content,
  }).select().single();

  try {
    let aiResponse = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Format history for Gemini (assuming gemini-2.5-flash structure)
      // Note: In production you would format previousMessages into the correct Gemini parts array.
      // For this implementation, we will pass a concatenated prompt for simplicity.
      const historyContext = previousMessages.map(m => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`).join('\n');
      const prompt = `You are Studiplify's AI Assistant, an intelligent, supportive, and student-focused productivity coach.
      Answer questions concisely, provide actionable study advice, and help organize study sessions.
      
      Previous conversation:
      ${historyContext}
      
      Student: ${content}
      Assistant:`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      if (!res.ok) throw new Error('AI generation failed');
      const responseData = await res.json();
      aiResponse = responseData.candidates[0].content.parts[0].text;
    } else {
      // Mock Fallback if no API key is provided
      await new Promise(resolve => setTimeout(resolve, 1500));
      aiResponse = generateMockResponse(content);
    }

    // 2. Save assistant response to DB
    const { data: savedAssistantMsg } = await supabase.from('chat_messages').insert({
      user_id: session.user.id,
      role: 'assistant',
      content: aiResponse,
    }).select().single();

    revalidatePath('/dashboard/assistant');
    return { success: true, userMessage: savedUserMsg, aiMessage: savedAssistantMsg };

  } catch (error: any) {
    console.error('Chat error:', error);
    return { success: false, error: 'Failed to process AI response.' };
  }
}

function generateMockResponse(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
    return "Hello! I'm your Studiplify AI Assistant. How can I help you optimize your study sessions today?";
  }
  if (lowerPrompt.includes('tired') || lowerPrompt.includes('burnout')) {
    return "It sounds like you're experiencing cognitive fatigue. I recommend stepping away for a 15-minute break. Drink some water, stretch, and step away from the screen. Should I adjust your Study Planner to lighten your load for today?";
  }
  if (lowerPrompt.includes('schedule') || lowerPrompt.includes('plan')) {
    return "I can help with that. If you want a full schedule, you can head over to the Study Plans tab. Otherwise, tell me what you need to study right now and I'll break it down into 25-minute focus blocks for you.";
  }
  return "That's a great question. Based on learning science, breaking this down into smaller, manageable chunks (like the Pomodoro technique) will help you retain it better. Want me to set up a focus session for this topic?";
}
