import React, { useState } from 'react';
import { Plus, Calendar, Link, AlignLeft, Tag, DollarSign, Eye } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS } from '../data/markets';

const RESOLUTION_TEMPLATES = [
  {
    label: 'Price Target',
    title: 'Will [ASSET] exceed $[PRICE] before [DATE]?',
    description: 'Resolves YES if the [ASSET] spot price on a top-5 exchange reaches or exceeds $[PRICE] at any point before [DATE].',
    prompt: `web_result = get_webpage("https://api.coingecko.com/api/v3/simple/price?ids=[coin_id]&vs_currencies=usd")
price = json.loads(web_result)["[coin_id]"]["usd"]
return price >= [TARGET_PRICE]`,
    source: 'https://api.coingecko.com',
  },
  {
    label: 'News Event',
    title: 'Will [EVENT] happen before [DATE]?',
    description: 'Resolves YES if [EVENT] occurs and is confirmed by at least two major news sources before [DATE].',
    prompt: `web_result = get_webpage("[NEWS_SOURCE_URL]")
return call_llm(
    f"Based on: {web_result}\\nDid [EVENT] happen? Answer YES or NO only."
) == "YES"`,
    source: 'https://reuters.com',
  },
  {
    label: 'Sports Result',
    title: 'Will [TEAM/PLAYER] win [COMPETITION] in [YEAR]?',
    description: 'Resolves YES if [TEAM/PLAYER] wins the [COMPETITION] as confirmed by the official governing body.',
    prompt: `web_result = get_webpage("[OFFICIAL_SITE]")
winner = call_llm(f"Based on: {web_result}\\nWho won [COMPETITION]? Provide name only.")
return winner == "[TEAM/PLAYER]"`,
    source: 'https://fifa.com',
  },
];

