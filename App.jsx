import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

import LoginScreen    from './screens/LoginScreen';
import SignupScreen   from './screens/SignupScreen';
import HomeScreen     from './screens/HomeScreen';
import PracticeScreen from './screens/PracticeScreen';
import BankScreen     from './screens/BankScreen';
import TutorScreen    from './screens/TutorScreen';
import ProgressScreen from './screens/ProgressScreen';
import MoreScreen     from './screens/MoreScreen';

import './styles/global.css';

/* ---- Protected route wrapper ---- */
function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null; // still rehydrating from localStorage
  if (!user)  return <Navigate to="/login" replace />;
  return children;
}

/* ---- Public-only route (redirect to home if already logged in) ---- */
function PublicRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (user)   return <Navigate to="/home" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Public (auth) */}
      <Route path="/login"  element={<PublicRoute><LoginScreen /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupScreen /></PublicRoute>} />

      {/* Protected */}
      <Route path="/home"     element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeScreen /></ProtectedRoute>} />
      <Route path="/bank"     element={<ProtectedRoute><BankScreen /></ProtectedRoute>} />
      <Route path="/tutor"    element={<ProtectedRoute><TutorScreen /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />
      <Route path="/more"     element={<ProtectedRoute><MoreScreen /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
