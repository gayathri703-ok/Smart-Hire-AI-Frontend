import React, { useEffect, useState } from 'react';

export default function ATSRing({ score = 0, size = 150 }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 58;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (displayed / 100) * circ;
  const color  = score >= 75 ? '#00FFB2' : score >= 50 ? '#FFC107' : '#FF6B6B';

  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(score / 40);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, score);
      setDisplayed(cur);
      if (cur >= score) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="ats-ring-wrap">
      <div className="ats-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
          <circle cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s ease' }}/>
        </svg>
        <div className="ats-ring-label">
          <div className="ats-ring-num" style={{ color }}>{displayed}</div>
          <div className="ats-ring-sub">ATS Score</div>
        </div>
      </div>
    </div>
  );
}