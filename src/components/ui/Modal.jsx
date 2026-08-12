import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, icon: Icon, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded border border-slate-300 shadow-xl max-w-md w-full p-6 relative">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-5 h-5 text-sky-600" />}
            <h3 className="font-bold text-slate-900 text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold px-2 py-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}