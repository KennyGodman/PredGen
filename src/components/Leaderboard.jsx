import React from 'react';
import { Trophy, TrendingUp, Target, Zap } from 'lucide-react';
import { LEADERBOARD_DATA } from '../data/markets';

const BADGE_CONFIG = {
  LEGENDARY: { color: '#b45309', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', glow: 'none' },
  ELITE:     { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.25)', glow: 'none' },
  PRO:       { color: '#0891b2', bg: 'rgba(8,145,178,0.1)',   border: 'rgba(8,145,178,0.25)',  glow: 'none' },
  RISING:    { color: '#15803d', bg: 'rgba(22,163,74,0.1)',   border: 'rgba(22,163,74,0.25)',  glow: 'none' },
};

const RANK_COLORS = {
  1: '#d97706',
  2: '#64748b',
  3: '#92400e',
};

function Avatar({ username, size = 40, rank }) {
  const initials = username.slice(0, 2).toUpperCase();
  const hue = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 60) % 360}, 70%, 65%))`,
      border: `2px solid ${RANK_COLORS[rank] || 'rgba(0,0,0,0.12)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.35 + 'px',
      fontWeight: 800,
      color: '#fff',
      flexShrink: 0,
      boxShadow: rank <= 3 ? `0 2px 8px ${RANK_COLORS[rank]}40` : 'none',
    }}>
      {initials}
    </div>
  );
}

export default function Leaderboard() {
  const top3 = LEADERBOARD_DATA.slice(0, 3);
  const rest = LEADERBOARD_DATA.slice(3);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '0.5rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          // TOP PREDICTORS
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-0)', letterSpacing: '-0.02em' }}>
          Leaderboard
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          The sharpest minds on the prediction market. Rankings reset monthly.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', justifyContent: 'center' }}>
        {[top3[1], top3[0], top3[2]].map((player, i) => {
          const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
          const heights = { 1: '180px', 2: '140px', 3: '120px' };
          const badgeCfg = BADGE_CONFIG[player.badge];
          return (
            <div
              key={player.rank}
              style={{
                flex: actualRank === 1 ? 1.2 : 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              {actualRank === 1 && (
                <Trophy size={28} color="var(--accent-gold)" style={{ filter: 'drop-shadow(0 0 10px rgba(255,184,0,0.6))' }} />
              )}
              <Avatar username={player.username} size={actualRank === 1 ? 60 : 48} rank={actualRank} />
              <div style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
                  {player.username}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: RANK_COLORS[actualRank], fontWeight: 700, marginTop: '0.2rem' }}>
                  +{player.profit.toLocaleString()} GL
                </div>
                <span style={{
                  display: 'inline-block',
                  marginTop: '0.3rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  background: badgeCfg.bg,
                  color: badgeCfg.color,
                  border: `1px solid ${badgeCfg.border}`,
                  boxShadow: badgeCfg.glow,
                }}>
                  {player.badge}
                </span>
              </div>
              {/* Podium */}
              <div style={{
                width: '100%',
                height: heights[actualRank],
                background: `linear-gradient(to bottom, ${RANK_COLORS[actualRank]}20, ${RANK_COLORS[actualRank]}08)`,
                border: `1px solid ${RANK_COLORS[actualRank]}30`,
                borderBottom: 'none',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: RANK_COLORS[actualRank], opacity: 0.6 }}>
                  #{actualRank}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of Leaderboard */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <span className="font-display" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 700 }}>
            RANKINGS
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-0)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 100px 80px 60px 80px',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>
            <span>#</span><span>TRADER</span><span>PROFIT</span><span>WIN RATE</span><span>BETS</span><span>BADGE</span>
          </div>

          {LEADERBOARD_DATA.map((player, i) => {
            const badgeCfg = BADGE_CONFIG[player.badge];
            const isTop3 = player.rank <= 3;
            return (
              <div
                key={player.rank}
                id={`leaderboard-rank-${player.rank}`}
                className="glass-panel"
                style={{
                  padding: '0.875rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 100px 80px 60px 80px',
                  gap: '0.5rem',
                  alignItems: 'center',
                  border: isTop3 ? `1px solid ${RANK_COLORS[player.rank]}30` : '1px solid var(--border-0)',
                  animation: `fadeSlideIn ${0.1 + i * 0.05}s ease both`,
                }}
              >
                {/* Rank */}
                <span className="font-display" style={{ fontSize: '1rem', fontWeight: 800, color: RANK_COLORS[player.rank] || 'var(--text-muted)' }}>
                  {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
                </span>

                {/* Trader */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                  <Avatar username={player.username} size={32} rank={player.rank} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {player.username}
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                      {player.address}
                    </div>
                  </div>
                </div>

                {/* Profit */}
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                  +{player.profit.toLocaleString()}
                </div>

                {/* Win Rate */}
                <div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {Math.round(player.winRate * 100)}%
                  </div>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'var(--bg-3)', marginTop: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${player.winRate * 100}%`, background: 'var(--accent-green)', borderRadius: '2px' }} />
                  </div>
                </div>

                {/* Bets */}
                <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {player.bets}
                </div>

                {/* Badge */}
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  background: badgeCfg.bg,
                  color: badgeCfg.color,
                  border: `1px solid ${badgeCfg.border}`,
                  boxShadow: badgeCfg.glow,
                  display: 'inline-block',
                }}>
                  {player.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
