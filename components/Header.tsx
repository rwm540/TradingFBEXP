import React, { useState, useRef, useEffect } from 'react';
import type { TradingMode, View } from '../App';
import type { Currency, TradingCurrency } from '../types';
import CurrencySelector from './CurrencySelector';
import { allTradablePairs } from '../constants';

interface HeaderProps {
    tradingMode: TradingMode;
    onModeChange: (mode: TradingMode) => void;
    isWalletConnected: boolean;
    onConnectWallet: () => void;
    onDisconnectWallet: () => void;
    balances: Record<TradingCurrency, number>;
    selectedTradingCurrency: TradingCurrency;
    onCurrencyChange: (currency: TradingCurrency) => void;
    view: View;
    onViewChange: (view: View) => void;
    onToggleSidebar: () => void;
}

const NavLink: React.FC<{
    currentView?: View;
    view?: View;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ currentView, view, onClick, children }) => {
    const isActive = view && currentView === view;
    return (
        <button 
            onClick={onClick} 
            className={`block md:inline-block w-full text-left md:text-center px-4 py-2 md:py-0 text-gray-300 hover:text-white transition-colors ${isActive ? 'text-blue-400 font-bold' : ''}`}
        >
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ 
    tradingMode, onModeChange, isWalletConnected, onConnectWallet, onDisconnectWallet, 
    balances, selectedTradingCurrency, onCurrencyChange, 
    view, onViewChange, onToggleSidebar,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const currencyDropdownRef = useRef<HTMLDivElement>(null);
    
    const handleLinkClick = (newView: View) => {
        onViewChange(newView);
        setIsMenuOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
                setIsCurrencyDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const balance = balances[selectedTradingCurrency] ?? 0;
    const balanceColor = tradingMode === 'demo' ? 'text-green-400' : 'text-yellow-400';
    
    return (
        <header className="bg-[#161B22] border-b border-gray-700 p-4 flex justify-between items-center relative">
            <div className="flex items-center space-x-4 flex-1">
                <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-700 md:mr-2" aria-label="Open sidebar">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">FBEXP</h1>
                <nav className="hidden md:flex items-center space-x-2">
                    <NavLink currentView={view} view='trade' onClick={() => handleLinkClick('trade')}>Trade</NavLink>
                    <NavLink currentView={view} view='tradeOption' onClick={() => handleLinkClick('tradeOption')}>TradeOption</NavLink>
                    <NavLink currentView={view} view='wallet' onClick={() => handleLinkClick('wallet')}>Wallet</NavLink>
                    <NavLink currentView={view} view='stacking' onClick={() => handleLinkClick('stacking')}>Stacking</NavLink>
                    <NavLink currentView={view} view='lottery' onClick={() => handleLinkClick('lottery')}>Lottery</NavLink>
                </nav>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                    </svg>
                </button>
            </div>
            
             {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#1c2128] border border-gray-700 rounded-lg shadow-lg md:hidden z-20">
                    <nav className="flex flex-col p-2 space-y-1">
                        <NavLink currentView={view} view='trade' onClick={() => handleLinkClick('trade')}>Trade</NavLink>
                        <NavLink currentView={view} view='tradeOption' onClick={() => handleLinkClick('tradeOption')}>TradeOption</NavLink>
                        <NavLink currentView={view} view='wallet' onClick={() => handleLinkClick('wallet')}>Wallet</NavLink>
                        <NavLink currentView={view} view='stacking' onClick={() => handleLinkClick('stacking')}>Stacking</NavLink>
                        <NavLink currentView={view} view='lottery' onClick={() => handleLinkClick('lottery')}>Lottery</NavLink>
                    </nav>
                </div>
            )}

            <div className="hidden md:flex items-center space-x-4">
                 {/* Balance and Currency Selector Dropdown */}
                <div className="flex items-center space-x-3 bg-gray-900 px-3 py-2 rounded-lg">
                    <div className="text-right">
                        <span className="text-xs text-gray-400 uppercase">{tradingMode} Balance</span>
                        <p className={`font-bold text-lg ${balanceColor}`}>
                            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </p>
                    </div>
                     <div className="relative" ref={currencyDropdownRef}>
                        <button
                            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                            className="flex items-center space-x-2 bg-gray-800 rounded-full p-1 pl-3 hover:bg-gray-700 transition-colors"
                        >
                            <span className="font-bold text-sm text-white">{selectedTradingCurrency}</span>
                             <svg className={`w-4 h-4 text-gray-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {isCurrencyDropdownOpen && (
                             <div className="absolute z-20 mt-2 right-0 w-48 bg-[#1c2128] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {Object.keys(balances).map(currency => (
                                    <button 
                                        key={currency} 
                                        onClick={() => { onCurrencyChange(currency); setIsCurrencyDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                    >
                                        {currency}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Mode Switch */}
                <div className="flex items-center bg-gray-900 rounded-full p-1">
                    <button 
                        onClick={() => onModeChange('demo')}
                        className={`px-3 py-1 text-sm font-bold rounded-full ${tradingMode === 'demo' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
                    >
                        Demo
                    </button>
                    <button 
                        onClick={() => onModeChange('live')}
                        className={`px-3 py-1 text-sm font-bold rounded-full ${tradingMode === 'live' ? 'bg-green-500 text-white' : 'text-gray-400'}`}
                    >
                        Live
                    </button>
                </div>
                {/* Wallet Button */}
                 {isWalletConnected ? (
                    <button 
                        onClick={onDisconnectWallet} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Disconnect
                    </button>
                ) : (
                    <button 
                        onClick={onConnectWallet} 
                        className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;