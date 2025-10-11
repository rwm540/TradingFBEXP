import React from 'react';
import type { View } from '../App';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onViewChange: (view: View) => void;
    totalBalanceUSD: number;
    tradeHistoryCount: number;
    optionHistoryCount: number;
    stakingHistoryCount: number;
    lotteryHistoryCount: number;
    walletHistoryCount: number;
}

const SidebarLink: React.FC<{
    children: React.ReactNode;
    count: number;
    onClick: () => void;
}> = ({ children, count, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-3 text-left text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
    >
        <span className="font-medium">{children}</span>
        <span className="text-xs bg-gray-600 text-gray-200 rounded-full px-2 py-0.5">{count}</span>
    </button>
);


const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, onClose, onViewChange, totalBalanceUSD,
    tradeHistoryCount, optionHistoryCount, stakingHistoryCount, lotteryHistoryCount, walletHistoryCount
}) => {
    
    const handleNavigation = (view: View) => {
        onViewChange(view);
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <aside
                className={`fixed top-0 left-0 h-full w-80 bg-[#161B22] border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
            >
                <div className="flex flex-col h-full">
                    {/* Header with Profile */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                U
                            </div>
                            <div>
                                <h2 id="sidebar-title" className="text-lg font-bold text-white">User One</h2>
                                <p className="text-sm font-mono text-gray-400">${totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl" aria-label="Close sidebar">&times;</button>
                    </div>

                    {/* Transaction Links */}
                    <div className="flex-grow overflow-y-auto p-2">
                        <nav className="flex flex-col space-y-1">
                            <SidebarLink onClick={() => handleNavigation('walletHistory')} count={walletHistoryCount}>
                                Wallet History
                            </SidebarLink>
                            <SidebarLink onClick={() => handleNavigation('tradeHistory')} count={tradeHistoryCount}>
                                Trade History
                            </SidebarLink>
                            <SidebarLink onClick={() => handleNavigation('optionHistory')} count={optionHistoryCount}>
                                Option History
                            </SidebarLink>
                            <SidebarLink onClick={() => handleNavigation('stakingHistory')} count={stakingHistoryCount}>
                                Staking Investments
                            </SidebarLink>
                            <SidebarLink onClick={() => handleNavigation('lotteryHistory')} count={lotteryHistoryCount}>
                                Lottery Purchases
                            </SidebarLink>
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;