import { useParams } from "react-router-dom";
import QuizEngine from "../../components/quiz/QuizEngine";
import SubjectBrowser from "./SubjectBrowser";

export default function MockExam() {
  const { quizId } = useParams();

  if (!quizId) return <SubjectBrowser mode="exam" />;

  return <QuizEngine quizId={Number(quizId)} mode="exam" durationMinutes={30} />;
}
