import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ATSRing from '../components/ATSRing';

const ICONS = ['⚠️','ℹ️','🔧','✅','📐','🎯'];

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const result    = state?.result;

  if (!result) return (
    <div className="page-wrap">
      <div className="empty-state" style={{ marginTop: '4rem' }}>
        <div className="empty-icon">📊</div>
        <div className="empty-title">No Analysis Found</div>
        <div className="empty-sub">Run a job match analysis first to see suggestions here</div>
        <button className="btn btn-primary mt-2" onClick={() => navigate('/analyzer')}>⚡ Go to Analyzer</button>
      </div>
    </div>
  );

  const bars = [
    { label: 'Skill match',     value: result.skillMatchScore,   color: '#00FFB2' },
    { label: 'Keyword overlap', value: result.keywordMatchScore, color: '#7B61FF' },
    { label: 'Experience fit',  value: result.experienceScore,   color: '#FFC107' },
  ];

  const sugIcons = (text) => {
    if (text.toLowerCase().includes('missing') || text.toLowerCase().includes('add')) return { cls: 'sug-warn', icon: '⚠️' };
    if (text.toLowerCase().includes('excellent') || text.toLowerCase().includes('strong')) return { cls: 'sug-success', icon: '✅' };
    if (text.toLowerCase().includes('low') || text.toLowerCase().includes('short')) return { cls: 'sug-error', icon: '🔴' };
    return { cls: 'sug-info', icon: 'ℹ️' };
  };

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">AI Suggestions</div>
          <div className="page-subtitle">Personalized recommendations to improve your resume</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/analyzer')}>↺ Re-analyze</button>
          <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>💼 Browse Jobs</button>
        </div>
      </div>

      <div className="grid-2">
        {/* Left — Score breakdown */}
        <div>
          <div className="card mb-2">
            <div className="section-title">Score Breakdown</div>
            {bars.map(b => (
              <div key={b.label} className="hbar">
                <div className="hbar-label">{b.label}</div>
                <div className="hbar-track">
                  <div className="hbar-fill" style={{ width: `${b.value}%`, background: b.color }} />
                </div>
                <div className="hbar-val">{b.value}%</div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Total ATS Score</span>
              <div className="ats-ring-wrap">
                <ATSRing score={result.atsScore} size={100} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title">Missing Skills to Add</div>
            {result.missingSkills?.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
                  {result.missingSkills.map((s, i) => <span key={i} className="tag tag-red">{s}</span>)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6 }}>
                  Adding these skills to your resume could increase your ATS score significantly.
                  Focus on the top 3 most relevant to the job first.
                </div>
              </>
            ) : (
              <div className="notification notification-success">
                🎉 Your resume covers all required skills for this role!
              </div>
            )}
          </div>
        </div>

        {/* Right — Suggestions */}
        <div className="card">
          <div className="section-title">Improvement Suggestions</div>
          {result.suggestions?.length > 0 ? (
            result.suggestions.map((sug, i) => {
              const { cls, icon } = sugIcons(sug);
              return (
                <div key={i} className="suggestion-item">
                  <div className={`sug-icon ${cls}`}>{icon}</div>
                  <div className="sug-text">{sug}</div>
                </div>
              );
            })
          ) : (
            <div className="notification notification-success">
              ✅ Your resume looks great for this role!
            </div>
          )}

          <div className="divider" />

          <div className="section-title">Matched Skills</div>
          {result.matchedSkills?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {result.matchedSkills.map((s, i) => <span key={i} className="tag tag-green">{s}</span>)}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>No matching skills found.</div>
          )}
        </div>
      </div>
    </div>
  );
}