import { useEffect, useState, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Wallet, ShoppingCart, Droplets, TriangleAlert } from 'lucide-react';
import useReportsStore from '../../store/reportsStore';
import useSettingsStore from '../../store/settingsStore';
import ReportsHeader from './components/ReportsHeader';
import ReportsTabs from './components/ReportsTabs';
import StatCards from './components/StatCards';
import DailySalesTable from './components/DailySalesTable';
import ProductPerformanceTable from './components/ProductPerformanceTable';
import DebtAgingTable from './components/DebtAgingTable';
import ReconciliationTable from './components/ReconciliationTable';

const TABS = [
  { id: 'daily', label: 'Daily Sales' },
  { id: 'products', label: 'Product Performance' },
  { id: 'debts', label: 'Outstanding Debts' },
  { id: 'reconciliation', label: 'Reconciliation' },
];

export default function Reports() {
  const {
    dailySales,
    productPerformance,
    debtAging,
    reconciliation,
    dailySalesMeta,
    productPerformanceMeta,
    debtAgingMeta,
    reconciliationMeta,
    currentPage,
    perPage,
    status,
    fetchReports,
  } = useReportsStore(
    useShallow((state) => ({
      dailySales: state.dailySales,
      productPerformance: state.productPerformance,
      debtAging: state.debtAging,
      reconciliation: state.reconciliation,
      dailySalesMeta: state.dailySalesMeta,
      productPerformanceMeta: state.productPerformanceMeta,
      debtAgingMeta: state.debtAgingMeta,
      reconciliationMeta: state.reconciliationMeta,
      currentPage: state.currentPage,
      perPage: state.perPage,
      status: state.status,
      fetchReports: state.fetchReports,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('daily');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports({ page: 1, size: perPage, search }).then(() => setReady(true));
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchReports, perPage, search]);

  const handlePageChange = useCallback(
    (page) => {
      fetchReports({ page, size: perPage, search });
    },
    [fetchReports, perPage, search]
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      fetchReports({ page: 1, size, search });
    },
    [fetchReports, search]
  );

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const isLoading = status === 'loading';
  const showSkeleton = !ready || isLoading;

  const totalRevenue = dailySales.reduce((sum, row) => sum + Number(row.revenue ?? 0), 0);
  const totalOrders = dailySales.reduce((sum, row) => sum + Number(row.order_count ?? 0), 0);
  const totalGallons = dailySales.reduce((sum, row) => sum + Number(row.gallons ?? 0), 0);
  const flaggedReadings = reconciliation.filter((row) => row.flagged).length;

  const statItems = [
    {
      icon: Wallet,
      label: 'Total Revenue',
      value: totalRevenue,
      decimals: 2,
      formatter: (v) => `${currency} ${Number(v).toFixed(2)}`,
      sub: `${dailySalesMeta.totalItems} daily sales rows`,
    },
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: totalOrders,
      sub: 'completed on this page',
    },
    {
      icon: Droplets,
      label: 'Total Gallons',
      value: totalGallons,
      decimals: 2,
      formatter: (v) => `${Number(v).toFixed(2)} gal`,
      sub: 'from refill sales',
    },
    {
      icon: TriangleAlert,
      label: 'Flagged Readings',
      value: flaggedReadings,
      sub: `across ${reconciliationMeta.totalItems} reconciliation rows`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ReportsHeader />

      <ReportsTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {showSkeleton && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={110} className="!rounded" />
            ))}
          </div>
          <Skeleton height={200} className="!rounded" />
        </>
      )}

      {!showSkeleton && <StatCards items={statItems} />}

      {!showSkeleton && activeTab === 'daily' && (
        <DailySalesTable
          rows={dailySales}
          isLoading={isLoading}
          currentPage={currentPage}
          perPage={perPage}
          totalItems={dailySalesMeta.totalItems}
          totalPages={dailySalesMeta.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      )}
      {!showSkeleton && activeTab === 'products' && (
        <ProductPerformanceTable
          rows={productPerformance}
          isLoading={isLoading}
          currentPage={currentPage}
          perPage={perPage}
          totalItems={productPerformanceMeta.totalItems}
          totalPages={productPerformanceMeta.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      )}
      {!showSkeleton && activeTab === 'debts' && (
        <DebtAgingTable
          rows={debtAging}
          isLoading={isLoading}
          currentPage={currentPage}
          perPage={perPage}
          totalItems={debtAgingMeta.totalItems}
          totalPages={debtAgingMeta.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      )}
      {!showSkeleton && activeTab === 'reconciliation' && (
        <ReconciliationTable
          rows={reconciliation}
          currentPage={currentPage}
          perPage={perPage}
          totalItems={reconciliationMeta.totalItems}
          totalPages={reconciliationMeta.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      )}
    </div>
  );
}
