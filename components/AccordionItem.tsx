import React, { useState } from 'react';

interface AccordionItemProps {
    title: string;
    count: number;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, count, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left text-white hover:bg-gray-800 focus:outline-none"
                aria-expanded={isOpen}
            >
                <div className="flex items-center space-x-3">
                    <span className="font-semibold">{title}</span>
                    <span className="text-xs bg-gray-600 text-gray-200 rounded-full px-2 py-0.5">{count}</span>
                </div>
                <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="bg-gray-900 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionItem;