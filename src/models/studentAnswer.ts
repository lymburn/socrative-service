import { Database } from "sqlite";

export interface StudentAnswer {
    id?: number;
    studentId: number;
    questionId: number;
    answerId: number;
}

export const createStudentAnswer = async (
    db: Database,
    studentId: number,
    questionId: number,
    answerId: number
): Promise<number> => {
    const result = await db.run(
        `
        INSERT INTO student_answers (student_id, question_id, answer_id)
        VALUES (?, ?, ?);
        `,
        [studentId, questionId, answerId]
    );

    if (!result.lastID) {
        throw new Error("Failed to submit student response.");
    }

    return result.lastID;
};

export const findStudentAnswersByStudentId = async (
    db: Database,
    studentId: number
): Promise<StudentAnswer[]> => {
    return await db.all<StudentAnswer[]>(
        `
        SELECT 
            id,
            student_id AS studentId,
            question_id AS questionId,
            answer_id AS answerId
        FROM student_answers 
        WHERE student_id = ?;
        `,
        [studentId]
    );
};