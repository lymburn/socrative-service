import { Database } from "sqlite";
import { findQuizById } from "./quiz";
import { findStudentAnswersByStudentId, StudentAnswer } from "./studentAnswer";
import { Quiz } from "./quiz";
import { findStudentsByRoom, Student } from "./student";
import { findQuizSessionById } from "./quizSession";

export interface QuizSessionResult {
    quiz: Quiz,
    studentResults: {
        student: Student;
        studentAnswers: StudentAnswer[];
    }[];
}

export const buildQuizSessionResult = async (
    db: Database,
    sessionId: number
): Promise<QuizSessionResult | undefined> => {
    const session = await findQuizSessionById(db, sessionId);

    if (!session) {
        throw new Error(`Session with ID ${sessionId} not found.`);
    }

    const quiz = await findQuizById(db, session.quizId);

    if (!quiz) {
        throw new Error(`Quiz with ID ${session.quizId} not found.`);
    }

    const students = await findStudentsByRoom(db, session.roomId);

    // Build student results
    const studentResults = await Promise.all(
        students.map(async (student) => {
            const studentAnswers = await findStudentAnswersByStudentId(db, student.id);
            return {
                student,
                studentAnswers,
            };
        })
    );
    
    return {
        quiz,
        studentResults
    }
}