const variants = {
  blue: 'bg-sky-50 text-sky-700 border border-sky-200',
  slate: 'bg-slate-100 text-slate-600 border border-slate-200',
  violet: 'bg-violet-50 text-violet-700 border border-violet-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  green: 'bg-green-50 text-green-700 border border-green-200',
};

export default function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}