import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function Modal({ isOpen, onClose, title, icon: Icon, hideClose = false, children }) {
  const blockDismiss = hideClose
    ? {
        onPointerDownOutside: (e) => e.preventDefault(),
        onEscapeKeyDown: (e) => e.preventDefault(),
        onInteractOutside: (e) => e.preventDefault(),
      }
    : {};

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded border border-slate-300 bg-white p-6 shadow-xl"
          {...blockDismiss}
        >
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              {Icon && <Icon className="w-5 h-5 text-sky-600" />}
              <Dialog.Title className="font-bold text-slate-900 text-base">{title}</Dialog.Title>
            </div>
            {!hideClose && (
              <Dialog.Close asChild>
                <button
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold px-2 py-1"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            )}
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}