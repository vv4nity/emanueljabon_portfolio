'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUp, FiMic, FiX } from 'react-icons/fi';
import { personal } from '@/data/content';
import { getBotReply, SUGGESTIONS, GREETING, type ChatMessage } from '@/lib/chatbot';

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

const EASE = [0.16, 1, 0.3, 1] as const;

// Rotating teaser messages for the floating launcher hint
const HINTS = [
  'Ask me anything →',
  'Curious about my projects? →',
  'Want to see my AI work? →',
  'Wondering who I am? →',
  'Looking to hire? Let’s talk →',
  'What can I build for you? →',
];

// ─── Minimal typing for the (vendor-prefixed) Web Speech API ───
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> & { [i: number]: { isFinal: boolean } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

// ─── Looping video used as the AI avatar/icon ───
function Orb({ size = 28 }: { size?: number }) {
  return (
    <span
      className="relative inline-block flex-shrink-0 rounded-full"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ background: 'radial-gradient(circle at 50% 35%, #1a1530, #0c0b16)' }}
      >
        <video
          src="/ai-orb.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          ref={(el) => {
            if (el) el.muted = true; // ensure autoplay isn't blocked
          }}
          className="h-full w-full object-cover"
        />
      </span>
      {/* crisp hairline rim for definition against the glass */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.18)' }}
      />
    </span>
  );
}

