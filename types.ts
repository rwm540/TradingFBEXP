export interface Currency {
    value: string;
    label: string;
}

export type TradingCurrency = string; // Can be any asset symbol like 'USD', 'BTC', 'ETH'

export interface Trade {
    id: string;
    pair: string;
    type: 'Buy' | 'Sell';
    price: number; // Entry price
    amount: number; // Position size in base currency
    margin: number; // The amount invested by the user
    leverage: number;
    time: string; // Open time
    status: 'Open' | 'Closed';
    currency: TradingCurrency;
    closePrice?: number;
    closeTime?: string;
    pnl?: number; // Profit/Loss in the quote currency of the pair
    pnlInUSD?: number; // Profit/Loss converted to USD for consistent reporting
    pnlInTradeCurrency?: number; // Profit/Loss in the currency the trade was margined in
}

export type NewOrderRequest = {
    pair: string;
    type: 'Buy' | 'Sell';
    margin: number;
    leverage: number;
    currency: TradingCurrency;
}

export type AssetType = 'forex' | 'crypto' | 'stock' | 'commodity';

export interface OrderBookEntry {
    price: string;
    amount: string;
    total: string;
}

export interface OptionTrade {
    id: string;
    pair: string;
    type: 'Buy' | 'Sell';
    entryPrice: number;
    amount: number;
    duration: number; // in seconds
    profitPercentage: number;
    openTime: number; // timestamp
    expiryTime: number; // timestamp
    status: 'Active' | 'Won' | 'Lost';
    currency: TradingCurrency;
    closePrice?: number;
    payout?: number;
    profit?: number;
}

export type NewOptionOrderRequest = {
    pair: string;
    type: 'Buy' | 'Sell';
    amount: number;
    duration: number; // in seconds
    profitPercentage: number;
    currency: TradingCurrency;
}

export interface WalletAsset {
    name: string;
    symbol: TradingCurrency;
    balance: number;
    priceUSD: number;
    accountNumber: string;
}

export interface StakingPool {
    id: string;
    title: string;
    assets: TradingCurrency[];
    description: string;
    totalGoal: number;
    currentAmount: number;
    startDate: string;
    endDate: number; // timestamp
    dailyROI: number;
    totalAPY: number;
}

export interface UserStake {
    id: string;
    poolId: string;
    amount: number;
    currency: TradingCurrency;
    stakedAt: number; // timestamp
    lastProfitWithdrawalAt?: number; // timestamp
}

export interface LotteryPool {
    id: string;
    title: string;
    prizeIcon: TradingCurrency;
    type: 'time' | 'ticket';
    numberOfWinners: number;
    ticketPrice: number;
    currency: TradingCurrency;
    totalTickets: number;
    ticketsSold: number;
    drawDate?: number; // timestamp, for time-based lotteries
    status: 'active' | 'completed';
    totalPrizePool?: number;
    prizePerWinner?: number;
}

export interface UserLotteryTicket {
    poolId: string;
    numberOfTickets: number;
    winsCount?: number; // How many times the user won in this pool
}

export interface WalletTransaction {
    id: string;
    timestamp: number;
    type: 'Deposit' | 'Withdrawal' | 'Trade Margin' | 'Trade P/L' | 'Option Stake' | 'Option Payout' | 'Swap' | 'Staking Deposit' | 'Staking Withdrawal' | 'Lottery Purchase' | 'Lottery Win';
    description: string;
    amount: number;
    currency: TradingCurrency;
}

export interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | null; // Base64 encoded string
}
