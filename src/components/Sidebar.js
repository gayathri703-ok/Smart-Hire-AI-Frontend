import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const candidateNav = [
  { label: 'Dashboard',       path: '/dashboard',     icon: '⊞' },
  { label: 'Resume',          path: '/resume',         icon: '📄' },
  { label: 'Analyzer',        path: '/analyzer',       icon: '⚡' },
  { label: 'AI Feedback',     path: '/ai-feedback',    icon: '🤖' },
  { label: 'Suggestions',     path: '/results',        icon: '✨' },
  { label: 'Job Board',       path: '/jobs',           icon: '💼' },
  { label: 'My Applications', path: '/applications',   icon: '📋' },
  { label: 'Analytics',       path: '/analytics',      icon: '📊' },
];

const recruiterNav = [
  { label: 'Dashboard',   path: '/recruiter',              icon: '⊞' },
  { label: 'Post Job',    path: '/recruiter/post-job',     icon: '➕' },
  { label: 'My Jobs',     path: '/recruiter/my-jobs',      icon: '💼' },
  { label: 'Candidates',  path: '/recruiter/candidates',   icon: '👥' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const nav = user?.role === 'recruiter' ? recruiterNav : candidateNav;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">S</div>
        <div className="logo-text">Smart<span>Hire</span> AI</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">
          {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
        </div>
        {nav.map(item => (
          <button
            key={item.path}
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{initials}</div>
        <div className="user-info">
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{user?.role}</div>
        </div>
        <button
          className="logout-btn"
          title="Logout"
          onClick={() => { logout(); navigate('/login'); }}
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}