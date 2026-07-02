# ⚡ PredGen | AI-Powered Prediction Markets on GenLayer

<p align="center">
  <img src="./public/predgen-logo.png" alt="PredGen Logo" width="160" />
</p>

<p align="center">
  <strong>Decentralized prediction markets resolved autonomously by Intelligent Contracts on GenLayer.</strong>
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-project-architecture">Architecture</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-folder-structure">Folder Structure</a>
</p>

---

## 🔮 What is PredGen?

**PredGen** is a next-generation prediction market platform built on **GenLayer**. Traditional prediction markets rely on centralized sources or complex oracle networks (like Chainlink) to resolve real-world events. PredGen changes this paradigm by using **Intelligent Contracts**—smart contracts embedded with Large Language Models (LLMs) that can browse the web, reason, and reach consensus to resolve contracts autonomously.

No manual reporters, no trusted middlemen, no centralized API dependencies. True trustless resolution.

---

## 🌟 Key Features

### 🌐 GenLayer Bradbury Testnet Integration
Connect with Web3 wallets (like MetaMask) and switch automatically to the **GenLayer Testnet Bradbury** (Chain ID: `4221` / `0x107d`). Fetch live `$GEN` balances directly from the JSON-RPC ledger endpoint.

### 🤖 Autonomous AI Resolution
Contracts execute resolution logic by sending transactions that trigger the `resolve()` method inside GenLayer's GenVM. The contracts autonomously fetch web sources, run consensus among LLM validators, and payout winners.

### 🌗 Premium Dual-Theme Interface
Includes a fully responsive design inspired by high-end financial and Web3 platforms. Toggle seamlessly between **Light Mode** and a custom **Sleek Cyber Dark Mode** designed for optimal night trading.

### 📊 Comprehensive Market Flow
*   **Explore Markets**: Filter and search prediction markets by categories, volume, or status (Open, Resolving, Resolved).
*   **Detailed Statistics**: Visual charts showing historical price consensus (probability trends for YES/NO).
*   **Create Markets**: Propose new prediction markets with customized resolution rules and initial liquidity.
*   **My Bets Dashboard**: Monitor open positions, historical bet outcomes, and track unclaimed payouts.
*   **Trading League Leaderboard**: A gamified leaderboard displaying top traders, net returns, and win streaks.

---

## 📁 Folder Structure

Here is a breakdown of the PredGen codebase to help you navigate and understand the repository layout:

```text
Gengame/
├── public/                 # Static assets served directly (Favicon, logos)
│   ├── favicon.svg         # Tab icon (Vector format)
│   └── predgen-logo.png    # High-quality application logo
├── src/
│   ├── assets/             # Bundled visual assets
│   │   ├── hero.png        # Header illustration
│   │   └── predgen-logo.png# High-res logo used inside components
│   ├── components/         # Reusable React components & modals
│   │   ├── AlertModal.jsx         # Custom app-wide notification modals
│   │   ├── BetConfirmModal.jsx    # Double-check bet slip before posting to ledger
│   │   ├── CreateMarket.jsx       # Interface for proposing new markets
│   │   ├── Header.jsx             # Stick navigation header + wallet connect + theme toggle
│   │   ├── Leaderboard.jsx        # Trader standings and metrics
│   │   ├── MarketCard.jsx         # Reusable summary card for market list
│   │   ├── MarketDetailModal.jsx  # Rich statistics, probability tracking & betting console
│   │   ├── MarketsPage.jsx        # Markets search and filter container
│   │   ├── MyBets.jsx             # Open and historical positions log
│   │   ├── TradingLeagueBanner.jsx# Promo banner for leaderboard engagement
│   │   └── WalletConnectModal.jsx # Web3 wallet connection modal
│   ├── data/
│   │   └── markets.js      # Initial mockup prediction market data
│   ├── services/
│   │   └── genlayer.js     # JSON-RPC integration for GenLayer Bradbury network
│   ├── App.jsx             # Core state coordinator & layout router
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global typography & design system tokens (Light & Dark theme variables)
├── vercel.json             # Vercel SPA routing rules configuration
├── vite.config.js          # Vite build and plugins config
├── package.json            # Node.js dependencies & run scripts
└── README.md               # You are here!
```

---

## 🛠️ Technology Stack

*   **Framework**: [React 19](https://react.dev/) (Modern UI architecture)
*   **Build Tool**: [Vite](https://vite.dev/) (Ultra-fast development server and bundle optimization)
*   **Styling**: Vanilla CSS Variables (Premium custom-designed design tokens for Light/Dark modes)
*   **Icons**: [Lucide React](https://lucide.dev/) (Clean, modern stroke iconography)
*   **Blockchain Communication**: Custom JSON-RPC fetch protocols compatible with **GenLayer Bradbury Dev RPC** (`https://rpc-bradbury.genlayer.com`)

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### ⚙️ Installation & Running Locally

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/KennyGodman/PredGen.git
    cd PredGen
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will launch locally at `http://localhost:5173/`.

4.  **Connect to GenLayer Bradbury Testnet**
    *   Open your browser wallet (e.g., MetaMask).
    *   Click **Connect Wallet** in the PredGen header.
    *   The app will automatically prompt you to add and switch to **GenLayer Testnet Bradbury**.

---

## 🔗 Links & Resources

*   **GenLayer Website**: [https://genlayer.com](https://genlayer.com)
*   **GenLayer Explorer**: [https://explorer-bradbury.genlayer.com](https://explorer-bradbury.genlayer.com)
*   **GenLayer RPC**: `https://rpc-bradbury.genlayer.com`
