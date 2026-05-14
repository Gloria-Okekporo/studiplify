import { redirect } from "next/navigation";
import TasksClient from "@/components/Dashboard/TasksClient";
import { getTasks } from "@/lib/actions/tasks";

export default async function TasksPage() {
  try {
    const tasksRes = await getTasks();

    const tasks = tasksRes?.success
      ? (tasksRes?.data || [])
      : [];

    return <TasksClient initialTasks={tasks} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/auth/login");
    }

    return <TasksClient initialTasks={[]} />;
  }
}