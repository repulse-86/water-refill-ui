import DataTable from '../../../components/ui/DataTable';
import useSettingsStore from '../../../store/settingsStore';
import { formatDate } from '../../../utils/date';

export default function DailySalesTable({
  rows,
  isLoading,
  currentPage,
  perPage,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}) {
  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

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
    <DataTable
      columns={columns}
      data={rows}
      isLoading={isLoading}
      searchPlaceholder="Search dates…"
      emptyMessage="No completed sales recorded."
      manualPagination
      currentPage={currentPage}
      pageSize={perPage}
      pageCount={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    />
  );
}
