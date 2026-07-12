import React, { useEffect, useState } from 'react';
import { getProgress, getProgressMonthly } from '../api';
import BottomNav from '../components/BottomNav';
import './ProgressScreen.css';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function ProgressScreen() {
  const [progress,  setProgress]  = useState(null);
  const [monthly,   setMonthly]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showMonth, setShowMonth] = useState(false);

  useEffect(() => {
    let alive = true;
    getProgress()
      .then(d => { if (alive) setProgress(d); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  async function loadMonthly() {
    if (monthly) { setShowMonth(v => !v); return; }
    try {
      const data = await getProgressMonthly();
      setMonthly(data);
      setShowMonth(true);
    } catch (_) {}
  }

  const streak    = progress?.current_streak ?? 0;
  const today     = progress?.today ?? {};
  const last7     = progress?.last_7_days ?? [];
  const todayPct  = today.total_questions > 0
    ? Math.round((today.score / today.total_questions) * 100)
    : 0;

  const maxBar = Math.max(...last7.map(d => d.total_questions ?? 0), 1);

  return (
    <div className="prog-root">
      <div className="screen-scroll">

        <div className="prog-header">
          <h2>Progress</h2>
          <p className="prog-sub">Track your consistency and accuracy over time.</p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            {/* Stat cards */}
            <div className="prog-stat-row">
              <div className="prog-stat-card">
                <span className="prog-stat-icon">🔥</span>
                <span className="prog-stat-val" style={{ color: '#4B9EF5' }}>{streak}d</span>
                <span className="prog-stat-lbl">Streak</span>
              </div>
              <div className="prog-stat-card">
                <span className="prog-stat-icon">✅</span>
                <span className="prog-stat-val" style={{ color: 'var(--green)' }}>{today.score ?? 0}</span>
                <span className="prog-stat-lbl">Today correct</span>
              </div>
              <div className="prog-stat-card">
                <span className="prog-stat-icon">📊</span>
                <span className="prog-stat-val" style={{ color: 'var(--amber)' }}>{todayPct}%</span>
                <span className="prog-stat-lbl">Accuracy</span>
              </div>
            </div>

            {/* Weekly bar chart */}
            <div className="prog-section">
              <p className="prog-section-title">Last 7 days</p>
              <div className="bar-chart">
                {last7.map((d, i) => {
                  const heightPct = d.total_questions > 0
                    ? Math.max((d.total_questions / maxBar) * 100, 8)
                    : 4;
                  const date    = new Date(d.date);
                  const dayLbl  = DAY_LABELS[date.getDay()];
                  const isToday = i === last7.length - 1;
                  return (
                    <div key={i} className="bar-col">
                      <span className="bar-count">
                        {d.total_questions > 0 ? d.total_questions : ''}
                      </span>
                      <div
                        className={`bar-fill ${d.total_questions > 0 ? 'has-data' : ''} ${isToday ? 'today' : ''}`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className={`bar-day ${isToday ? 'today' : ''}`}>{dayLbl}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly heatmap toggle */}
            <div className="prog-section">
              <button className="monthly-toggle" onClick={loadMonthly}>
                📅 {showMonth ? 'Hide' : 'Show'} this month
              </button>

              {showMonth && monthly && (
                <div className="monthly-grid-wrap">
                  <div className="day-header-row">
                    {DAY_LABELS.map(l => (
                      <span key={l} className="day-header">{l}</span>
                    ))}
                  </div>
                  <HeatmapGrid days={monthly.days ?? []} />
                  <div className="month-summary">
                    <span>{monthly.total_score ?? 0} correct</span>
                    <span>·</span>
                    <span>{monthly.total_questions ?? 0} total</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function HeatmapGrid({ days }) {
  if (days.length === 0) return null;
  const firstDay = new Date(days[0].date).getDay();
  const blanks   = Array(firstDay).fill(null);

  return (
    <div className="heatmap-grid">
      {blanks.map((_, i) => <div key={`b${i}`} className="heat-cell blank" />)}
      {days.map((d, i) => {
        const date    = new Date(d.date);
        const has     = d.total_questions > 0;
        const pct     = has ? Math.round((d.score / d.total_questions) * 100) : 0;
        const intense = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : has ? 'low' : '';
        return (
          <div
            key={i}
            className={`heat-cell ${intense}`}
            title={has ? `${d.score}/${d.total_questions} correct` : 'No activity'}
          >
            <span className="heat-day-num">{date.getDate()}</span>
          </div>
        );
      })}
    </div>
  );
}
