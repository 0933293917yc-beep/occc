import React, { useState } from 'react';
import { Character, Artwork } from '../types/character';
import { Image as ImageIcon, ZoomIn, Calendar, Sparkles, Filter, X, Plus, Edit3, Trash2 } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface ArtworksViewProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
  onOpenAddArtwork: () => void;
  onOpenEditArtwork: (art: Artwork & { characterId: string }) => void;
  onDeleteArtwork: (characterId: string, artworkId: string) => void;
}

export const ArtworksView: React.FC<ArtworksViewProps> = ({
  characters,
  onSelectCharacter,
  onOpenAddArtwork,
  onOpenEditArtwork,
  onDeleteArtwork,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeArtwork, setActiveArtwork] = useState<(Artwork & { character: Character }) | null>(null);
  const [artToDelete, setArtToDelete] = useState<(Artwork & { characterId: string }) | null>(null);

  // Flatten all artworks with character reference
  const allArtworks = characters.flatMap((char) =>
    char.artworks.map((art) => ({
      ...art,
      character: char,
    }))
  );

  const filteredArtworks = allArtworks.filter((art) => {
    if (filterCategory === 'all') return true;
    return art.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">個人作品展示</h1>
            <span className="text-indigo-500 font-bold">✦</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            將角色的插畫創作與設定集整理成具有個人品牌的作品集畫廊。
          </p>
        </div>

        <button
          onClick={onOpenAddArtwork}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>新增作品</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-4">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
            filterCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          全部作品 ({allArtworks.length})
        </button>
        <button
          onClick={() => setFilterCategory('illustration')}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
            filterCategory === 'illustration'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          插畫作品
        </button>
        <button
          onClick={() => setFilterCategory('concept')}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
            filterCategory === 'concept'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          立繪概念
        </button>
        <button
          onClick={() => setFilterCategory('sketch')}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
            filterCategory === 'sketch'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          設計草稿
        </button>
      </div>

      {/* Grid of Artworks */}
      {filteredArtworks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
          此分類尚無作品，點擊右上角「新增作品」上傳圖片。
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div
                onClick={() => setActiveArtwork(art)}
                className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
              >
                <img
                  src={art.image}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-white flex items-center gap-2 text-xs">
                    <ZoomIn size={14} />
                    <span>點擊放大檢視</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar size={12} />
                    <span>{art.date}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium capitalize">
                    {art.category === 'illustration' ? '插畫' : art.category === 'concept' ? '概念立繪' : '草稿'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {art.title}
                </h3>

                {art.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {art.caption}
                  </p>
                )}

                {/* Character link badge and actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div
                    onClick={() => onSelectCharacter(art.character)}
                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <img
                      src={art.character.avatar}
                      alt={art.character.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-slate-700 hover:text-indigo-600">
                      {art.character.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditArtwork({ ...art, characterId: art.character.id })}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      title="編輯作品"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => setArtToDelete({ ...art, characterId: art.character.id })}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="刪除作品"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeArtwork && (
        <div
          onClick={() => setActiveArtwork(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl cursor-default"
          >
            <button
              onClick={() => setActiveArtwork(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-8 bg-slate-950 flex items-center justify-center p-4 max-h-[70vh]">
                <img
                  src={activeArtwork.image}
                  alt={activeArtwork.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="md:col-span-4 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="text-xs text-indigo-600 font-mono">
                    {activeArtwork.date} · {activeArtwork.category}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {activeArtwork.title}
                  </h3>
                  {activeArtwork.caption && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeArtwork.caption}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-400">關聯角色</div>
                  <button
                    onClick={() => {
                      onSelectCharacter(activeArtwork.character);
                      setActiveArtwork(null);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 transition-colors"
                  >
                    <img
                      src={activeArtwork.character.avatar}
                      alt={activeArtwork.character.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900">
                        {activeArtwork.character.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        點擊前往該角色檔案
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        const artToEdit = activeArtwork;
                        setActiveArtwork(null);
                        onOpenEditArtwork({ ...artToEdit, characterId: artToEdit.character.id });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium flex items-center gap-1.5 text-slate-700"
                    >
                      <Edit3 size={13} />
                      <span>編輯作品</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`確定要刪除作品「${activeArtwork.title}」嗎？`)) {
                          onDeleteArtwork(activeArtwork.character.id, activeArtwork.id);
                          setActiveArtwork(null);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      <span>刪除作品</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-app Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!artToDelete}
        title="刪除作品"
        message={`確定要刪除作品「${artToDelete?.title || ''}」嗎？`}
        confirmText="確定刪除"
        cancelText="取消"
        isDanger={true}
        icon="trash"
        onConfirm={() => {
          if (artToDelete) {
            onDeleteArtwork(artToDelete.characterId, artToDelete.id);
            setArtToDelete(null);
          }
        }}
        onCancel={() => setArtToDelete(null)}
      />

    </div>
  );
};
