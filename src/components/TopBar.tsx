'use client';

import { useEffect, useState } from 'react';
import { personal } from '@/data/content';

export function TopBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat('en-GB', opts).format(now));
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sticky top-0 z-[55] border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint md:px-10">
        <span>PORTFOLIO · MMXXVI</span>
        <span className="hidden items-center sm:flex">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-signal shadow-[0_0_8px_#5EFFAA]" />
          {personal.location.toUpperCase()} · {time || '--:--'} {personal.timezone}
        </span>
        <span>v1.0.2 ↗</span>
      </div>
    </div>
  );
}
