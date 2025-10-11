import React, { useState, useEffect } from 'react';
import type { OptionTrade } from '../types';
import { formatPrice, formatDuration, formatDisplayDuration } from '../utils/formatting';

interface OptionHistoryPanelProps {
    openOptionOrders: OptionTrade[];
    optionTradeHistory: OptionTrade[];
}

const PositionRow: React.FC<{trade: OptionTrade}> = ({ trade }) => {
    const [timeLeft, setTimeLeft] = useState(Math.max(0, (trade.expiryTime - Date.now()) / 1000));

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = Math.max(0, (trade.expiryTime - Date.now()) / 1000);
            setTimeLeft(remaining);
            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [trade.expiryTime]);

    const potentialProfit = trade.amount * (trade.profitPercentage / 100);

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-800">
            <td className="px-4 py-3 text-white font-medium">{trade.pair}</td>
            <td className={`px-4 py-3 font-bold ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.type === 'Buy' ? 'Higher' : 'Lower'}</td>
            <td className="px-4 py-3">{trade.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
            <td className="px-4 py-3 font-mono text-green-400">
                {potentialProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </td>
            <td className="px-4 py-3">{formatPrice(trade.pair, trade.entryPrice)}</td>
            <td className="px-4 py-3">{formatDisplayDuration(trade.duration)}</td>
            <td className="px-f-4 py-3 font-mono text-yellow-400">{timeLeft > 60 ? formatDisplayDuration(timeLeft) : formatDuration(timeLeft)}</td>
        </tr>
    );
};


const OptionHistoryPanel: React.FC<OptionHistoryPanelProps> = ({ openOptionOrders, optionTradeHistory }) => {
    const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

    const renderPositions = () => {
        if (openOptionOrders.length === 0) {
            return <div className="text-center py-10 text-gray-500">No active option trades.</div>;
        }
        return (
             <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-4 py-3">Pair</th>
                        <th scope="col" className="px-4 py-3">Direction</th>
                        <th scope="col" className="px-4 py-3">Amount</th>
                        <th scope="col" className="px-4 py-3">Potential Profit</th>
                        <th scope="col" className="px-4 py-3">Entry Price</th>
                        <th scope="col" className="px-4 py-3">Duration</th>
                        <th scope="col" className="px-4 py-3">Time Left</th>
                    </tr>
                </thead>
                <tbody>
                    {openOptionOrders.map((trade) => <PositionRow key={trade.id} trade={trade} />)}
                </tbody>
            </table>
        );
    };

     const renderHistory = () => {
        if (optionTradeHistory.length === 0) {
            return <div className="text-center py-10 text-gray-500">No option trade history.</div>;
        }
        return (
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
                    {optionTradeHistory.map((trade) => {
                        const resultColor = trade.status === 'Won' ? 'text-green-500' : 'text-red-500';
                        const profitPercent = trade.status === 'Won' ? `+${trade.profitPercentage}%` : '-100%';
                        return (
                             <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-800">
                                <td className="px-4 py-3 text-white font-medium">{trade.pair}</td>
                                <td className={`px-4 py-3 font-bold ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.type === 'Buy' ? 'Higher' : 'Lower'}</td>
                                <td className="px-4 py-3">{trade.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                <td className="px-4 py-3">{formatPrice(trade.pair, trade.entryPrice)}</td>
                                <td className="px-4 py-3">{trade.closePrice ? formatPrice(trade.pair, trade.closePrice) : '-'}</td>
                                <td className={`px-4 py-3 font-bold ${resultColor}`}>{trade.status}</td>
                                <td className={`px-4 py-3 font-mono ${resultColor}`}>{profitPercent}</td>
                                <td className={`px-4 py-3 font-mono ${resultColor}`}>{trade.profit?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? '0.00'}</td>
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
                <button onClick={() => setActiveTab('positions')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'positions' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>Positions ({openOptionOrders.length})</button>
                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'history' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>Trade History</button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'positions' ? renderPositions() : renderHistory()}
            </div>
        </div>
    );
};

export default OptionHistoryPanel;