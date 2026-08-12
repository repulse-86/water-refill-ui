import { Package, Truck, Users, Gauge, ArrowRight } from 'lucide-react';

const modules = [
  {
    icon: Package,
    title: 'POS & Refill Sales',
    description:
      'Log walk-in and delivery refilling sales, Slim/Round container deposits, and cash receipts.',
    cta: 'Open POS Terminal',
  },
  {
    icon: Truck,
    title: 'Order Management & Delivery',
    description:
      'Track the order lifecycle (Queued to Completed) and record delivery status, bottles returned, and cash collected.',
    cta: 'Manage Orders',
  },
  {
    icon: Users,
    title: 'Customer Registry & Ledger',
    description:
      'Track dual-asset balances (bottle debt and outstanding cash) and settle ledgers in one click.',
    cta: 'View Ledgers',
  },
  {
    icon: Gauge,
    title: 'Meter Reading & Shift Audit',
    description:
      'Log daily odometer readings and reconcile expected volume against actual throughput to flag discrepancies.',
    cta: 'Run Shift Audit',
  },
];

export default function ModulesGrid({ onOpenAuth }) {

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Protected Workspace Modules</h2>
          <p className="text-sm text-slate-500">Select a module to authenticate and begin shift tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map(({ icon: Icon, title, description, cta }) => (
          <div
            key={title}
            className="bg-white border border-slate-200 p-5 rounded hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">{title}</h3>
              <p className="text-xs text-slate-600 mb-4 leading-normal">{description}</p>
            </div>
            <button
              onClick={onOpenAuth}
              className="w-full text-left text-xs font-semibold text-sky-700 hover:text-sky-800 pt-3 border-t border-slate-100 flex items-center justify-between"
            >
              <span>{cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}