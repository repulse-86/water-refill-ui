import { Link } from 'react-router-dom';
import { Droplet, Lock } from 'lucide-react';
import useAuthModalStore from '../../store/authModalStore';

export default function Navbar() {
  const openAuth = useAuthModalStore((state) => state.openAuth);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-sky-600 text-white p-2 rounded">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">AQUA-STATION</span>
            </div>
            <p className="text-xs text-slate-500">Refilling Station Operations Portal</p>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={openAuth}
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            Staff Login
          </button>
        </div>
      </div>
    </header>
  );
}