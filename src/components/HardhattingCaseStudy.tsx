"use client";

/**
 * CPE Hardhatting 2026 — portfolio case study.
 * Self-contained: no external UI deps, brings its own styles.
 * Drop this file anywhere in your Next.js app (App Router or Pages),
 * copy /public/showcase/*.webp, and render <HardhattingCaseStudy />.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  { src: "/showcase/slide-01.webp", cap: "Coded for the future — the cover" },
  { src: "/showcase/slide-02.webp", cap: "Four roles, one system — each locked down with Row-Level Security" },
  { src: "/showcase/slide-03.webp", cap: "The attendee experience — dashboard, digital QR pass, seat map & profile" },
  { src: "/showcase/slide-04.webp", cap: "Block-president oversight — a live view of the section they supervise" },
  { src: "/showcase/slide-05.webp", cap: "An offline-resilient door scanner — recognises passes with zero signal" },
  { src: "/showcase/slide-06.webp", cap: "The organizer command center — turnout, live chart & activity feed" },
  { src: "/showcase/slide-07.webp", cap: "Full event administration — seating, invitations, briefings & export" },
  { src: "/showcase/slide-08.webp", cap: "Branded, end-to-end — invitation & check-in emails" },
  { src: "/showcase/slide-09.webp", cap: "Invite-only onboarding with rate-limited self-service recovery" },
  { src: "/showcase/slide-10.webp", cap: "Engineered to hold up — the tech under the hood" },
];

const TECH = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "Vercel"];

const FEATURES = [
  { t: "Personal digital QR pass", d: "Every attendee gets a QR ticket rendered client-side to a high-res PNG they can save — works offline once on the phone." },
  { t: "Offline-first door scanner", d: "The roster loads into memory at sign-in, so check-ins work with no signal and sync automatically (on reconnect, every 20s, and after each successful scan)." },
  { t: "Realtime command center", d: "Organizers watch turnout, a live check-in chart, an activity feed and per-block stats update the instant a pass is scanned — via Supabase Realtime." },
  { t: "Invite-only onboarding", d: "Attendees never self-register; activation verifies identity against the official class directory, with admin-approved, rate-limited recovery flows." },
  { t: "Branded transactional email", d: "Premium invitation and instant check-in emails — event cover, details and dress code — sent over Gmail SMTP." },
  { t: "Locked-down access", d: "Four roles (Attendee, Block President, Scanner, Admin), each seeing only what they should, enforced with Postgres Row-Level Security." },
];

export default function HardhattingCaseStudy() {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const n = SLIDES.length;

  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="hhc-root">
      <style>{CSS}</style>

      {/* HERO */}
      <header className="hhc-hero">
        <div className="hhc-eyebrow">Case study · Full-stack web app · 2026</div>
        <h1 className="hhc-title">
          CPE Hardhatting <span className="hhc-grad">2026</span>
        </h1>
        <p className="hhc-tagline">
          The attendance &amp; QR-seating platform I designed and built for the PUP Computer
          Engineering Hardhatting Ceremony — reserved seats, personal QR passes,
          offline door-scanning, and a live organizer command center.
        </p>

        <div className="hhc-meta">
          <div><span>Role</span>Solo — Design &amp; Engineering</div>
          <div><span>Type</span>Full-stack web app</div>
          <div><span>Event</span>PUP CpE · July 2026</div>
        </div>

        <div className="hhc-links">
          <a className="hhc-btn hhc-btn-primary" href="https://github.com/vv4nity/cpe-hardhatting-2026" target="_blank" rel="noreferrer">View on GitHub ↗</a>
        </div>

        <div className="hhc-tech">
          {TECH.map((t) => <span key={t} className="hhc-pill">{t}</span>)}
        </div>
      </header>

      {/* CAROUSEL */}
      <section
        className="hhc-carousel"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="hhc-stage">
          <button className="hhc-nav hhc-prev" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
          <div className="hhc-frame">
            {SLIDES.map((s, idx) => (
              <img
                key={s.src}
                src={s.src}
                alt={s.cap}
                loading={idx === 0 ? "eager" : "lazy"}
                className={"hhc-slide" + (idx === i ? " is-active" : "")}
              />
            ))}
          </div>
          <button className="hhc-nav hhc-next" onClick={() => go(1)} aria-label="Next slide">›</button>
        </div>

        <p className="hhc-cap"><b>{String(i + 1).padStart(2, "0")}</b> · {SLIDES[i].cap}</p>

        <div className="hhc-dots">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={"hhc-dot" + (idx === i ? " is-active" : "")}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* BRIEF */}
      <section className="hhc-block">
        <h2 className="hhc-h2">The brief</h2>
        <p className="hhc-body">
          A graduation-style ceremony with hundreds of attendees, assigned seating, and a venue
          with unreliable signal. Attendance had to be fast at the door, seats had to be findable,
          and organizers needed to see turnout live — all without anyone standing in a line or
          ticking names off a printed list.
        </p>
      </section>

      {/* FEATURES */}
      <section className="hhc-block">
        <h2 className="hhc-h2">What I built</h2>
        <div className="hhc-grid">
          {FEATURES.map((f) => (
            <div key={f.t} className="hhc-card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUTRO */}
      <footer className="hhc-outro">
        <h2 className="hhc-h2">Under the hood</h2>
        <p className="hhc-body">
          Built with Next.js 16 (App Router, Turbopack), React 19 and TypeScript, styled with
          Tailwind CSS v4, and backed by Supabase (Postgres · Auth · Realtime · Row-Level Security).
          Offline resilience is handled with an in-memory roster and a localStorage sync queue;
          the QR pass is rendered entirely client-side via canvas. Deployed on Vercel.
        </p>
        <div className="hhc-links">
          <a className="hhc-btn hhc-btn-primary" href="https://github.com/vv4nity/cpe-hardhatting-2026" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="hhc-btn" href="https://emanueljabonportfolio.vercel.app" target="_blank" rel="noreferrer">Portfolio ↗</a>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.hhc-root{--card:rgba(255,255,255,0.04);--ink:#f5f5f7;--muted:rgba(245,245,247,0.35);--body:rgba(245,245,247,0.55);
  --accent-1:#C17BE8;--accent-2:#6080FF;--accent-soft:#E5B8FF;--border:rgba(255,255,255,0.08);
  color:var(--ink);font-family:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif;
  max-width:1080px;margin:0 auto;-webkit-font-smoothing:antialiased;}
.hhc-root *{box-sizing:border-box}
.hhc-eyebrow{font-family:var(--font-geist-mono),monospace;font-size:11px;font-weight:400;letter-spacing:.25em;text-transform:uppercase;color:var(--muted)}
.hhc-title{font-size:clamp(38px,7vw,68px);line-height:1.05;font-weight:500;letter-spacing:-.04em;margin:14px 0 0}
.hhc-grad{font-family:var(--font-instrument-serif),serif;font-style:italic;font-weight:400;
  background:linear-gradient(120deg,#E5B8FF 0%,#C17BE8 35%,#8AA0FF 70%,#6080FF 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hhc-tagline{font-size:clamp(16px,2.2vw,18px);line-height:1.65;color:var(--body);max-width:680px;margin:18px 0 0}
.hhc-meta{display:flex;flex-wrap:wrap;gap:14px 40px;margin:30px 0 0}
.hhc-meta div{font-size:15px;font-weight:500}
.hhc-meta span{display:block;font-family:var(--font-geist-mono),monospace;font-size:10px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.hhc-links{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0 0}
.hhc-btn{display:inline-flex;align-items:center;font-size:14px;font-weight:500;text-decoration:none;color:var(--ink);
  background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:12px 20px;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:transform .15s,border-color .15s,box-shadow .15s}
.hhc-btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,0.2);box-shadow:0 8px 24px -12px rgba(193,123,232,.5)}
.hhc-btn-primary{background:linear-gradient(135deg,rgba(193,123,232,0.25),rgba(96,128,255,0.25));border-color:rgba(255,255,255,0.25)}
.hhc-tech{display:flex;flex-wrap:wrap;gap:9px;margin:30px 0 0}
.hhc-pill{font-family:var(--font-geist-mono),monospace;font-size:11px;font-weight:400;letter-spacing:.05em;color:var(--body);
  background:var(--card);border:0.5px solid var(--border);border-radius:999px;padding:7px 14px}

.hhc-carousel{margin:64px 0 0}
.hhc-stage{display:flex;align-items:center;gap:14px}
.hhc-frame{position:relative;flex:1;aspect-ratio:4/5;border-radius:18px;overflow:hidden;background:#0a0a12;
  border:0.5px solid var(--border);box-shadow:0 30px 80px -30px rgba(193,123,232,.3)}
.hhc-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s ease;pointer-events:none}
.hhc-slide.is-active{opacity:1;pointer-events:auto}
.hhc-nav{flex:none;width:52px;height:52px;border-radius:50%;border:0.5px solid var(--border);background:var(--card);
  color:var(--ink);font-size:26px;line-height:1;cursor:pointer;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  transition:transform .15s,background .15s,border-color .15s}
.hhc-nav:hover{background:linear-gradient(135deg,rgba(193,123,232,0.3),rgba(96,128,255,0.3));border-color:rgba(255,255,255,0.25);transform:scale(1.06)}
.hhc-cap{text-align:center;font-size:14px;color:var(--body);margin:20px auto 0;max-width:640px}
.hhc-cap b{font-family:var(--font-geist-mono),monospace;font-weight:400;color:var(--accent-soft)}
.hhc-dots{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:16px 0 0}
.hhc-dot{width:9px;height:9px;border-radius:50%;border:0;background:rgba(255,255,255,0.15);cursor:pointer;padding:0;transition:width .2s,background .2s}
.hhc-dot.is-active{width:24px;border-radius:5px;background:linear-gradient(90deg,var(--accent-1),var(--accent-2))}

.hhc-block{margin:72px 0 0}
.hhc-h2{font-size:clamp(24px,4vw,34px);font-weight:500;letter-spacing:-.02em;margin:0}
.hhc-body{font-size:16px;line-height:1.65;color:var(--body);max-width:780px;margin:16px 0 0}
.hhc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin:26px 0 0}
.hhc-card{background:var(--card);border:0.5px solid var(--border);border-radius:20px;padding:26px;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:border-color .2s,transform .2s}
.hhc-card:hover{border-color:rgba(255,255,255,0.15);transform:translateY(-2px)}
.hhc-card h3{font-size:17px;font-weight:500;letter-spacing:-.01em;margin:0;color:var(--ink)}
.hhc-card p{font-size:13.5px;line-height:1.6;color:var(--body);margin:9px 0 0}
.hhc-outro{margin:72px 0 0;border-top:0.5px solid var(--border);padding-top:44px}

@media (max-width:640px){
  .hhc-nav{width:42px;height:42px;font-size:22px}
  .hhc-stage{gap:8px}
}
`;
