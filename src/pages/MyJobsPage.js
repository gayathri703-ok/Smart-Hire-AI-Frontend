import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function MyJobsPage() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/myjobs')
      .then(res => setJobs(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(`/jobs/${id}/toggle`);
      setJobs(prev => prev.map(j => j._id === id ? res.data.data : j));
      showToast(res.data.message, 'success');
    } catch { showToast('Failed to update', 'error'); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job? All applications will be lost.')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      showToast('Job deleted', 'success');
    } catch { showToast('Failed to delete', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">My Jobs</div>
          <div className="page-subtitle">{jobs.length} jobs posted</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/recruiter/post-job')}>➕ Post New Job</button>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <div className="empty-title">No Jobs Posted Yet</div>
          <div className="empty-sub">Post your first job to start receiving candidate applications</div>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/recruiter/post-job')}>Post First Job</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map(job => (
            <div key={job._id} className="card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 600 }}>{job.title}</div>
                  <div className="job-meta mt-1">
                    <span>🏢 {job.company}</span>
                    <span>📍 {job.location}</span>
                    <span>⏱ {job.type}</span>
                    <span>👥 {job.applicantCount} applicants</span>
                    <span>🗓 {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`tag ${job.isActive ? 'tag-green' : 'tag-red'}`}>
                    {job.isActive ? '● Active' : '● Inactive'}
                  </span>
                </div>
              </div>

              {job.requiredSkills?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                  {job.requiredSkills.slice(0, 6).map((s, i) => (
                    <span key={i} className="tag tag-gray">{s}</span>
                  ))}
                </div>
              )}

              <div className="divider" style={{ margin: '0.75rem 0' }} />

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/recruiter/candidates', { state: { jobId: job._id } })}>
                  👥 View Applicants ({job.applicantCount})
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(job._id)}>
                  {job.isActive ? '⏸ Deactivate' : '▶ Activate'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteJob(job._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}