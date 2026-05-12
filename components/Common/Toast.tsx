'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Toast as ToastType } from '@/types';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning',
  };

  const colors = {
    success: 'border-l-accent-green text-accent-green',
    error: 'border-l-red-500 text-red-500',
    info: 'border-l-accent-orange text-accent-orange',
    warning: 'border-l-amber-500 text-amber-500',
  };

  return (
    <motion.div
      key={id}
      layout
      initial={{ opacity: 0, y: 20, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 100 }}
      className={`card-glass p-4 rounded-xl flex items-center gap-4 border-l-4 ${colors[type]}`}
    >
      <span className="material-symbols-outlined flex-shrink-0">
        {icons[type]}
      </span>
      <p className="text-sm font-bold flex-1 text-text-dark">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-text-muted hover:text-text-dark transition-colors"
        aria-label="Close toast"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-8 right-8 z-[200] space-y-4 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
