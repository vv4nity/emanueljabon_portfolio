'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGithub, FiArrowUpRight } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { TbBrain, TbWorld, TbSparkles, TbCpu, TbCode } from 'react-icons/tb';
import type { Project } from '@/data/content';
import { getTool } from '@/lib/toolIcons';

const BADGE_ICON: Record<string, IconType> = {
  ML: TbBrain,
  AI: TbSparkles,
  WEB: TbWorld,
  IOT: TbCpu,
};

const DOT_GRID = 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const BadgeIcon = BADGE_ICON[project.badge] ?? TbCode;
  const even = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      className="group relative overflow-hidden rounded-3xl border-[0.5px] border-white/[0.08] backdrop-blur-2xl transition-all hover:-translate-y-0.5 hover:border-white/15"
      style={{
        background: even
          ? 'linear-gradient(135deg, rgba(193,123,232,0.06), rgba(96,128,255,0.03))'
          : 'linear-gradient(135deg, rgba(96,128,255,0.06), rgba(193,123,232,0.03))',
      }}
    >
      {/* Visual */}
      <div
        className="relative h-52 overflow-hidden"
        style={{
          background: even
            ? 'linear-gradient(135deg, #2a1a40, #1a2050)'
            : 'linear-gradient(135deg, #1a2050, #2a1a40)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ backgroundImage: DOT_GRID, backgroundSize: '14px 14px' }}
        />

        <div
          className="pointer-events-none absolute h-56 w-56"
          style={{
            top: '-50px',
            [even ? 'left' : 'right']: '-50px',
            background: `radial-gradient(circle, ${
              even ? 'rgba(193,123,232,0.5)' : 'rgba(96,128,255,0.5)'
            }, transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute h-44 w-44"
          style={{
            bottom: '-30px',
            [even ? 'right' : 'left']: '-30px',
            background: `radial-gradient(circle, ${
              even ? 'rgba(96,128,255,0.4)' : 'rgba(193,123,232,0.4)'
            }, transparent 70%)`,
          }}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
          <BadgeIcon size={120} className="text-white/[0.07]" strokeWidth={1.25} />
        </div>

        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded border-[0.5px] border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-white backdrop-blur-md">
          <BadgeIcon size={11} />
          {project.badge}
        </div>

        <div className="absolute bottom-4 left-4 z-10 font-mono text-[11px] text-white/60">
          // project_{project.number}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-7">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-[20px] font-medium tracking-[-0.02em] text-text">{project.title}</h3>
          <div className="flex gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="text-text-dim transition-colors hover:text-text"
              >
                <FiGithub size={16} />
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="text-text-dim transition-colors hover:text-text"
              >
                <FiArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>
        <p className="mb-4 text-[13px] leading-[1.6] text-text-dim">{project.description}</p>
        {project.caseStudy && (
          <Link
            href={project.caseStudy}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-white/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text transition-all hover:-translate-y-0.5 hover:border-white/30 hover:shadow-[0_6px_18px_-8px_rgba(193,123,232,0.6)]"
            style={{
              background:
                'linear-gradient(135deg, rgba(193,123,232,0.2), rgba(96,128,255,0.2))',
            }}
          >
            Read case study
            <FiArrowUpRight size={12} />
          </Link>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => {
            const tool = getTool(tag);
            const TagIcon = tool.icon;
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded border-[0.5px] border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-wide text-text-dim"
              >
                <TagIcon size={11} style={{ color: tool.color }} />
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
