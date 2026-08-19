import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useDashboardStore from '../../store/dashboardStore';
import useSettingsStore from '../../store/settingsStore';
import DashboardHeader from './components/DashboardHeader';
import TodaySalesCard from './components/TodaySalesCard';
import QuickStats from './components/QuickStats';
import SalesTrendChart from './components/SalesTrendChart';
import TopProductsChart from './components/TopProductsChart';
import PaymentMixChart from './components/PaymentMixChart';
import PendingOrdersList from './components/PendingOrdersList';
import LowStockAlerts from './components/LowStockAlerts';

export default function Dashboard() {
  const { dashboard, status, fetchDashboard } = useDashboardStore(
    useShallow((state) => ({
      dashboard: state.dashboard,
      status: state.status,
      fetchDashboard: state.fetchDashboard,
    }))
  );
  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current && dashboard == null && status === 'idle') {
      fetchedRef.current = true;
      fetchDashboard();
    }
  }, [dashboard, status, fetchDashboard]);

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DashboardHeader />

      {isLoading && !dashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Skeleton height={140} className="!rounded" />
            <Skeleton height={140} className="!rounded" />
          </div>
          <div className="space-y-3">
            <Skeleton height={140} className="!rounded" />
            <Skeleton height={140} className="!rounded" />
          </div>
        </div>
      )}

      {dashboard && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <TodaySalesCard today={dashboard.today} currency={currency} />
            <QuickStats stats={dashboard.quickStats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <SalesTrendChart data={dashboard.salesTrend} currency={currency} />
              <PendingOrdersList orders={dashboard.pendingOrders} currency={currency} />
              <LowStockAlerts products={dashboard.lowStock} />
            </div>
            <div className="flex flex-col gap-4">
              <PaymentMixChart data={dashboard.paymentMix} currency={currency} />
              <TopProductsChart data={dashboard.topProducts} currency={currency} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
