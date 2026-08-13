import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Droplet, LayoutDashboard, Package, Truck, ClipboardList, Users, Gauge, Settings, Boxes, LogOut, BarChart3 } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory & Products', icon: Boxes },
  { to: '/pos', label: 'POS & Refill Sales', icon: Package },
  { to: '/orders', label: 'Orders & Delivery', icon: Truck },
  { to: '/delivery', label: 'Fulfillment', icon: ClipboardList },
  { to: '/customers', label: 'Customer Ledger', icon: Users },
  { to: '/meter-reading', label: 'Meter & Shift Audit', icon: Gauge },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Store Settings', icon: Settings },
];

export default function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex items-center space-x-3 px-5 py-5 border-b border-sky-800"
      >
        <div className="bg-white/10 p-2 rounded">
          <Droplet className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold tracking-tight text-sm">AQUA-STATION</span>
          <p className="text-[11px] text-sky-300">Operations Portal</p>
        </div>
      </Link>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center space-x-3 px-3 py-2 rounded text-sm transition-colors',
                isActive ? 'bg-sky-700 text-white font-semibold' : 'text-sky-100 hover:bg-sky-800',
              ].join(' ')
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center space-x-3 px-6 py-4 border-t border-sky-800 text-sky-100 hover:bg-sky-800 text-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    </>
  );
}
