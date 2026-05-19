'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const LABELS: Record<string, { number: string; label: string; accent: string }> = {
  '/': { number: '000', label: 'Home', accent: 'Welcome' },
  '/projects': { number: '002', label: 'Projects', accent: 'Archive' },
  '/cv': { number: '008', label: 'CV', accent: 'Long version' },
};

function infoFor(pathname: string) {
  if (LABELS[pathname]) return LABELS[pathname];
  const slug = pathname.replace(/^\//, '').split('/')[0] || 'Page';
  return { number: '—', label: slug.replace(/-/g, ' '), accent: 'Loading' };
}

export function PageTransition() {
  const pathname = usePathname();
  const prev = useRef(pathname);
  const isFirst = useRef(true);
  const [active, setActive] = useState(false);
  const [info, setInfo] = useState(infoFor(pathname));

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      prev.current = pathname;
      return;
    }
    if (prev.current === pathname) return;
    prev.current = pathname;

    setInfo(infoFor(pathname));
    setActive(true);

    const id = setTimeout(() => setActive(false), 1400);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="page-transition"
          initial={{ y: '100%' }}
          animate={{ y: ['100%', '0%', '0%', '-100%'] }}
          exit={{ y: '-100%' }}
          transition={{
            duration: 1.4,
            times: [0, 0.3, 0.7, 1],
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[180] flex items-center justify-center overflow-hidden"
          style={{ background: '#050507' }}
        >
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(193,123,232,0.22), transparent 60%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="pointer-events-none absolute -right-32 bottom-1/4 h-[420px] w-[420px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(96,128,255,0.2), transparent 60%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Top hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-6 right-6 top-10 h-px md:left-10 md:right-10"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent)',
              transformOrigin: 'left',
            }}
          />
          {/* Bottom hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute bottom-10 left-6 right-6 h-px md:left-10 md:right-10"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent)',
              transformOrigin: 'right',
            }}
          />

          {/* Top-left meta */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:left-10 md:top-10"
          >
            <span className="text-text-faint">›</span> Navigating to
          </motion.div>

          {/* Top-right index */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:right-10 md:top-10"
          >
            {info.number} / {info.accent}
          </motion.div>

          {/* Center label */}
          <div className="relative flex flex-col items-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-medium uppercase leading-[0.85] tracking-[-0.06em] text-text"
              style={{ fontSize: 'clamp(72px, 14vw, 200px)' }}
            >
              {info.label}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-5 font-serif italic gradient-text"
              style={{ fontSize: 'clamp(20px, 2.4vw, 32px)' }}
            >
              {info.accent}.
            </motion.div>
          </div>

          {/* Bottom-left signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:bottom-10 md:left-10"
          >
            EJ · Portfolio
          </motion.div>

          {/* Bottom-right loading line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-6 right-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:bottom-10 md:right-10"
          >
            <span>Loading</span>
            <span className="relative inline-block h-[2px] w-16 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.span
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/2"
                style={{
                  background: 'linear-gradient(90deg, transparent, #C17BE8, #6080FF, transparent)',
                }}
              />
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
