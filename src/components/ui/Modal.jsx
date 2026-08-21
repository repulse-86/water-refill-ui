import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

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
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount={isOpen}>
                <motion.div
                  className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                  style={{ translate: "-50% -50%" }}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
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
                          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-semibold px-2 py-1 rounded-lg transition-colors"
                          aria-label="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Dialog.Close>
                    )}
                  </div>

                  {children}
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}