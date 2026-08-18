import { Package, Truck, Users, Gauge, ArrowRight } from 'lucide-react';

const modules = [
  {
    icon: Package,
    title: 'POS & Refill Sales',
    description:
      'Log walk-in and delivery refilling sales, Slim/Round container deposits, and cash receipts.',
    cta: 'Open POS Terminal',
    path: '/pos',
  },
  {
    icon: Truck,
    title: 'Order Management & Delivery',
    description:
      'Track the order lifecycle (Queued to Completed) and record delivery status, bottles returned, and cash collected.',
    cta: 'Manage Orders',
    path: '/orders',
  },
  {
    icon: Users,
    title: 'Customer Registry & Ledger',
    description:
      'Track dual-asset balances (bottle debt and outstanding cash) and settle ledgers in one click.',
    cta: 'View Ledgers',
    path: '/customers',
  },
  {
    icon: Gauge,
    title: 'Meter Reading & Shift Audit',
    description:
      'Log daily odometer readings and reconcile expected volume against actual throughput to flag discrepancies.',
    cta: 'Run Shift Audit',
    path: '/meter-reading',
  },
];

export default function ModulesGrid({ onOpenModule }) {

  return (
    <section id="modules" className="bg-gray-100 py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Protected Workspace <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-800">
                Modules
              </span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
              Select a module below to authenticate and begin your shift tasks. Each module is fully isolated and secure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map(({ icon: Icon, title, description, cta, path }) => (
            <div
              key={title}
              className="group relative bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1"
              onClick={() => onOpenModule(path)}
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-300 transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:translate-x-2">
                <Icon className="w-24 h-24 text-sky-600" />
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-sky-50/80 text-sky-600 rounded-xl flex items-center justify-center mb-6 ring-1 ring-sky-100/50">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{description}</p>
              </div>
              <div
                className="relative z-10 mt-auto text-sm font-semibold text-sky-600 flex items-center gap-2 group-hover:text-sky-700 transition-colors"
              >
                <span>{cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}