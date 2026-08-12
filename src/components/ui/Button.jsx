import { Loader2 } from 'lucide-react';

const baseClasses =
  'inline-flex items-center justify-center rounded text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2';

const variants = {
  primary: 'bg-sky-600 hover:bg-sky-700 text-white',
  secondary: 'border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium',
};

export default function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {isLoading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
      {children}
    </button>
  );
}
