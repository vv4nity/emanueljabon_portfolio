'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGithub, FiArrowUpRight, FiUser, FiArrowRight, FiArrowDown } from 'react-icons/fi';
import {
  TbCpu,
  TbCode,
  TbCloud,
  TbLayoutDashboard,
  TbDroplet,
  TbSunElectricity,
  TbDeviceMobile,
  TbServerOff,
  TbPlugConnected,
  TbBolt,
  TbBrowser,
} from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { getTool } from '@/lib/toolIcons';
import { CountUp } from '@/components/CountUp';
import { SectionHeader, BrowserFrame, LaptopFrame, PhoneFrame } from '@/components/CaseStudyUI';

const GITHUB_URL = 'https://github.com/vv4nity/solar-watering-dashboard';
const LIVE_URL = 'https://solar-watering-dashboard.vercel.app';

const TECH = ['ESP32', 'Arduino', 'C++', 'Firebase', 'JavaScript', 'Vercel'];

const META: { icon: IconType; label: string; value: string }[] = [
  { icon: FiUser, label: 'Role', value: 'Solo — hardware to frontend' },
  { icon: TbCpu, label: 'Firmware', value: 'C++ · ESP32 (Arduino)' },
  { icon: TbCloud, label: 'Cloud', value: 'Firebase RTDB + Auth' },
  { icon: TbBrowser, label: 'Frontend', value: 'Vanilla JS · Canvas · Vercel' },
];

const STATS = [
  { value: '2', suffix: 's', label: 'Field-to-dashboard telemetry' },
  { value: '0', suffix: 'ms', label: 'Polling — control is pushed' },
  { value: '0', suffix: '', label: 'Custom servers' },
  { value: '4', suffix: '', label: 'Layers built solo' },
];

const CONSTRAINTS: { icon: IconType; t: string; d: string }[] = [
  {
    icon: TbDroplet,
    t: 'Water on evidence, not schedule',
    d: 'The soil itself decides when the pump runs.',
  },
  {
    icon: TbSunElectricity,
    t: 'Fully off-grid',
    d: 'A solar panel and one 18650 cell are the whole power system.',
  },
  {
    icon: TbDeviceMobile,
    t: 'Watchable from anywhere',
    d: 'Live readings and manual override from a phone.',
  },
  {
    icon: TbServerOff,
    t: 'No backend to babysit',
    d: 'Nothing to patch, scale, or pay idle costs on.',
  },
];

const LAYERS: { icon: IconType; tag: string; t: string; d: string }[] = [
  {
    icon: TbCpu,
    tag: 'Field hardware',
    t: 'Sense everything, switch one thing',
    d: 'ESP32 wired to a DHT11 (air temp + humidity), a soil-moisture probe, an analog tank-level sensor, and a battery voltage divider. Its single output: an active-LOW relay driving the DC water pump, powered by a solar-charged 18650 cell.',
  },
  {
    icon: TbCode,
    tag: 'Firmware · C++',
    t: 'The brain lives in the field',
    d: 'The pump decision runs on-device: in AUTO, water when the soil reads dry and the tank holds above 20%. The firmware streams the cloud control node for instant commands and pushes a full sensor report every two seconds.',
  },
  {
    icon: TbCloud,
    tag: 'Cloud · Serverless',
    t: 'A database that doubles as a message bus',
    d: 'Firebase Realtime Database holds one JSON tree: /wateringSystem for telemetry, /wateringSystem/control for commands. Firebase Auth gives the device its own identity. There is no application server anywhere in the system.',
  },
  {
    icon: TbLayoutDashboard,
    tag: 'Frontend · Vanilla JS',
    t: 'A live control room in one file',
    d: 'A static, framework-free page — soil ring, animated tank, battery gauge, activity log, and a hand-rolled 60-second canvas chart with pump periods shaded. Deployed by pushing to GitHub; Vercel does the rest.',
  },
];

