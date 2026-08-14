import { Loader2 } from 'lucide-react';
import { isValidElement, cloneElement } from 'react';
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

function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
  }
  return { ...slotProps, ...overrideProps };
}

export default function Button({
  variant,
  asChild = false,
  isLoading = false,
  children,
  className,
  ...props
}) {
  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error(
        'Button asChild requires a single React element child. ' +
          'Pass a single element to Button when using asChild.'
      );
    }
    const mergedClassName = cn(buttonVariants({ variant }), className, children.props.className);
    const mergedProps = mergeProps({ ...props, className: mergedClassName }, children.props);
    return cloneElement(children, mergedProps);
  }

  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {isLoading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
      {children}
    </button>
  );
}