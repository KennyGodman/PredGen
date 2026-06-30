import React, { useState } from 'react';
import { TrendingUp, DollarSign, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

function formatPool(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

export default function MyBets({ bets, markets, walletBalance }) {
  const [expandedBetId, setExpandedBetId] = useState(null);

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
          { icon: DollarSign, label: 'WALLET BALANCE', value: `${walletBalance.toLocaleString()} GEN`, color: 'var(--accent-cyan)' },
          { icon: Activity, label: 'TOTAL WAGERED', value: `${totalInvested.toLocaleString()} GEN`, color: 'var(--accent-pink)' },
          { icon: Clock, label: 'OPEN POSITIONS', value: openBets.length.toString(), color: 'var(--accent-gold)' },
          { icon: TrendingUp, label: 'TOTAL P&L', value: `${pnl >= 0 ? '+' : ''}${pnl.toFixed(0)} GEN`, color: pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-pink)' },
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
              const isExpanded = expandedBetId === bet.id;
              
              // Helper to round/format decimals nicely
              const formatDecimal = (val) => parseFloat(val) % 1 === 0 ? parseFloat(val).toFixed(0) : parseFloat(val).toFixed(2);
              const potentialProfit = parseFloat(bet.payout) - bet.amount;

              return (
                <div 
                  key={bet.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '0', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderColor: isExpanded ? 'rgba(0,242,254,0.3)' : 'var(--border-0)',
                  }}
                  onClick={() => setExpandedBetId(isExpanded ? null : bet.id)}
                >
                  {/* Summary Header row */}
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
                          {bet.amount} GEN
                        </div>
                        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent-gold)' }}>
                          → {formatDecimal(bet.payout)} GEN payout
                        </div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-cyan)', padding: '0.2rem 0.5rem', background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)', borderRadius: '4px' }}>
                        {market?.status === 'resolving' ? 'RESOLVING' : 'OPEN'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div 
                      style={{ 
                        background: 'rgba(13,27,75,0.02)', 
                        borderTop: '1px solid var(--border-0)', 
                        padding: '1rem 1.25rem',
                        animation: 'fadeIn 0.15s ease',
                      }}
                      onClick={e => e.stopPropagation()} // Prevent collapse when clicking details
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Position Size</div>
                          <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{bet.amount} GEN</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Potential Payout</div>
                          <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{formatDecimal(bet.payout)} GEN</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Amount to be Won</div>
                          <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-green)' }}>+{formatDecimal(potentialProfit)} GEN</div>
                        </div>
                        {market && (
                          <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Implied Probability</div>
                            <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                              {Math.round((bet.side === 'YES' ? market.yesProb : (1 - market.yesProb)) * 100)}%
                            </div>
                          </div>
                        )}
                      </div>

                      {market?.contractAddress && (
                        <div style={{ 
                          marginTop: '0.5rem', 
                          paddingTop: '0.5rem', 
                          borderTop: '1px dashed var(--border-0)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            ⛓️ Connected to Intelligent Contract: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)', background: 'rgba(0,242,254,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{market.contractAddress}</code>
                          </span>
                          <a 
                            href={`https://studio.genlayer.com/?import-contract=${market.contractAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 700 }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                          >
                            View in Studio IDE →
                          </a>
                        </div>
                      )}
                    </div>
                  )}
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
                      {won ? `+${(bet.payout - bet.amount).toFixed(0)} GEN` : `-${bet.amount} GEN`}
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
