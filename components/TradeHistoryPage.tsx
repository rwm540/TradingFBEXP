import React, { useState, useMemo } from 'react';
import type { Trade } from '../types';
import { formatPrice } from '../utils/formatting';

interface TradeHistoryPageProps {
    tradeHistory: Trade[];
}

const TradeHistoryPage: React.FC<TradeHistoryPageProps> = ({ tradeHistory }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHistory = useMemo(() => {
        if (!searchTerm) {
            return tradeHistory;
        }
        return tradeHistory.filter(trade => 
            trade.pair.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, tradeHistory]);

    return (
        <div className="bg-[#161B22] p-4 sm:p-6 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Trade History</h1>
                <p className="text-gray-400 mt-1">Review all your past standard trades.</p>
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
                        {searchTerm ? `No trades found for "${searchTerm}".` : "No trade history found."}
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-4 py-3">Pair</th>
                                <th scope="col" className="px-4 py-3">Type</th>
                                <th scope="col" className="px-4 py-3">Margin</th>
                                <th scope="col" className="px-4 py-3">Leverage</th>
                                <th scope="col" className="px-4 py-3">Entry Price</th>
                                <th scope="col" className="px-4 py-3">Close Price</th>
                                <th scope="col" className="px-4 py-3">P/L %</th>
                                <th scope="col" className="px-4 py-3">P/L (USD)</th>
                                <th scope="col" className="px-4 py-3">Close Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((trade) => {
                                const pnlColor = trade.pnlInUSD === undefined ? 'text-gray-400' : trade.pnlInUSD >= 0 ? 'text-green-500' : 'text-red-500';
                                const pnlPercent = trade.pnlInTradeCurrency !== undefined && trade.margin > 0 ? (trade.pnlInTradeCurrency / trade.margin) * 100 : 0;
                                return (
                                     <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="px-4 py-3 text-white font-medium">{trade.pair}</td>
                                        <td className={`px-4 py-3 font-bold ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.type}</td>
                                        <td className="px-4 py-3">{trade.margin.toFixed(2)} {trade.currency}</td>
                                        <td className="px-4 py-3">{trade.leverage}x</td>
                                        <td className="px-4 py-3">{formatPrice(trade.pair, trade.price)}</td>
                                        <td className="px-4 py-3">{trade.closePrice ? formatPrice(trade.pair, trade.closePrice) : '-'}</td>
                                        <td className={`px-4 py-3 font-mono ${pnlColor}`}>{pnlPercent.toFixed(2)}%</td>
                                        <td className={`px-4 py-3 font-mono ${pnlColor}`}>{trade.pnlInUSD?.toFixed(2) ?? '-'}</td>
                                        <td className="px-4 py-3">{trade.closeTime}</td>
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

export default TradeHistoryPage;