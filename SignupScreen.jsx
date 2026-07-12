import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, getErrorMessage } from '../api';
import { useAuth } from '../AuthContext';
import './AuthScreens.css';

const SUBJECTS = [
  'Mathematics', 'Biology', 'Chemistry', 'Physics',
  'English Language', 'Economics', 'Literature', 'Government',
];

const COUNTRIES = ['Nigeria', 'Ghana', 'Sierra Leone', 'Liberia', 'The Gambia'];

export default function SignupScreen() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [country,  setCountry]  = useState('Nigeria');
  const [subjects, setSubjects] = useState([]);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  function toggleSubject(s) {
    setSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (subjects.length === 0) { setError('Pick at least one subject.'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await signup({ name, email, password, country, subjects_selected: subjects });
      saveAuth(data.user, data.access_token);
      navigate('/home');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="logo-mark"><span>P</span></div>
        <h1>PascoPrep AI</h1>
        <p>Ace your WAEC exams with AI</p>
      </div>

      <form className="auth-card" onSubmit={handleSignup}>
        <h2>Create account</h2>
        <p className="auth-sub">Start practising in under 60 seconds.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label>Full name</label>
          <input
            type="text"
            placeholder="Kenneth Olisa"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Choose a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="field">
          <label>Country</label>
          <select value={country} onChange={e => setCountry(e.target.value)}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Subjects — pick at least one</label>
          <div className="subject-grid">
            {SUBJECTS.map(s => (
              <button
                key={s}
                type="button"
                className={`subject-chip ${subjects.includes(s) ? 'selected' : ''}`}
                onClick={() => toggleSubject(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-amber btn-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
