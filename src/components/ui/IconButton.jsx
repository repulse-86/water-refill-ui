import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const iconButtonVariants = cva('p-1.5 rounded transition-colors', {
  variants: {
    variant: {
      default: 'text-slate-500 hover:bg-slate-50',
      edit: 'text-slate-500 hover:text-sky-600 hover:bg-sky-50',
      danger: 'text-slate-500 hover:text-red-600 hover:bg-red-50',
      primary: 'text-sky-600 hover:bg-sky-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function IconButton({ icon: Icon, onClick, title, variant, className }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(iconButtonVariants({ variant }), className)}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}