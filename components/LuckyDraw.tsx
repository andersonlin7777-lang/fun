
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Participant } from '../types';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [winnersHistory, setWinnersHistory] = useState<Participant[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  const availableParticipants = useMemo(() => {
    if (allowRepeat) return participants;
    const winningIds = new Set(winnersHistory.map(w => w.id));
    return participants.filter(p => !winningIds.has(p.id));
  }, [participants, winnersHistory, allowRepeat]);

  const startDraw = () => {
    if (isSpinning || availableParticipants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    
    let speed = 50;
    let count = 0;
    const maxCount = 30 + Math.floor(Math.random() * 20);

    const spin = () => {
      setDisplayIndex(prev => (prev + 1) % availableParticipants.length);
      count++;

      if (count < maxCount) {
        // Slowly increase the interval for a "stopping" effect
        if (count > maxCount * 0.7) speed += 20;
        timerRef.current = window.setTimeout(spin, speed);
      } else {
        const finalWinner = availableParticipants[displayIndex % availableParticipants.length];
        setWinner(finalWinner);
        setWinnersHistory(prev => [finalWinner, ...prev]);
        setIsSpinning(false);
      }
    };

    spin();
  };

  const resetHistory = () => {
    setWinnersHistory([]);
    setWinner(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">幸運大抽獎</h2>
          <p className="text-slate-500 mb-8">目前剩餘名額：{availableParticipants.length} 人</p>

          {/* Slot Display Area */}
          <div className="w-full max-w-md h-48 bg-slate-900 rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden border-4 border-slate-800">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isSpinning ? (
                <div className="text-4xl md:text-6xl font-black text-indigo-400 tracking-wider">
                  {availableParticipants[displayIndex]?.name}
                </div>
              ) : winner ? (
                <div className="flex flex-col items-center animate-bounce">
                  <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2">WINNER!</span>
                  <div className="text-5xl md:text-7xl font-black text-white">
                    {winner.name}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-xl font-medium">準備開始</div>
              )}
            </div>
            {/* Slot Lines Decor */}
            <div className="absolute top-0 bottom-0 left-4 w-px bg-slate-800 opacity-30"></div>
            <div className="absolute top-0 bottom-0 right-4 w-px bg-slate-800 opacity-30"></div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={allowRepeat} 
                  onChange={() => setAllowRepeat(!allowRepeat)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-slate-700">可重複中獎</span>
              </label>
            </div>

            <button
              onClick={startDraw}
              disabled={isSpinning || availableParticipants.length === 0}
              className={`px-12 py-4 rounded-2xl font-black text-xl shadow-lg transition-all transform active:scale-95 ${
                isSpinning || availableParticipants.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-200'
              }`}
            >
              {isSpinning ? '抽取中...' : '立即抽獎'}
            </button>
          </div>
        </div>
      </div>

      {/* History Area */}
      {winnersHistory.length > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="fas fa-history text-amber-500"></i> 中獎歷史
            </h3>
            <button 
              onClick={resetHistory}
              className="text-sm text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
            >
              <i className="fas fa-trash-alt"></i> 清除歷史
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {winnersHistory.map((w, idx) => (
              <div 
                key={`${w.id}-${idx}`} 
                className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-200 transition-all"
              >
                <div className="absolute -top-1 -right-1 bg-amber-400 text-[10px] font-bold text-white px-2 py-1 rounded-bl-lg">
                  #{winnersHistory.length - idx}
                </div>
                <i className="fas fa-trophy text-amber-400 text-xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                <span className="font-bold text-slate-700 text-lg truncate w-full text-center">{w.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
