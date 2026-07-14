'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiChevronLeft, FiChevronRight, FiUser, FiCalendar } from 'react-icons/fi';
import {
  TbQrcode,
  TbWifiOff,
  TbActivity,
  TbUserCheck,
  TbMail,
  TbShieldLock,
  TbWorld,
} from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { getTool } from '@/lib/toolIcons';

const GITHUB_URL = 'https://github.com/vv4nity/cpe-hardhatting-2026';

const SLIDES = [
  { src: '/showcase/slide-01.webp', cap: 'Coded for the future — the cover' },
  { src: '/showcase/slide-02.webp', cap: 'Four roles, one system — each locked down with Row-Level Security' },
  { src: '/showcase/slide-03.webp', cap: 'The attendee experience — dashboard, digital QR pass, seat map & profile' },
  { src: '/showcase/slide-04.webp', cap: 'Block-president oversight — a live view of the section they supervise' },
  { src: '/showcase/slide-05.webp', cap: 'An offline-resilient door scanner — recognises passes with zero signal' },
  { src: '/showcase/slide-06.webp', cap: 'The organizer command center — turnout, live chart & activity feed' },
  { src: '/showcase/slide-07.webp', cap: 'Full event administration — seating, invitations, briefings & export' },
  { src: '/showcase/slide-08.webp', cap: 'Branded, end-to-end — invitation & check-in emails' },
  { src: '/showcase/slide-09.webp', cap: 'Invite-only onboarding with rate-limited self-service recovery' },
  { src: '/showcase/slide-10.webp', cap: 'Engineered to hold up — the tech under the hood' },
];

const TECH = ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel'];

const STATS = [
  { value: '382', label: 'Attendees' },
  { value: '8', label: 'Class blocks' },
  { value: '4', label: 'Roles' },
  { value: '0', label: 'Lines at the door', italic: true },
];

const FEATURES: { icon: IconType; t: string; d: string }[] = [
  {
    icon: TbQrcode,
    t: 'Personal digital QR pass',
    d: 'Every attendee gets a QR ticket rendered client-side to a high-res PNG they can save — works offline once on the phone.',
  },
  {
    icon: TbWifiOff,
    t: 'Offline-first door scanner',
    d: 'The roster loads into memory at sign-in, so check-ins work with no signal and sync automatically (on reconnect, every 20s, and after each successful scan).',
  },
  {
    icon: TbActivity,
    t: 'Realtime command center',
    d: 'Organizers watch turnout, a live check-in chart, an activity feed and per-block stats update the instant a pass is scanned — via Supabase Realtime.',
  },
  {
    icon: TbUserCheck,
    t: 'Invite-only onboarding',
    d: 'Attendees never self-register; activation verifies identity against the official class directory, with admin-approved, rate-limited recovery flows.',
  },
  {
    icon: TbMail,
    t: 'Branded transactional email',
    d: 'Premium invitation and instant check-in emails — event cover, details and dress code — sent over Gmail SMTP.',
  },
  {
    icon: TbShieldLock,
    t: 'Locked-down access',
    d: 'Four roles (Attendee, Block President, Scanner, Admin), each seeing only what they should, enforced with Postgres Row-Level Security.',
  },
];

const META: { icon: IconType; label: string; value: string }[] = [
  { icon: FiUser, label: 'Role', value: 'Solo — Design & Engineering' },
  { icon: TbWorld, label: 'Type', value: 'Full-stack web app' },
  { icon: FiCalendar, label: 'Event', value: 'PUP CpE · July 2026' },
];

function SectionHeader({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
        <span>{number}</span>
        <span
          className="h-px max-w-[180px] flex-1"
          style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }}
        />
      </div>
      <h2
        className="font-medium tracking-[-0.02em] text-text"
        style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}
      >
        {children}
      </h2>
    </div>
  );
}

