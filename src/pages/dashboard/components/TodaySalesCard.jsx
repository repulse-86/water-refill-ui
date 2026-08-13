import { Wallet } from 'lucide-react';

const rows = [
  { key: 'cash', label: 'Cash', color: 'text-emerald-600' },
  { key: 'e_wallet', label: 'E-Wallet', color: 'text-sky-600' },
  { key: 'credit', label: 'Credit', color: 'text-amber-600' },
];

export default function TodaySalesCard({ today, currency }) {
  const format = (value) => `${currency} ${Number(value).toFixed(2)}`;

  return (
    <div className="bg-white border border-slate-200 rounded p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
          <Wallet className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Today&apos;s Sales
        </span>
      </div>

      <p className="text-2xl font-bold text-slate-900 mb-1">{format(today.revenue)}</p>
      <p className="text-xs text-slate-400 mb-4">
        {today.order_count} completed order{today.order_count === 1 ? '' : 's'} today
      </p>

      <div className="space-y-2 border-t border-slate-100 pt-3">
        {rows.map(({ key, label, color }) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{label}</span>
            <span className={`font-semibold ${color}`}>{format(today[key])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
