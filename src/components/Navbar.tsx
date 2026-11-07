import React, { useState } from 'react';
import { ActiveTab, Character, CreatorProfile } from '../types/character';
import { StarSparkle } from './StarSparkle';
import { Search, Plus, Sparkles, BookOpen, User, Palette, Globe, Layers, X } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  characters: Character[];
  creatorProfile?: CreatorProfile;
  onSelectCharacter: (char: Character) => void;
  onOpenNewCharacterModal: () => void;
  onOpenReferenceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  characters,
  creatorProfile,
  onSelectCharacter,
  onOpenNewCharacterModal,
  onOpenReferenceModal,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter characters for quick search dropdown
  const filteredPreview = searchQuery.trim()
    ? (characters || []).filter(
        c =>
          Boolean(c) && (
            (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.romanizedName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          )
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Character Archive 首頁"
          >
            <StarSparkle size={32} className="text-slate-800 group-hover:text-indigo-600 transition-colors" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                Character Archive
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase -mt-1 font-medium">
                Collect · Organize · Create
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onTabChange('home')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'home'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            首頁
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('characters')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'characters'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            角色庫
            {activeTab === 'characters' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('costumes')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'costumes'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            服裝造型
            {activeTab === 'costumes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('world')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'world'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            世界觀
            {activeTab === 'world' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('artworks')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'artworks'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            作品集
            {activeTab === 'artworks' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            創作者
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Search, Actions, Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative hidden sm:block w-44 md:w-56 lg:w-64">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="搜尋角色、標籤..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick search popup results */}
            {isSearchFocused && filteredPreview.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-1.5 divide-y divide-slate-100">
                  {filteredPreview.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        onSelectCharacter(char);
                        onTabChange('characters');
                      }}
                      className="w-full flex items-center gap-2.5 p-2 text-left hover:bg-indigo-50/60 rounded-lg transition-colors group"
                    >
                      <img
                        src={char.avatar}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                          {char.name} <span className="text-[10px] text-slate-400 font-normal">({char.romanizedName})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {char.tags.join(' · ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Original Proposal & Mockup Design */}
          <button
            onClick={onOpenReferenceModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50/80 rounded-lg transition-colors border border-slate-200"
            title="查看原企劃案與設計手稿"
          >
            <BookOpen size={14} />
            <span>企劃對照</span>
          </button>

          {/* Quick Add Character Button */}
          <button
            onClick={onOpenNewCharacterModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs hover:shadow active:scale-95"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">新增角色</span>
          </button>

          {/* Creator Profile Avatar */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="relative flex items-center justify-center p-0.5 rounded-full ring-2 ring-indigo-500/20 hover:ring-indigo-500 transition-all"
            title="創作者個人主頁"
          >
            <img
              src={creatorProfile?.avatar || '/src/assets/images/charlotte_avatar_1793426975684.jpg'}
              alt={creatorProfile?.name || 'Creator Avatar'}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 bg-white/95 px-2 text-xs">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            activeTab === 'home' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Sparkles size={16} />
          <span>首頁</span>
        </button>
        <button
          onClick={() => onTabChange('characters')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            activeTab === 'characters' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Layers size={16} />
          <span>角色庫</span>
        </button>
        <button
          onClick={() => onTabChange('costumes')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            activeTab === 'costumes' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Palette size={16} />
          <span>服裝</span>
        </button>
        <button
          onClick={() => onTabChange('world')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            activeTab === 'world' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Globe size={16} />
          <span>世界觀</span>
        </button>
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            activeTab === 'dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <User size={16} />
          <span>創作者</span>
        </button>
      </div>
    </header>
  );
};
