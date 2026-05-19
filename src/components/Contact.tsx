'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { personal } from '@/data/content';
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiCheck, FiAlertCircle } from 'react-icons/fi';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio contact from ${form.name}`,
          from_name: 'Portfolio Site',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again or email me directly.');
    }
  };

  const buttonLabel =
    status === 'sending'
      ? 'Sending…'
      : status === 'success'
        ? 'Message sent ✓'
        : 'Send message →';

  return (
    <section id="contact" className="relative py-14 md:py-24">
      <div className="mb-10">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-faint">
          007 — Contact
        </div>
        <h2 className="text-[32px] font-medium tracking-[-0.03em] text-text md:text-[40px]">
          Let&apos;s <span className="font-serif italic font-normal gradient-text-2">build</span>{' '}
          something.
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="grid gap-8 md:grid-cols-[1fr_1.2fr]"
      >
        {/* Left: copy + socials */}
        <div>
          <p className="mb-10 max-w-md text-[16px] leading-[1.65] text-text-dim">
            I&apos;m currently open to full-time roles, internships, and interesting freelance work.
            Drop a message through the form — I usually reply within 24 hours.
          </p>

          <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:gap-3">
            {[
              { icon: FiGithub, href: personal.github, label: 'GitHub' },
              { icon: FiLinkedin, href: personal.linkedin, label: 'LinkedIn' },
              { icon: FiInstagram, href: personal.instagram, label: 'Instagram' },
              { icon: FiMail, href: `mailto:${personal.email}`, label: 'Email' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-11 items-center justify-center gap-2 rounded-full border-[0.5px] border-white/15 bg-white/[0.03] text-[12px] text-text-dim transition-all hover:bg-white/[0.08] hover:text-text md:h-auto md:px-4 md:py-2.5"
              >
                <social.icon size={14} />
                <span className="hidden md:inline">{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6 md:p-7">
          {/* Honeypot — bots fill this, humans don't see it */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
              Name
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={status === 'sending'}
              className="w-full rounded-lg border-[0.5px] border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-text outline-none transition-colors focus:border-accent-1/50 disabled:opacity-60"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={status === 'sending'}
              className="w-full rounded-lg border-[0.5px] border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-text outline-none transition-colors focus:border-accent-1/50 disabled:opacity-60"
              placeholder="jane@company.com"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              disabled={status === 'sending'}
              className="w-full resize-none rounded-lg border-[0.5px] border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-text outline-none transition-colors focus:border-accent-1/50 disabled:opacity-60"
              placeholder="Tell me a bit about what you're working on..."
            />
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 rounded-lg border-[0.5px] border-signal/30 bg-signal/[0.06] px-3 py-2.5 text-[12px] text-signal">
              <FiCheck size={14} />
              Thanks — I&apos;ll reply within 24 hours.
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 rounded-lg border-[0.5px] border-red-400/30 bg-red-400/[0.06] px-3 py-2.5 text-[12px] text-red-300">
              <FiAlertCircle size={14} />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-6 py-3.5 text-[13px] font-medium text-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {buttonLabel}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
