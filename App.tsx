import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { StandupForm } from './components/StandupForm';
import { Preview } from './components/Preview';
import { ImportModal, ParsedStandupData } from './components/ImportModal';
import { ImportIcon } from './components/icons';

const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    // Input is "YYYY-MM-DD", which JS new Date() treats as UTC.
    // To prevent timezone-related date shifts, we can split and construct.
    const parts = dateString.split('-').map(part => parseInt(part, 10));
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatSection = (content: string): string => {
    if (!content.trim()) return '> -\n';
    return content.trim().split('\n').map(line => `> ${line.trim()}`).join('\n') + '\n';
};


const App: React.FC = () => {
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [yesterdayWork, setYesterdayWork] = useState<string>('');
    const [todayWork, setTodayWork] = useState<string>('');
    const [blockers, setBlockers] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [isImportModalOpen, setImportModalOpen] = useState(false);

    const handleMoveTasks = useCallback(() => {
        if (todayWork.trim()) {
            const newYesterdayWork = yesterdayWork.trim()
                ? `${yesterdayWork.trim()}\n${todayWork.trim()}`
                : todayWork.trim();
            setYesterdayWork(newYesterdayWork);
            setTodayWork('');
        }
    }, [todayWork, yesterdayWork]);

    const handleImportData = useCallback((data: ParsedStandupData) => {
        setDate(data.date);
        setYesterdayWork(data.yesterdayWork);
        setTodayWork(data.todayWork);
        setBlockers(data.blockers);
        setNotes(data.notes);
    }, []);

    const formattedMessage = useMemo(() => {
        const formattedDate = formatDate(date);
        
        const yesterdayContent = formatSection(yesterdayWork);
        const todayContent = formatSection(todayWork);
        const blockersContent = formatSection(blockers);
        const notesContent = formatSection(notes);
        
        return `🗓️ **Daily Standup — ${formattedDate}**

1️⃣ **What did you work on yesterday?**
${yesterdayContent}
2️⃣ **What are you working on today?**
${todayContent}
3️⃣ **Any blockers or help needed?**
${blockersContent}
4️⃣ **Extra notes?**
${notesContent}`;
    }, [date, yesterdayWork, todayWork, blockers, notes]);

    return (
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImport={handleImportData}
            />
            <div className="w-full max-w-6xl mx-auto bg-slate-800 rounded-xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
                <header className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-center text-white">Daily Standup Generator</h1>
                        <p className="text-center text-slate-400 text-sm mt-1">Quickly format and share your daily updates.</p>
                    </div>
                    <button 
                      onClick={() => setImportModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors text-sm shadow-md ml-4"
                      title="Import from text"
                    >
                      <ImportIcon className="w-4 h-4" />
                      Import
                    </button>
                </header>
                <div className="grid md:grid-cols-2">
                    <StandupForm
                        date={date}
                        setDate={setDate}
                        yesterdayWork={yesterdayWork}
                        setYesterdayWork={setYesterdayWork}
                        todayWork={todayWork}
                        setTodayWork={setTodayWork}
                        blockers={blockers}
                        setBlockers={setBlockers}
                        notes={notes}
                        setNotes={setNotes}
                        handleMoveTasks={handleMoveTasks}
                    />
                    <div className="border-t border-slate-700 md:border-t-0 md:border-l">
                      <Preview formattedText={formattedMessage} />
                    </div>
                </div>
            </div>
            <footer className="text-center mt-6 text-sm text-slate-500">
              <p>Built with React, TypeScript, and Tailwind CSS.</p>
            </footer>
        </main>
    );
};

export default App;