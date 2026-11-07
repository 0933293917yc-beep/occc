import React, { useState } from 'react';
import { Character, Outfit, OutfitType } from '../types/character';
import { Plus, Shirt, Check, Palette, Sparkles, Filter, ChevronRight, Layers, Edit3, Trash2 } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface CostumesViewProps {
  characters: Character[];
  selectedCharacter?: Character | null;
  onSelectCharacter: (char: Character) => void;
  onOpenNewOutfitModal: (char: Character) => void;
  onOpenEditOutfitModal: (outfit: Outfit, char: Character) => void;
  onDeleteOutfit: (characterId: string, outfitId: string) => void;
}

export const CostumesView: React.FC<CostumesViewProps> = ({
  characters,
  selectedCharacter,
  onSelectCharacter,
  onOpenNewOutfitModal,
  onOpenEditOutfitModal,
  onDeleteOutfit,
}) => {
  const activeChar = selectedCharacter || characters[0];
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(
    activeChar?.outfits?.[0]?.id || ''
  );
  const [confirmDeleteOutfit, setConfirmDeleteOutfit] = useState<Outfit | null>(null);

  // If character changes and outfit isn't in new character, pick first outfit
  const currentOutfits = activeChar?.outfits || [];
  const activeOutfit =
    currentOutfits.find((o) => o.id === selectedOutfitId) ||
    currentOutfits[0];

  const filteredOutfits = currentOutfits.filter((outfit) => {
    if (filterType === 'all') return true;
    return outfit.type === filterType;
  });

  if (!activeChar) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-sm space-y-3">
        <p>目前尚無角色資料，請先建立角色以管理服裝造型。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">服裝管理</h1>
            <span className="text-indigo-500 font-bold">✦</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            記錄角色的各種服裝設計與造型靈感。
          </p>
        </div>

        <button
          onClick={() => onOpenNewOutfitModal(activeChar)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>新增造型</span>
        </button>
      </div>

      {/* Character Selector Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 shrink-0">選擇角色:</span>
        {characters.map((char) => {
          const isSelected = char.id === activeChar.id;
          return (
            <button
              key={char.id}
              onClick={() => {
                onSelectCharacter(char);
                if (char.outfits[0]) setSelectedOutfitId(char.outfits[0].id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img
                src={char.avatar}
                alt={char.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{char.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                {char.outfits.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Panel matching Bottom-Left Mockup */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8">
        
        {/* Filter Segmented Control: 全部, 日常服, 戰鬥服, 特殊服飾 */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterType('casual')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'casual'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            日常服
          </button>
          <button
            onClick={() => setFilterType('combat')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'combat'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            戰鬥服
          </button>
          <button
            onClick={() => setFilterType('special')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'special'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            特殊服飾
          </button>
          <button
            onClick={() => setFilterType('ceremonial')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'ceremonial'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            儀式禮服
          </button>
        </div>

        {/* 2-Column Layout: Outfits Grid (Left) & Detailed Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid: Outfit Thumbnails + Add slot */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredOutfits.map((outfit) => {
                const isSelected = activeOutfit?.id === outfit.id;
                return (
                  <div
                    key={outfit.id}
                    onClick={() => setSelectedOutfitId(outfit.id)}
                    className={`group relative rounded-2xl overflow-hidden border p-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-100 relative mb-2">
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xs">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {outfit.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {outfit.paletteName}
                    </div>
                  </div>
                );
              })}

              {/* Add New Picture / Outfit Slot Card */}
              <div
                onClick={() => onOpenNewOutfitModal(activeChar)}
                className="aspect-3/4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-300 transition-colors mb-2">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
                  新增圖片
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  造型草圖 / 差分
                </span>
              </div>
            </div>
          </div>

          {/* Right Inspector: Detailed Outfit Spec Panel */}
          <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5">
            {activeOutfit ? (
              <>
                {/* Large Preview */}
                <div className="aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-xs relative">
                  <img
                    src={activeOutfit.image}
                    alt={activeOutfit.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                    {activeChar.name} 的服裝
                  </span>
                </div>

                {/* Spec Table */}
                <div className="space-y-3 text-xs divide-y divide-slate-200/70">
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400 font-medium">名稱</span>
                    <span className="text-slate-900 font-bold text-sm">{activeOutfit.name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-slate-400 font-medium">類型</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium text-xs">
                      {activeOutfit.type === 'casual'
                        ? '日常服'
                        : activeOutfit.type === 'combat'
                        ? '戰鬥服'
                        : activeOutfit.type === 'ceremonial'
                        ? '儀式禮服'
                        : '特殊服飾'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-slate-400 font-medium">配色</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-800 font-medium">{activeOutfit.paletteName}</span>
                      <div className="flex items-center gap-1">
                        {activeOutfit.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <div className="text-slate-400 font-medium mb-1.5">設計重點</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeOutfit.keyFeatures.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 text-xs"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <div className="text-slate-400 font-medium mb-1">備註說明</div>
                    <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60 text-xs">
                      {activeOutfit.notes}
                    </p>
                  </div>

                  {activeOutfit.seasonOrOccasion && (
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-slate-400 font-medium">穿著場合</span>
                      <span className="text-slate-700">{activeOutfit.seasonOrOccasion}</span>
                    </div>
                  )}

                  {/* Actions for active outfit */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenEditOutfitModal(activeOutfit, activeChar)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Edit3 size={13} />
                      <span>編輯此造型</span>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteOutfit(activeOutfit)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>刪除造型</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                尚無服裝資料，點擊上方按鈕建立新造型。
              </div>
            )}
          </div>

        </div>

      </div>

      {/* In-app Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!confirmDeleteOutfit}
        title="刪除服裝造型"
        message={`確定要刪除「${activeChar.name}」的服裝造型「${confirmDeleteOutfit?.name || ''}」嗎？`}
        confirmText="確定刪除"
        cancelText="取消"
        isDanger={true}
        icon="trash"
        onConfirm={() => {
          if (confirmDeleteOutfit) {
            onDeleteOutfit(activeChar.id, confirmDeleteOutfit.id);
            setConfirmDeleteOutfit(null);
          }
        }}
        onCancel={() => setConfirmDeleteOutfit(null)}
      />

    </div>
  );
};
