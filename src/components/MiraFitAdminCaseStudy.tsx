'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiArrowUpRight } from 'react-icons/fi';
import {
  TbStack2,
  TbCircleCheck,
  TbUsers,
  TbActivity,
  TbChartPie,
  TbDeviceDesktopAnalytics,
  TbPlayerPlay,
  TbHandFinger,
} from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { getTool } from '@/lib/toolIcons';
import { CountUp } from '@/components/CountUp';
import { SectionHeader } from '@/components/CaseStudyUI';

const TECH = ['PHP', 'MySQL', 'JavaScript', 'Node.js', 'Apache'];

const META: { icon: IconType; label: string; value: string }[] = [
  { icon: FiUser, label: 'Role', value: 'Design & development — solo' },
  { icon: TbStack2, label: 'Stack', value: 'PHP · MySQL · Vanilla JS' },
  { icon: TbCircleCheck, label: 'Status', value: 'Production — 100+ accounts' },
  { icon: FiCalendar, label: 'Year', value: '2026' },
];

const STATS = [
  { value: '100', suffix: '+', label: 'User accounts managed' },
  { value: '7', suffix: '', label: 'Console views' },
  { value: 'Pro·Easy', suffix: '', label: 'Plan split tracked', wide: true },
  { value: 'A–F', suffix: '', label: 'Form grades surfaced', wide: true },
];

const FEATURES: { icon: IconType; tag: string; t: string; d: string }[] = [
  {
    icon: TbUsers,
    tag: 'Users',
    t: 'Full member management',
    d: "Every user with plan, goal, body type, form average and last-active — open a profile drawer, soft-delete churned accounts and restore them with history intact.",
  },
  {
    icon: TbActivity,
    tag: 'Model',
    t: 'AI observability',
    d: 'Rep counting, form grading and posture accuracy tracked release over release, with uptime, inference speed and one-tap health checks on the vision pipeline.',
  },
  {
    icon: TbChartPie,
    tag: 'Cohorts',
    t: 'Population analytics',
    d: 'Body-type and goal distributions, Pro vs Easy plan split, weekly rescan completion and churn-risk watchlists — the whole user base at a glance.',
  },
];

// native size the console page lays itself out at; scaled to fit the screen
const BASE_W = 1460;
const BASE_H = 1070;

const AUTO_CAPTION =
  'Auto-playing the admin demo — click inside the screen to take over, ↻ Replay to restart.';
const FREE_CAPTION =
  "You're in control — explore the console freely: open profiles, switch views, run health checks.";

