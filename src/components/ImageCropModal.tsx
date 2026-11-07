import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Crop, Move } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  defaultAspect?: number; // e.g. 1 for 1:1, 0.75 for 3:4, 0 for free
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  defaultAspect = 1,
  onClose,
  onCropComplete,
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspect); // 0 means free
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setAspectRatio(defaultAspect);
      setImgLoaded(false);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imgRef.current = img;
        setImgLoaded(true);
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc, defaultAspect]);

  if (!isOpen || !imageSrc) return null;

  // Mouse / Touch handlers for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoom((prev) => Math.min(Math.max(0.4, prev + delta), 4));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Perform final crop to canvas
  const handleSaveCrop = () => {
    if (!imgRef.current || !containerRef.current) return;

    const img = imgRef.current;
    const cropBox = containerRef.current.getBoundingClientRect();
    const outputWidth = aspectRatio === 0 ? 600 : aspectRatio === 1 ? 512 : aspectRatio === 0.75 ? 480 : 640;
    const outputHeight = aspectRatio === 0 ? Math.round(600 * (cropBox.height / cropBox.width)) : Math.round(outputWidth / (aspectRatio || (cropBox.width / cropBox.height)));

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // Save and transform
    ctx.save();
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Map offset from screen pixels to canvas coordinates
    const scaleFactor = outputWidth / cropBox.width;
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);

    // Calculate aspect fit draw
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = outputWidth;
    let drawHeight = outputWidth / imgAspect;

    if (drawHeight < outputHeight) {
      drawHeight = outputHeight;
      drawWidth = outputHeight * imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Crop size={20} className="text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              自由裁切與調整圖片
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">比例:</span>
            <button
              onClick={() => setAspectRatio(1)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                aspectRatio === 1
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              1:1 (正方形頭像)
            </button>
            <button
              onClick={() => setAspectRatio(0.75)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                aspectRatio === 0.75
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              3:4 (直式立繪)
            </button>
            <button
              onClick={() => setAspectRatio(1.33)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                aspectRatio === 1.33
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              4:3 (橫式插畫)
            </button>
            <button
              onClick={() => setAspectRatio(0)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                aspectRatio === 0
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              自由無限制
            </button>
          </div>

          <button
            onClick={handleRotate}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 border border-slate-200"
            title="順時針旋轉90度"
          >
            <RotateCw size={13} />
            <span>旋轉</span>
          </button>
        </div>

        {/* Viewport Cropper Area */}
        <div
          onWheel={handleWheel}
          className="relative w-full h-[320px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center select-none"
        >
          {/* Draggable Viewport Boundary */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              aspectRatio: aspectRatio === 0 ? 'auto' : `${aspectRatio}`,
              width: aspectRatio === 0 ? '90%' : aspectRatio < 1 ? '240px' : '300px',
              height: aspectRatio === 0 ? '90%' : aspectRatio < 1 ? '320px' : '300px',
            }}
            className="relative overflow-hidden border-2 border-dashed border-indigo-400 shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center bg-black/40"
          >
            {imgLoaded ? (
              <img
                src={imageSrc}
                alt="Crop subject"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  maxHeight: 'none',
                  maxWidth: 'none',
                }}
                className="w-full h-full object-contain pointer-events-none transition-transform duration-75"
              />
            ) : (
              <div className="text-white/60 text-xs">載入圖片中……</div>
            )}

            {/* Grid overlay for alignment */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>

            {/* Hint tag */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white/80 text-[10px] pointer-events-none flex items-center gap-1">
              <Move size={10} />
              <span>拖曳移動 / 滾輪縮放</span>
            </div>
          </div>
        </div>

        {/* Zoom Controller */}
        <div className="flex items-center gap-3 px-2">
          <ZoomOut size={16} className="text-slate-400 shrink-0" />
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <ZoomIn size={16} className="text-slate-400 shrink-0" />
          <span className="text-xs font-mono text-slate-500 w-12 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
              setRotation(0);
            }}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            重設位置與縮放
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              className="px-5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-xs"
            >
              <Check size={14} />
              <span>完成裁切並套用</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
