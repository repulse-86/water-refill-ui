import { Outlet } from 'react-router-dom';
import Navbar from '../components/website/Navbar';
import Footer from '../components/website/Footer';
import AuthModal from '../components/website/AuthModal';

export default function GuestLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}