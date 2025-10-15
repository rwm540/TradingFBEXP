import React from 'react';
import type { View } from '../App';
import type { UserProfile } from '../types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onViewChange: (view: View) => void;
    totalBalanceUSD: number;
    userProfile: UserProfile;
    tradeHistoryCount: number;
    optionHistoryCount: number;
    stakingHistoryCount: number;
    lotteryHistoryCount: number;
    walletHistoryCount: number;
    onLogout: () => void;
}


const SidebarButton: React.FC<{
    children: React.ReactNode;
    count?: number;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ children, count, icon, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-3 text-left text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
    >
        <div className="flex items-center gap-3">
             {icon}
             <span className="font-medium">{children}</span>
        </div>
        {count !== undefined ? (
            <span className="text-xs bg-gray-600 text-gray-200 rounded-full px-2 py-0.5 min-w-[20px] text-center">{count}</span>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        )}
    </button>
);


const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, onClose, onViewChange, totalBalanceUSD, userProfile,
    tradeHistoryCount, optionHistoryCount, stakingHistoryCount, lotteryHistoryCount, walletHistoryCount,
    onLogout
}) => {
    
    const handleNavigation = (view: View) => {
        onViewChange(view);
        onClose();
    };
    
    const displayName = userProfile.firstName && userProfile.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : userProfile.username;

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
                    <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            {userProfile.profilePicture ? (
                                <img src={userProfile.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                    {(userProfile.firstName || userProfile.username || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h2 id="sidebar-title" className="text-lg font-bold text-white">{displayName}</h2>
                                <p className="text-sm font-mono text-gray-400">${totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl" aria-label="Close sidebar">&times;</button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-grow overflow-y-auto p-2">
                        <nav className="flex flex-col space-y-1">
                             <SidebarButton
                                onClick={() => handleNavigation('profile')}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                            >
                                Profile Settings
                            </SidebarButton>
                            
                             <SidebarButton
                                onClick={() => handleNavigation('depositWithdraw')}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                            >
                                Deposit & Withdraw
                            </SidebarButton>
                            
                            <div className="pt-2 mt-2 border-t border-gray-700">
                                <span className="px-3 text-xs font-semibold text-gray-500 uppercase">History</span>
                            </div>

                            <SidebarButton onClick={() => handleNavigation('walletHistory')} count={walletHistoryCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                                Wallet History
                            </SidebarButton>
                            <SidebarButton onClick={() => handleNavigation('tradeHistory')} count={tradeHistoryCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
                                Trade History
                            </SidebarButton>
                            <SidebarButton onClick={() => handleNavigation('optionHistory')} count={optionHistoryCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}>
                                Option History
                            </SidebarButton>
                            <SidebarButton onClick={() => handleNavigation('stakingHistory')} count={stakingHistoryCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}>
                                Staking Investments
                            </SidebarButton>
                            <SidebarButton onClick={() => handleNavigation('lotteryHistory')} count={lotteryHistoryCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}>
                                Lottery Purchases
                            </SidebarButton>
                        </nav>
                    </div>
                    {/* Logout Button */}
                    <div className="p-2 mt-auto border-t border-gray-700 flex-shrink-0">
                         <SidebarButton
                            onClick={onLogout}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}
                        >
                            Logout
                        </SidebarButton>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;