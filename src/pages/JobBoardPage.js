import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function JobBoardPage() {
  const [allJobs,  setAllJobs]  = useState([]);
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [scoring,  setScoring]  = useState(false);
  const [applying, setApplying] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locFilter,  setLocFilter]  = useState('');
  const [minScore,   setMinScore]   = useState(0);
  const [salaryMin,  setSalaryMin]  = useState('');
  const [sortBy,     setSortBy]     = useState('newest');
  const [showFilters,setShowFilters]= useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs');
      const data = res.data.data || [];
      setAllJobs(data); setJobs(data);
      fetchScores(data);
    } catch (_) {}
    setLoading(false);
  };

  const fetchScores = async (jobList) => {
    setScoring(true);
    try {
      const res = await api.get('/analyzer/jobboard');
      const scoreMap = {};
      res.data.data.forEach(j => { scoreMap[j.jobId] = j; });
      const updated = jobList.map(j => ({
        ...j, atsScore: scoreMap[j._id]?.atsScore,
        matchedSkills: scoreMap[j._id]?.matchedSkills || [],
        missingSkills: scoreMap[j._id]?.missingSkills || []
      }));
      setAllJobs(updated); setJobs(updated);
    } catch (_) {}
    setScoring(false);
  };

  useEffect(() => {
    let f = [...allJobs];
    if (search) f = f.filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter === 'remote')     f = f.filter(j => j.location?.toLowerCase().includes('remote'));
    else if (typeFilter === 'fulltime')   f = f.filter(j => j.type === 'full-time');
    else if (typeFilter === 'contract')   f = f.filter(j => j.type === 'contract');
    else if (typeFilter === 'internship') f = f.filter(j => j.type === 'internship');
    if (locFilter)  f = f.filter(j => j.location?.toLowerCase().includes(locFilter.toLowerCase()));
    if (minScore > 0) f = f.filter(j => (j.atsScore || 0) >= minScore);
    if (salaryMin)  f = f.filter(j => !j.salaryMin || j.salaryMin >= parseInt(salaryMin));
    if (sortBy === 'score')  f.sort((a,b) => (b.atsScore||0) - (a.atsScore||0));
    if (sortBy === 'salary') f.sort((a,b) => (b.salaryMax||0) - (a.salaryMax||0));
    if (sortBy === 'newest') f.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    setJobs(f);
  }, [search, typeFilter, locFilter, minScore, salaryMin, sortBy, allJobs]);

  const applyForJob = async (jobId) => {
    setApplying(true);
    try {
      const res = await api.post(`/applications/${jobId}`);
      showToast(`Applied! ATS Score: ${res.data.data.atsScore}`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed';
      if (msg.includes('resume')) { showToast('Upload resume first!', 'error'); navigate('/resume'); }
      else showToast(msg, 'error');
    } finally { setApplying(false); }
  };

  const clearFilters = () => { setSearch(''); setTypeFilter('all'); setLocFilter(''); setMinScore(0); setSalaryMin(''); setSortBy('newest'); };
  const scoreClass = (s) => !s ? 'score-mid' : s >= 75 ? 'score-high' : s >= 50 ? 'score-mid' : 'score-low';
  const activeFilters = [typeFilter !== 'all', locFilter, minScore > 0, salaryMin, sortBy !== 'newest'].filter(Boolean).length;

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">Job Board</div>
          <div className="page-subtitle">{scoring ? '⚡ Calculating scores...' : `${jobs.length} of ${allJobs.length} jobs`}</div>
        </div>
        <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)}>
          🔍 Filters {activeFilters > 0 && <span style={{ background:'var(--accent)',color:'var(--bg)',borderRadius:'50%',width:18,height:18,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,marginLeft:4 }}>{activeFilters}</span>}
        </button>
      </div>

      <div className="search-row">
        <div className="search-box">
          <span style={{ color: 'var(--text3)' }}>🔍</span>
          <input placeholder="Search by title, company or keyword..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <span style={{ cursor:'pointer',color:'var(--text3)' }} onClick={() => setSearch('')}>✕</span>}
        </div>
        <select className="form-select" style={{ width:'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="score">Best ATS match</option>
          <option value="salary">Highest salary</option>
        </select>
      </div>

      <div style={{ display:'flex',gap:8,marginBottom:'1rem',flexWrap:'wrap' }}>
        {[['all','All Jobs'],['remote','🌍 Remote'],['fulltime','Full-time'],['contract','Contract'],['internship','Internship']].map(([val,label]) => (
          <button key={val} className={`chip ${typeFilter===val?'active':''}`} onClick={() => setTypeFilter(val)}>{label}</button>
        ))}
      </div>

      {showFilters && (
        <div className="card mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="section-title" style={{ marginBottom:0 }}>Advanced Filters</div>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear all</button>
          </div>
          <div className="grid-3" style={{ gap:'1rem' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="e.g. New York, Remote..." value={locFilter} onChange={e => setLocFilter(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Min ATS Score: <strong style={{ color:'var(--accent)' }}>{minScore}%</strong></label>
              <input type="range" min="0" max="90" step="10" value={minScore} onChange={e => setMinScore(parseInt(e.target.value))} style={{ width:'100%',accentColor:'var(--accent)',marginTop:8 }} />
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Min Salary</label>
              <select className="form-select" value={salaryMin} onChange={e => setSalaryMin(e.target.value)}>
                <option value="">Any salary</option>
                <option value="40000">$40k+</option>
                <option value="60000">$60k+</option>
                <option value="80000">$80k+</option>
                <option value="100000">$100k+</option>
                <option value="120000">$120k+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No jobs match your filters</div>
          <div className="empty-sub">Try adjusting your search or clearing filters</div>
          <button className="btn btn-secondary mt-2" onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <div style={{ display:'grid',gap:12 }}>
          {jobs.map(job => (
            <div key={job._id} className={`job-card ${selected?._id===job._id?'selected':''}`} onClick={() => setSelected(job)}>
              <div className="flex items-center justify-between mb-1">
                <div className="job-title-text">{job.title}</div>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  {scoring ? <span style={{ fontSize:12,color:'var(--text3)' }}>Calculating...</span>
                    : job.atsScore !== undefined ? <span className={`score-pill ${scoreClass(job.atsScore)}`}>{job.atsScore}% match</span> : null}
                  {job.salaryMin && <span className="tag tag-gray">${Math.round(job.salaryMin/1000)}k–${Math.round((job.salaryMax||job.salaryMin)/1000)}k</span>}
                </div>
              </div>
              <div className="job-meta">
                <span>🏢 {job.company}</span><span>📍 {job.location}</span><span>⏱ {job.type}</span>
                {job.experienceRequired > 0 && <span>🎓 {job.experienceRequired}+ yrs</span>}
                <span>🗓 {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              {job.requiredSkills?.length > 0 && (
                <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginTop:10 }}>
                  {job.requiredSkills.slice(0,6).map((s,i) => (
                    <span key={i} className={`tag ${job.matchedSkills?.includes(s.toLowerCase())?'tag-green':'tag-red'}`}>{s}</span>
                  ))}
                  {job.requiredSkills.length > 6 && <span className="tag tag-gray">+{job.requiredSkills.length-6} more</span>}
                </div>
              )}
              {job.atsScore !== undefined && (
                <div style={{ marginTop:12,display:'flex',alignItems:'center',gap:10 }}>
                  <span style={{ fontSize:12,color:'var(--text3)',width:70,flexShrink:0 }}>ATS Match</span>
                  <div style={{ flex:1,height:4,background:'rgba(255,255,255,.05)',borderRadius:4,overflow:'hidden' }}>
                    <div style={{ height:'100%',borderRadius:4,width:`${job.atsScore}%`,background:job.atsScore>=75?'var(--accent)':job.atsScore>=50?'#FFC107':'var(--accent3)',transition:'width 1s ease' }} />
                  </div>
                  <span style={{ fontSize:12,fontWeight:700,fontFamily:'var(--font-head)',color:'var(--text)',width:35 }}>{job.atsScore}%</span>
                </div>
              )}
              {selected?._id===job._id && (
                <div style={{ marginTop:'1rem',display:'flex',gap:8 }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-primary btn-sm" onClick={() => applyForJob(job._id)} disabled={applying}>
                    {applying ? <span className="spinner" /> : '📤 Apply Now'}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/analyzer')}>⚡ Full Analysis</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
