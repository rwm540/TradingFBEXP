import React, { useState, useEffect, useRef } from 'react';
import type { TradingMode } from '../App';
import type { Currency, NewOptionOrderRequest, AssetType, TradingCurrency } from '../types';
import { allTradablePairs } from '../constants';
import { formatPrice } from '../utils/formatting';
import CurrencySelector from './CurrencySelector';

interface TradeOptionPanelProps {
    selectedPair: Currency;
    onPairChange: (pair: Currency) => void;
    livePrice: number | null;
    tradingMode: TradingMode;
    balance: number;
    isWalletConnected: boolean;
    onPlaceOptionOrder: (order: NewOptionOrderRequest) => void;
    onConnectWallet: () => void;
    onFundClick: () => void;
    selectedTradingCurrency: TradingCurrency;
}

// Custom hook to get the previous value of a prop or state
function usePrevious(value: number | null) {
  // FIX: Initialize useRef with null to provide a clear initial value and avoid potential undefined type issues.
  const ref = useRef<number | null>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


const TradeOptionPanel: React.FC<TradeOptionPanelProps> = ({ 
    selectedPair, onPairChange, livePrice, tradingMode, balance, isWalletConnected, 
    onPlaceOptionOrder, onConnectWallet, onFundClick,
    selectedTradingCurrency
}) => {
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState(30); // in seconds
    const [profitPercentage, setProfitPercentage] = useState(120);
    const [priceFlash, setPriceFlash] = useState<'up' | 'down' | 'none'>('none');

    const prevPrice = usePrevious(livePrice);

    useEffect(() => {
        if (prevPrice !== null && livePrice !== null) {
            if (livePrice > prevPrice) {
                setPriceFlash('up');
            } else if (livePrice < prevPrice) {
                setPriceFlash('down');
            }
            const timer = setTimeout(() => setPriceFlash('none'), 300);
            return () => clearTimeout(timer);
        }
    }, [livePrice, prevPrice]);

    const handleTrade = () => {
        onPlaceOptionOrder({
            pair: selectedPair.value,
            type: tradeType === 'buy' ? 'Buy' : 'Sell',
            amount: parseFloat(amount) || 0,
            duration: duration,
            profitPercentage: profitPercentage,
            currency: selectedTradingCurrency,
        });
        setAmount('');
    };

    const priceFlashColor = priceFlash === 'up' ? 'text-green-500' : priceFlash === 'down' ? 'text-red-500' : 'text-white';
    const buttonBg = tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-500';

    const durationOptions = [
        { label: '30s', value: 30 }, { label: '1m', value: 60 }, { label: '5m', value: 300 },
        { label: '10m', value: 600 }, { label: '15m', value: 900 }, { label: '30m', value: 1800 },
        { label: '1H', value: 3600 }, { label: '2H', value: 7200 }, { label: '3H', value: 10800 },
        { label: '4H', value: 14400 }, { label: '1D', value: 86400 }, { label: '2D', value: 172800 },
        { label: '3D', value: 259200 }, { label: '4D', value: 345600 }, { label: '5D', value: 432000 },
        { label: '6D', value: 518400 }, { label: '7D', value: 604800 },
    ];
    
    const profit = amount && !isNaN(parseFloat(amount)) ? (parseFloat(amount) * (profitPercentage / 100)) : 0;
    const payout = amount && !isNaN(parseFloat(amount)) ? (parseFloat(amount) + profit) : 0;

    const renderActionButton = () => {
        if (tradingMode === 'live' && !isWalletConnected) {
            return <button onClick={onConnectWallet} className="w-full py-3 font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300">Connect Wallet</button>;
        }
        if (tradingMode === 'live' && isWalletConnected && balance === 0) {
            return <button onClick={onFundClick} className="w-full py-3 font-bold text-white rounded-lg bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300">Fund Account</button>;
        }

        return (
            <button
                onClick={handleTrade}
                className={`w-full py-3 font-bold text-white rounded-lg ${buttonBg} transition-colors duration-300`}
            >
                {tradeType === 'buy' ? 'Higher' : 'Lower'}
            </button>
        );
    }
    
    return (
        <div className="bg-[#161B22] p-4 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <div className="pb-4 border-b border-gray-700">
                <CurrencySelector 
                    selectedPair={selectedPair}
                    onPairChange={onPairChange}
                    pairs={allTradablePairs}
                />
            </div>

             <div className="flex-grow overflow-y-auto pr-2 -mr-2 mt-4">
                 <div className="text-right text-sm mb-4">
                    <span className="text-gray-400">Balance: </span>
                    <span className="font-mono text-white font-bold">{balance.toLocaleString('en-US', {minimumFractionDigits: 2})} {selectedTradingCurrency}</span>
                </div>

                <div className="flex my-4">
                    <button 
                        onClick={() => setTradeType('buy')}
                        className={`w-1/2 py-2 text-center font-bold rounded-l-md ${tradeType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                        Higher
                    </button>
                    <button
                        onClick={() => setTradeType('sell')}
                        className={`w-1/2 py-2 text-center font-bold rounded-r-md ${tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                        Lower
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                        <div className="relative">
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="10.00"
                                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">{selectedTradingCurrency}</span>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                         <div className="max-h-24 overflow-y-auto pr-2 -mr-4 space-y-2">
                             <div className="grid grid-cols-4 gap-2">
                                {durationOptions.map(opt => (
                                    <button key={opt.value} onClick={() => setDuration(opt.value)} className={`w-full py-2 rounded-md text-xs font-bold ${duration === opt.value ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="profitPercentage" className="block text-sm font-medium text-gray-400 mb-1">Profit: <span className="font-bold text-white">{profitPercentage}%</span></label>
                        <input
                            id="profitPercentage"
                            type="range"
                            min="10"
                            max="300"
                            step="5"
                            value={profitPercentage}
                            onChange={(e) => setProfitPercentage(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Market Price: <span className={`font-mono transition-colors duration-200 ${priceFlashColor}`}>{livePrice ? formatPrice(selectedPair.value, livePrice) : '...'}</span></p>
                    </div>
                    {renderActionButton()}
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400 space-y-1">
                <div className="flex justify-between">
                    <span>Profit ({profitPercentage}%):</span>
                    <span className="text-green-400 font-mono font-bold">
                        +{profit.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedTradingCurrency}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Potential Payout:</span>
                    <span className="text-white font-mono font-bold">
                         {payout.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedTradingCurrency}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TradeOptionPanel;