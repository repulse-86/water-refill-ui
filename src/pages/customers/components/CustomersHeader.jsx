import { Tab, TabGroup, TabList } from '@headlessui/react';
import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';

const tabs = [
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
];

export default function CustomersHeader({ viewMode = 'active', onViewModeChange, onAdd }) {
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === viewMode));

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <TabGroup selectedIndex={activeIndex} onChange={(index) => onViewModeChange?.(tabs[index].id)}>
          <TabList className="mb-3 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  cn(
                    'px-4 py-1.5 rounded-lg text-sm font-semibold border transition focus:outline-none focus:ring-2 focus:ring-sky-500',
                    selected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  )
                }
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </TabGroup>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">Customer Registry & Ledger</h1>
        <p className="text-xs sm:text-sm text-slate-500">Manage customer profiles and dual-asset balances.</p>
      </div>
      {viewMode === 'active' && (
        <Button onClick={onAdd} className="text-[10px] sm:text-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Customer
        </Button>
      )}
    </div>
  );
}
