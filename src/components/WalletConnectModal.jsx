import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

const WALLET_CATEGORIES = [
  {
    title: 'EVM Wallets',
    wallets: [
      { name: 'MetaMask', icon: '🦊', address: '0x3f4a...b82c' },
      { name: 'Coinbase Wallet', icon: '🛡️', address: '0x9c2b...a41f' },
      { name: 'Rainbow', icon: '🌈', address: '0x1d8e...c93a' },
    ]
  },
  {
    title: 'Solana Wallets',
    wallets: [
      { name: 'Phantom', icon: '👻', address: 'Phan9c...a41f' },
      { name: 'Solflare', icon: '☀️', address: 'Sol1d8...c93a' },
    ]
  },
  {
    title: 'Other Wallets',
    wallets: [
      { name: 'Keplr', icon: '🌌', address: 'cosmos13f...b82c' },
      { name: 'Sui Wallet', icon: '💧', address: '0xsuia41...f82b' },
    ]
  }
];

export default function WalletConnectModal({ onClose, onConnect, onShowAlert }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const connectWallet = async (name, icon, fallbackAddress) => {
    try {
      // ── EVM connection via window.ethereum ──────────────────
      if (name === 'MetaMask' || name === 'Coinbase Wallet' || name === 'Rainbow') {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts[0]) {
            const rawAddr = accounts[0];
            onConnect(rawAddr, name, icon);
            onClose();
            return;
          }
        } else {
          if (onShowAlert) {
            onShowAlert({
              title: "Provider Extension Missing",
              message: `No injected EVM provider found. Please install the ${name} extension or use an EVM-injected browser. Connecting simulated dev account instead.`,
            });
          }
        }
      } 
      // ── Solana connection via window.solana ───────────────
      else if (name === 'Phantom' || name === 'Solflare') {
        const solanaProvider = window.solana || window.phantom?.solana;
        if (typeof window !== 'undefined' && solanaProvider) {
          const resp = await solanaProvider.connect();
          const rawAddr = resp.publicKey.toString();
          onConnect(rawAddr, name, icon);
          onClose();
          return;
        } else {
          if (onShowAlert) {
            onShowAlert({
              title: "Phantom Extension Missing",
              message: `No injected Solana provider found. Please install the ${name} browser extension. Connecting simulated dev account instead.`,
            });
          }
        }
      }
    } catch (err) {
      console.error('Wallet connect error:', err);
    }

    // Fallback if no extensions detected
    onConnect(fallbackAddress, name, icon);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(6, 7, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          animation: 'slideUp 0.25s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
              Connect a Wallet
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.15rem' }}>
              Select a wallet to predict on PredGen
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {WALLET_CATEGORIES.map(category => (
            <div key={category.title}>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}>
                {category.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {category.wallets.map(w => (
                  <button
                    key={w.name}
                    onClick={() => connectWallet(w.name, w.icon, w.address)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      color: '#111827',
                      fontSize: '0.9rem',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#0d1b4b';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,27,75,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{w.icon}</span>
                    <span>{w.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(13,27,75,0.04)',
            borderRadius: '10px',
            marginTop: '0.25rem',
          }}>
            <ShieldCheck size={16} color="#0d1b4b" />
            <span style={{ fontSize: '0.68rem', color: '#6b7280', lineHeight: 1.4 }}>
              By connecting, you agree to PredGen's terms of service and acknowledge the risks involved in decentralized prediction.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
