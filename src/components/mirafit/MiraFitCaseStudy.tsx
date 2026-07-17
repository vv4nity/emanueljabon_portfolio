'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGithub, FiUser, FiCalendar } from 'react-icons/fi';
import {
  TbDeviceMobile,
  TbBrain,
  TbDatabase,
  TbUsersGroup,
  TbCpu,
  TbArrowDown,
  TbBolt,
} from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { getTool } from '@/lib/toolIcons';
import { CountUp } from '@/components/CountUp';
import { SectionHeader } from '@/components/CaseStudyUI';
import { initMiraFitDemo } from './engine';
import { MF_ICON_DEFS, MF_HERO_PHONE, MF_WALKTHROUGH, MF_WEEKLY } from './fragments';
import './mirafit.css';

const GITHUB_URL = 'https://github.com/vv4nity/mirafit_bodyscan';

const TECH = [
  'Python',
  'Flask',
  'MediaPipe',
  'YOLOv8',
  'Gemini 2.5',
  'JavaScript',
  'PHP',
  'MySQL',
  'Cloudflare Tunnel',
];

const META: { icon: IconType; label: string; value: string }[] = [
  { icon: FiUser, label: 'Role', value: 'Lead Developer · AI Engineer' },
  { icon: TbUsersGroup, label: 'Team', value: '4 — capstone project' },
  { icon: TbCpu, label: 'Backend', value: 'Self-hosted · Raspberry Pi 5' },
  { icon: FiCalendar, label: 'Year', value: '2026' },
];

const STATS = [
  { value: '33', label: 'Pose landmarks per frame' },
  { value: 'A–F', label: 'Real-time form grading' },
  { value: '2', label: 'Custom-trained AI models' },
  { value: '18', label: 'Relational tables' },
];

const LAYERS: {
  icon: IconType;
  tag: string;
  t: string;
  chips: string[];
  bridge?: string;
}[] = [
  {
    icon: TbDeviceMobile,
    tag: 'Client',
    t: 'Single-page app, wrapped native',
    chips: [
      'Vanilla JS SPA (~29k lines)',
      'Capacitor → Android / iOS',
      'Canvas share cards (1080×1920)',
      'Live workout notifications',
      'Tailwind CSS',
      'Spotify / Apple Music',
    ],
    bridge: 'smart failover — health-checks the local Pi (3s), falls back to the Cloudflare tunnel',
  },
  {
    icon: TbBrain,
    tag: 'Application',
    t: 'AI service + REST API',
    chips: [
      'Flask AI server (Python)',
      'MediaPipe 33-pt pose',
      'YOLO ×2 (posture, body type)',
      'FSM rep counter (YAML)',
      'Gemini 2.5 Flash / Pro',
      'PHP REST API',
      'WebSocket gesture control',
    ],
  },
  {
    icon: TbDatabase,
    tag: 'Data',
    t: 'MariaDB on the Pi',
    chips: [
      '18 tables',
      'plans → days → exercises',
      'per-set session detail',
      'form_clips (deduped)',
      'daily metrics & posture logs',
      'weekly comparisons',
    ],
  },
];

const PIPELINE: { t: string; d: React.ReactNode }[] = [
  {
    t: 'Frame capture',
    d: (
      <>
        Workout mode grabs webcam frames, encodes them base64, and POSTs to{' '}
        <Code>/analyze_workout_frame</Code> with the exercise name, current set, and targets.
      </>
    ),
  },
  {
    t: 'Pose estimation',
    d: 'MediaPipe extracts 33 body landmarks. Exercise-specific joint angles (defined per-exercise in YAML) are computed — elbow flexion for curls, hip line for push-ups.',
  },
  {
    t: 'State-machine rep detection',
    d: (
      <>
        A finite state machine walks <Code>idle → descent → ascent → idle</Code>; a completed
        cycle counts one rep. Minimum-duration filtering rejects jitter and half-reps; bilateral
        tracking handles single-arm exercises.
      </>
    ),
  },
  {
    t: 'Form scoring',
    d: 'Each rep starts at 100 and loses points for angle deviation (up to −40), bad tempo (−30), and detected form errors (−30). The score maps to a grade: A ≥ 90 … F < 60, shown live with color-coded feedback.',
  },
  {
    t: 'Coaching clip capture',
    d: 'Any rep scoring below 70 triggers a 5-second WebM clip ending at the flagged moment, tagged with the issue (hips sagging, rounded shoulders, head dropped…). A unique key deduplicates: 30 sloppy reps of the same mistake produce one clip, not thirty.',
  },
  {
    t: 'Persist & recap',
    d: 'Sets, reps, form scores and calories land in MariaDB per-set. The session ends with a shareable canvas-rendered story card and feeds the weekly AI progress commentary.',
  },
];

