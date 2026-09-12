import { Tab, TabGroup, TabList } from '@headlessui/react';
import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';

const TABS = [
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
];

export default function ProductsHeader({ viewMode = 'active', onViewModeChange, onAdd }) {
  const activeIndex = TABS.findIndex((t) => t.id === viewMode);

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <TabGroup
          selectedIndex={activeIndex}
          onChange={(index) => onViewModeChange?.(TABS[index].id)}
        >
          <TabList className="mb-3 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  cn(
                    'px-4 py-1.5 rounded-lg text-sm font-semibold border transition focus:outline-none focus:ring-2 focus:ring-sky-500',
                    selected
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  )
                }
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </TabGroup>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">Inventory & Products</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your product catalog
        </p>
      </div>
      {viewMode === 'active' && (
        <Button onClick={onAdd} className="text-xs sm:text-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Product
        </Button>
      )}
    </div>
  );
}
