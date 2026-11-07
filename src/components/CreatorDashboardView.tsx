import React, { useState } from 'react';
import { Character, Artwork, CreatorProfile } from '../types/character';
import { Home, Users, Image as ImageIcon, Bookmark, Settings, ArrowRight, Sparkles, Gem, Heart, Star, Edit3, Download, Upload, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface CreatorDashboardViewProps {
  characters: Character[];
  creatorProfile: CreatorProfile;
  onOpenEditProfile: () => void;
  onSelectCharacter: (char: Character) => void;
  onEditCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onOpenNewCharacter: () => void;
  onNavigateHome: () => void;
  onNavigateCharacters: () => void;
  onNavigateArtworks: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type DashboardSidebarTab = 'overview' | 'my-characters' | 'my-works' | 'favorites' | 'settings';

export const CreatorDashboardView: React.FC<CreatorDashboardViewProps> = ({
  characters,
  creatorProfile,
  onOpenEditProfile,
  onSelectCharacter,
  onEditCharacter,
  onDeleteCharacter,
  onOpenNewCharacter,
  onNavigateHome,
  onNavigateCharacters,
  onNavigateArtworks,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const [currentTab, setCurrentTab] = useState<DashboardSidebarTab>('overview');
  const [charToDelete, setCharToDelete] = useState<Character | null>(null);

  // Compute live statistics
  const totalCharacters = characters.length;
  const totalArtworks = characters.reduce((acc, c) => acc + c.artworks.length + c.outfits.length, 0);
  const favoriteCharacters = characters.filter(c => c.isFavorite);
  const totalFavorites = favoriteCharacters.length;

  const recentCharacters = [...characters].sort((a, b) => (b.lastEdited || '').localeCompare(a.lastEdited || ''));

  return (
    <div className="space-y-6 pb-16">
      
      {/* Container Card matching Bottom-Right Mockup */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Sidebar matching Mockup */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200/80 p-6 sm:p-8 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Creator Avatar & Edit Profile Button */}
              <div className="flex flex-col items-center text-center">
                <div className="relative group cursor-pointer" onClick={onOpenEditProfile} title="點擊編輯個人檔案">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-indigo-500/10 mb-3">
                    <img
                      src={creatorProfile.avatar}
                      alt={creatorProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-3 right-0 bg-slate-900 text-white p-1 rounded-full shadow-xs">
                    <Edit3 size={11} />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-800">{creatorProfile.name}</h3>
                <span className="text-[11px] text-slate-400">{creatorProfile.title}</span>
                <button
                  onClick={onOpenEditProfile}
                  className="mt-2 text-[10px] text-indigo-600 hover:text-indigo-800 font-medium py-0.5 px-2 rounded-md hover:bg-indigo-50 border border-indigo-200/60"
                >
                  編輯檔案
                </button>
              </div>

              {/* Sidebar Nav Buttons matching Mockup: 首頁, 我的角色, 我的作品, 收藏管理, 設定 */}
              <div className="space-y-1 text-xs font-medium">
                <button
                  onClick={() => setCurrentTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    currentTab === 'overview'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <Home size={15} className={currentTab === 'overview' ? 'text-indigo-600' : 'text-slate-400'} />
                  <span>首頁儀表板</span>
                </button>

                <button
                  onClick={() => setCurrentTab('my-characters')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    currentTab === 'my-characters'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users size={15} className={currentTab === 'my-characters' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>我的角色</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {totalCharacters}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('my-works')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    currentTab === 'my-works'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon size={15} className={currentTab === 'my-works' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>我的作品</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {totalArtworks}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('favorites')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    currentTab === 'favorites'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bookmark size={15} className={currentTab === 'favorites' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>收藏管理</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {totalFavorites}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    currentTab === 'settings'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <Settings size={15} className={currentTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'} />
                  <span>資料備份與設定</span>
                </button>
              </div>
            </div>

            {/* Quick Slogan */}
            <div className="pt-6 border-t border-slate-200/60 text-[11px] text-slate-400">
              Character Archive v1.0
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 p-6 sm:p-10 space-y-8">
            
            {/* SUB-TAB 1: Overview matching Mockup */}
            {currentTab === 'overview' && (
              <>
                {/* Welcome Banner with fantasy backdrop */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#d9dfee] via-[#e8edf7] to-[#f2f4fc] p-6 sm:p-8 border border-slate-200/80">
                  <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-2 text-indigo-950 font-bold text-lg sm:text-xl font-display mb-1">
                      <span>嗨，{creatorProfile.name}！</span>
                      <span>歡迎回來</span>
                      <span className="text-indigo-600">✦</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {creatorProfile.bannerQuote} 目前已有 {totalCharacters} 位原創角色在世界觀中生動漫步。
                    </p>
                  </div>

                  {/* Decorative background visual */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-end pr-8">
                    <Gem size={120} className="text-indigo-600" />
                  </div>
                </div>

                {/* 3 Metric Stat Cards matching Mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: 角色總數 */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                      <Gem size={22} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">角色總數</div>
                      <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                        {totalCharacters}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: 作品總數 */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
                      <Heart size={22} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">作品總數</div>
                      <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                        {totalArtworks}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: 收藏數 */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                      <Star size={22} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">收藏數</div>
                      <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                        {totalFavorites}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 最近編輯 (Recently Edited) matching Mockup */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 font-display">最近編輯</h3>
                    <span className="text-xs text-slate-400">上次異動紀錄</span>
                  </div>

                  <div className="space-y-3">
                    {recentCharacters.slice(0, 3).map((char) => (
                      <div
                        key={char.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center justify-between gap-4"
                      >
                        <div
                          onClick={() => onSelectCharacter(char)}
                          className="flex items-center gap-3.5 cursor-pointer group"
                        >
                          <img
                            src={char.avatar}
                            alt={char.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {char.name}
                            </h4>
                            <p className="text-xs text-slate-400">
                              上次編輯：{char.lastEdited || '10/16'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditCharacter(char)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e4e7ee] hover:bg-[#d8dce6] text-slate-700 transition-colors flex items-center gap-1"
                          >
                            <span>繼續編輯</span>
                            <ArrowRight size={13} />
                          </button>
                          <button
                            onClick={() => setCharToDelete(char)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="刪除角色"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* SUB-TAB 2: My Characters Grid */}
            {currentTab === 'my-characters' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">所有原創角色清單</h3>
                  <button
                    onClick={onNavigateCharacters}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>開啟角色庫完整模式</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => onSelectCharacter(char)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3 bg-white"
                    >
                      <img
                        src={char.avatar}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{char.name}</h4>
                          <span className="text-[10px] text-slate-400">{char.age}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{char.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                          <span>{char.outfits.length} 造型</span>
                          <span>·</span>
                          <span>{char.artworks.length} 作品</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: My Works Gallery */}
            {currentTab === 'my-works' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">作品畫廊總覽</h3>
                  <p className="text-xs text-slate-500">集結所有角色的插畫、概念立繪與服裝設計作品</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {characters.flatMap(c => c.artworks.map(art => ({ ...art, characterName: c.name }))).map((art) => (
                    <div key={art.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-white group">
                      <div className="aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={art.image}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-[10px] text-slate-400">{art.characterName} · {art.date}</div>
                        <div className="text-xs font-bold text-slate-800 truncate mt-0.5">{art.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: Favorites */}
            {currentTab === 'favorites' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">我的收藏角色</h3>
                  <p className="text-xs text-slate-500">標記為喜愛的重要角色快速捷徑</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteCharacters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => onSelectCharacter(char)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={char.avatar}
                          alt={char.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{char.name}</h4>
                          <p className="text-xs text-slate-400">{char.romanizedName}</p>
                        </div>
                      </div>
                      <Heart size={16} className="text-rose-500" fill="currentColor" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 5: Settings & Backup */}
            {currentTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900">資料備份與還原設定</h3>
                  <p className="text-xs text-slate-500">所有創作設定儲存在本機瀏覽器中，可隨時匯出或重設。</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">匯出角色資料庫 (JSON)</div>
                      <div className="text-[11px] text-slate-500">下載包含所有角色、服裝與世界觀的完整備份檔案</div>
                    </div>
                    <button
                      onClick={onExportData}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Download size={13} />
                      <span>下載備份</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/70 pt-4">
                    <div>
                      <div className="text-xs font-bold text-slate-800">匯入角色資料庫</div>
                      <div className="text-[11px] text-slate-500">從先前備份的 JSON 檔案還原設定</div>
                    </div>
                    <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Upload size={13} />
                      <span>選擇檔案</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={onImportData}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/70 pt-4">
                    <div>
                      <div className="text-xs font-bold text-rose-700">重設為初始示範資料</div>
                      <div className="text-[11px] text-slate-500">清除自訂修改，回復到企劃案夏洛特與初期夥伴設定</div>
                    </div>
                    <button
                      onClick={onResetData}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1.5 transition-colors border border-rose-200"
                    >
                      <RotateCcw size={13} />
                      <span>還原預設</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

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
