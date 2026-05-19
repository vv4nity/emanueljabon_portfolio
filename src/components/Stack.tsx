'use client';

import { motion } from 'framer-motion';
import { TbTerminal2 } from 'react-icons/tb';
import { stack } from '@/data/content';
import { getTool, CATEGORY_ICON } from '@/lib/toolIcons';

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Stack() {
  return (
    <section id="stack" className="relative py-24">
      <div className="mb-10">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          004 — Tech Stack
        </div>
        <h2 className="text-[32px] font-medium tracking-[-0.03em] text-text md:text-[40px]">
          Tools I <span className="font-serif italic font-normal gradient-text-2">reach</span> for.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stack.map((category, i) => {
          const CategoryIcon = CATEGORY_ICON[category.name] ?? TbTerminal2;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border-[0.5px] border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-2xl transition-colors hover:border-white/15 md:p-7"
            >
              {/* Accent ribbon */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
                style={{
                  background:
                    i % 2 === 0
                      ? 'radial-gradient(circle, rgba(193,123,232,0.55), transparent 70%)'
                      : 'radial-gradient(circle, rgba(96,128,255,0.55), transparent 70%)',
                }}
              />

              <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-white/10"
                    style={{
                      background:
                        i % 2 === 0
                          ? 'linear-gradient(135deg, rgba(193,123,232,0.18), rgba(96,128,255,0.08))'
                          : 'linear-gradient(135deg, rgba(96,128,255,0.18), rgba(193,123,232,0.08))',
                    }}
                  >
                    <CategoryIcon size={14} className="text-text" />
                  </div>
                  <h3 className="text-[15px] font-medium text-text">{category.name}</h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
                  {String(i + 1).padStart(2, '0')} / {String(stack.length).padStart(2, '0')}
                </span>
              </div>

              <div className="relative flex flex-wrap gap-2">
                {category.items.map((item) => {
                  const tool = getTool(item);
                  const Icon = tool.icon;
                  return (
                    <span
                      key={item}
                      className="group/chip relative inline-flex items-center gap-2 rounded-lg border-[0.5px] px-3 py-1.5 text-[12px] text-text-dim transition-all duration-200 hover:-translate-y-0.5 hover:text-text"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = hexToRgba(tool.color, 0.12);
                        e.currentTarget.style.borderColor = hexToRgba(tool.color, 0.45);
                        e.currentTarget.style.boxShadow = `0 6px 18px -8px ${hexToRgba(tool.color, 0.6)}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Icon size={13} style={{ color: tool.color }} />
                      {item}
                    </span>
                  );
                })}
              </div>

              <div className="relative mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                <span>{category.items.length} tools</span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
