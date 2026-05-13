"use client";

type SummarizerClientProps = {
  initialSummaries: any[];
};

export default function SummarizerClient({
  initialSummaries,
}: SummarizerClientProps) {
  return (
    <div>
      <h1>Summaries</h1>

      {initialSummaries?.length === 0 ? (
        <p>No summaries available.</p>
      ) : (
        <div>
          {initialSummaries.map((summary, index) => (
            <div key={index}>
              <p>{summary.title || "Untitled Summary"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}