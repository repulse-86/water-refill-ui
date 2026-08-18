import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';

const navLinks = [
  { label: 'Overview', target: 'overview' },
  { label: 'Modules', target: 'modules' },
  { label: 'Checklist', target: 'checklist' },
];

export default function Navbar({ onOpenAuth }) {

  const scrollToSection = (e, target) => {
    e.preventDefault();
    const el = document.getElementById(target);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <header className="relative bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-sky-600 text-white p-2 rounded-lg">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">AQUA-STATION</span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">Refilling Station Operations Portal</p>
          </div>
        </Link>

        <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-9">
          {navLinks.map(({ label, target }) => (
            <button
              key={target}
              onClick={(e) => scrollToSection(e, target)}
              className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}