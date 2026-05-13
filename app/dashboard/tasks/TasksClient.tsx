"use client";

type TasksClientProps = {
    initialTasks: any[];
};

export default function TasksClient({
    initialTasks,
}: TasksClientProps) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tasks</h1>

            {initialTasks?.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                <div className="space-y-3">
                    {initialTasks.map((task, index) => (
                        <div
                            key={index}
                            className="border p-4 rounded-lg"
                        >
                            <p>{task?.title || "Untitled Task"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}