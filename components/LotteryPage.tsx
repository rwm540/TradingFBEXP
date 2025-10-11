import React from 'react';
import LotteryCard from './LotteryCard';
import type { LotteryPool, TradingCurrency, UserLotteryTicket } from '../types';
import type { TradingMode } from '../App';

interface LotteryPageProps {
    pools: LotteryPool[];
    userTickets: UserLotteryTicket[];
    onBuyTickets: (poolId: string, ticketCount: number, currency: string) => void;
    balance: number;
    selectedTradingCurrency: TradingCurrency;
    tradingMode: TradingMode;
    isWalletConnected: boolean;
    onConnectWallet: () => void;
}

const LotteryPage: React.FC<LotteryPageProps> = ({ 
    pools, userTickets, onBuyTickets, balance, selectedTradingCurrency, 
    tradingMode, isWalletConnected, onConnectWallet 
}) => {
    return (
        <div className="flex flex-col gap-4">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Lottery Draws</h1>
                <p className="text-gray-400 mt-1">Buy tickets for a chance to win big prizes. The more tickets you buy, the higher your chances!</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {pools.map(pool => {
                    const userTicketData = userTickets.find(t => t.poolId === pool.id);
                    const userTicketCount = userTicketData?.numberOfTickets ?? 0;
                    const userWinsCount = userTicketData?.winsCount ?? 0;
                    return (
                        <LotteryCard
                            key={pool.id}
                            pool={pool}
                            userTicketCount={userTicketCount}
                            userWinsCount={userWinsCount}
                            onBuyTickets={onBuyTickets}
                            balance={balance}
                            selectedTradingCurrency={selectedTradingCurrency}
                            tradingMode={tradingMode}
                            isWalletConnected={isWalletConnected}
                            onConnectWallet={onConnectWallet}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default LotteryPage;