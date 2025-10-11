import React, { useState } from 'react';
import { Trade } from '../types';

interface HistoryPanelProps {
    openOrders: Trade[];
    tradeHistory: Trade[];
    livePrices: Map<string, number>;
    onCloseOrder: (tradeId: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ openOrders, tradeHistory, livePrices, onCloseOrder }) => {
    const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

    const renderPositions = () => {
        if (openOrders.length === 0) {
            return <div className="text-center py-10 text-gray-500">No open positions.</div>;
        }
        return (
             <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-4 py-3">Pair</th>
                        <th scope="col" className="px-4 py-3">Type</th>
                        <th scope="col" className="px-4 py-3">Margin</th>
                        <th scope="col" className="px-4 py-3">Leverage</th>
                        <th scope="col" className="px-4 py-3">Size</th>
                        <th scope="col" className="px-4 py-3">Entry Price</th>
                        <th scope="col" className="px-4 py-3">P/L (USD)</th>
                        <th scope="col" className="px-4 py-3">Time</th>
                        <th scope="col" className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {openOrders.map((trade) => {
                        const currentPrice = livePrices.get(trade.pair);
                        let pnl: number | null = null;

                        if (currentPrice) {
                            if (trade.type === 'Buy') {
                                pnl = (currentPrice - trade.price) * trade.amount;
                            } else { // 'Sell'
                                pnl = (trade.price - currentPrice) * trade.amount;
                            }
                        }
                        
                        const pnlColor = pnl === null ? 'text-gray-400' : pnl >= 0 ? 'text-green-500' : 'text-red-500';
                        const [tradeBaseCurrency] = trade.pair.split('/');

                        return (
                            <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-800">
                                <td className="px-4 py-3 text-white font-medium">{trade.pair}</td>
                                <td className={`px-4 py-3 font-bold ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.type}</td>
                                <td className="px-4 py-3">{trade.margin.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                <td className="px-4 py-3">{trade.leverage}x</td>
                                <td className="px-4 py-3">{trade.amount.toFixed(4)} {tradeBaseCurrency}</td>
                                <td className="px-4 py-3">{trade.price.toFixed(4)}</td>
                                <td className={`px-4 py-3 font-mono ${pnlColor}`}>{pnl !== null ? pnl.toFixed(2) : '-'}</td>
                                <td className="px-4 py-3">{trade.time}</td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onCloseOrder(trade.id)}
                                        className="text-xs bg-gray-700 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

     const renderHistory = () => {
        if (tradeHistory.length === 0) {
            return <div className="text-center py-10 text-gray-500">No trade history.</div>;
        }
        return (
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-4 py-3">Pair</th>
                        <th scope="col" className="px-4 py-3">Type</th>
                        <th scope="col" className="px-4 py-3">Margin</th>
                        <th scope="col" className="px-4 py-3">Leverage</th>
                        <th scope="col" className="px-4 py-3">Entry Price</th>
                        <th scope="col" className="px-4 py-3">Close Price</th>
                        <th scope="col" className="px-4 py-3">P/L (USD)</th>
                        <th scope="col" className="px-4 py-3">Close Time</th>
                    </tr>
                </thead>
                <tbody>
                    {tradeHistory.map((trade) => {
                        const pnlColor = trade.pnl === undefined ? 'text-gray-400' : trade.pnl >= 0 ? 'text-green-500' : 'text-red-500';
                        return (
                             <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-800">
                                <td className="px-4 py-3 text-white font-medium">{trade.pair}</td>
                                <td className={`px-4 py-3 font-bold ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.type}</td>
                                <td className="px-4 py-3">{trade.margin.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                <td className="px-4 py-3">{trade.leverage}x</td>
                                <td className="px-4 py-3">{trade.price.toFixed(4)}</td>
                                <td className="px-4 py-3">{trade.closePrice?.toFixed(4) || '-'}</td>
                                <td className={`px-4 py-3 font-mono ${pnlColor}`}>{trade.pnl?.toFixed(2) ?? '-'}</td>
                                <td className="px-4 py-3">{trade.closeTime}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div className="bg-[#161B22] p-4 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setActiveTab('positions')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'positions' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>Positions ({openOrders.length})</button>
                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'history' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>Trade History</button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'positions' ? renderPositions() : renderHistory()}
            </div>
        </div>
    );
};

export default HistoryPanel;