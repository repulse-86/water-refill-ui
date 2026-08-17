import { Banknote, ClipboardList, CreditCard, Droplets } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import StatCards from './StatCards';
import useSettingsStore from '../../../store/settingsStore';
import { formatDate } from '../../../utils/date';

export default function DailySalesTable({ rows }) {
  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const totalRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = rows.reduce((sum, r) => sum + r.order_count, 0);
  const totalGallons = rows.reduce((sum, r) => sum + r.gallons, 0);
  const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);

  const money = (value) => `${currency} ${Number(value).toFixed(2)}`;

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      render: (value) => formatDate(value),
    },
    { accessorKey: 'order_count', header: 'Orders' },
    { accessorKey: 'cash', header: 'Cash', render: money },
    { accessorKey: 'e_wallet', header: 'E-Wallet', render: money },
    { accessorKey: 'credit', header: 'Credit', render: money },
    {
      accessorKey: 'revenue',
      header: 'Total',
      render: (value) => <span className="font-semibold text-slate-900">{money(value)}</span>,
    },
    {
      accessorKey: 'gallons',
      header: 'Gallons',
      render: (value) => `${Number(value).toFixed(2)} gal`,
    },
  ];

  return (
    <>
      <StatCards
        items={[
          { icon: Banknote, label: 'Total Revenue', value: totalRevenue, decimals: 2, formatter: money, sub: 'completed sales' },
          { icon: ClipboardList, label: 'Orders', value: totalOrders, sub: 'completed' },
          { icon: Droplets, label: 'Gallons Pumped', value: totalGallons, decimals: 2, formatter: (v) => `${v.toFixed(2)} gal` },
          { icon: CreditCard, label: 'On Credit', value: totalCredit, decimals: 2, formatter: money, sub: 'outstanding charges' },
        ]}
      />
      <DataTable
        columns={columns}
        data={rows}
        searchable={false}
        emptyMessage="No completed sales recorded."
      />
    </>
  );
}
