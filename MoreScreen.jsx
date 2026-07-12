import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import BottomNav from '../components/BottomNav';
import './MoreScreen.css';

const FLAG = {
  Nigeria: '🇳🇬', Ghana: '🇬🇭',
  'Sierra Leone': '🇸🇱', Liberia: '🇱🇷', 'The Gambia': '🇬🇲',
};

export default function MoreScreen() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    if (window.confirm('Log out of PascoPrep?')) {
      clearAuth();
      navigate('/login');
    }
  }

  const flag = user?.country ? (FLAG[user.country] ?? '') : '';

  return (
    <div className="more-root">
      <div className="screen-scroll">

        {/* Profile card */}
        <div className="more-header">
          <div className="more-avatar">
            {(user?.name ?? 'S')[0].toUpperCase()}
          </div>
          <div className="more-info">
            <h2>{user?.name ?? 'Student'}</h2>
            <p>{user?.email ?? ''}</p>
            <span className="more-country">{flag} {user?.country ?? ''}</span>
          </div>
        </div>

        {/* Subjects */}
        {user?.subjects_selected?.length > 0 && (
          <div className="more-section">
            <p className="more-section-label">Your subjects</p>
            <div className="more-subjects">
              {user.subjects_selected.map(s => (
                <span key={s} className="more-subject-chip">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Menu items */}
        <div className="more-section">
          <p className="more-section-label">Account</p>
          <div className="more-menu">
            <button className="more-menu-item" onClick={() => navigate('/progress')}>
              <span className="more-menu-icon">📊</span>
              <span className="more-menu-label">View progress</span>
              <span className="more-menu-arrow">›</span>
            </button>
            <button className="more-menu-item" onClick={() => navigate('/bank')}>
              <span className="more-menu-icon">📚</span>
              <span className="more-menu-label">Question bank</span>
              <span className="more-menu-arrow">›</span>
            </button>
            <button className="more-menu-item" onClick={() => navigate('/tutor')}>
              <span className="more-menu-icon">🤖</span>
              <span className="more-menu-label">AI Tutor</span>
              <span className="more-menu-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="more-section">
          <p className="more-section-label">Support</p>
          <div className="more-menu">
            <button className="more-menu-item" onClick={() => alert('Coming soon!')}>
              <span className="more-menu-icon">💬</span>
              <span className="more-menu-label">Send feedback</span>
              <span className="more-menu-arrow">›</span>
            </button>
            <button className="more-menu-item" onClick={() => alert('Coming soon!')}>
              <span className="more-menu-icon">📜</span>
              <span className="more-menu-label">Terms & Privacy</span>
              <span className="more-menu-arrow">›</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div style={{ padding: '0 1.25rem 1rem' }}>
          <button className="btn btn-ghost btn-full logout-btn" onClick={handleLogout}>
            🚪 Log out
          </button>
        </div>

        {/* Version */}
        <p className="app-version">PascoPrep AI · v1.0.0</p>

      </div>
      <BottomNav />
    </div>
  );
}
