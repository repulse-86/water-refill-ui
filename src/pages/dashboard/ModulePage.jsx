export default function ModulePage({ title = 'Dashboard' }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">{title}</h1>
      <p className="text-sm text-slate-500 mb-8">
        This workspace is under construction.
      </p>

      <div className="bg-white border border-slate-200 rounded p-6 flex items-center justify-center">
        <p className="text-sm text-slate-400">{title} module content will appear here.</p>
      </div>
    </div>
  );
}
