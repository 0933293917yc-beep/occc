export type OutfitType = 'casual' | 'combat' | 'special' | 'ceremonial';

export interface Outfit {
  id: string;
  name: string;
  type: OutfitType;
  image: string;
  paletteName: string;
  colors: string[];
  keyFeatures: string[];
  notes: string;
  seasonOrOccasion?: string;
}

export interface Artwork {
  id: string;
  title: string;
  image: string;
  category: 'illustration' | 'sketch' | 'chibi' | 'concept';
  date: string;
  caption?: string;
}

export interface Character {
  id: string;
  name: string;
  romanizedName: string;
  title: string;
  avatar: string;
  tachie: string;
  tags: string[];
  quote: string;
  age: string;
  height: string;
  birthday: string;
  gender: string;
  personality: string;
  background: string;
  factionId: string;
  isFavorite: boolean;
  lastEdited: string;
  outfits: Outfit[];
  artworks: Artwork[];
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  description: string;
  type?: 'positive' | 'neutral' | 'rivalry';
}

export interface Faction {
  id: string;
  name: string;
  englishName: string;
  emblem: string;
  color: string;
  description: string;
  baseLocation: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: string;
  involvedCharacterIds: string[];
}

export interface WorldSetting {
  title: string;
  subtitle: string;
  overview: string;
  magicSystem: string;
  geography: string;
  factions: Faction[];
  timeline: TimelineEvent[];
}

export interface CreatorProfile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  bannerQuote: string;
}

export type ActiveTab = 'home' | 'characters' | 'costumes' | 'world' | 'artworks' | 'dashboard';

