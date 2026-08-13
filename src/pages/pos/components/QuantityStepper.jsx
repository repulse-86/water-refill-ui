import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onChange, min = 1, className = '' }) {
  const step = (delta) => {
    const next = Number(value) + delta;
    if (next >= min) onChange(next);
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={Number(value) <= min}
        className="w-6 h-6 inline-flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center text-xs font-medium">{value}</span>
      <button
        type="button"
        onClick={() => step(1)}
        className="w-6 h-6 inline-flex items-center justify-center border border-slate-300 rounded text-slate-600 hover:bg-slate-50"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
