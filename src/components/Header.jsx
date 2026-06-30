import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Trophy, Activity, TrendingUp, Wallet, ChevronDown, LogOut, Copy, Check } from 'lucide-react';

function PredGenLogo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PredGen logo mark">
      <path d="M20 4L36 32H4L20 4Z" fill="#0d1b4b" opacity="0.9" />
      <path d="M20 12L30 28H10L20 12Z" fill="#ffffff" opacity="0.9" />
      <path d="M20 20L25 28H15L20 20Z" fill="#0d1b4b" opacity="0.8" />
    </svg>
  );
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  walletAddress, 
  walletBalance, 
  walletName,
  walletIcon,
  onConnectClick,
  onDisconnect,
  search, 
  onSearchChange 
}) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    if (addr.length <= 13) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const navTabs = [
    { id: 'markets',     label: 'Markets',     icon: TrendingUp },
    { id: 'my-bets',     label: 'My Bets',     icon: Activity },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const [walletOpen, setWalletOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const walletRef = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const fn = (e) => { if (walletRef.current && !walletRef.current.contains(e.target)) setWalletOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard?.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.25rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
      }}>

        {/* ── Logo ─────────────────────────────────────────── */}
        <button
          onClick={() => setActiveTab('markets')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
          aria-label="Go to markets"
        >
          <PredGenLogo size={28} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.1rem',
            letterSpacing: '-0.025em',
            color: 'var(--text-0)',
          }}>
            Pred<span style={{ color: 'var(--teal)' }}>Gen</span>
          </span>
        </button>

        {/* ── Create Market CTA ─────────────────────────────── */}
        <button
          id="create-market-btn"
          onClick={() => setActiveTab('create')}
          className="btn-cyber"
          style={{
            background: activeTab === 'create' ? 'var(--teal-dim)' : 'var(--teal)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--r-pill)',
            padding: '0.45rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(13,27,75,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Plus size={13} />
          <span className="hide-mobile">Create Market</span>
        </button>

        {/* ── Search Bar ────────────────────────────────────── */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px', margin: '0 auto' }}>
          <Search
            size={14}
            color="var(--text-3)"
            style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            id="header-search"
            type="text"
            placeholder="Search markets..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="cyber-input"
            style={{
              paddingLeft: '2.25rem',
              fontSize: '0.875rem',
              height: '36px',
              background: '#f8f9fa',
              border: '1.5px solid rgba(0,0,0,0.08)',
            }}
          />
        </div>

        {/* ── Right: Nav tabs + wallet ──────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto', flexShrink: 0 }}>
          {navTabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  borderRadius: 'var(--r-pill)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: isActive ? 'var(--teal-light)' : 'transparent',
                  color: isActive ? 'var(--teal)' : 'var(--text-2)',
                  border: isActive ? '1.5px solid rgba(13,27,75,0.3)' : '1.5px solid transparent',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-0)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; } }}
              >
                <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hide-mobile">{label}</span>
              </button>
            );
          })}

          {/* Wallet balance pill */}
          {walletAddress && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--yes-green)',
              background: 'rgba(22,163,74,0.08)',
              border: '1px solid rgba(22,163,74,0.2)',
              borderRadius: 'var(--r-pill)',
              padding: '0.3rem 0.75rem',
              flexShrink: 0,
            }}>
              {walletBalance.toLocaleString()} GEN
            </div>
          )}

          {/* ── Wallet button + dropdown ─────────────────── */}
          <div ref={walletRef} style={{ position: 'relative', flexShrink: 0 }}>
            {walletAddress ? (
              <>
                <button
                  id="wallet-connect-btn"
                  onClick={() => setWalletOpen(prev => !prev)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--r-pill)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: walletOpen ? '#0d1b4b' : 'var(--bg-2)',
                    color: walletOpen ? '#ffffff' : 'var(--text-2)',
                    border: walletOpen ? '1px solid #0d1b4b' : '1px solid var(--border-1)',
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!walletOpen) {
                      e.currentTarget.style.borderColor = '#0d1b4b';
                      e.currentTarget.style.color = '#0d1b4b';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!walletOpen) {
                      e.currentTarget.style.borderColor = 'var(--border-1)';
                      e.currentTarget.style.color = 'var(--text-2)';
                    }
                  }}
                >
                  <span style={{ fontSize: '0.9rem', marginRight: '0.1rem' }}>{walletIcon || 'Wallet'}</span>
                  <span className="hide-mobile">{formatAddress(walletAddress)}</span>
                  <ChevronDown
                    size={11}
                    style={{ transition: 'transform 0.2s', transform: walletOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {/* Dropdown */}
                {walletOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    minWidth: '220px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    animation: 'slideDown 0.18s ease',
                    zIndex: 999,
                  }}>
                    {/* Wallet info header */}
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid rgba(0,0,0,0.07)',
                      background: '#f9fafb',
                    }}>
                      <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Connected with {walletName}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: '#111827', wordBreak: 'break-all' }}>
                        {walletAddress}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--yes-green)', marginTop: '0.2rem' }}>
                        {walletBalance.toLocaleString()} GEN
                      </div>
                    </div>

                    {/* Copy address */}
                    <button
                      id="wallet-copy-address"
                      onClick={handleCopy}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-body)',
                        color: '#374151',
                        transition: 'background 0.12s',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {copied ? <Check size={14} color="var(--yes-green)" /> : <Copy size={14} color="#9ca3af" />}
                      {copied ? 'Copied!' : 'Copy address'}
                    </button>

                    {/* Disconnect */}
                    <button
                      id="wallet-disconnect-btn"
                      onClick={() => {
                        setWalletOpen(false);
                        onDisconnect();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-body)',
                        color: '#dc2626',
                        transition: 'background 0.12s',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={14} color="#dc2626" />
                      Disconnect
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                id="wallet-connect-btn"
                onClick={onConnectClick}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1.1rem',
                  borderRadius: 'var(--r-pill)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: '#0d1b4b',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(13,27,75,0.3)',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#0a1540';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,27,75,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#0d1b4b';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,27,75,0.3)';
                }}
              >
                <Wallet size={13} />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
