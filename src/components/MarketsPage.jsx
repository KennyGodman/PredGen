import React, { useState, useMemo } from 'react';
import { Filter, Share2 } from 'lucide-react';
import MarketCard from './MarketCard';
import { CATEGORIES } from '../data/markets';

const SORT_OPTIONS = [
  { value: 'volume',  label: 'Top Volume' },
  { value: 'pool',    label: 'Largest Pool' },
  { value: 'newest',  label: 'Newest' },
  { value: 'closing', label: 'Closing Soon' },
];

const STATUS_FILTERS = [
  { value: 'all',       label: 'All' },
  { value: 'open',      label: 'Open' },
  { value: 'resolving', label: 'Resolving' },
  { value: 'resolved',  label: 'Resolved' },
];



export default function MarketsPage({ markets, walletAddress, onConnectClick, onMarketClick, onQuickBet, externalSearch = '' }) {
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('volume');

  const filtered = useMemo(() => {
    let result = [...markets];
    if (externalSearch) {
      const q = externalSearch.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }
    if (category !== 'All') result = result.filter(m => m.category === category);
    if (status !== 'all') result = result.filter(m => m.status === status);

    switch (sort) {
      case 'volume':  result.sort((a, b) => b.volume24h - a.volume24h); break;
      case 'pool':    result.sort((a, b) => b.totalPool - a.totalPool); break;
      case 'newest':  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'closing': result.sort((a, b) => new Date(a.resolveDate) - new Date(b.resolveDate)); break;
    }
    return result;
  }, [markets, externalSearch, category, status, sort]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ── Category Filter Pills ───────────────────────── */}
      <div style={{ marginBottom: '0.25rem' }}>
        <div className="category-strip">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className={`cat-pill${category === cat ? ' active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>



      {/* ── Sort / Status controls ──────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', fontWeight: 500 }}>
          {filtered.length} markets
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            id="filter-status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="cyber-select"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', width: 'auto', borderRadius: 'var(--r-pill)', height: '34px' }}
          >
            {STATUS_FILTERS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select
            id="sort-markets"
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="cyber-select"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', width: 'auto', borderRadius: 'var(--r-pill)', height: '34px' }}
          >
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Markets Grid (2-column like fliq.one) ──────── */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Filter size={32} color="var(--text-3)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>No markets match your filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}
        className="markets-grid"
        >
          {filtered.map(m => (
            <MarketCard 
              key={m.id} 
              market={m} 
              walletAddress={walletAddress}
              onConnectClick={onConnectClick}
              onDetailClick={onMarketClick} 
              onQuickBet={onQuickBet} 
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .markets-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
