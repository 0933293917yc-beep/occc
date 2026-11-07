import React from 'react';
import { Character } from '../types/character';
import { StarSparkle, MiniSparkle } from './StarSparkle';
import { ArrowRight, Heart, Sparkles, UserCheck, Shirt, Network, Image as ImageIcon, Plus } from 'lucide-react';

interface HomeViewProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
  onExploreClick: () => void;
  onViewCostumes: () => void;
  onViewWorld: () => void;
  onViewArtworks: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenNewCharacterModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  characters,
  onSelectCharacter,
  onExploreClick,
  onViewCostumes,
  onViewWorld,
  onViewArtworks,
  onToggleFavorite,
  onOpenNewCharacterModal,
}) => {
  // Safe filtering of characters to prevent undefined elements
  const validCharacters = (characters || []).filter((c): c is Character => Boolean(c && typeof c === 'object' && c.name));

  const fallbackHero: Character = validCharacters[0] || {
    id: 'char-charlotte-fallback',
    name: '夏洛特',
    romanizedName: 'Charlotte',
    title: '星芒旅者 · 角色資料庫展示',
    avatar: '/src/assets/images/charlotte_avatar_1793426975684.jpg',
    tachie: '/src/assets/images/charlotte_tachie_1793426976035.jpg',
    tags: ['少女', '魔法', '漫遊', '古典'],
    quote: '「……沒關係的，我會一直在。」',
    age: '17歲',
    height: '162cm',
    birthday: '4月14日',
    gender: '女性',
    personality: '溫柔、堅強、有點怕生',
    background: '來自某個被遺忘的王國，在旅途中尋找著屬於自己的未來。',
    factionId: 'faction-starlight',
    isFavorite: true,
    lastEdited: '剛剛',
    outfits: [],
    artworks: [],
  };

  const featuredHeroCharacter = validCharacters.find(c => c?.id === 'char-charlotte') || validCharacters[0] || fallbackHero;
  const popularCharacters = validCharacters.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner - Exact visual composition from reference UI */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-[#f0f3fa] to-[#e4e9f7] border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Decorative background crystal sparks */}
        <div className="absolute top-6 left-12 opacity-40 pointer-events-none">
          <MiniSparkle size={20} className="text-indigo-400" />
        </div>
        <div className="absolute top-1/2 left-8 opacity-25 pointer-events-none">
          <MiniSparkle size={26} className="text-indigo-300" />
        </div>
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
          
          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center z-10">
            
            <div className="flex items-center gap-2 mb-4">
              <StarSparkle size={22} className="text-indigo-600" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500">
                Collect · Organize · Create
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-display font-bold tracking-tight text-slate-900 leading-[1.15] mb-4">
              Character <br className="hidden sm:inline" />
              <span className="text-indigo-950 font-serif-brand tracking-normal font-semibold">Archive</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              整理你的角色，<br className="hidden sm:inline" />
              建構屬於你的創作世界。
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#525b76] hover:bg-[#3f475f] text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>開始探索</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onOpenNewCharacterModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-300/80 shadow-xs hover:border-slate-400 transition-all"
              >
                <Plus size={16} className="text-indigo-600" />
                <span>建立新角色</span>
              </button>
            </div>

            {/* Quick Slogan Badge */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-500">
              <span className="text-indigo-500 font-semibold">✦</span>
              <span>「讓每個角色，都有屬於自己的專屬空間。」</span>
            </div>
          </div>

          {/* Right Column: Hero Character Visual Artwork */}
          <div className="lg:col-span-5 relative flex items-center justify-center p-6 lg:p-0 overflow-hidden">
            <div className="relative w-full h-full min-h-[360px] lg:min-h-full flex items-center justify-center">
              
              {/* Ethereal Glow Background */}
              <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-transparent z-1" />
              
              {/* Character Illustration */}
              <div className="relative z-10 w-full max-w-sm lg:max-w-none h-full flex items-center justify-center group cursor-pointer"
                   onClick={() => onSelectCharacter(featuredHeroCharacter)}
                   title={`查看 ${featuredHeroCharacter.name} 的角色檔案`}>
                <img
                  src={featuredHeroCharacter.avatar}
                  alt={featuredHeroCharacter.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full max-h-[460px] object-cover object-top rounded-2xl lg:rounded-none lg:rounded-l-none lg:rounded-r-3xl transition-transform duration-700 group-hover:scale-102"
                />
                
                {/* Floating Character Badge on Image */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/60 text-right">
                  <div className="text-xs font-bold text-slate-900">{featuredHeroCharacter.name}</div>
                  <div className="text-[10px] text-slate-500">{featuredHeroCharacter.romanizedName} · {featuredHeroCharacter.title}</div>
                </div>
              </div>

              {/* Sparkle overlay */}
              <div className="absolute top-10 right-10 text-white/80 pointer-events-none z-20">
                <MiniSparkle size={24} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Characters Section (熱門角色 ✦) matching Reference Mockup */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-display">熱門角色</h2>
            <span className="text-indigo-500 text-sm">✦</span>
          </div>
          <button
            onClick={onExploreClick}
            className="group text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <span>查看更多</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4-Card Character Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {popularCharacters.length === 0 ? (
            <div className="col-span-full py-12 px-6 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Plus size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">目前尚無角色檔案</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  點擊下方按鈕立即建立你的第一位原創角色，開始整理立繪與設定！
                </p>
              </div>
              <button
                onClick={onOpenNewCharacterModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus size={14} />
                <span>建立新角色</span>
              </button>
            </div>
          ) : (
            popularCharacters.map((char) => {
              if (!char || !char.name) return null;
              const outfitCount = char.outfits ? char.outfits.length : 0;
              const tagsList = char.tags || [];

              return (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={char.avatar || fallbackHero.avatar}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => onToggleFavorite(char.id, e)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all ${
                        char.isFavorite
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-white/70 text-slate-600 hover:bg-white hover:text-rose-500'
                      }`}
                      title={char.isFavorite ? '已收藏' : '加入收藏'}
                    >
                      <Heart size={14} fill={char.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Character Info */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {char.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {outfitCount} 造型
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 font-medium">
                      {char.romanizedName}
                    </p>

                    {/* Tags */}
                    <div className="pt-1.5 flex flex-wrap gap-1 text-[10px] text-slate-500">
                      {tagsList.slice(0, 3).map((tag, i) => (
                        <span key={i} className="inline-block bg-slate-100/90 px-1.5 py-0.5 rounded text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Footer Subtle Indicator */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>查看完整設定</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Four Core Pillars / Features from the Project Proposal */}
      <section className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/70">
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <span>Core Modules</span>
            <span>✦</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">四大角色創作管理模組</h2>
          <p className="text-sm text-slate-500 mt-1">
            集中保存零散設定，將個人角色設計轉化為具有專屬風格的創作品牌。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Module 1: 角色資料建立 */}
          <div
            onClick={onExploreClick}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-indigo-600 transition-colors">
              1. 角色檔案管理
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              記錄姓名、年齡、性別、性格與背景故事，收錄高解析度立繪與視覺標籤分類。
            </p>
          </div>

          {/* Module 2: 角色服裝管理 */}
          <div
            onClick={onViewCostumes}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shirt size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-purple-600 transition-colors">
              2. 服裝造型設計
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              分類整理日常服、戰鬥服與特殊造型，標註色彩計畫、設計細節重點與靈感草圖。
            </p>
          </div>

          {/* Module 3: 角色關係與世界觀 */}
          <div
            onClick={onViewWorld}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Network size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-sky-600 transition-colors">
              3. 關係與世界觀
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              視覺化互動角色關係圖，串聯陣營組織、重大歷史事件與魔法科技世界架構。
            </p>
          </div>

          {/* Module 4: 個人作品展示 */}
          <div
            onClick={onViewArtworks}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-amber-600 transition-colors">
              4. 創作者作品集
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              展示插畫、概念草稿與作品集紀錄，具備收藏統計與創作者專屬風格主頁。
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
