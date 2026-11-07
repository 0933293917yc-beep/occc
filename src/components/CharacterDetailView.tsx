import React, { useState } from 'react';
import { Character, Outfit, Relationship, WorldSetting, Artwork } from '../types/character';
import { User, Shirt, Network, Image as ImageIcon, Edit3, Heart, ArrowLeft, ArrowRight, Sparkles, ZoomIn, Calendar, Ruler, Award, Shield, Trash2, Copy, Plus } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface CharacterDetailViewProps {
  character: Character;
  allCharacters: Character[];
  relationships: Relationship[];
  worldSetting: WorldSetting;
  onBack: () => void;
  onEdit: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onDuplicateCharacter: (char: Character) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectCharacter: (char: Character) => void;
  onSelectOutfit: (outfit: Outfit, char: Character) => void;
  onNavigateToCostumes: () => void;
  onNavigateToWorld: () => void;
  onAddOutfit: (char: Character) => void;
  onEditOutfit: (outfit: Outfit, char: Character) => void;
  onDeleteOutfit: (characterId: string, outfitId: string) => void;
  onAddRelationship: (char: Character) => void;
  onDeleteRelationship: (relId: string) => void;
  onAddArtwork: (char: Character) => void;
  onDeleteArtwork: (characterId: string, artworkId: string) => void;
}

type DetailTab = 'info' | 'outfits' | 'relationships' | 'artworks';

