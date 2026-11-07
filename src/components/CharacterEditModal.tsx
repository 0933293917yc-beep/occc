import React, { useState, useEffect } from 'react';
import { Character, WorldSetting } from '../types/character';
import { X, Save, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';

interface CharacterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (charData: Partial<Character>) => void;
  initialCharacter?: Character | null;
  worldSetting: WorldSetting;
}

export const CharacterEditModal: React.FC<CharacterEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCharacter,
  worldSetting,
}) => {
  const [name, setName] = useState('');
  const [romanizedName, setRomanizedName] = useState('');
  const [title, setTitle] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('女性');
  const [personality, setPersonality] = useState('');
  const [quote, setQuote] = useState('');
  const [background, setBackground] = useState('');
  const [factionId, setFactionId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [avatar, setAvatar] = useState('');
  const [tachie, setTachie] = useState('');
  const [cropModalState, setCropModalState] = useState<{
    isOpen: boolean;
    imageSrc: string;
    aspect: number;
    target: 'avatar' | 'tachie';
  }>({
    isOpen: false,
    imageSrc: '',
    aspect: 1,
    target: 'avatar',
  });

  useEffect(() => {
    if (initialCharacter) {
      setName(initialCharacter.name);
      setRomanizedName(initialCharacter.romanizedName);
      setTitle(initialCharacter.title);
      setAge(initialCharacter.age);
      setHeight(initialCharacter.height);
      setBirthday(initialCharacter.birthday);
      setGender(initialCharacter.gender);
      setPersonality(initialCharacter.personality);
      setQuote(initialCharacter.quote);
      setBackground(initialCharacter.background);
      setFactionId(initialCharacter.factionId);
      setTagsInput(initialCharacter.tags.join(', '));
      setAvatar(initialCharacter.avatar);
      setTachie(initialCharacter.tachie);
    } else {
      // Defaults for new character
      setName('');
      setRomanizedName('');
      setTitle('');
      setAge('18歲');
      setHeight('165cm');
      setBirthday('1月1日');
      setGender('女性');
      setPersonality('沉著、好奇心旺盛');
      setQuote('「」');
      setBackground('');
      setFactionId(worldSetting.factions[0]?.id || '');
      setTagsInput('原創, 魔法, 冒險');
      setAvatar('/src/assets/images/charlotte_avatar_1793426975684.jpg');
      setTachie('/src/assets/images/charlotte_tachie_1793426976035.jpg');
    }
  }, [initialCharacter, isOpen, worldSetting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(/[,，、]/)
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      name: name.trim(),
      romanizedName: romanizedName.trim() || name.trim(),
      title: title.trim() || '新銳冒險家',
      age: age.trim() || '未公開',
      height: height.trim() || '未公開',
      birthday: birthday.trim() || '未公開',
      gender: gender.trim(),
      personality: personality.trim(),
      quote: quote.trim() || `「我是 ${name}。」`,
      background: background.trim() || '尚在探索中的神秘背景故事……',
      factionId: factionId || worldSetting.factions[0]?.id || '',
      tags: tags.length ? tags : ['原創角色'],
      avatar: avatar.trim() || '/src/assets/images/charlotte_avatar_1793426975684.jpg',
      tachie: tachie.trim() || avatar.trim() || '/src/assets/images/charlotte_tachie_1793426976035.jpg',
      lastEdited: new Date().toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }),
    });

    onClose();
  };

  const handleStartCrop = (src: string, target: 'avatar' | 'tachie', aspect: number) => {
    if (!src) return;
    setCropModalState({
      isOpen: true,
      imageSrc: src,
      aspect,
      target,
    });
  };

  const handleCropComplete = (croppedUrl: string) => {
    if (cropModalState.target === 'avatar') {
      setAvatar(croppedUrl);
    } else {
      setTachie(croppedUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 font-display">
                {initialCharacter ? `編輯角色：${initialCharacter.name}` : '建立新原創角色'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Name & Romanized Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  角色名稱 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：夏洛特"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  英文名 / 外文羅馬拼音
                </label>
                <input
                  type="text"
                  value={romanizedName}
                  onChange={(e) => setRomanizedName(e.target.value)}
                  placeholder="例如：Charlotte"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Title & Faction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  角色稱號 / 身分
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：星芒之詠 · 秘術研修生"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  所屬組織 / 陣營
                </label>
                <select
                  value={factionId}
                  onChange={(e) => setFactionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {worldSetting.factions.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age, Height, Birthday, Gender */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">年齡</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="17歲"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">身高</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="162cm"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">生日</label>
                <input
                  type="text"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="4月14日"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">性別</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="女性 / 男性 / 其他"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            {/* Personality & Quote */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">個性特質</label>
              <input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="例如：溫柔、堅強、有點怕生"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">代表語錄 / 台詞</label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="「……沒關係的，我會一直在。」"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-serif"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                分類標籤 (以逗號分隔)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="例如：少女, 魔法, 溫柔, 古典"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            {/* Background Story */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">背景故事與設定</label>
              <textarea
                rows={3}
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="描述角色的故鄉、經歷、目標與世界觀連結……"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white leading-relaxed resize-none"
              />
            </div>

            {/* Avatar and Tachie Image Inputs with Local File Upload and Free Crop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700">
                    角色頭像 (1:1 正方形)
                  </label>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => handleStartCrop(avatar, 'avatar', 1)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 underline"
                    >
                      自由裁切此圖
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={avatar || '/src/assets/images/charlotte_avatar_1793426975684.jpg'}
                      alt="預覽"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="圖片網址"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <label className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-medium cursor-pointer transition-colors shrink-0">
                    <span>上傳裁切</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              const res = ev.target.result as string;
                              handleStartCrop(res, 'avatar', 1);
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
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700">
                    立繪全身圖 (3:4 直式 / 自由)
                  </label>
                  {tachie && (
                    <button
                      type="button"
                      onClick={() => handleStartCrop(tachie, 'tachie', 0.75)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 underline"
                    >
                      自由裁切此圖
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={tachie || avatar || '/src/assets/images/charlotte_tachie_1793426976035.jpg'}
                      alt="預覽"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={tachie}
                    onChange={(e) => setTachie(e.target.value)}
                    placeholder="立繪網址"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <label className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-medium cursor-pointer transition-colors shrink-0">
                    <span>上傳裁切</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              const res = ev.target.result as string;
                              handleStartCrop(res, 'tachie', 0.75);
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
            </div>

          {/* Image Presets Selector */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-medium text-slate-700 mb-2">
              快速套用風格立繪範本
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { name: '夏洛特', avatar: '/src/assets/images/charlotte_avatar_1793426975684.jpg', tachie: '/src/assets/images/charlotte_tachie_1793426976035.jpg' },
                { name: '夜嵐', avatar: '/src/assets/images/yelan_avatar_1793426978713.jpg', tachie: '/src/assets/images/yelan_avatar_1793426978713.jpg' },
                { name: '艾琳', avatar: '/src/assets/images/eileen_avatar_1793426977875.jpg', tachie: '/src/assets/images/eileen_avatar_1793426977875.jpg' },
                { name: '羅仔', avatar: '/src/assets/images/roy_avatar_1793426978487.jpg', tachie: '/src/assets/images/roy_avatar_1793426978487.jpg' },
              ].map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setAvatar(preset.avatar);
                    setTachie(preset.tachie);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-[11px] text-slate-700"
                >
                  <img src={preset.avatar} alt={preset.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{preset.name}風格</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
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
              <span>儲存角色</span>
            </button>
          </div>

        </form>
      </div>
    </div>

    <ImageCropModal
      isOpen={cropModalState.isOpen}
      imageSrc={cropModalState.imageSrc}
      defaultAspect={cropModalState.aspect}
      onClose={() => setCropModalState((prev) => ({ ...prev, isOpen: false }))}
      onCropComplete={handleCropComplete}
    />
  </>
  );
};
