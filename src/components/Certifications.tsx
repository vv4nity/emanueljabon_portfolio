'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  { src: '/aws.png', alt: 'Amazon Web Services' },
  { src: '/Cisco_logo_blue_2016.svg', alt: 'Cisco' },
  { src: '/Google-Logo.wine.svg', alt: 'Google' },
  { src: '/udemy.png', alt: 'Udemy' },
];

export function Certifications() {
  return (
    <section id="certifications" className="relative py-14 md:py-24">
      <div className="mb-10">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          006 — Certifications
        </div>
        <h2 className="text-[32px] font-medium tracking-[-0.03em] text-text md:text-[40px]">
          Continuously <span className="font-serif italic font-normal gradient-text-2">learning</span>.
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl"
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(193,123,232,0.55), transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(96,128,255,0.5), transparent 70%)',
          }}
        />

        {/* Top hairline */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(193,123,232,0.5) 30%, rgba(96,128,255,0.5) 70%, transparent)',
          }}
        />

        {/* Logo strip */}
        <div className="relative grid grid-cols-2 md:grid-cols-4">
          {LOGOS.map((logo, i) => (
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className={`flex h-28 items-center justify-center px-6 md:h-32 ${
                i < LOGOS.length - 1
                  ? 'border-b border-white/[0.06] md:border-b-0 md:border-r'
                  : ''
              } ${i % 2 === 0 ? 'border-r md:border-r' : ''} ${
                i < LOGOS.length - 2 ? 'border-b md:border-b-0' : ''
              }`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 w-auto max-w-[140px] object-contain opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:h-12"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
