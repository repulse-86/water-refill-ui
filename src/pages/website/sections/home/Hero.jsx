import { ArrowRight } from 'lucide-react';
import useAuthModalStore from '../../../../store/authModalStore';

export default function Hero() {
  const openAuth = useAuthModalStore((state) => state.openAuth);

  return (
    <section className="bg-white border-b border-slate-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Water Refilling Station Management Terminal
          </h1>
          <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed">
            All-in-one single-owner gateway for store operations, point-of-sale transactions,
            delivery order tracking, customer dual-asset ledgers, and daily meter shift audits.
            Access to operational metrics and ledgers requires authenticated credentials.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openAuth}
              className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded text-sm font-semibold transition-colors"
            >
              Launch Operations Console
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}