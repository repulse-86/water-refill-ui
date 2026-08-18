import { Droplet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div className="flex items-center space-x-2">
          <Droplet className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">AquaPure Station Operations Hub</span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="font-mono text-slate-400">v2.4.0</span>
        </div>
      </div>
    </footer>
  );
}