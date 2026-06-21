import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [role, setRole]   = useState('candidate');
  const [form, setForm]   = useState({ name: '', email: '', password: '', company: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return showToast('Password must be at least 6 characters', 'error');
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      showToast(`Welcome to SmartHire, ${user.name}!`, 'success');
      navigate(user.role === 'recruiter' ? '/recruiter' : '/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">S</div>
          <div className="auth-title">Create Account</div>
          <div className="auth-sub">Join SmartHire AI for free</div>
        </div>

        <div className="role-toggle">
          <button type="button" className={`role-btn ${role === 'candidate' ? 'active' : ''}`} onClick={() => setRole('candidate')}>
            👤 Candidate
          </button>
          <button type="button" className={`role-btn ${role === 'recruiter' ? 'active' : ''}`} onClick={() => setRole('recruiter')}>
            🏢 Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" placeholder="John Doe" required
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          {role === 'recruiter' && (
            <div className="form-group">
              <label className="form-label">Company name</label>
              <input className="form-input" placeholder="TechCorp Inc."
                value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-primary w-full" style={{ justifyContent: 'center', padding: '13px' }} disabled={loading}>
            {loading ? <span className="spinner" /> : `Create ${role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account →`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: 13.5, color: 'var(--text3)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}