import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getQuestionsForUser } from '../api';
import BottomNav from '../components/BottomNav';
import './BankScreen.css';

const SUBJECTS = [
  'Mathematics','Biology','Chemistry','Physics',
  'English Language','Economics','Literature','Government',
];

const DIFF_COLOR = {
  Easy: 'var(--green)',
  Medium: 'var(--amber)',
  Hard: 'var(--red)',
};

export default function BankScreen() {
  const { user } = useAuth();
  const [subject,   setSubject]   = useState('Mathematics');
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [expanded,  setExpanded]  = useState(null); // index of expanded question

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setExpanded(null);
    getQuestionsForUser(user.id, subject)
      .then(qs => { if (alive) setQuestions(qs); })
      .catch(() => { if (alive) setQuestions([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [subject]);

  return (
    <div className="bank-root">
      <div className="screen-scroll">

        <div className="bank-header">
          <h2>Question Bank</h2>
          <p className="bank-sub">Browse past WAEC questions by subject.</p>
        </div>

        {/* Subject tabs */}
        <div className="bank-tabs">
          {SUBJECTS.map(s => (
            <button
              key={s}
              className={`bank-tab ${subject === s ? 'active' : ''}`}
              onClick={() => setSubject(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        {!loading && (
          <div className="bank-stats">
            <span>{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{subject}</span>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="spinner" />
        ) : questions.length === 0 ? (
          <div className="bank-empty">
            <p>No questions found for {subject}.</p>
            <p style={{ fontSize: 13, marginTop: 6, color: 'var(--text-muted)' }}>
              Ask your backend team to seed questions for this subject.
            </p>
          </div>
        ) : (
          <div className="bank-list">
            {questions.map((q, i) => (
              <div key={q.id ?? i} className="bank-item">
                <button
                  className="bank-item-header"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="bank-item-meta">
                    {q.difficulty && (
                      <span className="bank-diff" style={{ color: DIFF_COLOR[q.difficulty] ?? 'var(--text-muted)' }}>
                        {q.difficulty}
                      </span>
                    )}
                    {q.topic && <span className="bank-topic">{q.topic}</span>}
                  </div>
                  <p className="bank-q-preview">
                    {q.question_text.length > 90
                      ? q.question_text.slice(0, 90) + '…'
                      : q.question_text}
                  </p>
                  <span className="bank-chevron">{expanded === i ? '▲' : '▼'}</span>
                </button>

                {expanded === i && (
                  <div className="bank-item-body">
                    <p className="bank-q-full">{q.question_text}</p>
                    <div className="bank-options">
                      {['A','B','C','D'].map(l => {
                        const text = q[`option_${l.toLowerCase()}`];
                        const isCorrect = q.correct_answer === l;
                        return (
                          <div key={l} className={`bank-option ${isCorrect ? 'correct' : ''}`}>
                            <span className="bank-opt-letter">{l}</span>
                            <span className="bank-opt-text">{text}</span>
                            {isCorrect && <span className="bank-correct-tick">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="bank-explanation">
                        <p className="bank-exp-label">Explanation</p>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
