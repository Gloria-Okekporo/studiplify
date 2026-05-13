import { redirect } from "next/navigation";
import SummarizerClient from "./SummarizerClient";
import { getSummaries } from "@/lib/actions/summaries";

export default async function SummarizerPage() {
  try {
    const summariesRes = await getSummaries();

    const summaries = summariesRes?.success
      ? (summariesRes?.data || [])
      : [];

    return <SummarizerClient initialSummaries={summaries} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/auth/login");
    }

    return <SummarizerClient initialSummaries={[]} />;
  }
}