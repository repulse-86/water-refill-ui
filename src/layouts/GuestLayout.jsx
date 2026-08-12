import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/website/Navbar';
import Footer from '../components/website/Footer';
import AuthModal from '../components/website/AuthModal';

export default function GuestLayout() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenAuth={openAuth} />
      <main className="flex-grow">
        <Outlet context={{ isAuthOpen, openAuth, closeAuth }} />
      </main>
      <Footer />
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </div>
  );
}
