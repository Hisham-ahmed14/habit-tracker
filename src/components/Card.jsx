import React from 'react';

export function Card({ children, style = {}, className = '', onClick }) {
  return (
    <div 
      className={className} 
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: 'var(--spacing-4)',
        boxShadow: 'var(--shadow-glow)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </div>
  );
}
