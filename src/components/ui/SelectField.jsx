import { useController } from 'react-hook-form';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, CircleAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BaseSelectField({
  value,
  onValueChange,
  options = [],
  placeholder = 'Select…',
  label,
  htmlFor,
  error,
  disabled = false,
  className,
}) {
  const hasError = Boolean(error);

  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <Select.Trigger
          id={htmlFor}
          aria-invalid={hasError}
          className={cn(
            'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left border rounded bg-white focus:outline-none focus:ring-2',
            hasError
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500',
            className
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="z-50 bg-white border border-slate-200 rounded shadow-lg">
            <Select.Viewport>
              <Select.Group>
                {options.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className="relative flex items-center justify-between pl-8 pr-3 py-2 text-sm text-slate-700 cursor-pointer outline-none data-[highlighted]:bg-sky-50 data-[highlighted]:text-sky-700"
                  >
                    <Select.ItemText>{opt.label}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2">
                      <Check className="w-4 h-4 text-sky-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {hasError && (
        <p className="mt-1.5 flex items-start gap-1 text-xs text-red-600">
          <CircleAlert className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default function SelectField({ name, control, rules, onChange, ...props }) {
  const { field, fieldState } = useController({ name, control, rules });

  return (
    <BaseSelectField
      value={field.value ?? ''}
      onValueChange={(value) => {
        field.onChange(value);
        onChange?.(value);
      }}
      error={props.error ?? fieldState.error?.message}
      {...props}
    />
  );
}