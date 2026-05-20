'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';
import { personal } from '@/data/content';

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Stack', href: '/#stack' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/#contact' },
];

const socials = [
  { icon: FiGithub, href: personal.github, label: 'GitHub' },
  { icon: FiLinkedin, href: personal.linkedin, label: 'LinkedIn' },
  { icon: FiInstagram, href: personal.instagram, label: 'Instagram' },
  { icon: FiMail, href: `mailto:${personal.email}`, label: 'Email' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);

  // Close the menu whenever a navigation begins (PageTransition emits this).
  // Needed because PageTransition stops event propagation, so Link onClick={closeMenu} never fires.
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener('app:nav-start', handler);
    return () => window.removeEventListener('app:nav-start', handler);
  }, []);

  // Reveal the floating menu button after the user scrolls past the hero area
  useEffect(() => {
    const onScroll = () => {
      setShowFab(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open (iOS-safe via position:fixed)
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Close menu when route changes via link click (Link triggers a navigation)
  const closeMenu = () => setOpen(false);

  return (
    <>
      <nav className="sticky top-[34px] z-50 border-b border-white/[0.08] bg-[#08080f]/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                boxShadow: '0 6px 20px rgba(127,80,220,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
            >
              {personal.initials}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-medium tracking-tight text-text">{personal.name}</span>
              {/* Width-reserving wrapper so neither label gets clipped during the swap */}
              <span className="relative font-mono text-[10px] tracking-wide text-text-faint">
                <span aria-hidden className="invisible whitespace-nowrap">
                  {personal.role}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? 'menu' : 'role'}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-0 whitespace-nowrap"
                    style={open ? { letterSpacing: '0.22em', textTransform: 'uppercase' } : undefined}
                  >
                    {open ? 'Menu' : personal.role}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden gap-9 text-[13px] text-text-dim md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {/* Desktop CTAs */}
            <Link
              href={personal.cvUrl}
              className="hidden rounded-full border-[0.5px] border-white/15 bg-white/[0.03] px-4 py-2 text-[12px] font-medium text-text-dim transition-all hover:bg-white/10 hover:text-text md:inline-block"
            >
              CV
            </Link>
            <Link
              href="/#contact"
              className="hidden rounded-full border-[0.5px] border-white/[0.18] px-4 py-2 text-[12px] font-medium text-text backdrop-blur-md transition-all hover:brightness-125 md:inline-block"
              style={{
                background: 'linear-gradient(135deg, rgba(193,123,232,0.3), rgba(96,128,255,0.3))',
              }}
            >
              Hire me ↗
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[0.5px] border-white/15 bg-white/[0.04] backdrop-blur-md transition-colors hover:bg-white/[0.08] md:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 h-[1.5px] w-full bg-text"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-[5px] h-[1.5px] w-full bg-text"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-0 left-0 h-[1.5px] w-full bg-text"
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-in side drawer menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — click to close */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(5,5,7,0.55)', backdropFilter: 'blur(8px)' }}
            />

            {/* Drawer */}
            <motion.div
              key="menu-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-40 flex h-[100dvh] w-[85vw] max-w-[400px] flex-col overflow-hidden border-l-[0.5px] border-white/[0.1]"
              style={{ background: 'rgba(8,8,15,0.94)', backdropFilter: 'blur(28px)' }}
            >
              {/* Ambient glow */}
              <div
                className="pointer-events-none absolute -right-24 top-1/4 h-[360px] w-[360px] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(193,123,232,0.22), transparent 60%)',
                  filter: 'blur(80px)',
                }}
              />
              <div
                className="pointer-events-none absolute -left-24 bottom-1/4 h-[360px] w-[360px] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(96,128,255,0.18), transparent 60%)',
                  filter: 'blur(80px)',
                }}
              />

              {/* Top gradient hairline */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(193,123,232,0.5) 30%, rgba(96,128,255,0.5) 70%, transparent)',
                }}
              />

              {/* Drawer header — logo + close */}
              <div className="relative flex items-center justify-between px-6 py-4">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                      boxShadow:
                        '0 6px 20px rgba(127,80,220,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
                    }}
                  >
                    {personal.initials}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[13px] font-medium tracking-tight text-text">
                      {personal.name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-faint">
                      Menu
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-white/15 bg-white/[0.04] text-text transition-colors hover:bg-white/[0.08]"
                >
                  <span className="relative block h-3 w-3">
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 bg-text" />
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 bg-text" />
                  </span>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="relative flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-2">
              {/* Section label */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint"
              >
                <span>Navigation</span>
                <span
                  className="h-px flex-1"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(255,255,255,0.15), transparent)',
                  }}
                />
              </motion.div>

              {/* Links */}
              <nav className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-baseline justify-between border-b border-white/[0.06] py-3"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[22px] font-medium tracking-[-0.02em] text-text transition-colors group-hover:gradient-text-2">
                          {link.label}
                        </span>
                      </span>
                      <span className="text-[15px] text-text-faint transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTAs — side by side */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.42 }}
                className="mt-6 grid grid-cols-2 gap-3"
              >
                <Link
                  href="/#contact"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-medium text-text"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(193,123,232,0.45), rgba(96,128,255,0.45))',
                    border: '0.5px solid rgba(255,255,255,0.18)',
                    boxShadow: '0 10px 30px rgba(127,80,220,0.25)',
                  }}
                >
                  Hire me ↗
                </Link>
                <Link
                  href={personal.cvUrl}
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[0.5px] border-white/15 bg-white/[0.04] px-5 py-3.5 text-[13px] font-medium text-text-dim"
                >
                  View CV
                </Link>
              </motion.div>

              {/* Social icons row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-3 grid grid-cols-4 gap-3"
              >
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-12 items-center justify-center rounded-xl border-[0.5px] border-white/10 bg-white/[0.03] text-text-dim transition-all hover:border-white/20 hover:text-text"
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </motion.div>

              {/* Footer block */}
              <div className="mt-auto pt-6" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute -inset-[3px] animate-pulse-ring rounded-full bg-signal opacity-30" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#5EFFAA]" />
                  </span>
                  {personal.availability}
                </motion.div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating menu FAB — appears after scrolling past the hero */}
      <AnimatePresence>
        {showFab && !open && (
          <motion.button
            key="menu-fab"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group fixed right-6 top-24 z-[45] flex h-11 w-11 items-center justify-center rounded-full border-[0.5px] border-white/15 text-text shadow-[0_12px_30px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-colors hover:border-white/30 md:right-8 md:top-28 md:h-12 md:w-12"
            style={{
              background:
                'radial-gradient(120% 120% at 20% 20%, rgba(193,123,232,0.55), rgba(96,128,255,0.45) 70%, rgba(15,15,28,0.85))',
              boxShadow:
                '0 14px 40px rgba(127,80,220,0.35), 0 0 0 0.5px rgba(255,255,255,0.1) inset',
            }}
          >
            {/* Soft outer pulse ring */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full opacity-50"
              style={{
                background:
                  'radial-gradient(circle, rgba(193,123,232,0.3), transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
            <span className="relative block h-3 w-4">
              <span className="absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-text transition-transform duration-300 group-hover:w-3/4" />
              <span className="absolute left-0 top-[5px] h-[1.5px] w-full rounded-full bg-text" />
              <span className="absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-text transition-transform duration-300 group-hover:w-1/2" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
