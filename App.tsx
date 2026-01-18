
import React, { useState, useCallback, useMemo } from 'react';
import { Participant, TabType } from './types';
import ListManager from './components/ListManager';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleUpdateParticipants = useCallback((names: string[]) => {
    const newList = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim()
    })).filter(p => p.name.length > 0);
    setParticipants(newList);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <i className="fas fa-users-cog text-xl"></i>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              HR Fun Hub
            </h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'list' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fas fa-list"></i> 名單管理
            </button>
            <button
              onClick={() => setActiveTab('draw')}
              disabled={participants.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'draw' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fas fa-gift"></i> 獎品抽籤
            </button>
            <button
              onClick={() => setActiveTab('grouping')}
              disabled={participants.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'grouping' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fas fa-layer-group"></i> 自動分組
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        {activeTab === 'list' && (
          <ListManager 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
          />
        )}
        {activeTab === 'draw' && (
          <LuckyDraw participants={participants} />
        )}
        {activeTab === 'grouping' && (
          <AutoGrouping participants={participants} />
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200">
        © {new Date().getFullYear()} HR Fun Hub - 你的活動好幫手
      </footer>
    </div>
  );
};

export default App;
