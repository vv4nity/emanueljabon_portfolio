'use client';

import { personal } from '@/data/content';
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowUp } from 'react-icons/fi';

const sitemap = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Stack', href: '/#stack' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/#contact' },
];

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-7xl px-6 pt-20 md:px-10">
      {/* Oversized wordmark */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none select-none text-center font-medium leading-[0.85] tracking-[-0.06em] text-transparent"
          style={{
            fontSize: 'clamp(80px, 18vw, 240px)',
            backgroundImage:
              'linear-gradient(180deg, rgba(245,245,247,0.10) 0%, rgba(245,245,247,0.02) 60%, transparent 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          {personal.name}
        </div>

        {/* Floating availability pill, overlapping wordmark */}
        <div className="absolute inset-x-0 -bottom-2 flex justify-center md:-bottom-3">
          <div className="inline-flex items-center gap-2.5 rounded-full border-[0.5px] border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-text backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute -inset-[3px] animate-pulse-ring rounded-full bg-signal opacity-25" />
              <span className="relative h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_#5EFFAA]" />
            </span>
            {personal.availability}
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mt-14 grid gap-10 border-t border-white/[0.08] pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand / blurb */}
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg border-[0.5px] border-white/15 font-mono text-[12px] font-medium text-text"
              style={{
                background:
                  'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
              }}
            >
              {personal.initials}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium text-text">{personal.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                {personal.role}
              </span>
            </div>
          </div>
          <p className="max-w-xs text-[13px] leading-[1.6] text-text-dim">
            Engineering intelligent software at the intersection of ML systems and beautifully crafted interfaces.
          </p>
        </div>

        {/* Sitemap */}
        <div>
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
            Sitemap
          </div>
          <ul className="space-y-2.5">
            {sitemap.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-[13px] text-text-dim transition-colors hover:text-text"
                >
                  <span className="h-px w-2 bg-white/20 transition-all group-hover:w-4 group-hover:bg-white/60" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Elsewhere */}
        <div>
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
            Elsewhere
          </div>
          <ul className="space-y-2.5">
            {[
              { icon: FiGithub, href: personal.github, label: 'GitHub' },
              { icon: FiLinkedin, href: personal.linkedin, label: 'LinkedIn' },
              { icon: FiInstagram, href: personal.instagram, label: 'Instagram' },
              { icon: FiMail, href: `mailto:${personal.email}`, label: 'Email' },
            ].map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 text-[13px] text-text-dim transition-colors hover:text-text"
                >
                  <s.icon size={13} />
                  {s.label}
                  <span className="text-[10px] text-text-faint transition-transform group-hover:translate-x-0.5">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Colophon */}
        <div>
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
            Colophon
          </div>
          <ul className="space-y-2.5 text-[13px] text-text-dim">
            <li className="flex justify-between gap-3">
              <span className="text-text-faint">Stack</span>
              <span>Next · TS · Tailwind</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-text-faint">Type</span>
              <span>Inter · JetBrains · Instrument</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-text-faint">Based in</span>
              <span>{personal.location}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-text-faint">Local</span>
              <span>{personal.timezone}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] py-6 md:flex-row">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
          <span>© {new Date().getFullYear()} {personal.name}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-white/25" />
          <span>All systems nominal</span>
        </div>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 rounded-full border-[0.5px] border-white/15 bg-white/[0.03] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-text"
        >
          <FiArrowUp size={11} className="transition-transform group-hover:-translate-y-0.5" />
          Back to top
        </a>
      </div>
    </footer>
  );
}
