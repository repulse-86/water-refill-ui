import { LayoutDashboard, Package, Truck, ClipboardList, Users, Gauge, Settings, Boxes, BarChart3 } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory & Products', icon: Boxes },
  { to: '/pos', label: 'POS & Refill Sales', icon: Package },
  { to: '/orders', label: 'Orders & Delivery', icon: Truck },
  { to: '/delivery', label: 'Fulfillment', icon: ClipboardList },
  { to: '/customers', label: 'Customer Ledger', icon: Users },
  { to: '/meter-reading', label: 'Meter & Shift Audit', icon: Gauge },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Store Settings', icon: Settings },
];

export default navItems;