const DECISIONS: { k: string; t: string; d: string }[] = [
  {
    k: 'Edge autonomy',
    t: 'The dashboard is a remote control, not the brain',
    d: 'Watering logic runs entirely on the ESP32. If Wi-Fi drops, the router reboots, or Firebase is unreachable, crops still get watered — the cloud only observes and overrides. Getting this boundary right is what separates an IoT product from a demo that dies with the connection.',
  },
  {
    k: 'Push, not poll',
    t: 'A dedicated stream keeps control instant',
    d: "The firmware holds a persistent RTDB stream on /control — a subtree the device only ever reads and the dashboard only ever writes. Because the device's own two-second sensor writes land elsewhere in the tree, they can never flood or drop a control event. Tapping the pump button on a phone moves a physical relay with no polling loop in between.",
  },
  {
    k: 'Honest presence',
    t: '"Online" means the device said so, recently',
    d: "Every report carries a lastSeen server timestamp. The dashboard compares it against Firebase's server clock (via serverTimeOffset, so a wrong laptop clock can't lie), and a watchdog flips the status to offline after 15 quiet seconds. Only the ESP32 can prove the ESP32 is alive — the dashboard's own control writes don't count.",
  },
  {
    k: 'Confirmed truth',
    t: 'Optimistic UI, device-confirmed bookkeeping',
    d: "Tap the pump and the badge flips immediately — but watering cycles, runtime, and the activity log only advance when the ESP32 itself reports the state change. First reports after a page refresh sync silently, so reloading mid-watering can't fabricate a phantom cycle. The UI feels instant; the record stays true.",
  },
  {
    k: 'Hardware pragmatics',
    t: 'Respecting the physics of cheap parts',
    d: 'The relay is active-LOW and explicitly driven safe at boot so a restart can never start the pump on its own. Battery voltage is read through a 100k/100k divider into the ADC; Wi-Fi bring-up scans and prints diagnosable failure reasons instead of hanging. Unwired sensors fall back to clearly-flagged simulated values so the interface stays complete while the hardware iterates.',
  },
];

const STACK: { b: string; s: string }[] = [
  { b: 'ESP32', s: 'Wi-Fi MCU' },
  { b: 'DHT11', s: 'temp + humidity' },
  { b: 'Soil moisture probe', s: 'digital' },
  { b: 'Tank level sensor', s: 'analog ADC' },
  { b: 'Relay → DC pump', s: 'active-LOW' },
  { b: '18650 + solar panel', s: 'off-grid power' },
  { b: 'Arduino C++', s: 'firmware' },
  { b: 'Firebase_ESP_Client', s: 'RTDB streaming' },
  { b: 'Firebase Realtime DB', s: 'data + bus' },
  { b: 'Firebase Auth', s: 'device identity' },
  { b: 'Vanilla JS + Canvas', s: 'zero deps' },
  { b: 'GitHub → Vercel', s: 'CI deploy' },
];

const LESSONS: { t: string; d: string }[] = [
  {
    t: 'Real-time is a topology problem.',
    d: 'Splitting telemetry and control into separate, opposite-direction channels dissolved a whole class of race conditions before they existed.',
  },
  {
    t: 'Trust is a feature you design.',
    d: 'Presence detection, server-clock alignment, and device-confirmed state each exist because an earlier, naive version could show a lie.',
  },
  {
    t: 'The edge must outlive the cloud.',
    d: "Any system that touches the physical world needs to keep making safe decisions when the network doesn't show up.",
  },
  {
    t: 'Constraints sharpen craft.',
    d: 'No framework, no backend, hobby-grade sensors — and the result is a system a farmer can glance at and trust.',
  },
];

