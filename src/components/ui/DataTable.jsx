import { useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchKeys = [],
  searchPlaceholder = 'Search…',
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  emptyMessage = 'No records found.',
}) {
  const searchableKeys = useMemo(
    () => (searchKeys.length > 0 ? searchKeys : columns.map((c) => c.accessorKey || c.id)),
    [searchKeys, columns]
  );

  const tableColumns = useMemo(
    () =>
      columns.map((col) => ({
        id: col.accessorKey ?? col.id,
        header: col.header,
        accessorKey: col.accessorKey,
        cell: ({ row }) => {
          const original = row.original;
          const value = original[col.accessorKey];
          return col.render ? col.render(value, original) : value;
        },
      })),
    [columns]
  );

  const table = useTable({
    features,
    data,
    columns: tableColumns,
    initialState: { pagination: { pageIndex: 0, pageSize } },
    globalFilterFn: 'includesString',
    getColumnCanGlobalFilter: (column) => searchableKeys.includes(column.id),
  });

  const { pageIndex, pageSize: rowsPerPage } = table.state.pagination;
  const totalRows = table.getRowCount();
  const start = totalRows === 0 ? 0 : pageIndex * rowsPerPage + 1;
  const end = Math.min(start + rowsPerPage - 1, totalRows);
  const pageRows = table.getRowModel().rows;

  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={table.state.globalFilter ?? ''}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-slate-500">
            Rows per page
          </label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-slate-500">
            {totalRows === 0 ? '0' : `${start}–${end} of ${totalRows}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="px-3">
            Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}