const DECISIONS: { k: string; t: string; d: string }[] = [
  {
    k: 'Network',
    t: 'Smart local/remote failover',
    d: "On launch the client health-checks the Pi's LAN address with a 3-second timeout. On home WiFi it talks to the Pi directly (fast, free); anywhere else it transparently switches to the Cloudflare tunnel. The decision is cached for an hour and listeners are notified on change.",
  },
  {
    k: 'Reliability',
    t: 'Graceful degradation everywhere',
    d: 'Every heavy dependency — MediaPipe, YOLO, OpenCV, MySQL — is imported behind a try/except with a working fallback. The server always boots; features degrade instead of crashing. Malformed LLM output is run through a JSON-repair routine before parsing.',
  },
  {
    k: 'Cost',
    t: 'LLM quota protection',
    d: "Gemini responses are cached in-memory with a 1-hour TTL keyed by request content, so repeated plan lookups and meal details don't burn API quota. Fast calls use Gemini Flash; plan generation and vision use Pro.",
  },
  {
    k: 'UX',
    t: 'Signal over noise in coaching',
    d: "Form clips are deduplicated per (session, exercise, issue) at the database level with a unique key, and recorded at a bitrate tuned to what the Pi's PHP upload limits can handle — the user gets one clear coaching moment per mistake, not a flood.",
  },
  {
    k: 'Edge',
    t: 'Self-hosted on a Raspberry Pi 5',
    d: "MariaDB, the PHP API, and the Flask AI service all run as services on a Pi 5. A Cloudflare tunnel provides HTTPS access from anywhere with zero exposed ports — the user's fitness data never leaves hardware they own.",
  },
  {
    k: 'Native',
    t: 'One codebase, real native feel',
    d: 'Capacitor wraps the SPA for Android/iOS with native camera, share sheet, filesystem, and a live workout notification that updates sets/reps/form score in the notification shade while training.',
  },
];

const TEAM: { img: string; name: string; role: string; top?: boolean }[] = [
  { img: '/mirafit-study/img/t-emanuel.jpg', name: 'Emanuel Jabon', role: 'Lead Developer · AI Engineer', top: true },
  { img: '/mirafit-study/img/t-candido.jpg', name: 'Candido James Almario', role: 'UI/UX Designer' },
  { img: '/mirafit-study/img/t-gienel.jpg', name: 'Gienel Aubrey Benciang', role: 'UI/UX Designer' },
  { img: '/mirafit-study/img/t-jhon.jpg', name: 'Jhon Kaiser Sajo', role: 'Project Manager' },
];

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-accent-soft">
      {children}
    </code>
  );
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
} as const;

