'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

type Props = {
  value: string;
  duration?: number;
  className?: string;
};

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function CountUp({ value, duration = 1600, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const target = Number(value);
  const isNumeric = Number.isFinite(target);

  const [display, setDisplay] = useState<string>(isNumeric ? '0' : value);

  useEffect(() => {
    if (!isNumeric || !inView) return;

    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(ratio);
      setDisplay(String(Math.round(eased * target)));
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNumeric, target, duration]);

  return (
    <span ref={ref} className={className}>
      {isNumeric ? display : value}
    </span>
  );
}
