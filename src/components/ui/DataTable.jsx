import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

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
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const searchableKeys = useMemo(
    () => (searchKeys.length > 0 ? searchKeys : columns.map((c) => c.accessorKey || c.id)),
    [searchKeys, columns]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const needle = query.trim().toLowerCase();
    return data.filter((row) =>
      searchableKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(needle))
    );
  }, [data, query, searchableKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);
  const start = safePage * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);

  const changePage = (dir) => setCurrentPage((p) => Math.min(totalPages - 1, Math.max(0, p + dir)));
  const changeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(0);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.accessorKey || col.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {columns.map((col) => {
                  const value = row[col.accessorKey];
                  const rendered = col.render ? col.render(value, row) : value;
                  return (
                    <td key={col.accessorKey || col.id} className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {rendered}
                    </td>
                  );
                })}
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
            onChange={changeRowsPerPage}
            className="border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-slate-500">
            {filtered.length === 0 ? '0' : start + 1}–{Math.min(start + rowsPerPage, filtered.length)} of {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => changePage(-1)}
            disabled={safePage === 0}
            className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="px-3">
            Page {safePage + 1} of {totalPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={safePage === totalPages - 1}
            className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}