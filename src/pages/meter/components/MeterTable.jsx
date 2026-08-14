import { Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import RowActions from '../../../components/ui/RowActions';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/date';

function formatValue(value) {
  if (value == null) return '—';
  return Number(value).toFixed(2);
}

export default function MeterTable({ readings, isLoading, onEdit, onDelete }) {
  const columns = [
    {
      accessorKey: 'reading_date',
      header: 'Date',
      render: (value) => formatDate(value),
    },
    {
      accessorKey: 'meter_value',
      header: 'Meter Reading',
      render: (value) => `${formatValue(value)} gal`,
    },
    {
      accessorKey: 'expected_volume',
      header: 'Expected',
      render: (value) => `${formatValue(value)} gal`,
    },
    {
      accessorKey: 'actual_throughput',
      header: 'Throughput',
      render: (value) => `${formatValue(value)} gal`,
    },
    {
      accessorKey: 'variance',
      header: 'Variance',
      render: (value, row) => {
        if (value == null) return '—';
        const pct = row.variance_pct != null ? ` (${row.variance_pct}%)` : '';
        const className = row.flagged ? 'font-medium text-red-600' : 'text-slate-700';
        return <span className={className}>{formatValue(value)} gal{pct}</span>;
      },
    },
    {
      accessorKey: 'flagged',
      header: 'Status',
      render: (value, row) => {
        if (row.actual_throughput == null) return <Badge variant="slate">No Data</Badge>;
        return value ? <Badge variant="red">Flagged</Badge> : <Badge variant="green">OK</Badge>;
      },
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      render: (_value, row) => (
        <RowActions
          actions={[
            { icon: Pencil, label: 'Edit', variant: 'edit', onClick: () => onEdit(row) },
            { icon: Trash2, label: 'Delete', variant: 'danger', onClick: () => onDelete(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={readings}
      isLoading={isLoading}
      searchKeys={['reading_date']}
      searchPlaceholder="Search readings…"
      emptyMessage="No meter readings recorded."
    />
  );
}
