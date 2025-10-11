import React from 'react';
import type { NewOrderRequest } from '../types';
import { formatPrice } from '../utils/formatting';

export interface OrderConfirmationDetails extends NewOrderRequest {
    price: number;
    amount: number;
    positionValue: number;
}

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    order: OrderConfirmationDetails | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, order }) => {
    if (!isOpen || !order) return null;

    const typeColor = order.type === 'Buy' ? 'text-green-500' : 'text-red-500';
    const buttonBg = order.type === 'Buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
            <div className="bg-[#161B22] rounded-lg p-8 border border-gray-700 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-2xl font-bold">Confirm Your Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div className="space-y-3 text-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Pair:</span>
                        <span className="font-bold text-white">{order.pair}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Type:</span>
                        <span className={`font-bold ${typeColor}`}>{order.type}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-400">Entry Price:</span>
                        <span className="font-mono text-white">{formatPrice(order.pair, order.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Margin:</span>
                        <span className="font-mono text-white">{order.margin.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {order.currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Leverage:</span>
                        <span className="font-mono text-white">{order.leverage}x</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-700">
                        <span className="text-gray-400 font-bold">Position Value:</span>
                        <span className="font-mono text-white font-bold">{order.positionValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {order.currency}</span>
                    </div>
                </div>

                 <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={`text-white font-bold py-2 px-6 rounded-lg transition-colors ${buttonBg}`}>
                        Confirm {order.type}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;