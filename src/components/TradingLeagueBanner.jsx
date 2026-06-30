import React, { useState } from 'react';
import { Zap, X } from 'lucide-react';

export default function TradingLeagueBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="trading-league-banner" role="banner" aria-label="Trading League promotion">
      {/* Lightning bolt icon */}
      <div style={{
        width: 32, height: 32,
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Zap size={16} fill="currentColor" color="#ffe600" />
      </div>

      {/* Text */}
      <div style={{ flex: 1, lineHeight: 1.3 }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Trading League</div>
        <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Join the competition!</div>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        aria-label="Dismiss Trading League banner"
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          borderRadius: '50%',
          width: 22, height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
      >
        <X size={11} />
      </button>
    </div>
  );
}
