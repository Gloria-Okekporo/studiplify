import AssistantClient from '@/components/Dashboard/AssistantClient';
import { getChatHistory } from '@/lib/actions/chat';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'AI Assistant - Studiplify',
};

export default async function AssistantPage() {
  try {
    const historyRes = await getChatHistory();
    const history = historyRes.success ? historyRes.data : [];
    return <AssistantClient initialHistory={history} />;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      redirect('/auth/login');
    }
    return <AssistantClient initialHistory={[]} />;
  }
}
