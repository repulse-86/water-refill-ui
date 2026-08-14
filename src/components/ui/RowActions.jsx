import * as Popover from '@radix-ui/react-popover';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

const actionStyles = {
  primary: 'text-sky-600 hover:bg-sky-50',
  edit: 'text-slate-700 hover:bg-slate-50',
  danger: 'text-red-600 hover:bg-red-50',
};

export default function RowActions({ actions }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Row actions"
          className="inline-flex items-center justify-center w-7 h-7 rounded border border-slate-300 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-40 bg-white border border-slate-200 rounded shadow-lg p-1"
        >
          {actions.map((action) => (
            <Popover.Close key={action.label} asChild>
              <button
                type="button"
                disabled={action.disabled}
                onClick={() => action.onClick()}
                className={cn(
                  'flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed',
                  actionStyles[action.variant] ?? actionStyles.edit
                )}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            </Popover.Close>
          ))}
          <Popover.Arrow className="fill-slate-200" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}