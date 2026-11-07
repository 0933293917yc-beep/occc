import React, { useState, useEffect } from 'react';
import { TimelineEvent, Character } from '../types/character';
import { X, Save, BookOpen } from 'lucide-react';

interface TimelineEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: TimelineEvent) => void;
  characters: Character[];
  editingEvent?: TimelineEvent | null;
}

export const TimelineEventModal: React.FC<TimelineEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  characters,
  editingEvent,
}) => {
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [involvedCharacterIds, setInvolvedCharacterIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setYear(editingEvent.year);
        setTitle(editingEvent.title);
        setCategory(editingEvent.category);
        setDescription(editingEvent.description);
        setInvolvedCharacterIds(editingEvent.involvedCharacterIds || []);
      } else {
        setYear('光輝曆 935 年');
        setTitle('');
        setCategory('歷史事件');
        setDescription('');
        setInvolvedCharacterIds([]);
      }
    }
  }, [isOpen, editingEvent]);

  if (!isOpen) return null;

  const toggleCharacter = (id: string) => {
    setInvolvedCharacterIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !year.trim()) return;

    const ev: TimelineEvent = {
      id: editingEvent ? editingEvent.id : `event-${Date.now()}`,
      year: year.trim(),
      title: title.trim(),
      category: category.trim() || '歷史事件',
      description: description.trim() || '尚無事件詳細內容。',
      involvedCharacterIds,
    };

    onSave(ev);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              {editingEvent ? '編輯重大歷史事件' : '新增世界觀歷史事件'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">紀年 / 年份</label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="例如：光輝曆 742 年"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium text-slate-700 mb-1">事件分類</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="大災變 / 戰役 / 文明開端"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">事件標題</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：天穹之梯墜落、星辰命定之邂逅"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">事件起因與影響</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="說明事件經過，對世界秩序或角色關係產生了哪些不可逆的改變……"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
            />
          </div>

          {/* Involved characters selector */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">關聯角色 (點選選取)</label>
            <div className="flex flex-wrap gap-2">
              {characters.map(c => {
                const isSelected = involvedCharacterIds.includes(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => toggleCharacter(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
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
              <span>儲存事件</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
