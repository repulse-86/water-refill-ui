import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';
import DesktopSidebar from '../components/layout/DesktopSidebar';
import BottomNav from '../components/layout/BottomNav';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <header className="md:hidden sticky top-0 z-30 flex items-center bg-sky-900 text-white px-4 h-14 shrink-0">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="bg-white/10 p-1.5 rounded">
            <Droplet className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-sm">AQUA-STATION</span>
        </Link>
      </header>

      <DesktopSidebar />
      <BottomNav />

      <main className="flex-1 bg-gray-50 overflow-y-auto pb-20 md:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
