import React, { useState, useEffect } from 'react';
// FIX: Moved the 'TradingCurrency' type import from '../App' to '../types', where it is correctly defined, to resolve the module not found error.
import type { StakingPool, TradingCurrency, UserStake } from '../types';
import type { TradingMode } from '../App';

// Re-using the icon logic from WalletModal for consistency
const UTokenIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-xs">U</div>;
const BitcoinIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-800"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F7931A]" fill="currentColor"><title>Bitcoin</title><path d="M11.522 18.22v-3.047c.99.03 1.94-.132 2.825-.49a5.15 5.15 0 002.13-1.742 4.96 4.96 0 00.83-2.735 4.96 4.96 0 00-.83-2.735 5.15 5.15 0 00-2.13-1.742 6.55 6.55 0 00-2.825-.49V2.195l1.68.012.012-1.68-1.68-.012L11.534.5H9.86v2.338c-.818.06-1.624.232-2.383.508a5.55 5.55 0 00-2.07 1.488 5.4 5.4 0 00-1.2 3.825c0 1.29.33 2.49.99 3.6.66 1.11 1.545 1.943 2.655 2.5a6.45 6.45 0 003.015.758v3.137l-3.3-1.425v2.31l3.3 1.395v1.8l-1.68-.012-.012 1.68 1.68.012v.66H11.522v-.66zm-1.662-7.567a2.62 2.62 0 011.665-2.52 3.1 3.1 0 013.165.945 3.1 3.1 0 01.945 3.165 3.1 3.1 0 01-.945 3.165c-.58.59-1.32.968-2.145 1.125a2.62 2.62 0 01-2.52-1.665 2.62 2.62 0 01-.165-1.545 2.62 2.62 0 01.0-1.665z" /></svg></div>;
const EthereumIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#3C3C3D]"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor"><title>Ethereum</title><path d="M11.944 17.97L4.58 13.62l7.364 4.354zm.112 0l7.365-4.354-7.365 4.354zM12 19.548L4.58 14.88l7.42 5.244 7.42-5.245-7.42 4.668zM4.58 12.553l7.364-4.42-7.364 4.42zm7.518-.002l7.365-4.42-7.365 4.42zM12 4.45L4.58 9.073 12 13.62l7.42-4.545L12 4.45z"/></svg></div>;
const DogeIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F2CB63]"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor"><title>Dogecoin</title><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-2.88-5.344a.42.42 0 0 1-.41-.532l1.242-4.148-3.957 2.08a.42.42 0 0 1-.58-.337L5.22 12.5a.42.42 0 0 1 .521-.45l4.135 1.258 2.09-3.95a.42.42 0 0 1 .71-.16l5.22 5.22a.42.42 0 0 1-.297.71l-5.343-1.29-2.07 3.93a.42.42 0 0 1-.37.286zm4.84-5.344c-.443 0-.803.36-.803.804s.36.803.803.803.804-.36.804-.803a.803.803 0 0 0-.804-.804z"/></svg></div>;

const getAssetIcon = (symbol: string): React.ReactNode => {
    switch(symbol) {
        case 'UT': return <UTokenIcon />;
        case 'BTC': return <BitcoinIcon />;
        case 'ETH': return <EthereumIcon />;
        case 'DOGE': return <DogeIcon />;
        case 'EUR': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">€</div>;
        case 'USD': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-xs">$</div>;
        case 'JPY': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs">¥</div>;
        case 'GBP': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">£</div>;
        default: return <div className="h-8 w-8 rounded-full bg-gray-600"></div>;
    }
};

interface StakingCardProps {
    pool: StakingPool;
    userStake?: UserStake;
    onStake: (poolId: string, amount: number, currency: string) => void;
    onWithdrawAll: (stakeId: string) => void;
    onWithdrawProfit: (stakeId: string) => void;
    balance: number;
    selectedTradingCurrency: TradingCurrency;
    tradingMode: TradingMode;
    isWalletConnected: boolean;
    onConnectWallet: () => void;
}

