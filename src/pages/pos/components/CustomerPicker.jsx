import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, User } from 'lucide-react';

export default function CustomerPicker({ customers, value, onChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected =
    customers.find((c) => c.id === Number(value)) ?? { id: null, name: 'Walk-in (no account)' };

  const walkIn = { id: null, name: 'Walk-in (no account)' };

  const filtered = query.trim()
    ? customers.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : customers;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((customer) => {
    onChange(customer.id);
    setQuery(customer.name);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 mb-1"
        placeholder="Search customers…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-56 overflow-y-auto py-1">
          <li
            className="cursor-default block w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
            onClick={() => handleSelect(walkIn)}
          >
            Walk-in (no account)
          </li>
          {filtered.map((c) => (
            <li
              key={c.id}
              className="cursor-default flex items-center justify-between text-left px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => handleSelect(c)}
            >
              <span className="flex items-center gap-2 min-w-0">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate text-slate-900">{c.name}</span>
              </span>
              {selected.id === c.id && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
