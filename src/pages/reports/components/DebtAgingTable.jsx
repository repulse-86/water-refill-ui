import Badge from '../../../components/ui/Badge';
import DataTable from '../../../components/ui/DataTable';
import useSettingsStore from '../../../store/settingsStore';

export default function DebtAgingTable({ rows }) {
  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const money = (value) => `${currency} ${Number(value).toFixed(2)}`;

  const columns = [
    {
      accessorKey: 'name',
      header: 'Customer',
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-900">{value}</p>
          <Badge variant={row.subscriber_status === 'active' ? 'green' : 'slate'} className="mt-1">
            {row.subscriber_status === 'active' ? 'Subscriber' : 'Inactive'}
          </Badge>
        </div>
      ),
    },
    { accessorKey: 'phone', header: 'Phone' },
    {
      accessorKey: 'bottle_debt',
      header: 'Bottle Debt',
      render: (value) => `${Number(value).toFixed(0)} bottles`,
    },
    { accessorKey: 'outstanding_balance', header: 'Outstanding', render: money },
    {
      accessorKey: 'total',
      header: 'Total',
      render: (value, row) => (
        <span className="font-semibold text-slate-900">{money(row.outstanding_balance)}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      searchKeys={['name', 'phone']}
      searchPlaceholder="Search customers…"
      emptyMessage="No customers with outstanding balances or bottle debt."
    />
  );
}
