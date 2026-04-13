import React from 'react';

export function ProgressBar({ current, max, color = 'var(--accent-green)', height = '8px' }) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100)) || 0;

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--bg-progress)',
      borderRadius: 'var(--radius-full)',
      height,
      overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        backgroundColor: color,
        width: `${percentage}%`,
        borderRadius: 'var(--radius-full)',
        transition: 'width 0.5s ease-out'
      }} />
    </div>
  );
}
