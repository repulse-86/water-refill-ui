import { Outlet } from 'react-router-dom';
import DesktopSidebar from '../components/layout/DesktopSidebar';
import MobileSidebar from '../components/layout/MobileSidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <MobileSidebar />
      <DesktopSidebar />
      <main className="flex-1 bg-white overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
