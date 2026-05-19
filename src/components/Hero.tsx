'use client';

import { motion } from 'framer-motion';
import { hero, personal, metrics } from '@/data/content';
import { CountUp } from './CountUp';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-28 md:pb-24">
      <div className="grid items-center gap-16 md:grid-cols-[1.3fr_1fr] md:gap-14">
        {/* Left: text */}
        <div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0 }}
            className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint"
          >
            <span>001 — Introduction</span>
            <span
              className="h-px max-w-[180px] flex-1"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)',
              }}
            />
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border-[0.5px] border-white/15 bg-white/[0.04] py-1.5 pl-2.5 pr-3.5 text-[12px] text-text backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute -inset-[3px] animate-pulse-ring rounded-full bg-signal opacity-25" />
              <span className="relative h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_#5EFFAA]" />
            </span>
            {personal.availability}
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-7 font-medium leading-[1.02] tracking-[-0.045em] text-text"
            style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}
          >
            {hero.line1}
            <br />
            <span className="font-serif italic font-normal gradient-text" style={{ letterSpacing: '-0.02em' }}>
              {hero.italicWord}
            </span>{' '}
            {hero.line2Rest}
            <br />
            <span className="text-text-faint">{hero.closer}</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 max-w-[480px] text-[16px] leading-[1.6] text-text-dim md:text-[17px]"
          >
            {hero.lede}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2.5 rounded-full bg-text px-6 py-3.5 text-[13px] font-medium text-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
            >
              View selected work
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-bg text-[11px] text-text" style={{ width: '22px', height: '22px' }}>
                →
              </span>
            </a>
            <a
              href="#about"
              className="rounded-full border-[0.5px] border-white/15 bg-white/[0.04] px-6 py-3.5 text-[13px] font-medium text-text backdrop-blur-md transition-all hover:bg-white/[0.08]"
            >
              Read about me
            </a>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-5 font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint"
          >
            {hero.credentials.map((cred, i) => (
              <span key={cred} className="flex items-center gap-5">
                {cred}
                {i < hero.credentials.length - 1 && (
                  <span className="h-[3px] w-[3px] rounded-full bg-white/25" />
                )}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Corner ticks */}
          <div className="pointer-events-none absolute -left-2.5 -top-2.5 h-5 w-5 border-l-[0.5px] border-t-[0.5px] border-white/35" />
          <div className="pointer-events-none absolute -right-2.5 -top-2.5 h-5 w-5 border-r-[0.5px] border-t-[0.5px] border-white/35" />
          <div className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-5 w-5 border-b-[0.5px] border-l-[0.5px] border-white/35" />
          <div className="pointer-events-none absolute -bottom-2.5 -right-2.5 h-5 w-5 border-b-[0.5px] border-r-[0.5px] border-white/35" />

          <div
            className="relative aspect-[4/5] overflow-hidden rounded-md"
            style={{
              background: 'linear-gradient(135deg, #C17BE8 0%, #9080F0 45%, #6080FF 100%)',
              boxShadow: '0 60px 120px -30px rgba(127,80,220,0.5), 0 0 0 0.5px rgba(255,255,255,0.1) inset',
            }}
          >
            {/* Fallback gradient glows (visible until photo loads) */}
            <div
              className="pointer-events-none absolute -left-10 -top-10 h-72 w-72"
              style={{ background: 'radial-gradient(circle, rgba(232,123,200,0.7), transparent 70%)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80"
              style={{ background: 'radial-gradient(circle, rgba(96,128,255,0.6), transparent 70%)' }}
            />

            {/* Your photo */}
            <img
              src={personal.photoUrl}
              alt={personal.name}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Metadata overlays */}
            <div className="absolute left-3.5 top-3.5 rounded border-[0.5px] border-white/15 bg-black/55 px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.15em] text-white/95 backdrop-blur-md">
              Portrait · MMXXVI
            </div>
            <div className="absolute bottom-3.5 right-3.5 rounded border-[0.5px] border-white/15 bg-black/55 px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.15em] text-white/95 backdrop-blur-md">
              f/1.8 · ISO 200
            </div>
          </div>

          {/* Floating signature card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -bottom-6 -left-6 z-10 flex items-center gap-3 rounded-xl border-[0.5px] border-white/15 px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            style={{ background: 'rgba(15,15,28,0.85)' }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-white/15 text-[16px]"
              style={{
                background: 'linear-gradient(135deg, rgba(193,123,232,0.3), rgba(96,128,255,0.3))',
              }}
            >
              ⌘
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-medium text-text">{hero.currentlyBuilding.label}</span>
              <span className="font-mono text-[10px] text-text-dim">{hero.currentlyBuilding.detail}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-20 grid grid-cols-2 border-y border-white/[0.08] py-8 md:mt-24 md:grid-cols-4"
      >
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`px-6 ${i < metrics.length - 1 ? 'md:border-r md:border-white/[0.08]' : ''}`}
          >
            <div
              className="text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums text-text"
            >
              {m.italic ? (
                <span
                  className="font-serif italic gradient-text-2 leading-none"
                  style={{ fontSize: '56px' }}
                >
                  {m.value}
                </span>
              ) : (
                <CountUp value={m.value} duration={1500 + i * 200} />
              )}
              {m.suffix && <span className="text-[22px] text-text-faint">{m.suffix}</span>}
            </div>
            <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
              {m.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
