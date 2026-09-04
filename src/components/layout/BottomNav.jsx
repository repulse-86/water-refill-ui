import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoreHorizontal, LogOut, X } from 'lucide-react';
import navItems from './navItems';
import useAuthStore from '../../store/authStore';

const primaryItems = [
  navItems.find((i) => i.to === '/dashboard'),
  navItems.find((i) => i.to === '/pos'),
  navItems.find((i) => i.to === '/orders'),
  navItems.find((i) => i.to === '/inventory'),
];

const secondaryItems = navItems.filter(
  (item) => !primaryItems.some((p) => p.to === item.to)
);

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sheetVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring', damping: 30, stiffness: 350 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 * i, duration: 0.25, ease: 'easeOut' },
  }),
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export default function BottomNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const handleNavigate = (to) => {
    setIsOpen(false);
    navigate(to);
  };

  const linkClasses = ({ isActive }) =>
    [
      'flex flex-col items-center gap-0.5 py-1 px-2 text-[11px] transition-colors',
      isActive ? 'text-sky-600' : 'text-gray-500',
    ].join(' ');

  return (
    <>
      {/* Primary bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-14">
          {primaryItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClasses}>
              <Icon className="w-5 h-5" />
              <span>{label.split(' ')[0]}</span>
            </NavLink>
          ))}

          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 text-[11px] text-gray-500"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Secondary items bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <Dialog
            static
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="md:hidden relative z-50"
          >
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-slate-900/60"
              aria-hidden="true"
            />

            <div className="fixed inset-0 flex items-end justify-center">
              <DialogPanel
                as={motion.div}
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-t-2xl shadow-xl w-full max-w-lg max-h-[75vh] flex flex-col"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                {/* Close button */}
                <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                  <span className="font-semibold text-sm text-gray-900">More Pages</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto py-2">
                  {secondaryItems.map(({ to, label, icon: Icon }, i) => (
                    <motion.button
                      key={to}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={() => handleNavigate(to)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
