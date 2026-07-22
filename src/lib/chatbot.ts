// ============================================================
// 🤖 CHATBOT ANSWER ENGINE  (scripted — no API key, zero cost)
// ------------------------------------------------------------
// Answers questions about Emanuel in first person, pulling live
// from src/data/content.ts so it never goes out of sync.
//
// Matching strategy:
//   1. Specific project lookup (scored by matched title words)
//   2. Weighted intent scoring with word-boundary + stem matching
//   3. Topic intents outrank the generic "about me" intent
// ============================================================

import {
  personal,
  hero,
  metrics,
  projects,
  stack,
  experience,
  organizations,
  type Project,
} from '@/data/content';

export type ChatRole = 'bot' | 'user';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

// ─────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return text.split(' ').filter(Boolean);
}

// Levenshtein edit distance — used to tolerate small typos ("sall" → "call").
// Capped: any length gap > 2 returns early since it can't be a near-miss.
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Match a single keyword against the message tokens.
// Short keywords (≤3 chars) must match a whole word ("ai" won't match "email").
// Longer keywords match by:
//   - stem ("project" → "projects", "stud" → "studied")
//   - a short truncation of the keyword, but only when close in length
//     (guards against e.g. "link" falsely stemming to "linkedin")
//   - a 1-2 char typo on keywords of 5+ chars ("stak" → "stack")
//     (kept off 4-char keywords — too many unrelated real words sit
//     one edit apart, e.g. "give" vs "live", "call" vs "wall")
function hasWord(tokens: string[], kw: string): boolean {
  if (kw.length <= 3) return tokens.includes(kw);
  return tokens.some((t) => {
    if (t.startsWith(kw)) return true;
    if (t.length >= 4 && kw.length - t.length <= 2 && kw.startsWith(t)) return true;
    if (kw.length >= 5 && t.length >= 4) return editDistance(t, kw) <= (kw.length >= 7 ? 2 : 1);
    return false;
  });
}

// ─────────────────────────────────────────────
// Answer builders (functions so they read live data)
// ─────────────────────────────────────────────
function listProjects(): string {
  const lines = projects
    .map((p) => `• ${p.title} (${p.badge}) — ${p.tags.slice(0, 3).join(', ')}`)
    .join('\n');
  return `I've shipped ${projects.length}+ projects. Here are some:\n\n${lines}\n\nAsk me about any one by name and I'll go deeper.`;
}

function describeProject(p: Project): string {
  const link = p.link ? `\n\n🔗 Live: ${p.link}` : '';
  const repo = p.github ? `\n💻 Code: ${p.github}` : '';
  return `${p.title} (${p.badge}) — ${p.description}\n\nBuilt with: ${p.tags.join(', ')}.${link}${repo}`;
}

function describeStack(): string {
  const lines = stack.map((c) => `${c.name}: ${c.items.join(', ')}`).join('\n\n');
  return `Here's my toolkit:\n\n${lines}\n\nWant the story behind any of these? Just ask.`;
}

function describeAi(): string {
  const ml = stack.find((c) => c.name.includes('AI')) ?? stack[1];
  const aiProjects = projects.filter((p) => p.badge === 'AI' || p.badge === 'ML');
  const proj = aiProjects.map((p) => `• ${p.title} — ${p.description}`).join('\n\n');
  return `AI/ML is my core focus. I work with ${ml.items.join(', ')}.\n\nSome of my AI work:\n\n${proj}`;
}

function describeExperience(): string {
  const lines = experience
    .map((e) => `• ${e.role} @ ${e.org} (${e.period})\n   ${e.description}`)
    .join('\n\n');
  return `My work experience so far:\n\n${lines}`;
}

function describeOrgs(): string {
  const lines = organizations.map((o) => `• ${o.role} — ${o.name} (${o.period})`).join('\n');
  return `Outside of code, I stay active in the community:\n\n${lines}`;
}

// ─────────────────────────────────────────────
// Intent definitions
//   strong = high-confidence keywords (weight 3, or 4 for phrases)
//   weak   = supporting keywords (weight 1)
//   priority breaks ties; topic intents > generic "who" intent
// ─────────────────────────────────────────────
type Intent = {
  id: string;
  priority: number;
  strong: string[];
  weak: string[];
  answer: () => string;
};

