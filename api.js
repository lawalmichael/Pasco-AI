// =============================================
// PascoPrep AI — API Layer
// All requests to FastAPI backend go through here.
// Base URL is proxied to http://localhost:8000 via package.json "proxy".
// When Railway deploys, update API_BASE to the live URL.
// =============================================

import axios from 'axios';

export const API_BASE = '';  // empty = use CRA proxy (localhost:8000)

// ---- Axios instance ----
const api = axios.create({ baseURL: API_BASE });

// Inject auth token on every request when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pp_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear token and reload to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pp_token');
      localStorage.removeItem('pp_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ---- Helper to extract error message ----
export function getErrorMessage(err) {
  const detail = err.response?.data?.detail;
  if (!detail) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ');
  return 'Something went wrong.';
}

// =============================================
// AUTH
// =============================================

export async function signup({ name, email, password, country, subjects_selected }) {
  const res = await api.post('/auth/signup', { name, email, password, country, subjects_selected });
  return res.data; // { user, access_token, token_type }
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // { user, access_token, token_type }
}

export async function getProfile(userId) {
  const res = await api.get(`/auth/${userId}`);
  return res.data;
}

// =============================================
// QUESTIONS
// =============================================

export async function getQuestionsForUser(userId, subject = null, topic = null) {
  let url = `/questions/for-user/${userId}`;
  const params = {};
  if (subject) params.subject = subject;
  if (topic) params.topic = topic;
  const res = await api.get(url, { params });
  // Backend may return array directly or { questions: [...] }
  return Array.isArray(res.data) ? res.data : res.data.questions ?? res.data;
}

export async function getQuestion(questionId) {
  const res = await api.get(`/questions/${questionId}`);
  return res.data;
}

// =============================================
// ANSWERS  (requires token)
// =============================================

export async function submitAnswer({ question_id, selected_answer, session_id }) {
  const body = { question_id, selected_answer };
  if (session_id) body.session_id = session_id;
  const res = await api.post('/answers/submit', body);
  return res.data; // { question_id, selected_answer, correct_answer, is_correct }
}

// =============================================
// SESSIONS  (requires token)
// =============================================

export async function startSession({ subject, topic_filter }) {
  const body = { subject };
  if (topic_filter) body.topic_filter = topic_filter;
  const res = await api.post('/sessions/start', body);
  return res.data; // { id, user_id, subject, score, total_questions, completed }
}

export async function getSession(sessionId) {
  const res = await api.get(`/sessions/${sessionId}`);
  return res.data;
}

export async function finishSession(sessionId, timeTaken = null) {
  const body = timeTaken ? { time_taken: timeTaken } : {};
  const res = await api.post(`/sessions/${sessionId}/finish`, body);
  return res.data;
}

// =============================================
// AI TUTOR
// =============================================

export async function askTutor({ question, conversation_history = [] }) {
  const res = await api.post('/ai/ask', { question, conversation_history });
  return res.data; // { answer } or similar
}

// =============================================
// PROGRESS  (requires token)
// =============================================

export async function getProgress() {
  const res = await api.get('/progress/me');
  return res.data;
  // { today: { date, score, total_questions }, last_7_days: [...], current_streak: N }
}

export async function getProgressMonthly(year = null, month = null) {
  const params = {};
  if (year) params.year = year;
  if (month) params.month = month;
  const res = await api.get('/progress/me/monthly', { params });
  return res.data;
  // { days: [...], total_score, total_questions }
}
