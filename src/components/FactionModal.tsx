import React, { useState, useEffect } from 'react';
import { Faction } from '../types/character';
import { X, Save, Shield } from 'lucide-react';

interface FactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faction: Faction) => void;
  editingFaction?: Faction | null;
}

export const FactionModal: React.FC<FactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFaction,
}) => {
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [emblem, setEmblem] = useState('✦');
  const [color, setColor] = useState('#6366F1');
  const [baseLocation, setBaseLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingFaction) {
        setName(editingFaction.name);
        setEnglishName(editingFaction.englishName);
        setEmblem(editingFaction.emblem);
        setColor(editingFaction.color);
        setBaseLocation(editingFaction.baseLocation);
        setDescription(editingFaction.description);
      } else {
        setName('');
        setEnglishName('');
        setEmblem('✦');
        setColor('#6366F1');
        setBaseLocation('王都 · 晴空塔');
        setDescription('');
      }
    }
  }, [isOpen, editingFaction]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const fac: Faction = {
      id: editingFaction ? editingFaction.id : `faction-${Date.now()}`,
      name: name.trim(),
      englishName: englishName.trim() || name.trim(),
      emblem: emblem.trim() || '✦',
      color: color || '#6366F1',
      baseLocation: baseLocation.trim() || '未定駐地',
      description: description.trim() || '尚無詳細組織描述。',
    };

    onSave(fac);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              {editingFaction ? `編輯陣營：${editingFaction.name}` : '建立新陣營或組織'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">陣營名稱</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：皇家星象學院"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">英文名稱</label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="例如：Royal Astral Academy"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">代表符號</label>
              <input
                type="text"
                value={emblem}
                onChange={(e) => setEmblem(e.target.value)}
                placeholder="✦ / ◈ / ▲"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-center text-sm"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">主題色系</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">根據地駐址</label>
              <input
                type="text"
                value={baseLocation}
                onChange={(e) => setBaseLocation(e.target.value)}
                placeholder="王都 · 晴空塔"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">陣營宗旨與理念</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述該陣營的創立初衷、核心勢力範圍與政治立場……"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Save size={14} />
              <span>儲存陣營</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
