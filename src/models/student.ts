import { Database } from "sqlite";

/**
 * Represents a student in a room.
 */
export interface Student {
    id: number;
    name: string;
    roomId: string;
    sessionId: number;
}

/**
 * Inserts a student into the 'students' table and returns the new ID.
 */
export const createStudent = async (
    db: Database,
    name: string,
    roomId: string,
    sessionId: number
): Promise<number> => {
    const result = await db.run(
        `
    INSERT INTO students (name, room_id, session_id)
    VALUES (?, ?, ?)
    `,
        [name, roomId, sessionId]
    );

    if (!result.lastID) {
        throw new Error("Failed to create student.");
    }

    return result.lastID;
};

/**
 * Finds a single student by their ID.
 */
export const findStudentById = async (
    db: Database,
    studentId: number
): Promise<Student | undefined> => {
    return db.get<Student>(
        `
    SELECT 
      id,
      name,
      room_id AS roomId,
      session_id AS sessionId
    FROM students
    WHERE id = ?
    `,
        [studentId]
    );
};

/**
 * Retrieves all students associated with a particular roomId.
 */
export const findStudentsByRoom = async (
    db: Database,
    roomId: string
): Promise<Student[]> => {
    return db.all<Student[]>(
        `
    SELECT 
      id,
      name,
      room_id AS roomId,
      session_id AS sessionId
    FROM students
    WHERE room_id = ?
    `,
        [roomId]
    );
};