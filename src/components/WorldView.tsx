import React, { useState, useRef, useEffect } from 'react';
import { Character, Relationship, WorldSetting, Faction, TimelineEvent } from '../types/character';
import { Network, Globe, BookOpen, Shield, Users, Sparkles, ChevronRight, Info, Plus, Edit3, Trash2, Move, RotateCcw, Link2, ExternalLink } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface WorldViewProps {
  worldSetting: WorldSetting;
  characters: Character[];
  relationships: Relationship[];
  onSelectCharacter: (char: Character) => void;
  onOpenNewCharacter: () => void;
  onEditCharacter: (char: Character) => void;
  onDeleteCharacter: (charId: string) => void;
  onOpenAddRelationship: (sourceChar?: Character) => void;
  onOpenEditRelationship: (rel: Relationship) => void;
  onDeleteRelationship: (relId: string) => void;
  onOpenEditWorld: () => void;
  onOpenAddFaction: () => void;
  onOpenEditFaction: (faction: Faction) => void;
  onDeleteFaction: (factionId: string) => void;
  onOpenAddEvent: () => void;
  onOpenEditEvent: (event: TimelineEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

type WorldSubTab = 'relationships' | 'overview' | 'events' | 'factions';

interface NodePosition {
  x: number;
  y: number;
}

const STORAGE_KEY_POSITIONS = 'character_node_positions_v3';

export const WorldView: React.FC<WorldViewProps> = ({
  worldSetting,
  characters,
  relationships,
  onSelectCharacter,
  onOpenNewCharacter,
  onEditCharacter,
  onDeleteCharacter,
  onOpenAddRelationship,
  onOpenEditRelationship,
  onDeleteRelationship,
  onOpenEditWorld,
  onOpenAddFaction,
  onOpenEditFaction,
  onDeleteFaction,
  onOpenAddEvent,
  onOpenEditEvent,
  onDeleteEvent,
}) => {
  const [activeTab, setActiveTab] = useState<WorldSubTab>('relationships');
  const [hoveredRelId, setHoveredRelId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // In-app Confirm Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDanger: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDanger: true,
    onConfirm: () => {},
  });

  // Canvas ref for bounds
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const [draggingCharId, setDraggingCharId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom Node Positions on Canvas (width: 720, height: 460)
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSITIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Calculate default layout positions if not present
  const getNodePosition = (charId: string, index: number, total: number): NodePosition => {
    if (nodePositions[charId]) return nodePositions[charId];

    // Default: Charlotte or index 0 in center
    if (index === 0) {
      return { x: 360, y: 230 };
    }

    // Radial layout for surrounding characters
    const surroundingTotal = Math.max(1, total - 1);
    const angle = ((index - 1) * (2 * Math.PI)) / surroundingTotal - Math.PI / 2;
    const radiusX = 180;
    const radiusY = 140;

    return {
      x: Math.round(360 + radiusX * Math.cos(angle)),
      y: Math.round(230 + radiusY * Math.sin(angle)),
    };
  };

  // Save positions when updated
  const updateNodePosition = (charId: string, pos: NodePosition) => {
    setNodePositions((prev) => {
      const next = { ...prev, [charId]: pos };
      try {
        localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Reset all node positions to tidy circle
  const handleResetLayout = () => {
    const fresh: Record<string, NodePosition> = {};
    characters.forEach((char, idx) => {
      fresh[char.id] = getNodePosition(char.id, idx, characters.length);
    });
    setNodePositions(fresh);
    try {
      localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(fresh));
    } catch (e) {}
  };

  // Drag Handlers
  const handlePointerDownNode = (charId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedNodeId(charId);
    setDraggingCharId(charId);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentPos = nodePositions[charId] || getNodePosition(charId, characters.findIndex(c => c.id === charId), characters.length);

    setDragOffset({
      x: e.clientX - rect.left - currentPos.x,
      y: e.clientY - rect.top - currentPos.y,
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveCanvas = (e: React.PointerEvent) => {
    if (!draggingCharId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left - dragOffset.x;
    const rawY = e.clientY - rect.top - dragOffset.y;

    // Clamp within canvas boundaries (padding 40px)
    const clampedX = Math.max(40, Math.min(rect.width - 40, rawX));
    const clampedY = Math.max(40, Math.min(rect.height - 40, rawY));

    updateNodePosition(draggingCharId, { x: clampedX, y: clampedY });
  };

  const handlePointerUpCanvas = (e: React.PointerEvent) => {
    if (draggingCharId) {
      setDraggingCharId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">世界觀設定</h1>
            <span className="text-indigo-500 font-bold">✦</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            自由拖曳排列角色頭像，構建專屬的關係網絡、世界觀大綱、組織與歷史編年史。
          </p>
        </div>

        {/* Dynamic Action Button depending on activeTab */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'relationships' && (
            <>
              <button
                onClick={() => onOpenAddRelationship()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs"
              >
                <Plus size={14} />
                <span>新增角色關係</span>
              </button>
              <button
                onClick={onOpenNewCharacter}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-all shadow-2xs"
              >
                <Plus size={14} className="text-indigo-600" />
                <span>新增角色到畫布</span>
              </button>
            </>
          )}

          {activeTab === 'overview' && (
            <button
              onClick={onOpenEditWorld}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs"
            >
              <Edit3 size={14} />
              <span>編輯世界觀大綱</span>
            </button>
          )}

          {activeTab === 'events' && (
            <button
              onClick={onOpenAddEvent}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>新增重大事件</span>
            </button>
          )}

          {activeTab === 'factions' && (
            <button
              onClick={onOpenAddFaction}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>新增陣營組織</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8">
        
        {/* Subnav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('relationships')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'relationships'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Network size={13} />
            <span>自訂關係圖譜 ({relationships.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Globe size={13} />
            <span>世界觀總覽</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'events'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <BookOpen size={13} />
            <span>重要事件 ({worldSetting.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('factions')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'factions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Shield size={13} />
            <span>陣營組織 ({worldSetting.factions.length})</span>
          </button>
        </div>

        {/* TAB 1: 自由拖曳排列角色關係圖譜 */}
        {activeTab === 'relationships' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Graph Draggable Canvas (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-3">
              
              {/* Canvas Toolbar & Guide */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">自由拖曳畫布</span>
                  <span className="text-slate-400">· 點按角色頭像即可隨意拖移自訂版面</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetLayout}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 text-[11px] font-medium shadow-2xs transition-colors"
                    title="自動重整角色排列"
                  >
                    <RotateCcw size={12} />
                    <span>自動重整排列</span>
                  </button>
                </div>
              </div>

              {/* The Interactive Draggable Board */}
              <div
                ref={canvasRef}
                onPointerMove={handlePointerMoveCanvas}
                onPointerUp={handlePointerUpCanvas}
                className="relative w-full h-[480px] bg-linear-to-b from-slate-50/90 to-[#f1f3f9] rounded-3xl border border-slate-200 overflow-hidden shadow-inner select-none cursor-default"
              >
                {/* Subtle Grid dots */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#6366F1 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* SVG Relationship Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {relationships.map((rel) => {
                    const sourceIdx = characters.findIndex(c => c.id === rel.sourceId);
                    const targetIdx = characters.findIndex(c => c.id === rel.targetId);
                    if (sourceIdx === -1 || targetIdx === -1) return null;

                    const p1 = getNodePosition(rel.sourceId, sourceIdx, characters.length);
                    const p2 = getNodePosition(rel.targetId, targetIdx, characters.length);

                    const isHovered = hoveredRelId === rel.id;
                    const isSelected = selectedNodeId === rel.sourceId || selectedNodeId === rel.targetId;

                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;

                    return (
                      <g key={rel.id} className="transition-all duration-75">
                        {/* Connecting Line */}
                        <line
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke={isHovered ? '#4F46E5' : isSelected ? '#6366F1' : '#CBD5E1'}
                          strokeWidth={isHovered ? 3.5 : isSelected ? 2.5 : 1.8}
                          strokeDasharray={rel.type === 'neutral' ? '5 5' : 'none'}
                        />

                        {/* Midpoint Label badge */}
                        <g
                          transform={`translate(${midX}, ${midY})`}
                          className="pointer-events-auto cursor-pointer"
                          onClick={() => onOpenEditRelationship(rel)}
                          onMouseEnter={() => setHoveredRelId(rel.id)}
                          onMouseLeave={() => setHoveredRelId(null)}
                        >
                          <rect
                            x="-38"
                            y="-12"
                            width="76"
                            height="24"
                            rx="8"
                            fill="#FFFFFF"
                            stroke={isHovered ? '#4F46E5' : '#E2E8F0'}
                            strokeWidth="1.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="10"
                            fontWeight="600"
                            fill={isHovered ? '#4338CA' : '#334155'}
                          >
                            {rel.label.length > 6 ? rel.label.slice(0, 6) : rel.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Draggable Character Nodes */}
                {characters.map((char, idx) => {
                  const pos = getNodePosition(char.id, idx, characters.length);
                  const isSelected = selectedNodeId === char.id;
                  const isDragging = draggingCharId === char.id;

                  return (
                    <div
                      key={char.id}
                      style={{
                        transform: `translate(${pos.x - 36}px, ${pos.y - 36}px)`,
                      }}
                      onPointerDown={(e) => handlePointerDownNode(char.id, e)}
                      onClick={() => setSelectedNodeId(char.id)}
                      className={`absolute top-0 left-0 z-20 flex flex-col items-center cursor-grab active:cursor-grabbing group transition-shadow ${
                        isDragging ? 'z-30 scale-105' : ''
                      }`}
                    >
                      {/* Node Avatar Frame */}
                      <div
                        className={`relative w-18 h-18 rounded-full p-1 bg-white shadow-md transition-all ${
                          isSelected
                            ? 'ring-4 ring-indigo-500 shadow-xl'
                            : 'ring-2 ring-slate-200 group-hover:ring-indigo-300'
                        }`}
                      >
                        <img
                          src={char.avatar}
                          alt={char.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full pointer-events-none"
                        />

                        {/* Move Icon indicator */}
                        <div className="absolute top-0 right-0 w-5 h-5 bg-slate-900/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Move size={10} />
                        </div>
                      </div>

                      {/* Character Name badge */}
                      <div className="mt-1.5 px-2.5 py-0.5 bg-white/95 text-slate-800 border border-slate-200 rounded-full text-xs font-bold shadow-2xs group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                        {char.name}
                      </div>

                      {/* Quick Node Actions on hover / click */}
                      {isSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -top-9 flex items-center gap-1 bg-slate-900 text-white p-1 rounded-xl shadow-xl z-40 text-[10px] animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => onSelectCharacter(char)}
                            className="px-2 py-0.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white"
                            title="開啟詳細檔案"
                          >
                            詳情
                          </button>
                          <button
                            onClick={() => onEditCharacter(char)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-200 hover:text-indigo-300"
                            title="編輯角色"
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            onClick={() => onOpenAddRelationship(char)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-200 hover:text-indigo-300"
                            title="以此角色新增關係"
                          >
                            <Link2 size={11} />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmState({
                                isOpen: true,
                                title: `刪除角色「${char.name}」`,
                                message: `確定要刪除「${char.name}」嗎？此操作將同時移除其關係連線與服裝設定。`,
                                isDanger: true,
                                onConfirm: () => onDeleteCharacter(char.id),
                              });
                            }}
                            className="p-1 hover:bg-rose-900/60 rounded text-rose-300 hover:text-rose-200"
                            title="刪除角色"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Information Panel with Relationship Management (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Selected Character Card or World Info */}
              {selectedNodeId ? (
                (() => {
                  const selChar = characters.find(c => c.id === selectedNodeId);
                  if (!selChar) return null;
                  const charRels = relationships.filter(
                    r => r.sourceId === selChar.id || r.targetId === selChar.id
                  );

                  return (
                    <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selChar.avatar}
                            alt={selChar.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{selChar.name}</h4>
                            <p className="text-xs text-indigo-600">{selChar.title}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditCharacter(selChar)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 shadow-2xs"
                            title="編輯角色"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmState({
                                isOpen: true,
                                title: `刪除角色「${selChar.name}」`,
                                message: `確定要刪除「${selChar.name}」嗎？這項動作無法復原。`,
                                isDanger: true,
                                onConfirm: () => onDeleteCharacter(selChar.id),
                              });
                            }}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-rose-600 shadow-2xs"
                            title="刪除角色"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-indigo-100/80">
                        <span className="text-xs font-semibold text-slate-700">該角色的關係網絡 ({charRels.length})</span>
                        <button
                          onClick={() => onOpenAddRelationship(selChar)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>建立新連線</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {charRels.length === 0 ? (
                          <div className="text-xs text-slate-400 py-2 text-center">
                            尚無關係連線，點擊建立新連線。
                          </div>
                        ) : (
                          charRels.map(rel => {
                            const otherId = rel.sourceId === selChar.id ? rel.targetId : rel.sourceId;
                            const other = characters.find(c => c.id === otherId);
                            if (!other) return null;

                            return (
                              <div
                                key={rel.id}
                                className="p-2 bg-white rounded-xl border border-indigo-100 text-xs flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <img src={other.avatar} alt={other.name} className="w-5 h-5 rounded-full object-cover" />
                                  <span className="font-semibold text-slate-800">{other.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium">
                                    {rel.label}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => onOpenEditRelationship(rel)}
                                    className="p-1 rounded text-slate-400 hover:text-indigo-600"
                                    title="編輯關係"
                                  >
                                    <Edit3 size={11} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setConfirmState({
                                        isOpen: true,
                                        title: '解除關係連結',
                                        message: `確定要刪除「${selChar.name}」與「${other.name}」的關係嗎？`,
                                        isDanger: true,
                                        onConfirm: () => onDeleteRelationship(rel.id),
                                      });
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                                    title="刪除關係"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <button
                        onClick={() => onSelectCharacter(selChar)}
                        className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>進入「{selChar.name}」完整角色頁</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  );
                })()
              ) : null}

              {/* All Relationships List */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>所有角色關係清單 ({relationships.length})</span>
                  <button
                    onClick={() => onOpenAddRelationship()}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>新增關係</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {relationships.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      目前尚無任何關係連結，點擊上方按鈕建立第一組羈絆！
                    </div>
                  ) : (
                    relationships.map((rel) => {
                      const c1 = characters.find(c => c.id === rel.sourceId);
                      const c2 = characters.find(c => c.id === rel.targetId);
                      if (!c1 || !c2) return null;

                      return (
                        <div
                          key={rel.id}
                          className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between group hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="font-semibold text-slate-800">{c1.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium shrink-0">
                              {rel.label}
                            </span>
                            <span className="font-semibold text-slate-800">{c2.name}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onOpenEditRelationship(rel)}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                              title="編輯關係"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmState({
                                  isOpen: true,
                                  title: '刪除關係連結',
                                  message: `確定要刪除「${c1.name}」與「${c2.name}」的關係嗎？`,
                                  isDanger: true,
                                  onConfirm: () => onDeleteRelationship(rel.id),
                                });
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="刪除關係"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 世界介紹 */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-slate-900 font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600">✦</span>
                    <span>世界介紹</span>
                  </div>
                  <button
                    onClick={onOpenEditWorld}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-normal flex items-center gap-1"
                  >
                    <Edit3 size={12} />
                    <span>編輯大綱</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {worldSetting.overview}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: 世界觀總覽 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="max-w-3xl space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  {worldSetting.title}
                </h2>
                <p className="text-sm text-indigo-600 font-medium">
                  {worldSetting.subtitle}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  {worldSetting.overview}
                </p>
              </div>

              <button
                onClick={onOpenEditWorld}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <Edit3 size={13} />
                <span>編輯世界觀</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-indigo-500">✦</span>
                  <span>魔導與能量體系</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {worldSetting.magicSystem}
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-indigo-500">✦</span>
                  <span>地理與王國架構</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {worldSetting.geography}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 重要事件 (Timeline Events) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">歷史重大事件年表</h2>
                <p className="text-xs text-slate-500">記錄貫穿主要角色命運的世界歷史事件與轉折點</p>
              </div>
              <button
                onClick={onOpenAddEvent}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 shadow-xs"
              >
                <Plus size={14} />
                <span>新增事件</span>
              </button>
            </div>

            <div className="relative pl-6 border-l-2 border-indigo-200 space-y-8 ml-3">
              {worldSetting.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-xs" />
                  
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-indigo-600">
                        <span>{event.year}</span>
                        <span>·</span>
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.2 rounded-full text-[10px]">
                          {event.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenEditEvent(event)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white"
                          title="編輯此事件"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmState({
                              isOpen: true,
                              title: `刪除事件「${event.title}」`,
                              message: '確定要刪除該歷史事件嗎？',
                              isDanger: true,
                              onConfirm: () => onDeleteEvent(event.id),
                            });
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white"
                          title="刪除此事件"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.description}
                    </p>

                    {event.involvedCharacterIds && event.involvedCharacterIds.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">關聯人物:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {event.involvedCharacterIds.map(charId => {
                            const c = characters.find(char => char.id === charId);
                            if (!c) return null;
                            return (
                              <button
                                key={c.id}
                                onClick={() => onSelectCharacter(c)}
                                className="inline-flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 hover:border-indigo-400"
                              >
                                <img
                                  src={c.avatar}
                                  alt={c.name}
                                  referrerPolicy="no-referrer"
                                  className="w-3.5 h-3.5 rounded-full object-cover"
                                />
                                <span>{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 陣營與組織 (Factions) */}
        {activeTab === 'factions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">核心陣營與所屬勢力</h2>
                <p className="text-xs text-slate-500">角色所歸屬的組織機構與陣營理念</p>
              </div>
              <button
                onClick={onOpenAddFaction}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 shadow-xs"
              >
                <Plus size={14} />
                <span>新增陣營</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {worldSetting.factions.map((faction) => {
                const members = characters.filter(c => c.factionId === faction.id);

                return (
                  <div
                    key={faction.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-xs"
                          style={{ backgroundColor: `${faction.color}15`, color: faction.color }}
                        >
                          {faction.emblem}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenEditFaction(faction)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            title="編輯此陣營"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmState({
                                isOpen: true,
                                title: `刪除陣營「${faction.name}」`,
                                message: `確定要刪除「${faction.name}」陣營組織嗎？`,
                                isDanger: true,
                                onConfirm: () => onDeleteFaction(faction.id),
                              });
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="刪除陣營"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {faction.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 mb-2">
                        {faction.englishName} · {faction.baseLocation}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {faction.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block mb-1.5">組織成員 ({members.length})</span>
                      <div className="flex items-center gap-2">
                        {members.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">尚無角色加入</span>
                        ) : (
                          members.map(m => (
                            <button
                              key={m.id}
                              onClick={() => onSelectCharacter(m)}
                              className="relative group/m"
                              title={m.name}
                            >
                              <img
                                src={m.avatar}
                                alt={m.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs group-hover/m:scale-110 transition-transform"
                              />
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        isDanger={confirmState.isDanger}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};