export const CharacterDetailView: React.FC<CharacterDetailViewProps> = ({
  character,
  allCharacters,
  relationships,
  worldSetting,
  onBack,
  onEdit,
  onDeleteCharacter,
  onDuplicateCharacter,
  onToggleFavorite,
  onSelectCharacter,
  onSelectOutfit,
  onNavigateToCostumes,
  onNavigateToWorld,
  onAddOutfit,
  onEditOutfit,
  onDeleteOutfit,
  onAddRelationship,
  onDeleteRelationship,
  onAddArtwork,
  onDeleteArtwork,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<DetailTab>('info');
  const [isZoomTachie, setIsZoomTachie] = useState(false);

  // In-app confirmation dialog
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Find relationships involving this character
  const charRelationships = relationships.filter(
    r => r.sourceId === character.id || r.targetId === character.id
  );

  // Character's faction
  const faction = worldSetting.factions.find(f => f.id === character.factionId);

  const handleDeleteSelf = () => {
    setConfirmState({
      isOpen: true,
      title: '刪除原創角色',
      message: `確定要刪除原創角色「${character.name}」嗎？此操作將同時移除其造型與關聯紀錄。`,
      onConfirm: () => onDeleteCharacter(character.id),
    });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft size={14} />
          <span>返回角色庫</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Duplicate character */}
          <button
            onClick={() => onDuplicateCharacter(character)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="複製角色為新分支設定"
          >
            <Copy size={13} />
            <span className="hidden sm:inline">複製分支</span>
          </button>

          {/* Favorite */}
          <button
            onClick={(e) => onToggleFavorite(character.id, e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border shadow-2xs ${
              character.isFavorite
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart size={13} fill={character.isFavorite ? 'currentColor' : 'none'} />
            <span>{character.isFavorite ? '已收藏' : '加入收藏'}</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(character)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Edit3 size={13} />
            <span>編輯資料</span>
          </button>

          {/* Delete */}
          <button
            onClick={handleDeleteSelf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-colors shadow-2xs"
            title="刪除角色"
          >
            <Trash2 size={13} />
            <span>刪除角色</span>
          </button>
        </div>
      </div>

      {/* Main Container Card - Matches Top Right Reference Mockup */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Column: Avatar & Sub-navigation Sidebar */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200/80 p-6 sm:p-8 bg-slate-50/50 flex flex-col items-center justify-between">
            
            <div className="w-full flex flex-col items-center">
              {/* Circular Avatar */}
              <div className="relative mb-5 group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-indigo-500/10">
                  <img
                    src={character.avatar}
                    alt={character.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-xs border border-slate-100">
                  <span className="text-xs text-indigo-500 font-bold">✦</span>
                </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div className="w-full space-y-1.5">
                <button
                  onClick={() => setActiveSubTab('info')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeSubTab === 'info'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <User size={15} className={activeSubTab === 'info' ? 'text-indigo-600' : 'text-slate-400'} />
                  <span>角色資訊</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('outfits')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeSubTab === 'outfits'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shirt size={15} className={activeSubTab === 'outfits' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>服裝造型</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {character.outfits.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab('relationships')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeSubTab === 'relationships'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Network size={15} className={activeSubTab === 'relationships' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>關係設定</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {charRelationships.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab('artworks')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeSubTab === 'artworks'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon size={15} className={activeSubTab === 'artworks' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>作品紀錄</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {character.artworks.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Sidebar Action: 編輯資料 */}
            <div className="w-full mt-6 pt-4 border-t border-slate-200/60 flex flex-col gap-2">
              <button
                onClick={() => onEdit(character)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#e4e7ee] hover:bg-[#d8dce6] text-slate-700 transition-colors"
              >
                <Edit3 size={13} />
                <span>編輯資料</span>
              </button>
            </div>

          </div>

          {/* Right Main Content Area: Character Profile View */}
          <div className="lg:col-span-9 p-6 sm:p-10 flex flex-col justify-between">
            
            {/* SUB-TAB 1: Basic Info (The Default Layout in Reference UI) */}
            {activeSubTab === 'info' && (
              <div className="space-y-8">
                
                {/* Header row + Tachie split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Titles, Quotes & Detailed Attributes */}
                  <div className="md:col-span-7 space-y-6">
                    
                    {/* Character Name & Romanized Name */}
                    <div>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                          {character.name}
                        </h1>
                        <span className="text-base sm:text-lg text-slate-400 font-display">
                          {character.romanizedName}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 font-medium mt-1">
                        {character.title}
                      </p>
                    </div>

                    {/* Tag Chips matching mockup: 少女, 魔法, 溫柔, 古典 */}
                    <div className="flex flex-wrap gap-2">
                      {character.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200/60"
                        >
                          {tag}
                        </span>
                      ))}
                      {faction && (
                        <span
                          className="px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5"
                          style={{ backgroundColor: `${faction.color}15`, color: faction.color }}
                        >
                          <span>{faction.emblem}</span>
                          <span>{faction.name}</span>
                        </span>
                      )}
                    </div>

                    {/* Famous Quote line */}
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 relative">
                      <p className="text-sm sm:text-base text-slate-700 font-serif italic">
                        {character.quote}
                      </p>
                    </div>

                    {/* Detailed Key Attributes (年齡, 身高, 生日, 個性, 背景故事) */}
                    <div className="space-y-3 pt-2 text-xs sm:text-sm">
                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-slate-400 font-medium">年齡</span>
                        <span className="col-span-2 text-slate-800 font-medium">{character.age}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-slate-400 font-medium">身高</span>
                        <span className="col-span-2 text-slate-800 font-medium">{character.height}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-slate-400 font-medium">生日</span>
                        <span className="col-span-2 text-slate-800 font-medium">{character.birthday}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-slate-400 font-medium">個性</span>
                        <span className="col-span-2 text-slate-800 font-medium">{character.personality}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <span className="text-indigo-500">✦</span>
                          <span>背景故事</span>
                        </span>
                        <p className="col-span-2 text-slate-600 leading-relaxed text-xs sm:text-sm">
                          {character.background}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Large Standing Tachie (立繪) */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div
                      onClick={() => setIsZoomTachie(true)}
                      className="relative w-full max-w-[280px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-sm cursor-zoom-in group"
                      title="點擊放大檢視完整立繪"
                    >
                      <img
                        src={character.tachie}
                        alt={`${character.name} 立繪`}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto max-h-[380px] object-contain mx-auto transition-transform duration-500 group-hover:scale-103"
                      />
                      <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn size={14} />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-slate-400 bg-white/80 backdrop-blur-xs py-1 rounded">
                        立繪原案 · 點擊縮放
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Section: 角色造型 (Costumes Preview Carousel) */}
                <div className="pt-6 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 font-display">角色造型</h3>
                      <span className="text-xs text-slate-400">({character.outfits.length} 款設計)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onAddOutfit(character)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <Plus size={13} />
                        <span>新增造型</span>
                      </button>
                      <button
                        onClick={onNavigateToCostumes}
                        className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                      >
                        <span>查看更多</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Outfits thumbnail grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {character.outfits.map((outfit) => (
                      <div
                        key={outfit.id}
                        onClick={() => onSelectOutfit(outfit, character)}
                        className="group bg-slate-50 hover:bg-indigo-50/50 p-2.5 rounded-xl border border-slate-200/70 hover:border-indigo-200 transition-all cursor-pointer text-left relative"
                      >
                        <div className="aspect-3/4 rounded-lg overflow-hidden bg-white mb-2 relative">
                          <img
                            src={outfit.image}
                            alt={outfit.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] bg-slate-900/70 text-white rounded backdrop-blur-xs">
                            {outfit.type === 'casual' ? '日常服' : outfit.type === 'combat' ? '戰鬥服' : outfit.type === 'ceremonial' ? '儀式禮服' : '特殊服飾'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                          {outfit.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {outfit.paletteName}
                        </div>
                      </div>
                    ))}

                    {/* Quick Add Outfit Slot */}
                    <button
                      onClick={() => onAddOutfit(character)}
                      className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center p-4 text-center group transition-colors"
                    >
                      <Plus size={18} className="text-slate-400 group-hover:text-indigo-600 mb-1" />
                      <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-600">
                        新增造型
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-TAB 2: Outfits Detailed List */}
            {activeSubTab === 'outfits' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">服裝造型管理</h2>
                    <p className="text-xs text-slate-500">記錄 {character.name} 的所有外觀設計與配色細節</p>
                  </div>
                  <button
                    onClick={() => onAddOutfit(character)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 shadow-xs"
                  >
                    <Plus size={14} />
                    <span>新增服裝造型</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {character.outfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-white flex gap-4 relative group"
                    >
                      <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer" onClick={() => onSelectOutfit(outfit, character)}>
                        <img
                          src={outfit.image}
                          alt={outfit.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{outfit.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">
                              {outfit.type === 'casual' ? '日常服' : outfit.type === 'combat' ? '戰鬥服' : outfit.type === 'ceremonial' ? '禮服' : '特殊'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{outfit.paletteName}</p>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2">{outfit.notes}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                          <div className="flex items-center gap-1.5">
                            {outfit.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-2xs"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditOutfit(outfit, character)}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                              title="編輯此造型"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmState({
                                  isOpen: true,
                                  title: '刪除服裝造型',
                                  message: `確定要刪除造型「${outfit.name}」嗎？`,
                                  onConfirm: () => onDeleteOutfit(character.id, outfit.id),
                                });
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="刪除造型"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: Relationships */}
            {activeSubTab === 'relationships' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">人物關係網絡</h2>
                    <p className="text-xs text-slate-500">{character.name} 與其他角色的羈絆與交往情誼</p>
                  </div>
                  <button
                    onClick={() => onAddRelationship(character)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 shadow-xs"
                  >
                    <Plus size={14} />
                    <span>新增關係連結</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {charRelationships.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                      尚無設定直接關係，點擊右上角「新增關係連結」建立與其他角色的故事聯繫。
                    </div>
                  ) : (
                    charRelationships.map((rel) => {
                      const otherId = rel.sourceId === character.id ? rel.targetId : rel.sourceId;
                      const otherChar = allCharacters.find(c => c.id === otherId);
                      if (!otherChar) return null;

                      return (
                        <div
                          key={rel.id}
                          className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-center justify-between gap-4"
                        >
                          <div
                            onClick={() => onSelectCharacter(otherChar)}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <img
                              src={otherChar.avatar}
                              alt={otherChar.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">{otherChar.name}</h4>
                                <span className="text-xs text-slate-400">({otherChar.romanizedName})</span>
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded-md">
                                  {rel.label}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 max-w-lg">{rel.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setConfirmState({
                                  isOpen: true,
                                  title: '解除人物關係',
                                  message: `確定要解除與「${otherChar.name}」的關係連結嗎？`,
                                  onConfirm: () => onDeleteRelationship(rel.id),
                                });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="刪除此關係"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div
                              onClick={() => onSelectCharacter(otherChar)}
                              className="text-slate-400 hover:text-indigo-600 cursor-pointer p-1"
                            >
                              <ArrowRight size={16} />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: Artworks */}
            {activeSubTab === 'artworks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">作品與創作紀錄</h2>
                    <p className="text-xs text-slate-500">收錄關於 {character.name} 的插畫、設定圖與創作歷程</p>
                  </div>
                  <button
                    onClick={() => onAddArtwork(character)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 shadow-xs"
                  >
                    <Plus size={14} />
                    <span>新增角色作品</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {character.artworks.length === 0 ? (
                    <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                      尚無作品紀錄，點擊右上角新增角色插畫或概念稿。
                    </div>
                  ) : (
                    character.artworks.map((art) => (
                      <div
                        key={art.id}
                        className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 group relative"
                      >
                        <div className="aspect-16/10 overflow-hidden bg-slate-200">
                          <img
                            src={art.image}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span>{art.date}</span>
                            <span className="capitalize">{art.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{art.title}</h4>
                          {art.caption && (
                            <p className="text-xs text-slate-500 mt-1">{art.caption}</p>
                          )}

                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex justify-end">
                            <button
                              onClick={() => {
                                setConfirmState({
                                  isOpen: true,
                                  title: '刪除作品',
                                  message: `確定要刪除作品「${art.title}」嗎？`,
                                  onConfirm: () => onDeleteArtwork(character.id, art.id),
                                });
                              }}
                              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                            >
                              <Trash2 size={12} />
                              <span>刪除</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Tachie Zoom Lightbox Modal */}
      {isZoomTachie && (
        <div
          onClick={() => setIsZoomTachie(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-transparent">
            <img
              src={character.tachie}
              alt={character.name}
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto mx-auto object-contain drop-shadow-2xl rounded-xl"
            />
            <div className="text-center text-white/80 text-xs mt-3">
              {character.name} ({character.romanizedName}) · 點擊任意處關閉
            </div>
          </div>
        </div>
      )}

      {/* In-app Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="確定刪除"
        cancelText="取消"
        isDanger={true}
        icon="trash"
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};
