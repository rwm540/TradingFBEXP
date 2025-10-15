import React, { useState } from 'react';

interface FundWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeposit: (amount: number, txHash: string) => void;
}

const FundWalletModal: React.FC<FundWalletModalProps> = ({ isOpen, onClose, onDeposit }) => {
    const [amount, setAmount] = useState('');

    if (!isOpen) return null;

    const handleFund = () => {
        const fundAmount = parseFloat(amount);
        if (isNaN(fundAmount) || fundAmount < 1 || fundAmount > 1000000) {
            alert('Please enter a valid amount between $1.00 and $1,000,000.');
            return;
        }
        onDeposit(fundAmount, 'Manual Addition');
        setAmount('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
            <div className="bg-[#161B22] rounded-lg p-8 border border-gray-700 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-2xl font-bold">Fund Your Live Account</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div>
                    <label htmlFor="fund-amount" className="block text-sm font-medium text-gray-400 mb-2">Amount (USD)</label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">$</span>
                        <input
                            type="number"
                            id="fund-amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="1000.00"
                            className="w-full bg-gray-900 border border-gray-700 p-3 pl-7 rounded-lg text-white font-mono"
                        />
                    </div>
                </div>

                 <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button onClick={handleFund} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Fund Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FundWalletModal;