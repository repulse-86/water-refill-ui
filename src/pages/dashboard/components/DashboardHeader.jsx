import useSettingsStore from '../../../store/settingsStore';
import { formatLongDate } from '../../../utils/date';

export default function DashboardHeader() {
  const settings = useSettingsStore((state) => state.settings);
  const storeName = settings?.store_name ?? 'My Water Refilling Station';

  const today = formatLongDate(new Date());

  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">
        {storeName}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500">{today}</p>
    </div>
  );
}
