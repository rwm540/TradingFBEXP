import React from 'react';
import StakingCard from './StakingCard';
import type { StakingPool, TradingCurrency, UserStake } from '../types';
import type { TradingMode } from '../App';

interface StakingPageProps {
    pools: StakingPool[];
    userStakes: UserStake[];
    onStake: (poolId: string, amount: number, currency: string) => void;
    onWithdrawAll: (stakeId: string) => void;
    onWithdrawProfit: (stakeId: string) => void;
    balance: number;
    selectedTradingCurrency: TradingCurrency;
    tradingMode: TradingMode;
    isWalletConnected: boolean;
    onConnectWallet: () => void;
}

const StakingPage: React.FC<StakingPageProps> = ({ 
    pools, userStakes, onStake, onWithdrawAll, onWithdrawProfit, 
    balance, selectedTradingCurrency, tradingMode, isWalletConnected, onConnectWallet 
}) => {
    return (
        <div className="flex flex-col gap-4">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Staking Pools</h1>
                <p className="text-gray-400 mt-1">Stake your assets to earn passive income. Select a pool to get started.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {pools.map(pool => (
                    <StakingCard 
                        key={pool.id}
                        pool={pool}
                        userStake={userStakes.find(s => s.poolId === pool.id)}
                        onStake={onStake}
                        onWithdrawAll={onWithdrawAll}
                        onWithdrawProfit={onWithdrawProfit}
                        balance={balance}
                        selectedTradingCurrency={selectedTradingCurrency}
                        tradingMode={tradingMode}
                        isWalletConnected={isWalletConnected}
                        onConnectWallet={onConnectWallet}
                    />
                ))}
            </div>
        </div>
    );
};

export default StakingPage;