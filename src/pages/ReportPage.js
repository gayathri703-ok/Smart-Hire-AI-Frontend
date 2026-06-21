import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ATSRing from '../components/ATSRing';

export default function ReportPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const result    = state?.result;
  const [downloading, setDownloading] = useState(false);

  const downloadReport = () => {
    setDownloading(true);
    const now = new Date().toLocaleDateString();
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>SmartHire AI — ATS Report</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #1a1a2e; padding: 0 20px; }
  h1 { color: #00a882; font-size: 28px; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 14px; margin-bottom: 30px; }
  .score-box { background: #f0fdf9; border: 2px solid #00a882; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; }
  .score-num { font-size: 64px; font-weight: 900; color: ${result?.atsScore>=75?'#00a882':result?.atsScore>=50?'#d97706':'#dc2626'}; line-height: 1; }
  .score-label { font-size: 16px; color: #666; margin-top: 8px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .metric { background: #f8f8fc; border-radius: 8px; padding: 16px; text-align: center; }
  .metric-val { font-size: 28px; font-weight: 700; color: #1a1a2e; }
  .metric-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  h2 { font-size: 18px; color: #1a1a2e; margin: 24px 0 12px; border-bottom: 2px solid #f0f0f8; padding-bottom: 8px; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .tag-green { background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
  .tag-red { background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
  .suggestion { display: flex; gap: 12px; padding: 12px; background: #f8f8fc; border-radius: 8px; margin-bottom: 8px; font-size: 14px; line-height: 1.6; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #999; text-align: center; }
  .bar-wrap { margin-bottom: 12px; }
  .bar-label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
  .bar-track { height: 8px; background: #e5e7eb; border-radius: 8px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 8px; }
</style>
</head>
<body>
<h1>SmartHire AI — ATS Report</h1>
<div class="subtitle">Generated on ${now}</div>
<div class="score-box">
  <div class="score-num">${result?.atsScore || 0}</div>
  <div class="score-label">ATS Score / 100 — ${result?.atsScore>=75?'Strong Match':result?.atsScore>=50?'Moderate Match':'Weak Match'}</div>
</div>
<div class="grid">
  <div class="metric"><div class="metric-val">${result?.skillMatchScore||0}%</div><div class="metric-label">Skill Match</div></div>
  <div class="metric"><div class="metric-val">${result?.keywordMatchScore||0}%</div><div class="metric-label">Keywords</div></div>
  <div class="metric"><div class="metric-val">${result?.experienceScore||0}%</div><div class="metric-label">Experience</div></div>
</div>
<h2>Score Breakdown</h2>
<div class="bar-wrap"><div class="bar-label"><span>Skill Match (50% weight)</span><span>${result?.skillMatchScore||0}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${result?.skillMatchScore||0}%;background:#00a882"></div></div></div>
<div class="bar-wrap"><div class="bar-label"><span>Keyword Overlap (30% weight)</span><span>${result?.keywordMatchScore||0}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${result?.keywordMatchScore||0}%;background:#7b61ff"></div></div></div>
<div class="bar-wrap"><div class="bar-label"><span>Experience Fit (20% weight)</span><span>${result?.experienceScore||0}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${result?.experienceScore||0}%;background:#d97706"></div></div></div>
<h2>✅ Matched Skills (${result?.matchedSkills?.length||0})</h2>
<div class="tags">${(result?.matchedSkills||[]).map(s=>`<span class="tag-green">${s}</span>`).join('')||'<span style="color:#666">None detected</span>'}</div>
<h2>❌ Missing Skills (${result?.missingSkills?.length||0})</h2>
<div class="tags">${(result?.missingSkills||[]).map(s=>`<span class="tag-red">${s}</span>`).join('')||'<span style="color:#666">None — great match!</span>'}</div>
<h2>💡 Improvement Suggestions</h2>
${(result?.suggestions||[]).map(s=>`<div class="suggestion"><span>•</span><span>${s}</span></div>`).join('')}
<div class="footer">SmartHire AI — Resume Analyzer & Job Match Platform &nbsp;|&nbsp; ${now}</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'SmartHire-ATS-Report.html';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    setDownloading(false);
  };

  if (!result) return (
    <div className="page-wrap">
      <div className="empty-state" style={{ marginTop:'4rem' }}>
        <div className="empty-icon">📥</div>
        <div className="empty-title">No Report Available</div>
        <div className="empty-sub">Run a job match analysis first to generate a report</div>
        <button className="btn btn-primary mt-2" onClick={() => navigate('/analyzer')}>⚡ Go to Analyzer</button>
      </div>
    </div>
  );

  const bars = [
    { label:'Skill match',     value:result.skillMatchScore,   color:'#00FFB2' },
    { label:'Keyword overlap', value:result.keywordMatchScore, color:'#7B61FF' },
    { label:'Experience fit',  value:result.experienceScore,   color:'#FFC107' },
  ];

  const sugIcon = (text) => {
    if (text.toLowerCase().includes('missing')||text.toLowerCase().includes('add')) return { cls:'sug-warn', icon:'⚠️' };
    if (text.toLowerCase().includes('excellent')||text.toLowerCase().includes('strong')) return { cls:'sug-success', icon:'✅' };
    if (text.toLowerCase().includes('low')||text.toLowerCase().includes('short')) return { cls:'sug-error', icon:'🔴' };
    return { cls:'sug-info', icon:'ℹ️' };
  };

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom:0 }}>
          <div className="page-title">✨ AI Suggestions</div>
          <div className="page-subtitle">Personalized recommendations to improve your resume</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-primary" onClick={downloadReport} disabled={downloading}>
            {downloading ? <span className="spinner" /> : '📥 Download Report'}
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/analyzer')}>↺ Re-analyze</button>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card mb-2">
            <div className="section-title">Score Breakdown</div>
            {bars.map(b => (
              <div key={b.label} className="hbar">
                <div className="hbar-label">{b.label}</div>
                <div className="hbar-track"><div className="hbar-fill" style={{ width:`${b.value}%`, background:b.color }} /></div>
                <div className="hbar-val">{b.value}%</div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:500 }}>Total ATS Score</span>
              <ATSRing score={result.atsScore} size={100} />
            </div>
          </div>
          <div className="card">
            <div className="section-title">Missing Skills to Add</div>
            {result.missingSkills?.length > 0 ? (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {result.missingSkills.map((s,i) => <span key={i} className="tag tag-red">{s}</span>)}
              </div>
            ) : (
              <div className="notification notification-success">🎉 Resume covers all required skills!</div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="section-title">Improvement Suggestions</div>
          {result.suggestions?.map((sug,i) => {
            const { cls, icon } = sugIcon(sug);
            return (
              <div key={i} className="suggestion-item">
                <div className={`sug-icon ${cls}`}>{icon}</div>
                <div className="sug-text">{sug}</div>
              </div>
            );
          })}
          <div className="divider" />
          <div className="section-title">Matched Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {result.matchedSkills?.map((s,i) => <span key={i} className="tag tag-green">{s}</span>)}
            {!result.matchedSkills?.length && <span style={{ fontSize:13, color:'var(--text3)' }}>None matched</span>}
          </div>
        </div>
      </div>
    </div>
  );
}