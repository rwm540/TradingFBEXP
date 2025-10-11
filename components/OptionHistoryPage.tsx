import React, { useState, useMemo } from 'react';
import type { OptionTrade } from '../types';
import { formatPrice } from '../utils/formatting';

interface OptionHistoryPageProps {
    optionTradeHistory: OptionTrade[];
}

const OptionHistoryPage: React.FC<OptionHistoryPageProps> = ({ optionTradeHistory }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHistory = useMemo(() => {
        if (!searchTerm) {
            return optionTradeHistory;
        }
        return optionTradeHistory.filter(trade => 
            trade.pair.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, optionTradeHistory]);

    return (
        <div className="bg-[#161B22] p-4 sm:p-6 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Option Trade History</h1>
                <p className="text-gray-400 mt-1">Review all your past option trades.</p>
                <div className="mt-4">
                     <input
                        type="text"
                        placeholder="Search by pair (e.g., BTC/USD)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </header>
            <div className="flex-grow overflow-y-auto">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        {searchTerm ? `No option trades found for "${searchTerm}".` : "No option trade history found."}
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-4 py-3">Pair</th>
                                <th scope="col" className="px-4 py-3">Direction</th>
                                <th scope="col" className="px-4 py-3">Amount</th>
                                <th scope="col" className="px-4 py-3">Entry Price</th>
                                <th scope="col" className="px-4 py-3">Close Price</th>
                                <th scope="col" className="px-4 py-3">Result</th>
                                <th scope="col" className="px-4 py-3">Profit %</th>
                                <th scope="col" className="px-4 py-3">Profit/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((trade) => {
                                const resultColor = trade.status === 'Won' ? 'text-green-500' : 'text-red-500';
                                const profitPercent = trade.status === 'Won' ? `+${trade.profitPercentage}%` : '-100%';
                                return (
                                     <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="px-4 py-3 text-white font-medium">{trade.pair}</td>
                                        <td className={`px-4 py-3 font-bold ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.type === 'Buy' ? 'Higher' : 'Lower'}</td>
                                        <td className="px-4 py-3">{trade.amount.toLocaleString('en-US', {minimumFractionDigits: 2})} {trade.currency}</td>
                                        <td className="px-4 py-3">{formatPrice(trade.pair, trade.entryPrice)}</td>
                                        <td className="px-4 py-3">{trade.closePrice ? formatPrice(trade.pair, trade.closePrice) : '-'}</td>
                                        <td className={`px-4 py-3 font-bold ${resultColor}`}>{trade.status}</td>
                                        <td className={`px-4 py-3 font-mono ${resultColor}`}>{profitPercent}</td>
                                        <td className={`px-4 py-3 font-mono ${resultColor}`}>{trade.profit?.toLocaleString('en-US', {minimumFractionDigits: 2})} {trade.currency}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OptionHistoryPage;