function FlowLane({
  label,
  accent,
  nodes,
}: {
  label: string;
  accent: string;
  nodes: { b: string; s: string; arrow?: string }[];
}) {
  return (
    <div>
      <p
        className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {label}
      </p>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {nodes.map((node, idx) => (
          <div key={node.b} className="contents">
            {idx > 0 && (
              <div
                className="flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wide text-text-faint md:flex-col md:flex-1"
              >
                <span className="hidden md:block">{node.arrow}</span>
                <FiArrowDown className="md:hidden" size={14} style={{ color: accent }} />
                <FiArrowRight className="hidden md:block" size={14} style={{ color: accent }} />
                <span className="md:hidden">{node.arrow}</span>
              </div>
            )}
            <div className="glass rounded-xl px-4 py-3 text-center md:min-w-[150px]">
              <div className="text-[13px] font-medium text-text">{node.b}</div>
              <div className="mt-0.5 font-mono text-[10px] text-text-faint">{node.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SolarWateringCaseStudy() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* HERO */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          <span>Case study — Full-stack IoT</span>
          <span
            className="h-px max-w-[180px] flex-1"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }}
          />
        </div>

        <h1
          className="font-medium leading-[1.1] tracking-[-0.04em] text-text"
          style={{ fontSize: 'clamp(34px, 5.5vw, 60px)' }}
        >
          Watering a farm with sunlight, one microcontroller, and{' '}
          <span className="font-serif italic font-normal gradient-text">zero servers</span>
        </h1>

        <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-text-dim md:text-[17px]">
          A solar-powered irrigation system for small-scale farming. An ESP32 in the field reads
          soil, climate, and tank sensors and drives the pump on its own — while a live web
          dashboard mirrors every reading in real time and can take over control from anywhere.
          The entire cloud layer is serverless.
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
            Live dashboard
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
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <BrowserFrame url="solar-watering-dashboard.vercel.app">
            <Image
              src="/solar-study/dashboard-pumping.png"
              alt="Dashboard mid-watering: pump ON, soil moisture ring climbing, live 60-second chart with pump periods shaded"
              width={2880}
              height={1720}
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="h-auto w-full"
            />
          </BrowserFrame>
          <figcaption className="mx-auto mt-4 max-w-xl text-center text-[14px] text-text-dim">
            <span className="font-mono text-accent-soft">LIVE</span> · Mid-cycle: the ESP32
            detected dry soil and switched the pump on — every card updates live.
          </figcaption>
        </motion.figure>
      </motion.header>

      {/* 01 — PROBLEM */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-24"
      >
        <SectionHeader number="01 — The problem">
          Small farms run on{' '}
          <span className="font-serif italic font-normal gradient-text">guesswork</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          On a small plot, irrigation is usually a person with a hose and a hunch. Watering by
          schedule instead of by soil condition wastes water on wet days and stresses crops on dry
          ones — and the fields that need automation most are exactly the ones without grid power
          or a budget for commercial systems. The brief I set for myself had four hard constraints:
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {CONSTRAINTS.map((c, idx) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
              className="group glass flex items-start gap-4 rounded-3xl p-5 transition-all hover:-translate-y-1 hover:border-white/15"
            >
              <span
                className="flex h-10 w-10 flex-none items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
                }}
              >
                <c.icon size={18} className="text-accent-soft" />
              </span>
              <div>
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-text">{c.t}</h3>
                <p className="mt-1 text-[13px] leading-[1.6] text-text-dim">{c.d}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
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
      </motion.section>

      {/* 02 — SYSTEM */}
      <section className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader number="02 — The system">
            One device, one database,{' '}
            <span className="font-serif italic font-normal gradient-text">one page</span>
          </SectionHeader>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
            The architecture is deliberately small. An ESP32 owns the field; Firebase Realtime
            Database is simultaneously the datastore and the message bus; and the dashboard is a
            single static page that subscribes to it over a WebSocket.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LAYERS.map((l, idx) => (
            <motion.div
              key={l.t}
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
                  <l.icon size={20} className="text-accent-soft" />
                </span>
                <span className="rounded-full border-[0.5px] border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                  {l.tag}
                </span>
              </div>
              <h3 className="text-[16px] font-medium tracking-[-0.01em] text-text">{l.t}</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-text-dim">{l.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 03 — REALTIME */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-24"
      >
        <SectionHeader number="03 — Real-time design">
          Two channels, pointed in{' '}
          <span className="font-serif italic font-normal gradient-text">opposite directions</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          The interesting problem wasn&apos;t moving data — it was moving it both ways without the
          two directions interfering. Telemetry is high-frequency and tolerant of loss; control is
          rare and must land instantly. So they never share a path.
        </p>

        <div className="glass mt-8 space-y-8 rounded-3xl p-6 md:p-8">
          <FlowLane
            label="Telemetry — field → screen"
            accent="#C17BE8"
            nodes={[
              { b: 'ESP32', s: 'sensors + pump' },
              { b: 'Firebase RTDB', s: '/wateringSystem', arrow: 'write every 2s' },
              { b: 'Dashboard', s: 'onValue() re-render', arrow: 'WebSocket push' },
            ]}
          />
          <FlowLane
            label="Control — screen → field"
            accent="#6080FF"
            nodes={[
              { b: 'Dashboard', s: 'AUTO / MANUAL, pump' },
              { b: 'Firebase RTDB', s: '…/control', arrow: 'set() command' },
              { b: 'ESP32', s: 'reacts instantly', arrow: 'RTDB stream' },
            ]}
          />
        </div>
      </motion.section>

      {/* 04 — DECISIONS */}
      <section className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader number="04 — Engineering decisions">
            The details that made it feel{' '}
            <span className="font-serif italic font-normal gradient-text">solid</span>
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

      {/* 05 — DASHBOARD */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-24"
      >
        <SectionHeader number="05 — The dashboard">
          Reading a field at a{' '}
          <span className="font-serif italic font-normal gradient-text">glance</span>
        </SectionHeader>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-text-dim md:text-[16px]">
          Every state has a shape, not just a number: the soil ring shifts red → amber → green
          around a marked watering threshold, the tank visibly drains while the pump runs, and the
          chart shades exactly when watering happened. The layout collapses from a 12-column grid
          to a single phone column.
        </p>

        <div className="mt-10 grid items-end gap-10 md:grid-cols-[5fr,2fr] md:gap-6">
          <figure>
            <LaptopFrame>
              <Image
                src="/solar-study/dashboard-idle.png"
                alt="Dashboard after a completed watering cycle: pump off, soil well watered, full cycle visible on the chart"
                width={2880}
                height={1720}
                sizes="(max-width: 768px) 100vw, 720px"
                className="h-auto w-full"
              />
            </LaptopFrame>
            <figcaption className="mt-5 text-center text-[13px] text-text-dim">
              After the cycle: soil replenished, pump idle, the whole event legible in the 60s
              chart.
            </figcaption>
          </figure>
          <figure>
            <PhoneFrame>
              <Image
                src="/solar-study/dashboard-mobile.png"
                alt="Dashboard on a phone: cards stacked in a single column"
                width={1170}
                height={2532}
                sizes="(max-width: 768px) 100vw, 280px"
                className="h-auto w-full"
              />
            </PhoneFrame>
            <figcaption className="mt-5 text-center text-[13px] text-text-dim">
              The same page on a phone — where a farmer would actually use it.
            </figcaption>
          </figure>
        </div>
      </motion.section>

      {/* 06 — STACK */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-24"
      >
        <SectionHeader number="06 — Stack">
          Every layer,{' '}
          <span className="font-serif italic font-normal gradient-text">end to end</span>
        </SectionHeader>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {STACK.map((s, idx) => (
            <motion.div
              key={s.b}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
              className="glass rounded-2xl px-4 py-3 transition-colors hover:border-white/15"
            >
              <div className="text-[13px] font-medium text-text">{s.b}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                {s.s}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 07 — LESSONS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-24 border-t-[0.5px] border-white/[0.08] pt-12"
      >
        <SectionHeader number="07 — Takeaways">
          Lessons from owning the{' '}
          <span className="font-serif italic font-normal gradient-text">whole stack</span>
        </SectionHeader>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LESSONS.map((l, idx) => (
            <motion.div
              key={l.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
              className="glass rounded-3xl p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <TbBolt size={16} className="text-accent-soft" />
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-text">{l.t}</h3>
              </div>
              <p className="text-[13.5px] leading-[1.65] text-text-dim">{l.d}</p>
            </motion.div>
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
            <TbPlugConnected size={15} />
            Open the live dashboard
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
