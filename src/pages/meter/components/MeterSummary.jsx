import { Droplets, Gauge, Activity, TriangleAlert } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/date';

function formatValue(value, suffix = 'gal') {
  if (value == null) return '—';
  return `${Number(value).toFixed(2)} ${suffix}`;
}

function statCard(Icon, label, value, sub) {
  return (
    <div className="bg-white border border-slate-200 rounded p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function MeterSummary({ reading }) {
  if (!reading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCard(Droplets, 'Expected Volume', '—')}
        {statCard(Gauge, 'Actual Throughput', '—')}
        {statCard(Activity, 'Variance', '—')}
        {statCard(TriangleAlert, 'Status', 'No readings')}
      </div>
    );
  }

  const flagged = reading.flagged;
  const varianceSub =
    reading.variance_pct != null ? `${Number(reading.variance_pct).toFixed(1)}%` : null;
  const statusSub = `as of ${formatDate(reading.reading_date)}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCard(Droplets, 'Expected Volume', formatValue(reading.expected_volume), 'from completed sales')}
      {statCard(Gauge, 'Actual Throughput', formatValue(reading.actual_throughput), 'meter delta vs previous')}
      {statCard(Activity, 'Variance', formatValue(reading.variance), varianceSub)}
      <div className="bg-white border border-slate-200 rounded p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
            <TriangleAlert className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</span>
        </div>
        {reading.actual_throughput == null ? (
          <Badge variant="slate">No Data</Badge>
        ) : flagged ? (
          <Badge variant="red">Flagged</Badge>
        ) : (
          <Badge variant="green">OK</Badge>
        )}
        <p className="text-xs text-slate-400 mt-1">{statusSub}</p>
      </div>
    </div>
  );
}
