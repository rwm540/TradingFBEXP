import React, { useState, useEffect } from 'react';
import type { LotteryPool, TradingCurrency } from '../types';
import type { TradingMode } from '../App';

// Re-using the icon logic from WalletModal for consistency
const UTokenIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-xs">U</div>;
const BitcoinIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-800"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F7931A]" fill="currentColor"><title>Bitcoin</title><path d="M11.522 18.22v-3.047c.99.03 1.94-.132 2.825-.49a5.15 5.15 0 002.13-1.742 4.96 4.96 0 00.83-2.735 4.96 4.96 0 00-.83-2.735 5.15 5.15 0 00-2.13-1.742 6.55 6.55 0 00-2.825-.49V2.195l1.68.012.012-1.68-1.68-.012L11.534.5H9.86v2.338c-.818.06-1.624.232-2.383.508a5.55 5.55 0 00-2.07 1.488 5.4 5.4 0 00-1.2 3.825c0 1.29.33 2.49.99 3.6.66 1.11 1.545 1.943 2.655 2.5a6.45 6.45 0 003.015.758v3.137l-3.3-1.425v2.31l3.3 1.395v1.8l-1.68-.012-.012 1.68 1.68.012v.66H11.522v-.66zm-1.662-7.567a2.62 2.62 0 011.665-2.52 3.1 3.1 0 013.165.945 3.1 3.1 0 01.945 3.165 3.1 3.1 0 01-.945 3.165c-.58.59-1.32.968-2.145 1.125a2.62 2.62 0 01-2.52-1.665 2.62 2.62 0 01-.165-1.545 2.62 2.62 0 01.0-1.665z" /></svg></div>;
const EthereumIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#3C3C3D]"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor"><title>Ethereum</title><path d="M11.944 17.97L4.58 13.62l7.364 4.354zm.112 0l7.365-4.354-7.365 4.354zM12 19.548L4.58 14.88l7.42 5.244 7.42-5.245-7.42 4.668zM4.58 12.553l7.364-4.42-7.364 4.42zm7.518-.002l7.365-4.42-7.365 4.42zM12 4.45L4.58 9.073 12 13.62l7.42-4.545L12 4.45z"/></svg></div>;
const DogeIcon = () => <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F2CB63]"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor"><title>Dogecoin</title><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-2.88-5.344a.42.42 0 0 1-.41-.532l1.242-4.148-3.957 2.08a.42.42 0 0 1-.58-.337L5.22 12.5a.42.42 0 0 1 .521-.45l4.135 1.258 2.09-3.95a.42.42 0 0 1 .71-.16l5.22 5.22a.42.42 0 0 1-.297.71l-5.343-1.29-2.07 3.93a.42.42 0 0 1-.37.286zm4.84-5.344c-.443 0-.803.36-.803.804s.36.803.803.803.804-.36.804-.803a.803.803 0 0 0-.804-.804z"/></svg></div>;

const getAssetIcon = (symbol: string): React.ReactNode => {
    switch(symbol) {
        case 'UT': return <UTokenIcon />;
        case 'BTC': return <BitcoinIcon />;
        case 'ETH': return <EthereumIcon />;
        case 'DOGE': return <DogeIcon />;
        case 'EUR': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">€</div>;
        case 'USD': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-xs">$</div>;
        case 'JPY': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs">¥</div>;
        case 'GBP': return <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">£</div>;
        default: return <div className="h-8 w-8 rounded-full bg-gray-600"></div>;
    }
};

interface LotteryCardProps {
    pool: LotteryPool;
    userTicketCount: number;
    userWinsCount: number;
    onBuyTickets: (poolId: string, ticketCount: number, currency: string) => void;
    balance: number;
    selectedTradingCurrency: TradingCurrency;
    tradingMode: TradingMode;
    isWalletConnected: boolean;
    onConnectWallet: () => void;
}

