import React, { useState, useEffect } from 'react';
import { WorldSetting } from '../types/character';
import { X, Save, Globe } from 'lucide-react';

interface WorldEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedWorld: Partial<WorldSetting>) => void;
  worldSetting: WorldSetting;
}

export const WorldEditModal: React.FC<WorldEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  worldSetting,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [overview, setOverview] = useState('');
  const [magicSystem, setMagicSystem] = useState('');
  const [geography, setGeography] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(worldSetting.title);
      setSubtitle(worldSetting.subtitle);
      setOverview(worldSetting.overview);
      setMagicSystem(worldSetting.magicSystem);
      setGeography(worldSetting.geography);
    }
  }, [isOpen, worldSetting]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      overview: overview.trim(),
      magicSystem: magicSystem.trim(),
      geography: geography.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              編輯世界觀總覽與架構
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">世界 / 大陸名稱</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：艾斯特拉大陸 (Aetheria)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">副標題 / 文明核心</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="例如：星穹與齒輪交織的魔法科技文明"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">世界背景大綱 (Overview)</label>
            <textarea
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="描述整個世界的基調、歷史謎團與社會狀態……"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">魔導與科技體系 (Magic / Tech System)</label>
            <textarea
              rows={2}
              value={magicSystem}
              onChange={(e) => setMagicSystem(e.target.value)}
              placeholder="說明魔力來源、技術迴路或異能設定……"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">地理與王國架構 (Geography)</label>
            <textarea
              rows={2}
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              placeholder="包含中央王都、浮空群島、地底城市、荒原密林等……"
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
              <span>儲存世界設定</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
