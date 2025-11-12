import React from 'react';
import { useState, useCallback } from 'react';

export interface ParsedStandupData {
    date: string;
    yesterdayWork: string;
    todayWork: string;
    blockers: string;
    notes: string;
}

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: ParsedStandupData) => void;
}

const parseSectionContent = (text: string | undefined): string => {
    if (!text) return '';
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('>'))
        .map(line => line.substring(2).trim())
        .join('\n')
        .replace(/^-$/, '') // If content is just '-', make it empty
        .trim();
};

const parseDate = (text: string | undefined): string => {
    const fallbackDate = new Date().toISOString().split('T')[0];
    if (!text) return fallbackDate;

    const dateMatch = text.match(/Daily Standup — (.*?)\*\*/);
    if (!dateMatch || !dateMatch[1]) return fallbackDate;

    try {
        const parsedDate = new Date(dateMatch[1]);
        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            return fallbackDate;
        }
        // Format to YYYY-MM-DD for the input field
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return fallbackDate;
    }
};


export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState('');

    const handleParseAndImport = useCallback(() => {
        setError('');
        if (!inputText.trim()) {
            setError('Please paste your standup text.');
            return;
        }

        try {
            // Split the text by the main section headers
            const sections = inputText.split(/\n\d️⃣/);

            const yesterdayRegex = /What did you work on yesterday\?\*\*([\s\S]*)/;
            const todayRegex = /What are you working on today\?\*\*([\s\S]*)/;
            const blockersRegex = /Any blockers or help needed\?\*\*([\s\S]*)/;
            const notesRegex = /Extra notes\?\*\*([\s\S]*)/;
            
            const yesterdayText = sections.find(s => yesterdayRegex.test(s))?.match(yesterdayRegex)?.[1];
            const todayText = sections.find(s => todayRegex.test(s))?.match(todayRegex)?.[1];
            const blockersText = sections.find(s => blockersRegex.test(s))?.match(blockersRegex)?.[1];
            const notesText = sections.find(s => notesRegex.test(s))?.match(notesRegex)?.[1];

            const parsedData: ParsedStandupData = {
                date: parseDate(sections[0]),
                yesterdayWork: parseSectionContent(yesterdayText),
                todayWork: parseSectionContent(todayText),
                blockers: parseSectionContent(blockersText),
                notes: parseSectionContent(notesText),
            };

            onImport(parsedData);
            setInputText('');
            onClose();

        } catch (e) {
            console.error("Parsing failed:", e);
            setError("Could not parse the text. Please ensure it's in the correct format.");
        }
    }, [inputText, onImport, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 border border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Import from Text</h2>
                <p className="text-slate-400 text-sm mb-4">Paste your previously generated standup report below to populate the form.</p>
                <textarea
                    rows={10}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out placeholder-slate-500 text-sm"
                    placeholder="🗓️ **Daily Standup — 12 Nov 2025**..."
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleParseAndImport}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                    >
                        Import Data
                    </button>
                </div>
            </div>
        </div>
    );
};