// Signature corner brackets (lifted from the hero photo treatment)
function CornerTicks() {
  const base = 'pointer-events-none absolute h-3.5 w-3.5 border-white/20';
  return (
    <>
      <span className={`${base} left-2.5 top-2.5 border-l-[0.5px] border-t-[0.5px]`} />
      <span className={`${base} right-2.5 top-2.5 border-r-[0.5px] border-t-[0.5px]`} />
      <span className={`${base} bottom-2.5 left-2.5 border-b-[0.5px] border-l-[0.5px]`} />
      <span className={`${base} bottom-2.5 right-2.5 border-b-[0.5px] border-r-[0.5px]`} />
    </>
  );
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId(), role: 'bot', text: GREETING },
  ]);

  // Voice input (speech-to-text) only — the AI does not speak aloud.
  const [listening, setListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [kbInset, setKbInset] = useState(0); // mobile on-screen keyboard height

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Feature detection for voice input
  useEffect(() => {
    const SR =
      typeof window !== 'undefined' &&
      ((window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);
    setSttSupported(Boolean(SR));
  }, []);

  // Auto-scroll to newest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input when the panel opens
  useEffect(() => {
    if (open) {
      setHasOpened(true);
      setShowHint(false);
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keep the panel above the mobile on-screen keyboard (visualViewport)
  useEffect(() => {
    if (!open) {
      setKbInset(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const onChange = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbInset(inset);
    };
    onChange();
    vv.addEventListener('resize', onChange);
    vv.addEventListener('scroll', onChange);
    return () => {
      vv.removeEventListener('resize', onChange);
      vv.removeEventListener('scroll', onChange);
    };
  }, [open]);

  // Rotating discovery hint — appears periodically (a different message each time)
  // while the chat is closed. Pauses when open and resumes on close.
  useEffect(() => {
    if (open) {
      setShowHint(false);
      return;
    }
    const FIRST_DELAY = 2800; // before the first peek
    const VISIBLE_MS = 5200; // how long each hint stays
    const GAP_MS = 20000; // quiet stretch between hints

    let visible = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (visible) {
        setShowHint(false);
        visible = false;
        timer = setTimeout(tick, GAP_MS);
      } else {
        setHintIndex((i) => (i + 1) % HINTS.length);
        setShowHint(true);
        visible = true;
        timer = setTimeout(tick, VISIBLE_MS);
      }
    };
    timer = setTimeout(tick, FIRST_DELAY);
    return () => clearTimeout(timer);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(
    () => () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      recognitionRef.current?.stop();
    },
    [],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || typing) return;

      setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }]);
      setInput('');
      setTyping(true);

      const reply = getBotReply(text);
      const delay = Math.min(1100, 380 + reply.length * 4);
      typingTimer.current = setTimeout(() => {
        setMessages((prev) => [...prev, { id: nextId(), role: 'bot', text: reply }]);
        setTyping(false);
      }, delay);
    },
    [typing],
  );

  // ── Voice input (free browser speech-to-text) ──
  const toggleMic = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SRClass =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SRClass) return;

    const recognition = new SRClass();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (e) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setInput(transcript);
      const last = e.results[e.results.length - 1];
      if (last && (last as { isFinal?: boolean }).isFinal) {
        recognition.stop();
        send(transcript);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    setListening(true);
    recognition.start();
  }, [listening, send]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const firstName = personal.name.split(' ')[0];

  return (
    <>
      {/* ─────────── Floating launcher ─────────── */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2.5 sm:flex-row sm:items-center sm:gap-3 md:bottom-7 md:right-7">
        {/* Discovery hint */}
        <AnimatePresence>
          {showHint && !open && hintIndex >= 0 && (
            <motion.button
              key={hintIndex}
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, x: 14, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 14, scale: 0.9 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="group/hint hidden items-center gap-2 rounded-full border-[0.5px] border-white/15 py-2 pl-3 pr-4 text-[12.5px] text-text shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:flex"
              style={{ background: 'rgba(15,15,28,0.85)' }}
            >
              <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #C17BE8, #6080FF)' }}
              />
              <span className="whitespace-nowrap">{HINTS[hintIndex]}</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Launcher button — gradient ring wrapping the looping video */}
        <motion.button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chat' : "Ask Emanuel's AI"}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
        >
          {/* soft ambient glow — sits behind the opaque video, kept tight so the edge stays crisp */}
          <span
            className="absolute -inset-0.5 rounded-full opacity-35 blur-md transition-opacity duration-300 group-hover:opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(193,123,232,0.6), transparent 70%)' }}
          />
          {/* idle pulse ring before first open */}
          {!hasOpened && (
            <span className="absolute inset-0 z-10 animate-pulse-ring rounded-full border border-accent-soft/40" />
          )}
          {/* gradient ring wrapping the video (or close icon), filling the button */}
          <span
            className="absolute inset-0 rounded-full p-[1.5px]"
            style={{
              background:
                'linear-gradient(140deg, rgba(229,184,255,0.85), rgba(96,128,255,0.6) 55%, rgba(255,255,255,0.08))',
            }}
          >
            <span
              className="relative block h-full w-full overflow-hidden rounded-full"
              style={{ background: 'radial-gradient(circle at 50% 35%, #1a1530, #0c0b16)' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center text-text-dim transition-colors group-hover:text-text"
                  >
                    <FiX size={20} />
                  </motion.span>
                ) : (
                  <motion.video
                    key="vid"
                    src="/ai-orb.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden
                    ref={(el) => {
                      if (el) el.muted = true;
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
            </span>
          </span>
        </motion.button>
      </div>

      {/* ─────────── Chat panel ─────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{ background: 'rgba(13,12,24,0.9)', marginBottom: kbInset }}
            className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-2 right-2 z-[60] flex max-h-[80dvh] flex-col overflow-hidden rounded-2xl border-[0.5px] border-white/12 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:bottom-24 sm:left-auto sm:right-5 sm:w-[392px] sm:max-h-[72vh] md:bottom-28 md:right-7"
          >
            {/* Top gradient hairline */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(229,184,255,0.7) 25%, rgba(96,128,255,0.7) 75%, transparent)',
              }}
            />
            <CornerTicks />

            {/* Header */}
            <div className="relative flex items-center gap-3 px-4 pb-3.5 pt-4">
              {/* soft ambient glow behind the whole header */}
              <span
                className="pointer-events-none absolute -top-6 left-0 h-24 w-40 opacity-50 blur-2xl"
                style={{ background: 'radial-gradient(60% 60% at 20% 40%, rgba(193,123,232,0.28), transparent 70%)' }}
              />
              <div className="relative h-10 w-10 flex-shrink-0">
                {/* ambient glow */}
                <span
                  className="absolute -inset-1.5 rounded-full opacity-50 blur-md"
                  style={{ background: 'radial-gradient(circle, rgba(193,123,232,0.55), transparent 70%)' }}
                />
                {/* slow-rotating gradient ring (replaces the green status dot) */}
                <motion.span
                  aria-hidden
                  className="absolute -inset-[2px] rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, #E5B8FF, #6080FF, #C17BE8, #5EFFAA, #E5B8FF)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                <span className="absolute inset-0">
                  <Orb size={40} />
                </span>
              </div>
              <div className="relative min-w-0">
                <div className="text-[14px] font-medium tracking-[-0.01em] text-text">
                  {firstName}&apos;s AI
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-text-faint">
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #C17BE8, #6080FF)' }}
                  />
                  {listening ? 'Listening…' : 'Ask me anything'}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-text-faint transition-colors hover:bg-white/[0.06] hover:text-text"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Header divider */}
            <div
              className="h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent)',
              }}
            />

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] whitespace-pre-line text-[13px] leading-[1.6] ${
                      m.role === 'user'
                        ? 'rounded-2xl rounded-br-sm bg-text px-3.5 py-2.5 font-medium text-bg shadow-[0_6px_18px_rgba(0,0,0,0.3)]'
                        : 'rounded-2xl rounded-bl-sm border-[0.5px] border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border-[0.5px] border-white/[0.08] bg-white/[0.035] px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-text-dim"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestion chips (only while the convo is fresh) */}
              {messages.length <= 1 && !typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 pt-1"
                >
                  <div className="pl-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-text-faint">
                    Try asking
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border-[0.5px] border-white/12 bg-white/[0.025] px-3 py-1.5 text-[11.5px] text-text-dim transition-all hover:border-accent-1/40 hover:bg-white/[0.05] hover:text-text"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div
              className="h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent)',
              }}
            />
            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3">
              {/* Mic — free browser speech-to-text */}
              {sttSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label={listening ? 'Stop listening' : 'Speak your question'}
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[0.5px] transition-colors ${
                    listening
                      ? 'border-accent-1/50 bg-accent-1/[0.14] text-accent-soft'
                      : 'border-white/10 bg-white/[0.03] text-text-dim hover:text-text'
                  }`}
                >
                  {listening && (
                    <span className="absolute inset-0 animate-pulse-ring rounded-full border border-accent-1/50" />
                  )}
                  <FiMic size={15} />
                </button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? 'Listening…' : `Message ${firstName}'s AI…`}
                className="flex-1 rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] text-text outline-none transition-colors placeholder:text-text-faint focus:border-accent-1/40 focus:bg-white/[0.05]"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                style={{
                  background: 'linear-gradient(140deg, #C17BE8, #6080FF)',
                  boxShadow: '0 6px 18px rgba(193,123,232,0.35)',
                }}
              >
                <FiArrowUp size={16} />
              </button>
            </form>

            <div className="pb-2.5 text-center font-mono text-[8.5px] uppercase tracking-[0.22em] text-text-faint">
              {personal.initials} · AI Assistant
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
