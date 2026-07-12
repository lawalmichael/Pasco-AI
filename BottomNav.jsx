import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const TABS = [
  { path: '/home',     label: 'Home',     icon: HomeIcon },
  { path: '/practice', label: 'Practice', icon: PracticeIcon },
  { path: '/bank',     label: 'Bank',     icon: BankIcon },
  { path: '/tutor',    label: 'Tutor',    icon: TutorIcon },
  { path: '/more',     label: 'More',     icon: MoreIcon },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path || pathname.startsWith(path + '/');
        return (
          <button
            key={path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(path)}
            aria-label={label}
          >
            <Icon active={active} />
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---- Inline SVG icons (outline style) ---- */

function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#F5B731' : '#8B91A8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}

function PracticeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#F5B731' : '#8B91A8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="3" x2="12" y2="1"/>
      <line x1="12" y1="23" x2="12" y2="21"/>
    </svg>
  );
}

function BankIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#F5B731' : '#8B91A8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V8M20 19V8M2 8h20M12 3L2 8h20L12 3zM8 19v-7M16 19v-7M12 19v-7M2 19h20"/>
    </svg>
  );
}

function TutorIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#F5B731' : '#8B91A8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

function MoreIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#F5B731' : '#8B91A8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
