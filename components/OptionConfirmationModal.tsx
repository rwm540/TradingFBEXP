import React from 'react';
import type { NewOptionOrderRequest } from '../types';
import { formatPrice, formatDisplayDuration } from '../utils/formatting';

export interface OptionConfirmationDetails extends NewOptionOrderRequest {
    entryPrice: number;
    payout: number;
    profit: number;
}

interface OptionConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    order: OptionConfirmationDetails | null;
}

const OptionConfirmationModal: React.FC<OptionConfirmationModalProps> = ({ isOpen, onClose, onConfirm, order }) => {
    if (!isOpen || !order) return null;

    const typeColor = order.type === 'Buy' ? 'text-green-500' : 'text-red-500';
    const buttonBg = order.type === 'Buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
            <div className="bg-[#161B22] rounded-lg p-8 border border-gray-700 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-2xl font-bold">Confirm Option Trade</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div className="space-y-3 text-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Pair:</span>
                        <span className="font-bold text-white">{order.pair}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Direction:</span>
                        <span className={`font-bold ${typeColor}`}>{order.type === 'Buy' ? 'Higher' : 'Lower'}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-400">Entry Price:</span>
                        <span className="font-mono text-white">{formatPrice(order.pair, order.entryPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-mono text-white">{order.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {order.currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Duration:</span>
                        <span className="font-mono text-white">{formatDisplayDuration(order.duration)}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-700 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Profit ({order.profitPercentage}%):</span>
                            <span className="font-mono text-green-400">+{order.profit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {order.currency}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold">Potential Payout:</span>
                            <span className="font-mono text-white font-bold">{order.payout.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {order.currency}</span>
                        </div>
                    </div>
                </div>

                 <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={`text-white font-bold py-2 px-6 rounded-lg transition-colors ${buttonBg}`}>
                        Confirm Trade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptionConfirmationModal;