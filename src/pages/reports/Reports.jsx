import { useEffect, useRef, useState } from 'react';
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
  const { dailySales, productPerformance, debtAging, reconciliation, status, fetchReports } =
    useReportsStore(
      useShallow((state) => ({
        dailySales: state.dailySales,
        productPerformance: state.productPerformance,
        debtAging: state.debtAging,
        reconciliation: state.reconciliation,
        status: state.status,
        fetchReports: state.fetchReports,
      }))
    );

  const [activeTab, setActiveTab] = useState('daily');
  const fetchedRef = useRef(false);

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  useEffect(() => {
    if (!fetchedRef.current && status === 'idle') {
      fetchedRef.current = true;
      fetchReports();
    }
  }, [status, fetchReports]);

  const isLoading = status === 'loading';

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
      sub: `${totalOrders} completed orders`,
    },
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: totalOrders,
      sub: 'across all days',
    },
    {
      icon: Droplets,
      label: 'Gallons Pumped',
      value: totalGallons,
      decimals: 2,
      formatter: (v) => `${Number(v).toFixed(2)} gal`,
      sub: 'from refill sales',
    },
    {
      icon: TriangleAlert,
      label: 'Flagged Readings',
      value: flaggedReadings,
      sub: 'in reconciliation',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ReportsHeader />

      <ReportsTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {isLoading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={110} className="!rounded" />
            ))}
          </div>
          <Skeleton height={200} className="!rounded" />
        </>
      )}

      {!isLoading && <StatCards items={statItems} />}

      {!isLoading && activeTab === 'daily' && <DailySalesTable rows={dailySales} />}
      {!isLoading && activeTab === 'products' && <ProductPerformanceTable rows={productPerformance} />}
      {!isLoading && activeTab === 'debts' && <DebtAgingTable rows={debtAging} />}
      {!isLoading && activeTab === 'reconciliation' && <ReconciliationTable rows={reconciliation} />}
    </div>
  );
}
