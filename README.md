# Socrative Service

This project is a “clone” of the Socrative backend, built using Express.js and TypeScript to showcase my ability and enthusiasm for learning new and relevant technologies. I opted for SQLite with raw SQL for data storage to keep the implementation straightforward. While I recognize that the code may not adhere to all best practices and isn’t production-ready, this was my first time working with Node.js, and it has been a valuable learning experience. I hope this project demonstrates my commitment to learning and how I would able to quickly ramp up on the Socrative team.

## Installation

1. **Clone the Repository**
   `git clone https://github.com/lymburn/socrative-service.git`

2. **Install dependencies**  
   `npm install`

3. **Add environment variables in .env**
    ```
    PORT=5000
    JWT_SECRET=your_secret_key
    ```

4. **Start the service**
    `npx ts-node src/index.ts`

## Endpoints

### Authentication

**`POST /auth/register`**  
   - **Purpose**: Register a new user with an email and password.  
   - **Input**:
     ```json
     {
       "email": "user@example.com",
       "password": "securepassword"
     }
     ```
   - **Response**:
     - **201 Created**:
       ```json
       {
         "user": {
           "id": 1,
           "email": "user@example.com",
           "rooms": [
             {
               "roomId": "ABCDE",
               "userId": 1
             }
           ]
         }
       }
       ```
     - **400 Bad Request**:
       ```json
       {
         "error": "Email already exists"
       }
       ```

**`POST /auth/login`**  
   - **Purpose**: Authenticate a user and return a JWT token for secure access.  
   - **Input**:
     ```json
     {
       "email": "user@example.com",
       "password": "securepassword"
     }
     ```
   - **Response**:
     - **200 OK**:
       ```json
       {
         "token": "jwt_token_here",
         "user": {
           "id": 1,
           "email": "user@example.com",
           "rooms": [
             {
               "roomId": "ABCDE",
               "userId": 1
             }
           ]
         }
       }
       ```
     - **401 Unauthorized**:
       ```json
       {
         "error": "Invalid credentials"
       }
       ```

### Quizzes

**`GET /quiz/:quizId`**  
   - **Purpose**: Retrieve details of a specific quiz by its ID.  
   - **Input**: URL parameter `quizId=<quizId>`  
   - **Response**:
     - **200 OK**:
       ```json
       {
         "quiz": {
           "id": 1,
           "name": "Sample Quiz",
           "dateCreated": "2025-01-01T12:00:00Z",
           "userId": 1,
           "questions": [
             {
               "id": 1,
               "question": "What is 2 + 2?",
               "answers": [
                 {
                   "id": 1,
                   "text": "3",
                   "isCorrect": false
                 },
                 {
                   "id": 2,
                   "text": "4",
                   "isCorrect": true
                 },
                 {
                   "id": 3,
                   "text": "5",
                   "isCorrect": true
                 },
                 {
                   "id": 4,
                   "text": "6",
                   "isCorrect": true
                 }
               ]
             }
           ]
         }
       }
       ```
     - **404 Not Found**:
       ```json
       {
         "error": "Quiz not found"
       }
       ```

**`DELETE /quiz/:quizId`**  
   - **Purpose**: Delete a specific quiz by its ID.  
   - **Input**: URL parameter `quizId=<quizId>`  
   - **Response**:
     - **204 No Content**
     - **404 Not Found**:
       ```json
       {
         "error": "Quiz not found"
       }
       ```

### Quiz Sessions

**`GET /quiz-session/:sessionId`**  
   - **Purpose**: Retrieve details of a specific quiz session by its ID.  
   - **Input**: URL parameter `sessionId=<sessionId>`  
   - **Response**:
     - **200 OK**:
       ```json
       {
         "session": {
           "id": 1,
           "quizId": 1,
           "roomId": "ABCDE",
           "isActive": true
         }
       }
       ```
     - **404 Not Found**:
       ```json
       {
         "error": "Session not found"
       }
       ```

**`GET /quiz-session/results/:sessionId`**  
   - **Purpose**: Fetch results of a quiz session, including student responses.  
   - **Input**: URL parameter `sessionId=<sessionId>`  
   - **Response**:
     - **200 OK**:
       ```json
       {
         "quizSessionResult": {
           "quiz": {
             "id": 1,
             "name": "Sample Quiz",
             "dateCreated": "2025-01-01T12:00:00Z",
             "userId": 1,
             "questions": [
               {
                 "id": 1,
                 "question": "What is 2 + 2?",
                 "answers": [
                   {
                     "id": 1,
                     "text": "3",
                     "isCorrect": false
                   },
                   {
                     "id": 2,
                     "text": "4",
                     "isCorrect": true
                   }
                 ]
               }
             ]
           },
           "studentResults": [
             {
               "student": {
                 "id": 1,
                 "name": "John Doe",
                 "roomId": "ABCDE"
               },
               "studentAnswers": [
                 {
                   "id": 1,
                   "studentId": 1,
                   "questionId": 1,
                   "answerId": 2
                 }
               ]
             }
           ]
         }
       }
       ```
     - **404 Not Found**:
       ```json
       {
         "error": "Session not found"
       }
       ```