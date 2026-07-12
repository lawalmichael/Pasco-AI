import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  startSession, finishSession,
  getQuestionsForUser, submitAnswer,
  askTutor, getErrorMessage,
} from '../api';
import ReactMarkdown from 'react-markdown';
import BottomNav from '../components/BottomNav';
import './PracticeScreen.css';

const SUBJECTS = [
  'Mathematics','Biology','Chemistry','Physics',
  'English Language','Economics','Literature','Government',
];

/* ============================================================
   TOP-LEVEL: decides which phase to render
   ============================================================ */
export default function PracticeScreen() {
  const location = useLocation();
  const [phase, setPhase] = useState('setup');   // setup | session | done
  const [sessionState, setSessionState] = useState(null);

  // Accept pre-selected subject from navigation state (e.g. clicking a subject ring)
  const preSubject = location.state?.subject ?? null;

  function onSessionStart(data) {
    setSessionState(data);
    setPhase('session');
  }

  function onSessionDone(summary) {
    setSessionState(prev => ({ ...prev, ...summary }));
    setPhase('done');
  }

  if (phase === 'setup') {
    return <SetupPhase preSubject={preSubject} onStart={onSessionStart} />;
  }
  if (phase === 'session') {
    return <SessionPhase sessionData={sessionState} onDone={onSessionDone} />;
  }
  if (phase === 'done') {
    return <DonePhase summary={sessionState} onAgain={() => setPhase('setup')} />;
  }
  return null;
}

/* ============================================================
   PHASE 1: Setup — choose subject + topic
   ============================================================ */
