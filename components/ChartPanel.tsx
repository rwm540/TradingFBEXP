import React, { useEffect, useRef, memo } from 'react';
// FIX: Import the 'Currency' type from the central 'types.ts' file instead of defining it locally for consistency.
import type { Currency } from '../types';

interface ChartPanelProps {
    selectedPair: Currency;
}

const getTradingViewSymbol = (pair: string): string => {
    // This function maps your app's pair format to TradingView's symbol format.
    const mappings: { [key: string]: string } = {
        // Forex
        'EUR/USD': 'FX:EURUSD', 'GBP/USD': 'FX:GBPUSD', 'USD/JPY': 'FX:USDJPY',
        'USD/CHF': 'FX:USDCHF', 'USD/CAD': 'FX:USDCAD', 'AUD/USD': 'FX:AUDUSD',
        'NZD/USD': 'FX:NZDUSD',
        // Crypto - Using Coinbase for broad availability
        'BTC/USD': 'COINBASE:BTCUSD', 'ETH/USD': 'COINBASE:ETHUSD', 'SOL/USD': 'COINBASE:SOLUSD',
        'XRP/USD': 'COINBASE:XRPUSD', 'DOGE/USD': 'COINBASE:DOGEUSD', 'ADA/USD': 'COINBASE:ADAUSD',
        'BNB/USD': 'BINANCE:BNBUSD', 'TRX/USD': 'BINANCE:TRXUSD',
        // New Crypto Cross-Pairs
        'ETH/BTC': 'COINBASE:ETHBTC',
        'BNB/BTC': 'BINANCE:BNBBTC',
        'SOL/BTC': 'COINBASE:SOLBTC',
        'XRP/BTC': 'COINBASE:XRPBTC',
        'DOGE/BTC': 'COINBASE:DOGEBTC',
        'ADA/BTC': 'COINBASE:ADABTC',
        'TRX/BTC': 'BINANCE:TRXBTC',
        // Stocks / Indices
        'US100/USD': 'NASDAQ:NDX', 'US500/USD': 'SP:SPX', 'US30/USD': 'TVC:DJI',
        'AAPL/USD': 'NASDAQ:AAPL', 'GOOGL/USD': 'NASDAQ:GOOGL', 'TSLA/USD': 'NASDAQ:TSLA',
        'AMZN/USD': 'NASDAQ:AMZN',
        // Commodities
        'XAU/USD': 'OANDA:XAUUSD',
        'XAG/USD': 'OANDA:XAGUSD',
        'XAU/EUR': 'OANDA:XAUEUR',
        'XAG/EUR': 'OANDA:XAGEUR',
    };

    if (mappings[pair]) {
        return mappings[pair];
    }
    // Fallback for other forex pairs
    if (pair.includes('/')) {
        return `FX:${pair.replace('/', '')}`;
    }
    return pair;
};

const ChartPanel: React.FC<ChartPanelProps> = ({ selectedPair }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !selectedPair) {
            return;
        }

        const container = containerRef.current;
        
        // Use a timeout to ensure the container has its final dimensions before the script runs.
        // This can prevent race conditions and initialization errors with the TradingView widget.
        const timerId = setTimeout(() => {
            // Check if the container still exists before proceeding
            if (!containerRef.current) return;

            // Clear any previous widget before creating a new one
            container.innerHTML = '';

            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
            script.type = 'text/javascript';
            script.async = true;
            
            const widgetConfig = {
                "autosize": true,
                "symbol": getTradingViewSymbol(selectedPair.value),
                "interval": "15",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "withdateranges": true,
                "hide_side_toolbar": false,
                "allow_symbol_change": false, // Lock symbol to what's passed in
                "details": true,
                "hotlist": true,
                "calendar": true,
                "backgroundColor": "rgba(22, 27, 34, 1)", // Match #161B22
                "gridColor": "rgba(43, 43, 67, 0.6)", // Match #2B2B43
            };
            
            script.innerHTML = JSON.stringify(widgetConfig);
            
            container.appendChild(script);

        }, 0);

        // Cleanup function to clear timeout and widget on unmount or re-render
        return () => {
            clearTimeout(timerId);
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [selectedPair]);

    return (
        <div className="bg-[#161B22] p-4 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <div className="tradingview-widget-container h-full" ref={containerRef}>
                <div className="tradingview-widget-container__widget h-full"></div>
                {/* Widget script will be injected here */}
            </div>
        </div>
    );
};

// Use React.memo to prevent unnecessary re-renders if the props (selectedPair) haven't changed.
export default memo(ChartPanel);