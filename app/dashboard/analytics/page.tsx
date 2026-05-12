import AnalyticsClient from '@/components/Dashboard/AnalyticsClient';
import { getProductivityAnalytics } from '@/lib/actions/analytics';
import { redirect } from 'next/navigation';

export default async function AnalyticsPage() {
  try {
    const res = await getProductivityAnalytics();
    if (!res.success) {
      return (
        <div className="flex h-screen items-center justify-center bg-surface-dim p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-border text-center">
            <h1 className="text-xl font-bold text-text-dark">Something went wrong</h1>
            <p className="text-text-muted mt-2">Failed to load analytics. Please try again later.</p>
          </div>
        </div>
      );
    }
    return <AnalyticsClient analyticsData={res.data} />;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      redirect('/auth/login');
    }
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-border text-center">
          <h1 className="text-xl font-bold text-text-dark">Something went wrong</h1>
          <p className="text-text-muted mt-2">An unexpected error occurred.</p>
        </div>
      </div>
    );
  }
}
