export default function StatCards({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map(({ icon: Icon, label, value, sub }) => (
        <div key={label} className="bg-white border border-slate-200 rounded p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      ))}
    </div>
  );
}
