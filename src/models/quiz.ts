import { Database } from "sqlite";
import { Question } from "./question";

export interface Quiz {
    id: number;
    name: string;
    dateCreated: number;
    userId: number;
    questions: Question[];
}

export const createQuiz = async (
    db: Database,
    quiz: Quiz
): Promise<number> => {
    const { name, userId } = quiz;
    const result = await db.run(
        `
        INSERT INTO quizzes (name, user_id)
        VALUES (?, ?)
        `,
        [name, userId]
    );

    if (!result.lastID) {
        throw new Error("Failed to create quiz. No ID was returned.");
    }

    return result.lastID;
};

export const deleteQuiz = async (
    db: Database,
    quizId: number
): Promise<void> => {
    await db.run(
        `
        DELETE FROM quizzes
        WHERE id = ?
        `,
        [quizId]
    );
};

export const findQuizzesByUserId = async (
    db: Database,
    userId: number
): Promise<Quiz[]> => {
    const rows = await db.all(
        `
        SELECT
          qz.id AS quizId,
          qz.name AS quizName,
          qz.date_created AS quizDateCreated,
          qz.user_id AS quizUserId,
          
          qs.id AS questionId,
          qs.question AS questionText,
          
          ans.id AS answerId,
          ans.text AS answerText,
          ans.is_correct AS answerIsCorrect
    
        FROM quizzes qz
        LEFT JOIN questions qs ON qz.id = qs.quiz_id
        LEFT JOIN answers ans ON qs.id = ans.question_id
        WHERE qz.user_id = ?
        `,
        [userId]
    );

    const quizMap = new Map<number, Quiz>();

    rows.forEach((row) => {
        if (!quizMap.has(row.quizId)) {
            quizMap.set(row.quizId, {
                id: row.quizId,
                name: row.quizName,
                dateCreated: row.quizDateCreated,
                userId: row.quizUserId,
                questions: [],
            });
        }

        const currentQuiz = quizMap.get(row.quizId)!;

        if (!row.questionId) {
            return;
        }

        let question = currentQuiz.questions.find((q) => q.id === row.questionId);
        if (!question) {
            question = {
                id: row.questionId,
                question: row.questionText,
                answers: [],
            };

            currentQuiz.questions.push(question);
        }

        if (row.answerId) {
            question.answers.push({
                id: row.answerId,
                text: row.answerText,
                isCorrect: !!row.answerIsCorrect,
            });
        }
    });

    return Array.from(quizMap.values());
};

export const findQuizById = async (
    db: Database,
    quizId: number
): Promise<Quiz | undefined> => {
    const rows = await db.all(
        `
        SELECT
          qz.id AS quizId,
          qz.name AS quizName,
          qz.date_created AS quizDateCreated,
          qz.user_id AS quizUserId,
          
          qs.id AS questionId,
          qs.question AS questionText,
          
          ans.id AS answerId,
          ans.text AS answerText,
          ans.is_correct AS answerIsCorrect
      
        FROM quizzes qz
        LEFT JOIN questions qs ON qz.id = qs.quiz_id
        LEFT JOIN answers ans ON qs.id = ans.question_id
        WHERE qz.id = ?
        `,
        [quizId]
    );

    if (rows.length === 0) {
        return undefined;
    }

    const {
        quizId: qId,
        quizName,
        quizDateCreated,
        quizUserId
    } = rows[0];

    const questionMap = new Map<number, {
        id: number;
        question: string;
        answers: { id: number; text: string; isCorrect: boolean }[];
    }>();

    rows.forEach((row) => {
        if (!row.questionId) {
            return;
        }

        if (!questionMap.has(row.questionId)) {
            questionMap.set(row.questionId, {
                id: row.questionId,
                question: row.questionText,
                answers: [],
            });
        }

        if (row.answerId) {
            const questionObj = questionMap.get(row.questionId)!;
            questionObj.answers.push({
                id: row.answerId,
                text: row.answerText,
                isCorrect: !!row.answerIsCorrect,
            });
        }
    });

    const quiz: Quiz = {
        id: qId,
        name: quizName,
        dateCreated: quizDateCreated,
        userId: quizUserId,
        questions: Array.from(questionMap.values()),
    };

    return quiz;
};