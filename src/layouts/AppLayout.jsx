import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DesktopSidebar from '../components/layout/DesktopSidebar';
import MobileSidebar from '../components/layout/MobileSidebar';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <MobileSidebar />
      <DesktopSidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
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
