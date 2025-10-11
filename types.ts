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

export type AssetType = 'forex' | 'crypto' | 'stocks' | 'commodities';

export interface OptionTrade {
    id: string;
    pair: string;
    type: 'Buy' | 'Sell'; // 'Buy' for Higher, 'Sell' for Lower
    entryPrice: number;
    amount: number; // The amount staked
    duration: number; // in seconds
    profitPercentage: number;
    openTime: number; // timestamp
    expiryTime: number; // timestamp
    status: 'Active' | 'Won' | 'Lost';
    currency: TradingCurrency;
    closePrice?: number;
    payout?: number; // amount + profit
    profit?: number; // profit or loss amount
}

export type NewOptionOrderRequest = {
    pair: string;
    type: 'Buy' | 'Sell';
    amount: number;
    duration: number; // in seconds
    profitPercentage: number;
    currency: TradingCurrency;
}

// FIX: Added missing OrderBookEntry interface.
export interface OrderBookEntry {
    price: string;
    amount: string;
    total: string;
}

export interface WalletAsset {
    name: string;
    symbol: string;
    balance: number;
    priceUSD: number;
    accountNumber: string;
}

export interface StakingPool {
  id: string;
  title: string;
  assets: string[];
  description: string;
  totalGoal: number;
  currentAmount: number;
  startDate: string;
  endDate: number; // as timestamp for calculations
  dailyROI: number; // as a percentage, e.g., 0.05 for 0.05%
  totalAPY: number; // as a percentage
}

export interface UserStake {
    id: string;
    poolId: string;
    amount: number;
    currency: string;
    stakedAt: number; // timestamp
    lastProfitWithdrawalAt?: number;
}

export interface LotteryPool {
    id: string;
    title: string;
    prizeIcon: string;
    type: 'time' | 'ticket';
    numberOfWinners: number;
    ticketPrice: number;
    currency: string;
    totalTickets: number;
    ticketsSold: number;
    drawDate?: number; // Optional timestamp, for time-based lotteries
    status: 'active' | 'completed';
    totalPrizePool?: number;
    prizePerWinner?: number;
}


export interface UserLotteryTicket {
    poolId: string;
    numberOfTickets: number;
    winsCount?: number;
}

export interface WalletTransaction {
    id: string;
    timestamp: number;
    type: 'Deposit' | 'Swap' | 'Trade Margin' | 'Trade P/L' | 'Option Stake' | 'Option Payout' | 'Staking Deposit' | 'Staking Withdrawal' | 'Lottery Purchase' | 'Lottery Win';
    description: string;
    amount: number; // Can be positive or negative
    currency: string;
}