const INTENTS: Intent[] = [
  {
    id: 'greeting',
    priority: 0,
    strong: ['hello', 'hey there', 'good morning', 'good evening', 'good afternoon', 'kumusta'],
    weak: ['hi', 'hey', 'yo', 'sup', 'hiya'],
    answer: () =>
      `Hey! 👋 I'm ${personal.name}'s AI — ask me anything about him: his projects, skills, AI work, experience, or how to get in touch. What would you like to know?`,
  },
  {
    id: 'who',
    priority: 1,
    strong: ['who are you', 'who is emanuel', 'who is this', 'what do you do', 'tell me about yourself', 'introduce'],
    weak: ['about you', 'about him', 'about emanuel', 'tell me about', 'bio', 'background', 'summary', 'yourself'],
    answer: () =>
      `I'm ${personal.name}, a ${personal.role} based in ${personal.location}. ${hero.lede} I'm ${personal.availability.toLowerCase()}.`,
  },
  {
    id: 'projects',
    priority: 3,
    strong: ['project', 'projects', 'portfolio', 'show me your work', 'what have you built', 'what have you made'],
    weak: ['built', 'build', 'made', 'apps', 'application', 'work', 'shipped', 'side project'],
    answer: listProjects,
  },
  {
    id: 'skills',
    priority: 3,
    strong: ['skill', 'tech stack', 'technolog', 'programming language', 'framework', 'what tools', 'what can you do'],
    weak: ['stack', 'tool', 'expertise', 'proficient', 'good at', 'language', 'libraries'],
    answer: describeStack,
  },
  {
    id: 'ai',
    priority: 4,
    strong: ['machine learning', 'artificial intelligence', 'ai work', 'ai experience', 'your ai', 'deep learning', 'computer vision', 'neural network', 'ml work', 'ml model'],
    weak: ['ai', 'ml', 'model', 'pytorch', 'tensorflow', 'mediapipe', 'yolo', 'nlp', 'vision', 'pose'],
    answer: describeAi,
  },
  {
    id: 'experience',
    priority: 3,
    strong: ['experience', 'work history', 'internship', 'career', 'worked at', 'past job', 'employment'],
    weak: ['intern', 'job', 'company', 'companies', 'role', 'amex', 'concentrix', 'roc'],
    answer: describeExperience,
  },
  {
    id: 'education',
    priority: 3,
    strong: ['education', 'university', 'college', 'degree', 'what did you study', 'where did you study', 'school'],
    weak: ['stud', 'pup', 'polytechnic', 'course', 'graduate', 'student', 'major', 'bscpe'],
    answer: () =>
      `I'm a Computer Engineering (BSCpE) student at the Polytechnic University of the Philippines, graduating in 2026. My focus is system development and AI / Machine Learning — and I learn most by building and shipping real projects.`,
  },
  {
    id: 'organizations',
    priority: 3,
    strong: ['organization', 'leadership', 'volunteer', 'extracurricular', 'community involvement'],
    weak: ['org', 'community', 'club', 'icpep', 'gdg', 'officer', 'committee'],
    answer: describeOrgs,
  },
  {
    id: 'contact',
    priority: 3,
    strong: ['contact', 'how can i reach', 'reach you', 'get in touch', 'email you', 'hire you', 'are you available', 'are you hiring', 'how can i call', 'linkedin', 'github'],
    weak: ['email', 'reach', 'hire', 'hiring', 'available', 'availability', 'connect', 'message', 'recruit', 'opportunity', 'social', 'call'],
    answer: () =>
      `I'd love to connect — I'm ${personal.availability.toLowerCase()}.\n\n📧 Email: ${personal.email}\n💼 LinkedIn: ${personal.linkedin}\n💻 GitHub: ${personal.github}\n\nOr use the contact form at the bottom of the page — I usually reply within 24 hours.`,
  },
  {
    id: 'cv',
    priority: 4,
    strong: ['resume', 'curriculum vitae', 'download your cv', 'view your cv'],
    weak: ['cv', 'resume', 'download', 'pdf'],
    answer: () =>
      `You can view or download my CV right here — there's a CV page at ${personal.cvUrl} and a downloadable PDF (${personal.cvFile}). Last updated ${personal.cvUpdated}.`,
  },
  {
    id: 'location',
    priority: 3,
    strong: ['where are you', 'where do you live', 'where based', 'your location', 'what timezone', 'remote work'],
    weak: ['location', 'based', 'live', 'country', 'timezone', 'philippines', 'manila', 'remote'],
    answer: () =>
      `I'm based in ${personal.location} (${personal.timezone}). I'm comfortable working remotely and collaborating across time zones.`,
  },
  {
    id: 'stats',
    priority: 2,
    strong: ['how many projects', 'how many years', 'your stats', 'how many models'],
    weak: ['stat', 'metric', 'numbers', 'years'],
    answer: () => {
      const lines = metrics.map((m) => `• ${m.value}${m.suffix} ${m.label}`).join('\n');
      return `A few numbers that sum me up:\n\n${lines}`;
    },
  },
  {
    id: 'currently',
    priority: 3,
    strong: ['what are you working on', 'currently building', 'working on now', 'latest project'],
    weak: ['currently', 'right now', 'these days', 'nowadays'],
    answer: () =>
      `${hero.currentlyBuilding.label}: ${hero.currentlyBuilding.detail}. I'm always shipping something new — check the projects section for the latest.`,
  },
  {
    id: 'personality',
    priority: 2,
    strong: ['what drives you', 'why do you', 'your passion', 'what motivates', 'hobbies', 'fun fact'],
    weak: ['hobby', 'passion', 'interest', 'motivat', 'enjoy'],
    answer: () =>
      `What drives me is building things that are genuinely useful — I love the moment an idea becomes something people can actually use. I'm endlessly curious (that's the ∞ in my stats 😄), I learn by shipping, and I'm especially drawn to the intersection of AI and real-world software.`,
  },
  {
    id: 'thanks',
    priority: 1,
    strong: ['thank you', 'thanks', 'appreciate it'],
    weak: ['thanks', 'thx', 'awesome', 'great help'],
    answer: () =>
      `Glad I could help! 🙌 Anything else you'd like to know — projects, skills, AI work, or how to reach me?`,
  },
];

