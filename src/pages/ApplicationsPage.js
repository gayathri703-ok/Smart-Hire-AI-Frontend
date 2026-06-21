import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function ApplicationsPage() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected,setSelected]= useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get('/applications/myapplications');
      setApps(res.data.data || []);
    } catch (_) {}
    setLoading(false);
  };

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApps(prev => prev.filter(a => a._id !== id));
      setSelected(null);
      showToast('Application withdrawn', 'success');
    } catch (err) { showToast('Failed to withdraw', 'error'); }
  };

  const scoreClass = (s) => s >= 75 ? 'score-high' : s >= 50 ? 'score-mid' : 'score-low';

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-title">My Applications</div>
        <div className="page-subtitle">{apps.length} total applications submitted</div>
      </div>

      {apps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No Applications Yet</div>
          <div className="empty-sub">Browse the job board and apply to positions that match your skills</div>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/jobs')}>💼 Browse Jobs</button>
        </div>
      ) : (
        <div className="grid-2">
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {apps.map(app => (
              <div key={app._id}
                className={`job-card ${selected?._id === app._id ? 'selected' : ''}`}
                onClick={() => setSelected(app)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="job-title-text">{app.job?.title}</div>
                  <span className={`score-pill ${scoreClass(app.atsScore)}`}>{app.atsScore}</span>
                </div>
                <div className="job-meta">
                  <span>🏢 {app.job?.company}</span>
                  <span>📍 {app.job?.location}</span>
                  <span>🗓 {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <span className={`status-pill status-${app.status}`}>{app.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="card" style={{ position: 'sticky', top: '1rem', alignSelf: 'start' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 600 }}>{selected.job?.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{selected.job?.company}</div>
                </div>
                <span className={`score-pill ${scoreClass(selected.atsScore)}`} style={{ fontSize: 16 }}>{selected.atsScore}</span>
              </div>

              <div className="grid-3 mb-3" style={{ gap: 8 }}>
                {[
                  { label: 'Skill', value: selected.skillMatchScore },
                  { label: 'Keywords', value: selected.keywordMatchScore },
                  { label: 'Experience', value: selected.experienceScore }
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', padding: '8px', background: 'var(--bg3)', borderRadius: 8 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700 }}>{item.value}%</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>Status</div>
              <span className={`status-pill status-${selected.status}`} style={{ fontSize: 13 }}>
                {selected.status.replace('_', ' ')}
              </span>

              {selected.recruiterNote && (
                <>
                  <div className="divider" />
                  <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>Recruiter Note</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px' }}>
                    {selected.recruiterNote}
                  </div>
                </>
              )}

              <div className="divider" />
              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>Matched Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                {selected.matchedSkills?.map((s, i) => <span key={i} className="tag tag-green">{s}</span>)}
              </div>

              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>Missing Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.5rem' }}>
                {selected.missingSkills?.map((s, i) => <span key={i} className="tag tag-red">{s}</span>)}
              </div>

              {selected.status === 'applied' && (
                <button className="btn btn-danger w-full" style={{ justifyContent: 'center' }} onClick={() => withdraw(selected._id)}>
                  Withdraw Application
                </button>
              )}
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">👆</div>
                <div className="empty-title">Select an Application</div>
                <div className="empty-sub">Click any application to see full ATS breakdown and status</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}