import { useParams } from "react-router-dom";
import QuizEngine from "../../components/quiz/QuizEngine";
import SubjectBrowser from "./SubjectBrowser";

export default function Practice() {
  const { quizId } = useParams();

  if (!quizId) return <SubjectBrowser mode="practice" />;

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] text-white">
      <QuizEngine quizId={Number(quizId)} mode="practice" />
    </div>
  );
}