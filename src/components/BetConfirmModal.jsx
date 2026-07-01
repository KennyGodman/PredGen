import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, TrendingUp, ArrowRight } from 'lucide-react';

const PRESETS = [10, 50, 100, 500];

export default function BetConfirmModal({ 
  market, 
  initialSide = 'YES', 
  walletAddress,
  onConnectClick,
  onClose, 
  onConfirm 
}) {
  const [side, setSide] = useState(initialSide);
  const [amount, setAmount] = useState(50);
  const [inputVal, setInputVal] = useState('50');
  const [placed, setPlaced] = useState(false);
  const [placedTx, setPlacedTx] = useState('');
  const overlayRef = useRef(null);

  const yesProb = market.yesProb;
  const noProb  = 1 - yesProb;
  const selectedProb = side === 'YES' ? yesProb : noProb;
  const payout = amount > 0 ? (amount / selectedProb).toFixed(2) : '0.00';
  const profit = amount > 0 ? ((amount / selectedProb) - amount).toFixed(2) : '0.00';
  const multiplier = amount > 0 ? (1 / selectedProb).toFixed(2) : '0.00';

  /* ── close on Escape ─────────────────────────────────── */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  /* ── amount sync ─────────────────────────────────────── */
  const setAmt = (v) => {
    const n = Math.max(0.01, Math.min(10000, Number(v) || 0));
    setAmount(n);
    setInputVal(String(n));
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    const n = parseFloat(e.target.value);
    if (!isNaN(n) && n > 0) setAmount(Math.min(10000, n));
  };

  const handleInputBlur = () => {
    const n = parseFloat(inputVal);
    if (isNaN(n) || n <= 0) { setAmount(0.1); setInputVal('0.1'); }
    else setAmt(n);
  };

  const handleConfirm = () => {
    if (amount <= 0) return;
    const tx = onConfirm(market.id, side, amount);
    if (tx) {
      setPlacedTx(tx);
    }
    setPlaced(true);
    setTimeout(() => { 
      setPlaced(false); 
      setPlacedTx('');
      onClose(); 
    }, 4000);
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(6,7,18,0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          animation: 'slideUp 0.22s ease',
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div style={{
          padding: '1rem 1.25rem 0.875rem',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}>
          {/* Market thumbnail */}
          <div style={{
            width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>
            📊
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {market.title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              padding: '0.3rem',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '1.125rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* ── Buying label ─────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>Buying:</span>
            {/* YES / NO toggle */}
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {['YES', 'NO'].map(s => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  style={{
                    padding: '0.25rem 0.875rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: 'none',
                    ...(side === s ? {
                      background: s === 'YES' ? '#0d1b4b' : '#12062a',
                      color: '#ffffff',
                      boxShadow: `0 2px 8px ${s === 'YES' ? 'rgba(13,27,75,0.35)' : 'rgba(18,6,42,0.35)'}`,
                    } : {
                      background: '#f3f4f6',
                      color: '#6b7280',
                    }),
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>
              {Math.round(selectedProb * 100)}% chance
            </div>
          </div>

          {/* ── Amount section ────────────────────────────── */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Amount</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9ca3af' }}>GEN</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max="10000"
                  value={inputVal}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  style={{
                    width: '80px',
                    textAlign: 'right',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '0.25rem 0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#111827',
                    outline: 'none',
                    background: '#f9fafb',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#0d1b4b'}
                  onBlurCapture={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* ── Slider row ────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setAmt(Math.max(0.01, amount - 10))}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6b7280',
                  flexShrink: 0,
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#111827'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; }}
              >
                <Minus size={12} />
              </button>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={Math.min(1000, amount)}
                onChange={e => setAmt(e.target.value)}
                style={{
                  flex: 1,
                  accentColor: '#0d1b4b',
                  height: '4px',
                  cursor: 'pointer',
                }}
              />
              <button
                onClick={() => setAmt(amount + 10)}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6b7280',
                  flexShrink: 0,
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#111827'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; }}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* ── Quick preset chips ─────────────────────── */}
            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.6rem' }}>
              {PRESETS.map(v => (
                <button
                  key={v}
                  onClick={() => setAmt(v)}
                  style={{
                    flex: 1,
                    padding: '0.3rem',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                    border: amount === v ? '1.5px solid #0d1b4b' : '1.5px solid #e5e7eb',
                    background: amount === v ? '#0d1b4b' : '#f9fafb',
                    color: amount === v ? '#ffffff' : '#6b7280',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* ── Payout preview ────────────────────────────── */}
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '0.875rem 1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.2rem' }}>You put</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
                  {amount} GEN
                </div>
              </div>
              <ArrowRight size={16} color="#9ca3af" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.2rem' }}>You win</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: '#16a34a' }}>
                  {payout} GEN
                  <span style={{ fontSize: '0.68rem', color: '#16a34a', opacity: 0.75, marginLeft: '0.3rem' }}>
                    ({multiplier}x)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA ───────────────────────────────────────── */}
          {placed ? (
            <div style={{
              textAlign: 'center',
              padding: '0.875rem',
              background: 'rgba(22,163,74,0.08)',
              border: '1px solid rgba(22,163,74,0.3)',
              borderRadius: '12px',
              color: '#16a34a',
              fontWeight: 700,
              fontSize: '0.9rem',
              animation: 'fadeIn 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <div>✓ Bet placed successfully!</div>
              {placedTx && (
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', fontWeight: 500 }}>
                  TX: <a href={`https://explorer-bradbury.genlayer.com/tx/${placedTx}`} target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', textDecoration: 'underline' }}>
                    {placedTx.slice(0, 10)}...{placedTx.slice(-8)}
                  </a>
                </div>
              )}
            </div>
          ) : !walletAddress ? (
            <button
              id="confirm-bet-btn"
              onClick={() => {
                onConnectClick();
                onClose();
              }}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                background: '#0d1b4b',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 16px rgba(13,27,75,0.35)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#0a1540'}
              onMouseLeave={e => e.currentTarget.style.background = '#0d1b4b'}
            >
              🔒 Connect Wallet to Bet
            </button>
          ) : (
            <button
              id="confirm-bet-btn"
              onClick={handleConfirm}
              disabled={amount <= 0}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: '12px',
                cursor: amount > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.18s ease',
                background: amount > 0
                  ? (side === 'YES' ? '#0d1b4b' : '#12062a')
                  : '#e5e7eb',
                color: amount > 0 ? '#ffffff' : '#9ca3af',
                border: 'none',
                boxShadow: amount > 0
                  ? `0 4px 16px ${side === 'YES' ? 'rgba(13,27,75,0.35)' : 'rgba(18,6,42,0.35)'}`
                  : 'none',
                opacity: amount > 0 ? 1 : 0.7,
              }}
              onMouseEnter={e => {
                if (amount > 0) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${side === 'YES' ? 'rgba(13,27,75,0.45)' : 'rgba(18,6,42,0.45)'}`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = amount > 0
                  ? `0 4px 16px ${side === 'YES' ? 'rgba(13,27,75,0.35)' : 'rgba(18,6,42,0.35)'}`
                  : 'none';
              }}
            >
              {side === 'YES' ? '📈' : '📉'} Place {side} Bet — {amount} GEN
            </button>
          )}

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: '#9ca3af',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Resolved autonomously by GenLayer Intelligent Contract.
          </p>
        </div>
      </div>
    </div>
  );
}
