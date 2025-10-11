import React, { useState } from 'react';

declare global {
    interface Window {
        ethereum?: any;
    }
}

interface ConnectWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnectSuccess: (account: string) => void;
    showAlert: (title: string, message: string) => void;
}

// --- SVG Icons ---
const MetaMaskIcon = () => <svg className="w-16 h-16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><g fill="#E2761B"><path d="m255.1 127.3-42.3-24.5-42.4 24.5 42.4 24.4z"/><path d="m255.1 127.3-42.3-24.5-21.3 12.3 21.3 12.2z"/><path d="m170.4 78.4-42.3-24.5-42.4 24.5 42.4 24.5z"/><path d="m170.4 78.4-42.3-24.5-21.2 12.3 21.2 12.2z"/><path d="m85.6 176.2 42.3 24.5 42.4-24.5-42.4-24.5z"/><path d="m85.6 176.2 42.3 24.5 21.2-12.2-21.2-12.3z"/><path d="m85.6 127.3 42.3 24.5 21.2-12.3-42.4-24.4-21.1 12.2z"/><path d="m170.4 127.3-42.3 24.5-21.2-12.3 42.4-24.4 21.1 12.2z"/></g><g fill="#E4761B"><path d="m212.8 151.8-42.4 24.4v-48.8l42.4-24.5z"/><path d="m170.4 127.3-21.1-12.2-21.2 12.2 21.2 12.3z"/><path d="m43.2 102.8-42.3 24.5 42.3 24.4v-48.9z"/><path d="m85.6 127.3 21.1-12.2 21.2 12.2-21.2 12.3z"/></g><g fill="#D7C1B3"><path d="m128 164-21.2-36.6 21.2-12.3 21.1 12.3z"/></g><g fill="#E37517"><path d="m128 164-21.2-36.6 21.2-12.3z"/></g><g fill="#233447"><path d="m128.1 164 21.1-12.3-21.1-24.4-21.2 24.4z"/></g><g fill="#CD6116"><path d="m128.1 164 21.1-12.3-21.1-24.4z"/><path d="m85.6 127.3 42.4 24.5v-24.5l-21.2-12.2z"/><path d="m128 151.8 21.2-12.3-21.2-12.2-21.2 12.2z"/></g><g fill="#161616"><path d="m128 151.8 21.2-12.3-21.2-12.2z"/></g></svg>;
const TrustWalletIcon = () => <svg className="w-16 h-16" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M56.36 17.31a28.02 28.02 0 00-11.83-9.15l-11.5 19.92-11.47-19.92a28.02 28.02 0 00-11.85 9.15A28.2 28.2 0 007.13 46.1l11.5-19.92 12.42 21.52 12.44-21.52 11.49 19.92a28.2 28.2 0 001.38-28.8z" fill="#fff"/></svg>;


const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ isOpen, onClose, onConnectSuccess, showAlert }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleConnect = async (walletType: 'metamask' | 'trustwallet') => {
        setIsProcessing(true);
        
        let provider = window.ethereum;

        if (walletType === 'trustwallet' && !provider?.isTrust) {
             showAlert('Trust Wallet Not Found', 'Please install the Trust Wallet extension or use the Trust Wallet mobile app.');
             setIsProcessing(false);
             return;
        }
        
        if (provider) {
            try {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                onConnectSuccess(account);
            } catch (error) {
                showAlert('Connection Failed', 'The wallet connection request was rejected by the user.');
            }
        } else {
            showAlert('Wallet Not Found', `Please install the ${walletType === 'metamask' ? 'MetaMask' : 'Trust Wallet'} browser extension to continue.`);
        }
        setIsProcessing(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
             <div className="relative bg-[#161B22] rounded-lg p-8 border border-gray-700 w-full max-w-md shadow-lg">
                {isProcessing && <div className="absolute inset-0 bg-[#161B22] bg-opacity-80 flex items-center justify-center z-20 rounded-lg"><div className="w-16 h-16 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div></div>}
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-2xl font-bold">Connect a Wallet</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleConnect('metamask')} className="flex flex-col items-center justify-center p-4 h-40 bg-[#1c2128] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                        <MetaMaskIcon />
                        <span className="mt-2 font-semibold text-white">MetaMask</span>
                    </button>
                    <button onClick={() => handleConnect('trustwallet')} className="flex flex-col items-center justify-center p-4 h-40 bg-[#3375BB] border border-blue-400 rounded-lg hover:bg-blue-800 transition-colors">
                        <TrustWalletIcon />
                        <span className="mt-2 font-semibold text-white">Trust Wallet</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectWalletModal;