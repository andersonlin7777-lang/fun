
import React, { useState, useEffect } from 'react';
import { Participant } from '../types';

interface ListManagerProps {
  participants: Participant[];
  onUpdate: (names: string[]) => void;
}

const ListManager: React.FC<ListManagerProps> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  // Update input text if participants changed from outside
  useEffect(() => {
    if (participants.length > 0 && inputText === '') {
      setInputText(participants.map(p => p.name).join('\n'));
    }
  }, [participants]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleApply = () => {
    const names = inputText.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
    onUpdate(names);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const names = content.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
      setInputText(names.join('\n'));
      onUpdate(names);
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-edit text-indigo-600"></i> 輸入名單
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            上傳 CSV 檔案
          </label>
          <div className="relative group">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            貼上姓名 (每行一個或以逗號分隔)
          </label>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="例如：&#10;王小明&#10;李大華&#10;張美麗"
            className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
          />
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-check-circle"></i> 更新名單
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-user-check text-green-600"></i> 當前名單 ({participants.length})
          </h2>
          {participants.length > 0 && (
            <button 
              onClick={() => { setInputText(''); onUpdate([]); }}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium"
            >
              全部清除
            </button>
          )}
        </div>

        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <i className="fas fa-user-slash text-4xl mb-4 opacity-20"></i>
              <p>目前尚無人員資料</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {participants.map((p, idx) => (
                <div key={p.id} className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                  <span className="text-slate-300 font-mono text-xs">{idx + 1}</span>
                  <span className="truncate">{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListManager;
