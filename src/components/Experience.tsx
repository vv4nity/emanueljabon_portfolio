'use client';

import { motion } from 'framer-motion';
import { experience } from '@/data/content';

export function Experience() {
  return (
    <section id="experience" className="relative py-24">
      <div className="mb-10">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          005 — Experience
        </div>
        <h2 className="text-[32px] font-medium tracking-[-0.03em] text-text md:text-[40px]">
          Where I&apos;ve <span className="font-serif italic font-normal gradient-text-2">been</span>.
        </h2>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute bottom-0 left-2 top-0 hidden w-px md:block"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0.15) 90%, transparent)',
          }}
        />

        <div className="space-y-10">
          {experience.map((exp, i) => (
            <motion.div
              key={`${exp.role}-${exp.org}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative md:pl-12"
            >
              {/* Dot */}
              <div className="absolute left-0 top-2 hidden h-4 w-4 items-center justify-center md:flex">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                    boxShadow: '0 0 12px rgba(193,123,232,0.6)',
                  }}
                />
              </div>

              <div className="glass rounded-2xl p-6 md:p-7">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[18px] font-medium text-text">{exp.role}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">
                    {exp.period}
                  </span>
                </div>
                <div className="mb-4 text-[14px] text-text-dim">{exp.org}</div>
                <p className="mb-4 text-[14px] leading-[1.65] text-text-dim">{exp.description}</p>
                {exp.highlights && (
                  <ul className="space-y-1.5">
                    {exp.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-[13px] text-text-dim"
                      >
                        <span
                          className="mt-2 inline-block h-px w-3 flex-shrink-0"
                          style={{ background: 'rgba(193,123,232,0.5)' }}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
