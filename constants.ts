import type { WalletAsset, StakingPool, LotteryPool } from './types';

export const currencyPairs = [
  // Major Pairs
  { value: 'EUR/USD', label: 'EUR/USD' },
  { value: 'GBP/USD', label: 'GBP/USD' },
  { value: 'USD/JPY', label: 'USD/JPY' },
  { value: 'USD/CHF', label: 'USD/CHF' },
  { value: 'USD/CAD', label: 'USD/CAD' },
  { value: 'AUD/USD', label: 'AUD/USD' },
  { value: 'NZD/USD', label: 'NZD/USD' },
  
  // Commonly Traded Exotic Pairs with good data coverage
  { value: 'USD/CNH', label: 'USD/CNH' },
  { value: 'USD/HKD', label: 'USD/HKD' },
  { value: 'USD/SGD', label: 'USD/SGD' },
  { value: 'USD/MXN', label: 'USD/MXN' },
  { value: 'USD/TRY', label: 'USD/TRY' },
];

export const cryptoPairs = [
  { value: 'BTC/USD', label: 'Bitcoin' },
  { value: 'ETH/USD', label: 'Ethereum' },
  { value: 'BNB/USD', label: 'Binance Coin' },
  { value: 'SOL/USD', label: 'Solana' },
  { value: 'XRP/USD', label: 'Ripple' },
  { value: 'DOGE/USD', label: 'Dogecoin' },
  { value: 'ADA/USD', label: 'Cardano' },
  { value: 'TRX/USD', label: 'Tron' },
];

export const stockSymbols = [
  { value: 'US100/USD', label: 'NASDAQ 100' },
  { value: 'US500/USD', label: 'S&P 500' },
  { value: 'US30/USD', label: 'Dow Jones 30' },
  { value: 'AAPL/USD', label: 'Apple Inc.' },
  { value: 'GOOGL/USD', label: 'Alphabet Inc. (Google)' },
  { value: 'TSLA/USD', label: 'Tesla, Inc.' },
  { value: 'AMZN/USD', label: 'Amazon.com, Inc.' },
];

export const commodityPairs = [
  { value: 'XAU/USD', label: 'Gold' },
  { value: 'XAG/USD', label: 'Silver' },
];

export const allTradablePairs = [
    ...currencyPairs,
    ...cryptoPairs,
    ...stockSymbols,
    ...commodityPairs,
];

