import { redirect } from "next/navigation";
import StudyPlansClient from "@/components/Dashboard/StudyPlansClient";
import { getStudyPlans } from "@/lib/actions/studyPlans";

export default async function StudyPlanPage() {
  try {
    const plansRes = await getStudyPlans();

    const plans = plansRes?.success
      ? (plansRes?.data || [])
      : [];

    return <StudyPlansClient initialPlans={plans} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/auth/login");
    }

    return <StudyPlansClient initialPlans={[]} />;
  }
}