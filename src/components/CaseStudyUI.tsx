'use client';

import { motion } from 'framer-motion';

export function SectionHeader({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
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

export function BrowserFrame({ children, url }: { children: React.ReactNode; url?: string }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-bg-2"
      style={{ boxShadow: '0 30px 80px -30px rgba(96,128,255,0.3)' }}
    >
      {url && (
        <div className="flex items-center gap-1.5 border-b-[0.5px] border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
          <i className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-2 truncate font-mono text-[10px] tracking-wide text-text-faint">
            {url}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        {/* Screen */}
        <div
          className="mx-auto w-[94%] overflow-hidden rounded-t-xl rounded-b-md border border-white/10 bg-[#0b0b12] p-[2.2%] pb-[1.6%]"
          style={{
            background: 'linear-gradient(160deg, #16161f, #0b0b12 60%)',
            boxShadow:
              '0 40px 90px -35px rgba(96,128,255,0.35), 0 20px 50px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div className="relative overflow-hidden rounded-md border-[0.5px] border-white/[0.06]">
            {children}
            {/* screen glare */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(115deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 30%, transparent 45%)',
              }}
            />
          </div>
        </div>
        {/* Deck */}
        <div
          className="relative mx-auto h-[14px] w-full rounded-b-xl rounded-t-[3px] md:h-[16px]"
          style={{
            background: 'linear-gradient(180deg, #2a2a36 0%, #17171f 45%, #0d0d13 100%)',
            boxShadow: '0 18px 35px -18px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          {/* thumb notch */}
          <div
            className="absolute left-1/2 top-0 h-[6px] w-[12%] -translate-x-1/2 rounded-b-[8px]"
            style={{ background: 'linear-gradient(180deg, #08080d, #1c1c26)' }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="relative rounded-[32px] p-[14px]"
        style={{
          background: 'linear-gradient(160deg, #2c2c38 0%, #14141c 45%, #0b0b12 100%)',
          boxShadow:
            '0 40px 90px -35px rgba(138,160,255,0.38), 0 20px 50px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        {/* power + volume buttons */}
        <span className="absolute -top-[2px] right-[52px] h-[3px] w-10 rounded-t bg-[#33333f]" />
        <span className="absolute -right-[2px] top-[46px] h-14 w-[3px] rounded-r bg-[#33333f]" />
        {/* front camera */}
        <span className="absolute left-1/2 top-[5px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />

        <div className="relative overflow-hidden rounded-[20px] border-[0.5px] border-white/[0.06] bg-[#0b0b12]">
          {children}
          {/* screen glare */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 28%, transparent 42%)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[300px]">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="relative rounded-[44px] p-[9px]"
        style={{
          background: 'linear-gradient(160deg, #2c2c38 0%, #14141c 40%, #0b0b12 100%)',
          boxShadow:
            '0 40px 90px -35px rgba(193,123,232,0.4), 0 20px 50px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.14)',
        }}
      >
        {/* side buttons */}
        <span className="absolute -left-[2px] top-[110px] h-8 w-[3px] rounded-l bg-[#33333f]" />
        <span className="absolute -left-[2px] top-[150px] h-12 w-[3px] rounded-l bg-[#33333f]" />
        <span className="absolute -right-[2px] top-[130px] h-16 w-[3px] rounded-r bg-[#33333f]" />

        <div className="relative overflow-hidden rounded-[36px] border-[0.5px] border-white/[0.06] bg-[#0b0b12]">
          {children}
          {/* screen glare */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 28%, transparent 42%)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
