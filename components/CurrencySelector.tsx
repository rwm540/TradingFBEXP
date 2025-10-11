import React, { useState, useEffect, useRef } from 'react';
// FIX: Import the 'Currency' type from the central 'types.ts' file instead of defining it locally.
import type { Currency } from '../types';

interface CurrencySelectorProps {
    selectedPair: Currency;
    onPairChange: (pair: Currency) => void;
    pairs: Currency[];
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ selectedPair, onPairChange, pairs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  const filteredPairs = pairs.filter(pair => 
      pair.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pair.value.toLowerCase().replace('/', '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white font-bold"
      >
        <span>{selectedPair.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-[#161B22] border border-gray-700 rounded-lg shadow-lg flex flex-col">
            <div className="p-2 border-b border-gray-700">
                <input
                    type="text"
                    placeholder="Search asset (e.g., BTC, EURUSD)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
            </div>
            <div className="max-h-60 overflow-y-auto">
                {filteredPairs.length > 0 ? filteredPairs.map((pair) => (
                    <div
                    key={pair.value}
                    onClick={() => {
                        onPairChange(pair);
                        setIsOpen(false);
                        setSearchTerm(''); // Reset search on selection
                    }}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                    >
                    {pair.label}
                    </div>
                )) : (
                    <div className="px-4 py-3 text-gray-500">No assets found.</div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;