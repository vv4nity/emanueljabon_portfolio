'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  { src: '/aws.png', alt: 'Amazon Web Services', scale: 1 },
  { src: '/Cisco_logo_blue_2016.svg', alt: 'Cisco', scale: 1 },
  { src: '/Google-Logo.wine.svg', alt: 'Google', scale: 1.85 },
  { src: '/udemy.png', alt: 'Udemy', scale: 1 },
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

      {/* Transparent inline logo strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-4 items-center gap-x-4 gap-y-6 md:gap-x-10"
      >
        {LOGOS.map((logo, i) => (
          <motion.div
            key={logo.alt}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            className="flex h-16 items-center justify-center md:h-24"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="w-auto object-contain opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
              style={{ height: `${2.25 * logo.scale}rem`, maxWidth: '100%' }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
