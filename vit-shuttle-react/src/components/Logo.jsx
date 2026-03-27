import React from 'react';

export default function Logo({ size = 'medium', showText = true }) {
  const sizes = {
    small: { width: 24, height: 24, fontSize: '0.9rem' },
    medium: { width: 32, height: 32, fontSize: '1.1rem' },
    large: { width: 48, height: 48, fontSize: '1.4rem' },
  };

  const { width, height, fontSize } = sizes[size] || sizes.medium;

  return (
    <div className="vit-shuttle-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: 'var(--primary)' }}
      >
        {/* Bus body */}
        <rect x="2" y="8" width="20" height="10" rx="2" fill="currentColor" />
        {/* Windows */}
        <rect x="4" y="10" width="4" height="3" rx="1" fill="var(--bg)" />
        <rect x="10" y="10" width="5" height="3" rx="1" fill="var(--bg)" />
        {/* Wheels */}
        <circle cx="6" cy="18" r="2" fill="var(--secondary)" />
        <circle cx="18" cy="18" r="2" fill="var(--secondary)" />
        {/* Headlight */}
        <circle cx="20" cy="13" r="1" fill="var(--tertiary)" />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: fontSize,
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--primary), var(--tertiary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          VIT Shuttle
        </span>
      )}
    </div>
  );
}
