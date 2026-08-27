import { useFocusTrap } from '@/hooks/useFocusTrap';
import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
  const ref = useFocusTrap(isOpen);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div ref={ref} className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 id="modal-title" className="font-bold text-xl text-slate-800">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close modal" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
