import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva('inline-block px-2 py-0.5 rounded text-xs font-medium border', {
  variants: {
    variant: {
      blue: 'bg-sky-50 text-sky-700 border-sky-200',
      slate: 'bg-slate-100 text-slate-600 border-slate-200',
      violet: 'bg-violet-50 text-violet-700 border-violet-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      green: 'bg-green-50 text-green-700 border-green-200',
    },
  },
  defaultVariants: {
    variant: 'slate',
  },
});

export default function Badge({ children, variant, className }) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}