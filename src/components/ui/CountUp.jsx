import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CountUp({
  end,
  start = 0,
  decimals = 0,
  duration = 1.2,
  formatter,
  className,
}) {
  const ref = useRef(null);
  const state = useRef({ val: typeof start === 'number' ? start : Number(start) });
  const numericEnd = typeof end === 'number' ? end : Number(end);

  const canAnimate = Number.isFinite(numericEnd);

  useEffect(() => {
    if (!canAnimate) return;

    const obj = state.current;
    obj.val = typeof start === 'number' ? start : Number(start);
    const tween = gsap.to(obj, {
      val: numericEnd,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = formatter ? formatter(obj.val) : obj.val.toFixed(decimals);
        }
      },
    });
    return () => tween.kill();
  }, [numericEnd, canAnimate, start, decimals, duration, formatter]);

  const initialValue = typeof start === 'number' ? start : Number(start);
  const initialText = formatter ? formatter(initialValue) : (Number.isFinite(initialValue) ? initialValue.toFixed(decimals) : String(initialValue));

  if (!canAnimate) {
    return <span ref={ref} className={className}>{String(end)}</span>;
  }

  return <span ref={ref} className={className}>{initialText}</span>;
}
