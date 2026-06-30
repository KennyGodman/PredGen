export const CATEGORIES = ['All', 'Crypto', 'AI & Tech', 'Politics', 'Sports', 'GenLayer', 'Science'];

export const CATEGORY_COLORS = {
  'Crypto': 'cyan',
  'AI & Tech': 'purple',
  'Politics': 'gold',
  'Sports': 'green',
  'GenLayer': 'pink',
  'Science': 'cyan',
};

export const initialMarkets = [
  {
    id: 'm1',
    title: 'Will Bitcoin exceed $150,000 before January 1, 2027?',
    description:
      'This market resolves YES if the BTC/USD spot price on any top-5 exchange (Binance, Coinbase, Kraken) reaches or exceeds $150,000 at any point before midnight UTC on January 1, 2027. Price must be sustained for at least 5 minutes.',
    category: 'Crypto',
    yesProb: 0.67,
    totalPool: 284500,
    volume24h: 12300,
    resolveDate: '2026-12-31',
    status: 'open',
    resolutionSource: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
    resolutionPrompt: `web_result = get_webpage("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
price = float(json.loads(web_result)["price"])
return price >= 150000`,
    featured: true,
    createdAt: '2026-01-15',
    betsCount: 1842,
  },
  {
    id: 'm2',
    title: 'Will GenLayer mainnet launch before September 2026?',
    description:
      'Resolves YES if GenLayer officially deploys a publicly accessible mainnet before September 1, 2026. Must be announced on the official GenLayer blog or Twitter with verifiable on-chain activity.',
    category: 'GenLayer',
    yesProb: 0.58,
    totalPool: 95200,
    volume24h: 8100,
    resolveDate: '2026-08-31',
    status: 'open',
    resolutionSource: 'https://genlayer.com/blog',
    resolutionPrompt: `web_result = get_webpage("https://genlayer.com/blog")
return call_llm(
    f"Based on: {web_result}\\nHas GenLayer mainnet launched publicly? YES/NO"
) == "YES"`,
    featured: true,
    createdAt: '2026-02-01',
    betsCount: 673,
  },
  {
    id: 'm3',
    title: 'Will GPT-5 be publicly released before end of 2026?',
    description:
      'Resolves YES if OpenAI releases a model officially designated GPT-5 (or equivalent capability tier) to the general public via API or ChatGPT before December 31, 2026.',
    category: 'AI & Tech',
    yesProb: 0.82,
    totalPool: 412000,
    volume24h: 31500,
    resolveDate: '2026-12-31',
    status: 'open',
    resolutionSource: 'https://openai.com/news',
    resolutionPrompt: `web_result = get_webpage("https://openai.com/news")
return call_llm(
    f"Based on: {web_result}\\nHas OpenAI released GPT-5 publicly? YES/NO"
) == "YES"`,
    featured: true,
    createdAt: '2026-01-10',
    betsCount: 3291,
  },
  {
    id: 'm4',
    title: 'Will Ethereum exceed $10,000 in 2026?',
    description:
      'Resolves YES if the ETH/USD price on CoinGecko or Binance reaches or exceeds $10,000 at any point during calendar year 2026.',
    category: 'Crypto',
    yesProb: 0.43,
    totalPool: 198700,
    volume24h: 9200,
    resolveDate: '2026-12-31',
    status: 'open',
    resolutionSource: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    resolutionPrompt: `web_result = get_webpage("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
price = json.loads(web_result)["ethereum"]["usd"]
return price >= 10000`,
    featured: false,
    createdAt: '2026-01-20',
    betsCount: 1150,
  },
  {
    id: 'm5',
    title: 'Will an AI model pass the US Bar Exam at the 90th percentile?',
    description:
      'Resolves YES if any commercially available AI model achieves a 90th percentile UBE score, verified by a law school or bar association study published in a peer-reviewed journal.',
    category: 'AI & Tech',
    yesProb: 0.71,
    totalPool: 87400,
    volume24h: 4300,
    resolveDate: '2027-01-01',
    status: 'open',
    resolutionSource: 'https://scholar.google.com',
    resolutionPrompt: `web_result = get_webpage("https://scholar.google.com/scholar?q=AI+bar+exam+90th+percentile+2026")
return call_llm(
    f"Based on: {web_result}\\nHas an AI achieved 90th percentile on the bar exam? YES/NO"
) == "YES"`,
    featured: false,
    createdAt: '2026-02-14',
    betsCount: 512,
  },
  {
    id: 'm6',
    title: 'Will the US enact a comprehensive crypto framework by Q3 2026?',
    description:
      'Resolves YES if the United States enacts and signs into law a comprehensive federal cryptocurrency regulatory framework before October 1, 2026.',
    category: 'Politics',
    yesProb: 0.34,
    totalPool: 320000,
    volume24h: 18700,
    resolveDate: '2026-09-30',
    status: 'open',
    resolutionSource: 'https://congress.gov',
    resolutionPrompt: `web_result = get_webpage("https://congress.gov/search?q=cryptocurrency+regulation+2026&congress=119")
return call_llm(
    f"Based on: {web_result}\\nHas a comprehensive US crypto regulation been signed into law? YES/NO"
) == "YES"`,
    featured: false,
    createdAt: '2026-01-25',
    betsCount: 2105,
  },
  {
    id: 'm7',
    title: 'Will Solana flip Ethereum by market cap in 2026?',
    description:
      'Resolves YES if Solana\'s market cap exceeds Ethereum\'s market cap on CoinGecko for any sustained 24-hour period during calendar year 2026.',
    category: 'Crypto',
    yesProb: 0.22,
    totalPool: 156000,
    volume24h: 7600,
    resolveDate: '2026-12-31',
    status: 'open',
    resolutionSource: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd',
    resolutionPrompt: `web_result = get_webpage("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana,ethereum")
data = json.loads(web_result)
sol_cap = next(c["market_cap"] for c in data if c["id"] == "solana")
eth_cap = next(c["market_cap"] for c in data if c["id"] == "ethereum")
return sol_cap > eth_cap`,
    featured: false,
    createdAt: '2026-02-05',
    betsCount: 887,
  },
  {
    id: 'm8',
    title: 'Will Apple release a Vision Pro successor in 2026?',
    description:
      'Resolves YES if Apple announces and ships a new standalone AR/VR headset model distinct from the original Vision Pro before December 31, 2026.',
    category: 'AI & Tech',
    yesProb: 0.55,
    totalPool: 64200,
    volume24h: 2800,
    resolveDate: '2026-12-31',
    status: 'open',
    resolutionSource: 'https://apple.com/newsroom',
    resolutionPrompt: `web_result = get_webpage("https://apple.com/newsroom")
return call_llm(
    f"Based on: {web_result}\\nHas Apple released a new Vision Pro model in 2026? YES/NO"
) == "YES"`,
    featured: false,
    createdAt: '2026-03-01',
    betsCount: 348,
  },
  {
    id: 'm9',
    title: 'Will Brazil or Argentina win the 2026 FIFA World Cup?',
    description:
      'Resolves YES if either Brazil or Argentina wins the 2026 FIFA World Cup final. The tournament is hosted jointly by USA, Canada, and Mexico.',
    category: 'Sports',
    yesProb: 0.38,
    totalPool: 547000,
    volume24h: 45200,
    resolveDate: '2026-07-19',
    status: 'open',
    contractAddress: '0xaD19682b48Cc70a41877ecbC0f8Cfc998dAb7dcC',
    resolutionSource: 'https://fifa.com',
    resolutionPrompt: `web_result = get_webpage("https://www.fifa.com/tournaments/mens/worldcup/2026")
winner = call_llm(f"Based on: {web_result}\\nWho won the 2026 FIFA World Cup? Answer with country name only.")
return winner in ["Brazil", "Argentina"]`,
    featured: true,
    createdAt: '2026-01-01',
    betsCount: 5621,
  },
  {
    id: 'm10',
    title: 'Did Bitcoin exceed $120,000 in May 2026?',
    description:
      'This market has been resolved. BTC/USD reached $124,300 on Binance on May 17, 2026, sustained for over 2 hours. GenLayer AI consensus confirmed YES with 94% validator agreement.',
    category: 'Crypto',
    yesProb: 1.0,
    totalPool: 89300,
    volume24h: 0,
    resolveDate: '2026-05-31',
    status: 'resolved',
    outcome: 'YES',
    resolutionSource: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
    resolutionPrompt: `web_result = get_webpage("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h")
prices = [float(c[4]) for c in json.loads(web_result)]
return any(p >= 120000 for p in prices)`,
    featured: false,
    createdAt: '2026-03-15',
    betsCount: 921,
  },
  {
    id: 'm11',
    title: 'Will the Fed cut interest rates at the June 2026 FOMC meeting?',
    description:
      'Resolves YES if the Federal Reserve announces a reduction in the federal funds target rate range at its scheduled June 2026 FOMC meeting.',
    category: 'Politics',
    yesProb: 0.61,
    totalPool: 230000,
    volume24h: 19400,
    resolveDate: '2026-06-20',
    status: 'resolving',
    resolutionSource: 'https://federalreserve.gov/monetarypolicy/fomccalendars.htm',
    resolutionPrompt: `web_result = get_webpage("https://federalreserve.gov/monetarypolicy/fomccalendars.htm")
return call_llm(
    f"Based on: {web_result}\\nDid the Fed cut rates at the June 2026 FOMC meeting? YES/NO"
) == "YES"`,
    featured: false,
    createdAt: '2026-04-01',
    betsCount: 1783,
  },
  {
    id: 'm12',
    title: 'Will an AI pass a rigorous Turing test by 2027?',
    description:
      'Resolves YES if an AI system convinces a panel of expert judges it is human in a standardized Turing Test (minimum 30-minute conversation, expert panel of 10+) administered by an academic institution.',
    category: 'Science',
    yesProb: 0.47,
    totalPool: 178500,
    volume24h: 8900,
    resolveDate: '2026-12-31',
    status: 'open',
    resolutionSource: 'https://arxiv.org',
    resolutionPrompt: `web_result = get_webpage("https://arxiv.org/search/?searchtype=all&query=AI+Turing+Test+passed+2026")
return call_llm(
    f"Based on: {web_result}\\nHas an AI officially passed a rigorous Turing test? YES/NO"
) == "YES"`,
    featured: false,
    createdAt: '2026-01-08',
    betsCount: 934,
  },
];

