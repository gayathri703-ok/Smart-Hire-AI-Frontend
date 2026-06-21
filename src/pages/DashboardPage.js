import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkillBar from '../components/SkillBar';
import api from '../utils/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, resumeRes] = await Promise.allSettled([
          api.get('/applications/myapplications'),
          api.get('/resume')
        ]);
        if (appsRes.status === 'fulfilled')  setApps(appsRes.value.data.data || []);
        if (resumeRes.status === 'fulfilled') setResume(resumeRes.value.data.data);
      } catch (_) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const avgScore = apps.length > 0 ? Math.round(apps.reduce((s, a) => s + a.atsScore, 0) / apps.length) : 0;
  const scoreClass = (s) => s >= 75 ? 'score-high' : s >= 50 ? 'score-mid' : 'score-low';
  const statusClass = (s) => `status-${s}`;

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</div>
          <div className="page-subtitle">Here's your job search overview</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/analyzer')}>
          ⚡ Analyze New Job
        </button>
      </div>

      {!resume && (
        <div className="notification notification-warning mb-3">
          ⚠️ No resume uploaded yet.{' '}
          <span style={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }} onClick={() => navigate('/resume')}>
            Upload your resume
          </span>{' '}to start matching jobs.
        </div>
      )}

      {/* Metrics */}
      <div className="metric-grid mb-3">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(0,255,178,.1)', color: 'var(--accent)' }}>📊</div>
          <div className="metric-label">Avg ATS Score</div>
          <div className="metric-value">{avgScore}</div>
          <div className="metric-delta delta-up">/ 100 points</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(123,97,255,.1)', color: 'var(--accent2)' }}>📤</div>
          <div className="metric-label">Applications</div>
          <div className="metric-value">{apps.length}</div>
          <div className="metric-delta">total submitted</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(0,255,178,.1)', color: 'var(--accent)' }}>✅</div>
          <div className="metric-label">Accepted</div>
          <div className="metric-value">{apps.filter(a => a.status === 'accepted').length}</div>
          <div className="metric-delta delta-up">offers received</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(255,107,107,.1)', color: 'var(--accent3)' }}>📝</div>
          <div className="metric-label">Resume Words</div>
          <div className="metric-value">{resume ? resume.wordCount : '—'}</div>
          <div className="metric-delta">{resume ? 'words parsed' : 'not uploaded'}</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Skills */}
        <div className="card">
          <div className="section-title">Your Detected Skills</div>
          {resume?.skills?.length > 0 ? (
            resume.skills.slice(0, 6).map((skill, i) => (
              <SkillBar key={i} label={skill} value={Math.floor(70 + Math.random() * 30)} />
            ))
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-sub">Upload your resume to detect skills automatically</div>
              <button className="btn btn-secondary btn-sm mt-2" onClick={() => navigate('/resume')}>Upload Resume</button>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="section-title" style={{ marginBottom: 0 }}>Recent Applications</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/applications')}>View all</button>
          </div>
          {apps.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Job</th><th>ATS</th><th>Status</th></tr></thead>
                <tbody>
                  {apps.slice(0, 5).map(app => (
                    <tr key={app._id}>
                      <td>
                        <div>{app.job?.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{app.job?.company}</div>
                      </td>
                      <td><span className={`score-pill ${scoreClass(app.atsScore)}`}>{app.atsScore}</span></td>
                      <td><span className={`status-pill ${statusClass(app.status)}`}>{app.status.replace('_',' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-sub">No applications yet. Browse the job board to get started.</div>
              <button className="btn btn-secondary btn-sm mt-2" onClick={() => navigate('/jobs')}>Browse Jobs</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}