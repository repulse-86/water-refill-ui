import { Children, cloneElement } from 'react';
import { CircleAlert } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva(
  'w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2',
  {
    variants: {
      hasError: {
        true: 'border-red-400 focus:ring-red-500 focus:border-red-500',
        false: 'border-slate-300 focus:ring-sky-500 focus:border-sky-500',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

export default function FormField({ label, htmlFor, error, children }) {
  const errorText = Array.isArray(error) ? error[0] : error;
  const hasError = Boolean(errorText);
  const child = Children.only(children);

  const childProps = {
    ...child.props,
    id: child.props.id ?? htmlFor,
    'aria-invalid': hasError,
    className: cn(inputVariants({ hasError }), child.props.className),
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
      )}
      {cloneElement(child, childProps)}
      {hasError && (
        <p className="mt-1.5 flex items-start gap-1 text-xs text-red-600">
          <CircleAlert className="w-3.5 h-3.5 shrink-0" />
          <span>{errorText}</span>
        </p>
      )}
    </div>
  );
}