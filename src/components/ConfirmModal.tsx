import React from 'react';
import { AlertTriangle, Trash2, RotateCcw, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  icon?: 'trash' | 'warning' | 'reset';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = '確定',
  cancelText = '取消',
  isDanger = false,
  icon = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-center space-y-4"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-xs ${
            isDanger
              ? 'bg-rose-100 text-rose-600'
              : icon === 'reset'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-indigo-100 text-indigo-600'
          }`}
        >
          {icon === 'trash' ? (
            <Trash2 size={24} />
          ) : icon === 'reset' ? (
            <RotateCcw size={24} />
          ) : (
            <AlertTriangle size={24} />
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 font-display">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white transition-all shadow-xs ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
