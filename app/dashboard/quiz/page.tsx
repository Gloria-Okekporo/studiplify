import { redirect } from 'next/navigation';
import QuizClient from './QuizClient';
import { getUserQuizzes } from "@/lib/actions/quizzes";

export const metadata = {
  title: 'AI Quizzes - Studiplify',
};

export default async function QuizPage() {
  try {
    const quizRes = await getUserQuizzes();

    const quizzes = quizRes?.success
      ? (quizRes?.data || [])
      : [];

    return <QuizClient initialQuizzes={quizzes} />;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      redirect('/auth/login');
    }

    return <QuizClient initialQuizzes={[]} />;
  }
}