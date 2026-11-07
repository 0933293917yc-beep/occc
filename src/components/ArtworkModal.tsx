import React, { useState, useEffect } from 'react';
import { Character, Artwork } from '../types/character';
import { X, Save, Image as ImageIcon, Crop } from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (characterId: string, artwork: Artwork) => void;
  characters: Character[];
  initialCharacterId?: string;
  editingArtwork?: (Artwork & { characterId: string }) | null;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  characters,
  initialCharacterId,
  editingArtwork,
}) => {
  const [characterId, setCharacterId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'illustration' | 'concept' | 'sketch' | 'chibi'>('illustration');
  const [date, setDate] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [isCropping, setIsCropping] = useState(false);
  const [cropSrc, setCropSrc] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingArtwork) {
        setCharacterId(editingArtwork.characterId);
        setTitle(editingArtwork.title);
        setCategory(editingArtwork.category);
        setDate(editingArtwork.date);
        setCaption(editingArtwork.caption || '');
        setImage(editingArtwork.image);
      } else {
        const char = characters.find(c => c.id === initialCharacterId) || characters[0];
        setCharacterId(char ? char.id : '');
        setTitle('');
        setCategory('illustration');
        setDate(new Date().toISOString().slice(0, 10));
        setCaption('');
        setImage(char?.avatar || '/src/assets/images/charlotte_avatar_1793426975684.jpg');
      }
    }
  }, [isOpen, initialCharacterId, editingArtwork, characters]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterId || !title.trim() || !image.trim()) return;

    const art: Artwork = {
      id: editingArtwork ? editingArtwork.id : `art-${Date.now()}`,
      title: title.trim(),
      image: image.trim(),
      category,
      date: date.trim() || new Date().toISOString().slice(0, 10),
      caption: caption.trim() || undefined,
    };

    onSave(characterId, art);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <ImageIcon size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              {editingArtwork ? '編輯作品資訊' : '新增角色作品與插畫'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">所屬角色</label>
              <select
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                {characters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.romanizedName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">作品分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="illustration">完整插畫</option>
                <option value="concept">立繪概念</option>
                <option value="sketch">草稿速寫</option>
                <option value="chibi">Q版插畫</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-medium text-slate-700 mb-1">作品標題</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：星空下的低語"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">創作日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Image with upload and free crop */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-700">
                作品圖片 (上傳本機圖檔或輸入圖片網址)
              </label>
              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setCropSrc(image);
                    setIsCropping(true);
                  }}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                >
                  <Crop size={11} />
                  <span>自由裁切此圖</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={image || '/src/assets/images/charlotte_avatar_1793426975684.jpg'}
                  alt="預覽"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="圖片網址"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <label className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-medium cursor-pointer transition-colors shrink-0">
                <span>上傳並裁切</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setCropSrc(ev.target.result as string);
                          setIsCropping(true);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">作品描述與創作手記</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="記錄創作這張作品時的想法、用色靈感或場景設定……"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Save size={14} />
              <span>儲存作品</span>
            </button>
          </div>

        </form>
      </div>

      <ImageCropModal
        isOpen={isCropping}
        imageSrc={cropSrc}
        defaultAspect={1.33}
        onClose={() => setIsCropping(false)}
        onCropComplete={(croppedUrl) => {
          setImage(croppedUrl);
          setIsCropping(false);
        }}
      />
    </div>
  );
};
