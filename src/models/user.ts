import { Database } from "sqlite";

export interface User {
    id?: number;
    email: string;
    password: string;
}

export const findUserByEmail = async (db: Database, email: string): Promise<User | undefined> => {
    return await db.get<User>("SELECT * FROM users WHERE email = ?", [email]);
};

export const createUser = async (db: Database, user: User): Promise<void> => {
    await db.run("INSERT INTO users (email, password) VALUES (?, ?)", [user.email, user.password]);
};