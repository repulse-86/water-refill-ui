import { useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, ChevronDown, User } from 'lucide-react';

export default function CustomerPicker({ customers, value, onChange, currency }) {
  const [query, setQuery] = useState('');

  const selected =
    customers.find((c) => c.id === Number(value)) ?? { id: null, name: 'Walk-in (no account)' };

  const walkIn = { id: null, name: 'Walk-in (no account)' };

  const filtered = query.trim()
    ? customers.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : customers;

  return (
    <Combobox value={selected} onChange={(c) => onChange(c.id)} by="id">
      <div className="relative">
        <ComboboxButton className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-slate-300 rounded bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <span className="flex items-center gap-2 min-w-0">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className={selected.id ? 'truncate text-slate-900' : 'truncate text-slate-500'}>
              {selected.name}
            </span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </ComboboxButton>

        <ComboboxOptions className="absolute z-20 mt-1 w-full bg-white border border-slate-300 rounded shadow-lg">
          <ComboboxInput
            className="w-full p-2 text-sm border-b border-slate-100 focus:outline-none"
            placeholder="Search customers…"
            displayValue={() => ''}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="max-h-56 overflow-y-auto py-1">
            <ComboboxOption key="walk-in" value={walkIn} className="cursor-default">
              {({ focus }) => (
                <li
                  className={`w-full text-left px-3 py-2 text-sm text-slate-500 ${
                    focus ? 'bg-slate-50' : ''
                  }`}
                >
                  Walk-in (no account)
                </li>
              )}
            </ComboboxOption>
            {filtered.map((c) => (
              <ComboboxOption key={c.id} value={c} className="cursor-default">
                {({ focus, selected: isSelected }) => (
                  <li
                    className={`w-full flex items-center justify-between text-left px-3 py-2 text-sm ${
                      focus ? 'bg-slate-50' : ''
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-slate-900">{c.name}</span>
                      <span className="block text-[11px] text-slate-400">
                        Bottle debt: {c.bottle_debt} · Balance: {currency}{' '}
                        {Number(c.outstanding_balance).toFixed(2)}
                      </span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                  </li>
                )}
              </ComboboxOption>
            ))}
          </ul>
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}