import React, { useState, useMemo } from 'react';
import type { WalletTransaction } from '../types';

interface WalletHistoryPageProps {
    transactions: WalletTransaction[];
}

const WalletHistoryPage: React.FC<WalletHistoryPageProps> = ({ transactions }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = useMemo(() => {
        if (!searchTerm) {
            return transactions;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return transactions.filter(tx =>
            tx.type.toLowerCase().includes(lowercasedFilter) ||
            tx.description.toLowerCase().includes(lowercasedFilter) ||
            tx.currency.toLowerCase().includes(lowercasedFilter) ||
            tx.amount.toString().includes(lowercasedFilter)
        );
    }, [searchTerm, transactions]);

    return (
        <div className="bg-[#161B22] p-4 sm:p-6 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Wallet History</h1>
                <p className="text-gray-400 mt-1">A log of all your wallet funding, withdrawals, and transaction activities.</p>
                 <div className="mt-4">
                     <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </header>
            <div className="flex-grow overflow-y-auto">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        {searchTerm ? `No transactions found for "${searchTerm}".` : "No wallet transactions found."}
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-4 py-3">Date</th>
                                <th scope="col" className="px-4 py-3">Type</th>
                                <th scope="col" className="px-4 py-3">Description</th>
                                <th scope="col" className="px-4 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((tx) => {
                                const amountColor = tx.amount >= 0 ? 'text-green-500' : 'text-red-500';
                                const amountPrefix = tx.amount >= 0 ? '+' : '';

                                return (
                                    <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="px-4 py-3 text-white font-medium">{new Date(tx.timestamp).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-gray-700 text-gray-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{tx.description}</td>
                                        <td className={`px-4 py-3 font-mono text-right ${amountColor}`}>
                                            {amountPrefix}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {tx.currency}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default WalletHistoryPage;