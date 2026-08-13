import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useReportsStore from '../../store/reportsStore';
import ReportsHeader from './components/ReportsHeader';
import ReportsTabs from './components/ReportsTabs';
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
  const { dailySales, productPerformance, debtAging, reconciliation, status, message, fieldErrors, fetchReports } =
    useReportsStore(
      useShallow((state) => ({
        dailySales: state.dailySales,
        productPerformance: state.productPerformance,
        debtAging: state.debtAging,
        reconciliation: state.reconciliation,
        status: state.status,
        message: state.message,
        fieldErrors: state.fieldErrors,
        fetchReports: state.fetchReports,
      }))
    );

  const [activeTab, setActiveTab] = useState('daily');
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current && status === 'idle') {
      fetchedRef.current = true;
      fetchReports();
    }
  }, [status, fetchReports]);

  const isLoading = status === 'loading';
  const hasError = status === 'error' && message;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ReportsHeader />

      <ReportsTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {hasError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {message}
          {fieldErrors && <pre className="mt-2 text-[10px]">{JSON.stringify(fieldErrors, null, 2)}</pre>}
        </div>
      )}

      {isLoading && <p className="text-sm text-slate-400">Loading reports…</p>}

      {!isLoading && activeTab === 'daily' && <DailySalesTable rows={dailySales} />}
      {!isLoading && activeTab === 'products' && <ProductPerformanceTable rows={productPerformance} />}
      {!isLoading && activeTab === 'debts' && <DebtAgingTable rows={debtAging} />}
      {!isLoading && activeTab === 'reconciliation' && <ReconciliationTable rows={reconciliation} />}
    </div>
  );
}
