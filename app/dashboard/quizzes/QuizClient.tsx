"use client";

type QuizClientProps = {
    initialQuizzes: any[];
};

export default function QuizClient({
    initialQuizzes,
}: QuizClientProps) {
    return (
        <div>
            <h1>AI Quizzes</h1>

            {initialQuizzes?.length === 0 ? (
                <p>No quizzes available.</p>
            ) : (
                <div>
                    {initialQuizzes.map((quiz, index) => (
                        <div key={index}>
                            <p>{quiz.title || "Untitled Quiz"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}