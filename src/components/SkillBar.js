import React from 'react';

export default function SkillBar({ label, value }) {
  const colorClass = value >= 75 ? 'skill-fill-green' : value >= 50 ? 'skill-fill-yellow' : 'skill-fill-red';
  return (
    <div className="skill-bar">
      <div className="skill-bar-top">
        <span className="skill-bar-name">{label}</span>
        <span className="skill-bar-pct">{value}%</span>
      </div>
      <div className="skill-track">
        <div className={`skill-fill ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}