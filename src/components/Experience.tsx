'use client';

import { motion } from 'framer-motion';
import { TbUsersGroup } from 'react-icons/tb';
import { experience, organizations } from '@/data/content';

function initialsFrom(org: string) {
  return org
    .replace(/[—–-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export function Experience() {
  return (
    <section id="experience" className="relative py-14 md:py-24">
      <div className="mb-10">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          005 — Experience
        </div>
        <h2 className="text-[32px] font-medium tracking-[-0.03em] text-text md:text-[40px]">
          Where I&apos;ve <span className="font-serif italic font-normal gradient-text-2">been</span>.
        </h2>
      </div>

      <div className="relative">
        {/* Timeline rail */}
        <div
          className="absolute bottom-0 left-3 top-0 hidden w-px md:block"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 8%, rgba(255,255,255,0.12) 92%, transparent)',
          }}
        />

        <div className="space-y-6 md:space-y-8">
          {experience.map((exp, i) => (
            <motion.div
              key={`${exp.role}-${exp.org}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative md:pl-14"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-7 hidden h-6 w-6 items-center justify-center md:flex">
                <span
                  className="absolute h-6 w-6 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(193,123,232,0.35), transparent 70%)',
                  }}
                />
                <span
                  className="relative h-2.5 w-2.5 rounded-full ring-2 ring-bg"
                  style={{
                    background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                    boxShadow: '0 0 14px rgba(193,123,232,0.7)',
                  }}
                />
              </div>

              {/* Card */}
              <div
                className="group relative overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl transition-all hover:-translate-y-0.5 hover:border-white/15"
              >
                {/* Accent ribbon glow */}
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background:
                      i % 2 === 0
                        ? 'radial-gradient(circle, rgba(193,123,232,0.45), transparent 70%)'
                        : 'radial-gradient(circle, rgba(96,128,255,0.45), transparent 70%)',
                  }}
                />

                {/* Top hairline that animates in on hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                  <div
                    className="h-full w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(193,123,232,0.7) 30%, rgba(96,128,255,0.7) 70%, transparent)',
                    }}
                  />
                </div>

                {/* Big faded index */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-6 top-2 select-none font-medium leading-none tracking-[-0.04em] text-white/[0.04] md:right-8 md:top-2"
                  style={{ fontSize: 'clamp(80px, 9vw, 140px)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative p-6 md:p-7">
                  {/* Header */}
                  <div className="mb-5 flex items-start gap-4">
                    {/* Company logo / monogram */}
                    <div
                      className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-md text-[13px] font-semibold text-white"
                      style={{
                        background: exp.logo
                          ? 'transparent'
                          : i % 2 === 0
                            ? 'linear-gradient(135deg, rgba(193,123,232,0.55), rgba(96,128,255,0.55))'
                            : 'linear-gradient(135deg, rgba(96,128,255,0.55), rgba(193,123,232,0.55))',
                        boxShadow: exp.logo ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.18)',
                      }}
                    >
                      {exp.logo ? (
                        <img
                          src={exp.logo}
                          alt={`${exp.org} logo`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        initialsFrom(exp.org)
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-[18px] font-medium tracking-[-0.01em] text-text md:text-[19px]">
                          {exp.role}
                        </h3>
                        <span className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                            }}
                          />
                          {exp.period}
                        </span>
                      </div>
                      <div className="text-[13px] font-medium text-text-dim">
                        <span className="gradient-text-2">{exp.org}</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="mb-5 h-px w-full"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
                    }}
                  />

                  {/* Description */}
                  <p className="mb-4 text-[14px] leading-[1.65] text-text-dim">
                    {exp.description}
                  </p>

                  {/* Highlights */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-2">
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3 text-[13px] leading-[1.6] text-text-dim">
                          <span
                            className="mt-[7px] inline-block h-1.5 w-1.5 flex-shrink-0 rotate-45"
                            style={{
                              background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                              boxShadow: '0 0 8px rgba(193,123,232,0.6)',
                            }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Organizations sub-section */}
      <div className="mt-20 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint"
        >
          <TbUsersGroup size={13} />
          <span>Organizations</span>
          <span
            className="h-px flex-1"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.18), transparent)',
            }}
          />
        </motion.div>

        <div className="grid gap-3 md:grid-cols-3">
          {organizations.map((org, i) => {
            const initials = org.name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join('');
            const even = i % 2 === 0;
            return (
              <motion.a
                key={org.name + i}
                {...(org.link
                  ? { href: org.link, target: '_blank', rel: 'noreferrer' }
                  : {})}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-2xl transition-all hover:border-white/15 ${
                  org.link ? 'hover:-translate-y-0.5' : ''
                }`}
              >
                {/* Accent glow */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background: even
                      ? 'radial-gradient(circle, rgba(193,123,232,0.5), transparent 70%)'
                      : 'radial-gradient(circle, rgba(96,128,255,0.5), transparent 70%)',
                  }}
                />

                {/* Top hairline */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                  <div
                    className="h-full w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(193,123,232,0.6) 30%, rgba(96,128,255,0.6) 70%, transparent)',
                    }}
                  />
                </div>

                <div className="relative flex items-start gap-3">
                  {/* Logo / monogram */}
                  <div
                    className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-[0.5px] border-white/15 text-[12px] font-semibold text-white"
                    style={{
                      background: org.logo
                        ? org.logoBg ?? 'transparent'
                        : even
                          ? 'linear-gradient(135deg, rgba(193,123,232,0.55), rgba(96,128,255,0.55))'
                          : 'linear-gradient(135deg, rgba(96,128,255,0.55), rgba(193,123,232,0.55))',
                      boxShadow: org.logo ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.18)',
                    }}
                  >
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={`${org.name} logo`}
                        className={`absolute inset-0 h-full w-full ${org.logoBg ? 'object-contain p-1' : 'object-cover'}`}
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h3 className="truncate text-[15px] font-medium tracking-[-0.01em] text-text">
                        {org.name}
                      </h3>
                      {org.category && (
                        <span className="rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-text-faint">
                          {org.category}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] font-medium text-text-dim">
                      {org.role}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                      {org.period}
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
