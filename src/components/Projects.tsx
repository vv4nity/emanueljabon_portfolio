'use client';

import Link from 'next/link';
import { projects } from '@/data/content';
import { FiArrowUpRight } from 'react-icons/fi';
import { ProjectCard } from './ProjectCard';

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const shown = featured.length >= 2 ? featured : projects.slice(0, 4);

  return (
    <section id="work" className="relative py-14 md:py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
            002 — Selected Work
          </div>
          <h2 className="text-[32px] font-medium tracking-[-0.03em] text-text md:text-[40px]">
            Things I&apos;ve <span className="font-serif italic font-normal gradient-text-2">built</span>{' '}
            recently.
          </h2>
        </div>
        <Link
          href="/projects"
          className="hidden items-center gap-1.5 text-[13px] text-text-dim transition-colors hover:text-text md:flex"
        >
          All projects <FiArrowUpRight />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {shown.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      <Link
        href="/projects"
        className="mt-8 flex items-center justify-center gap-1.5 rounded-full border-[0.5px] border-white/[0.12] bg-white/[0.03] py-3.5 text-[13px] text-text-dim transition-colors hover:text-text md:hidden"
      >
        All projects <FiArrowUpRight />
      </Link>
    </section>
  );
}
