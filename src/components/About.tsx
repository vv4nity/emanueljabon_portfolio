'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TbMapPin,
  TbBuildingArch,
  TbAward,
  TbBrain,
  TbCertificate,
  TbLanguage,
  TbCircleCheck,
} from 'react-icons/tb';
import { FiArrowUpRight } from 'react-icons/fi';
import { personal } from '@/data/content';

const FACTS = [
  { icon: TbMapPin, label: 'Based in', value: 'Manila, PH' },
  { icon: TbBuildingArch, label: 'University', value: 'PUP — Sta. Mesa' },
  { icon: TbAward, label: 'Degree', value: 'BS Computer Engineering' },
  { icon: TbBrain, label: 'Focus', value: 'System Dev · AI/ML' },
  { icon: TbCertificate, label: 'Certification', value: 'CCNA — Cisco' },
  { icon: TbLanguage, label: 'Languages', value: 'EN · FIL' },
  { icon: TbCircleCheck, label: 'Available', value: 'Open to roles' },
];

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
            I&apos;m a Computer Engineer from the{' '}
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

        {/* Quick Facts card */}
        <div className="group relative overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl transition-colors hover:border-white/15">
          {/* Accent ribbon glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
            style={{
              background:
                'radial-gradient(circle, rgba(193,123,232,0.5), transparent 70%)',
            }}
          />

          {/* Top hairline */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
            <div
              className="h-full w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(193,123,232,0.7) 30%, rgba(96,128,255,0.7) 70%, transparent)',
              }}
            />
          </div>

          {/* Corner ticks */}
          <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-[0.5px] border-t-[0.5px] border-white/30" />
          <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-[0.5px] border-t-[0.5px] border-white/30" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-[0.5px] border-l-[0.5px] border-white/30" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-[0.5px] border-r-[0.5px] border-white/30" />

          <div className="relative p-6 md:p-7">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-white/10 text-[11px] font-semibold text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(193,123,232,0.55), rgba(96,128,255,0.55))',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                  }}
                >
                  {personal.initials}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                  Quick facts
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-text-dim">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute -inset-[3px] animate-pulse-ring rounded-full bg-signal opacity-30" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#5EFFAA]" />
                </span>
                Live
              </span>
            </div>

            {/* Divider */}
            <div
              className="mb-4 h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)',
              }}
            />

            {/* Facts list */}
            <dl className="space-y-3.5 text-[13px]">
              {FACTS.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <dt className="flex items-center gap-2.5 text-text-faint">
                      <Icon size={13} className="text-text-dim" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                        {f.label}
                      </span>
                    </dt>
                    <dd className="text-right text-[12.5px] font-medium tracking-tight text-text">
                      {f.value}
                    </dd>
                  </div>
                );
              })}
            </dl>

            {/* Footer divider */}
            <div
              className="mb-4 mt-5 h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
              }}
            />

            {/* CV link */}
            <Link
              href={personal.cvUrl}
              className="group/cv flex items-center justify-between rounded-xl border-[0.5px] border-white/10 bg-white/[0.02] px-3.5 py-3 transition-all hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-medium text-text">
                  View full CV
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-text-faint">
                  PDF · Updated {personal.cvUpdated}
                </span>
              </div>
              <FiArrowUpRight
                size={16}
                className="text-text-dim transition-transform group-hover/cv:-translate-y-0.5 group-hover/cv:translate-x-0.5 group-hover/cv:text-text"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
