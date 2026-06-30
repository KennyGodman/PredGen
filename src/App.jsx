import React, { useState } from 'react';
import { initialMarkets } from './data/markets';
import Header from './components/Header';
import MarketsPage from './components/MarketsPage';
import MarketDetailModal from './components/MarketDetailModal';
import CreateMarket from './components/CreateMarket';
import MyBets from './components/MyBets';
import Leaderboard from './components/Leaderboard';
import WalletConnectModal from './components/WalletConnectModal';
import { switchGenLayerNetwork, getGenBalance } from './services/genlayer';

const INITIAL_BALANCE = 10000;

export default function App() {
  const [activeTab, setActiveTab] = useState('markets');
  const [markets, setMarkets] = useState(initialMarkets);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [userBets, setUserBets] = useState([]);
  const [walletBalance, setWalletBalance] = useState(INITIAL_BALANCE);
  const [headerSearch, setHeaderSearch] = useState('');
  
  // Wallet Connection States
  const [walletAddress, setWalletAddress] = useState(null); // Initialized disconnected
  const [walletName, setWalletName] = useState('');
  const [walletIcon, setWalletIcon] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handlePlaceBet = (marketId, side, amount) => {
    if (!walletAddress) {
      setShowWalletModal(true);
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || amt > walletBalance) return;
    const market = markets.find(m => m.id === marketId);
    if (!market || market.status === 'resolved') return;

    const prob = side === 'YES' ? market.yesProb : (1 - market.yesProb);
    const payout = amt / prob;

    setUserBets(prev => [...prev, {
      id: `bet-${Date.now()}`,
      marketId,
      marketTitle: market.title,
      side,
      amount: amt,
      payout,
      placedAt: new Date().toISOString(),
      status: market.status === 'resolved' ? 'settled' : 'open',
      outcome: market.outcome || null,
    }]);

    setWalletBalance(prev => prev - amt);
    setMarkets(prev => prev.map(m =>
      m.id === marketId
        ? { ...m, totalPool: m.totalPool + amt, betsCount: m.betsCount + 1 }
        : m
    ));
  };

  const handleCreateMarket = (marketData) => {
    const newMarket = {
      ...marketData,
      id: `m${Date.now()}`,
      yesProb: 0.5,
      volume24h: 0,
      betsCount: 0,
      status: 'open',
      outcome: null,
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMarkets(prev => [newMarket, ...prev]);
    setWalletBalance(prev => prev - (parseFloat(marketData.totalPool) || 0));
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
        />
      )}
      {/* ── Wallet Connect Modal ─────────────────────────── */}
      {showWalletModal && (
        <WalletConnectModal
          onClose={() => setShowWalletModal(false)}
          onConnect={async (address, name, icon) => {
            setWalletAddress(address);
            setWalletName(name);
            setWalletIcon(icon);
            
            // Fetch live balance for EVM wallets
            if (name === 'MetaMask' || name === 'Coinbase Wallet' || name === 'Rainbow') {
              await switchGenLayerNetwork();
              const balance = await getGenBalance(address);
              setWalletBalance(balance);
            } else {
              setWalletBalance(10000); // Standard simulated balance
            }
          }}
        />
      )}
    </>
  );
}
