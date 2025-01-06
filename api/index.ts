import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes";
import quizRoutes from "../src/routes/quizRoutes";
import quizSessionRoutes from "../src/routes/quizSessionRoutes";
import { initializeDb } from "../src/database";
import { authMiddleware } from "../src/middlewares/authMiddleware";
import studentAnswerRoutes from "../src/routes/studentAnswerRoutes";

dotenv.config();

const app = express();
var cors = require('cors');

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/quiz", authMiddleware, quizRoutes);
app.use("/quiz-session", authMiddleware, quizSessionRoutes);
app.use("/student-answer", studentAnswerRoutes);

// Initialize Database and start server
const PORT = process.env.PORT || 3000;

initializeDb()
    .then(() => {
        console.log("Database initialized successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize the database:", error);
        process.exit(1);
    });