import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function PostJobPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', company: user?.company || '',
    location: 'Remote', type: 'full-time', department: '',
    salaryMin: '', salaryMax: '', requiredSkills: '', experienceRequired: 0
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.company)
      return showToast('Title, description and company are required', 'error');
    setLoading(true);
    try {
      await api.post('/jobs', {
        ...form,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        experienceRequired: parseInt(form.experienceRequired) || 0
      });
      showToast('Job posted successfully!', 'success');
      navigate('/recruiter/my-jobs');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post job', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">Post a New Job</div>
          <div className="page-subtitle">Fill in the details — candidates will be matched automatically</div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/recruiter')}>← Back</button>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-input" placeholder="e.g. Senior React Developer" required
                value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input className="form-input" placeholder="Company name" required
                value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description * <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(be detailed — this powers ATS matching)</span></label>
            <textarea className="form-textarea" style={{ minHeight: 180 }} required
              placeholder="Describe the role, responsibilities, requirements, and tech stack in detail. This text is used for ATS keyword matching against candidate resumes."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="Remote / New York / Hybrid"
                value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" placeholder="Engineering / Design / Product"
                value={form.department} onChange={e => set('department', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience Required (years)</label>
              <input className="form-input" type="number" min="0" max="20"
                value={form.experienceRequired} onChange={e => set('experienceRequired', e.target.value)} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Min Salary (USD/year)</label>
              <input className="form-input" type="number" placeholder="e.g. 80000"
                value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Salary (USD/year)</label>
              <input className="form-input" type="number" placeholder="e.g. 120000"
                value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(comma separated)</span></label>
            <input className="form-input" placeholder="React, Node.js, TypeScript, Docker, PostgreSQL..."
              value={form.requiredSkills} onChange={e => set('requiredSkills', e.target.value)} />
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5 }}>
              These are used alongside the job description for precise ATS skill matching
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : '✅ Publish Job'}
            </button>
            <button className="btn btn-ghost btn-lg" type="button" onClick={() => navigate('/recruiter')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}