export const LEADERBOARD_DATA = [
  { rank: 1, username: 'quantum_oracle', address: '0x3f4a...b82c', profit: 84200, winRate: 0.78, bets: 214, badge: 'LEGENDARY' },
  { rank: 2, username: 'predgen_whale', address: '0x9c2b...a41f', profit: 61500, winRate: 0.72, bets: 189, badge: 'LEGENDARY' },
  { rank: 3, username: 'ai_prophet_x', address: '0x1d8e...c93a', profit: 43100, winRate: 0.69, bets: 302, badge: 'ELITE' },
  { rank: 4, username: 'chain_seer', address: '0x7a3f...d51b', profit: 38700, winRate: 0.65, bets: 156, badge: 'ELITE' },
  { rank: 5, username: 'genlayer_dev99', address: '0x2e9c...f84d', profit: 29400, winRate: 0.67, bets: 98, badge: 'ELITE' },
  { rank: 6, username: 'sigma_trader', address: '0x6b1a...e27c', profit: 22100, winRate: 0.61, bets: 241, badge: 'PRO' },
  { rank: 7, username: 'market_wizard', address: '0x4f2d...a63e', profit: 18900, winRate: 0.59, bets: 175, badge: 'PRO' },
  { rank: 8, username: 'crypto_sage', address: '0x8e5c...b19f', profit: 14300, winRate: 0.57, bets: 143, badge: 'PRO' },
  { rank: 9, username: 'neural_bet', address: '0x0c7b...d42a', profit: 11800, winRate: 0.54, bets: 89, badge: 'RISING' },
  { rank: 10, username: 'block_oracle', address: '0x5d3e...c78b', profit: 8600, winRate: 0.52, bets: 67, badge: 'RISING' },
];
