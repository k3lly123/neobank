import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-high border border-primary/20 text-on-surface shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200"
          onClick={() => onDismiss(toast.id)}
        >
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">
            {toast.icon || 'check_circle'}
          </span>
          <div className="flex flex-col min-w-0 flex-1">
            {toast.title && (
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                {toast.title}
              </span>
            )}
            <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
              {toast.message}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(toast.id);
            }}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
