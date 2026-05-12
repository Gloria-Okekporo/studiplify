import FocusClient from '@/components/Dashboard/FocusClient';
import { getFocusStats } from '@/lib/actions/focus';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Focus Hub - Studiplify',
};

export default async function FocusPage() {
  try {
    const statsRes = await getFocusStats();
    const stats = statsRes?.success ? statsRes.data : null;
    return <FocusClient initialStats={stats} />;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      redirect('/auth/login');
    }
    // Fallback or error state
    return <div>Something went wrong. Please try again.</div>;
  }
}
