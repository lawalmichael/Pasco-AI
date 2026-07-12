# PascoPrep AI — Frontend

React 18 mobile-first web app for the PascoPrep AI WAEC exam prep platform.

---

## Tech Stack
- React 18 + React Router v6
- Axios (API calls)
- react-markdown (AI tutor responses)
- Google Fonts: Sora + Inter
- No UI library — all custom CSS with CSS variables

---

## Project Structure

```
src/
  index.js              ← React entry point
  App.jsx               ← Router + protected routes
  AuthContext.js        ← Global auth state (token + user)
  api.js                ← ALL backend calls (single source of truth)

  styles/
    global.css          ← CSS variables, shared utility classes

  components/
    BottomNav.jsx/.css  ← 5-tab bottom navigation
    SubjectRing.jsx     ← SVG circular progress ring

  screens/
    LoginScreen.jsx/.css
    SignupScreen.jsx
    AuthScreens.css     ← Shared auth styles
    HomeScreen.jsx/.css
    PracticeScreen.jsx/.css
    BankScreen.jsx/.css
    TutorScreen.jsx/.css
    ProgressScreen.jsx/.css
    MoreScreen.jsx/.css
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Backend FastAPI server running on `localhost:8000`

### Install & run
```bash
npm install
npm start
```
App opens at `http://localhost:3000`. API calls are proxied to `localhost:8000` via the `"proxy"` field in `package.json`.

### Build for production
```bash
npm run build
```
Output is in `/build`. Deploy to Vercel, Netlify, or any static host.

---

## Backend API Contract

All calls are in `src/api.js`. The frontend expects these endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | No | `{ name, email, password, country, subjects_selected }` → `{ user, access_token }` |
| POST | `/auth/login` | No | `{ email, password }` → `{ user, access_token }` |
| GET | `/questions/for-user/{userId}?subject=&topic=` | Yes | Returns array of question objects |
| POST | `/answers/submit` | Yes | `{ question_id, selected_answer, session_id? }` → `{ is_correct, correct_answer }` |
| POST | `/sessions/start` | Yes | `{ subject, topic_filter? }` → `{ id, ... }` |
| POST | `/sessions/{id}/finish` | Yes | `{ time_taken? }` |
| POST | `/ai/ask` | Yes | `{ question, conversation_history }` → `{ answer }` |
| GET | `/progress/me` | Yes | `{ today, last_7_days, current_streak, subjects }` |
| GET | `/progress/me/monthly` | Yes | `{ days, total_score, total_questions }` |

**Auth:** Bearer token in `Authorization` header. Token is stored in `localStorage` as `pp_token`.

### Expected `user` object shape
```json
{
  "id": "uuid",
  "name": "Kenneth Olisa",
  "email": "k@example.com",
  "country": "Nigeria",
  "subjects_selected": ["Mathematics", "Biology"]
}
```

### Expected question object shape
```json
{
  "id": "uuid",
  "question_text": "...",
  "option_a": "...",
  "option_b": "...",
  "option_c": "...",
  "option_d": "...",
  "correct_answer": "A",
  "difficulty": "Easy | Medium | Hard",
  "topic": "Algebra",
  "explanation": "optional string"
}
```

### Expected progress shape
```json
{
  "current_streak": 3,
  "today": { "date": "2026-07-12", "score": 8, "total_questions": 10 },
  "last_7_days": [
    { "date": "2026-07-06", "score": 5, "total_questions": 7 },
    ...
  ],
  "subjects": [
    { "name": "Mathematics", "pct": 72, "total_questions": 45 },
    ...
  ]
}
```

---

## Switching to Production Backend

Update the base URL in `src/api.js`:
```js
export const API_BASE = 'https://your-backend.railway.app';
```
And remove `"proxy"` from `package.json`.

---

## Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0D0F1A` | App background |
| `--bg-card` | `#161829` | Cards |
| `--amber` | `#F5B731` | Primary CTA, active state |
| `--green` | `#3DD68C` | Correct answers, streaks |
| `--red` | `#F06565` | Wrong answers, errors |
| `--blue` | `#4B9EF5` | Streak stat |

All tokens are in `src/styles/global.css` under `:root`.
