'use server';

import { createActionSupabaseClient, createServerSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';
import mammoth from 'mammoth';

/**
 * Modular function to handle file upload to Supabase Storage
 */
async function uploadDocument(supabase: any, userId: string, file: File) {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);


  // Ensure bucket exists - we'll try to create it, if it fails it likely already exists
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b: any) => b.name === 'summaries');
    if (!bucketExists) {
      await supabase.storage.createBucket('summaries', { public: true });
    }
  } catch (e) {
    console.warn('[Summarizer] Bucket check/creation error (continuing):', e);
  }

  console.log(`[Summarizer] [${new Date().toISOString()}] Uploading ${file.name} to storage...`);

  const { data, error } = await supabase.storage
    .from('summaries')
    .upload(fileName, arrayBuffer, { contentType: file.type || 'application/octet-stream', upsert: true });

  if (error) {
    console.error('[Summarizer] Storage upload failed. Check RLS policies for bucket "summaries".', error);
    throw new Error(`Upload failed: ${error.message}. Ensure "summaries" bucket is public or has correct RLS.`);
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

    const data = await response.json();
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
  console.log(`[Summarizer] [${new Date().toISOString()}] Saving results to 'summaries' table...`);

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
    console.error('[Summarizer] Database save failed:', error);
    throw new Error(`Neural sync failed: ${error.message}`);
  }

  console.log(`[Summarizer] Successfully saved document ${data.id}`);
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
    console.log("[Summarizer] Starting uploadAndSummarize process...");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('You must be logged in to summarize documents.');

    // 1. Ensure profile exists (safety check for FK constraint)
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        console.log("[Summarizer] Profile not found, creating one...");
        await supabase.from('profiles').insert([{
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || 'Student User'
        }]);
      }
    } catch (profileCatch) {
      console.warn("[Summarizer] Profile check failed, proceeding anyway:", profileCatch);
    }

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file was received. Please try selecting the file again.');

    // 2. Upload to Storage
    console.log(`[Summarizer] Uploading file: ${file.name}`);
    let uploadResult;
    try {
      uploadResult = await uploadDocument(supabase, session.user.id, file);
    } catch (uploadError: any) {
      console.error("[Summarizer] Storage Error:", uploadError);
      throw new Error(`Storage Error: ${uploadError.message}`);
    }

    const { publicUrl, buffer, fileExt } = uploadResult;

    // 3. Extract Text
    let text = '';
    console.log(`[Summarizer] Extracting text from ${fileExt}...`);
    try {
      if (fileExt === 'pdf') {
        // Dynamic require to avoid build-time issues with Node.js built-ins
        const pdf = require('pdf-parse');
        const pdfData = await pdf(buffer);
        text = pdfData.text;
      } else if (fileExt === 'docx') {
        const docxData = await mammoth.extractRawText({ buffer });
        text = docxData.value;
      } else {
        text = buffer.toString('utf-8');
      }
    } catch (extractError: any) {
      console.error('[Summarizer] Extraction Warning:', extractError);
      text = "Extraction limit reached or format unsupported. AI will attempt to summarize visible metadata.";
    }

    if (!text || text.trim().length < 5) {
      text = `Filename: ${file.name}. Content could not be parsed but file is saved.`;
    }

    // 4. Summarize via Gemini
    console.log("[Summarizer] Calling Gemini AI...");
    let summary = "Summary pending...";
    try {
      summary = await generateSummary(text);
    } catch (aiError) {
      console.error("[Summarizer] AI Error:", aiError);
      summary = "AI was unable to process this document at this time.";
    }

    // 5. Save to Database
    console.log("[Summarizer] Saving to Database...");
    let savedDoc;
    try {
      savedDoc = await saveSummary(
        supabase,
        session.user.id,
        file.name,
        file.name,
        publicUrl,
        summary
      );
    } catch (dbError: any) {
      console.error("[Summarizer] DB Error:", dbError);
      throw new Error(`Database Error: ${dbError.message}`);
    }

    console.log("[Summarizer] Process complete. Revalidating paths...");
    revalidatePath('/dashboard/summarizer');
    revalidatePath('/dashboard');

    return { success: true, data: savedDoc };

  } catch (error: any) {
    console.error('[Summarizer] Fatal Error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during synthesis.' };
  }
}

// ... rest of the functions ...

export async function getSummaries() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    console.log(`[Summarizer] [${new Date().toISOString()}] Fetching summaries from 'summaries' table...`);

    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

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
