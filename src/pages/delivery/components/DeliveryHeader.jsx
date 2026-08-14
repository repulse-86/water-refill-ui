import { Tab, TabGroup, TabList } from '@headlessui/react';
import { Columns3, LayoutGrid } from 'lucide-react';
import { cn } from '../../../utils/cn';

const VIEWS = [
  { id: 'kanban', label: 'Kanban', icon: Columns3 },
  { id: 'list', label: 'List', icon: LayoutGrid },
];

export default function DeliveryHeader({ view, onViewChange }) {
  const activeIndex = Math.max(
    0,
    VIEWS.findIndex((v) => v.id === view)
  );

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Fulfillment</h1>
        <p className="text-sm text-slate-500">
          Track and process orders through the fulfillment pipeline.
        </p>
      </div>
      <TabGroup
        selectedIndex={activeIndex}
        onChange={(index) => onViewChange(VIEWS[index].id)}
      >
        <TabList className="inline-flex items-center bg-slate-100 rounded-lg p-1">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <Tab
              key={id}
              className={({ selected }) =>
                cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors focus:outline-none',
                  selected
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Tab>
          ))}
        </TabList>
      </TabGroup>
    </div>
  );
}