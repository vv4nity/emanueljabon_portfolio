'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

type Info = { number: string; label: string; accent: string };

const ROUTE_INFO: Record<string, Info> = {
  '/': { number: '000', label: 'Home', accent: 'Welcome back' },
  '/projects': { number: '002', label: 'Projects', accent: 'The archive' },
  '/cv': { number: '008', label: 'CV', accent: 'The long version' },
  '#work': { number: '002', label: 'Work', accent: 'Selected builds' },
  '#about': { number: '003', label: 'About', accent: 'A bit about me' },
  '#stack': { number: '004', label: 'Stack', accent: 'Tools I reach for' },
  '#experience': { number: '005', label: 'Experience', accent: 'Where I’ve been' },
  '#contact': { number: '007', label: 'Contact', accent: 'Let’s build' },
};

function infoFor(href: string): Info | null {
  // Direct route match
  if (ROUTE_INFO[href]) return ROUTE_INFO[href];

  // /#section style
  const hashMatch = href.match(/#([\w-]+)/);
  if (hashMatch) {
    const key = `#${hashMatch[1]}`;
    if (ROUTE_INFO[key]) return ROUTE_INFO[key];
  }

  // Pathname only
  const pathOnly = href.split('#')[0] || '/';
  if (ROUTE_INFO[pathOnly]) return ROUTE_INFO[pathOnly];

  return null;
}

const COVER_MS = 420; // matches the time-to-fully-cover in the animation
const TOTAL_MS = 1400;

export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const isFirst = useRef(true);
  const [active, setActive] = useState(false);
  const [info, setInfo] = useState<Info>(ROUTE_INFO['/']);

  // Skip first mount (preloader covers initial render)
  useEffect(() => {
    isFirst.current = false;
  }, []);

  // Intercept clicks on internal links so we can transition before nav (and cover hash jumps too).
  // Capture phase so we run BEFORE next/link's bundled onClick (which preventDefaults).
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      const a = target?.closest('a') as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href) return;
      if (a.target === '_blank') return;
      if (a.hasAttribute('download')) return;
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      const meta = infoFor(href);
      if (!meta) return;

      // Skip identical destination
      const currentHref = window.location.pathname + window.location.hash;
      if (href === currentHref) return;

      // Stop next/link from also handling it
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Notify any open overlays (mobile menu, etc.) to close
      window.dispatchEvent(new CustomEvent('app:nav-start', { detail: { href } }));

      setInfo(meta);
      setActive(true);

      // Navigate when the curtain fully covers the screen
      window.setTimeout(() => {
        if (href.startsWith('/#') || href.startsWith('#')) {
          const hash = href.includes('#') ? href.slice(href.indexOf('#')) : '';
          const onHome = window.location.pathname === '/';
          if (!onHome) {
            router.push(href);
          } else if (hash) {
            const id = hash.slice(1);
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
            window.history.replaceState(null, '', hash);
          }
        } else {
          router.push(href);
        }
      }, COVER_MS);

      window.setTimeout(() => setActive(false), TOTAL_MS);
    };

    document.addEventListener('click', handler, { capture: true });
    return () => document.removeEventListener('click', handler, { capture: true });
  }, [router]);

  // Fallback: still respond to pathname-only changes (e.g. browser back/forward)
  useEffect(() => {
    if (isFirst.current) return;
    if (active) return;
    const meta = ROUTE_INFO[pathname];
    if (!meta) return;
    setInfo(meta);
    setActive(true);
    const id = window.setTimeout(() => setActive(false), TOTAL_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="page-transition"
          initial={{ y: '100%' }}
          animate={{ y: ['100%', '0%', '0%', '-100%'] }}
          exit={{ opacity: 0 }}
          transition={{
            duration: TOTAL_MS / 1000,
            times: [0, COVER_MS / TOTAL_MS, 0.72, 1],
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[180] flex items-center justify-center overflow-hidden"
          style={{ background: '#050507' }}
        >
          {/* Soft ambient glow behind label */}
          <div
            className="pointer-events-none absolute h-[480px] w-[480px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(193,123,232,0.16), transparent 65%)',
              filter: 'blur(60px)',
            }}
          />

          <div className="relative flex max-w-full flex-col items-center px-6">
            {/* Section number — small mono caps */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-faint md:mb-6"
            >
              <span>{info.number}</span>
              <span className="h-px w-10 bg-white/20 md:w-12" />
              <span>Index</span>
            </motion.div>

            {/* Big page label */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="max-w-full break-words text-center font-medium uppercase leading-[0.9] tracking-[-0.05em] text-text"
              style={{ fontSize: 'clamp(44px, 12vw, 200px)' }}
            >
              {info.label}
            </motion.div>

            {/* Gradient underline that draws across */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 h-[2px] w-[60%] origin-left rounded-full md:mt-5 md:w-[68%]"
              style={{
                background:
                  'linear-gradient(90deg, transparent, #C17BE8 30%, #6080FF 70%, transparent)',
                boxShadow: '0 0 14px rgba(193,123,232,0.4)',
              }}
            />

            {/* Italic accent line */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="mt-4 text-center font-serif italic gradient-text md:mt-5"
              style={{ fontSize: 'clamp(15px, 1.8vw, 26px)' }}
            >
              {info.accent}.
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
