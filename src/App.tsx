/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Character, Outfit, Relationship, WorldSetting, ActiveTab, CreatorProfile, Faction, TimelineEvent, Artwork } from './types/character';
import { INITIAL_CHARACTERS, INITIAL_RELATIONSHIPS, INITIAL_WORLD_SETTING, INITIAL_CREATOR_PROFILE } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CharacterDetailView } from './components/CharacterDetailView';
import { CharacterRosterView } from './components/CharacterRosterView';
import { CostumesView } from './components/CostumesView';
import { WorldView } from './components/WorldView';
import { ArtworksView } from './components/ArtworksView';
import { CreatorDashboardView } from './components/CreatorDashboardView';
import { CharacterEditModal } from './components/CharacterEditModal';
import { OutfitEditModal } from './components/OutfitEditModal';
import { RelationshipModal } from './components/RelationshipModal';
import { ArtworkModal } from './components/ArtworkModal';
import { FactionModal } from './components/FactionModal';
import { TimelineEventModal } from './components/TimelineEventModal';
import { WorldEditModal } from './components/WorldEditModal';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { ReferenceModal } from './components/ReferenceModal';
import { ConfirmModal } from './components/ConfirmModal';
import { StarSparkle } from './components/StarSparkle';
import { Check, Sparkles } from 'lucide-react';

const STORAGE_KEY_CHARACTERS = 'character_archive_characters_v2';
const STORAGE_KEY_RELATIONSHIPS = 'character_archive_relationships_v2';
const STORAGE_KEY_WORLD = 'character_archive_world_v2';
const STORAGE_KEY_CREATOR = 'character_archive_creator_v2';

