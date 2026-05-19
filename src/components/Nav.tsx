'use client';

import Link from 'next/link';
import { personal } from '@/data/content';

const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Stack', href: '/#stack' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/#contact' },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08080f]/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
              boxShadow: '0 6px 20px rgba(127,80,220,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            {personal.initials}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-medium tracking-tight text-text">{personal.name}</span>
            <span className="font-mono text-[10px] tracking-wide text-text-faint">{personal.role}</span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden gap-9 text-[13px] text-text-dim md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <Link
            href={personal.cvUrl}
            target="_blank"
            className="rounded-full border-[0.5px] border-white/15 bg-white/[0.03] px-4 py-2 text-[12px] font-medium text-text-dim transition-all hover:bg-white/10 hover:text-text"
          >
            CV
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border-[0.5px] border-white/[0.18] px-4 py-2 text-[12px] font-medium text-text backdrop-blur-md transition-all hover:brightness-125"
            style={{
              background: 'linear-gradient(135deg, rgba(193,123,232,0.3), rgba(96,128,255,0.3))',
            }}
          >
            Hire me ↗
          </Link>
        </div>
      </div>
    </nav>
  );
}
