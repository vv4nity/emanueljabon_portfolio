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
            I&apos;m a computer engineer from the{' '}
            <span className="text-text">Polytechnic University of the Philippines</span>,
            majoring in System Development. Based in Manila, building across full-stack apps,
            backend services, and AI-driven systems.
          </p>
          <p>
            Most of my work sits between{' '}
            <span className="text-text">system development</span> and{' '}
            <span className="text-text">applied AI/ML</span> — services that need to stay up,
            models that need to actually run in front of real users. I care about clean
            architecture, the unglamorous parts of shipping, and writing code that the next
            person on the project doesn&apos;t hate inheriting.
          </p>
          <p>
            I&apos;m drawn to the intersection of the two — using ML to make systems smarter,
            and bringing system-development discipline to the way ML actually runs in
            production. I&apos;m looking for full-time roles where I can keep building in
            that space alongside thoughtful, ambitious people.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
            Quick facts
          </div>
          <dl className="space-y-3 text-[13px]">
            {[
              ['Based in', 'Manila, PH'],
              ['University', 'PUP — Sta. Mesa'],
              ['Degree', 'BS Computer Engineering'],
              ['Focus', 'System Dev · AI/ML'],
              ['Certification', 'CCNA — Cisco'],
              ['Languages', 'EN · FIL'],
              ['Available', 'Open to roles'],
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