export default function App() {
  // Persistence state
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHARACTERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((c): c is Character => Boolean(c && typeof c === 'object' && c.id && c.name));
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CHARACTERS;
  });

  const [relationships, setRelationships] = useState<Relationship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RELATIONSHIPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RELATIONSHIPS;
  });

  const [worldSetting, setWorldSetting] = useState<WorldSetting>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORLD);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WORLD_SETTING;
  });

  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CREATOR);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CREATOR_PROFILE;
  });

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [outfitTargetCharacter, setOutfitTargetCharacter] = useState<Character | null>(null);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);

  const [isRelModalOpen, setIsRelModalOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [relInitialChar, setRelInitialChar] = useState<Character | null>(null);

  const [isArtModalOpen, setIsArtModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<(Artwork & { characterId: string }) | null>(null);
  const [artInitialCharId, setArtInitialCharId] = useState<string | undefined>(undefined);

  const [isFactionModalOpen, setIsFactionModalOpen] = useState(false);
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const [isWorldModalOpen, setIsWorldModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);

  // In-app Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    icon?: 'trash' | 'warning' | 'reset';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '確定',
    cancelText: '取消',
    isDanger: false,
    icon: 'warning',
    onConfirm: () => {},
  });

  const askConfirm = ({
    title,
    message,
    confirmText = '確定',
    cancelText = '取消',
    isDanger = false,
    icon = 'warning',
    onConfirm,
  }: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    icon?: 'trash' | 'warning' | 'reset';
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      isDanger,
      icon,
      onConfirm,
    });
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(characters));
    } catch (e) {
      console.error('Failed to save characters', e);
    }
  }, [characters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RELATIONSHIPS, JSON.stringify(relationships));
    } catch (e) {
      console.error('Failed to save relationships', e);
    }
  }, [relationships]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORLD, JSON.stringify(worldSetting));
    } catch (e) {
      console.error('Failed to save worldSetting', e);
    }
  }, [worldSetting]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CREATOR, JSON.stringify(creatorProfile));
    } catch (e) {
      console.error('Failed to save creatorProfile', e);
    }
  }, [creatorProfile]);

  // Handle character selection
  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setActiveTab('characters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCharacters(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextFav = !c.isFavorite;
          showToast(nextFav ? `已將「${c.name}」加入我的收藏` : `已取消「${c.name}」的收藏`);
          return { ...c, isFavorite: nextFav };
        }
        return c;
      })
    );
    if (selectedCharacter && selectedCharacter.id === id) {
      setSelectedCharacter(prev => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Save Character (Create or Edit)
  const handleSaveCharacter = (charData: Partial<Character>) => {
    if (editingCharacter) {
      // Edit existing
      setCharacters(prev =>
        prev.map(c => {
          if (c.id === editingCharacter.id) {
            const updated = { ...c, ...charData } as Character;
            if (selectedCharacter?.id === c.id) setSelectedCharacter(updated);
            return updated;
          }
          return c;
        })
      );
      showToast(`已成功更新「${charData.name}」的角色設定`);
    } else {
      // Create new
      const newChar: Character = {
        id: `char-${Date.now()}`,
        name: charData.name || '新角色',
        romanizedName: charData.romanizedName || 'New Character',
        title: charData.title || '原創冒險者',
        avatar: charData.avatar || '/src/assets/images/charlotte_avatar_1793426975684.jpg',
        tachie: charData.tachie || charData.avatar || '/src/assets/images/charlotte_tachie_1793426976035.jpg',
        tags: charData.tags || ['原創'],
        quote: charData.quote || '「新角色語錄」',
        age: charData.age || '18歲',
        height: charData.height || '165cm',
        birthday: charData.birthday || '1月1日',
        gender: charData.gender || '女性',
        personality: charData.personality || '溫柔、活潑',
        background: charData.background || '這是一位新建立的原創角色背景故事……',
        factionId: charData.factionId || worldSetting.factions[0]?.id || '',
        isFavorite: false,
        lastEdited: new Date().toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }),
        outfits: [
          {
            id: `outfit-${Date.now()}`,
            name: '日常私服',
            type: 'casual',
            image: charData.tachie || charData.avatar || '/src/assets/images/charlotte_avatar_1793426975684.jpg',
            paletteName: '自然日常調',
            colors: ['#3B82F6', '#FFFFFF', '#64748B'],
            keyFeatures: ['基礎日常穿搭'],
            notes: '初次設定的原創常服',
            seasonOrOccasion: '日常'
          }
        ],
        artworks: []
      };

      setCharacters(prev => [newChar, ...prev]);
      setSelectedCharacter(newChar);
      setActiveTab('characters');
      showToast(`已成功建立原創角色「${newChar.name}」！`);
    }
    setEditingCharacter(null);
  };

  // Delete Character
  const handleDeleteCharacter = (charId: string) => {
    const char = characters.find(c => c.id === charId);
    setCharacters(prev => prev.filter(c => c.id !== charId));
    // Clean up relationships
    setRelationships(prev => prev.filter(r => r.sourceId !== charId && r.targetId !== charId));
    if (selectedCharacter?.id === charId) {
      setSelectedCharacter(null);
    }
    showToast(`已刪除角色「${char?.name || ''}」`);
  };

  // Duplicate Character
  const handleDuplicateCharacter = (char: Character) => {
    const clone: Character = {
      ...char,
      id: `char-${Date.now()}`,
      name: `${char.name} (分支)`,
      romanizedName: `${char.romanizedName} (Variant)`,
      lastEdited: new Date().toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }),
      isFavorite: false,
      outfits: char.outfits.map(o => ({ ...o, id: `outfit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
      artworks: char.artworks.map(a => ({ ...a, id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
    };
    setCharacters(prev => [clone, ...prev]);
    setSelectedCharacter(clone);
    showToast(`已成功複製「${char.name}」為新角色分支`);
  };

  // Save Outfit
  const handleSaveOutfit = (characterId: string, outfitData: Outfit) => {
    setCharacters(prev =>
      prev.map(c => {
        if (c.id === characterId) {
          const exists = c.outfits.some(o => o.id === outfitData.id);
          const updatedOutfits = exists
            ? c.outfits.map(o => (o.id === outfitData.id ? outfitData : o))
            : [...c.outfits, outfitData];

          const updated = {
            ...c,
            outfits: updatedOutfits,
            lastEdited: new Date().toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })
          };
          if (selectedCharacter?.id === c.id) setSelectedCharacter(updated);
          return updated;
        }
        return c;
      })
    );
    showToast(`已儲存造型「${outfitData.name}」`);
    setEditingOutfit(null);
  };

  // Delete Outfit
  const handleDeleteOutfit = (characterId: string, outfitId: string) => {
    setCharacters(prev =>
      prev.map(c => {
        if (c.id === characterId) {
          const updated = {
            ...c,
            outfits: c.outfits.filter(o => o.id !== outfitId),
          };
          if (selectedCharacter?.id === c.id) setSelectedCharacter(updated);
          return updated;
        }
        return c;
      })
    );
    showToast('已刪除該服裝造型');
  };

  // Save Relationship
  const handleSaveRelationship = (relData: Relationship) => {
    setRelationships(prev => {
      const exists = prev.some(r => r.id === relData.id);
      if (exists) {
        return prev.map(r => (r.id === relData.id ? relData : r));
      }
      return [relData, ...prev];
    });
    showToast('已儲存角色關係連結');
    setEditingRelationship(null);
  };

  // Delete Relationship
  const handleDeleteRelationship = (relId: string) => {
    setRelationships(prev => prev.filter(r => r.id !== relId));
    showToast('已解除該關係連結');
  };

  // Save Artwork
  const handleSaveArtwork = (characterId: string, artData: Artwork) => {
    setCharacters(prev =>
      prev.map(c => {
        if (c.id === characterId) {
          const exists = c.artworks.some(a => a.id === artData.id);
          const updatedArtworks = exists
            ? c.artworks.map(a => (a.id === artData.id ? artData : a))
            : [artData, ...c.artworks];
          const updated = { ...c, artworks: updatedArtworks };
          if (selectedCharacter?.id === c.id) setSelectedCharacter(updated);
          return updated;
        }
        return c;
      })
    );
    showToast(`已儲存作品「${artData.title}」`);
    setEditingArtwork(null);
  };

  // Delete Artwork
  const handleDeleteArtwork = (characterId: string, artworkId: string) => {
    setCharacters(prev =>
      prev.map(c => {
        if (c.id === characterId) {
          const updated = {
            ...c,
            artworks: c.artworks.filter(a => a.id !== artworkId),
          };
          if (selectedCharacter?.id === c.id) setSelectedCharacter(updated);
          return updated;
        }
        return c;
      })
    );
    showToast('已刪除該作品');
  };

  // Save Faction
  const handleSaveFaction = (factionData: Faction) => {
    setWorldSetting(prev => {
      const exists = prev.factions.some(f => f.id === factionData.id);
      const updatedFactions = exists
        ? prev.factions.map(f => (f.id === factionData.id ? factionData : f))
        : [...prev.factions, factionData];
      return { ...prev, factions: updatedFactions };
    });
    showToast(`已儲存陣營「${factionData.name}」`);
    setEditingFaction(null);
  };

  // Delete Faction
  const handleDeleteFaction = (factionId: string) => {
    setWorldSetting(prev => ({
      ...prev,
      factions: prev.factions.filter(f => f.id !== factionId),
    }));
    showToast('已刪除陣營組織');
  };

  // Save Timeline Event
  const handleSaveTimelineEvent = (eventData: TimelineEvent) => {
    setWorldSetting(prev => {
      const exists = prev.timeline.some(e => e.id === eventData.id);
      const updatedTimeline = exists
        ? prev.timeline.map(e => (e.id === eventData.id ? eventData : e))
        : [...prev.timeline, eventData];
      return { ...prev, timeline: updatedTimeline };
    });
    showToast(`已儲存歷史事件「${eventData.title}」`);
    setEditingEvent(null);
  };

  // Delete Timeline Event
  const handleDeleteTimelineEvent = (eventId: string) => {
    setWorldSetting(prev => ({
      ...prev,
      timeline: prev.timeline.filter(e => e.id !== eventId),
    }));
    showToast('已刪除該歷史事件');
  };

  // Save World Setting
  const handleSaveWorldSetting = (worldData: Partial<WorldSetting>) => {
    setWorldSetting(prev => ({ ...prev, ...worldData }));
    showToast('已更新世界觀設定大綱');
  };

  // Save Creator Profile
  const handleSaveCreatorProfile = (profileData: CreatorProfile) => {
    setCreatorProfile(profileData);
    showToast('已成功更新個人創作者檔案！');
  };

  // Reset to default
  const handleResetData = () => {
    askConfirm({
      title: '重設示範資料',
      message: '確定要將所有角色與世界觀重設為預設展示資料嗎？自訂的修改與排列位置將被清除。',
      confirmText: '確定還原',
      cancelText: '取消',
      isDanger: true,
      icon: 'reset',
      onConfirm: () => {
        localStorage.removeItem(STORAGE_KEY_CHARACTERS);
        localStorage.removeItem(STORAGE_KEY_RELATIONSHIPS);
        localStorage.removeItem(STORAGE_KEY_WORLD);
        localStorage.removeItem(STORAGE_KEY_CREATOR);
        localStorage.removeItem('character_node_positions_v3');
        setCharacters(INITIAL_CHARACTERS);
        setRelationships(INITIAL_RELATIONSHIPS);
        setWorldSetting(INITIAL_WORLD_SETTING);
        setCreatorProfile(INITIAL_CREATOR_PROFILE);
        setSelectedCharacter(INITIAL_CHARACTERS[0]);
        showToast('已回復為預設原創角色資料庫');
      },
    });
  };

  // Export JSON backup
  const handleExportData = () => {
    const data = {
      creatorProfile,
      characters,
      relationships,
      worldSetting,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Character_Archive_${creatorProfile.name}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已匯出角色資料庫 JSON 備份檔');
  };

  // Import JSON backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.characters && Array.isArray(parsed.characters)) {
          setCharacters(parsed.characters);
          if (parsed.relationships) setRelationships(parsed.relationships);
          if (parsed.worldSetting) setWorldSetting(parsed.worldSetting);
          if (parsed.creatorProfile) setCreatorProfile(parsed.creatorProfile);
          setSelectedCharacter(parsed.characters[0] || null);
          showToast('資料庫匯入成功！');
        } else {
          showToast('匯入失敗：JSON 格式不符');
        }
      } catch (err) {
        showToast('檔案讀取解析錯誤');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Character for costume view
  const currentCostumeChar = selectedCharacter || characters[0];

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-800 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        characters={characters}
        creatorProfile={creatorProfile}
        onSelectCharacter={handleSelectCharacter}
        onOpenNewCharacterModal={() => {
          setEditingCharacter(null);
          setIsCharModalOpen(true);
        }}
        onOpenReferenceModal={() => setIsRefModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <HomeView
            characters={characters}
            onSelectCharacter={handleSelectCharacter}
            onExploreClick={() => {
              setActiveTab('characters');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewCostumes={() => {
              setActiveTab('costumes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewWorld={() => {
              setActiveTab('world');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewArtworks={() => {
              setActiveTab('artworks');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleFavorite={handleToggleFavorite}
            onOpenNewCharacterModal={() => {
              setEditingCharacter(null);
              setIsCharModalOpen(true);
            }}
          />
        )}

        {/* VIEW 2: CHARACTERS (Roster or Single Character Detail) */}
        {activeTab === 'characters' && (
          selectedCharacter ? (
            <CharacterDetailView
              character={selectedCharacter}
              allCharacters={characters}
              relationships={relationships}
              worldSetting={worldSetting}
              onBack={() => setSelectedCharacter(null)}
              onEdit={(char) => {
                setEditingCharacter(char);
                setIsCharModalOpen(true);
              }}
              onDeleteCharacter={handleDeleteCharacter}
              onDuplicateCharacter={handleDuplicateCharacter}
              onToggleFavorite={handleToggleFavorite}
              onSelectCharacter={handleSelectCharacter}
              onSelectOutfit={(outfit, char) => {
                setSelectedCharacter(char);
                setActiveTab('costumes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToCostumes={() => {
                setActiveTab('costumes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToWorld={() => {
                setActiveTab('world');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddOutfit={(char) => {
                setOutfitTargetCharacter(char);
                setEditingOutfit(null);
                setIsOutfitModalOpen(true);
              }}
              onEditOutfit={(outfit, char) => {
                setOutfitTargetCharacter(char);
                setEditingOutfit(outfit);
                setIsOutfitModalOpen(true);
              }}
              onDeleteOutfit={handleDeleteOutfit}
              onAddRelationship={(char) => {
                setRelInitialChar(char);
                setEditingRelationship(null);
                setIsRelModalOpen(true);
              }}
              onDeleteRelationship={handleDeleteRelationship}
              onAddArtwork={(char) => {
                setArtInitialCharId(char.id);
                setEditingArtwork(null);
                setIsArtModalOpen(true);
              }}
              onDeleteArtwork={handleDeleteArtwork}
            />
          ) : (
            <CharacterRosterView
              characters={characters}
              worldSetting={worldSetting}
              searchQuery={searchQuery}
              onSelectCharacter={handleSelectCharacter}
              onToggleFavorite={handleToggleFavorite}
              onOpenNewCharacterModal={() => {
                setEditingCharacter(null);
                setIsCharModalOpen(true);
              }}
              onEditCharacter={(char) => {
                setEditingCharacter(char);
                setIsCharModalOpen(true);
              }}
              onDuplicateCharacter={handleDuplicateCharacter}
              onDeleteCharacter={handleDeleteCharacter}
            />
          )
        )}

        {/* VIEW 3: COSTUMES MANAGEMENT */}
        {activeTab === 'costumes' && (
          <CostumesView
            characters={characters}
            selectedCharacter={currentCostumeChar}
            onSelectCharacter={(char) => setSelectedCharacter(char)}
            onOpenNewOutfitModal={(char) => {
              setOutfitTargetCharacter(char);
              setEditingOutfit(null);
              setIsOutfitModalOpen(true);
            }}
            onOpenEditOutfitModal={(outfit, char) => {
              setOutfitTargetCharacter(char);
              setEditingOutfit(outfit);
              setIsOutfitModalOpen(true);
            }}
            onDeleteOutfit={handleDeleteOutfit}
          />
        )}

        {/* VIEW 4: WORLD LORE & RELATIONSHIP GRAPH */}
        {activeTab === 'world' && (
          <WorldView
            worldSetting={worldSetting}
            characters={characters}
            relationships={relationships}
            onSelectCharacter={handleSelectCharacter}
            onOpenNewCharacter={() => {
              setEditingCharacter(null);
              setIsCharModalOpen(true);
            }}
            onEditCharacter={(char) => {
              setEditingCharacter(char);
              setIsCharModalOpen(true);
            }}
            onDeleteCharacter={handleDeleteCharacter}
            onOpenAddRelationship={() => {
              setRelInitialChar(selectedCharacter || characters[0]);
              setEditingRelationship(null);
              setIsRelModalOpen(true);
            }}
            onOpenEditRelationship={(rel) => {
              setEditingRelationship(rel);
              setIsRelModalOpen(true);
            }}
            onDeleteRelationship={handleDeleteRelationship}
            onOpenEditWorld={() => setIsWorldModalOpen(true)}
            onOpenAddFaction={() => {
              setEditingFaction(null);
              setIsFactionModalOpen(true);
            }}
            onOpenEditFaction={(faction) => {
              setEditingFaction(faction);
              setIsFactionModalOpen(true);
            }}
            onDeleteFaction={handleDeleteFaction}
            onOpenAddEvent={() => {
              setEditingEvent(null);
              setIsEventModalOpen(true);
            }}
            onOpenEditEvent={(event) => {
              setEditingEvent(event);
              setIsEventModalOpen(true);
            }}
            onDeleteEvent={handleDeleteTimelineEvent}
          />
        )}

        {/* VIEW 5: ARTWORKS & SHOWCASE */}
        {activeTab === 'artworks' && (
          <ArtworksView
            characters={characters}
            onSelectCharacter={handleSelectCharacter}
            onOpenAddArtwork={() => {
              setArtInitialCharId(selectedCharacter?.id || characters[0]?.id);
              setEditingArtwork(null);
              setIsArtModalOpen(true);
            }}
            onOpenEditArtwork={(art) => {
              setEditingArtwork(art);
              setIsArtModalOpen(true);
            }}
            onDeleteArtwork={handleDeleteArtwork}
          />
        )}

        {/* VIEW 6: CREATOR DASHBOARD */}
        {activeTab === 'dashboard' && (
          <CreatorDashboardView
            characters={characters}
            creatorProfile={creatorProfile}
            onOpenEditProfile={() => setIsCreatorModalOpen(true)}
            onSelectCharacter={handleSelectCharacter}
            onEditCharacter={(char) => {
              setEditingCharacter(char);
              setIsCharModalOpen(true);
            }}
            onDeleteCharacter={handleDeleteCharacter}
            onOpenNewCharacter={() => {
              setEditingCharacter(null);
              setIsCharModalOpen(true);
            }}
            onNavigateHome={() => setActiveTab('home')}
            onNavigateCharacters={() => {
              setSelectedCharacter(null);
              setActiveTab('characters');
            }}
            onNavigateArtworks={() => setActiveTab('artworks')}
            onResetData={handleResetData}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}

      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <StarSparkle size={18} className="text-slate-700" />
            <span className="font-semibold text-slate-700">Character Archive</span>
            <span>·</span>
            <span>{creatorProfile.name} 的原創創作世界</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRefModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              企劃原稿對照
            </button>
            <span>·</span>
            <span>「讓每個角色，都有屬於自己的空間。」</span>
          </div>
        </div>
      </footer>

      {/* Character Edit & Create Modal */}
      <CharacterEditModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
        onSave={handleSaveCharacter}
        initialCharacter={editingCharacter}
        worldSetting={worldSetting}
      />

      {/* Outfit Edit & Add Modal */}
      {outfitTargetCharacter && (
        <OutfitEditModal
          isOpen={isOutfitModalOpen}
          onClose={() => {
            setIsOutfitModalOpen(false);
            setEditingOutfit(null);
          }}
          onSave={handleSaveOutfit}
          character={outfitTargetCharacter}
          editingOutfit={editingOutfit}
        />
      )}

      {/* Relationship Add & Edit Modal */}
      <RelationshipModal
        isOpen={isRelModalOpen}
        onClose={() => {
          setIsRelModalOpen(false);
          setEditingRelationship(null);
        }}
        onSave={handleSaveRelationship}
        characters={characters}
        initialSourceChar={relInitialChar}
        editingRelationship={editingRelationship}
      />

      {/* Artwork Add & Edit Modal */}
      <ArtworkModal
        isOpen={isArtModalOpen}
        onClose={() => {
          setIsArtModalOpen(false);
          setEditingArtwork(null);
        }}
        onSave={handleSaveArtwork}
        characters={characters}
        initialCharacterId={artInitialCharId}
        editingArtwork={editingArtwork}
      />

      {/* Faction Add & Edit Modal */}
      <FactionModal
        isOpen={isFactionModalOpen}
        onClose={() => {
          setIsFactionModalOpen(false);
          setEditingFaction(null);
        }}
        onSave={handleSaveFaction}
        editingFaction={editingFaction}
      />

      {/* Timeline Event Add & Edit Modal */}
      <TimelineEventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveTimelineEvent}
        characters={characters}
        editingEvent={editingEvent}
      />

      {/* World Setting Edit Modal */}
      <WorldEditModal
        isOpen={isWorldModalOpen}
        onClose={() => setIsWorldModalOpen(false)}
        onSave={handleSaveWorldSetting}
        worldSetting={worldSetting}
      />

      {/* Creator Profile Edit Modal */}
      <CreatorProfileModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
        onSave={handleSaveCreatorProfile}
        profile={creatorProfile}
      />

      {/* Original Design & Proposal Comparison Modal */}
      <ReferenceModal
        isOpen={isRefModalOpen}
        onClose={() => setIsRefModalOpen(false)}
      />

      {/* Global In-app Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        isDanger={confirmModal.isDanger}
        icon={confirmModal.icon}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
