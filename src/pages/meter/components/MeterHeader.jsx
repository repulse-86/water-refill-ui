import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';

export default function MeterHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">Meter & Shift Audit</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Log daily meter readings and compare throughput against POS sales.
        </p>
      </div>
      <Button onClick={onAdd} className="text-xs sm:text-sm">
        <Plus className="w-4 h-4 mr-1.5" />
        Record Reading
      </Button>
    </div>
  );
}
