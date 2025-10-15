

import React, { useState, useMemo, useEffect } from 'react';
import type { WalletAsset, WalletTransaction, TradingCurrency } from '../types';

declare const ethers: any;

interface DepositWithdrawPageProps {
    walletAssets: WalletAsset[];
    transactions: WalletTransaction[];
    onDeposit: (amount: number, txHash: string) => void;
    onWithdraw: (amount: number, currency: string, address: string, network: string, usdValue: number) => void;
    isWalletConnected: boolean;
    walletAddress: string;
    onConnectWallet: () => void;
    showAlert: (title: string, message: string) => void;
}

const DepositWithdrawPage: React.FC<DepositWithdrawPageProps> = ({ 
    walletAssets, transactions, onDeposit, onWithdraw, 
    isWalletConnected, walletAddress, onConnectWallet, showAlert 
}) => {
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Form State ---
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawCurrency, setWithdrawCurrency] = useState(walletAssets.find(a => a.balance > 0)?.symbol || 'USD');
    const [withdrawAddress, setWithdrawAddress] = useState('');
    const [withdrawNetwork, setWithdrawNetwork] = useState<'Ethereum' | 'Polygon'>('Ethereum');
    
    // --- Effect to update withdrawal address when wallet connects ---
    useEffect(() => {
        if (isWalletConnected && walletAddress) {
            setWithdrawAddress(walletAddress);
        }
    }, [isWalletConnected, walletAddress]);


    // --- Memoized Values ---
    const selectedWithdrawAsset = useMemo(() => {
        return walletAssets.find(asset => asset.symbol === withdrawCurrency);
    }, [withdrawCurrency, walletAssets]);
    
    const withdrawUsdValue = useMemo(() => {
        const amount = parseFloat(withdrawAmount);
        if (selectedWithdrawAsset && !isNaN(amount) && amount > 0) {
            return amount * selectedWithdrawAsset.priceUSD;
        }
        return 0;
    }, [withdrawAmount, selectedWithdrawAsset]);

    const history = useMemo(() => {
        return transactions.filter(tx => tx.type === 'Deposit' || tx.type === 'Withdrawal');
    }, [transactions]);


    // --- Handlers ---
    const handleDepositSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            showAlert('Invalid Amount', 'Please enter a valid amount to deposit.');
            return;
        }
        if (typeof window.ethereum === 'undefined') {
            showAlert('MetaMask Not Found', 'Please install the MetaMask extension to use this feature.');
            return;
        }

        setIsProcessing(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            // Using a known USDT contract address on Sepolia Testnet for this simulation
            const usdtContractAddress = '0xaA8E23Fb4C70490F1d6822e11C8Bf38e539db16E'; 
            const platformAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Dummy recipient address

            const usdtAbi = [ "function transfer(address to, uint amount)" ];
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtAbi, signer);
            
            // USDT has 6 decimals
            const amountToSend = ethers.utils.parseUnits(depositAmount, 6);

            const tx = await usdtContract.transfer(platformAddress, amountToSend);
            
            // For a smoother UX, we credit the account immediately after sending,
            // without waiting for block confirmation.
            showAlert('Transaction Sent', `Your deposit transaction has been sent to the network.\nTxHash: ${tx.hash.substring(0, 15)}...`);
            onDeposit(amount, tx.hash);
            setDepositAmount('');

        } catch (error: any) {
            console.error("Deposit failed:", error);
            const errorMessage = error.reason || error.message || 'The transaction was rejected or failed.';
            showAlert('Deposit Failed', `An error occurred: ${errorMessage}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleWithdrawSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmount);
        if (!isNaN(amount) && amount > 0 && withdrawAddress) {
            onWithdraw(amount, withdrawCurrency, withdrawAddress, withdrawNetwork, withdrawUsdValue);
            setWithdrawAmount('');
        }
    };
    

    // --- Render Functions ---
    const renderDepositForm = () => {
        if (!isWalletConnected) {
            return (
                <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Connect Wallet to Deposit</h3>
                    <p className="text-sm text-gray-400 mb-6">Please connect your wallet to initiate a deposit transaction from your own account.</p>
                    <button onClick={onConnectWallet} className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Connect Wallet
                    </button>
                </div>
            );
        }

        return (
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700 relative">
                 {isProcessing && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg z-10">
                        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-white font-semibold">Check Your Wallet...</p>
                    </div>
                )}
                <h3 className="text-xl font-bold text-white mb-4">Deposit via Wallet</h3>
                <p className="text-sm text-gray-400 mb-6">Enter the amount of USDT you wish to deposit. This will prompt a transaction request from your connected wallet.</p>
                
                <form onSubmit={handleDepositSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-400 mb-1">Deposit Amount</label>
                        <div className="relative">
                            <input
                                id="deposit-amount"
                                type="number"
                                value={depositAmount}
                                onChange={e => setDepositAmount(e.target.value)}
                                placeholder="1000.00"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">USDT</span>
                        </div>
                         <p className="text-xs text-gray-500 mt-1">A transaction fee (gas) will apply on the network.</p>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Initiate Deposit
                    </button>
                </form>
            </div>
        );
    };
    
    const renderWithdrawForm = () => (
         <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Withdraw Funds (Simulated)</h3>
             <p className="text-sm text-gray-400 mb-6">Withdraw any asset from your in-app balance. The withdrawal address is pre-filled with your connected wallet.</p>
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                    <label htmlFor="withdraw-currency" className="block text-sm font-medium text-gray-400 mb-1">Withdraw From</label>
                    <select
                        id="withdraw-currency"
                        value={withdrawCurrency}
                        onChange={e => setWithdrawCurrency(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white"
                    >
                        {walletAssets.map(asset => (
                            <option key={asset.symbol} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-400 mb-1">Amount to Withdraw</label>
                    <div className="relative">
                        <input
                            id="withdraw-amount"
                            type="number"
                            value={withdrawAmount}
                            onChange={e => setWithdrawAmount(e.target.value)}
                            placeholder="100.00"
                            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">{withdrawCurrency}</span>
                    </div>
                    {selectedWithdrawAsset && <p className="text-xs text-gray-500 mt-1">Available: {selectedWithdrawAsset.balance.toLocaleString()}</p>}
                </div>

                <div className="p-3 bg-gray-900 rounded-lg text-center">
                    <span className="text-sm text-gray-400">Simulated Value: </span>
                    <span className="font-bold text-lg text-white font-mono">${withdrawUsdValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Network</label>
                    <div className="flex rounded-lg bg-gray-900 border border-gray-700 p-1">
                        <button type="button" onClick={() => setWithdrawNetwork('Ethereum')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${withdrawNetwork === 'Ethereum' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>Ethereum (ERC-20)</button>
                        <button type="button" onClick={() => setWithdrawNetwork('Polygon')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${withdrawNetwork === 'Polygon' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>Polygon</button>
                    </div>
                </div>

                 <div>
                    <label htmlFor="withdraw-address" className="block text-sm font-medium text-gray-400 mb-1">Withdrawal Address</label>
                    <input
                        id="withdraw-address"
                        type="text"
                        value={withdrawAddress}
                        onChange={e => setWithdrawAddress(e.target.value)}
                        placeholder={isWalletConnected ? "Your connected wallet address" : "0x..."}
                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono"
                    />
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    Submit Withdrawal
                </button>
            </form>
        </div>
    );
    
    return (
        <div className="bg-[#0D1117] p-4 sm:p-6 h-full w-full flex flex-col">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-white">Deposit & Withdraw</h1>
                <p className="text-gray-400 mt-1">Manage your funds and view your transaction history.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                     <div className="flex border-b border-gray-700 mb-4">
                        <button onClick={() => setActiveTab('deposit')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'deposit' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>Deposit</button>
                        <button onClick={() => setActiveTab('withdraw')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'withdraw' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>Withdraw</button>
                    </div>
                    {activeTab === 'deposit' ? renderDepositForm() : renderWithdrawForm()}
                </div>
                
                 <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">History</h3>
                    <div className="overflow-y-auto max-h-[500px]">
                         {history.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No deposit or withdrawal history.</div>
                         ) : (
                             <table className="w-full text-sm text-left text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Date</th>
                                        <th scope="col" className="px-4 py-3">Type</th>
                                        <th scope="col" className="px-4 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map(tx => (
                                         <tr key={tx.id} className="border-b border-gray-700">
                                            <td className="px-4 py-3 text-white">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{tx.type}</td>
                                            <td className={`px-4 py-3 font-mono text-right ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {tx.currency}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepositWithdrawPage;