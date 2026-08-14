import { LayoutDashboard } from 'lucide-react';
import useSettingsStore from '../../../store/settingsStore';

export default function DashboardHeader() {
  const settings = useSettingsStore((state) => state.settings);
  const storeName = settings?.store_name ?? 'My Water Refilling Station';

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{storeName}</h1>
        <p className="text-sm text-slate-500">
          Dashboard overview · {today}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-9 h-9 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