export const initialAssetsData: WalletAsset[] = [
    { name: 'UT', symbol: 'UT', balance: 0, priceUSD: 1.00, accountNumber: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b' },
    { name: 'Bitcoin', symbol: 'BTC', balance: 0, priceUSD: 68000.50, accountNumber: 'bc1q09g7w4g45sl55h0w88279ph48ge2z2t8gqs9k6' },
    { name: 'Ethereum', symbol: 'ETH', balance: 0, priceUSD: 3500.75, accountNumber: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326' },
    { name: 'Dogecoin', symbol: 'DOGE', balance: 0, priceUSD: 0.15, accountNumber: 'DBark7iU3X4v5N6p7q8R9sAtBuCvDwExFz' },
    { name: 'Euro', symbol: 'EUR', balance: 0, priceUSD: 1.08, accountNumber: 'DE89 3704 0044 0532 0130 00' },
    { name: 'US Dollar', symbol: 'USD', balance: 0, priceUSD: 1.00, accountNumber: '021000021 987654321' },
    { name: 'Japanese Yen', symbol: 'JPY', balance: 0, priceUSD: 0.0064, accountNumber: 'JP40 0005 0000 0001 2345 6789' },
    { name: 'British Pound', symbol: 'GBP', balance: 0, priceUSD: 1.27, accountNumber: 'GB33 BUKB 2020 1555 5555 55' },
    { name: 'Gold', symbol: 'XAU', balance: 0, priceUSD: 2300.00, accountNumber: 'GLD-ACC-9821-B47-C01' },
    { name: 'Silver', symbol: 'XAG', balance: 0, priceUSD: 29.50, accountNumber: 'SLV-ACC-1109-A12-D99' },
];

const now = new Date();

export const initialStakingPools: StakingPool[] = [
    {
        id: 'sp-1',
        title: 'High-Yield BTC-ETH Liquidity Pool',
        assets: ['BTC', 'ETH'],
        description: 'Provide liquidity to a premier decentralized exchange and earn rewards from trading fees. A stable and high-volume pool.',
        totalGoal: 10000000,
        currentAmount: 2500000,
        startDate: '2024-07-01',
        endDate: new Date('2025-07-01T23:59:59Z').getTime(),
        dailyROI: 0.05,
        totalAPY: 18.25
    },
    {
        id: 'sp-2',
        title: 'Forex Growth Fund',
        assets: ['EUR', 'USD', 'GBP'],
        description: 'Invest in a diversified portfolio of major forex pairs. Managed by algorithmic trading bots for optimized returns.',
        totalGoal: 5000000,
        currentAmount: 4800000,
        startDate: '2024-06-15',
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).getTime(), // Ends in 5 days
        dailyROI: 0.1,
        totalAPY: 36.5
    },
    {
        id: 'sp-3',
        title: 'Stablecoin Savings Vault',
        assets: ['USD'],
        description: 'A low-risk staking option. Earn a consistent, predictable yield on your stablecoin holdings. Your capital is used for low-leverage lending.',
        totalGoal: 25000000,
        currentAmount: 25000000,
        startDate: '2024-05-01',
        endDate: new Date('2025-05-01T23:59:59Z').getTime(),
        dailyROI: 0.02,
        totalAPY: 7.3
    },
    {
        id: 'sp-4',
        title: 'Doge Coin Speculation Pool',
        assets: ['DOGE'],
        description: 'High-risk, high-reward. This pool speculates on the volatility of popular meme coins. For the adventurous investor.',
        totalGoal: 1000000,
        currentAmount: 150000,
        startDate: '2024-07-20',
        endDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).getTime(), // Ends in 90 days
        dailyROI: 0.5,
        totalAPY: 45
    },
    {
        id: 'sp-5',
        title: 'Legacy Crypto Fund',
        assets: ['BTC'],
        description: 'This staking pool has already ended. Withdrawals for existing stakes are still available if applicable.',
        totalGoal: 500000,
        currentAmount: 450000,
        startDate: '2024-01-01',
        endDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).getTime(), // Ended 10 days ago
        dailyROI: 0.08,
        totalAPY: 29.2
    }
];


export const initialLotteryPools: LotteryPool[] = [
    {
        id: 'lp-1',
        title: 'Bitcoin Jackpot (Time-Based)',
        prizeIcon: 'BTC',
        type: 'time',
        numberOfWinners: 10,
        ticketPrice: 25,
        currency: 'USD',
        totalTickets: 1000000,
        ticketsSold: 250000,
        drawDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).getTime(), // 15 days from now
        status: 'active',
    },
    {
        id: 'lp-2',
        title: 'Doge Meme Madness (Ticket-Based)',
        prizeIcon: 'DOGE',
        type: 'ticket',
        numberOfWinners: 100,
        ticketPrice: 1,
        currency: 'USD',
        totalTickets: 1000000,
        ticketsSold: 950000,
        status: 'active',
    },
    {
        id: 'lp-3',
        title: 'Stablecoin Grand Prize (Sold Out)',
        prizeIcon: 'USD',
        type: 'ticket',
        numberOfWinners: 1,
        ticketPrice: 10,
        currency: 'USD',
        totalTickets: 50000,
        ticketsSold: 50000,
        status: 'active', // Will be drawn on load
    },
    {
        id: 'lp-4',
        title: 'ETH Community Draw (Finished)',
        prizeIcon: 'ETH',
        type: 'time',
        numberOfWinners: 5,
        ticketPrice: 50,
        currency: 'USD',
        totalTickets: 40000,
        ticketsSold: 12000,
        drawDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).getTime(), // Ended 2 days ago
        status: 'completed',
        totalPrizePool: 300000, // (12000 * 50) / 2
        prizePerWinner: 60000, // 300000 / 5
    }
];
