"use client";

type StudyPlansClientProps = {
  initialPlans: any[];
};

export default function StudyPlansClient({
  initialPlans,
}: StudyPlansClientProps) {
  return (
    <div>
      <h1>Study Plans</h1>

      {initialPlans?.length === 0 ? (
        <p>No study plans available.</p>
      ) : (
        <div>
          {initialPlans.map((plan, index) => (
            <div key={index}>
              <p>{plan.title || "Untitled Plan"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}