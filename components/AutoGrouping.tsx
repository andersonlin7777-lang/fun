
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateGroupNames } from '../services/geminiService';

interface AutoGroupingProps {
  participants: Participant[];
}

const AutoGrouping: React.FC<AutoGroupingProps> = ({ participants }) => {
  const [membersPerGroup, setMembersPerGroup] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('superheroes');

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleGroup = async () => {
    if (membersPerGroup < 1 || participants.length === 0) return;
    
    setIsGenerating(true);
    
    // Shuffle and group logic
    const shuffled = shuffleArray(participants);
    const result: Group[] = [];
    const groupCount = Math.ceil(shuffled.length / membersPerGroup);
    
    // Fetch creative names from Gemini
    const names = await generateGroupNames(groupCount, theme);
    
    for (let i = 0; i < groupCount; i++) {
      result.push({
        id: Math.random().toString(36).substr(2, 9),
        name: names[i] || `隊伍 ${i + 1}`,
        members: shuffled.slice(i * membersPerGroup, (i + 1) * membersPerGroup)
      });
    }

    setGroups(result);
    setIsGenerating(false);
  };

  const themes = [
    { id: 'superheroes', label: '超級英雄', icon: 'fa-mask' },
    { id: 'space', label: '星際宇宙', icon: 'fa-rocket' },
    { id: 'animals', label: '動物森林', icon: 'fa-paw' },
    { id: 'nature', label: '自然元素', icon: 'fa-leaf' },
    { id: 'business', label: '商業菁英', icon: 'fa-briefcase' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <i className="fas fa-cog text-indigo-600"></i> 分組設定
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">每組幾個人？</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={participants.length}
                value={membersPerGroup}
                onChange={(e) => setMembersPerGroup(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="w-12 text-center font-bold text-indigo-600 bg-indigo-50 py-1 rounded-md border border-indigo-100">
                {membersPerGroup}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">分組名稱主題</label>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                    theme === t.id 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <i className={`fas ${t.icon}`}></i> {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGroup}
            disabled={isGenerating || participants.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <><i className="fas fa-spinner fa-spin"></i> 生成中...</>
            ) : (
              <><i className="fas fa-users"></i> 開始自動分組</>
            )}
          </button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, idx) => (
            <div 
              key={group.id} 
              className="group-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group"
            >
              {/* Ribbon Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
                <i className="fas fa-users text-6xl -rotate-12 transform translate-x-4 -translate-y-4"></i>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{group.name}</h3>
                  <p className="text-xs text-slate-400">{group.members.length} 位成員</p>
                </div>
              </div>

              <div className="space-y-2">
                {group.members.map((member, mIdx) => (
                  <div 
                    key={member.id} 
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all text-sm"
                  >
                    <span className="w-5 h-5 flex items-center justify-center bg-white rounded text-[10px] text-slate-400 font-bold border border-slate-100">
                      {mIdx + 1}
                    </span>
                    <span className="font-medium text-slate-700">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoGrouping;
