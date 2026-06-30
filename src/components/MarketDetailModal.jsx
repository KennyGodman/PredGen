import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Code, Clock, Users, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { CATEGORY_COLORS } from '../data/markets';
import { getContractState, sendResolveTransaction } from '../services/genlayer';

function formatPool(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

const MOCK_ACTIVITY = [
  { user: '0x3f4a...b82c', side: 'YES', amount: 500, ago: '2m ago' },
  { user: '0x9c2b...a41f', side: 'NO', amount: 1200, ago: '7m ago' },
  { user: '0x1d8e...c93a', side: 'YES', amount: 300, ago: '15m ago' },
  { user: '0x7a3f...d51b', side: 'NO', amount: 750, ago: '28m ago' },
  { user: '0x2e9c...f84d', side: 'YES', amount: 2000, ago: '1h ago' },
];

export default function MarketDetailModal({ market, walletAddress, onConnectClick, onClose, onPlaceBet, onShowAlert }) {
  const [side, setSide] = useState('YES');
  const [amount, setAmount] = useState(100);
  const [showCode, setShowCode] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);

  const [isResolvingLive, setIsResolvingLive] = useState(false);
  const [resolvingTx, setResolvingTx] = useState('');

  // Fetch actual contract state on mount if it's deployed
  useEffect(() => {
    if (!market.contractAddress) return;
    const checkState = async () => {
      const state = await getContractState(market.contractAddress);
      if (state && state.has_resolved) {
        market.status = 'resolved';
        market.outcome = state.winner === 1 ? 'YES' : 'NO';
      }
    };
    checkState();
  }, [market]);

  const handleTriggerResolve = async () => {
    if (!walletAddress) {
      onConnectClick();
      onClose();
      return;
    }
    try {
      setIsResolvingLive(true);
      const txHash = await sendResolveTransaction(market.contractAddress, walletAddress);
      setResolvingTx(txHash);
      
      // Check back after 5 seconds to verify if consensus resolved it
      setTimeout(async () => {
        const state = await getContractState(market.contractAddress);
        if (state && state.has_resolved) {
          market.status = 'resolved';
          market.outcome = state.winner === 1 ? 'YES' : 'NO';
        }
        setIsResolvingLive(false);
      }, 5000);
    } catch (err) {
      setIsResolvingLive(false);
      if (onShowAlert) {
        onShowAlert({
          title: "Transaction Failed",
          message: err.message || "Failed to trigger resolution transaction.",
        });
      }
    }
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const yesProb = market.yesProb;
  const noProb = 1 - yesProb;
  const selectedProb = side === 'YES' ? yesProb : noProb;
  const estimatedPayout = amount > 0 ? (amount / selectedProb).toFixed(2) : '0.00';
  const profit = amount > 0 ? ((amount / selectedProb) - amount).toFixed(2) : '0.00';

  const catColor = CATEGORY_COLORS[market.category] || 'cyan';
  const colorMap = {
    cyan:   'var(--teal)',
    purple: '#7b5ea7',
    gold:   'var(--resolving)',
    green:  'var(--yes-green)',
    pink:   '#e11d48',
  };
  const catHex = colorMap[catColor] || 'var(--teal)';
  const catBg = {
    cyan:   'rgba(13,27,75,0.08)',
    purple: 'rgba(123,94,167,0.1)',
    gold:   'rgba(245,158,11,0.1)',
    green:  'rgba(34,197,94,0.1)',
    pink:   'rgba(220,38,38,0.08)',
  }[catColor] || 'rgba(13,27,75,0.08)';
  const catBorder = {
    cyan:   'rgba(13,27,75,0.2)',
    purple: 'rgba(123,94,167,0.25)',
    gold:   'rgba(245,158,11,0.25)',
    green:  'rgba(34,197,94,0.25)',
    pink:   'rgba(220,38,38,0.2)',
  }[catColor] || 'rgba(13,27,75,0.2)';

  const handleBet = () => {
    if (amount <= 0) return;
    onPlaceBet(market.id, side, parseFloat(amount));
    setBetPlaced(true);
    setTimeout(() => setBetPlaced(false), 3000);
  };

  return (
    <div
      id="market-detail-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(6, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        id="market-detail-panel"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.1)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.67rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--r-pill)',
                background: catBg,
                color: catHex,
                border: `1px solid ${catBorder}`,
              }}>
                {market.category}
              </span>
              {market.status === 'resolving' && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: 'var(--resolving)',
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                }}>
                  <Zap size={10} />AI Resolving...
                </span>
              )}
              {market.status === 'resolved' && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: market.outcome === 'YES' ? 'var(--yes-green)' : 'var(--no-red)',
                }}>
                  ✓ Resolved {market.outcome}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)' }}>
              {market.title}
            </h2>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            style={{
              background: 'var(--bg-3)',
              border: '1px solid var(--border-1)',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-0)'; e.currentTarget.style.borderColor = 'var(--border-2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-1)'; }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>

            {/* Description */}
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: catHex, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                // DESCRIPTION
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {market.description}
              </p>
            </div>

            {/* Probability Visualization */}
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border-0)',
              borderRadius: '12px',
              padding: '1.25rem',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.625rem', fontWeight: 500 }}>
                Current Odds
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  flex: yesProb,
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: 'var(--r-md)',
                  padding: '0.75rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--yes-green)', letterSpacing: '-0.02em' }}>
                    {Math.round(yesProb * 100)}%
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--yes-green)', marginTop: '0.2rem', opacity: 0.8 }}>Yes</div>
                </div>
                <div style={{
                  flex: noProb,
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.25)',
                  borderRadius: 'var(--r-md)',
                  padding: '0.75rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--no-red)', letterSpacing: '-0.02em' }}>
                    {Math.round(noProb * 100)}%
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--no-red)', marginTop: '0.2rem', opacity: 0.8 }}>No</div>
                </div>
              </div>
              {/* Bar */}
              <div style={{ height: '8px', borderRadius: '5px', background: '#f1f5f9', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${yesProb * 100}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)' }} />
                <div style={{ flex: 1, background: '#e2e8f0' }} />
              </div>

              {/* Market Stats */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                {[
                  { icon: TrendingUp, label: 'Pool', val: formatPool(market.totalPool) },
                  { icon: Users, label: 'Positions', val: market.betsCount.toLocaleString() },
                  { icon: Clock, label: 'Resolves', val: market.resolveDate },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon size={12} color="var(--text-muted)" />
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GenLayer AI Resolution Panel */}
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border-1)',
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
            }}>
              <button
                id="toggle-ai-resolution"
                onClick={() => setShowCode(!showCode)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1.25rem',
                  background: 'rgba(13,27,75,0.05)',
                  border: 'none',
                  borderBottom: showCode ? '1px solid rgba(13,27,75,0.15)' : 'none',
                  cursor: 'pointer',
                  color: 'var(--teal)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Code size={14} color="var(--teal)" />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600 }}>
                    GenLayer Intelligent Contract
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <a
                    href={market.resolutionSource}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ color: 'var(--text-3)', display: 'flex' }}
                  >
                    <ExternalLink size={12} />
                  </a>
                  <ChevronDown size={14} color="var(--text-3)" style={{ transform: showCode ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>
              {showCode && (
                <div>
                  <div style={{
                    padding: '0.5rem 1.25rem',
                    background: 'var(--bg-3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--text-2)',
                    borderBottom: '1px solid var(--border-0)',
                  }}>
                    Source: <a href={market.resolutionSource} target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', textDecoration: 'none' }}>{market.resolutionSource}</a>
                  </div>
                  {market.contractAddress && (
                    <div style={{
                      padding: '0.5rem 1.25rem',
                      background: 'var(--bg-4)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--text-0)',
                      borderBottom: '1px solid var(--border-0)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <span>Deployed Contract:</span>
                      <a 
                        href={`https://studio.genlayer.com/?import-contract=${market.contractAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}
                      >
                        {market.contractAddress}
                      </a>
                    </div>
                  )}
                  <pre style={{
                    padding: '1.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-1)',
                    lineHeight: 1.7,
                    overflowX: 'auto',
                    borderTop: '1px solid var(--border-0)',
                    background: 'var(--bg-2)',
                    margin: 0,
                  }}>
{`# GenLayer Intelligent Contract
from genlayer import IContract, call_llm, get_webpage
import json

class PredictionMarket(IContract):
    def __init__(self):
        self.resolved = False
        self.outcome = None

    def resolve(self) -> bool:
        # Fetch real-world data autonomously
${market.resolutionPrompt.split('\n').map(l => '        ' + l).join('\n')}

        # GenLayer validators reach consensus
        # via Optimistic Proof of Engagement
        self.resolved = True
        return self.outcome`}
                  </pre>
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.75rem', fontWeight: 500 }}>
                Recent Activity
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {MOCK_ACTIVITY.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.875rem',
                    background: 'var(--bg-1)',
                    border: '1px solid var(--border-0)',
                    borderRadius: 'var(--r-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                  }}>
                    <span style={{ color: 'var(--text-3)' }}>{a.user}</span>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--r-pill)',
                      fontWeight: 600,
                      fontSize: '0.68rem',
                      background: a.side === 'YES' ? 'rgba(34,197,94,0.1)' : 'rgba(244,63,94,0.1)',
                      color: a.side === 'YES' ? 'var(--yes-green)' : 'var(--no-red)',
                      border: `1px solid ${a.side === 'YES' ? 'rgba(34,197,94,0.25)' : 'rgba(244,63,94,0.25)'}`,
                    }}>
                      {a.side}
                    </span>
                    <span style={{ color: 'var(--text-0)', fontWeight: 600 }}>{a.amount} GEN</span>
                    <span style={{ color: 'var(--text-3)', fontSize: '0.7rem' }}>{a.ago}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Bet Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border-0)',
              borderRadius: '12px',
              padding: '1.25rem',
              position: 'sticky',
              top: '80px',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '1rem', fontWeight: 500 }}>
                Place Your Bet
              </div>

              {market.status === 'resolved' ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                    {market.outcome === 'YES' ? '✅' : '❌'}
                  </div>
                  Market Resolved: <span style={{ color: market.outcome === 'YES' ? 'var(--accent-green)' : 'var(--accent-pink)', fontWeight: 700 }}>
                    {market.outcome}
                  </span>
                  <br /><br />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Winning bets have been paid out.
                  </span>
                </div>
              ) : (
                <>
                  {/* AI Resolution Trigger Section */}
                  {market.contractAddress && (
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(13,27,75,0.04)',
                      border: '1px solid rgba(13,27,75,0.12)',
                      borderRadius: '12px',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-0)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>🤖</span> GenLayer AI Resolution Faucet
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.4 }}>
                        This market is connected to an on-chain Intelligent Contract. Triggering this calls resolve() to query validators.
                      </div>
                      
                      {resolvingTx ? (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--teal)', wordBreak: 'break-all' }}>
                          Sent TX: {resolvingTx}
                        </div>
                      ) : (
                        <button
                          onClick={handleTriggerResolve}
                          disabled={isResolvingLive}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#0d1b4b',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: isResolvingLive ? 'not-allowed' : 'pointer',
                            opacity: isResolvingLive ? 0.7 : 1,
                          }}
                        >
                          {isResolvingLive ? 'Resolving via GenVM Validators...' : '⚡ Trigger AI Consensus Resolution'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* YES/NO Toggle */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {['YES', 'NO'].map(s => (
                      <button
                        key={s}
                        id={`detail-bet-${s.toLowerCase()}`}
                        onClick={() => setSide(s)}
                        style={{
                          flex: 1,
                          padding: '0.875rem',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          borderRadius: 'var(--r-md)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          ...(side === s && s === 'YES' ? {
                            background: 'rgba(34,197,94,0.18)',
                            color: 'var(--yes-green)',
                            border: '2px solid rgba(34,197,94,0.5)',
                            boxShadow: '0 0 16px rgba(34,197,94,0.15)',
                          } : side === s && s === 'NO' ? {
                            background: 'rgba(244,63,94,0.18)',
                            color: 'var(--no-red)',
                            border: '2px solid rgba(244,63,94,0.5)',
                            boxShadow: '0 0 16px rgba(244,63,94,0.15)',
                          } : {
                            background: 'transparent',
                            color: 'var(--text-2)',
                            border: '1px solid var(--border-1)',
                          }),
                        }}
                      >
                        {s}
                        <div style={{ fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                          {s === 'YES' ? `${Math.round(yesProb * 100)}%` : `${Math.round(noProb * 100)}%`}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Amount Input */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
                      AMOUNT (GEN TOKENS)
                    </label>
                    <input
                      id="bet-amount-input"
                      type="number"
                      min="1"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="cyber-input"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', textAlign: 'center', fontWeight: 700 }}
                    />
                    <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem' }}>
                      {[50, 100, 500, 1000].map(v => (
                        <button
                          key={v}
                          onClick={() => setAmount(v)}
                          style={{
                            flex: 1,
                            padding: '0.3rem',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            background: 'var(--bg-2)',
                            border: '1px solid var(--border-0)',
                            borderRadius: 'var(--r-sm)',
                            cursor: 'pointer',
                            color: 'var(--text-3)',
                            transition: 'all 0.15s ease',
                            outline: 'none',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.borderColor = 'rgba(13,27,75,0.35)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border-0)'; }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payout Preview */}
                  <div style={{
                    background: 'var(--bg-1)',
                    border: '1px solid var(--border-0)',
                    borderRadius: 'var(--r-md)',
                    padding: '0.875rem',
                    marginBottom: '1rem',
                  }}>
                    {[
                      { label: 'Your bet', val: `${amount} GEN`, color: 'var(--text-0)' },
                      { label: 'If correct, payout', val: `${estimatedPayout} GEN`, color: 'var(--yes-green)' },
                      { label: 'Potential profit', val: `+${profit} GEN`, color: 'var(--resolving)' },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-3)' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Place Bet Button */}
                  {betPlaced ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '0.875rem',
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.35)',
                      borderRadius: 'var(--r-md)',
                      color: 'var(--yes-green)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}>
                      ✓ Bet placed!
                    </div>
                  ) : !walletAddress ? (
                    <button
                      id="place-bet-btn"
                      onClick={() => {
                        onConnectClick();
                        onClose();
                      }}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        borderRadius: 'var(--r-md)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: '#0d1b4b',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 4px 16px rgba(13,27,75,0.3)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#0a1540'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0d1b4b'}
                    >
                      🔒 Connect Wallet to Bet
                    </button>
                  ) : (
                    <button
                      id="place-bet-btn"
                      onClick={handleBet}
                      disabled={!amount || amount <= 0}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        borderRadius: 'var(--r-md)',
                        cursor: amount > 0 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        background: side === 'YES'
                          ? 'rgba(34,197,94,0.18)'
                          : 'rgba(244,63,94,0.18)',
                        color: side === 'YES' ? 'var(--yes-green)' : 'var(--no-red)',
                        border: side === 'YES' ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(244,63,94,0.45)',
                        opacity: amount > 0 ? 1 : 0.5,
                      }}
                    >
                      Place {side} Bet — {amount} GEN
                    </button>
                  )}

                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.5 }}>
                    Resolved by GenLayer Intelligent Contract. Results are final and autonomous.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
