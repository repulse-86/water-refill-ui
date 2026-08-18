import {
  ArrowRight,
  ShieldCheck,
  Users,
  Truck,
  Gauge,
  Package,
  ClipboardCheck,
  CheckCircle2,
  TrendingUp,
  Droplets,
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const overviewStats = [
  { icon: Package, label: 'POS & Refill Sales', value: 'PHP 12,480', sub: '42 transactions today' },
  { icon: Truck, label: 'Orders in Progress', value: '6 queued', sub: '3 out for delivery' },
  { icon: Users, label: 'Customer Ledger', value: '128 active', sub: 'PHP 5,200 outstanding' },
  { icon: Gauge, label: 'Meter & Shift Audit', value: 'Reconciled', sub: '0 flagged readings' },
];

const heroMetrics = [
  { icon: TrendingUp, label: 'Transactions logged', value: '500+' },
  { icon: ShieldCheck, label: 'Shift audits passed', value: '100%' },
  { icon: CheckCircle2, label: 'Ledger settlement', value: '1-click' },
];

export default function Hero({ onOpenAuth }) {

  return (
    <section id="overview" className="relative bg-white overflow-hidden min-h-[calc(100vh-4rem)] pt-14 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 xl:gap-16 items-start">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-[3.4rem] font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Water Refilling Station Management Terminal
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-medium">
              All-in-one single-owner gateway for store operations, point-of-sale transactions,
              delivery order tracking, customer dual-asset ledgers, and daily meter shift audits.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={onOpenAuth}
                className="group inline-flex items-center justify-center w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Launch Operations Console
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            <motion.dl
              variants={itemVariants}
              className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl pt-8 border-t border-slate-100"
            >
              {heroMetrics.map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <Icon className="w-5 h-5 text-sky-600 mb-2" />
                  <dt className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-1">{label}</dt>
                  <dd className="text-lg font-bold text-slate-900">{value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="relative lg:justify-self-end w-full max-w-md lg:max-w-lg"
          >
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-sky-600" />
                  <span className="text-sm font-bold text-slate-900">Operations Overview</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>

              <div className="p-6 space-y-3">
                {overviewStats.map(({ icon: Icon, label, value, sub }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100"
                  >
                    <div className="w-11 h-11 shrink-0 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500">{label}</p>
                      <p className="text-base font-bold text-slate-900">{value}</p>
                    </div>
                    <span className="ml-auto hidden sm:block text-xs text-slate-500 whitespace-nowrap">{sub}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-blue-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <ClipboardCheck className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-bold leading-tight">Shift checklist</p>
                    <p className="text-xs text-sky-100/90">4 of 4 verifications done</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-white">100%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}