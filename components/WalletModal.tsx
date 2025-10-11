import React, { useState, useEffect } from 'react';
import type { WalletAsset } from '../types';

declare global {
    interface Window {
        ethereum?: any;
    }
}

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAssets: WalletAsset[];
    onSwapAssets: (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => void;
}

// --- SVG Icons ---
const UTokenIcon = () => <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-lg">U</div>;
const BitcoinIcon = () => <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-800"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F7931A]" fill="currentColor"><title>Bitcoin</title><path d="M11.522 18.22v-3.047c.99.03 1.94-.132 2.825-.49a5.15 5.15 0 002.13-1.742 4.96 4.96 0 00.83-2.735 4.96 4.96 0 00-.83-2.735 5.15 5.15 0 00-2.13-1.742 6.55 6.55 0 00-2.825-.49V2.195l1.68.012.012-1.68-1.68-.012L11.534.5H9.86v2.338c-.818.06-1.624.232-2.383.508a5.55 5.55 0 00-2.07 1.488 5.4 5.4 0 00-1.2 3.825c0 1.29.33 2.49.99 3.6.66 1.11 1.545 1.943 2.655 2.5a6.45 6.45 0 003.015.758v3.137l-3.3-1.425v2.31l3.3 1.395v1.8l-1.68-.012-.012 1.68 1.68.012v.66H11.522v-.66zm-1.662-7.567a2.62 2.62 0 011.665-2.52 3.1 3.1 0 013.165.945 3.1 3.1 0 01.945 3.165 3.1 3.1 0 01-.945 3.165c-.58.59-1.32.968-2.145 1.125a2.62 2.62 0 01-2.52-1.665 2.62 2.62 0 01-.165-1.545 2.62 2.62 0 01.0-1.665z" /></svg></div>;
const EthereumIcon = () => <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#3C3C3D]"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor"><title>Ethereum</title><path d="M11.944 17.97L4.58 13.62l7.364 4.354zm.112 0l7.365-4.354-7.365 4.354zM12 19.548L4.58 14.88l7.42 5.244 7.42-5.245-7.42 4.668zM4.58 12.553l7.364-4.42-7.364 4.42zm7.518-.002l7.365-4.42-7.365 4.42zM12 4.45L4.58 9.073 12 13.62l7.42-4.545L12 4.45z"/></svg></div>;
const DogeIcon = () => <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#F2CB63]"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor"><title>Dogecoin</title><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-2.88-5.344a.42.42 0 0 1-.41-.532l1.242-4.148-3.957 2.08a.42.42 0 0 1-.58-.337L5.22 12.5a.42.42 0 0 1 .521-.45l4.135 1.258 2.09-3.95a.42.42 0 0 1 .71-.16l5.22 5.22a.42.42 0 0 1-.297.71l-5.343-1.29-2.07 3.93a.42.42 0 0 1-.37.286zm4.84-5.344c-.443 0-.803.36-.803.804s.36.803.803.803.804-.36.804-.803a.803.803 0 0 0-.804-.804z"/></svg></div>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const SwapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;

const getAssetIcon = (symbol: string): React.ReactNode => {
    switch(symbol) {
        case 'UT': return <UTokenIcon />;
        case 'BTC': return <BitcoinIcon />;
        case 'ETH': return <EthereumIcon />;
        case 'DOGE': return <DogeIcon />;
        case 'EUR': return <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">€</div>;
        case 'USD': return <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-600 text-white font-bold">$</div>;
        case 'JPY': return <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-600 text-white font-bold">¥</div>;
        case 'GBP': return <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">£</div>;
        case 'XAU': return <div className="h-10 w-10 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold">G</div>;
        case 'XAG': return <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-400 text-black font-bold">S</div>;
        default: return <div className="h-10 w-10 rounded-full bg-gray-600"></div>;
    }
};