export default function CreateMarket({ onCreateMarket }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    resolveDate: '',
    resolutionPrompt: '',
    resolutionSource: '',
    totalPool: 1000,
    featured: false,
  });
  const [templateIdx, setTemplateIdx] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const applyTemplate = (idx) => {
    const t = RESOLUTION_TEMPLATES[idx];
    setTemplateIdx(idx);
    update('resolutionPrompt', t.prompt);
    update('resolutionSource', t.source);
    if (!form.title) update('title', t.title);
    if (!form.description) update('description', t.description);
  };

  const handleSubmit = () => {
    if (!form.title || !form.resolveDate) return;
    onCreateMarket({
      ...form,
      totalPool: parseFloat(form.totalPool),
    });
  };

  const isValid = form.title.trim() && form.resolveDate && form.description.trim();
  const catColor = CATEGORY_COLORS[form.category] || 'cyan';
  const colorMap = { cyan: '#00f2fe', purple: '#9d4edd', gold: '#ffb800', green: '#39ff14', pink: '#ff007f' };
  const catHex = colorMap[catColor] || '#00f2fe';

  const InputField = ({ label, id, children, hint }) => (
    <div>
      <label htmlFor={id} className="font-mono" style={{ fontSize: '0.68rem', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: '0.3rem', opacity: 0.7 }}>{hint}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <div>
        <div className="font-mono" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
          // CREATE A NEW MARKET
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
          LAUNCH MARKET
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Deploy a prediction market on GenLayer. Your resolution criteria become an Intelligent Contract.
        </p>
      </div>

      {/* Quick Templates */}
      <div className="glass-panel">
        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>
          // QUICK START TEMPLATES
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {RESOLUTION_TEMPLATES.map((t, i) => (
            <button
              key={i}
              id={`template-${i}`}
              onClick={() => applyTemplate(i)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.05em',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: templateIdx === i ? 'rgba(0,242,254,0.15)' : 'rgba(255,255,255,0.04)',
                color: templateIdx === i ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: templateIdx === i ? '1px solid rgba(0,242,254,0.4)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
          // MARKET DETAILS
        </div>

        {/* Title */}
        <InputField id="market-title" label="MARKET TITLE *" hint="Be specific. Good titles clearly state what YES means.">
          <input
            id="market-title"
            type="text"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Will Bitcoin exceed $150,000 before Jan 1, 2027?"
            className="cyber-input"
            style={{ fontSize: '0.9rem' }}
          />
        </InputField>

        {/* Description */}
        <InputField id="market-description" label="DESCRIPTION *" hint="Explain exactly what counts as YES. Include edge cases.">
          <textarea
            id="market-description"
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Describe the resolution criteria in detail..."
            className="cyber-input"
            rows={4}
            style={{ fontSize: '0.875rem', resize: 'vertical' }}
          />
        </InputField>

        {/* Category + Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField id="market-category" label="CATEGORY">
            <select
              id="market-category"
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="cyber-select"
            >
              {CATEGORIES.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </InputField>

          <InputField id="market-resolve-date" label="RESOLUTION DATE *">
            <input
              id="market-resolve-date"
              type="date"
              value={form.resolveDate}
              onChange={e => update('resolveDate', e.target.value)}
              className="cyber-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </InputField>
        </div>

        {/* Initial Liquidity */}
        <InputField id="market-pool" label="INITIAL POOL (GEN TOKENS)" hint="Amount you seed into the market as initial liquidity.">
          <input
            id="market-pool"
            type="number"
            value={form.totalPool}
            onChange={e => update('totalPool', e.target.value)}
            className="cyber-input"
            min="100"
            step="100"
          />
        </InputField>
      </div>

      {/* Resolution */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(157,78,221,0.2)' }}>
        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', letterSpacing: '0.1em' }}>
          // GENLAYER AI RESOLUTION
        </div>

        <InputField id="resolution-source" label="DATA SOURCE URL" hint="The URL GenLayer will fetch to verify the outcome.">
          <input
            id="resolution-source"
            type="url"
            value={form.resolutionSource}
            onChange={e => update('resolutionSource', e.target.value)}
            placeholder="https://api.coingecko.com/api/v3/..."
            className="cyber-input"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </InputField>

        <InputField id="resolution-prompt" label="RESOLUTION LOGIC (PYTHON)" hint="The code GenLayer Intelligent Contract will execute. Must return True/False.">
          <textarea
            id="resolution-prompt"
            value={form.resolutionPrompt}
            onChange={e => update('resolutionPrompt', e.target.value)}
            placeholder={`web_result = get_webpage(resolution_source)\nreturn call_llm(f"Did X happen? YES/NO") == "YES"`}
            className="cyber-input"
            rows={6}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical' }}
          />
        </InputField>
      </div>

      {/* Preview + Submit */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          id="preview-market-btn"
          onClick={() => setShowPreview(!showPreview)}
          className="btn-cyber"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', fontSize: '0.8rem',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <Eye size={14} />
          {showPreview ? 'Hide Preview' : 'Preview'}
        </button>
        <button
          id="launch-market-btn"
          onClick={handleSubmit}
          disabled={!isValid}
          className="btn-cyber btn-solid-cyan"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 2rem', fontSize: '0.85rem',
            opacity: isValid ? 1 : 0.45,
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          <Plus size={14} />
          LAUNCH MARKET
        </button>
      </div>

      {/* Live Preview */}
      {showPreview && form.title && (
        <div>
          <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            // LIVE PREVIEW
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            {/* Mini card preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px', background: `${catHex}15`, color: catHex, border: `1px solid ${catHex}30` }}>
                {form.category.toUpperCase()}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent-green)', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)' }}>
                OPEN
              </span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem', color: '#fff' }}>
              {form.title}
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '50%', background: 'linear-gradient(90deg, rgba(57,255,20,0.9), rgba(57,255,20,0.6))' }} />
              <div style={{ flex: 1, background: 'linear-gradient(90deg, rgba(255,0,127,0.6), rgba(255,0,127,0.9))' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>YES 50%</span>
              <span style={{ color: 'var(--accent-pink)' }}>50% NO</span>
            </div>
            <div style={{ marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem' }}>
              <span>Pool: {parseFloat(form.totalPool || 0).toLocaleString()} GEN</span>
              {form.resolveDate && <span>Resolves: {form.resolveDate}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
