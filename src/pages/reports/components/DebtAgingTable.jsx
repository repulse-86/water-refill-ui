import { Activity, Banknote, Droplets, Users } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import DataTable from '../../../components/ui/DataTable';
import StatCards from './StatCards';
import useSettingsStore from '../../../store/settingsStore';

export default function DebtAgingTable({ rows }) {
  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const totalOutstanding = rows.reduce((sum, r) => sum + r.outstanding_balance, 0);
  const totalBottles = rows.reduce((sum, r) => sum + r.bottle_debt, 0);
  const top = rows[0];

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
    <>
      <StatCards
        items={[
          { icon: Users, label: 'Customers Owing', value: rows.length, sub: 'bottles or balance' },
          { icon: Banknote, label: 'Total Outstanding', value: totalOutstanding, decimals: 2, formatter: money, sub: 'unpaid cash' },
          { icon: Droplets, label: 'Total Bottle Debt', value: totalBottles, decimals: 0, sub: 'empty jugs owed' },
          { icon: Activity, label: 'Largest Debt', value: top?.name ?? '—', sub: top ? money(top.outstanding_balance) : null },
        ]}
      />
      <DataTable
        columns={columns}
        data={rows}
        searchKeys={['name', 'phone']}
        searchPlaceholder="Search customers…"
        emptyMessage="No customers with outstanding balances or bottle debt."
      />
    </>
  );
}
