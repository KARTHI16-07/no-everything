# NO EVERYTHING — Complete REST API Documentation

Base URL: `http://localhost:8080/api` (Local) or `https://<deployed-domain>/api` (Production)

Authentication: Bearer Token via Header: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new user identity and initializes profile defaults.
- **Request Body**:
  ```json
  {
    "username": "builder",
    "email": "builder@domain.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "token": "eyJhbGciOi...",
      "id": 2,
      "username": "builder",
      "email": "builder@domain.com",
      "role": "ROLE_USER"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates user and returns signed JWT.
- **Request Body**:
  ```json
  {
    "username": "architect",
    "password": "Pass123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOi...",
      "username": "architect"
    }
  }
  ```

### `GET /api/auth/me` *(Protected)*
Returns the currently authenticated user session.

---

## 2. Dashboard (`/api/dashboard`)

### `GET /api/dashboard/summary` *(Protected)*
Returns real-time consolidated dashboard KPIs, daily quote, streaks, active habits, and upcoming tasks.

---

## 3. Daily Quotes (`/api/quotes`)

### `GET /api/quotes/daily` *(Public)*
Returns the current day's rotating wisdom and author reflection.

### `GET /api/quotes/random` *(Public)*
Returns a randomly selected quote from the curated archive.

### `GET /api/quotes/search?query=...&category=...` *(Public)*
Searches quotes by text or category filter (`VISION`, `DISCIPLINE`, `MASTERY`, `FOCUS`, `RESILIENCE`, `CODING`).

### `POST /api/quotes/{id}/favorite` *(Protected)*
Bookmarks or unbookmarks a quote for the authenticated user.

### `GET /api/quotes/favorites` *(Protected)*
Returns all saved quotes for the authenticated user.

---

## 4. Habit Engine (`/api/habits`)

### `GET /api/habits` *(Protected)*
Returns all active habits for the user, accompanied by consecutive streaks and the last 7 days log matrix.

### `POST /api/habits` *(Protected)*
Creates a new habit protocol.
- **Request Body**:
  ```json
  {
    "title": "50-Min Deep Code Block",
    "description": "Zero distraction coding sprint",
    "category": "CODING",
    "targetDaysPerWeek": 7
  }
  ```

### `POST /api/habits/{id}/toggle?date=YYYY-MM-DD` *(Protected)*
Toggles daily completion for the given date (defaults to today) and recalculates the genuine consecutive streak.

### `DELETE /api/habits/{id}` *(Protected)*
Archives the habit.

---

## 5. Task & Goal Management (`/api/tasks` & `/api/goals`)

### `GET /api/tasks?completed=bool&priority=...&category=...` *(Protected)*
Returns filtered actionable tasks.

### `POST /api/tasks` *(Protected)*
Creates a new actionable task with priority (`HIGH`, `MEDIUM`, `LOW`) and due date.

### `POST /api/tasks/{id}/toggle` *(Protected)*
Marks a task completed or resumes it.

### `GET /api/goals?type=LONG_TERM` *(Protected)*
Returns goals with milestone progress bars.

### `POST /api/goals/{goalId}/milestones/{milestoneId}/toggle` *(Protected)*
Toggles milestone completion and recalculates overall goal percentage.

---

## 6. Focus Laboratory (`/api/focus`)

### `POST /api/focus/session` *(Protected)*
Persists a completed deep work block.
- **Request Body**:
  ```json
  {
    "durationMinutes": 25,
    "sessionType": "POMODORO",
    "tag": "CODE",
    "notes": "Finished Spring Boot controller integration"
  }
  ```

### `GET /api/focus/stats` *(Protected)*
Returns today's focus minutes, weekly minutes, total sessions, daily goal progress, and day-by-day distribution.

---

## 7. Private Journal (`/api/journal`)

### `GET /api/journal/entries?query=...&mood=...&favorite=bool` *(Protected)*
Returns user's private reflections with strict user-level authorization.

### `POST /api/journal/entries` *(Protected)*
Records a private journal entry with mood (`ENERGIZED`, `FOCUSED`, `NEUTRAL`, `REFLECTIVE`, `FATIGUED`) and tags.

### `PUT /api/journal/entries/{id}` *(Protected)*
Updates an existing reflection.

---

## 8. NQT Learning Center (`/api/nqt`)

### `GET /api/nqt/practice?topic=JAVA&difficulty=INTERMEDIATE` *(Protected)*
Returns practice MCQs and coding snippets with explanations.

### `GET /api/nqt/mock-test?topic=JAVA&count=10` *(Protected)*
Generates a 10-question timed mock test (answers obscured for testing).

### `POST /api/nqt/submit-test` *(Protected)*
Submits mock test responses, scores accuracy, records passed status, and returns detailed question-by-question reviews.

### `GET /api/nqt/history` *(Protected)*
Returns user's past examination attempts.

---

## 9. Gemini AI Assistant (`/api/ai`)

### `POST /api/ai/chat` *(Protected)*
Sends prompt to the backend AI engine operating in one of 6 modes:
1. `LEARN`
2. `PRACTICE`
3. `DOUBT`
4. `INTERVIEW`
5. `EXAM`
6. `REVISION`

- **Request Body**:
  ```json
  {
    "conversationId": null,
    "message": "Explain how hash collisions are handled in Java 8+ HashMap",
    "mode": "LEARN"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "conversationId": 1,
      "mode": "LEARN",
      "reply": "In Java 8+, HashMap uses...",
      "fallbackMode": false,
      "history": [...]
    }
  }
  ```

### `GET /api/ai/conversations` *(Protected)*
Returns all conversation sessions for the user.

---

## 10. Personal Analytics (`/api/analytics`)

### `GET /api/analytics` *(Protected)*
Returns genuine computed productivity trends, habit consistency ratings, focus tag distributions, and growth indices.