export default function MiraFitCaseStudy() {
  useEffect(() => initMiraFitDemo(), []);

  return (
    <div className="mx-auto max-w-6xl">
      {/* shared SVG icon defs for the embedded demo screens */}
      <div className="mfcs" dangerouslySetInnerHTML={{ __html: MF_ICON_DEFS }} />

      {/* HERO */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid items-center gap-12 lg:grid-cols-[1.15fr,0.85fr]"
      >
        <div>
          <div className="mb-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
            <span>Case study — Full-stack + Edge AI</span>
            <span
              className="h-px max-w-[180px] flex-1"
              style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }}
            />
          </div>

          <h1
            className="font-medium leading-[1.1] tracking-[-0.04em] text-text"
            style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}
          >
            MiraFit — an AI coach that{' '}
            <span className="font-serif italic font-normal gradient-text">watches your form</span>
          </h1>

          <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-text-dim md:text-[17px]">
            A cross-platform fitness app that counts your reps through the camera, grades every
            rep A–F in real time, scans your body composition with custom-trained vision models,
            and generates personalized workout &amp; meal plans — all served from a Raspberry Pi.
          </p>

          {/* Meta */}
          <div className="glass mt-8 grid divide-y divide-white/[0.06] rounded-2xl sm:grid-cols-2 sm:divide-y-0">
            {META.map((m, i) => (
              <div
                key={m.label}
                className={`flex items-center gap-3 px-4 py-2.5 ${i >= 2 ? 'sm:border-t-[0.5px] sm:border-white/[0.06]' : ''} ${i % 2 === 1 ? 'sm:border-l-[0.5px] sm:border-white/[0.06]' : ''}`}
              >
                <span
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
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
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-[0.5px] border-white/25 px-5 py-3 text-[14px] font-medium text-text transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(193,123,232,0.6)]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))',
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
        </div>

        {/* live hero phone demo */}
        <div className="mfcs mf-hero" dangerouslySetInnerHTML={{ __html: MF_HERO_PHONE }} />
      </motion.header>

      {/* Stats */}
      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
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
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 01 — PROBLEM */}
      <motion.section {...reveal} className="mt-24">
        <SectionHeader number="01 — The problem">
          Home workouts have no{' '}
          <span className="font-serif italic font-normal gradient-text">coach</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          People training at home get no feedback on their form — bad reps compound into plateaus
          and injuries, and generic plans ignore body type, posture, and progress. MiraFit&apos;s
          premise: a phone camera plus modern pose estimation can do what a personal trainer
          does — <b className="font-medium text-text">watch, count, correct, and adapt the plan</b>{' '}
          — without a gym or a subscription to a cloud platform. The entire backend runs on a
          Raspberry Pi 5 in the user&apos;s home, reachable from anywhere through a secure
          Cloudflare tunnel.
        </p>
      </motion.section>

      {/* 02 — WALKTHROUGH */}
      <motion.section {...reveal} className="mt-24">
        <SectionHeader number="02 — Product walkthrough">
          The app, screen by{' '}
          <span className="font-serif italic font-normal gradient-text">screen</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[14px] leading-[1.65] text-text-faint">
          Mockups reproduced from the production interface — same layout, components and palette
          as the shipped app. Click a step to switch screens; every screen plays a live simulation
          of the real feature.
        </p>
        <div className="mfcs mt-8" dangerouslySetInnerHTML={{ __html: MF_WALKTHROUGH }} />
      </motion.section>

      {/* 03 — WEEKLY CHECK */}
      <motion.section {...reveal} className="mt-24">
        <SectionHeader number="03 — Weekly progress check">
          Every 7 days, proof of{' '}
          <span className="font-serif italic font-normal gradient-text">change</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          MiraFit closes the loop: after each week it prompts a fresh full-body scan, compares the
          new results against last week&apos;s — body type, posture, weight, BMI — alongside that
          week&apos;s training stats, has Gemini write the highlights and improvement tips, and
          offers to regenerate the plan. Progress the user can <em>see</em>, not just log.
        </p>
        <div className="mfcs" dangerouslySetInnerHTML={{ __html: MF_WEEKLY }} />
        <p className="mx-auto mt-5 max-w-xl text-center text-[13px] text-text-dim">
          <span className="font-mono text-accent-soft">AUTO</span> · The 7-day prompt → weekly
          rescan → last-week-vs-this-week comparison with Gemini&apos;s coaching — and one-tap
          plan regeneration.
        </p>
      </motion.section>

      {/* 04 — ARCHITECTURE */}
      <section className="mt-24">
        <motion.div {...reveal}>
          <SectionHeader number="04 — Architecture">
            Three layers, one{' '}
            <span className="font-serif italic font-normal gradient-text">Raspberry Pi</span>
          </SectionHeader>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
            The whole backend is self-hosted on a Raspberry Pi 5 on the home network. A Cloudflare
            tunnel exposes it securely at <Code>app.mirafit.xyz</Code> — no open ports, no cloud
            hosting bill.
          </p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {LAYERS.map((l, idx) => (
            <motion.div
              key={l.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="glass rounded-3xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
                    }}
                  >
                    <l.icon size={18} className="text-accent-soft" />
                  </span>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                      {l.tag}
                    </div>
                    <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{l.t}</h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded border-[0.5px] border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-wide text-text-dim"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              {l.bridge && (
                <div className="flex items-center justify-center gap-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                  <TbArrowDown size={13} className="text-accent-soft" />
                  {l.bridge}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 05 — PIPELINE */}
      <section className="mt-24">
        <motion.div {...reveal}>
          <SectionHeader number="05 — How a rep gets counted">
            From camera frame to coaching{' '}
            <span className="font-serif italic font-normal gradient-text">clip</span>
          </SectionHeader>
        </motion.div>

        <div className="mt-8">
          {PIPELINE.map((s, idx) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.04 * idx }}
              className="relative flex gap-5 pb-8 last:pb-0"
            >
              {/* timeline rail */}
              <div className="flex flex-col items-center">
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-mono text-[11px] text-accent-soft"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {idx < PIPELINE.length - 1 && (
                  <span className="mt-2 w-px flex-1 bg-gradient-to-b from-white/15 to-transparent" />
                )}
              </div>
              <div className="pt-1.5">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-text">{s.t}</h3>
                <p className="mt-1.5 max-w-2xl text-[13.5px] leading-[1.65] text-text-dim">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 06 — DECISIONS */}
      <section className="mt-24">
        <motion.div {...reveal}>
          <SectionHeader number="06 — Engineering decisions">
            The details that made it{' '}
            <span className="font-serif italic font-normal gradient-text">work</span>
          </SectionHeader>
        </motion.div>

        <div className="mt-8 divide-y divide-white/[0.06] border-y-[0.5px] border-white/[0.06]">
          {DECISIONS.map((d, idx) => (
            <motion.div
              key={d.k}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.05 * (idx % 3) }}
              className="grid gap-2 py-6 md:grid-cols-[200px,1fr] md:gap-8"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-soft">
                {d.k}
              </div>
              <div>
                <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{d.t}</h3>
                <p className="mt-2 max-w-2xl text-[13.5px] leading-[1.65] text-text-dim">{d.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 07 — TEAM */}
      <motion.section {...reveal} className="mt-24 border-t-[0.5px] border-white/[0.08] pt-12">
        <SectionHeader number="07 — Meet the devs">
          The team behind{' '}
          <span className="font-serif italic font-normal gradient-text">MiraFit</span>
        </SectionHeader>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TEAM.map((m, idx) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass rounded-3xl p-6 text-center transition-all hover:-translate-y-1 hover:border-white/15"
            >
              <div
                className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full p-[2px]"
                style={{ background: 'linear-gradient(135deg, #C17BE8, #6080FF)' }}
              >
                <Image
                  src={m.img}
                  alt={m.name}
                  width={160}
                  height={160}
                  className="h-full w-full rounded-full object-cover"
                  style={m.top ? { objectPosition: 'center top' } : undefined}
                />
              </div>
              <div className="text-[14px] font-medium tracking-[-0.01em] text-text">{m.name}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                {m.role}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
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
          <p className="flex items-center gap-2 text-[12px] text-text-faint">
            <TbBolt size={14} className="text-accent-soft" />
            Designed, built and deployed end-to-end by the MiraFit team. Mockups on this page are
            reproductions of the production interface.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