export default function HardhattingCaseStudy() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const touchX = useRef<number | null>(null);
  const n = SLIDES.length;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setI((p) => (p + d + n) % n);
    },
    [n]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  return (
    <div className="mx-auto max-w-5xl">
      {/* HERO */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          <span>Case study — Full-stack web app</span>
          <span
            className="h-px max-w-[180px] flex-1"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }}
          />
        </div>

        <h1
          className="font-medium leading-[1.05] tracking-[-0.04em] text-text"
          style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}
        >
          CPE Hardhatting{' '}
          <span className="font-serif italic font-normal gradient-text">2026</span>
        </h1>

        <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-text-dim md:text-[17px]">
          The attendance &amp; QR-seating platform I designed and built for the PUP Computer
          Engineering Hardhatting Ceremony — reserved seats, personal QR passes, offline
          door-scanning, and a live organizer command center.
        </p>

        {/* Meta */}
        <div className="mt-8 flex flex-wrap gap-3">
          {META.map((m) => (
            <div
              key={m.label}
              className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
                }}
              >
                <m.icon size={15} className="text-accent-soft" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                  {m.label}
                </div>
                <div className="text-[13px] font-medium text-text">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mt-7 flex flex-wrap gap-3">
          <motion.a
            whileHover={{ y: -1 }}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-[0.5px] border-white/25 px-5 py-3 text-[14px] font-medium text-text transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(193,123,232,0.6)]"
            style={{
              background: 'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
            }}
          >
            <FiGithub size={15} />
            View on GitHub
          </motion.a>
        </div>

        {/* Tech pills */}
        <div className="mt-8 flex flex-wrap gap-1.5">
          {TECH.map((t) => {
            const tool = getTool(t);
            const TagIcon = tool.icon;
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded border-[0.5px] border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-wide text-text-dim"
              >
                <TagIcon size={11} style={{ color: tool.color }} />
                {t}
              </span>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <div
                className={`gradient-text-2 text-[28px] tracking-[-0.02em] ${
                  s.italic ? 'font-serif italic' : 'font-medium'
                }`}
              >
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.header>

      {/* CAROUSEL */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-20"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="glass flex h-11 w-11 flex-none items-center justify-center rounded-full text-text transition-colors hover:border-white/25 md:h-12 md:w-12"
          >
            <FiChevronLeft size={20} />
          </motion.button>

          <div
            className="relative flex-1 overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-bg-2"
            style={{ aspectRatio: '4/5', boxShadow: '0 30px 80px -30px rgba(193,123,232,0.3)' }}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.img
                key={SLIDES[i].src}
                src={SLIDES[i].src}
                alt={SLIDES[i].cap}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -40, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute right-3 top-3 z-10 rounded border-[0.5px] border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-white backdrop-blur-md">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go(1)}
            aria-label="Next slide"
            className="glass flex h-11 w-11 flex-none items-center justify-center rounded-full text-text transition-colors hover:border-white/25 md:h-12 md:w-12"
          >
            <FiChevronRight size={20} />
          </motion.button>
        </div>

        <p className="mx-auto mt-5 max-w-xl text-center text-[14px] text-text-dim">
          <span className="font-mono text-accent-soft">{String(i + 1).padStart(2, '0')}</span> ·{' '}
          {SLIDES[i].cap}
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDir(idx > i ? 1 : -1);
                setI(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className="h-[9px] rounded-full transition-all duration-200"
              style={{
                width: idx === i ? 24 : 9,
                background:
                  idx === i
                    ? 'linear-gradient(90deg, #C17BE8, #6080FF)'
                    : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* BRIEF */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-24"
      >
        <SectionHeader number="01 — Context">The brief</SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          A graduation-style ceremony with hundreds of attendees, assigned seating, and a venue
          with unreliable signal. Attendance had to be fast at the door, seats had to be findable,
          and organizers needed to see turnout live — all without anyone standing in a line or
          ticking names off a printed list.
        </p>
      </motion.section>

      {/* FEATURES */}
      <section className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader number="02 — Features">
            What I <span className="font-serif italic font-normal gradient-text">built</span>
          </SectionHeader>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              className="group glass rounded-3xl p-6 transition-all hover:-translate-y-1 hover:border-white/15"
            >
              <span
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
                }}
              >
                <f.icon size={20} className="text-accent-soft" />
              </span>
              <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{f.t}</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-text-dim">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* UNDER THE HOOD */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-24 border-t-[0.5px] border-white/[0.08] pt-12"
      >
        <SectionHeader number="03 — Stack">Under the hood</SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          Built with Next.js 16 (App Router, Turbopack), React 19 and TypeScript, styled with
          Tailwind CSS v4, and backed by Supabase (Postgres · Auth · Realtime · Row-Level
          Security). Offline resilience is handled with an in-memory roster and a localStorage
          sync queue; the QR pass is rendered entirely client-side via canvas. Deployed on Vercel.
        </p>
        <div className="mt-7">
          <motion.a
            whileHover={{ y: -1 }}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-[0.5px] border-white/25 px-5 py-3 text-[14px] font-medium text-text transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(193,123,232,0.6)]"
            style={{
              background: 'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
            }}
          >
            <FiGithub size={15} />
            Explore the code
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
