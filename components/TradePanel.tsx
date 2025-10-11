import React, { useState, useEffect, useRef } from 'react';
// FIX: Import the 'TradingMode' type from '../App' to resolve the 'Cannot find name' error.
import type { TradingMode } from '../App';
import type { Currency, NewOrderRequest, TradingCurrency } from '../types';
import { allTradablePairs } from '../constants';
import { formatPrice } from '../utils/formatting';
import CurrencySelector from './CurrencySelector';

interface TradePanelProps {
    selectedPair: Currency;
    onPairChange: (pair: Currency) => void;
    livePrice: number | null;
    tradingMode: TradingMode;
    balance: number;
    isWalletConnected: boolean;
    onPlaceOrder: (order: NewOrderRequest) => void;
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

const TradePanel: React.FC<TradePanelProps> = ({ 
    selectedPair, onPairChange, livePrice, tradingMode, balance, isWalletConnected, 
    onPlaceOrder, onConnectWallet, onFundClick,
    selectedTradingCurrency
}) => {
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [margin, setMargin] = useState('');
    const [leverage, setLeverage] = useState(1);
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
    
    useEffect(() => {
        setMargin('');
    }, [selectedPair]);

    const handleTrade = () => {
        // Validation and confirmation is now handled in App.tsx to use modals
        onPlaceOrder({
            pair: selectedPair.value,
            type: tradeType === 'buy' ? 'Buy' : 'Sell',
            margin: parseFloat(margin) || 0, // Pass 0 if input is empty/invalid
            leverage: leverage,
            currency: selectedTradingCurrency,
        });
        setMargin('');
    };

    const priceFlashColor = priceFlash === 'up' ? 'text-green-500' : priceFlash === 'down' ? 'text-red-500' : 'text-white';
    const buttonBg = tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-500';
    const [baseCurrency] = selectedPair.value.split('/');

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
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {baseCurrency}
            </button>
        );
    }
    
    const positionValue = margin && !isNaN(parseFloat(margin)) ? (parseFloat(margin) * leverage) : 0;

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
                        Buy
                    </button>
                    <button
                        onClick={() => setTradeType('sell')}
                        className={`w-1/2 py-2 text-center font-bold rounded-r-md ${tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                        Sell
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="margin" className="block text-sm font-medium text-gray-400 mb-1">Margin</label>
                        <div className="relative">
                            <input
                                type="number"
                                id="margin"
                                value={margin}
                                onChange={(e) => setMargin(e.target.value)}
                                placeholder="100.00"
                                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">{selectedTradingCurrency}</span>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="leverage" className="block text-sm font-medium text-gray-400 mb-1">Leverage: <span className="font-bold text-white">{leverage}x</span></label>
                        <input
                            id="leverage"
                            type="range"
                            min="1"
                            max="1000"
                            step="1"
                            value={leverage}
                            onChange={(e) => setLeverage(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Market Price: <span className={`font-mono transition-colors duration-200 ${priceFlashColor}`}>{livePrice ? formatPrice(selectedPair.value, livePrice) : '...'}</span></p>
                    </div>
                    {renderActionButton()}
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400">
                <div className="flex justify-between">
                    <span>Position Value:</span>
                    <span className="text-white font-mono">
                         {positionValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedTradingCurrency}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TradePanel;