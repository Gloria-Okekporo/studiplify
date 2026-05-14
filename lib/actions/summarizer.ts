'use server';

import { createActionSupabaseClient, createServerSupabaseClient } from '../supabase-server';
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

  console.log(`[Summarizer] [${new Date().toISOString()}] Ensuring bucket 'summaries' exists...`);
  
  // Ensure bucket exists
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b: any) => b.name === 'summaries')) {
      await supabase.storage.createBucket('summaries', { public: true });
    }
  } catch (bucketError) {
    console.error('[Summarizer] Bucket check/creation failed:', bucketError);
    // Continue anyway, as it might exist but listBuckets failed
  }

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
    
    Content: ${text.slice(0, 30000)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);
    
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
  } catch (error: any) {
    console.error('[Summarizer] AI generation failed:', error);
    if (error.name === 'AbortError') return "AI processing timed out for this large document. Document saved.";
    return "AI generation failed. Document saved.";
  }
}

/**
 * Modular function to save results ONLY to ai_summaries
 */
async function saveSummary(supabase: any, userId: string, title: string, originalFileName: string, fileUrl: string, summary: string) {
  console.log(`[Summarizer] [${new Date().toISOString()}] Attempting to save summary...`);
  
  // Try 'ai_summaries' first, then 'summaries' as fallback
  let errorToReport = null;
  
  try {
    const { data, error } = await supabase
      .from('ai_summaries')
      .insert([{
        user_id: userId,
        title: title || originalFileName,
        original_file_name: originalFileName,
        file_url: fileUrl,
        summary: summary
      }])
      .select();
    
    if (!error && data && data.length > 0) {
      console.log(`[Summarizer] Saved to 'ai_summaries' table.`);
      return data[0];
    }
    errorToReport = error;
  } catch (e) {
    console.warn("[Summarizer] 'ai_summaries' insert failed, trying 'summaries'...");
  }

  // Fallback to 'summaries' table
  const { data, error } = await supabase
    .from('summaries')
    .insert([{
      user_id: userId,
      file_name: title || originalFileName,
      file_url: fileUrl,
      summary: summary
    }])
    .select()
    .single();

  if (error) {
    console.error('[Summarizer] All save attempts failed:', error, errorToReport);
    throw new Error(`Database save failed: ${error.message}`);
  }

  console.log(`[Summarizer] Saved to 'summaries' table.`);
  return {
    ...data,
    title: data.file_name,
    original_file_name: data.file_name
  };
}

/**
 * Main entry point for the summarizer flow
 */
export async function uploadAndSummarize(formData: FormData) {
  const supabase = createActionSupabaseClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Unauthorized');

    // Ensure profile exists (safety check for FK constraint)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      await supabase.from('profiles').insert([{
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || 'Student User'
      }]);
    }

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // 1. Upload
    const { publicUrl, buffer, fileExt } = await uploadDocument(supabase, session.user.id, file);

    // 2. Extract Text
    let text = '';
    console.log(`[Summarizer] [${new Date().toISOString()}] Extracting text from ${fileExt}...`);
    try {
      if (fileExt === 'pdf') {
        const pdfData = await pdf(buffer);
        text = pdfData.text;
      } else if (fileExt === 'docx') {
        const docxData = await mammoth.extractRawText({ buffer });
        text = docxData.value;
      } else {
        text = buffer.toString('utf-8');
      }
    } catch (extractError: any) {
      console.error('[Summarizer] Text extraction failed:', extractError);
      text = "Extraction failed. Document saved for review.";
    }

    if (!text || text.trim().length < 5) {
      text = "Document content appears empty or unreadable.";
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

    console.log(`[Summarizer] [${new Date().toISOString()}] Syncing pages...`);
    revalidatePath('/dashboard/summarizer', 'page');
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/', 'layout');
    return { success: true, data: savedDoc };

  } catch (error: any) {
    console.error('[Summarizer] Entry point failed:', error);
    return { success: false, error: error.message };
  }
}

// ... rest of the functions ...

export async function getSummaries() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    console.log(`[Summarizer] [${new Date().toISOString()}] Fetching summaries...`);

    // Try 'ai_summaries' first
    let { data, error } = await supabase
      .from('ai_summaries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("[Summarizer] 'ai_summaries' fetch failed, trying 'summaries'...");
      const fallback = await supabase
        .from('summaries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw error;

    const mappedData = (data || []).map(item => ({
      ...item,
      title: item.title || item.file_name,
      original_file_name: item.original_file_name || item.file_name
    }));

    return { success: true, data: mappedData };
  } catch (error: any) {
    console.error('[Summarizer] getSummaries failed:', error);
    return { success: false, error: error.message };
  }
}
