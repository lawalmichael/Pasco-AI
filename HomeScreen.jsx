import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getProgress, getErrorMessage } from '../api';
import SubjectRing from '../components/SubjectRing';
import BottomNav from '../components/BottomNav';
import './HomeScreen.css';

const FLAG = { Nigeria: '🇳🇬', Ghana: '🇬🇭', 'Sierra Leone': '🇸🇱', Liberia: '🇱🇷', 'The Gambia': '🇬🇲' };

export default function HomeScreen() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let alive = true;
    getProgress()
      .then(d => { if (alive) setProgress(d); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const streak   = progress?.current_streak ?? 0;
  const today    = progress?.today ?? {};
  const subjects = progress?.subjects ?? [];

  const todayTotal  = today.total_questions ?? 0;
  const todayScore  = today.score ?? 0;
  const accuracy    = todayTotal > 0 ? Math.round((todayScore / todayTotal) * 100) : 0;

  const flag = user?.country ? (FLAG[user.country] ?? '') : '';

  return (
    <div className="home-root">
      <div className="screen-scroll">

        {/* ---- Header ---- */}
        <div className="home-header">
          <div>
            <p className="home-welcome">Welcome back</p>
            <h1 className="home-name">{user?.name ?? 'Student'} {flag}</h1>
          </div>
          <button className="avatar-btn" onClick={() => navigate('/more')}>
            {(user?.name ?? 'S')[0].toUpperCase()}
          </button>
        </div>

        {/* ---- Stat cards row ---- */}
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <p className="stat-label">Streak</p>
            <p className="stat-value blue">{streak}d</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <p className="stat-label">Today</p>
            <p className="stat-value amber">{todayScore}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-small">📈</div>
            <p className="stat-label">Accuracy</p>
            <p className="stat-value green">{accuracy}%</p>
          </div>
        </div>

        {/* ---- CTA row ---- */}
        <div className="cta-row">
          <button className="btn btn-amber cta-main" onClick={() => navigate('/practice')}>
            <span className="cta-play">▷</span>
            New Session
          </button>
          <button className="btn btn-dark cta-continue" onClick={() => navigate('/practice')}>
            → Continue
          </button>
        </div>

        {/* ---- Your Subjects ---- */}
        <div className="section-card">
          <h3 className="section-title">Your Subjects</h3>
          <div className="subjects-scroll">
            {loading ? (
              <div className="spinner" style={{ margin: '1rem auto' }} />
            ) : subjects.length > 0 ? (
              subjects.map((s, i) => (
                <SubjectItem key={i} subject={s} onClick={() => navigate('/practice', { state: { subject: s.name } })} />
              ))
            ) : (
              /* Fallback: show the user's selected subjects with 0% if no data yet */
              (user?.subjects_selected ?? ['Mathematics', 'Biology', 'Physics', 'Chemistry']).map((name, i) => (
                <SubjectItem key={i} subject={{ name, pct: 0, total_questions: 0 }} onClick={() => navigate('/practice', { state: { subject: name } })} />
              ))
            )}
          </div>
        </div>

        {/* ---- Quick actions ---- */}
        <div className="quick-row">
          <button className="quick-card" onClick={() => navigate('/practice', { state: { daily: true } })}>
            <span className="quick-icon amber">🔥</span>
            <span className="quick-label">Daily<br/>Challenge</span>
          </button>
          <button className="quick-card" onClick={() => navigate('/bank')}>
            <span className="quick-icon green">📋</span>
            <span className="quick-label">Exam Mode</span>
          </button>
        </div>

        <div className="quick-row" style={{ marginTop: 0 }}>
          <button className="quick-card" onClick={() => navigate('/bank')}>
            <span className="quick-icon blue">📚</span>
            <span className="quick-label">Question<br/>Bank</span>
          </button>
          <button className="quick-card" onClick={() => navigate('/tutor')}>
            <span className="quick-icon purple">🤖</span>
            <span className="quick-label">AI Tutor</span>
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

function SubjectItem({ subject, onClick }) {
  const pct = subject.pct ?? 0;
  const ringColor = pct >= 70 ? '#3DD68C' : pct >= 40 ? '#F5B731' : '#8B91A8';

  return (
    <button className="subject-item" onClick={onClick}>
      <SubjectRing pct={pct} size={80} strokeWidth={5} color={ringColor} />
      <p className="subject-name">{subject.name}</p>
      <p className="subject-qs">{subject.total_questions ?? 0} Qs</p>
    </button>
  );
}
