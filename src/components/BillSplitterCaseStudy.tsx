'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGithub, FiArrowUpRight, FiUser, FiCalendar } from 'react-icons/fi';
import {
  TbStack2,
  TbCircleCheck,
  TbFridge,
  TbPlaneDeparture,
  TbKey,
  TbMessageCircle,
  TbDatabase,
  TbShieldLock,
  TbBolt,
} from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { getTool } from '@/lib/toolIcons';
import { CountUp } from '@/components/CountUp';
import { SectionHeader, BrowserFrame, LaptopFrame, PhoneFrame } from '@/components/CaseStudyUI';

const GITHUB_URL = 'https://github.com/vv4nity/dorm-bill-splitter';
const LIVE_URL = 'https://dorm-bill-splitter.vercel.app';

const TECH = ['Next.js', 'TypeScript', 'Supabase', 'Tailwind', 'Vercel'];

const META: { icon: IconType; label: string; value: string }[] = [
  { icon: FiUser, label: 'Role', value: 'Design & development' },
  { icon: TbStack2, label: 'Stack', value: 'Next.js 14 · TS · Supabase' },
  { icon: FiCalendar, label: 'Year', value: '2026' },
  { icon: TbCircleCheck, label: 'Status', value: 'Live — used by my unit monthly' },
];

const STATS = [
  { value: '25', suffix: '%', prefix: '', label: 'Shared base for standby load' },
  { value: '5', suffix: '/day', prefix: '₱', label: 'Redistributive absent fee' },
  { value: '4', suffix: '', prefix: '', label: 'Roommates, zero accounts' },
  { value: '0', suffix: '', prefix: '', label: 'Disputed splits since launch' },
];

const CORRECTIONS: { icon: IconType; tag: string; t: string; d: React.ReactNode }[] = [
  {
    icon: TbFridge,
    tag: 'Correction 01',
    t: "The fridge doesn't know you went home",
    d: (
      <>
        A chunk of any electricity bill is standby load: the fridge, the Wi-Fi router, chargers
        left plugged in. That load runs whether you&apos;re in the dorm or not, so allocating 100%
        of the bill by presence over-charges whoever stayed. The fix is a{' '}
        <b className="font-medium text-text">shared base</b>: a configurable percentage of the
        bill (we use 25%) is split equally among everyone — including a roommate with zero days —
        and only the remainder is split by person-days.
      </>
    ),
  },
  {
    icon: TbPlaneDeparture,
    tag: 'Correction 02',
    t: "Absence still isn't free",
    d: (
      <>
        Even with a shared base, long absences distort the split, so we added an{' '}
        <b className="font-medium text-text">absent-day fee</b> (e.g. ₱5 per day away). The subtle
        part: it&apos;s <em>redistributive, not additive</em>. Fees charged to absentees are
        subtracted from the presence pool before it&apos;s divided, so the bill total never
        changes — cost just shifts toward the people who were away.
      </>
    ),
  },
];

const DECISIONS: { icon: IconType; tag: string; t: string; d: React.ReactNode }[] = [
  {
    icon: TbKey,
    tag: 'Onboarding',
    t: 'One unit code instead of four accounts',
    d: (
      <>
        Asking four dormmates to create accounts is where side projects go to die. Instead, one
        person creates a <b className="font-medium text-text">unit</b> and shares a short code;
        everyone who enters it sees the same roommates and bills. The code uses a 31-character
        alphabet with no ambiguous characters (no 0/O, no 1/I/L), generated with{' '}
        <Code>crypto.getRandomValues</Code>, and the joined unit persists in{' '}
        <Code>localStorage</Code>.
      </>
    ),
  },
  {
    icon: TbMessageCircle,
    tag: 'Distribution',
    t: 'Meet the group chat where it lives',
    d: (
      <>
        A monthly summary can be filtered by month and utility, copied as plain text, or exported
        as a PNG (via <Code>html-to-image</Code>) — because the final destination of every split
        is the Messenger group anyway.
      </>
    ),
  },
];

const ARCH: { icon: IconType; tag: string; t: string; d: React.ReactNode }[] = [
  {
    icon: TbDatabase,
    tag: 'Schema',
    t: 'Four tables, one idempotent file',
    d: (
      <>
        A Next.js 14 client app talking directly to Supabase (Postgres):{' '}
        <Code>units → roommates → bills → bill_entries</Code>, with cascading deletes and
        snapshotted roommate names on entries so history survives roster changes. The schema file
        is fully idempotent (<Code>create table if not exists</Code> +{' '}
        <Code>alter table … add column if not exists</Code>), so existing installs upgrade by
        re-running one file — that&apos;s how the fairness columns shipped without a migration
        tool.
      </>
    ),
  },
  {
    icon: TbShieldLock,
    tag: 'Tradeoff',
    t: 'Proportionate security, documented honestly',
    d: (
      <>
        There&apos;s no auth, so row level security is enabled but permissive, and per-unit
        isolation is enforced by the app filtering on <Code>unit_id</Code>. For a bill tracker
        shared among friends, unguessable codes are proportionate security; the schema comments
        document exactly what to replace if real auth ever lands.
      </>
    ),
  },
];