// ─────────────────────────────────────────────
// Per-project keyword index (built once)
// ─────────────────────────────────────────────
const PROJECT_STOPWORDS = new Set([
  'website', 'system', 'your', 'with', 'from', 'that', 'powered', 'automated', 'app', 'apps', 'project',
]);

const PROJECT_INDEX = projects.map((p) => {
  const words = `${p.title} ${p.id.replace(/-/g, ' ')}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !PROJECT_STOPWORDS.has(w));
  return { project: p, keywords: Array.from(new Set(words)) };
});

function findProject(tokens: string[]): Project | null {
  let best: { project: Project; hits: number } | null = null;
  for (const entry of PROJECT_INDEX) {
    const hits = entry.keywords.filter((kw) => hasWord(tokens, kw)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { project: entry.project, hits };
  }
  return best ? best.project : null;
}

// ─────────────────────────────────────────────
// Scoring
// ─────────────────────────────────────────────
function scoreIntent(text: string, tokens: string[], intent: Intent): number {
  let score = 0;
  for (const kw of intent.strong) {
    if (kw.includes(' ')) {
      if (text.includes(kw)) score += 4;
    } else if (hasWord(tokens, kw)) score += 3;
  }
  for (const kw of intent.weak) {
    if (kw.includes(' ')) {
      if (text.includes(kw)) score += 1;
    } else if (hasWord(tokens, kw)) score += 1;
  }
  return score;
}

export const FALLBACK = () =>
  `Hmm, I'm not sure I caught that — I'm a focused little assistant. I can tell you about:\n\n• My projects (try a name like “MiraFit”)\n• My skills & tech stack\n• My AI / ML work\n• My experience & education\n• How to get in touch\n\nWhat would you like to know? Or email me directly at ${personal.email}.`;

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────
// Returns an instant scripted answer, or null when nothing matches
// confidently — the caller can then fall back to the Gemini-backed
// /api/chat route for an open-ended, grounded answer.
export function getLocalReply(rawInput: string): string | null {
  const text = normalize(rawInput);
  if (!text) return null;
  const tokens = tokenize(text);

  // Score all intents first so we can compare against a project match.
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    const score = scoreIntent(text, tokens, intent);
    if (score > 0) {
      if (!best || score > best.score || (score === best.score && intent.priority > best.intent.priority)) {
        best = { intent, score };
      }
    }
  }

  // A specific project is mentioned — answer about it unless the user clearly
  // asked to list/overview all projects, or a stronger intent dominates.
  const wantsList = ['all projects', 'your projects', 'list', 'every', 'overview'].some((p) => text.includes(p));
  const project = findProject(tokens);
  if (project && !wantsList && (!best || best.score <= 4)) {
    return describeProject(project);
  }

  if (best) return best.intent.answer();
  return null;
}

// Compact, factual grounding context handed to Gemini so it answers as
// Emanuel using only real information — never invented achievements.
export function buildGroundingContext(): string {
  const projLines = projects
    .map((p) => {
      const links = [p.link && `Live: ${p.link}`, p.github && `Code: ${p.github}`].filter(Boolean).join(' · ');
      return `- ${p.title} (${p.badge}): ${p.description} [${p.tags.join(', ')}]${links ? ` (${links})` : ''}`;
    })
    .join('\n');
  const stackLines = stack.map((c) => `${c.name}: ${c.items.join(', ')}`).join('\n');
  const expLines = experience.map((e) => `- ${e.role} @ ${e.org} (${e.period}): ${e.description}`).join('\n');
  const orgLines = organizations.map((o) => `- ${o.role} — ${o.name} (${o.period})`).join('\n');

  return `Name: ${personal.name}
Role: ${personal.role}
Location: ${personal.location} (${personal.timezone})
Availability: ${personal.availability}
Email: ${personal.email}
GitHub: ${personal.github}
LinkedIn: ${personal.linkedin}
CV: ${personal.cvUrl} (PDF: ${personal.cvFile}, last updated ${personal.cvUpdated})

Summary: ${hero.lede}
Currently building: ${hero.currentlyBuilding.detail}

Projects:
${projLines}

Tech stack:
${stackLines}

Experience:
${expLines}

Organizations:
${orgLines}`;
}

// Suggested starter chips shown in the UI
export const SUGGESTIONS: string[] = [
  'Who are you?',
  'Show me your projects',
  'What are your skills?',
  'Tell me about your AI work',
  'How can I reach you?',
];

export const GREETING = `Hi! I'm ${personal.name}'s AI assistant. 🤖\nAsk me anything about his work, skills, or how to get in touch.`;
