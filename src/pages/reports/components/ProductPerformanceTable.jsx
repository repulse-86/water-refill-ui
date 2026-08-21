import Badge from '../../../components/ui/Badge';
import DataTable from '../../../components/ui/DataTable';
import useSettingsStore from '../../../store/settingsStore';

const TYPE_BADGES = {
  water_refill: 'blue',
  accessory: 'slate',
  equipment: 'violet',
};

const TYPE_LABELS = {
  water_refill: 'Water Refill',
  accessory: 'Accessory',
  equipment: 'Equipment',
};

export default function ProductPerformanceTable({ rows }) {
  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const money = (value) => `${currency} ${Number(value).toFixed(2)}`;

  const columns = [
    {
      accessorKey: 'name',
      header: 'Product',
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-900">{value}</p>
          <Badge variant={TYPE_BADGES[row.type] ?? 'slate'} className="mt-1">
            {TYPE_LABELS[row.type] ?? row.type}
          </Badge>
        </div>
      ),
    },
    { accessorKey: 'units', header: 'Units Sold' },
    { accessorKey: 'revenue', header: 'Revenue', render: money },
    {
      accessorKey: 'share_pct',
      header: 'Share',
      render: (value) => `${Number(value).toFixed(1)}%`,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      searchPlaceholder="Search products…"
      emptyMessage="No product sales recorded."
    />
  );
}
