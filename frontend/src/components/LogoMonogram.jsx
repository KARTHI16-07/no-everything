import React from 'react';

/**
 * NO EVERYTHING Official Monogram
 * Precision-engineered geometric connection:
 * - Geometric 'N' and 'E'
 * - Connected seamlessly through the middle horizontal crossbar
 * - Extends a sleek horizontal line to the right
 * - Terminates with an editorial circular point
 */
export default function LogoMonogram({ width = 140, height = 44, className = '', showWordmark = false }) {
  return (
    <div className={`d-inline-flex align-items-center gap-2 text-decoration-none ${className}`} style={{ color: 'inherit' }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 160 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ne-monogram-svg"
      >
        {/* N: Left vertical, diagonal, right vertical */}
        <polyline
          points="10,38 10,12 36,38 36,12"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* E: Vertical spine */}
        <line
          x1="52"
          y1="12"
          x2="52"
          y2="38"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="square"
        />

        {/* E: Top arm */}
        <line
          x1="52"
          y1="12"
          x2="76"
          y2="12"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="square"
        />

        {/* E: Bottom arm */}
        <line
          x1="52"
          y1="38"
          x2="76"
          y2="38"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="square"
        />

        {/* Middle Connection: Links N's right vertical directly through E's center */}
        <line
          x1="36"
          y1="25"
          x2="76"
          y2="25"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="square"
        />

        {/* Extended thin horizontal line towards the right */}
        <line
          x1="76"
          y1="25"
          x2="138"
          y2="25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Terminating precision circular dot */}
        <circle
          cx="145"
          cy="25"
          r="3.5"
          fill="currentColor"
          className="pulse-dot"
        />
      </svg>

      {showWordmark && (
        <span
          className="font-headline fw-bold"
          style={{
            letterSpacing: '0.2em',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            color: 'currentColor',
            paddingLeft: '0.25rem',
            borderLeft: '1px solid var(--border-color)'
          }}
        >
          NO EVERYTHING
        </span>
      )}
    </div>
  );
}