function AdminConsoleDemo() {
  const viewRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  // what the segmented control shows (takeover flips this without reloading)
  const [uiMode, setUiMode] = useState<'auto' | 'interactive'>('auto');
  // what the iframe is actually loaded with; id forces a fresh mount
  const [load, setLoad] = useState({ demo: true, id: 0 });
  const [caption, setCaption] = useState(AUTO_CAPTION);
  const [fading, setFading] = useState(false);

  const swapCaption = (txt: string) => {
    setFading(true);
    setTimeout(() => {
      setCaption(txt);
      setFading(false);
    }, 250);
  };

  const choose = (mode: 'auto' | 'interactive') => {
    setUiMode(mode);
    setLoad((l) => ({ demo: mode === 'auto', id: l.id + 1 }));
    swapCaption(mode === 'auto' ? AUTO_CAPTION : FREE_CAPTION);
  };

  useEffect(() => {
    const fit = () => {
      const view = viewRef.current;
      const frame = frameRef.current;
      if (!view || !frame) return;
      const s = Math.min(1, view.clientWidth / BASE_W);
      frame.style.transform = `scale(${s})`;
      view.style.height = `${BASE_H * s}px`;
    };
    fit();
    window.addEventListener('resize', fit);

    const onMsg = (e: MessageEvent) => {
      if (!e.data || !e.data.mfDemo) return;
      if (e.data.mfDemo === 'takeover') {
        setUiMode('interactive');
        swapCaption(FREE_CAPTION);
        return;
      }
      swapCaption(e.data.mfDemo);
    };
    window.addEventListener('message', onMsg);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('message', onMsg);
    };
  }, [load]);

  return (
    <div className="mx-auto max-w-4xl">
      {/* mode toggle */}
      <div className="glass mx-auto mb-8 flex w-fit items-center gap-1 rounded-full p-1">
        {(
          [
            { key: 'auto', icon: TbPlayerPlay, label: 'Autoplay demo' },
            { key: 'interactive', icon: TbHandFinger, label: 'Interactive' },
          ] as const
        ).map((o) => {
          const active = uiMode === o.key;
          return (
            <button
              key={o.key}
              onClick={() => choose(o.key)}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-all"
              style={{
                background: active
                  ? 'linear-gradient(135deg, rgba(193,123,232,0.3), rgba(96,128,255,0.3))'
                  : 'transparent',
                color: active ? '#f5f5f7' : 'rgba(245,245,247,0.55)',
                boxShadow: active ? 'inset 0 0 0 0.5px rgba(255,255,255,0.25)' : 'none',
              }}
            >
              <o.icon size={13} />
              {o.label}
            </button>
          );
        })}
      </div>
      {/* Laptop chassis — same materials as the shared LaptopFrame */}
      <div
        className="mx-auto w-full overflow-hidden rounded-t-xl rounded-b-md border border-white/10 p-[1.6%] pb-[1.2%]"
        style={{
          background: 'linear-gradient(160deg, #16161f, #0b0b12 60%)',
          boxShadow:
            '0 40px 90px -35px rgba(96,128,255,0.35), 0 20px 50px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* camera */}
        <div className="mx-auto mb-2 h-[6px] w-[6px] rounded-full bg-black ring-1 ring-white/10" />
        <div
          ref={viewRef}
          className="relative overflow-hidden rounded-md border-[0.5px] border-white/[0.06] bg-[#eaf1ea]"
        >
          <iframe
            key={load.id}
            ref={frameRef}
            src={load.demo ? '/mirafit-admin/admin.html?demo=1' : '/mirafit-admin/admin.html'}
            title={
              load.demo
                ? 'MiraFit admin console — auto-playing demo'
                : 'MiraFit admin console — interactive'
            }
            className="block origin-top-left border-0"
            style={{ width: BASE_W, height: BASE_H }}
          />
        </div>
      </div>
      {/* deck */}
      <div
        className="relative mx-auto h-[14px] w-full rounded-b-xl rounded-t-[3px] md:h-[16px]"
        style={{
          background: 'linear-gradient(180deg, #2a2a36 0%, #17171f 45%, #0d0d13 100%)',
          boxShadow: '0 18px 35px -18px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        <div
          className="absolute left-1/2 top-0 h-[6px] w-[12%] -translate-x-1/2 rounded-b-[8px]"
          style={{ background: 'linear-gradient(180deg, #08080d, #1c1c26)' }}
        />
      </div>

      {/* live caption */}
      <div className="mx-auto mt-6 flex min-h-[44px] max-w-xl items-start justify-center gap-2.5 px-4 text-center">
        <span className="relative mt-[5px] flex h-[9px] w-[9px] flex-none">
          {uiMode === 'auto' && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-40" />
          )}
          <span
            className={`relative inline-flex h-[9px] w-[9px] rounded-full ${
              uiMode === 'auto' ? 'bg-signal' : 'bg-accent-1'
            }`}
          />
        </span>
        <p
          aria-live="polite"
          className={`text-[13.5px] leading-[1.55] text-text-dim transition-opacity duration-200 ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
} as const;

export default function MiraFitAdminCaseStudy() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* HERO */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          <span>Case study — MiraFit Admin Console</span>
          <span
            className="h-px max-w-[180px] flex-1"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }}
          />
        </div>

        <h1
          className="font-medium leading-[1.1] tracking-[-0.04em] text-text"
          style={{ fontSize: 'clamp(34px, 5.5vw, 60px)' }}
        >
          One console to watch the{' '}
          <span className="font-serif italic font-normal gradient-text">whole platform</span>
        </h1>

        <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-text-dim md:text-[17px]">
          While users train, scan and eat, the MiraFit admin console watches the other side of the
          product: who&apos;s active, which goals and body types dominate, how accurately the
          detection model is grading form — and who&apos;s about to churn.
        </p>

        {/* Meta */}
        <div className="glass mt-8 grid divide-y divide-white/[0.06] rounded-2xl lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {META.map((m) => (
            <div key={m.label} className="flex items-center gap-3 px-4 py-2.5 lg:py-3">
              <span
                className="flex h-7 w-7 flex-none items-center justify-center rounded-lg lg:h-8 lg:w-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
                }}
              >
                <m.icon size={14} className="text-accent-soft" />
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                  {m.label}
                </div>
                <div className="truncate text-[13px] font-medium text-text">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mt-7 flex flex-wrap gap-3">
          <motion.div whileHover={{ y: -1 }}>
            <Link
              href="/projects/mirafit"
              className="inline-flex items-center gap-2 rounded-xl border-[0.5px] border-white/25 px-5 py-3 text-[14px] font-medium text-text transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(193,123,232,0.6)]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
              }}
            >
              <TbDeviceDesktopAnalytics size={16} />
              Read the MiraFit app case study
              <FiArrowUpRight size={14} />
            </Link>
          </motion.div>
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
              <div className="gradient-text-2 text-[28px] font-medium tracking-[-0.02em]">
                <CountUp value={s.value} />
                {s.suffix}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.header>

      {/* 01 — LIVE DEMO */}
      <motion.section {...reveal} className="mt-24">
        <SectionHeader number="01 — Live demo">
          The real console,{' '}
          <span className="font-serif italic font-normal gradient-text">driving itself</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          This is not a video — it&apos;s the actual console running in the page, auto-playing its
          full circuit: health checks, member management, soft-delete and restore, model metrics
          and cohort analytics. Click inside the screen at any time to take over.
        </p>

        <div className="mt-10">
          <AdminConsoleDemo />
        </div>
      </motion.section>

      {/* 02 — WHAT IT WATCHES */}
      <section className="mt-24">
        <motion.div {...reveal}>
          <SectionHeader number="02 — What it watches">
            Three lenses on one{' '}
            <span className="font-serif italic font-normal gradient-text">user base</span>
          </SectionHeader>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              className="group glass rounded-3xl p-6 transition-all hover:-translate-y-1 hover:border-white/15"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
                  }}
                >
                  <f.icon size={20} className="text-accent-soft" />
                </span>
                <span className="rounded-full border-[0.5px] border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{f.t}</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-text-dim">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <motion.section {...reveal} className="mt-24 border-t-[0.5px] border-white/[0.08] pt-12">
        <p className="max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          The console runs against the same self-hosted stack as the MiraFit app — the PHP REST
          API and MariaDB on the Raspberry Pi 5 — and is deployed and maintained in production,
          tracking engagement, plan-completion rates, and backend/AI-server health for 100+
          accounts.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <motion.div whileHover={{ y: -1 }}>
            <Link
              href="/projects/mirafit"
              className="inline-flex items-center gap-2 rounded-xl border-[0.5px] border-white/25 px-5 py-3 text-[14px] font-medium text-text transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(193,123,232,0.6)]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
              }}
            >
              <TbDeviceDesktopAnalytics size={16} />
              Explore the MiraFit app case study
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }}>
            <Link
              href="/projects"
              className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-medium text-text transition-all hover:border-white/25"
            >
              All projects
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