const LESSONS: { t: string; d: string }[] = [
  {
    t: 'Real users find the real rules.',
    d: 'The fairness corrections only got right because my roommates complained about a real bill; the "redistributive, not additive" insight came from an argument, not a spec.',
  },
  {
    t: 'Ship the naive version early.',
    d: 'The person-days formula was wrong in two interesting ways I only discovered after we used it on actual bills — the corrections will find you.',
  },
];

const EXAMPLE_ROWS = [
  { name: 'Eman', days: 30, pct: '27.8%', owes: '₱584.49' },
  { name: 'Miko', days: 27, pct: '26.3%', owes: '₱554.20' },
  { name: 'Cess', days: 22, pct: '23.9%', owes: '₱503.72' },
  { name: 'Jaira', days: 18, pct: '22.0%', owes: '₱463.34' },
];

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-accent-soft">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-6 overflow-x-auto rounded-2xl border-[0.5px] border-white/[0.08] bg-bg-2 p-5 font-mono text-[12.5px] leading-[1.7] text-text-dim">
      <code>{children}</code>
    </pre>
  );
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
} as const;

export default function BillSplitterCaseStudy() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* HERO */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          <span>Case study — Dorm Bill Splitter</span>
          <span
            className="h-px max-w-[180px] flex-1"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }}
          />
        </div>

        <h1
          className="font-medium leading-[1.1] tracking-[-0.04em] text-text"
          style={{ fontSize: 'clamp(34px, 5.5vw, 60px)' }}
        >
          Whoever stayed more,{' '}
          <span className="font-serif italic font-normal gradient-text">pays more</span>
        </h1>

        <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-text-dim md:text-[17px]">
          A web app that splits electricity and water bills among roommates by{' '}
          <em>days actually stayed</em> — with fairness rules for the fridge that runs even when
          you&apos;re away. Computed transparently, down to the centavo.
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
          <motion.a
            whileHover={{ y: -1 }}
            href={LIVE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-[0.5px] border-white/25 px-5 py-3 text-[14px] font-medium text-text transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(193,123,232,0.6)]"
            style={{
              background: 'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
            }}
          >
            <FiArrowUpRight size={15} />
            Live app
          </motion.a>
          <motion.a
            whileHover={{ y: -1 }}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-medium text-text transition-all hover:border-white/25"
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

        {/* Hero shot */}
        <motion.figure {...reveal} className="mt-12">
          <div className="mx-auto max-w-2xl">
            <BrowserFrame url="dorm-bill-splitter.vercel.app">
              <Image
                src="/bill-study/dashboard.png"
                alt="Dorm Bill Splitter dashboard showing roommates, a new-bill form, and a bill history grouped by month"
                width={1268}
                height={1600}
                sizes="(max-width: 768px) 100vw, 672px"
                priority
                className="h-auto w-full"
              />
            </BrowserFrame>
          </div>
          <figcaption className="mx-auto mt-4 max-w-xl text-center text-[14px] text-text-dim">
            <span className="font-mono text-accent-soft">LIVE</span> · The dashboard: roommates,
            the bill form, and history grouped by month.
          </figcaption>
        </motion.figure>
      </motion.header>

      {/* 01 — PROBLEM */}
      <motion.section {...reveal} className="mt-24">
        <SectionHeader number="01 — The problem">
          Equal splits punish whoever stayed the{' '}
          <span className="font-serif italic font-normal gradient-text">least</span>
        </SectionHeader>
        <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          <p>
            I share a dorm unit with three roommates in the Philippines. Our schedules never
            match: someone goes home to the province for two weeks, someone stays through exams,
            someone is only around on weekdays. But every month the Meralco and Manila Water bills
            arrived, and we split them four ways — equally.
          </p>
          <p>
            That meant a roommate who stayed 12 days paid the same as one who stayed all 31. The
            math arguments happened in Messenger, on calculators, from screenshots of handwritten
            notes — and they repeated every single month.
          </p>
          <p>
            I wanted something a groupmate could open on their phone, see exactly how their share
            was computed, and stop arguing with. The core idea:{' '}
            <b className="font-medium text-text">whoever stayed more, pays more</b> — computed
            transparently, down to the centavo.
          </p>
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
                {s.prefix}
                <CountUp value={s.value} />
                {s.suffix}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 02 — ALGORITHM */}
      <section className="mt-24">
        <motion.div {...reveal}>
          <SectionHeader number="02 — The core algorithm">
            Person-days, then two fairness{' '}
            <span className="font-serif italic font-normal gradient-text">corrections</span>
          </SectionHeader>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
            The starting point is the <b className="font-medium text-text">person-days method</b>.
            Each roommate reports how many days of the billing period they stayed in the dorm, and
            the bill is allocated proportionally:
          </p>
          <CodeBlock>{`share = (your days ÷ total person-days) × bill amount`}</CodeBlock>
          <p className="mt-6 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
            Simple — and wrong in two interesting ways, which I only discovered after we used it
            for real bills.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {CORRECTIONS.map((c, idx) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
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
                  <c.icon size={20} className="text-accent-soft" />
                </span>
                <span className="rounded-full border-[0.5px] border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                  {c.tag}
                </span>
              </div>
              <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{c.t}</h3>
              <p className="mt-2 text-[13px] leading-[1.65] text-text-dim">{c.d}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal}>
          <CodeBlock>{`function splitAmounts(total, sharedPct, days, { periodDays, perAbsentDay }) {
  const base = total * (sharedPct / 100);       // fridge/wifi/standby
  const basePer = base / days.length;           // split equally, even at 0 days

  const absent = days.map(d => (periodDays - d) * perAbsentDay);
  let usagePool = total - base - sum(absent);   // fees come OUT of the pool,
                                                // so the total is unchanged
  if (usagePool < 0) {
    scaleFeesToFit(absent, total - base);       // edge case: fees > bill
    usagePool = 0;
  }

  return days.map((d, i) =>
    round2(basePer + absent[i] + (d / totalDays) * usagePool)
  );
}`}</CodeBlock>
          <p className="mt-6 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
            Two invariants made this trustworthy enough to end the Messenger debates: the shares{' '}
            <b className="font-medium text-text">always sum exactly to the bill</b>, and every
            input that produced a number is{' '}
            <b className="font-medium text-text">visible on screen</b>. Edge cases are handled
            explicitly — if the base plus absent fees would exceed the bill, fees are scaled down
            to fit; if nobody logged any days, the remainder falls back to an equal split.
          </p>
        </motion.div>

        {/* Worked example */}
        <motion.div {...reveal} className="glass mt-10 rounded-3xl p-6 md:p-8">
          <div className="mb-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-accent-soft">
            <span>A real month</span>
            <span
              className="h-px max-w-[120px] flex-1"
              style={{
                background: 'linear-gradient(to right, rgba(229,184,255,0.4), transparent)',
              }}
            />
          </div>
          <p className="max-w-3xl text-[14px] leading-[1.65] text-text-dim">
            June&apos;s electricity bill was{' '}
            <b className="font-medium text-text">₱2,105.75</b> over 30 days. With a 25% shared
            base, ₱526.44 splits equally (₱131.61 each). The ₱5/day absent fee shifts cost toward
            the two roommates who traveled. The rest follows presence — 97 person-days total:
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[26rem] text-[13px]">
              <thead>
                <tr className="border-b-[0.5px] border-white/[0.12] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                  <th className="py-2.5 pr-4 font-normal">Roommate</th>
                  <th className="py-2.5 pr-4 font-normal">Days stayed</th>
                  <th className="py-2.5 pr-4 font-normal">Share of bill</th>
                  <th className="py-2.5 font-normal">Owes</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_ROWS.map((r) => (
                  <tr key={r.name} className="border-b-[0.5px] border-white/[0.06] last:border-0">
                    <td className="py-2.5 pr-4 font-medium text-text">{r.name}</td>
                    <td className="py-2.5 pr-4 font-mono text-text-dim">{r.days}</td>
                    <td className="py-2.5 pr-4 font-mono text-text-dim">{r.pct}</td>
                    <td className="py-2.5 font-mono font-medium text-accent-soft">{r.owes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[13px] text-text-faint">
            A flat split would have been ₱526.44 each — ₱63 too much for the roommate who was away
            twelve days.
          </p>
        </motion.div>

        <motion.div {...reveal} className="mt-12 grid items-end gap-10 md:grid-cols-[2fr,3fr] md:gap-8">
          <figure>
            <BrowserFrame>
              <Image
                src="/bill-study/new-bill-form.png"
                alt="New bill form with electricity fairness controls and a live per-person preview"
                width={449}
                height={1000}
                sizes="(max-width: 768px) 100vw, 380px"
                className="h-auto w-full"
              />
            </BrowserFrame>
            <figcaption className="mt-4 text-center text-[13px] text-text-dim">
              The split previews live as you type — no save required to sanity-check it.
            </figcaption>
          </figure>
          <figure>
            <BrowserFrame url="dorm-bill-splitter.vercel.app">
              <Image
                src="/bill-study/bill-detail.png"
                alt="Bill detail modal showing each roommate's days, percentage and amount owed"
                width={1600}
                height={1000}
                sizes="(max-width: 768px) 100vw, 560px"
                className="h-auto w-full"
              />
            </BrowserFrame>
            <figcaption className="mt-4 text-center text-[13px] text-text-dim">
              Every saved bill shows its full breakdown — days, percentages, amounts.
            </figcaption>
          </figure>
        </motion.div>
      </section>

      {/* 03 — PRODUCT DECISIONS */}
      <section className="mt-24">
        <motion.div {...reveal}>
          <SectionHeader number="03 — Product decisions">
            No accounts — just a unit{' '}
            <span className="font-serif italic font-normal gradient-text">code</span>
          </SectionHeader>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {DECISIONS.map((d, idx) => (
            <motion.div
              key={d.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
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
                  <d.icon size={20} className="text-accent-soft" />
                </span>
                <span className="rounded-full border-[0.5px] border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                  {d.tag}
                </span>
              </div>
              <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{d.t}</h3>
              <p className="mt-2 text-[13px] leading-[1.65] text-text-dim">{d.d}</p>
            </motion.div>
          ))}
        </div>

        <motion.figure {...reveal} className="mt-12">
          <LaptopFrame>
            <Image
              src="/bill-study/summary.png"
              alt="Multi-month summary report with per-person totals across water and electricity"
              width={1600}
              height={1000}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto w-full"
            />
          </LaptopFrame>
          <figcaption className="mt-5 text-center text-[13px] text-text-dim">
            The multi-month summary: per-person totals across both utilities, exportable as text
            or PNG.
          </figcaption>
        </motion.figure>

        <motion.div {...reveal} className="mt-14 grid items-end gap-10 md:grid-cols-[5fr,2fr] md:gap-6">
          <figure>
            <LaptopFrame>
              <Image
                src="/bill-study/unit-gate.png"
                alt="The unit gate screen where roommates join with a short code"
                width={1600}
                height={1000}
                sizes="(max-width: 768px) 100vw, 720px"
                className="h-auto w-full"
              />
            </LaptopFrame>
            <figcaption className="mt-5 text-center text-[13px] text-text-dim">
              The entire onboarding: join with a code, or create a unit and share yours.
            </figcaption>
          </figure>
          <figure>
            <PhoneFrame>
              <Image
                src="/bill-study/mobile.png"
                alt="Mobile view of the dashboard"
                width={416}
                height={900}
                sizes="(max-width: 768px) 100vw, 280px"
                className="h-auto w-full"
              />
            </PhoneFrame>
            <figcaption className="mt-5 text-center text-[13px] text-text-dim">
              Mobile-first — bills get entered from a phone, in the dorm.
            </figcaption>
          </figure>
        </motion.div>
      </section>

      {/* 04 — UNDER THE HOOD */}
      <section className="mt-24">
        <motion.div {...reveal}>
          <SectionHeader number="04 — Under the hood">
            Small stack, honest{' '}
            <span className="font-serif italic font-normal gradient-text">tradeoffs</span>
          </SectionHeader>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ARCH.map((a, idx) => (
            <motion.div
              key={a.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
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
                  <a.icon size={20} className="text-accent-soft" />
                </span>
                <span className="rounded-full border-[0.5px] border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                  {a.tag}
                </span>
              </div>
              <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{a.t}</h3>
              <p className="mt-2 text-[13px] leading-[1.65] text-text-dim">{a.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 05 — OUTCOME */}
      <motion.section {...reveal} className="mt-24 border-t-[0.5px] border-white/[0.08] pt-12">
        <SectionHeader number="05 — Outcome">
          The argument is{' '}
          <span className="font-serif italic font-normal gradient-text">over</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          We&apos;ve settled every bill through the app since it shipped. The monthly ritual is
          now: enter the bill, type each person&apos;s days, screenshot the breakdown into the
          group chat. Nobody has disputed a split since — because nobody has to trust
          anyone&apos;s arithmetic anymore, including mine.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LESSONS.map((l) => (
            <div key={l.t} className="glass rounded-3xl p-6">
              <div className="mb-3 flex items-center gap-2">
                <TbBolt size={16} className="text-accent-soft" />
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-text">{l.t}</h3>
              </div>
              <p className="text-[13.5px] leading-[1.65] text-text-dim">{l.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <motion.a
            whileHover={{ y: -1 }}
            href={LIVE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-[0.5px] border-white/25 px-5 py-3 text-[14px] font-medium text-text transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(193,123,232,0.6)]"
            style={{
              background: 'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
            }}
          >
            <FiArrowUpRight size={15} />
            Open the live app
          </motion.a>
          <motion.a
            whileHover={{ y: -1 }}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-medium text-text transition-all hover:border-white/25"
          >
            <FiGithub size={15} />
            Explore the code
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
