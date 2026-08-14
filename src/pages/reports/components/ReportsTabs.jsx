import { Tab, TabGroup, TabList } from '@headlessui/react';
import { cn } from '../../../utils/cn';

export default function ReportsTabs({ tabs, activeTab, onChange }) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTab)
  );

  return (
    <TabGroup
      selectedIndex={activeIndex}
      onChange={(index) => onChange(tabs[index].id)}
    >
      <TabList className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            className={({ selected }) =>
              cn(
                'px-4 py-2 rounded text-sm font-semibold border transition focus:outline-none focus:ring-2 focus:ring-sky-500',
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
  );
}