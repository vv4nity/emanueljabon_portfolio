import { NextRequest, NextResponse } from 'next/server';
import { buildGroundingContext } from '@/lib/chatbot';
import { personal } from '@/data/content';

const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

const SYSTEM_PROMPT = `You are ${personal.name}'s personal AI assistant, embedded in his portfolio site. Answer AS Emanuel, in first person, warm and concise (2-4 sentences unless the question clearly needs more).

Only use the facts below — never invent projects, dates, companies, skills, or achievements that aren't listed. If asked something you don't have info on, say so honestly and point them to email (${personal.email}) instead of guessing. If the question is off-topic (not about Emanuel, his work, or hiring him), politely redirect to what you can help with.

LINKS: Whenever you mention a URL or internal path (case study, live demo, GitHub repo, CV, LinkedIn, email), always format it as a markdown link: [Label](url) — e.g. [Case study](/projects/mirafit), [GitHub](https://github.com/...), [Email](mailto:${personal.email}). Never paste a bare/raw URL. When a project has a case study, prefer linking to that over the live demo unless the user specifically asks to try the live app.

FACTS:
${buildGroundingContext()}`;

// ─────────────────────────────────────────────
// Rate limiting (in-memory — fine for a low-traffic personal site;
// resets on cold start, which just means "fail open" occasionally).
//   - Per-IP: stops any one visitor from hammering the endpoint.
//   - Daily global: protects the shared Gemini free-tier quota from
//     being drained by a burst of traffic across all visitors.
// ─────────────────────────────────────────────
const IP_LIMIT = 8;
const IP_WINDOW_MS = 60_000;
const DAILY_LIMIT = 150;
const DAY_MS = 24 * 60 * 60 * 1000;

type Bucket = { count: number; resetAt: number };
const ipBuckets = new Map<string, Bucket>();
let dailyCount = 0;
let dailyResetAt = Date.now() + DAY_MS;

function pruneExpiredBuckets(now: number) {
  if (ipBuckets.size < 500) return;
  for (const [ip, bucket] of Array.from(ipBuckets.entries())) {
    if (now > bucket.resetAt) ipBuckets.delete(ip);
  }
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();

  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + DAY_MS;
  }
  if (dailyCount >= DAILY_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((dailyResetAt - now) / 1000) };
  }

  pruneExpiredBuckets(now);
  let bucket = ipBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + IP_WINDOW_MS };
    ipBuckets.set(ip, bucket);
  }
  if (bucket.count >= IP_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count++;
  dailyCount++;
  return { ok: true };
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'missing_api_key' }, { status: 500 });
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let message: string;
  let history: { role: 'user' | 'model'; text: string }[] = [];
  try {
    const body = await req.json();
    message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (Array.isArray(body?.history)) {
      history = body.history
        .filter(
          (m: unknown): m is { role: string; text: string } =>
            !!m &&
            typeof (m as { text?: unknown }).text === 'string' &&
            ((m as { role?: unknown }).role === 'user' || (m as { role?: unknown }).role === 'model'),
        )
        .slice(-8)
        .map((m: { role: 'user' | 'model'; text: string }) => ({
          role: m.role,
          text: m.text.slice(0, 800),
        }));
    }
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  if (!message || message.length > 800) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  try {
    const contents = [
      ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user' as const, parts: [{ text: message }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.6 },
        }),
      },
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }

    const data = await res.json();
    const reply: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      return NextResponse.json({ error: 'empty_reply' }, { status: 502 });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch {
    return NextResponse.json({ error: 'network_error' }, { status: 502 });
  }
}
