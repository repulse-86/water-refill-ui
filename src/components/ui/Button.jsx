import { Loader2 } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2',
  {
    variants: {
      variant: {
        primary: 'bg-sky-600 hover:bg-sky-700 text-white',
        secondary: 'border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export default function Button({
  variant,
  isLoading = false,
  children,
  className,
  ...props
}) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {isLoading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
      {children}
    </button>
  );
}