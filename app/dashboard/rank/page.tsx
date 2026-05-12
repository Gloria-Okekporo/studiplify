import ProgressionClient from '@/components/Dashboard/ProgressionClient';
import { getProgressionData } from '@/lib/actions/progression';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Your Progress & Rank - Studiplify',
};

export default async function ProgressionPage() {
  try {
    const res = await getProgressionData();
    if (!res.success) {
      throw new Error(res.error);
    }

    return <ProgressionClient initialData={res.data as any} />;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      redirect('/auth/login');
    }
    // Fallback or error state
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Could not load progression data. Please try again later.</p>
      </div>
    );
  }
}
