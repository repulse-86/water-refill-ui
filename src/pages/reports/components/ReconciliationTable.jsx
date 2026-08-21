import Badge from '../../../components/ui/Badge';
import DataTable from '../../../components/ui/DataTable';
import { formatDate } from '../../../utils/date';

const STATUS_BADGES = {
  'No Data': 'slate',
  OK: 'green',
  Flagged: 'red',
};

function formatGallons(value) {
  return value == null ? '—' : `${Number(value).toFixed(2)} gal`;
}

export default function ReconciliationTable({ rows }) {
  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      render: (value) => formatDate(value),
    },
    {
      accessorKey: 'expected_volume',
      header: 'Expected',
      render: (value) => formatGallons(value),
    },
    {
      accessorKey: 'actual_throughput',
      header: 'Actual',
      render: (value) => formatGallons(value),
    },
    {
      accessorKey: 'variance',
      header: 'Variance',
      render: (value, row) => {
        if (value == null) return '—';
        const pct = row.variance_pct != null ? ` (${row.variance_pct}%)` : '';
        const className = row.status === 'Flagged' ? 'font-medium text-red-600' : 'text-slate-700';
        return <span className={className}>{formatGallons(value)}{pct}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      render: (value) => <Badge variant={STATUS_BADGES[value] ?? 'slate'}>{value}</Badge>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      searchable={false}
      emptyMessage="No reconciliation data."
    />
  );
}
