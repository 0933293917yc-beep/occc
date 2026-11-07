import React, { useState, useEffect } from 'react';
import { Character, Outfit, OutfitType } from '../types/character';
import { X, Save, Shirt, Palette, Crop } from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';

interface OutfitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (characterId: string, outfitData: Outfit) => void;
  character: Character;
  editingOutfit?: Outfit | null;
}

export const OutfitEditModal: React.FC<OutfitEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  character,
  editingOutfit,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<OutfitType>('casual');
  const [paletteName, setPaletteName] = useState('靛白');
  const [colorsText, setColorsText] = useState('#283556, #FFFFFF, #6C7EA3');
  const [keyFeaturesText, setKeyFeaturesText] = useState('蝴蝶結, 層次短裙');
  const [notes, setNotes] = useState('');
  const [seasonOrOccasion, setSeasonOrOccasion] = useState('常規授課 / 魔法實習');
  const [imageUrl, setImageUrl] = useState('');
  const [isCropping, setIsCropping] = useState(false);
  const [cropSrc, setCropSrc] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingOutfit) {
        setName(editingOutfit.name);
        setType(editingOutfit.type);
        setPaletteName(editingOutfit.paletteName);
        setColorsText(editingOutfit.colors.join(', '));
        setKeyFeaturesText(editingOutfit.keyFeatures.join(', '));
        setNotes(editingOutfit.notes);
        setSeasonOrOccasion(editingOutfit.seasonOrOccasion || '日常穿著');
        setImageUrl(editingOutfit.image);
      } else {
        setName('');
        setType('casual');
        setPaletteName('靛白');
        setColorsText('#283556, #FFFFFF, #6C7EA3');
        setKeyFeaturesText('蝴蝶結, 層次短裙');
        setNotes('學院風格設計');
        setSeasonOrOccasion('日常穿著');
        setImageUrl(character.tachie || character.avatar);
      }
    }
  }, [isOpen, character, editingOutfit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = colorsText.split(/[,，]/).map(c => c.trim()).filter(Boolean);
    const keyFeatures = keyFeaturesText.split(/[,，、]/).map(f => f.trim()).filter(Boolean);

    const savedOutfit: Outfit = {
      id: editingOutfit ? editingOutfit.id : `outfit-${Date.now()}`,
      name: name.trim(),
      type,
      image: imageUrl.trim() || character.tachie || character.avatar,
      paletteName: paletteName.trim() || '自訂配色',
      colors: colors.length ? colors : ['#334155', '#FFFFFF'],
      keyFeatures: keyFeatures.length ? keyFeatures : ['簡約設計'],
      notes: notes.trim() || '無額外備註',
      seasonOrOccasion: seasonOrOccasion.trim() || '常規活動',
    };

    onSave(character.id, savedOutfit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <Shirt size={20} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {editingOutfit ? `編輯造型：${editingOutfit.name}` : `為 ${character.name} 新增服裝造型`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              造型名稱 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：學院制服、星芒戰鬥裝"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">服裝類型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OutfitType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="casual">日常服</option>
                <option value="combat">戰鬥服</option>
                <option value="special">特殊服飾</option>
                <option value="ceremonial">儀式禮服</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">配色主題名稱</label>
              <input
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="例如：靛白、深海夜藍"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Outfit Image Input with File Upload and Free Crop */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-700">
                造型圖片 (直式 3:4 / 自由裁切)
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCropSrc(imageUrl);
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
              <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={imageUrl || character.avatar}
                  alt="預覽"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
            <label className="block font-medium text-slate-700 mb-1">
              顏色色碼 (以逗號分隔 Hex)
            </label>
            <input
              type="text"
              value={colorsText}
              onChange={(e) => setColorsText(e.target.value)}
              placeholder="#283556, #FFFFFF, #6C7EA3"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              設計重點 (以逗號分隔)
            </label>
            <input
              type="text"
              value={keyFeaturesText}
              onChange={(e) => setKeyFeaturesText(e.target.value)}
              placeholder="蝴蝶結, 層次短裙, 金屬刺繡"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">穿著場合 / 季節</label>
            <input
              type="text"
              value={seasonOrOccasion}
              onChange={(e) => setSeasonOrOccasion(e.target.value)}
              placeholder="學院上課 / 遺跡探險"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">備註說明</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：學院風格設計，方便攜帶法器與手札……"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Save size={14} />
              <span>{editingOutfit ? '儲存變更' : '新增此造型'}</span>
            </button>
          </div>

        </form>
      </div>

      <ImageCropModal
        isOpen={isCropping}
        imageSrc={cropSrc}
        defaultAspect={0.75}
        onClose={() => setIsCropping(false)}
        onCropComplete={(croppedUrl) => {
          setImageUrl(croppedUrl);
          setIsCropping(false);
        }}
      />
    </div>
  );
};
