import React, { useState, useEffect } from 'react';
import { CreatorProfile } from '../types/character';
import { X, Save, User, Crop } from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: CreatorProfile) => void;
  profile: CreatorProfile;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profile,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bannerQuote, setBannerQuote] = useState('');
  const [isCropping, setIsCropping] = useState(false);
  const [cropSrc, setCropSrc] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setTitle(profile.title);
      setBio(profile.bio);
      setAvatar(profile.avatar);
      setBannerQuote(profile.bannerQuote);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      title: title.trim() || '創作者',
      bio: bio.trim(),
      avatar: avatar.trim() || profile.avatar,
      bannerQuote: bannerQuote.trim() || '今天也要繼續為你的角色注入靈魂嗎？',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <User size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              編輯創作者個人品牌檔案
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0">
              <img src={avatar || profile.avatar} alt="頭像" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700">創作者頭像 (1:1 正方形)</label>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setCropSrc(avatar);
                      setIsCropping(true);
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 underline flex items-center gap-0.5"
                  >
                    <Crop size={10} />
                    <span>裁切</span>
                  </button>
                )}
              </div>
              <label className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-medium cursor-pointer transition-colors">
                <span>選擇新頭像並裁切</span>
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
            <label className="block font-medium text-slate-700 mb-1">創作者名稱 / 筆名</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：星辰繪者"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">個人身分標語</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：原創角色世界觀主理人"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">個人簡介 / 創作理念</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="介紹你的創作風格、擅長的題材或世界觀理念……"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">主頁問候語錄</label>
            <input
              type="text"
              value={bannerQuote}
              onChange={(e) => setBannerQuote(e.target.value)}
              placeholder="例如：今天也要繼續為你的角色注入靈魂嗎？"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
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
              <span>儲存個人檔案</span>
            </button>
          </div>

        </form>
      </div>

      <ImageCropModal
        isOpen={isCropping}
        imageSrc={cropSrc}
        defaultAspect={1}
        onClose={() => setIsCropping(false)}
        onCropComplete={(croppedUrl) => {
          setAvatar(croppedUrl);
          setIsCropping(false);
        }}
      />
    </div>
  );
};