function SetupPhase({ preSubject, onStart }) {
  const { user } = useAuth();
  const [subject, setSubject] = useState(preSubject ?? 'Mathematics');
  const [topic,   setTopic]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setError('');
    setLoading(true);
    try {
      const sess = await startSession({ subject, topic_filter: topic || undefined });
      onStart({ session: sess, subject, topic });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="practice-root">
      <div className="screen-scroll">
        <div className="practice-header">
          <h2>New Session</h2>
          <p className="practice-sub">Choose your subject and topic, then start practising.</p>
        </div>

        {error && <div className="alert alert-error" style={{ margin: '0 1.25rem 1rem' }}>{error}</div>}

        <div style={{ padding: '0 1.25rem' }}>
          <div className="field">
            <label>Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Topic <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. Quadratic Equations"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>

          <button className="btn btn-amber btn-full" onClick={handleStart} disabled={loading}>
            {loading ? 'Starting…' : '▷  Start Session'}
          </button>
        </div>

        {/* Subject grid shortcuts */}
        <div style={{ padding: '1.5rem 1.25rem 0' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Quick select</p>
          <div className="subject-quick-grid">
            {SUBJECTS.map(s => (
              <button
                key={s}
                className={`subject-quick-chip ${subject === s ? 'active' : ''}`}
                onClick={() => setSubject(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ============================================================
   PHASE 2: Session — show questions one at a time
   ============================================================ */
function SessionPhase({ sessionData, onDone }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions,  setQuestions]  = useState([]);
  const [qIndex,     setQIndex]     = useState(0);
  const [answered,   setAnswered]   = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [result,     setResult]     = useState(null);  // { is_correct, correct_answer }
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score,      setScore]      = useState(0);
  const [total,      setTotal]      = useState(0);
  // AI tutor
  const [showTutor,  setShowTutor]  = useState(false);
  const [tutorMsg,   setTutorMsg]   = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorHistory, setTutorHistory] = useState([]);
  const [tutorInput,   setTutorInput]   = useState('');

  const startTime = React.useRef(Date.now());

  useEffect(() => {
    let alive = true;
    getQuestionsForUser(
      user.id,
      sessionData.subject,
      sessionData.topic || null
    ).then(qs => {
      if (!alive) return;
      setQuestions(qs.slice(0, 10));
      setLoading(false);
    }).catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const q = questions[qIndex];
  const progress = questions.length > 0 ? ((qIndex) / questions.length) * 100 : 0;

  const OPTIONS = q ? [
    { letter: 'A', text: q.option_a },
    { letter: 'B', text: q.option_b },
    { letter: 'C', text: q.option_c },
    { letter: 'D', text: q.option_d },
  ] : [];

  async function handleAnswer(letter) {
    if (answered || submitting) return;
    setSelected(letter);
    setSubmitting(true);
    try {
      const res = await submitAnswer({
        question_id: q.id,
        selected_answer: letter,
        session_id: sessionData.session?.id,
      });
      setResult(res);
      setAnswered(true);
      setTotal(t => t + 1);
      if (res.is_correct) setScore(s => s + 1);
      if (!res.is_correct) {
        // Auto-trigger tutor explanation on wrong answer
        triggerTutor(`Explain why the correct answer to this question is ${res.correct_answer}:\n\n"${q.question_text}"\nA) ${q.option_a}\nB) ${q.option_b}\nC) ${q.option_c}\nD) ${q.option_d}`, []);
        setShowTutor(true);
      }
    } catch (e) {
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function triggerTutor(question, history) {
    setTutorLoading(true);
    setTutorMsg('');
    const newHistory = [...history, { role: 'user', content: question }];
    try {
      const res = await askTutor({ question, conversation_history: history });
      const answer = res.answer ?? res.response ?? res.explanation ?? JSON.stringify(res);
      setTutorHistory([...newHistory, { role: 'assistant', content: answer }]);
      setTutorMsg(answer);
    } catch (e) {
      setTutorMsg('Could not reach AI Tutor right now. Please try again.');
    } finally {
      setTutorLoading(false);
    }
  }

  async function handleFollowUp() {
    if (!tutorInput.trim()) return;
    const q = tutorInput.trim();
    setTutorInput('');
    await triggerTutor(q, tutorHistory);
  }

  async function handleNext() {
    if (qIndex >= questions.length - 1) {
      // Finish session
      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      try { await finishSession(sessionData.session?.id, timeTaken); } catch (_) {}
      onDone({ score, total: total, subject: sessionData.subject });
    } else {
      setQIndex(i => i + 1);
      setAnswered(false);
      setSelected(null);
      setResult(null);
      setShowTutor(false);
      setTutorMsg('');
      setTutorHistory([]);
      setTutorInput('');
    }
  }

  if (loading) {
    return (
      <div className="practice-root" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 14 }}>Loading questions…</p>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="practice-root" style={{ justifyContent: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No questions found for that filter. Try a different subject or topic.</p>
        <button className="btn btn-amber btn-full" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/practice')}>Go back</button>
      </div>
    );
  }

  const diffColor = q.difficulty === 'Easy' ? 'var(--green)' : q.difficulty === 'Hard' ? 'var(--red)' : 'var(--amber)';

  return (
    <div className="practice-root">
      <div className="screen-scroll">
        {/* Top bar */}
        <div className="session-topbar">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <div className="session-meta">
            <span className="session-subject-tag">{sessionData.subject}</span>
          </div>
          <span className="q-count">{qIndex + 1} / {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question card */}
        <div className="q-card">
          {q.difficulty && (
            <span className="q-diff-badge" style={{ color: diffColor, borderColor: diffColor }}>
              {q.difficulty} {q.topic ? `· ${q.topic}` : ''}
            </span>
          )}
          <p className="q-text">{q.question_text}</p>
        </div>

        {/* Options */}
        <div className="options-list">
          {OPTIONS.map(o => {
            let cls = 'option-btn';
            if (answered) {
              if (o.letter === result?.correct_answer) cls += ' correct';
              else if (o.letter === selected && !result?.is_correct) cls += ' wrong';
              else cls += ' disabled';
            }
            return (
              <button
                key={o.letter}
                className={cls}
                onClick={() => handleAnswer(o.letter)}
                disabled={answered || submitting}
              >
                <span className="opt-letter">{o.letter}</span>
                <span className="opt-text">{o.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div className={`feedback-banner ${result?.is_correct ? 'correct' : 'wrong'}`}>
            <span className="fb-icon">{result?.is_correct ? '✅' : '❌'}</span>
            <span>
              {result?.is_correct
                ? 'Correct! Great work.'
                : `Not quite — the answer is ${result?.correct_answer}`}
            </span>
          </div>
        )}

        {/* AI Tutor panel */}
        {answered && (
          <div className="tutor-panel">
            {!showTutor ? (
              <button
                className="btn btn-ghost btn-full"
                onClick={() => {
                  setShowTutor(true);
                  if (!tutorMsg) {
                    triggerTutor(
                      `Explain why the correct answer to this question is ${result?.correct_answer}:\n\n"${q.question_text}"\nA) ${q.option_a}\nB) ${q.option_b}\nC) ${q.option_c}\nD) ${q.option_d}`,
                      []
                    );
                  }
                }}
              >
                🤖 Explain this question
              </button>
            ) : (
              <div className="tutor-card">
                <div className="tutor-header">
                  <span className="tutor-avatar">🤖</span>
                  <strong>AI Tutor</strong>
                </div>
                <div className="tutor-body">
                  {tutorLoading
                    ? <span className="tutor-thinking">Thinking…</span>
                    : <ReactMarkdown>{tutorMsg}</ReactMarkdown>}
                </div>
                <div className="tutor-input-row">
                  <input
                    className="tutor-input"
                    placeholder="Ask a follow-up…"
                    value={tutorInput}
                    onChange={e => setTutorInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleFollowUp()}
                  />
                  <button className="tutor-send" onClick={handleFollowUp} disabled={tutorLoading}>
                    Ask
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        {answered && (
          <div className="q-next-wrap">
            <button className="btn btn-amber btn-full" onClick={handleNext}>
              {qIndex >= questions.length - 1 ? 'Finish session' : 'Next question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PHASE 3: Done — summary card
   ============================================================ */
function DonePhase({ summary, onAgain }) {
  const navigate = useNavigate();
  const pct = summary.total > 0 ? Math.round((summary.score / summary.total) * 100) : 0;
  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';

  return (
    <div className="practice-root" style={{ justifyContent: 'center' }}>
      <div className="done-card">
        <div className="done-emoji">{emoji}</div>
        <h2>Session complete!</h2>
        <p className="done-sub">
          You answered {summary.total} question{summary.total !== 1 ? 's' : ''} in {summary.subject}.
        </p>

        <div className="done-stats">
          <div className="done-stat">
            <span className="done-stat-val green">{summary.score}</span>
            <span className="done-stat-lbl">Correct</span>
          </div>
          <div className="done-stat">
            <span className="done-stat-val">{summary.total}</span>
            <span className="done-stat-lbl">Total</span>
          </div>
          <div className="done-stat">
            <span className="done-stat-val amber">{pct}%</span>
            <span className="done-stat-lbl">Accuracy</span>
          </div>
        </div>

        <button className="btn btn-amber btn-full" style={{ marginBottom: 10 }} onClick={() => navigate('/home')}>
          Back to home
        </button>
        <button className="btn btn-ghost btn-full" onClick={onAgain}>
          Practice again
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