const StakingCard: React.FC<StakingCardProps> = ({ 
    pool, userStake, onStake, onWithdrawAll, onWithdrawProfit, 
    balance, selectedTradingCurrency, tradingMode, isWalletConnected, onConnectWallet 
}) => {
    const [stakeAmount, setStakeAmount] = useState('');
    const [timeLeft, setTimeLeft] = useState(pool.endDate - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = pool.endDate - Date.now();
            setTimeLeft(remaining > 0 ? remaining : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, [pool.endDate]);

    const isExpired = timeLeft <= 0;
    
    const progress = Math.min((pool.currentAmount / pool.totalGoal) * 100, 100);
    const isFull = pool.currentAmount >= pool.totalGoal;

    const handleStakeClick = () => {
        const amount = parseFloat(stakeAmount);
        if (!isNaN(amount) && amount > 0) {
            onStake(pool.id, amount, selectedTradingCurrency);
            setStakeAmount('');
        }
    };

    const formatTimeLeft = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    };
    
    const renderStakeForm = () => {
        if (isExpired) {
            return (
                <div className="text-center py-6 bg-gray-900/50 rounded-lg">
                    <p className="font-bold text-yellow-500">Staking Period Ended</p>
                    <p className="text-sm text-gray-400 mt-1">This pool is no longer accepting new stakes.</p>
                </div>
            );
        }
        
        const renderActionButton = () => {
            if (tradingMode === 'live' && !isWalletConnected) {
                return <button onClick={onConnectWallet} className="w-full py-3 mt-2 font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300">Connect Wallet</button>;
            }
            
            return (
                <button
                    onClick={handleStakeClick}
                    disabled={isFull || isExpired}
                    className="w-full py-3 mt-2 font-bold text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isFull ? 'Pool Full' : 'Stake Now'}
                </button>
            );
        };
        
        return (
            <div>
                 <div className="text-right text-xs mb-2">
                    <span className="text-gray-400">Your Balance: </span>
                    <span className="font-mono text-white font-bold">{balance.toLocaleString('en-US', {minimumFractionDigits: 2})} {selectedTradingCurrency}</span>
                </div>
                <div className="relative">
                     <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        disabled={isFull || isExpired}
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono disabled:bg-gray-800"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">{selectedTradingCurrency}</span>
                </div>
                {renderActionButton()}
            </div>
        );
    };

    const renderExpiredStakeDetails = (stake: UserStake) => {
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        // Calculate profit up to the pool's end date.
        const effectiveStakedDays = Math.floor((pool.endDate - stake.stakedAt) / ONE_DAY_MS);
        const finalProfit = effectiveStakedDays > 0 ? stake.amount * (pool.dailyROI / 100) * effectiveStakedDays : 0;

        return (
            <div className="bg-gray-900/50 border border-yellow-500 rounded-lg p-4 flex flex-col gap-3">
                <h4 className="text-lg font-bold text-yellow-500 text-center">Pool Ended</h4>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount Staked:</span>
                    <span className="text-white font-mono font-bold">{stake.amount.toLocaleString()} {stake.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Final Profit Earned:</span>
                    <span className="text-green-400 font-mono font-bold">{finalProfit.toLocaleString(undefined, {minimumFractionDigits: 2})} {stake.currency}</span>
                </div>

                <button
                    onClick={() => onWithdrawAll(stake.id)}
                    className="w-full mt-2 py-2 font-semibold text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors duration-300"
                >
                    Withdraw Principal & Profit
                </button>
            </div>
        );
    };

    const renderStakeDetails = (stake: UserStake) => {
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const daysStaked = Math.floor((Date.now() - stake.stakedAt) / ONE_DAY_MS);
        const earnedProfit = daysStaked > 0 ? daysStaked * stake.amount * (pool.dailyROI / 100) : 0;

        const canWithdraw = Date.now() - stake.stakedAt >= ONE_DAY_MS;
        
        const lastProfitClaimTime = stake.lastProfitWithdrawalAt || stake.stakedAt;
        const daysSinceLastClaim = Math.floor((Date.now() - lastProfitClaimTime) / ONE_DAY_MS);
        const canWithdrawProfit = canWithdraw && daysSinceLastClaim >= 1;

        return (
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-3">
                <h4 className="text-lg font-bold text-white text-center">Your Position</h4>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount Staked:</span>
                    <span className="text-white font-mono font-bold">{stake.amount.toLocaleString()} {stake.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Date Staked:</span>
                    <span className="text-white font-mono">{new Date(stake.stakedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Profit Earned:</span>
                    <span className="text-green-400 font-mono font-bold">{earnedProfit.toLocaleString(undefined, {minimumFractionDigits: 2})} {stake.currency}</span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <button
                        onClick={() => onWithdrawProfit(stake.id)}
                        disabled={!canWithdrawProfit}
                        className="w-full py-2 font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Withdraw Profit (0.002% Fee)
                    </button>
                    <button
                        onClick={() => onWithdrawAll(stake.id)}
                        disabled={!canWithdraw}
                        className="w-full py-2 font-semibold text-white rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Withdraw All (0.002% Fee)
                    </button>
                    {!canWithdraw && <p className="text-xs text-center text-yellow-400">Withdrawal available after 24 hours.</p>}
                </div>
            </div>
        );
    };
    
    return (
        <div className="bg-[#161B22] rounded-lg border border-gray-700 p-6 flex flex-col gap-4 shadow-lg hover:shadow-blue-500/20 transition-shadow">
            <header className="flex items-center gap-4">
                <div className="flex -space-x-3">
                    {pool.assets.map(asset => (
                        <div key={asset} className="border-2 border-[#161B22] rounded-full">
                            {getAssetIcon(asset)}
                        </div>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-white">{pool.title}</h3>
            </header>
            
            <p className="text-gray-400 text-sm h-12">{pool.description}</p>
            
            <div>
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-mono text-white">
                        {pool.currentAmount.toLocaleString()}$ / {pool.totalGoal.toLocaleString()}$
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm border-t border-b border-gray-700 py-4">
                <div className="flex justify-between">
                    <span className="text-gray-400">Ends:</span> 
                    <span className="text-white font-medium">{new Date(pool.endDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">{isExpired ? 'Status:' : 'Time Left:'}</span>
                    <span className={`font-mono font-bold ${isExpired ? 'text-red-500' : 'text-yellow-400'}`}>
                        {isExpired ? 'CLOSED' : formatTimeLeft(timeLeft)}
                    </span>
                </div>
                 <div className="flex justify-between"><span className="text-gray-400">Daily ROI:</span> <span className="text-green-400 font-bold">{pool.dailyROI}%</span></div>
                 <div className="flex justify-between"><span className="text-gray-400">Total Return:</span> <span className="text-green-400 font-bold">{pool.totalAPY}%</span></div>
            </div>
            
            {userStake 
                ? (isExpired ? renderExpiredStakeDetails(userStake) : renderStakeDetails(userStake))
                : renderStakeForm()
            }
        </div>
    );
};

export default StakingCard;