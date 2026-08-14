import { ArrowRight } from 'lucide-react';
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

export default function Hero({ onOpenAuth }) {

  return (
    <section className="bg-white border-b border-slate-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Water Refilling Station Management Terminal
          </motion.h1>
          <motion.p variants={itemVariants} className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed">
            All-in-one single-owner gateway for store operations, point-of-sale transactions,
            delivery order tracking, customer dual-asset ledgers, and daily meter shift audits.
            Access to operational metrics and ledgers requires authenticated credentials.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded text-sm font-semibold transition-colors"
            >
              Launch Operations Console
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}