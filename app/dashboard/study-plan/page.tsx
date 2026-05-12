import StudyPlansClient from '@/components/Dashboard/StudyPlansClient';
import { getStudyPlans } from '@/lib/actions/studyPlans';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Study Plans - Studiplify',
};

export default async function StudyPlansPage() {
  try {
    const plansRes = await getStudyPlans();
    const plans = plansRes.success ? plansRes.data : [];
    return <StudyPlansClient initialPlans={plans} />;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      redirect('/auth/login');
    }
    return <div>Something went wrong. Please try again.</div>;
  }
}
