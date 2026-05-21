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

type MenuVariant = 'fullscreen' | 'drawer';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<MenuVariant>('fullscreen');
  const [showFab, setShowFab] = useState(false);

  const openFullscreen = () => {
    setVariant('fullscreen');
    setOpen(true);
  };
  const openDrawer = () => {
    setVariant('drawer');
    setOpen(true);
  };

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

  // Lock scroll when menu is open. Using overflow:hidden (not position:fixed)
  // so sticky elements like the TopBar / Nav keep their sticky behavior while open.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };
    // Compensate for the disappearing scrollbar so layout doesn't jump
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
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
              onClick={() => (open ? closeMenu() : openFullscreen())}
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

      {/* Slide-in side drawer menu (used by FAB) */}
      <AnimatePresence>
        {open && variant === 'drawer' && (
          <>
            {/* Backdrop — click to close */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 z-[60]"
              style={{ background: 'rgba(5,5,7,0.55)', backdropFilter: 'blur(8px)' }}
            />

            {/* Drawer */}
            <motion.div
              key="menu-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-[60] flex h-[100dvh] w-[85vw] max-w-[400px] flex-col overflow-hidden border-l-[0.5px] border-white/[0.1]"
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

              {/* TopBar-style strip for brand consistency */}
              <div className="relative flex items-center justify-between border-b border-white/[0.06] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                <span>Portfolio · MMXXVI</span>
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute -inset-[3px] animate-pulse-ring rounded-full bg-signal opacity-30" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#5EFFAA]" />
                  </span>
                  Online
                </span>
              </div>

              {/* Drawer header — logo + close */}
              <div className="relative flex items-center justify-between px-6 py-5">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[14px] font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
                      boxShadow:
                        '0 6px 20px rgba(127,80,220,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
                    }}
                  >
                    {personal.initials}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[15px] font-medium tracking-tight text-text">
                      {personal.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                      Menu
                    </span>
                  </div>
                </Link>

                {/* Spacer matches the FAB so the floating button visually sits in this slot */}
                <div className="h-10 w-10" aria-hidden />
              </div>

              {/* Scrollable content */}
              <div className="relative flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-3">
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
                      className="group flex items-baseline justify-between border-b border-white/[0.06] py-4"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-faint">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[28px] font-medium tracking-[-0.025em] text-text transition-colors group-hover:gradient-text-2">
                          {link.label}
                        </span>
                      </span>
                      <span className="text-[17px] text-text-faint transition-transform group-hover:translate-x-1">
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

      {/* Fullscreen menu (used by the mobile top hamburger) */}
      <AnimatePresence>
        {open && variant === 'fullscreen' && (
          <motion.div
            key="fullscreen-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden md:hidden"
            style={{ background: 'rgba(5,5,7,0.94)', backdropFilter: 'blur(28px)' }}
          >
            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(193,123,232,0.25), transparent 60%)',
                filter: 'blur(80px)',
              }}
            />
            <div
              className="pointer-events-none absolute -right-24 bottom-1/4 h-[420px] w-[420px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(96,128,255,0.22), transparent 60%)',
                filter: 'blur(80px)',
              }}
            />

            <div className="relative flex min-h-full flex-col pb-8">
              {/* TopBar replica — mirrors the page's real TopBar */}
              <div className="border-b border-white/5 bg-black/40 px-6 py-2.5 backdrop-blur-xl">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                  <span>PORTFOLIO · MMXXVI</span>
                  <span>v1.0.2 ↗</span>
                </div>
              </div>

              {/* Nav header replica — logo + name + role, identical to the page's top nav */}
              <div className="border-b border-white/[0.08] bg-[#08080f]/60 px-6 py-4 backdrop-blur-2xl">
                <div className="flex items-center gap-3">
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
                    <span className="text-[14px] font-medium tracking-tight text-text">
                      {personal.name}
                    </span>
                    <span className="font-mono text-[10px] tracking-wide text-text-faint">
                      {personal.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section label */}
              <div className="flex flex-1 flex-col px-6 pt-6">
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

              <nav className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-baseline justify-between border-b border-white/[0.06] py-3.5"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[26px] font-medium tracking-[-0.03em] text-text transition-colors group-hover:gradient-text-2">
                          {link.label}
                        </span>
                      </span>
                      <span className="text-[16px] text-text-faint transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

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

              <div
                className="mt-auto pt-6"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
              >
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating menu FAB — appears after scrolling past the hero. Morphs between hamburger and X. */}
      <AnimatePresence>
        {(showFab || open) && (
          <motion.button
            key="menu-fab"
            type="button"
            onClick={() => {
              if (open) {
                closeMenu();
                return;
              }
              if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
                openDrawer();
              } else {
                openFullscreen();
              }
            }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-6 top-[54px] z-[65] flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/15 text-text transition-colors hover:border-white/30"
            style={{
              background:
                'linear-gradient(135deg, rgba(193,123,232,0.95), rgba(96,128,255,0.85))',
              boxShadow:
                '0 8px 20px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.1) inset',
              transform: 'translateZ(0)',
              willChange: 'transform, opacity',
              isolation: 'isolate',
            }}
          >
            {/* Morphing icon — 3 lines ↔ X */}
            <span className="relative block h-3 w-4">
              <motion.span
                animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-text"
              />
              <motion.span
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute left-0 top-[5px] h-[1.5px] w-full origin-center rounded-full bg-text"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-text"
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