const LotteryCard: React.FC<LotteryCardProps> = ({
    pool, userTicketCount, userWinsCount, onBuyTickets, balance, selectedTradingCurrency,
    tradingMode, isWalletConnected, onConnectWallet
}) => {
    const [ticketAmount, setTicketAmount] = useState('');
    const [timeLeft, setTimeLeft] = useState(pool.drawDate ? pool.drawDate - Date.now() : 0);

    useEffect(() => {
        if (pool.type !== 'time' || !pool.drawDate) return;

        const interval = setInterval(() => {
            const remaining = pool.drawDate! - Date.now();
            setTimeLeft(remaining > 0 ? remaining : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, [pool.drawDate, pool.type]);

    const isComplete = pool.status === 'completed';
    const progress = Math.min((pool.ticketsSold / pool.totalTickets) * 100, 100);

    const handleBuyClick = () => {
        const amount = parseInt(ticketAmount, 10);
        if (!isNaN(amount) && amount > 0) {
            onBuyTickets(pool.id, amount, selectedTradingCurrency);
            setTicketAmount('');
        }
    };
    
    const formatTimeLeft = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    };
    
    const renderBuyForm = () => {
        const areTicketsSoldOut = pool.ticketsSold >= pool.totalTickets;
        const totalCost = ticketAmount && !isNaN(parseInt(ticketAmount)) && parseInt(ticketAmount) > 0 ? parseInt(ticketAmount, 10) * pool.ticketPrice : 0;
        
        const renderActionButton = () => {
            if (tradingMode === 'live' && !isWalletConnected) {
                return <button onClick={onConnectWallet} className="w-full py-3 mt-2 font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300">Connect Wallet</button>;
            }
            
            return (
                <button
                    onClick={handleBuyClick}
                    disabled={areTicketsSoldOut}
                    className="w-full py-3 mt-2 font-bold text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {areTicketsSoldOut ? 'Sold Out' : 'Buy Tickets'}
                </button>
            );
        };
        
        return (
             <div>
                 <div className="text-right text-xs mb-2">
                    <span className="text-gray-400">Your Balance: </span>
                    <span className="font-mono text-white font-bold">{balance.toLocaleString('en-US', {minimumFractionDigits: 2})} {selectedTradingCurrency}</span>
                </div>
                <div className="relative">
                     <input
                        type="number"
                        value={ticketAmount}
                        onChange={(e) => setTicketAmount(e.target.value)}
                        placeholder="Number of tickets"
                        min="1"
                        disabled={areTicketsSoldOut}
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono disabled:bg-gray-800"
                    />
                </div>
                {totalCost > 0 && (
                    <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-400">Total Cost:</span>
                        <span className="font-mono text-white font-bold">
                            {totalCost.toLocaleString()} {pool.currency}
                        </span>
                    </div>
                )}
                {renderActionButton()}
            </div>
        );
    };

    const renderResults = () => (
        <div className="text-center py-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h4 className="font-bold text-xl text-yellow-400">Draw Complete!</h4>
            <div className="mt-3 text-sm space-y-1 px-4">
                <div className="flex justify-between"><span className="text-gray-400">Total Prize Pool:</span> <span className="text-white font-mono">{pool.totalPrizePool?.toLocaleString()} {pool.currency}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Prize Per Winner:</span> <span className="text-white font-mono">{pool.prizePerWinner?.toLocaleString()} {pool.currency}</span></div>
            </div>
            {userTicketCount > 0 && (
                <div className={`mt-4 pt-3 border-t border-gray-700 mx-4 ${userWinsCount > 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {userWinsCount > 0 ? (
                        <div>
                           <p className="font-bold text-lg">Congratulations, you won!</p>
                           <p className="text-sm">You won {userWinsCount} prize{userWinsCount > 1 ? 's' : ''}.</p>
                        </div>
                    ) : (
                        <p className="font-semibold">Better luck next time!</p>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-[#161B22] rounded-lg border border-gray-700 p-6 flex flex-col gap-4 shadow-lg hover:shadow-purple-500/20 transition-shadow">
            <header className="flex items-center gap-4">
                 <div className="border-2 border-[#161B22] rounded-full">
                    {getAssetIcon(pool.prizeIcon)}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{pool.title}</h3>
                    <p className="text-sm text-purple-400 font-semibold">{pool.numberOfWinners} Winner{pool.numberOfWinners > 1 ? 's' : ''}</p>
                </div>
            </header>
            
            <div>
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-400">Tickets Sold</span>
                    <span className="font-mono text-white">
                        {pool.ticketsSold.toLocaleString()} / {pool.totalTickets.toLocaleString()}
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm border-t border-b border-gray-700 py-4">
                 <div className="flex justify-between">
                    <span className="text-gray-400">Ticket Price:</span> 
                    <span className="text-white font-mono font-bold">{pool.ticketPrice.toLocaleString()} {pool.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">{isComplete ? 'Status:' : (pool.type === 'time' ? 'Draws In:' : 'Draws:')}</span>
                    <span className={`font-mono font-bold ${isComplete ? 'text-red-500' : 'text-yellow-400'}`}>
                        {isComplete ? 'CLOSED' : (pool.type === 'time' ? formatTimeLeft(timeLeft) : 'WHEN ALL TICKETS ARE SOLD')}
                    </span>
                </div>
            </div>
            
            {isComplete ? renderResults() : renderBuyForm()}

            {userTicketCount > 0 && (
                 <div className="mt-2 text-center bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                    <p className="flex justify-center items-baseline gap-2 flex-wrap text-base text-gray-300">
                        <span>You have</span>
                        <span className="font-bold text-xl text-white">{userTicketCount.toLocaleString()}</span>
                        <span>ticket{userTicketCount > 1 ? 's' : ''} in this draw.</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default LotteryCard;