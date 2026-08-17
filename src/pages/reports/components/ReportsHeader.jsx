import { BarChart3 } from 'lucide-react';

export default function ReportsHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Reports</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Daily sales, product performance, outstanding debts and meter reconciliation.
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-9 h-9 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
