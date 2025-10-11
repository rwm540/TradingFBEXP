import React from 'react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
            <div className="bg-[#161B22] rounded-lg p-8 border border-gray-700 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <p className="text-gray-300 mb-6 whitespace-pre-wrap">{message}</p>

                 <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;