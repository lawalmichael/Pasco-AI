import React from 'react';

/**
 * Circular progress ring matching the screenshot's subject accuracy circles.
 * pct: 0–100
 * size: diameter in px (default 88)
 */
export default function SubjectRing({ pct = 0, size = 88, strokeWidth = 6, color = '#F5B731' }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Label */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontSize="14"
        fontWeight="700"
        fontFamily="Sora, sans-serif"
      >
        {pct}%
      </text>
    </svg>
  );
}
