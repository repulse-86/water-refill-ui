import { Droplet, RotateCcw, Users, Clock } from 'lucide-react';
import CountUp from '../../../components/ui/CountUp';

const icons = {
  gallonsPumped: Droplet,
  bottlesReturned: RotateCcw,
  activeCustomers: Users,
  pendingOrders: Clock,
};

export default function QuickStats({ stats }) {
  const items = [
    { key: 'gallonsPumped', label: 'Gallons Pumped', end: Number(stats.gallonsPumped), decimals: 1 },
    { key: 'bottlesReturned', label: 'Bottles Returned', end: Number(stats.bottlesReturned), decimals: 0 },
    { key: 'activeCustomers', label: 'Active Customers', end: Number(stats.activeCustomers), decimals: 0 },
    { key: 'pendingOrders', label: 'Pending Orders', end: Number(stats.pendingOrders), decimals: 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map(({ key, label, end, decimals }) => {
        const Icon = icons[key];
        return (
          <div key={key} className="bg-white border border-slate-200 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-lg font-bold text-slate-900">
              <CountUp end={end} decimals={decimals} />
            </p>
          </div>
        );
      })}
    </div>
  );
}
