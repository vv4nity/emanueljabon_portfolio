'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { AmbientOrbs } from '@/components/AmbientOrbs';
import { TopBar } from '@/components/TopBar';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/content';

export default function AllProjectsPage() {
  const badges = useMemo(() => {
    const set = new Set(projects.map((p) => p.badge));
    return ['ALL', ...Array.from(set)];
  }, []);

  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL' ? projects : projects.filter((p) => p.badge === filter);

  return (
    <main id="top" className="relative overflow-hidden">
      <AmbientOrbs />
      <TopBar />
      <Nav />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <section className="pt-8 pb-16 md:pt-24">
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
              <span>002 — Archive</span>
              <span
                className="h-px max-w-[180px] flex-1"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)',
                }}
              />
            </div>
            <h1
              className="mb-6 font-medium leading-[1.05] tracking-[-0.04em] text-text"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              Everything I&apos;ve{' '}
              <span className="font-serif italic font-normal gradient-text">built</span>.
            </h1>
            <p className="max-w-xl text-[16px] leading-[1.65] text-text-dim md:text-[17px]">
              A complete archive of shipped projects — from ML pipelines to full-stack platforms.
              Filter by category, or browse the whole catalog.
            </p>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center gap-2"
          >
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
              Filter
            </span>
            {badges.map((b) => {
              const active = filter === b;
              return (
                <button
                  key={b}
                  onClick={() => setFilter(b)}
                  className="rounded-full border-[0.5px] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-all"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, rgba(193,123,232,0.25), rgba(96,128,255,0.25))'
                      : 'rgba(255,255,255,0.03)',
                    borderColor: active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                    color: active ? '#f5f5f7' : 'rgba(245,245,247,0.55)',
                  }}
                >
                  {b}
                </button>
              );
            })}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
              {filtered.length} / {projects.length}
            </span>
          </motion.div>
        </section>

        {/* Grid */}
        <section className="pb-24">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border-[0.5px] border-white/[0.08] bg-white/[0.02] p-12 text-center text-[14px] text-text-dim">
              No projects match this filter yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
