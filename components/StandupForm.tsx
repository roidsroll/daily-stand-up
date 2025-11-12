import React from 'react';
import { MoveIcon } from './icons';

interface StandupFormProps {
  date: string;
  setDate: (date: string) => void;
  yesterdayWork: string;
  setYesterdayWork: (work: string) => void;
  todayWork: string;
  setTodayWork: (work: string) => void;
  blockers: string;
  setBlockers: (blockers: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  handleMoveTasks: () => void;
}

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{title}</label>
        {children}
    </div>
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        rows={4}
        className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out placeholder-slate-500"
        {...props}
    />
);

export const StandupForm: React.FC<StandupFormProps> = ({
  date,
  setDate,
  yesterdayWork,
  setYesterdayWork,
  todayWork,
  setTodayWork,
  blockers,
  setBlockers,
  notes,
  setNotes,
  handleMoveTasks,
}) => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-xl font-bold text-cyan-400">Your Standup Details</h2>
      
      <FormSection title="🗓️ Date">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </FormSection>

      <FormSection title="1️⃣ What did you work on yesterday?">
        <TextArea
          value={yesterdayWork}
          onChange={(e) => setYesterdayWork(e.target.value)}
          placeholder="e.g., Mengerjakan env development | UAT"
        />
      </FormSection>

      <div className="flex justify-center my-2">
            <button 
                onClick={handleMoveTasks}
                disabled={!todayWork}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed text-sm shadow-md"
                title="Move today's tasks to yesterday's"
            >
                <MoveIcon className="w-4 h-4" />
                Pindahkan
            </button>
      </div>

      <FormSection title="2️⃣ What are you working on today?">
        <TextArea
          value={todayWork}
          onChange={(e) => setTodayWork(e.target.value)}
          placeholder="e.g., Melanjutkan Pengerjaan env development"
        />
      </FormSection>
      
      <FormSection title="3️⃣ Any blockers or help needed?">
        <TextArea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          placeholder="e.g., number_key yang berfungsi untuk kirim pesan..."
        />
      </FormSection>

      <FormSection title="4️⃣ Extra notes?">
        <TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="(Optional)"
        />
      </FormSection>
    </div>
  );
};