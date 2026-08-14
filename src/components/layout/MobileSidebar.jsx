import { useState } from 'react';
import { Droplet, Menu, X } from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import SidebarContent from './SidebarContent';

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-center justify-between bg-sky-900 text-white px-4 h-14 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-white/10 p-1.5 rounded">
            <Droplet className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-sm">AQUA-STATION</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-sky-100 hover:bg-sky-800 rounded"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <Transition show={isOpen}>
        <Dialog onClose={() => setIsOpen(false)} className="md:hidden relative z-50">
          <TransitionChild>
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-slate-900/60 transition-opacity duration-300 data-closed:opacity-0"
            />
          </TransitionChild>
          <div className="fixed inset-0 flex">
            <TransitionChild
              transition
              className="transition-transform duration-300 ease-out data-closed:-translate-x-full"
            >
              <DialogPanel className="relative z-10 w-64 bg-sky-900 text-white flex flex-col h-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 p-2 text-sky-100 hover:bg-sky-800 rounded"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
                <SidebarContent onNavigate={() => setIsOpen(false)} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}