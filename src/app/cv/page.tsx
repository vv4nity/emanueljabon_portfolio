'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowDown, FiDownload, FiExternalLink, FiMail } from 'react-icons/fi';
import { AmbientOrbs } from '@/components/AmbientOrbs';
import { TopBar } from '@/components/TopBar';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { personal } from '@/data/content';

export default function CVPage() {
  const file = personal.cvFile;
  const fileName = file.split('/').pop() ?? 'CV.pdf';

  // Mobile browsers (especially iOS Safari) don't render PDFs inline, so we route
  // mobile viewers through Google's PDF viewer instead. Desktop keeps native rendering.
  const [pdfSrc, setPdfSrc] = useState(`${file}#view=FitH&toolbar=0&navpanes=0`);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) return;
    const absoluteUrl = `${window.location.origin}${file}`;
    setPdfSrc(
      `https://docs.google.com/gview?url=${encodeURIComponent(absoluteUrl)}&embedded=true`,
    );
  }, [file]);

  return (
    <main id="top" className="relative overflow-hidden">
      <AmbientOrbs />
      <TopBar />
      <Nav />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <section className="pt-8 pb-10 md:pt-20">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-faint transition-colors hover:text-text md:mb-10"
          >
            <FiArrowLeft size={12} />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
              <span>008 — Curriculum Vitae</span>
              <span
                className="h-px max-w-[180px] flex-1"
                style={{
                  background:
                    'linear-gradient(to right, rgba(255,255,255,0.2), transparent)',
                }}
              />
            </div>
            <h1
              className="mb-6 font-medium leading-[1.05] tracking-[-0.04em] text-text"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              The{' '}
              <span className="font-serif italic font-normal gradient-text">long version</span>
              .
            </h1>
            <p className="max-w-xl text-[16px] leading-[1.65] text-text-dim md:text-[17px]">
              Roles, education, and credentials in one document. Preview below — or grab the PDF
              if you&apos;d rather print, mark up, or pass along.
            </p>
          </motion.div>

          {/* Meta strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-8 flex flex-wrap items-center gap-2 md:mt-10 md:gap-3"
          >
            {[
              { label: 'File', value: fileName },
              { label: 'Updated', value: personal.cvUpdated },
              { label: 'Format', value: 'PDF · A4' },
            ].map((m) => (
              <div
                key={m.label}
                className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim md:gap-2.5 md:px-3.5 md:py-1.5 md:text-[10px] md:tracking-[0.18em]"
              >
                <span className="text-text-faint">{m.label}</span>
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #C17BE8, #6080FF)' }}
                />
                <span>{m.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Action row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex w-full max-w-md flex-col gap-2.5"
          >
            {/* Primary — download */}
            <a
              href={file}
              download={fileName}
              className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-4 py-3.5 transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, rgba(193,123,232,0.45), rgba(96,128,255,0.45))',
                border: '0.5px solid rgba(255,255,255,0.18)',
                boxShadow: '0 12px 34px rgba(127,80,220,0.28)',
              }}
            >
              {/* Sheen sweep on hover */}
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <span
                  className="absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-[400%]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                  }}
                />
              </span>

              <span className="relative flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[0.5px] border-white/25 bg-white/15">
                  <FiDownload size={17} className="text-text" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[14px] font-semibold leading-tight text-text">
                    Download PDF
                  </span>
                  <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                    {fileName} · 93 KB
                  </span>
                </span>
              </span>

              <FiArrowDown
                size={18}
                className="relative shrink-0 text-text/70 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-text"
              />
            </a>

            {/* Secondary — open + reach out */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-[0.5px] border-white/15 bg-white/[0.04] px-4 py-3 text-[12px] font-medium text-text-dim transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-text sm:text-[13px]"
              >
                <FiExternalLink size={14} className="shrink-0" />
                Open in new tab
              </a>
              <a
                href={`mailto:${personal.email}?subject=${encodeURIComponent('Re: your CV')}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-[0.5px] border-white/15 bg-white/[0.04] px-4 py-3 text-[12px] font-medium text-text-dim transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-text sm:text-[13px]"
              >
                <FiMail size={14} className="shrink-0" />
                Reach out
              </a>
            </div>
          </motion.div>
        </section>

        {/* Viewer */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pb-24"
        >
          <div
            className="relative overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] backdrop-blur-2xl md:rounded-3xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(193,123,232,0.06), rgba(96,128,255,0.04))',
            }}
          >
            {/* Corner ticks */}
            <div className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-[0.5px] border-t-[0.5px] border-white/35" />
            <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-[0.5px] border-t-[0.5px] border-white/35" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-[0.5px] border-l-[0.5px] border-white/35" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-[0.5px] border-r-[0.5px] border-white/35" />

            {/* Viewer header bar */}
            <div className="relative flex items-center justify-between border-b border-white/[0.06] px-4 py-3 md:px-5 md:py-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/15 md:h-2.5 md:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-white/15 md:h-2.5 md:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-white/15 md:h-2.5 md:w-2.5" />
              </div>
              <div className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-text-faint md:text-[10px] md:tracking-[0.2em]">
                {fileName}
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-text-faint md:text-[10px] md:tracking-[0.2em]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute -inset-[3px] animate-pulse-ring rounded-full bg-signal opacity-25" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#5EFFAA]" />
                </span>
                Live
              </div>
            </div>

            {/* PDF iframe — mobile uses Google's viewer; the wrapper masks scrollbars + bottom chrome */}
            <div
              className="cv-viewer relative aspect-[0.72/1] w-full overflow-hidden md:aspect-auto md:h-[88vh]"
              style={{ background: '#0a0a12' }}
            >
              <iframe
                key={pdfSrc}
                src={pdfSrc}
                title="Emanuel Jabon — CV"
                scrolling="no"
                className="absolute left-0 top-0 w-full"
                style={{ border: 0, background: 'transparent', height: '100%' }}
              />
            </div>
          </div>

          {/* Footer hint */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
            <span>Last revision · {personal.cvUpdated}</span>
            <span className="flex items-center gap-2">
              <span>Trouble viewing?</span>
              <a
                href={file}
                target="_blank"
                rel="noreferrer"
                className="text-text-dim transition-colors hover:text-text"
              >
                Open in new tab ↗
              </a>
            </span>
          </div>
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
