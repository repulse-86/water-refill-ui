import { useEffect, useRef, useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

export default function CustomerPicker({ customers, value, onChange, currency }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  const selected = customers.find((c) => c.id === Number(value)) ?? null;

  const filtered = query.trim()
    ? customers.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : customers;

  useEffect(() => {
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const select = (id) => {
    onChange(id);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-slate-300 rounded bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <span className="flex items-center gap-2 min-w-0">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          {selected ? (
            <span className="truncate text-slate-900">{selected.name}</span>
          ) : (
            <span className="text-slate-500">Walk-in (no account)</span>
          )}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-300 rounded shadow-lg">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers…"
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                onClick={() => select(null)}
                className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
              >
                Walk-in (no account)
              </button>
            </li>
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => select(c.id)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                >
                  <span className="block text-slate-900">{c.name}</span>
                  <span className="block text-[11px] text-slate-400">
                    Bottle debt: {c.bottle_debt} · Balance: {currency} {Number(c.outstanding_balance).toFixed(2)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}