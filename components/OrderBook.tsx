import React, { useState, useEffect } from 'react';
// FIX: Import the 'Currency' type from the central 'types.ts' file instead of defining it locally for consistency.
import type { OrderBookEntry, Currency } from '../types';
import { formatPrice } from '../utils/formatting';

interface OrderBookProps {
    selectedPair: Currency;
    livePrice: number | null;
}

const generateOrderBookData = (centerPrice: number, count: number): OrderBookEntry[] => {
    const data: OrderBookEntry[] = [];
    let price = centerPrice;
    for (let i = 0; i < count; i++) {
        const priceFluctuation = (Math.random() * 0.0005) - 0.00025;
        price += priceFluctuation;
        const amount = (Math.random() * 0.5).toFixed(3);
        data.push({
            price: price.toString(),
            amount: amount,
            total: (parseFloat(amount) * (i + 1)).toFixed(3), // Mock total
        });
    }
    return data;
};


const OrderBook: React.FC<OrderBookProps> = ({ selectedPair, livePrice }) => {
    const [asks, setAsks] = useState<OrderBookEntry[]>([]);
    const [bids, setBids] = useState<OrderBookEntry[]>([]);

    const [baseCurrency, quoteCurrency] = selectedPair.value.split('/');

    useEffect(() => {
        if (!livePrice) return;

        const updateOrders = () => {
            setAsks(generateOrderBookData(livePrice + (livePrice * 0.0001), 12).sort((a,b) => parseFloat(b.price) - parseFloat(a.price)));
            setBids(generateOrderBookData(livePrice - (livePrice * 0.0001), 12).sort((a,b) => parseFloat(b.price) - parseFloat(a.price)));
        };
        
        updateOrders(); // Initial update
        const interval = setInterval(updateOrders, 1500);

        return () => clearInterval(interval);

    }, [livePrice, selectedPair]);


    const priceColor = asks.length > 0 && bids.length > 0 && livePrice && parseFloat(asks[asks.length-1].price) > parseFloat(bids[0].price) ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-[#161B22] p-4 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-semibold">Order Book</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 mb-2 px-2">
                <span>Price ({quoteCurrency})</span>
                <span className="text-right">Amount ({baseCurrency})</span>
                <span className="text-right">Total</span>
            </div>
            <div className="flex-grow overflow-y-auto">
                {/* Asks */}
                {asks.map((ask, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 text-xs py-1 px-2 relative hover:bg-gray-800 rounded transition-colors duration-300">
                        <span className="text-red-500">{formatPrice(selectedPair.value, parseFloat(ask.price))}</span>
                        <span className="text-right">{ask.amount}</span>
                        <span className="text-right">{ask.total}</span>
                        <div className="absolute top-0 right-0 h-full bg-red-900 bg-opacity-40" style={{ width: `${Math.random() * 40 + 5}%`, zIndex: -1 }}></div>
                    </div>
                ))}
                
                <div className="py-2 my-2 border-t border-b border-gray-700 text-center">
                    {livePrice ? (
                       <span className={`text-lg font-bold ${priceColor} transition-colors duration-300`}>{formatPrice(selectedPair.value, livePrice)}</span>
                    ) : (
                       <span className="text-lg font-bold text-gray-500">...</span>
                    )}
                </div>

                {/* Bids */}
                {bids.map((bid, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 text-xs py-1 px-2 relative hover:bg-gray-800 rounded transition-colors duration-300">
                        <span className="text-green-500">{formatPrice(selectedPair.value, parseFloat(bid.price))}</span>
                        <span className="text-right">{bid.amount}</span>
                        <span className="text-right">{bid.total}</span>
                         <div className="absolute top-0 right-0 h-full bg-green-900 bg-opacity-40" style={{ width: `${Math.random() * 40 + 5}%`, zIndex: -1 }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderBook;