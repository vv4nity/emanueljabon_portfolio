'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { personal } from '@/data/content';

const PHASES = [
  { at: 0, label: 'BOOT SEQUENCE INITIATED' },
  { at: 18, label: 'FETCHING TYPEFACES' },
  { at: 38, label: 'COMPILING SHADERS' },
  { at: 58, label: 'HYDRATING INTERFACE' },
  { at: 78, label: 'CALIBRATING MOTION' },
  { at: 96, label: 'READY' },
];

// Gentle ease — slight acceleration in, slight deceleration out, mostly linear in the middle
const EASE_COUNTER = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const [stage, setStage] = useState<'loading' | 'reveal' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(PHASES[0].label);
  const [now, setNow] = useState('');

  // Live timestamp
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Manila',
        }).format(d),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Disable browser scroll restoration and pin to top
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Lock scroll while loading — cleared once stage flips to done
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const html = document.documentElement;
    const body = document.body;
    if (stage === 'done') {
      html.style.overflow = '';
      body.style.overflow = '';
      return;
    }
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
  }, [stage]);

  // Drive progress
  useEffect(() => {
    if (stage !== 'loading') return;
    const duration = 4200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = EASE_COUNTER(ratio);
      const pct = Math.round(eased * 100);
      setProgress(pct);
      const current = [...PHASES].reverse().find((p) => pct >= p.at);
      if (current) setPhase(current.label);
      if (ratio < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setStage('reveal'), 420);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  // After reveal animation completes, unmount
  useEffect(() => {
    if (stage !== 'reveal') return;
    const id = setTimeout(() => setStage('done'), 1300);
    return () => clearTimeout(id);
  }, [stage]);

  if (stage === 'done') return null;

  const counter = String(progress).padStart(3, '0');

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Top half curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: stage === 'reveal' ? '-100%' : 0 }}
        transition={{ duration: 1.1, ease: EASE_CURTAIN }}
        className="absolute inset-x-0 top-0 h-[50vh] pointer-events-auto"
        style={{ background: '#050507' }}
      >
        {/* Top hairline that draws in */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-12 left-6 right-6 h-px md:left-10 md:right-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent)',
            transformOrigin: 'left',
          }}
        />

        {/* Top-left meta */}
        <div className="absolute left-6 top-6 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:left-10 md:top-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute -inset-[3px] animate-pulse-ring rounded-full bg-signal opacity-30" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#5EFFAA]" />
          </span>
          <span>SYSTEM ONLINE</span>
          <span className="hidden h-px w-8 bg-white/15 sm:inline-block" />
          <span className="hidden sm:inline">{personal.location.toUpperCase()}</span>
        </div>

        {/* Top-right meta */}
        <div className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:right-10 md:top-10">
          <span className="tabular-nums">{now}</span>
          <span className="mx-2 text-text-faint/60">·</span>
          <span>{personal.timezone}</span>
        </div>

        {/* Monogram — centered inside the top half */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-[0.5px] border-white/15 text-[20px] font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
              boxShadow:
                '0 20px 60px -10px rgba(127,80,220,0.55), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {personal.initials}
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <motion.span
                aria-hidden
                className="absolute inset-y-0 w-1/3"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                }}
                initial={{ x: '-150%' }}
                animate={{ x: '350%' }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 text-[14px] font-medium tracking-tight text-text"
          >
            {personal.name}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-text-faint"
          >
            {personal.role}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom half curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: stage === 'reveal' ? '100%' : 0 }}
        transition={{ duration: 1.1, ease: EASE_CURTAIN }}
        className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-auto"
        style={{ background: '#050507' }}
      >
        {/* Bottom hairline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-6 right-6 h-px md:left-10 md:right-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent)',
            transformOrigin: 'right',
          }}
        />

        {/* Giant counter */}
        <div className="absolute inset-x-0 top-[8%] flex justify-center px-6 md:px-10">
          <div className="flex items-end">
            <div
              className="font-medium leading-[0.85] tracking-[-0.06em] tabular-nums text-text"
              style={{ fontSize: 'clamp(96px, 16vw, 200px)' }}
            >
              {counter}
            </div>
            <span className="ml-2 mb-2 font-mono text-[12px] uppercase tracking-[0.25em] text-text-faint md:ml-3 md:mb-3">
              / 100
            </span>
          </div>
        </div>

        {/* Phase + progress bar + footer signature */}
        <div className="absolute inset-x-0 bottom-12 flex flex-col items-center px-6 md:bottom-20 md:px-10">
          <div className="mb-5 h-4 font-mono text-[11px] uppercase tracking-[0.3em] text-text-dim">
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                <span className="mr-2 text-text-faint">›</span>
                {phase}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="relative h-[2px] w-full max-w-[420px] overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #C17BE8 0%, #8AA0FF 50%, #6080FF 100%)',
                boxShadow: '0 0 14px rgba(193,123,232,0.55)',
              }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="mt-2 flex w-full max-w-[420px] items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint/70">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>

          <div className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
            <span>{personal.name}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-white/25" />
            <span>{personal.role}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-white/25" />
            <span>v1.0.2</span>
          </div>
        </div>

        {/* Bottom-left filename-style */}
        <div className="absolute left-6 bottom-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:left-10 md:bottom-10">
          /system/boot.run
        </div>

        {/* Bottom-right index */}
        <div className="absolute right-6 bottom-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint md:right-10 md:bottom-10">
          INDEX · 0001
        </div>
      </motion.div>
    </div>
  );
}
