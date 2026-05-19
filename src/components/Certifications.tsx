'use client';

import { motion } from 'framer-motion';

type Certification = {
  name: string;
  issuer: string;
  badge: string;
};

const CERTIFICATIONS: Certification[] = [
  { name: 'CCNA', issuer: 'Cisco · Networks', badge: '/cert-ccna.png' },
  { name: 'AI Essentials', issuer: 'Google', badge: '/cert-google-ai.png' },
  { name: 'AWS', issuer: 'Amazon Web Services', badge: '/cert-aws.png' },
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
        className="group relative overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl"
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

        {/* Small caption */}
        <div className="relative flex justify-center pt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
            Earned credentials
          </span>
        </div>

        {/* Row of certs */}
        <div className="relative grid grid-cols-1 md:grid-cols-3">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className={`relative flex items-center justify-center gap-4 px-6 py-8 md:py-10 ${
                i < CERTIFICATIONS.length - 1
                  ? 'border-b border-white/[0.06] md:border-b-0 md:border-r'
                  : ''
              }`}
            >
              {/* Badge */}
              <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
                <img
                  src={cert.badge}
                  alt={`${cert.name} badge`}
                  className="h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col leading-tight">
                <span className="text-[18px] font-medium tracking-[-0.01em] text-text md:text-[19px]">
                  {cert.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                  {cert.issuer}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
