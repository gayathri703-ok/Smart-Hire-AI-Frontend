import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function RecruiterDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/recruiter/stats')
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scoreClass = (s) => s >= 75 ? 'score-high' : s >= 50 ? 'score-mid' : 'score-low';

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">Recruiter Dashboard</div>
          <div className="page-subtitle">Manage jobs and evaluate candidates</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/recruiter/post-job')}>
          ➕ Post New Job
        </button>
      </div>

      {/* Metrics */}
      <div className="metric-grid mb-3">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(0,255,178,.1)', color: 'var(--accent)' }}>👥</div>
          <div className="metric-label">Total Applicants</div>
          <div className="metric-value">{stats?.totalApplications || 0}</div>
          <div className="metric-delta delta-up">{stats?.pendingApplications || 0} pending</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(123,97,255,.1)', color: 'var(--accent2)' }}>💼</div>
          <div className="metric-label">Active Jobs</div>
          <div className="metric-value">{stats?.activeJobs || 0}</div>
          <div className="metric-delta">of {stats?.totalJobs || 0} total</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(0,255,178,.1)', color: 'var(--accent)' }}>✅</div>
          <div className="metric-label">Accepted</div>
          <div className="metric-value">{stats?.acceptedApplications || 0}</div>
          <div className="metric-delta delta-up">candidates hired</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(255,193,7,.1)', color: '#FFC107' }}>📊</div>
          <div className="metric-label">Avg ATS Score</div>
          <div className="metric-value">{stats?.avgAtsScore || 0}</div>
          <div className="metric-delta">across all applicants</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Top Candidates */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="section-title" style={{ marginBottom: 0 }}>Top Candidates</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/recruiter/candidates')}>View all</button>
          </div>
          {stats?.topCandidates?.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Candidate</th><th>Role</th><th>ATS</th></tr></thead>
                <tbody>
                  {stats.topCandidates.map(app => (
                    <tr key={app._id} style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/recruiter/candidates`)}>
                      <td>
                        <div>{app.user?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{app.user?.email}</div>
                      </td>
                      <td>{app.job?.title}</td>
                      <td><span className={`score-pill ${scoreClass(app.atsScore)}`}>{app.atsScore}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-sub">No candidates yet. Post a job to start receiving applications.</div>
              <button className="btn btn-secondary btn-sm mt-2" onClick={() => navigate('/recruiter/post-job')}>Post Job</button>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <div className="card mb-2">
            <div className="section-title">Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '➕ Post New Job',      path: '/recruiter/post-job' },
                { label: '💼 Manage My Jobs',    path: '/recruiter/my-jobs' },
                { label: '👥 View All Candidates',path: '/recruiter/candidates' },
              ].map(a => (
                <button key={a.path} className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}
                  onClick={() => navigate(a.path)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="section-title">Application Summary</div>
            {[
              { label: 'New applications', value: stats?.pendingApplications || 0, color: 'var(--accent2)' },
              { label: 'In review',        value: stats?.totalApplications - stats?.pendingApplications - stats?.acceptedApplications - stats?.rejectedApplications || 0, color: '#FFC107' },
              { label: 'Accepted',         value: stats?.acceptedApplications || 0, color: 'var(--accent)' },
              { label: 'Rejected',         value: stats?.rejectedApplications || 0, color: 'var(--accent3)' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between mb-1" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13.5, color: 'var(--text2)' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}