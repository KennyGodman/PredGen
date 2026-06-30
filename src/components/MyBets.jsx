import React from 'react';
import { TrendingUp, DollarSign, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

function formatPool(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

export default function MyBets({ bets, markets, walletBalance }) {
  const totalInvested = bets.reduce((s, b) => s + b.amount, 0);
  const openBets = bets.filter(b => b.status === 'open');
  const settledBets = bets.filter(b => b.status === 'settled');

  const totalPayout = settledBets.reduce((s, b) => {
    const market = markets.find(m => m.id === b.marketId);
    if (market?.outcome === b.side) return s + b.payout;
    return s;
  }, 0);

  const pnl = totalPayout - settledBets.reduce((s, b) => s + b.amount, 0);

  if (bets.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="font-mono" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
          // MY PORTFOLIO
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', marginBottom: '2rem' }}>
          MY BETS
        </h1>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <Activity size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
          <p className="font-display" style={{ fontSize: '1rem', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            NO BETS YET
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', opacity: 0.7 }}>
            Head to Markets and place your first prediction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div className="font-mono" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
          // MY PORTFOLIO
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
          MY BETS
        </h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { icon: DollarSign, label: 'WALLET BALANCE', value: `${walletBalance.toLocaleString()} GL`, color: 'var(--accent-cyan)' },
          { icon: Activity, label: 'TOTAL WAGERED', value: `${totalInvested.toLocaleString()} GL`, color: 'var(--accent-pink)' },
          { icon: Clock, label: 'OPEN POSITIONS', value: openBets.length.toString(), color: 'var(--accent-gold)' },
          { icon: TrendingUp, label: 'TOTAL P&L', value: `${pnl >= 0 ? '+' : ''}${pnl.toFixed(0)} GL`, color: pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-pink)' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '1rem', border: `1px solid ${color}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon size={14} color={color} />
              <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{label}</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Open Bets */}
      {openBets.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span className="font-display" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--accent-green)', fontWeight: 700 }}>
              OPEN POSITIONS ({openBets.length})
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(57,255,20,0.3), transparent)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {openBets.map(bet => {
              const market = markets.find(m => m.id === bet.marketId);
              return (
                <div key={bet.id} className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      {bet.marketTitle}
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {new Date(bet.placedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0 }}>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      background: bet.side === 'YES' ? 'rgba(57,255,20,0.12)' : 'rgba(255,0,127,0.12)',
                      color: bet.side === 'YES' ? 'var(--accent-green)' : 'var(--accent-pink)',
                      border: `1px solid ${bet.side === 'YES' ? 'rgba(57,255,20,0.3)' : 'rgba(255,0,127,0.3)'}`,
                    }}>
                      {bet.side}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {bet.amount} GL
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent-gold)' }}>
                        → {parseFloat(bet.payout).toFixed(0)} GL payout
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-cyan)', padding: '0.2rem 0.5rem', background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)', borderRadius: '4px' }}>
                      {market?.status === 'resolving' ? 'RESOLVING' : 'OPEN'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settled Bets */}
      {settledBets.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span className="font-display" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 700 }}>
              SETTLED HISTORY ({settledBets.length})
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {settledBets.map(bet => {
              const market = markets.find(m => m.id === bet.marketId);
              const won = market?.outcome === bet.side;
              return (
                <div key={bet.id} className="glass-panel" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.75, flexWrap: 'wrap' }}>
                  <div style={{ flexShrink: 0 }}>
                    {won
                      ? <CheckCircle size={18} color="var(--accent-green)" />
                      : <XCircle size={18} color="var(--accent-pink)" />}
                  </div>
                  <div style={{ flex: 1, minWidth: '180px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {bet.marketTitle}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: bet.side === 'YES' ? 'var(--accent-green)' : 'var(--accent-pink)' }}>
                      {bet.side}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: won ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                      {won ? `+${(bet.payout - bet.amount).toFixed(0)} GL` : `-${bet.amount} GL`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
