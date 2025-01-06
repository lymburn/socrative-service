# Socrative Service

This project is a “clone” of the Socrative backend, built using Express.js and TypeScript to showcase my ability and enthusiasm for learning new and relevant technologies. I opted for SQLite with raw SQL for data storage to keep the implementation straightforward. There is a very basic level of authentication using JWT. While I recognize that the code may not adhere to all best practices and isn’t production-ready, this was my first time working with Node.js, and it has been a valuable learning experience. I hope this project demonstrates my commitment to learning and how I would able to quickly ramp up on the Socrative team.

Some potential improvements with more time could include:
- Switching to a robust database like PostgreSQL.
- Using an ORM instead of raw SQL.
- Adding unit tests and improving error handling.
- Implementing WebSockets for real-time live results.
- Adding environment-specific configurations for deployment.
- Enhancing security practices.

## Installation

1. **Clone the Repository**
   `git clone https://github.com/lymburn/socrative-service.git`

2. **Install dependencies**  
   `npm install`

3. **Add environment variables in .env**  
    ```
    PORT=3000
    JWT_SECRET=your_secret_key
    ```

4. **Start the service**  
    `npx ts-node src/index.ts`

## Endpoints

## Authentication Routes

**`POST /auth/register`**
   - **Purpose**: Register a new user.
   - **Description**: Creates a new user account and automatically generates a unique room for the user.

**`POST /auth/login/teacher`**
   - **Purpose**: Log in a teacher and receive a JWT token.
   - **Description**: Authenticates a teacher using their email and password, returning a JWT token for authorized access.

**`POST /auth/login/student`**
   - **Purpose**: Allow a student to join a room.
   - **Description**: Enables a student to join a specific room by providing their name and the room ID.


## Quizzes Routes

**`POST /quiz`**
   - **Purpose**: Create a new quiz.
   - **Description**: Allows a teacher to create a new quiz along with its associated questions and answers.

**`GET /quiz?userId=:userId`**
   - **Purpose**: Retrieve all quizzes for a specific user.
   - **Description**: Fetches all quizzes created by a particular user based on the provided user ID.

**`GET /quiz/:quizId`**
   - **Purpose**: Retrieve details of a specific quiz by its ID.
   - **Description**: Provides comprehensive details of a quiz, including its questions and answers, based on the quiz ID.

**`DELETE /quiz/:quizId`**
   - **Purpose**: Delete a specific quiz by its ID.
   - **Description**: Removes a quiz from the database using its unique identifier.


## Quiz Sessions Routes

**`POST /quiz-session`**
   - **Purpose**: Launch a new quiz session.
   - **Description**: Initiates a new session for a specified quiz within a particular room.

**`GET /quiz-session?roomId=:roomId`**
   - **Purpose**: Retrieve the active quiz session for a given room.
   - **Description**: Fetches the currently active quiz session associated with a specific room ID.

**`DELETE /quiz-session/:sessionId`**
   - **Purpose**: End a quiz session.
   - **Description**: Terminates an ongoing quiz session using its unique session ID.

**`GET /quiz-session/:sessionId/results/`**
   - **Purpose**: Fetch results of a quiz session.
   - **Description**: Retrieves the outcomes of a completed quiz session, including student responses and scores.


## Student Answers Routes

**`POST /student-answer`**
   - **Purpose**: Submit a student's answer to a specific question.
   - **Description**: Allows a student to submit their answer for a particular question within a quiz session.

**`GET /student-answer/:studentId`**
   - **Purpose**: Retrieve all answers submitted by a specific student.
   - **Description**: Fetches all the answers that a student has submitted across different quiz sessions.
