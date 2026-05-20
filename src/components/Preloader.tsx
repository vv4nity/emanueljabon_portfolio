'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { personal } from '@/data/content';

const LOAD_MS = 1300;
const FADE_MS = 600;

export function Preloader() {
  const [stage, setStage] = useState<'loading' | 'fading' | 'done'>('loading');

  // Pin to top + lock scroll while visible
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  // Drive the stage timeline
  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setStage('fading'), LOAD_MS);
    const doneTimer = window.setTimeout(() => {
      setStage('done');
      // Signal to the rest of the app that the entrance animations can start
      (window as unknown as { __bootReady?: boolean }).__bootReady = true;
      window.dispatchEvent(new CustomEvent('app:boot-ready'));
    }, LOAD_MS + FADE_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === 'fading' ? 0 : 1 }}
          transition={{ duration: FADE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: '#050507' }}
        >
          {/* Soft brand glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute h-[460px] w-[460px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(193,123,232,0.18), rgba(96,128,255,0.08) 45%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Monogram with shimmer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-[0.5px] border-white/15 text-[18px] font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                boxShadow:
                  '0 14px 40px -8px rgba(127,80,220,0.55), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              {personal.initials}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                }}
                initial={{ x: '-160%' }}
                animate={{ x: '360%' }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Thin progress bar */}
            <div className="relative mt-7 h-[1.5px] w-[160px] overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="absolute inset-y-0 left-0 origin-left"
                style={{
                  background: 'linear-gradient(90deg, #C17BE8, #6080FF)',
                  boxShadow: '0 0 10px rgba(193,123,232,0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: (LOAD_MS - 200) / 1000,
                  delay: 0.2,
                  ease: [0.45, 0, 0.25, 1],
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
