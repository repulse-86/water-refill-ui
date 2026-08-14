import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import * as Tooltip from '@radix-ui/react-tooltip';

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

export default function IconButton({ icon: Icon, onClick, title, variant, className, ...props }) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={cn(iconButtonVariants({ variant }), className)}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  if (!title) return button;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={4}
          className="z-50 px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-medium shadow"
        >
          {title}
          <Tooltip.Arrow className="fill-slate-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}