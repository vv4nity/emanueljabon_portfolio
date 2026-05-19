'use client';

import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="mb-10">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          003 — About
        </div>
        <h2 className="text-[32px] font-medium tracking-[-0.03em] text-text md:text-[40px]">
          A bit <span className="font-serif italic font-normal gradient-text-2">about</span> me.
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="grid gap-10 md:grid-cols-[2fr_1fr]"
      >
        <div className="space-y-5 text-[16px] leading-[1.75] text-text-dim">
          <p>
            I&apos;m a computer engineer based in Manila with a deep curiosity for systems
            that learn. I cut my teeth on classical software development before falling into
            machine learning during my third year — and I haven&apos;t looked back since.
          </p>
          <p>
            Most of my recent work sits at the intersection of <span className="text-text">applied ML</span>{' '}
            and <span className="text-text">production engineering</span>: shipping models that actually
            run reliably in front of real users, not just notebooks. I care about latency,
            observability, and the unglamorous parts of MLOps as much as I care about model accuracy.
          </p>
          <p>
            Outside of code, I read papers (mostly NLP and systems), tinker with side projects,
            and write occasionally about what I learn. I&apos;m currently looking for full-time
            opportunities where I can build alongside thoughtful, ambitious teams.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
            Quick facts
          </div>
          <dl className="space-y-3 text-[13px]">
            {[
              ['Based in', 'Manila, PH'],
              ['Degree', 'BS Computer Engineering'],
              ['Focus', 'AI/ML, Full-stack'],
              ['Available', 'Summer 2026'],
              ['Languages', 'EN · FIL'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                <dt className="text-text-faint">{k}</dt>
                <dd className="text-text">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </section>
  );
}
