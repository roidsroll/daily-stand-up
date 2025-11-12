
import React from 'react';
import { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface PreviewProps {
    formattedText: string;
}

export const Preview: React.FC<PreviewProps> = ({ formattedText }) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleCopy = () => {
        if (!formattedText) return;
        navigator.clipboard.writeText(formattedText)
            .then(() => {
                setIsCopied(true);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text.');
            });
    };

    return (
        <div className="bg-slate-800/50 p-4 md:p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-400">Formatted Preview</h2>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed shadow-md"
                >
                    {isCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                    {isCopied ? 'Copied!' : 'Copy Text'}
                </button>
            </div>
            <pre className="whitespace-pre-wrap break-words bg-slate-900 p-4 rounded-md text-slate-300 font-sans text-sm flex-grow overflow-auto h-96 md:h-auto">
                {formattedText || <span className="text-slate-500">Your formatted standup will appear here...</span>}
            </pre>
        </div>
    );
};
