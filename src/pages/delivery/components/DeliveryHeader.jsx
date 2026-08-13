import { Columns3, LayoutGrid } from 'lucide-react';

const VIEWS = [
  { id: 'kanban', label: 'Kanban', icon: Columns3 },
  { id: 'list', label: 'List', icon: LayoutGrid },
];

export default function DeliveryHeader({ view, onViewChange }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Fulfillment</h1>
        <p className="text-sm text-slate-500">
          Track and process orders through the fulfillment pipeline.
        </p>
      </div>
      <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onViewChange(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              view === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
