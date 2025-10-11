import React, { useState, useMemo } from 'react';
import type { UserStake, StakingPool } from '../types';

interface StakingHistoryPageProps {
    userStakes: UserStake[];
    stakingPools: StakingPool[];
}

const StakingHistoryPage: React.FC<StakingHistoryPageProps> = ({ userStakes, stakingPools }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const getPoolTitle = (poolId: string) => {
        const pool = stakingPools.find(p => p.id === poolId);
        return pool ? pool.title : 'Unknown Pool';
    };

    const filteredStakes = useMemo(() => {
        if (!searchTerm) {
            return userStakes;
        }
        return userStakes.filter(stake => 
            getPoolTitle(stake.poolId).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, userStakes, stakingPools]);

    return (
        <div className="bg-[#161B22] p-4 sm:p-6 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Staking Investments</h1>
                <p className="text-gray-400 mt-1">Review all your past and current staking positions.</p>
                 <div className="mt-4">
                     <input
                        type="text"
                        placeholder="Search by pool name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </header>
            <div className="flex-grow overflow-y-auto">
                {filteredStakes.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        {searchTerm ? `No investments found for "${searchTerm}".` : "You have no staking investments."}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredStakes.map(stake => (
                            <div key={stake.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <div className="flex flex-wrap justify-between items-center gap-2">
                                    <span className="font-bold text-lg text-white truncate max-w-xs">{getPoolTitle(stake.poolId)}</span>
                                    <span className="font-mono text-lg text-blue-400">
                                        {stake.amount.toLocaleString()} {stake.currency}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                    Staked on: {new Date(stake.stakedAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StakingHistoryPage;