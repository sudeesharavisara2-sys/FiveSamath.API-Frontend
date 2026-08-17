import { useParams } from "react-router-dom";
import QuizEngine from "../../components/quiz/QuizEngine";
import SubjectBrowser from "./SubjectBrowser";

export default function Practice() {
  const { quizId } = useParams();

  if (!quizId) return <SubjectBrowser mode="practice" />;

  return <QuizEngine quizId={Number(quizId)} mode="practice" />;
}
