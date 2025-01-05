import { Database } from "sqlite";

export interface Student {
    id: number;
    name: string;
    roomId: string;
}

// Insert a student into a room
export const createStudent = async (
    db: Database,
    name: string,
    roomId: string
): Promise<number> => {
    const result = await db.run(
        `
        INSERT INTO students (name, room_id)
        VALUES (?, ?)
        `,
        [name, roomId]
    );
    
    if (!result.lastID) {
        throw new Error("Failed to create student.");
    }

    return result.lastID;
};

export const findStudentById = async (
    db: Database,
    studentId: number
): Promise<Student | undefined> => {
    return await db.get<Student>(
        `
        SELECT 
            id,
            name,
            room_id AS roomId
        FROM students
        WHERE id = ?
        `,
        [studentId]
    );
};

export const findStudentsByRoom = async (
    db: Database,
    roomId: string
): Promise<Student[]> => {
    return await db.all<Student[]>(
        `
        SELECT 
            id,
            name,
            room_id AS roomId
        FROM students
        WHERE room_id = ?
        `,
        [roomId]
    );
};