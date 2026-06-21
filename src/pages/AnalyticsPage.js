import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BAR_COLORS = ['#00FFB2','#7B61FF','#FF6B6B','#FFC107','#00B4D8','#F77F00'];

export default function AnalyticsPage() {
  const [apps,    setApps]    = useState([]);
  const [resume,  setResume]  = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([
      api.get('/applications/myapplications'),
      api.get('/resume')
    ]).then(([appsRes, resumeRes]) => {
      if (appsRes.status === 'fulfilled') setApps(appsRes.value.data.data || []);
      if (resumeRes.status === 'fulfilled') setResume(resumeRes.value.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  // Calculations
  const avgScore    = apps.length ? Math.round(apps.reduce((s,a) => s+a.atsScore,0)/apps.length) : 0;
  const highest     = apps.length ? Math.max(...apps.map(a => a.atsScore)) : 0;
  const lowest      = apps.length ? Math.min(...apps.map(a => a.atsScore)) : 0;
  const accepted    = apps.filter(a => a.status==='accepted').length;
  const rejected    = apps.filter(a => a.status==='rejected').length;
  const pending     = apps.filter(a => a.status==='applied').length;
  const inReview    = apps.filter(a => a.status==='in_review').length;

  // Score distribution
  const ranges = [
    { label:'90-100', count: apps.filter(a=>a.atsScore>=90).length, color:'#00FFB2' },
    { label:'75-89',  count: apps.filter(a=>a.atsScore>=75&&a.atsScore<90).length, color:'#7B61FF' },
    { label:'50-74',  count: apps.filter(a=>a.atsScore>=50&&a.atsScore<75).length, color:'#FFC107' },
    { label:'0-49',   count: apps.filter(a=>a.atsScore<50).length, color:'#FF6B6B' },
  ];
  const maxRange = Math.max(...ranges.map(r=>r.count), 1);

  // Score over time (last 7 apps)
  const recentApps = [...apps].sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)).slice(-7);
  const maxRecent  = Math.max(...recentApps.map(a=>a.atsScore), 100);

  // Skills gap — count how many times a skill appears in missingSkills
  const missingMap = {};
  apps.forEach(a => (a.missingSkills||[]).forEach(s => { missingMap[s]=(missingMap[s]||0)+1; }));
  const topMissing = Object.entries(missingMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxMissing = Math.max(...topMissing.map(([,c])=>c), 1);

  // Status donut
  const statuses = [
    { label:'Applied',   count:pending,  color:'#7B61FF' },
    { label:'In Review', count:inReview, color:'#FFC107' },
    { label:'Accepted',  count:accepted, color:'#00FFB2' },
    { label:'Rejected',  count:rejected, color:'#FF6B6B' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-title">📊 Analytics</div>
        <div className="page-subtitle">Track your job search performance and skill gaps</div>
      </div>

      {apps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">No data yet</div>
          <div className="empty-sub">Apply to jobs to see your analytics here</div>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/jobs')}>Browse Jobs</button>
        </div>
      ) : (
        <>
          {/* Key metrics */}
          <div className="metric-grid mb-3">
            <div className="metric-card">
              <div className="metric-icon" style={{ background:'rgba(0,255,178,.1)',color:'var(--accent)' }}>📊</div>
              <div className="metric-label">Avg ATS Score</div>
              <div className="metric-value" style={{ color:'var(--accent)' }}>{avgScore}</div>
              <div className="metric-delta">across {apps.length} applications</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon" style={{ background:'rgba(123,97,255,.1)',color:'var(--accent2)' }}>🏆</div>
              <div className="metric-label">Highest Score</div>
              <div className="metric-value" style={{ color:'var(--accent2)' }}>{highest}</div>
              <div className="metric-delta">best match so far</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon" style={{ background:'rgba(0,255,178,.1)',color:'var(--accent)' }}>✅</div>
              <div className="metric-label">Accept Rate</div>
              <div className="metric-value">{apps.length ? Math.round((accepted/apps.length)*100) : 0}%</div>
              <div className="metric-delta delta-up">{accepted} accepted</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon" style={{ background:'rgba(255,193,7,.1)',color:'#FFC107' }}>👁</div>
              <div className="metric-label">In Review</div>
              <div className="metric-value">{inReview}</div>
              <div className="metric-delta">being evaluated</div>
            </div>
          </div>

          <div className="grid-2 mb-3">
            {/* Score over time */}
            <div className="card">
              <div className="section-title">ATS Score Trend</div>
              {recentApps.length > 1 ? (
                <div style={{ position:'relative', height:160, display:'flex', alignItems:'flex-end', gap:8, padding:'0 4px' }}>
                  {recentApps.map((app, i) => {
                    const h = Math.max(20, (app.atsScore / maxRecent) * 140);
                    const color = app.atsScore>=75?'#00FFB2':app.atsScore>=50?'#FFC107':'#FF6B6B';
                    return (
                      <div key={app._id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--font-head)', fontWeight:700 }}>{app.atsScore}</div>
                        <div style={{ width:'100%', height:h, background:color, borderRadius:'6px 6px 0 0', opacity:.85, transition:'height .5s ease', position:'relative' }}
                          title={`${app.job?.title} — ${app.atsScore}`} />
                        <div style={{ fontSize:10, color:'var(--text3)', textAlign:'center', lineHeight:1.2 }}>
                          {app.job?.title?.slice(0,8)}
                        </div>
                      </div>
                    );
                  })}
                  {/* Baseline */}
                  <div style={{ position:'absolute', bottom:28, left:0, right:0, height:1, background:'rgba(255,255,255,.05)' }} />
                </div>
              ) : (
                <div className="empty-state" style={{ padding:'2rem' }}>
                  <div className="empty-sub">Apply to more jobs to see score trends</div>
                </div>
              )}
            </div>

            {/* Application status */}
            <div className="card">
              <div className="section-title">Application Status</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {statuses.map(s => (
                  <div key={s.label}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:13, color:'var(--text2)' }}>{s.label}</span>
                      <span style={{ fontFamily:'var(--font-head)', fontWeight:700, color:s.color }}>{s.count}</span>
                    </div>
                    <div style={{ height:8, background:'rgba(255,255,255,.05)', borderRadius:8, overflow:'hidden' }}>
                      <div style={{ height:'100%', background:s.color, borderRadius:8, width:`${apps.length?Math.round((s.count/apps.length)*100):0}%`, transition:'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'var(--text3)' }}>Total applications</span>
                <span style={{ fontFamily:'var(--font-head)', fontWeight:700, color:'var(--text)' }}>{apps.length}</span>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Score distribution */}
            <div className="card">
              <div className="section-title">Score Distribution</div>
              {ranges.map(r => (
                <div key={r.label} className="hbar">
                  <div className="hbar-label">{r.label}</div>
                  <div className="hbar-track">
                    <div className="hbar-fill" style={{ width:`${(r.count/maxRange)*100}%`, background:r.color }} />
                  </div>
                  <div className="hbar-val">{r.count}</div>
                </div>
              ))}
              <div className="divider" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div style={{ textAlign:'center', padding:10, background:'var(--bg3)', borderRadius:8 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:700, color:'var(--accent)' }}>{highest}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>Highest</div>
                </div>
                <div style={{ textAlign:'center', padding:10, background:'var(--bg3)', borderRadius:8 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:700, color:'var(--accent3)' }}>{lowest}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>Lowest</div>
                </div>
              </div>
            </div>

            {/* Skill gaps */}
            <div className="card">
              <div className="section-title">Top Missing Skills</div>
              {topMissing.length > 0 ? (
                <>
                  {topMissing.map(([skill, count], i) => (
                    <div key={skill} className="hbar">
                      <div className="hbar-label" style={{ textTransform:'capitalize' }}>{skill}</div>
                      <div className="hbar-track">
                        <div className="hbar-fill" style={{ width:`${(count/maxMissing)*100}%`, background:BAR_COLORS[i%BAR_COLORS.length] }} />
                      </div>
                      <div className="hbar-val">{count}x</div>
                    </div>
                  ))}
                  <div className="divider" />
                  <div style={{ fontSize:13, color:'var(--text3)', lineHeight:1.6 }}>
                    💡 These skills appear most often in jobs you applied for but are missing from your resume. Add them to increase your ATS scores.
                  </div>
                </>
              ) : (
                <div className="empty-state" style={{ padding:'2rem' }}>
                  <div className="empty-sub">No skill gaps detected yet</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
