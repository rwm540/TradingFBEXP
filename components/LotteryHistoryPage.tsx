import React, { useState, useMemo } from 'react';
import type { UserLotteryTicket, LotteryPool } from '../types';

interface LotteryHistoryPageProps {
    userLotteryTickets: UserLotteryTicket[];
    lotteryPools: LotteryPool[];
}

const LotteryHistoryPage: React.FC<LotteryHistoryPageProps> = ({ userLotteryTickets, lotteryPools }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getPoolInfo = (poolId: string) => {
        return lotteryPools.find(p => p.id === poolId);
    };

    const filteredTickets = useMemo(() => {
        if (!searchTerm) {
            return userLotteryTickets;
        }
        return userLotteryTickets.filter(ticket => {
            const pool = getPoolInfo(ticket.poolId);
            return pool ? pool.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        });
    }, [searchTerm, userLotteryTickets, lotteryPools]);

    return (
        <div className="bg-[#161B22] p-4 sm:p-6 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Lottery History</h1>
                <p className="text-gray-400 mt-1">Review all your lottery ticket purchases.</p>
                <div className="mt-4">
                     <input
                        type="text"
                        placeholder="Search by lottery name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </header>
            <div className="flex-grow overflow-y-auto">
                {filteredTickets.length === 0 ? (
                     <div className="text-center py-20 text-gray-500">
                        {searchTerm ? `No tickets found for "${searchTerm}".` : "You have not purchased any lottery tickets."}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTickets.map(ticket => {
                            const pool = getPoolInfo(ticket.poolId);
                            if (!pool) return null;

                            const isWinner = (ticket.winsCount ?? 0) > 0;
                            const statusColor = pool.status === 'completed' ? (isWinner ? 'border-green-500' : 'border-red-500') : 'border-gray-700';
                            
                            return (
                                <div key={ticket.poolId} className={`p-4 bg-gray-800 rounded-lg border ${statusColor} hover:bg-gray-700/50 transition-colors`}>
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <span className="font-bold text-lg text-white truncate max-w-xs">{pool.title}</span>
                                        <span className="font-mono text-lg text-purple-400">
                                            {ticket.numberOfTickets} Ticket{ticket.numberOfTickets !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2 flex justify-between items-center">
                                        <span>Status: <span className={`font-semibold ${pool.status === 'completed' ? 'text-yellow-400' : 'text-green-400'}`}>{pool.status}</span></span>
                                        {pool.status === 'completed' && (
                                            isWinner ?
                                            <span className="font-bold text-green-400">You Won! ({ticket.winsCount} prize{ticket.winsCount! > 1 ? 's' : ''})</span> :
                                            <span className="text-red-400">Not a winner</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LotteryHistoryPage;