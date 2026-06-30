import React, { useState } from 'react';
import { Clock, Share2, Droplets, Zap } from 'lucide-react';
import { CATEGORY_COLORS } from '../data/markets';
import BetConfirmModal from './BetConfirmModal';

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Ended';
  if (days === 0) return 'Today';
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  return `${months} months`;
}

function formatPool(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

// A fake username derived from market id — mirrors fliq's "by username" pattern
function fakeCreator(marketId) {
  const names = ['CryptoWolf', 'AcePredictor', 'MarketMaker', 'StarGazer', 'BullBear', 'NightOwl', 'DataDriven'];
  const idx = marketId ? parseInt(marketId.replace(/\D/g, ''), 10) % names.length : 0;
  return names[idx] || 'CryptoWolf';
}

export default function MarketCard({ market, onDetailClick, onQuickBet }) {
  const [hovered, setHovered] = useState(false);
  const [pendingSide, setPendingSide] = useState(null); // null = modal closed
  const yesPercent = Math.round(market.yesProb * 100);

  const handleBet = (e, side) => {
    e.stopPropagation();
    setPendingSide(side);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: market.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
  };

  const creator = fakeCreator(market.id);
  const isOpen = market.status === 'open';
  const isResolving = market.status === 'resolving';
  const isResolved = market.status === 'resolved';

  return (
    <>
    <div
      id={`market-card-${market.id}`}
      className="market-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onDetailClick(market)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onDetailClick(market)}
    >
      {/* ── Header: thumbnail + title + % ─────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Thumbnail placeholder using category color */}
        <div style={{
          width: 44, height: 44,
          borderRadius: '10px',
          flexShrink: 0,
          background: `linear-gradient(135deg, ${getCatColor(market.category)} 0%, ${getCatColorDark(market.category)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          overflow: 'hidden',
        }}>
          {getCatEmoji(market.category)}
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            lineHeight: 1.4,
            color: 'var(--text-0)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {market.title}
          </div>

          {/* Status chip */}
          <div style={{ marginTop: '0.3rem' }}>
            {isResolving && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                borderRadius: 'var(--r-pill)', letterSpacing: '0.03em',
                background: 'rgba(217,119,6,0.1)', color: 'var(--resolving)',
                border: '1px solid rgba(217,119,6,0.2)',
              }}>
                <Zap size={9} fill="currentColor" /> Resolving
              </span>
            )}
            {isResolved && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                borderRadius: 'var(--r-pill)', background: 'var(--bg-3)', color: 'var(--text-3)',
                border: '1px solid var(--border-0)',
              }}>
                {market.outcome ? `✓ Resolved ${market.outcome}` : 'Resolved'}
              </span>
            )}
          </div>
        </div>

        {/* Probability % */}
        <div style={{
          flexShrink: 0,
          fontWeight: 700,
          fontSize: '1.2rem',
          color: yesPercent >= 50 ? 'var(--yes-green)' : 'var(--no-red)',
          fontFamily: 'var(--font-display)',
          lineHeight: 1,
          marginTop: '2px',
        }}>
          {yesPercent}%
        </div>
      </div>

      {/* ── Multi-option list (for multi-outcome markets) or YES/NO buttons ── */}
      {isOpen || isResolving ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            id={`bet-yes-${market.id}`}
            className="yes-btn"
            onClick={e => handleBet(e, 'YES')}
          >
            Yes
          </button>
          <button
            id={`bet-no-${market.id}`}
            className="no-btn"
            onClick={e => handleBet(e, 'NO')}
          >
            No
          </button>
        </div>
      ) : isResolved ? (
        <div style={{
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--r-md)',
          background: market.outcome === 'YES' ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)',
          border: `1px solid ${market.outcome === 'YES' ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)'}`,
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: market.outcome === 'YES' ? 'var(--yes-green)' : 'var(--no-red)',
        }}>
          ✓ Resolved {market.outcome} · GenLayer AI
        </div>
      ) : null}

      {/* ── Footer: creator · time · liquidity · share ─ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        borderTop: '1px solid var(--border-0)',
        paddingTop: '0.625rem',
        fontSize: '0.72rem',
        color: 'var(--text-3)',
        fontFamily: 'var(--font-body)',
      }}>
        <span style={{ fontWeight: 500, color: 'var(--text-2)' }}>by {creator}</span>
        <span>·</span>
        <Clock size={11} strokeWidth={1.8} />
        <span>{daysUntil(market.resolveDate)}</span>
        <span>·</span>
        <Droplets size={11} strokeWidth={1.8} color="var(--teal)" />
        <span>{formatPool(market.totalPool)}</span>

        {/* Share button — pushed right */}
        <button
          onClick={handleShare}
          title="Share market"
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            padding: '0.1rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <Share2 size={13} strokeWidth={1.8} />
        </button>
      </div>
    </div>
      {pendingSide && (
        <BetConfirmModal
          market={market}
          initialSide={pendingSide}
          onClose={() => setPendingSide(null)}
          onConfirm={(id, side, amount) => {
            onQuickBet(id, side, amount);
          }}
        />
      )}
    </>
  );
}

/* ── Category color helpers ─────────────────────── */
function getCatColor(cat) {
  const map = {
    'Crypto': '#e0f2fe',
    'Sports': '#dcfce7',
    'Politics': '#fef3c7',
    'Science': '#ede9fe',
    'Entertainment': '#fce7f3',
    'Finance': '#dbeafe',
    'Technology': '#f0fdf4',
  };
  return map[cat] || '#f0f2f5';
}

function getCatColorDark(cat) {
  const map = {
    'Crypto': '#bae6fd',
    'Sports': '#bbf7d0',
    'Politics': '#fde68a',
    'Science': '#ddd6fe',
    'Entertainment': '#fbcfe8',
    'Finance': '#bfdbfe',
    'Technology': '#bbf7d0',
  };
  return map[cat] || '#e2e8f0';
}

function getCatEmoji(cat) {
  const map = {
    'Crypto': '₿',
    'Sports': '⚽',
    'Politics': '🏛️',
    'Science': '🔬',
    'Entertainment': '🎬',
    'Finance': '📈',
    'Technology': '💻',
  };
  return map[cat] || '📊';
}
