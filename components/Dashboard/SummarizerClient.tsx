'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadAndSummarize, getSummaries } from '@/lib/actions/summarizer';
import { useToast } from '@/hooks/useToast';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function SummarizerClient({ initialSummaries }: { initialSummaries: any[] }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use a ref to track if we've already synced the initial load
  const [summaries, setSummaries] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<any>(null);

  // 1. Initialize state from props
  useEffect(() => {
    if (initialSummaries && Array.isArray(initialSummaries)) {
      console.log('[SummarizerClient] Received initialSummaries:', initialSummaries.length);
      setSummaries(initialSummaries);
    }
  }, [initialSummaries]);

  const refreshSummaries = async () => {
    setIsRefreshing(true);
    try {
      const res = await getSummaries();
      if (res.success && Array.isArray(res.data)) {
        console.log('[SummarizerClient] Refetched summaries:', res.data.length);
        setSummaries(res.data);
      }
    } catch (error) {
      console.error('[SummarizerClient] Refetch error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    console.log(`[SummarizerClient] [${new Date().toISOString()}] Upload Triggered:`, file.name);

    try {
      const res = await uploadAndSummarize(formData);
      console.log(`[SummarizerClient] [${new Date().toISOString()}] Received Response:`, res);

      if (res.success && res.data) {
        const docToInsert = Array.isArray(res.data) ? res.data[0] : res.data;

        if (docToInsert && docToInsert.id) {
          console.log(`[SummarizerClient] [${new Date().toISOString()}] Success! Document ID:`, docToInsert.id);
          setSummaries(prev => {
            const exists = prev.some(s => s.id === docToInsert.id);
            if (exists) return prev;
            return [docToInsert, ...prev];
          });
          showToast("Intelligence extraction complete!", "success");
          router.refresh();
        } else {
          console.warn(`[SummarizerClient] [${new Date().toISOString()}] Success response but missing/invalid data object. Refetching...`);
          await refreshSummaries();
        }
      } else {
        showToast(res.error || "Failed to summarize document.", "error");
      }
    } catch (error: any) {
      console.error("[SummarizerClient] Critical upload error:", error);
      showToast("Neural sync failed.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
      <DashboardSidebar user={user} onSignOut={handleSignOut} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        <DashboardHeader
          title="AI Summarizer"
          badge={`${summaries?.length || 0} Docs`}
        />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-12 pb-32">

            {/* Upload Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-purple/10 text-accent-purple rounded-full text-[11px] font-black uppercase tracking-widest border border-accent-purple/20">
                  <span className="material-symbols-outlined text-[16px] font-bold">description</span>
                  Document Intel
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-text-dark tracking-tighter leading-none">
                  Instant Curriculum Synthesis
                </h2>
                <p className="text-lg font-medium text-text-muted opacity-80 max-w-xl leading-relaxed">
                  Upload your lectures, research papers, or notes to generate structured AI summaries in seconds.
                </p>
              </div>

              <div className="relative shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  disabled={isUploading}
                />
                <button
                  className={`btn-primary !h-16 !px-12 !text-lg shadow-glow-primary group flex items-center gap-3 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined font-black">upload_file</span>
                  )}
                  {isUploading ? 'Synthesizing...' : 'Upload Document'}
                </button>
              </div>
            </section>

            {/* Debug Info (Only visible if you want to verify count) */}
            {process.env.NODE_ENV === 'development' && summaries.length > 0 && (
              <div className="text-[10px] text-text-muted opacity-30">
                Debug: {summaries.length} items in state
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {summaries.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-border/40 rounded-[2.5rem] p-8 lg:p-10 flex flex-col group hover:shadow-lg transition-all relative overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-surface-dim rounded-2xl flex items-center justify-center text-accent-purple">
                          <span className="material-symbols-outlined text-[24px] font-bold">article</span>
                        </div>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-text-dark tracking-tighter mb-4 leading-snug line-clamp-2">{s.title || s.original_file_name}</h3>
                      <p className="text-[14px] font-medium text-text-muted line-clamp-3 mb-8 leading-relaxed">
                        {s.summary}
                      </p>
                      <button
                        onClick={() => setSelectedSummary(s)}
                        className="mt-auto h-12 rounded-2xl border border-border/40 font-black text-[10px] uppercase tracking-widest hover:bg-surface-dim transition-all flex items-center justify-center gap-2"
                      >
                        Review Summary
                        <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {summaries.length === 0 && !isUploading && (
              <div className="text-center py-24 bg-surface-dim/30 rounded-[3rem] border border-dashed border-border/40 flex flex-col items-center gap-4">
                <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] opacity-30">No Documents Synthesized Yet</p>
                <button
                  onClick={refreshSummaries}
                  className="text-[10px] font-bold text-accent-purple uppercase tracking-widest hover:underline"
                >
                  Manual Neural Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedSummary && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSummary(null)} className="absolute inset-0 bg-text-dark/40 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-3xl max-h-[85vh] rounded-[3.5rem] shadow-soft-2xl border border-white/60 overflow-hidden flex flex-col">
                <div className="p-10 lg:p-14 overflow-y-auto hide-scrollbar space-y-10">
                  <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-4 -mt-4 z-10 border-b border-border/10">
                    <h3 className="text-2xl font-black text-text-dark tracking-tighter truncate max-w-[80%]">{selectedSummary.title || selectedSummary.original_file_name}</h3>
                    <button onClick={() => setSelectedSummary(null)} className="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center text-text-muted hover:text-text-dark transition-all">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                  <div className="prose prose-studiplify max-w-none">
                    <div className="text-[16px] font-medium text-text-dark/80 leading-relaxed whitespace-pre-wrap">
                      {selectedSummary.summary}
                    </div>
                  </div>
                  <div className="pt-8 flex justify-between items-center border-t border-border/10">
                    <a href={selectedSummary.file_url} target="_blank" className="text-[11px] font-black text-accent-purple uppercase tracking-widest hover:underline flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Download Original
                    </a>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30">
                      Synthesized {selectedSummary.created_at ? new Date(selectedSummary.created_at).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <MobileNav />
      </main>
    </div>
  );
}
