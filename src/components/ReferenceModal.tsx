import React from 'react';
import { X, BookOpen, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 font-display">
              網站企劃書與 UI 設計原稿對照
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          
          {/* Reference Image Attachment */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon size={14} className="text-indigo-600" />
              <span>UI / UX 設計參考稿 (/public/assets/aistudio/______UI______0b2ec3ac.png)</span>
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950/5 p-2">
              <img
                src="/assets/aistudio/______UI______0b2ec3ac.png"
                alt="UI / UX 設計參考稿"
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-xl shadow-xs"
              />
            </div>
          </div>

          {/* Proposal Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">專案理念</h4>
              <p>
                建立個人化的原創角色資料庫，讓創作者能夠更有系統地整理角色設定，並將角色設計轉化為具有個人風格的創作品牌。
              </p>
              <div className="text-indigo-600 font-medium">
                「讓每個角色，都有屬於自己的空間。」
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">四大功能模組完整實現</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>1. 角色資料建立：</strong> 基本資訊、個性、背景、立繪、標籤。</li>
                <li><strong>2. 角色服裝管理：</strong> 日常/戰鬥/特殊服裝、草圖、配色重點。</li>
                <li><strong>3. 角色關係與世界觀：</strong> 互動式關係圖譜、世界背景、陣營。</li>
                <li><strong>4. 個人作品展示：</strong> 創作者頁面、畫廊、收藏統計與備份。</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
