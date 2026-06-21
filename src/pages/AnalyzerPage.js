import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ATSRing from '../components/ATSRing';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function AnalyzerPage() {
  const [jd,       setJd]       = useState('');
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState(1);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (jd.trim().length < 50)
      return showToast('Please paste a job description (min 50 characters)', 'error');
    setLoading(true);
    try {
      const res = await api.post('/analyzer/quick', { jobDescription: jd });
      setResult(res.data.data);
      setStep(2);
      showToast('Analysis complete!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed';
      if (msg.includes('resume')) {
        showToast('Upload your resume first!', 'error');
        navigate('/resume');
      } else {
        showToast(msg, 'error');
      }
    } finally { setLoading(false); }
  };

  const reset = () => { setResult(null); setJd(''); setStep(1); };

  const scoreColor = result
    ? result.atsScore >= 75 ? 'var(--accent)' : result.atsScore >= 50 ? '#FFC107' : 'var(--accent3)'
    : 'var(--accent)';

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">Job Match Analyzer</div>
          <div className="page-subtitle">Paste a job description and get your real ATS score instantly</div>
        </div>
        {result && (
          <button className="btn btn-ghost" onClick={reset}>↺ New Analysis</button>
        )}
      </div>

      <div className="steps">
        <div className="step">
          <div className="step-dot done">✓</div>
          <span className="step-label done">Resume ready</span>
        </div>
        <div className={`step-line ${step >= 2 ? 'done' : ''}`} />
        <div className="step">
          <div className={`step-dot ${step >= 2 ? 'done' : 'active'}`}>{step >= 2 ? '✓' : '2'}</div>
          <span className={`step-label ${step >= 2 ? 'done' : 'active'}`}>Job description</span>
        </div>
        <div className={`step-line ${step >= 2 ? 'done' : ''}`} />
        <div className="step">
          <div className={`step-dot ${step >= 2 ? 'active' : 'todo'}`}>3</div>
          <span className={`step-label ${step >= 2 ? 'active' : 'todo'}`}>Analysis</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Paste Job Description</div>
          <textarea
            className="form-textarea"
            style={{ minHeight: 300, fontSize: 13.5 }}
            placeholder={`Paste the full job description here...\n\nExample:\nWe are looking for a Senior React Developer with 3+ years of experience in TypeScript, Node.js, and cloud infrastructure (AWS). Strong knowledge of Docker, CI/CD pipelines and PostgreSQL required.`}
            value={jd}
            onChange={e => setJd(e.target.value)}
          />
          <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleAnalyze}
              disabled={loading || jd.trim().length < 10}
            >
              {loading ? <><span className="spinner" /> Analyzing...</> : '⚡ Analyze Match'}
            </button>
            <button className="btn btn-ghost" onClick={() => setJd('')} disabled={!jd}>Clear</button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)' }}>
            {jd.length} characters {jd.length < 50 && jd.length > 0 ? '(need at least 50)' : ''}
          </div>
        </div>

        <div className="card">
          {!result ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">Ready to Analyze</div>
              <div className="empty-sub">Paste a job description and click Analyze Match to see your ATS score, matched skills and missing keywords</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="section-title" style={{ marginBottom: 0 }}>Your ATS Result</div>
                <span className="tag" style={{
                  background: result.atsScore >= 75 ? 'rgba(0,255,178,.1)' : result.atsScore >= 50 ? 'rgba(255,193,7,.1)' : 'rgba(255,107,107,.1)',
                  color: scoreColor, border: `1px solid ${scoreColor}40`
                }}>
                  {result.atsScore >= 75 ? '🟢 Strong Match' : result.atsScore >= 50 ? '🟡 Moderate Match' : '🔴 Weak Match'}
                </span>
              </div>

              <ATSRing score={result.atsScore} />

              <div className="grid-3 mt-2 mb-3" style={{ gap: 8 }}>
                {[
                  { label: 'Skill Match',  value: result.skillMatchScore },
                  { label: 'Keywords',     value: result.keywordMatchScore },
                  { label: 'Experience',   value: result.experienceScore }
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', padding: '10px 8px', background: 'var(--bg3)', borderRadius: 10 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{item.value}%</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                ✓ Matched Skills ({result.matchedSkills?.length || 0})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                {result.matchedSkills?.length > 0
                  ? result.matchedSkills.map((s, i) => <span key={i} className="tag tag-green">{s}</span>)
                  : <span style={{ fontSize: 13, color: 'var(--text3)' }}>None matched</span>
                }
              </div>

              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                ✕ Missing Skills ({result.missingSkills?.length || 0})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                {result.missingSkills?.length > 0
                  ? result.missingSkills.map((s, i) => <span key={i} className="tag tag-red">{s}</span>)
                  : <span style={{ fontSize: 13, color: 'var(--text3)' }}>None missing 🎉</span>
                }
              </div>

              <button className="btn btn-secondary w-full" style={{ justifyContent: 'center', marginTop: 8 }}
                onClick={() => navigate('/report', { state: { result } })}>
                ✨ View Full Suggestions →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}