interface DisplayAsset extends WalletAsset {
    icon: React.ReactNode;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, walletAssets, onSwapAssets }) => {
    type View = 'list' | 'detail' | 'receive' | 'send' | 'swap';
    type MainTab = 'assets' | 'swap';
    
    const [mainTab, setMainTab] = useState<MainTab>('assets');
    const [view, setView] = useState<View>('list');
    const [selectedAsset, setSelectedAsset] = useState<DisplayAsset | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // --- Swap State ---
    const [fromAssetSymbol, setFromAssetSymbol] = useState('BTC');
    const [toAssetSymbol, setToAssetSymbol] = useState('ETH');
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [lockedFromAssetSymbol, setLockedFromAssetSymbol] = useState<string | null>(null);

    const [alert, setAlert] = useState<{show: boolean, title: string, message: string}>({show: false, title: '', message: ''});
    
    const showAlert = (title: string, message: string) => {
        setAlert({show: true, title, message});
    };

    const assets = walletAssets.map(asset => ({
        ...asset,
        icon: getAssetIcon(asset.symbol)
    }));

    // --- Swap Calculation Effect ---
    useEffect(() => {
        const fromAsset = assets.find(a => a.symbol === fromAssetSymbol);
        const toAsset = assets.find(a => a.symbol === toAssetSymbol);
        const amount = parseFloat(fromAmount);

        if (fromAsset && toAsset && amount > 0 && fromAsset.priceUSD > 0 && toAsset.priceUSD > 0) {
            const fee = 0.00002; // 0.002% swap fee
            const valueInUSD = amount * fromAsset.priceUSD * (1 - fee);
            const calculatedToAmount = valueInUSD / toAsset.priceUSD;
            setToAmount(calculatedToAmount.toFixed(8));
        } else {
            setToAmount('');
        }
    }, [fromAmount, fromAssetSymbol, toAssetSymbol, assets]);


    if (!isOpen) return null;

    const handleAssetClick = (asset: DisplayAsset) => {
        setSelectedAsset(asset);
        setView('detail');
    };

    const handleBack = (targetView: View) => {
        if(view === 'swap') {
            setLockedFromAssetSymbol(null);
            setFromAmount('');
        }
        setView(targetView);
    };
    
    const handleClose = () => {
        setMainTab('assets');
        setView('list');
        setSelectedAsset(null);
        setLockedFromAssetSymbol(null);
        setFromAmount('');
        setToAmount('');
        onClose();
    };

    const handleTabChange = (tab: MainTab) => {
        if (tab === 'swap') {
            setLockedFromAssetSymbol(null);
            if (fromAssetSymbol === toAssetSymbol) {
                 const first = assets.find(a => a.symbol === 'BTC') ? 'BTC' : assets[0]?.symbol;
                 const second = assets.find(a => a.symbol === 'ETH') ? 'ETH' : assets[1]?.symbol;
                 setFromAssetSymbol(first || '');
                 setToAssetSymbol(second || '');
            }
        }
        if (view !== 'list') setView('list');
        setMainTab(tab);
    };
    
    const handleSwap = () => {
        const fromAsset = assets.find(a => a.symbol === fromAssetSymbol);
        const toAsset = assets.find(a => a.symbol === toAssetSymbol);
        const amountToSwap = parseFloat(fromAmount);
        const amountToReceive = parseFloat(toAmount);

        if (!fromAsset || !toAsset || !amountToSwap || !amountToReceive || amountToSwap <= 0) {
            showAlert('Invalid Amount', 'Please enter a valid amount to swap.');
            return;
        }
        if (amountToSwap > fromAsset.balance) {
            showAlert('Insufficient Balance', `You do not have enough ${fromAsset.name} to complete this swap.`);
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            onSwapAssets(fromAsset.symbol, toAsset.symbol, amountToSwap, amountToReceive);
            setFromAmount('');
            setIsProcessing(false);
            if (lockedFromAssetSymbol) {
                const updatedAsset = assets.find(a => a.symbol === lockedFromAssetSymbol);
                if (updatedAsset) setSelectedAsset(updatedAsset);
                handleBack('detail');
            }
        }, 1500);
    };

    const handleGoToSwap = (asset: DisplayAsset) => {
        setFromAssetSymbol(asset.symbol);
        setLockedFromAssetSymbol(asset.symbol);
        if (asset.symbol === toAssetSymbol) {
            const nextAsset = assets.find(a => a.symbol !== asset.symbol);
            if (nextAsset) setToAssetSymbol(nextAsset.symbol);
        }
        setView('swap');
    };

    const totalBalance = assets.reduce((sum, asset) => sum + (asset.balance * asset.priceUSD), 0);

    const renderAssetList = () => (
        <ul className="space-y-3">
            {assets.map((asset) => (
                <li key={asset.symbol} onClick={() => handleAssetClick(asset)} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#161B22] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                        {asset.icon}
                        <div>
                            <p className="font-bold text-white">{asset.name}</p>
                            <p className="text-sm text-gray-400">{asset.balance.toFixed(4)} {asset.symbol}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-base text-white">${(asset.balance * asset.priceUSD).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                </li>
            ))}
        </ul>
    );

    const renderMainWalletView = () => (
        <>
            <div className="flex justify-between items-center p-4 flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600"></div>
                <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <div className="px-4">
                <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white shadow-lg mb-6 text-center">
                    <p className="text-sm opacity-80">Total Balance</p>
                    <p className="text-4xl font-bold mt-2">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
             <div className="px-4 pt-4 flex-grow overflow-y-auto">
                 <h3 className="text-lg font-semibold text-white mb-3 px-2">Assets</h3>
                {renderAssetList()}
            </div>
        </>
    );

    const renderAssetDetail = (asset: DisplayAsset) => (
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => handleBack('list')} className="text-gray-400 hover:text-white mr-4"><BackIcon /></button>
                    <h2 className="text-xl font-bold text-white">Manage {asset.name}</h2>
                </div>
                 <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <div className="text-center my-8">
                {asset.icon}
                <p className="text-3xl font-bold text-white mt-4">{asset.balance.toFixed(4)} {asset.symbol}</p>
                <p className="text-gray-400 font-mono">${(asset.balance * asset.priceUSD).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-[#161B22] p-4 rounded-lg border border-gray-700 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price (USD):</span>
                    <span className="text-white font-mono">${asset.priceUSD.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="text-white font-mono truncate max-w-[150px]">{asset.accountNumber}</span>
                </div>
            </div>
            <div className="flex flex-col space-y-3 mt-auto">
                <button onClick={() => handleGoToSwap(asset)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Swap</button>
                <button onClick={() => setView('receive')} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Receive</button>
                <button onClick={() => setView('send')} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Send</button>
            </div>
        </div>
    );
    
    const renderReceiveView = (asset: DisplayAsset) => (
         <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center">
                    <button onClick={() => handleBack('detail')} className="text-gray-400 hover:text-white mr-4"><BackIcon /></button>
                    <h2 className="text-xl font-bold text-white">Receive {asset.name}</h2>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <div className="flex flex-col items-center justify-center flex-grow bg-[#161B22] rounded-lg p-4 border border-gray-700">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${asset.accountNumber}&bgcolor=161B22&color=FFFFFF`} 
                    alt="Receive QR Code" 
                    className="border-4 border-white rounded-lg"
                />
                <p className="text-gray-400 mt-4 text-sm text-center">Scan this code to receive {asset.name}.</p>
                <div className="w-full bg-gray-900 p-3 rounded-lg mt-4 text-center">
                    <p className="text-white font-mono text-sm break-all">{asset.accountNumber}</p>
                </div>
                <button onClick={() => {
                    navigator.clipboard.writeText(asset.accountNumber);
                    showAlert("Copied!", "Address copied to clipboard.");
                }} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm">Copy Address</button>
            </div>
        </div>
    );

    const renderSendView = (asset: DisplayAsset) => {
        const handleSend = () => {
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                showAlert('Transaction Sent', 'Your transaction has been broadcast successfully.');
                handleBack('detail');
            }, 1500);
        };
        return (
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button onClick={() => handleBack('detail')} className="text-gray-400 hover:text-white mr-4"><BackIcon /></button>
                        <h2 className="text-xl font-bold text-white">Send {asset.name}</h2>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Recipient Address</label>
                        <input type="text" placeholder={`Enter ${asset.symbol} address`} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                        <input type="number" placeholder="0.00" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-mono" />
                    </div>
                </div>
                <div className="mt-auto pt-4">
                    <button onClick={handleSend} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Send</button>
                </div>
            </div>
        );
    };

    const renderSwapView = (contextAsset?: DisplayAsset) => {
        const fromAsset = assets.find(a => a.symbol === fromAssetSymbol);
        const toAsset = assets.find(a => a.symbol === toAssetSymbol);
        const exchangeRate = (fromAsset && toAsset && toAsset.priceUSD > 0) ? fromAsset.priceUSD / toAsset.priceUSD : 0;

        const handleFromAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newFromSymbol = e.target.value;
            if (newFromSymbol === toAssetSymbol) setToAssetSymbol(fromAssetSymbol);
            setFromAssetSymbol(newFromSymbol);
        };

        const handleToAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newToSymbol = e.target.value;
            if (newToSymbol === fromAssetSymbol) setFromAssetSymbol(toAssetSymbol);
            setToAssetSymbol(newToSymbol);
        };

        const canSwap = fromAsset && parseFloat(fromAmount) > 0 && parseFloat(fromAmount) <= fromAsset.balance;

        return (
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center">
                        {contextAsset ? (
                             <button onClick={() => handleBack('detail')} className="text-gray-400 hover:text-white mr-4"><BackIcon /></button>
                        ): <div className="w-10 h-10"/> }
                        <h2 className="text-xl font-bold text-white">Swap {contextAsset?.name ?? 'Assets'}</h2>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="flex flex-col flex-grow space-y-4 text-white">
                     <div className="bg-[#161B22] p-4 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                            <span>From</span>
                            <button onClick={() => setFromAmount(fromAsset?.balance.toString() ?? '0')} className="hover:text-white">
                                Balance: {fromAsset?.balance.toFixed(4) ?? '0.00'}
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} placeholder="0.0" className="w-full bg-transparent text-2xl font-mono focus:outline-none" />
                            <select value={fromAssetSymbol} onChange={handleFromAssetChange} className="bg-gray-800 border border-gray-700 rounded-md p-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!lockedFromAssetSymbol}>
                                {assets.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center items-center my-[-16px] z-10">
                        <button onClick={() => { setFromAssetSymbol(toAssetSymbol); setToAssetSymbol(fromAssetSymbol); }} className="p-2 rounded-full bg-gray-700 border-4 border-[#0D1117] text-white hover:bg-blue-500 transition-colors" disabled={!!lockedFromAssetSymbol}>
                            <SwapIcon />
                        </button>
                    </div>
                    <div className="bg-[#161B22] p-4 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                            <span>To</span>
                             <span>Balance: {toAsset?.balance.toFixed(4) ?? '0.00'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="number" value={toAmount} disabled placeholder="0.0" className="w-full bg-transparent text-2xl font-mono focus:outline-none disabled:text-gray-400" />
                            <select value={toAssetSymbol} onChange={handleToAssetChange} className="bg-gray-800 border border-gray-700 rounded-md p-2 focus:outline-none">
                                {assets.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol}</option>)}
                            </select>
                        </div>
                    </div>
                    {exchangeRate > 0 && (
                         <div className="text-center text-sm text-gray-400 font-mono pt-2">
                             1 {fromAsset?.symbol} ≈ {exchangeRate.toFixed(4)} {toAsset?.symbol}
                         </div>
                    )}
                    <div className="mt-auto pt-4">
                        <button onClick={handleSwap} disabled={!canSwap} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed">
                            {fromAsset && parseFloat(fromAmount) > fromAsset.balance ? 'Insufficient Balance' : 'Swap'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    const renderAssetsFlow = () => {
        const currentSelectedAsset = selectedAsset ? assets.find(a => a.symbol === selectedAsset.symbol) : null;

        switch (view) {
            case 'list': return renderMainWalletView();
            case 'detail': return currentSelectedAsset && renderAssetDetail(currentSelectedAsset);
            case 'receive': return currentSelectedAsset && renderReceiveView(currentSelectedAsset);
            case 'send': return currentSelectedAsset && renderSendView(currentSelectedAsset);
            case 'swap': return currentSelectedAsset && renderSwapView(currentSelectedAsset);
            default: return renderMainWalletView();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            {alert.show && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
                    <div className="bg-[#1c2128] rounded-lg p-6 border border-gray-700 w-full max-w-sm shadow-lg text-center">
                        <h3 className="text-lg font-bold text-white mb-2">{alert.title}</h3>
                        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{alert.message}</p>
                        <button onClick={() => setAlert({show: false, title: '', message: ''})} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">OK</button>
                    </div>
                </div>
            )}
            <div className="relative bg-[#0D1117] rounded-3xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden border border-gray-800" style={{ height: '95vh' }}>
                {isProcessing && <div className="absolute inset-0 bg-[#0D1117] bg-opacity-80 flex items-center justify-center z-20"><div className="w-16 h-16 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div></div>}
                
                <div className="flex-grow overflow-hidden flex flex-col">
                    {mainTab === 'assets' ? renderAssetsFlow() : renderSwapView()}
                </div>

                <div className="flex-shrink-0 bg-[#161B22] border-t border-gray-700 grid grid-cols-2">
                    <button onClick={() => handleTabChange('assets')} className={`py-3 flex flex-col items-center justify-center text-sm font-medium ${mainTab === 'assets' ? 'text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        <span>Assets</span>
                    </button>
                    <button onClick={() => handleTabChange('swap')} className={`py-3 flex flex-col items-center justify-center text-sm font-medium ${mainTab === 'swap' ? 'text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        <span>Swap</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletModal;