import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function CandidatesPage() {
  const [apps,     setApps]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [filter,   setFilter]   = useState('all');
  const [note,     setNote]     = useState('');
  const { showToast } = useToast();

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get('/recruiter/applications');
      setApps(res.data.data || []);
    } catch (_) {}
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await api.put(`/recruiter/applications/${id}/status`, { status, recruiterNote: note });
      setApps(prev => prev.map(a => a._id === id ? { ...a, status, recruiterNote: note } : a));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status, recruiterNote: note }));
      showToast(`Candidate ${status}`, 'success');
      setNote('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally { setUpdating(false); }
  };

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);
  const scoreClass = (s) => s >= 75 ? 'score-high' : s >= 50 ? 'score-mid' : 'score-low';

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-title">Candidates</div>
        <div className="page-subtitle">{apps.length} total applications across all your jobs</div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all','applied','in_review','accepted','rejected'].map(f => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${apps.length})` : `${f.replace('_',' ')} (${apps.filter(a=>a.status===f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <div className="empty-title">No Candidates</div>
          <div className="empty-sub">No applications match this filter</div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>ATS</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(app => (
                    <tr key={app._id} style={{ cursor: 'pointer' }}
                      onClick={() => { setSelected(app); setNote(app.recruiterNote || ''); }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'linear-gradient(135deg,var(--accent2),var(--accent))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0
                          }}>
                            {app.user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13.5 }}>{app.user?.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{app.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>{app.job?.title}</td>
                      <td><span className={`score-pill ${scoreClass(app.atsScore)}`}>{app.atsScore}</span></td>
                      <td><span className={`status-pill status-${app.status}`}>{app.status.replace('_',' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="card" style={{ position: 'sticky', top: '1rem', alignSelf: 'start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--accent2),var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0
                }}>
                  {selected.user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 600 }}>{selected.user?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{selected.user?.email}</div>
                </div>
                <span className={`score-pill ${scoreClass(selected.atsScore)}`} style={{ marginLeft: 'auto', fontSize: 16 }}>
                  {selected.atsScore}
                </span>
              </div>

              <div className="grid-3 mb-3" style={{ gap: 8 }}>
                {[
                  { label: 'Skill', value: selected.skillMatchScore },
                  { label: 'Keywords', value: selected.keywordMatchScore },
                  { label: 'Experience', value: selected.experienceScore }
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', padding: 8, background: 'var(--bg3)', borderRadius: 8 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700 }}>{item.value}%</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>Matched Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                {selected.matchedSkills?.map((s, i) => <span key={i} className="tag tag-green">{s}</span>)}
                {!selected.matchedSkills?.length && <span style={{ fontSize: 13, color: 'var(--text3)' }}>None</span>}
              </div>

              <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>Missing Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                {selected.missingSkills?.map((s, i) => <span key={i} className="tag tag-red">{s}</span>)}
                {!selected.missingSkills?.length && <span style={{ fontSize: 13, color: 'var(--text3)' }}>None</span>}
              </div>

              <div className="divider" />
              <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>Recruiter Note</div>
              <textarea className="form-textarea" style={{ minHeight: 80, marginBottom: '1rem', fontSize: 13 }}
                placeholder="Add a note about this candidate..."
                value={note} onChange={e => setNote(e.target.value)} />

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => updateStatus(selected._id, 'accepted')} disabled={updating}>
                  {updating ? <span className="spinner" /> : '✅ Accept'}
                </button>
                <button className="btn btn-ghost btn-sm"
                  onClick={() => updateStatus(selected._id, 'in_review')} disabled={updating}>
                  👁 Review
                </button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => updateStatus(selected._id, 'rejected')} disabled={updating}>
                  ✕ Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">👆</div>
                <div className="empty-title">Select a Candidate</div>
                <div className="empty-sub">Click any row to see full ATS breakdown and take action</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}