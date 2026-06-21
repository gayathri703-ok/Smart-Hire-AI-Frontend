import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function ResumePage() {
  const [resume,   setResume]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [uploading,setUploading]= useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const { showToast } = useToast();

  useEffect(() => { fetchResume(); }, []);

  const fetchResume = async () => {
    try {
      const res = await api.get('/resume');
      setResume(res.data.data);
    } catch (_) { setResume(null); }
    setLoading(false);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf','doc','docx'].includes(ext))
      return showToast('Only PDF, DOC, DOCX files allowed', 'error');
    if (file.size > 5 * 1024 * 1024)
      return showToast('File must be under 5MB', 'error');

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await api.post('/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Resume uploaded and parsed successfully!', 'success');
      fetchResume();
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your resume?')) return;
    try {
      await api.delete('/resume');
      setResume(null);
      showToast('Resume deleted', 'success');
    } catch (err) { showToast('Delete failed', 'error'); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-title">Resume</div>
        <div className="page-subtitle">Upload your resume — we'll parse it and extract your skills automatically</div>
      </div>

      <div className="grid-2">
        {/* Upload */}
        <div>
          <div className="card mb-2">
            <div className="section-title">Upload Resume</div>
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={e => handleUpload(e.target.files[0])} />
              <div className="upload-icon-wrap">
                {uploading ? <div className="spinner" /> : <span style={{ fontSize: 26 }}>☁️</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                {uploading ? 'Uploading & parsing...' : 'Drop your PDF here'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: '1.25rem' }}>
                or click to browse · PDF, DOC, DOCX up to 5MB
              </div>
              {!uploading && (
                <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                  Choose File
                </button>
              )}
            </div>
          </div>

          {/* File info */}
          {resume && (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div style={{ width: 38, height: 38, background: 'rgba(255,107,107,.1)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--accent3)' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{resume.filename}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {resume.wordCount} words · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑 Delete</button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="tag tag-green">✓ Parsed</span>
                <span className="tag tag-gray">{resume.wordCount} words</span>
                <span className="tag tag-gray">{resume.experienceYears || 0} yrs exp detected</span>
              </div>
            </div>
          )}
        </div>

        {/* Skills & Preview */}
        <div>
          {resume ? (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="section-title" style={{ marginBottom: 0 }}>Detected Skills</div>
                <span className="tag tag-green">✓ Auto-detected</span>
              </div>
              {resume.skills?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
                  {resume.skills.map((skill, i) => (
                    <span key={i} className="tag tag-purple">{skill}</span>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text3)', fontSize: 13.5, marginBottom: '1.5rem' }}>
                  No specific tech skills detected. Make sure your resume mentions skill names clearly.
                </div>
              )}

              <div className="divider" />

              <div className="section-title">Resume Preview</div>
              <div style={{
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '1.25rem', fontSize: 13, lineHeight: 1.7, color: 'var(--text2)',
                maxHeight: 280, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
              }}>
                {resume.resumeText?.slice(0, 800) || 'No text extracted.'}
                {resume.resumeText?.length > 800 && (
                  <span style={{ color: 'var(--text3)' }}>... (truncated preview)</span>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <div className="empty-title">No Resume Uploaded</div>
                <div className="empty-sub">Upload a PDF to see your skills and resume preview here</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}