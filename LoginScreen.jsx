import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getErrorMessage } from '../api';
import { useAuth } from '../AuthContext';
import './AuthScreens.css';

export default function LoginScreen() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      saveAuth(data.user, data.access_token);
      navigate('/home');
    } catch (err) {
      // Per brief: show generic message — don't reveal which field was wrong
      setError('Email or password is incorrect.');
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

      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome back</h2>
        <p className="auth-sub">Log in to pick up where you left off.</p>

        {error && <div className="alert alert-error">{error}</div>}

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
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-amber btn-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="auth-switch">
        New here? <Link to="/signup">Create account</Link>
      </p>
    </div>
  );
}
