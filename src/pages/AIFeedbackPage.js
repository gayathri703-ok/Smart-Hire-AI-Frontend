import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function AIFeedbackPage() {
  const [jd,       setJd]       = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (jd.trim().length < 50)
      return showToast('Please paste a job description (min 50 characters)', 'error');
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.post('/ai-feedback/analyze', { jobDescription: jd });
      setFeedback(res.data.data);
      showToast('AI feedback generated!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate feedback';
      if (msg.includes('resume')) { showToast('Upload your resume first!', 'error'); navigate('/resume'); }
      else showToast(msg, 'error');
    } finally { setLoading(false); }
  };

  const priorityColor = (p) => p === 'high' ? 'var(--accent3)' : p === 'medium' ? '#FFC107' : 'var(--accent2)';
  const priorityBg = (p) => p === 'high' ? 'rgba(255,107,107,.1)' : p === 'medium' ? 'rgba(255,193,7,.1)' : 'rgba(123,97,255,.1)';

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-title">🤖 AI Resume Feedback</div>
        <div className="page-subtitle">Get detailed, personalized feedback powered by AI — beyond basic keyword matching</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Paste Job Description</div>
          <textarea
            className="form-textarea"
            style={{ minHeight: 260, fontSize: 13.5 }}
            placeholder="Paste the job description here. AI will analyze your resume in depth against it..."
            value={jd}
            onChange={e => setJd(e.target.value)}
          />
          <div style={{ marginTop: '1rem' }}>
            <button
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center' }}
              onClick={handleAnalyze}
              disabled={loading || jd.trim().length < 10}
            >
              {loading ? <><span className="spinner" /> AI is analyzing your resume...</> : '🤖 Get AI Feedback'}
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)' }}>
            {jd.length} characters {jd.length < 50 && jd.length > 0 ? '(need at least 50)' : ''}
          </div>
          {loading && (
            <div className="notification notification-info mt-2">
              ⏳ This usually takes 5-15 seconds — AI is reading your full resume and the job description
            </div>
          )}
        </div>

        <div className="card">
          {!feedback ? (
            <div className="empty-state">
              <div className="empty-icon">🤖</div>
              <div className="empty-title">AI Feedback Awaits</div>
              <div className="empty-sub">Paste a job description to get deep, personalized resume analysis from AI — including rewrite suggestions and verdict</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="section-title" style={{ marginBottom: 0 }}>AI Analysis</div>
                <span className="tag tag-purple">ATS: {feedback.atsScore}</span>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(123,97,255,.1), rgba(0,255,178,.05))',
                border: '1px solid rgba(123,97,255,.2)',
                borderRadius: 12, padding: '1rem', marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: 11, color: 'var(--accent2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
                  AI Verdict
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>
                  "{feedback.overallVerdict}"
                </div>
              </div>

              <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {feedback.summary}
              </div>

              <div className="divider" />

              <div className="section-title">✅ Strengths</div>
              {feedback.strengths?.map((s, i) => (
                <div key={i} className="suggestion-item">
                  <div className="sug-icon sug-success">✓</div>
                  <div className="sug-text">{s}</div>
                </div>
              ))}

              <div className="divider" />

              <div className="section-title">🎯 Priority Improvements</div>
              {feedback.improvements?.map((imp, i) => (
                <div key={i} style={{ marginBottom: 12, padding: '12px', background: 'var(--bg3)', borderRadius: 10, borderLeft: `3px solid ${priorityColor(imp.priority)}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{imp.area}</span>
                    <span className="tag" style={{ background: priorityBg(imp.priority), color: priorityColor(imp.priority), fontSize: 11 }}>
                      {imp.priority} priority
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{imp.suggestion}</div>
                </div>
              ))}

              {feedback.rewriteSuggestions?.length > 0 && (
                <>
                  <div className="divider" />
                  <div className="section-title">✍️ Bullet Point Rewrites</div>
                  {feedback.rewriteSuggestions.map((r, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: 'var(--accent3)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.3px' }}>Before</div>
                      <div style={{ fontSize: 13, color: 'var(--text3)', background: 'rgba(255,107,107,.06)', padding: '8px 12px', borderRadius: 8, marginBottom: 8, fontStyle: 'italic' }}>
                        "{r.original}"
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.3px' }}>After</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', background: 'rgba(0,255,178,.06)', padding: '8px 12px', borderRadius: 8 }}>
                        "{r.improved}"
                      </div>
                    </div>
                  ))}
                </>
              )}

              {feedback.missingKeywords?.length > 0 && (
                <>
                  <div className="divider" />
                  <div className="section-title">🔑 Keywords to Add</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {feedback.missingKeywords.map((k, i) => <span key={i} className="tag tag-red">{k}</span>)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}