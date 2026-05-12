'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

/**
 * Modular function to handle file upload to Supabase Storage
 */
async function uploadDocument(supabase: any, userId: string, file: File) {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`[Summarizer] [${new Date().toISOString()}] Uploading ${file.name} to storage...`);

  const { data, error } = await supabase.storage
    .from('summaries')
    .upload(fileName, buffer, { contentType: file.type, upsert: true });

  if (error) {
    console.error('[Summarizer] Storage upload failed:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage.from('summaries').getPublicUrl(fileName);
  return { publicUrl, buffer, fileExt };
}

/**
 * Modular function to generate summary via Gemini AI
 */
async function generateSummary(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "AI Configuration Missing. Document saved without summary.";

  console.log(`[Summarizer] [${new Date().toISOString()}] Requesting Gemini AI summary...`);

  try {
    const prompt = `You are a professional academic summarizer. 
    Summarize the following document content into a clear, structured summary for a student.
    Use bullet points for key concepts and provide a "Key Takeaway" at the end.
    
    Content: ${text.slice(0, 12000)}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);
    
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
  } catch (error) {
    console.error('[Summarizer] AI generation failed:', error);
    return "AI generation failed. Document saved.";
  }
}

/**
 * Modular function to save results ONLY to ai_summaries
 */
async function saveSummary(supabase: any, userId: string, title: string, originalFileName: string, fileUrl: string, summary: string) {
  console.log(`[Summarizer] [${new Date().toISOString()}] INSERTING INTO ai_summaries table...`);
  
  const { data, error } = await supabase
    .from('ai_summaries')
    .insert([{
      user_id: userId,
      title: title,
      original_file_name: originalFileName,
      file_url: fileUrl,
      summary: summary
    }])
    .select()
    .single();

  if (error) {
    console.error('[Summarizer] FATAL: Failed to insert into ai_summaries:', error);
    throw error;
  }

  console.log(`[Summarizer] [${new Date().toISOString()}] SUCCESS: Row created in ai_summaries with ID ${data.id}`);
  return data;
}

/**
 * Main entry point for the summarizer flow
 */
export async function uploadAndSummarize(formData: FormData) {
  const supabase = createActionSupabaseClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Unauthorized');

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // 1. Upload
    const { publicUrl, buffer, fileExt } = await uploadDocument(supabase, session.user.id, file);

    // 2. Extract Text
    let text = '';
    if (fileExt === 'pdf') {
      const pdfData = await pdf(buffer);
      text = pdfData.text;
    } else if (fileExt === 'docx') {
      const docxData = await mammoth.extractRawText({ buffer });
      text = docxData.value;
    } else {
      text = buffer.toString('utf-8');
    }

    // 3. Summarize
    const summary = await generateSummary(text);

    // 4. Save
    const savedDoc = await saveSummary(
      supabase, 
      session.user.id, 
      file.name, 
      file.name, 
      publicUrl, 
      summary
    );

    revalidatePath('/dashboard/summarizer');
    return { success: true, data: savedDoc };

  } catch (error: any) {
    console.error('[Summarizer] Entry point failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getSummaries() {
  const supabase = createActionSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    console.log(`[Summarizer] [${new Date().toISOString()}] Fetching docs from ai_summaries...`);

    const { data, error } = await supabase
      .from('ai_summaries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('[Summarizer] getSummaries failed:', error);
    return { success: false, error: error.message };
  }
}
