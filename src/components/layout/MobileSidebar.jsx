import { useState } from 'react';
import { Droplet, Menu, X } from 'lucide-react';
import SidebarContent from './SidebarContent';

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

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

      <div
        className={`md:hidden fixed inset-0 z-50 flex ${
          isOpen ? '' : 'pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/60 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={close}
        />
        <aside
          className={`relative z-10 w-64 bg-sky-900 text-white flex flex-col h-full transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={close}
            className="absolute top-3 right-3 p-2 text-sky-100 hover:bg-sky-800 rounded"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
          <SidebarContent onNavigate={close} />
        </aside>
      </div>
    </>
  );
}
