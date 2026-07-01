import React, { useState } from 'react';
import { initialMarkets } from './data/markets';
import Header from './components/Header';
import MarketsPage from './components/MarketsPage';
import MarketDetailModal from './components/MarketDetailModal';
import CreateMarket from './components/CreateMarket';
import MyBets from './components/MyBets';
import Leaderboard from './components/Leaderboard';
import WalletConnectModal from './components/WalletConnectModal';
import AlertModal from './components/AlertModal';
import { switchGenLayerNetwork, getGenBalance, getDeterministicTxHash } from './services/genlayer';

const INITIAL_BALANCE = 10000;

export default function App() {
  const [activeTab, setActiveTab] = useState('markets');
  const [markets, setMarkets] = useState(initialMarkets);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [userBets, setUserBets] = useState(() => {
    const saved = localStorage.getItem('predgen_user_bets');
    return saved ? JSON.parse(saved) : [];
  });
  const [onChainBalance, setOnChainBalance] = useState(INITIAL_BALANCE);
  const [createdMarketsPool, setCreatedMarketsPool] = useState(() => {
    const saved = localStorage.getItem('predgen_created_pools');
    return saved ? parseFloat(saved) || 0 : 0;
  });
  const [headerSearch, setHeaderSearch] = useState('');

  // Computed Display Balance (OnChain balance minus active simulated positions)
  const activeBetsTotal = userBets.filter(b => b.status === 'open').reduce((sum, b) => sum + b.amount, 0);
  const walletBalance = Math.max(0, onChainBalance - activeBetsTotal - createdMarketsPool);

  // Save bets to localStorage
  React.useEffect(() => {
    localStorage.setItem('predgen_user_bets', JSON.stringify(userBets));
  }, [userBets]);
  
  // Wallet Connection States
  const [walletAddress, setWalletAddress] = useState(null); // Initialized disconnected
  const [walletName, setWalletName] = useState('');
  const [walletIcon, setWalletIcon] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [customAlert, setCustomAlert] = useState(null); // Custom Alert Modal State

  // Auto-connect and balance sync
  React.useEffect(() => {
    const autoConnect = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts[0]) {
            const rawAddr = accounts[0];
            setWalletAddress(rawAddr);
            setWalletName('MetaMask');
            setWalletIcon('🦊');
            const balance = await getGenBalance(rawAddr);
            setOnChainBalance(balance);
          }
        } catch (err) {
          console.error("Web3 auto-connect failed:", err);
        }
      }
    };
    autoConnect();
  }, []);

  // Poll balance updates
  React.useEffect(() => {
    if (!walletAddress) return;
    const interval = setInterval(async () => {
      if (walletName === 'MetaMask' || walletName === 'Coinbase Wallet' || walletName === 'Rainbow') {
        const balance = await getGenBalance(walletAddress);
        setOnChainBalance(balance);
      }
    }, 8000); // Poll every 8s

    return () => clearInterval(interval);
  }, [walletAddress, walletName]);

  const handlePlaceBet = (marketId, side, amount) => {
    if (!walletAddress) {
      setShowWalletModal(true);
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    
    // Explicit Validation Check with popup alert feedback
    if (amt > walletBalance) {
      setCustomAlert({
        title: "Insufficient Balance",
        message: `You have ${walletBalance.toFixed(2)} GEN, but you are trying to bet ${amt} GEN. Please reduce the bet size or get testnet GEN from the faucet.`,
        actionUrl: "https://testnet-faucet.genlayer.foundation",
        actionText: "Open Faucet"
      });
      return;
    }

    const market = markets.find(m => m.id === marketId);
    if (!market || market.status === 'resolved') return;

    const prob = side === 'YES' ? market.yesProb : (1 - market.yesProb);
    const payout = amt / prob;

    const betId = `bet-${Date.now()}`;
    const txHash = getDeterministicTxHash(betId);

    setUserBets(prev => [...prev, {
      id: betId,
      txHash,
      marketId,
      marketTitle: market.title,
      side,
      amount: amt,
      payout,
      placedAt: new Date().toISOString(),
      status: market.status === 'resolved' ? 'settled' : 'open',
      outcome: market.outcome || null,
    }]);

    setMarkets(prev => prev.map(m =>
      m.id === marketId
        ? { ...m, totalPool: m.totalPool + amt, betsCount: m.betsCount + 1 }
        : m
    ));

    return txHash;
  };

  const handleCreateMarket = (marketData) => {
    const newId = `m${Date.now()}`;
    const newMarket = {
      ...marketData,
      id: newId,
      yesProb: 0.5,
      volume24h: 0,
      betsCount: 0,
      status: 'open',
      outcome: null,
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      contractAddress: getDeterministicTxHash(newId).slice(0, 42),
    };
    setMarkets(prev => [newMarket, ...prev]);
    
    const poolAmt = parseFloat(marketData.totalPool) || 0;
    setCreatedMarketsPool(prev => {
      const newVal = prev + poolAmt;
      localStorage.setItem('predgen_created_pools', String(newVal));
      return newVal;
    });
    setActiveTab('markets');
  };

  const liveSelectedMarket = selectedMarket
    ? markets.find(m => m.id === selectedMarket.id) || selectedMarket
    : null;

  return (
    <>
      {/* ── Header ─────────────────────────────────────── */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletAddress={walletAddress}
        walletBalance={walletBalance}
        walletName={walletName}
        walletIcon={walletIcon}
        onConnectClick={() => setShowWalletModal(true)}
        onDisconnect={() => {
          setWalletAddress(null);
          setWalletName('');
          setWalletIcon('');
        }}
        search={headerSearch}
        onSearchChange={setHeaderSearch}
      />



      {/* ── Main content ───────────────────────────────── */}
      <main style={{ flex: 1, padding: '1.5rem 1.25rem', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'markets' && (
            <MarketsPage
              markets={markets}
              walletAddress={walletAddress}
              onConnectClick={() => setShowWalletModal(true)}
              onMarketClick={setSelectedMarket}
              onQuickBet={handlePlaceBet}
              externalSearch={headerSearch}
            />
          )}
          {activeTab === 'create' && (
            <CreateMarket onCreateMarket={handleCreateMarket} />
          )}
          {activeTab === 'my-bets' && (
            <MyBets bets={userBets} markets={markets} walletBalance={walletBalance} />
          )}
          {activeTab === 'leaderboard' && <Leaderboard />}
        </div>
      </main>

      {/* ── Footer — Fliq-style ─────────────────────────── */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        marginTop: 'auto',
      }}>
        {/* Tagline section */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1b4b 0%, #162260 100%)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
        }}>
          {/* PredGen "mascot" icon */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto 0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>🔮</div>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
            lineHeight: 1.2,
          }}>
            Predict opinions that matter to you.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://www.youtube.com/results?search_query=prediction+markets"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--r-pill)',
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              ❓ How does this work?
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--r-pill)',
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              💬 Submit Feedback
            </a>
          </div>
          
          {/* Newsletter subscription form */}
          <div style={{
            marginTop: '2rem',
            maxWidth: '420px',
            margin: '2.5rem auto 0',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '1.25rem',
            backdropFilter: 'blur(10px)',
            textAlign: 'left',
          }}>
            <h3 style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.3rem',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.02em',
            }}>
              Join the PredGen Newsletter
            </h3>
            <p style={{
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '0.75rem',
              lineHeight: 1.4,
            }}>
              Get weekly updates on the highest volume AI-resolved prediction markets.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setCustomAlert({
                  title: "Subscription Success! 🎉",
                  message: "You have successfully subscribed to the PredGen newsletter! We'll keep you updated on the highest-volume AI-resolved prediction markets.",
                });
                e.target.reset();
              }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--r-pill)',
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#ffffff',
                  color: '#0d1b4b',
                  border: 'none',
                  borderRadius: 'var(--r-pill)',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Backed by / Powered by logos */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 500, marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Powered by</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: 22, height: 22,
                background: 'linear-gradient(135deg, #110FFF 0%, #4B47FF 100%)',
                borderRadius: '5px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4L36 32H4L20 4Z" fill="white" opacity="0.9"/>
                  <path d="M20 12L30 28H10L20 12Z" fill="#110FFF" opacity="0.85"/>
                  <path d="M20 20L25 28H15L20 20Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-0)', letterSpacing: '-0.01em' }}>GenLayer</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 500, marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Trustless adjudication</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--r-pill)',
                background: 'rgba(22,163,74,0.1)',
                color: 'var(--yes-green)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(22,163,74,0.2)',
              }}>No Oracles</span>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--r-pill)',
                background: 'rgba(13,27,75,0.08)',
                color: '#0d1b4b',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(13,27,75,0.2)',
              }}>AI-Resolved</span>
            </div>
          </div>

          {/* Bottom links pushed right */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {['About', 'Terms of Use', 'Documentation', 'Contact'].map(link => (
              <a
                key={link}
                href="#"
                style={{ fontSize: '0.8rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright strip */}
        <div style={{
          borderTop: '1px solid var(--border-0)',
          padding: '0.875rem 1.25rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-3)',
        }}>
          PredGen © 2026. All rights reserved. · Powered by{' '}
          <a href="https://genlayer.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>
            GenLayer
          </a>
        </div>
      </footer>

      {/* ── Market Detail Modal ─────────────────────────── */}
      {liveSelectedMarket && (
        <MarketDetailModal
          market={liveSelectedMarket}
          walletAddress={walletAddress}
          onConnectClick={() => setShowWalletModal(true)}
          onClose={() => setSelectedMarket(null)}
          onPlaceBet={handlePlaceBet}
          onShowAlert={setCustomAlert}
        />
      )}
      {/* ── Wallet Connect Modal ─────────────────────────── */}
      {showWalletModal && (
        <WalletConnectModal
          onClose={() => setShowWalletModal(false)}
          onShowAlert={setCustomAlert}
          onConnect={async (address, name, icon) => {
            setWalletAddress(address);
            setWalletName(name);
            setWalletIcon(icon);
            
            // Fetch live balance for EVM wallets
            if (name === 'MetaMask' || name === 'Coinbase Wallet' || name === 'Rainbow') {
              await switchGenLayerNetwork();
              const balance = await getGenBalance(address);
              setOnChainBalance(balance);
            } else {
              setOnChainBalance(10000); // Standard simulated balance
            }
          }}
        />
      )}

      {/* ── Reusable Custom Alert Modal ─────────────────── */}
      {customAlert && (
        <AlertModal
          title={customAlert.title}
          message={customAlert.message}
          actionUrl={customAlert.actionUrl}
          actionText={customAlert.actionText}
          onClose={() => setCustomAlert(null)}
        />
      )}
    </>
  );
}
