import React, { useState } from 'react';
import { Character, WorldSetting } from '../types/character';
import { Plus, Search, Heart, ArrowRight, Filter, Sparkles, Edit3, Trash2, Copy } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface CharacterRosterViewProps {
  characters: Character[];
  worldSetting: WorldSetting;
  searchQuery: string;
  onSelectCharacter: (char: Character) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenNewCharacterModal: () => void;
  onEditCharacter: (char: Character) => void;
  onDuplicateCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
}

export const CharacterRosterView: React.FC<CharacterRosterViewProps> = ({
  characters,
  worldSetting,
  searchQuery,
  onSelectCharacter,
  onToggleFavorite,
  onOpenNewCharacterModal,
  onEditCharacter,
  onDuplicateCharacter,
  onDeleteCharacter,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedFaction, setSelectedFaction] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'outfits'>('recent');
  const [charToDelete, setCharToDelete] = useState<Character | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(characters.flatMap((c) => c.tags)));

  // Filter & sort
  const filtered = characters
    .filter((char) => {
      // Global search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = char.name.toLowerCase().includes(q) || char.romanizedName.toLowerCase().includes(q);
        const matchesTag = char.tags.some(t => t.toLowerCase().includes(q));
        const matchesBg = char.background.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesBg) return false;
      }

      // Tag filter
      if (selectedTag !== 'all' && !char.tags.includes(selectedTag)) {
        return false;
      }

      // Faction filter
      if (selectedFaction !== 'all' && char.factionId !== selectedFaction) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'outfits') return b.outfits.length - a.outfits.length;
      return (b.lastEdited || '').localeCompare(a.lastEdited || '');
    });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">角色庫總覽</h1>
            <span className="text-indigo-500 font-bold">✦</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            收錄所有已建構的原創角色設定檔與立繪檔案。
          </p>
        </div>

        <button
          onClick={onOpenNewCharacterModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>建立新角色</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-2xs">
        
        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium shrink-0">標籤篩選:</span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full shrink-0 transition-all ${
              selectedTag === 'all'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full shrink-0 transition-all ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Faction and Sort Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">陣營:</span>
            <select
              value={selectedFaction}
              onChange={(e) => setSelectedFaction(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">所有陣營</option>
              {worldSetting.factions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="recent">最近編輯</option>
              <option value="name">角色名稱</option>
              <option value="outfits">服裝數量</option>
            </select>
          </div>
        </div>

      </div>

      {/* Character Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-sm">
          沒有找到符合條件的角色。
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((char) => {
            const faction = worldSetting.factions.find(f => f.id === char.factionId);

            return (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Avatar image container */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Favorite Heart */}
                    <button
                      onClick={(e) => onToggleFavorite(char.id, e)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all ${
                        char.isFavorite
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-white/70 text-slate-600 hover:bg-white hover:text-rose-500'
                      }`}
                      title={char.isFavorite ? '已收藏' : '加入收藏'}
                    >
                      <Heart size={14} fill={char.isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    {/* Faction Badge */}
                    {faction && (
                      <span
                        className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-md border border-white/40 shadow-2xs"
                        style={{ backgroundColor: `${faction.color}CC`, color: '#FFFFFF' }}
                      >
                        {faction.name}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {char.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {char.romanizedName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {char.title}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {char.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quote Preview */}
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 pt-1 font-serif">
                      {char.quote}
                    </p>
                  </div>
                </div>

                {/* Footer details with action buttons */}
                <div className="p-3 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span>{char.outfits.length} 造型</span>
                    <span>·</span>
                    <span>{char.artworks.length} 作品</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateCharacter(char);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      title="複製角色分支"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCharacter(char);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      title="編輯角色"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCharToDelete(char);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="刪除角色"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-app Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!charToDelete}
        title="刪除原創角色"
        message={`確定要刪除原創角色「${charToDelete?.name || ''}」嗎？此操作將同時移除其造型與關聯作品。`}
        confirmText="確定刪除"
        cancelText="取消"
        isDanger={true}
        icon="trash"
        onConfirm={() => {
          if (charToDelete) {
            onDeleteCharacter(charToDelete.id);
            setCharToDelete(null);
          }
        }}
        onCancel={() => setCharToDelete(null)}
      />

    </div>
  );
};
