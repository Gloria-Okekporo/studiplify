import SummarizerClient from '@/components/Dashboard/SummarizerClient';
import { getSummaries } from '@/lib/actions/summarizer';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'AI Summarizer - Studiplify',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SummarizerPage() {
  try {
    const summariesRes = await getSummaries();
    const summaries = summariesRes.success ? summariesRes.data : [];
    return <SummarizerClient initialSummaries={summaries} />;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      redirect('/auth/login');
    }
    return <div>Something went wrong. Please try again.</div>;
  }
}
