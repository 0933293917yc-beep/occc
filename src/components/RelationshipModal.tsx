import React, { useState, useEffect } from 'react';
import { Character, Relationship } from '../types/character';
import { X, Save, Network } from 'lucide-react';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (relData: Relationship) => void;
  characters: Character[];
  initialSourceChar?: Character | null;
  editingRelationship?: Relationship | null;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({
  isOpen,
  onClose,
  onSave,
  characters,
  initialSourceChar,
  editingRelationship,
}) => {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'positive' | 'neutral' | 'rivalry'>('positive');

  useEffect(() => {
    if (isOpen) {
      if (editingRelationship) {
        setSourceId(editingRelationship.sourceId);
        setTargetId(editingRelationship.targetId);
        setLabel(editingRelationship.label);
        setDescription(editingRelationship.description);
        setType(editingRelationship.type || 'positive');
      } else {
        const src = initialSourceChar?.id || characters[0]?.id || '';
        const tgt = characters.find(c => c.id !== src)?.id || characters[1]?.id || '';
        setSourceId(src);
        setTargetId(tgt);
        setLabel('夥伴');
        setDescription('兩人建立了深厚的羈絆與信任。');
        setType('positive');
      }
    }
  }, [isOpen, initialSourceChar, editingRelationship, characters]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId || !label.trim()) return;

    const rel: Relationship = {
      id: editingRelationship ? editingRelationship.id : `rel-${Date.now()}`,
      sourceId,
      targetId,
      label: label.trim(),
      description: description.trim() || '尚無詳細描述',
      type,
    };

    onSave(rel);
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
            <Network size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              {editingRelationship ? '編輯角色關係' : '新增角色羈絆關係'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">第一位角色</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                {characters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.romanizedName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">第二位角色</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                {characters.map(c => (
                  <option key={c.id} value={c.id} disabled={c.id === sourceId}>
                    {c.name} {c.id === sourceId ? '(不可重複)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">關係標籤</label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="例如：守護與信賴、宿敵、師徒"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">關係性質</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="positive">友好 / 信賴</option>
                <option value="neutral">中立 / 合作</option>
                <option value="rivalry">宿敵 / 對立</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">關係背景與互動描述</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述兩人是如何認識的，有何種糾葛或共同回憶……"
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
              <span>儲存關係</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
