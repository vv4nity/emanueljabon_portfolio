// ============================================================
// 📝 EDIT THIS FILE TO CUSTOMIZE YOUR PORTFOLIO CONTENT
// ============================================================

export const personal = {
  name: 'Emanuel Jabon',
  initials: 'EJ',
  role: 'Engineer · Builder',
  location: 'Manila, PH',
  timezone: 'GMT+8',
  email: 'emanueljabon18@gmail.com',
  github: 'https://github.com/vv4nity',
  linkedin: 'https://linkedin.com/in/emanueljabon',
  instagram: 'https://instagram.com/vv4nity',
  cvUrl: '/cv', // in-app viewer page
  cvFile: '/Emanuel_Jabon_CV.pdf', // actual PDF file in public/
  cvUpdated: 'Jul 2026',
  photoUrl: '/hero-photo.png', // place your photo at public/hero-photo.png
  availability: 'Open to roles · Summer 2026',
};

export const hero = {
  // Headline rendered as: "I engineer" + italic accent + " software" + muted closer
  line1: 'I build',
  italicWord: 'thoughtful',
  line2Rest: 'software',
  closer: 'with care.',
  lede:
    'Computer Engineering graduate from PUP, focused on system development and applied AI/ML. I build and ship production-grade software — from responsive front ends and REST APIs to machine-learning pipelines and their deployment.',
  credentials: ['BSCpE · 2026', '12+ projects shipped', 'Open source'],
  currentlyBuilding: {
    label: 'Currently building',
    detail: 'ml-pipeline-v2 → in progress',
  },
};

export const metrics = [
  { value: '12', suffix: '+', label: 'Projects shipped' },
  { value: '3', suffix: 'yr', label: 'Building' },
  { value: '8', suffix: '+', label: 'ML models' },
  { value: '∞', suffix: '', label: 'Curiosity', italic: true },
];

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
export type Project = {
  id: string;
  number: string;
  badge: string; // ML, WEB, IOT, etc.
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  caseStudy?: string; // internal route to a full case-study page
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: 'mirafit-ai',
    number: '01',
    badge: 'AI',
    title: 'MiraFit AI',
    description:
      'Real-time pose-estimation and exercise-validation pipeline (MediaPipe + YOLOv8) reaching 95% rep-counting accuracy with live form feedback and no wearables. Deployed on-device to a Raspberry Pi at 60 FPS, with Gemini 2.5 generating personalized workout and meal plans from body type, health conditions, and dietary inputs.',
    tags: ['Python', 'Flask', 'MediaPipe', 'YOLOv8', 'TensorFlow Lite', 'Gemini 2.5'],
    github: 'https://github.com/vv4nity/mirafit_bodyscan',
    caseStudy: '/projects/mirafit',
    featured: true,
  },
  {
    id: 'cpe-hardhatting-2026',
    number: '02',
    badge: 'WEB',
    title: 'CpE Hardhatting Ceremony 2026',
    description:
      'The official QR-pass, check-in, and reserved-seating platform for the PUP Computer Engineering Hardhatting Ceremony — solo-developed for 382 attendees across 8 class blocks. Invite-based onboarding, JWT-signed QR passes with a live seat map, a full-screen camera check-in scanner, and a real-time admin dashboard with role-based access enforced via Supabase Row-Level Security.',
    tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Vercel'],
    github: 'https://github.com/vv4nity/cpe-hardhatting-2026',
    caseStudy: '/projects/hardhatting',
    featured: true,
  },
  {
    id: 'mirafit-admin-dashboard',
    number: '03',
    badge: 'WEB',
    title: 'MiraFit Admin Dashboard',
    description:
      'Centralized admin platform managing 100+ user accounts, workout data, and AI-generated plan statistics — deployed and maintained in production. Analytics modules track engagement and system-health metrics including active users, plan-completion rates, and backend/AI-server health.',
    tags: ['PHP', 'MySQL', 'JavaScript', 'Node.js', 'Apache'],
    caseStudy: '/projects/mirafit-admin',
    featured: true,
  },
  {
    id: 'solar-watering-system',
    number: '04',
    badge: 'IOT',
    title: 'Solar-Powered Automated Watering System',
    description:
      'IoT watering system powered by solar energy with a live monitoring dashboard — tracks soil moisture and automates irrigation, keeping plants watered off-grid without manual intervention.',
    tags: ['IoT', 'Arduino', 'React', 'Vercel'],
    link: 'https://solar-watering-dashboard.vercel.app',
    github: 'https://github.com/vv4nity/solar-watering-dashboard',
    caseStudy: '/projects/solar-watering',
  },
  {
    id: 'dorm-bill-splitter',
    number: '05',
    badge: 'WEB',
    title: 'Dorm Bill Splitter',
    description:
      'Web app for dormmates to split shared bills fairly — track expenses, divide costs across roommates, and see who owes what at a glance.',
    tags: ['React', 'Vite', 'Tailwind', 'Vercel'],
    link: 'https://dorm-bill-splitter.vercel.app',
    github: 'https://github.com/vv4nity/dorm-bill-splitter.git',
    caseStudy: '/projects/bill-splitter',
  },
  {
    id: 'balai-ni-juan',
    number: '06',
    badge: 'WEB',
    title: 'Balai ni Juan',
    description:
      'Client project — a booking website for a private event venue. Showcase pages, appointment booking flow, authentication, and a dark mode toggle, designed for weddings, birthdays, and celebrations.',
    tags: ['React', 'Vite', 'Tailwind', 'Vercel'],
    link: 'https://balai-ni-juan.vercel.app',
  },
  {
    id: 'emans-grind',
    number: '07',
    badge: 'WEB',
    title: "Eman's Grind Coffee Shop",
    description:
      'Landing page for a specialty coffee shop — menu showcase, pricing, ordering interface, and contact integration with Google Maps and email.',
    tags: ['HTML/CSS', 'JavaScript', 'Netlify'],
    link: 'https://emans-grind-coffeeshop.netlify.app',
  },
  {
    id: 'pup-interactive-map',
    number: '08',
    badge: 'WEB',
    title: 'PUP Interactive Map',
    description:
      'Interactive vicinity map for the Polytechnic University of the Philippines with numbered location markers and points of interest for visitors and students.',
    tags: ['HTML/CSS', 'JavaScript', 'Netlify'],
    link: 'https://pup-interactive-map.netlify.app',
  },
  {
    id: 'calculator',
    number: '09',
    badge: 'WEB',
    title: 'Calculator Website',
    description:
      'Scientific calculator with trigonometric, logarithmic, and factorial functions, plus binary, octal, and hexadecimal number-system conversions.',
    tags: ['HTML/CSS', 'JavaScript', 'Netlify'],
    link: 'https://calculator-by-emanuel.netlify.app',
  },
];

// ─────────────────────────────────────────────
// TECH STACK
// ─────────────────────────────────────────────
export type StackCategory = {
  name: string;
  items: string[];
};

export const stack: StackCategory[] = [
  {
    name: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'PHP', 'C++', 'SQL', 'HTML/CSS'],
  },
  {
    name: 'AI / Machine Learning',
    items: ['PyTorch', 'TensorFlow Lite', 'MediaPipe', 'YOLOv8', 'scikit-learn', 'Gemini', 'NumPy', 'Pandas'],
  },
  {
    name: 'Web & Backend',
    items: ['Next.js', 'React', 'Tailwind', 'Node.js', 'Flask', 'PHP', 'Supabase', 'MySQL', 'PostgreSQL'],
  },
  {
    name: 'Tools & DevOps',
    items: ['Docker', 'Git', 'Apache', 'Cloudflare Tunnel', 'Linux', 'Vercel'],
  },
];

// ─────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────
export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  description?: string;
  // Highlights support **bold** markers to emphasize quantified metrics.
  highlights?: string[];
  logo?: string;
};

export const experience: ExperienceItem[] = [
  {
    role: 'Software Engineering Intern',
    org: 'American Express',
    period: 'Aug — Oct 2025',
    logo: '/logo-amex.png',
    highlights: [
      'Developed and maintained backend services and internal tools for production-grade systems in a global financial-services environment, working within a **10-person software engineering team** through code reviews and Agile sprints.',
      'Shipped **50+ features** across **6 sprints** through Git-based CI/CD pipelines, writing code that cleared peer review and integrated into enterprise applications.',
    ],
  },
  {
    role: 'IT Operations',
    org: 'Concentrix — EXXA',
    period: 'Jul — Sep 2025',
    logo: '/logo-concentrix.png',
    highlights: [
      'Monitored, diagnosed, and resolved **200+ tickets per week** across internal infrastructure, helping sustain **98% uptime**.',
      'Rolled out internal tools alongside technical teams and documented recurring issues, reducing repeat incidents by **30%**.',
    ],
  },
  {
    role: 'Full-Stack Web Developer Intern',
    org: 'ROC.PH',
    period: 'Jul — Sep 2024',
    logo: '/logo-rocph.jpg',
    highlights: [
      'Delivered **15+ responsive web pages** backed by REST APIs, spanning front-end UI and database-layer features.',
      'Implemented secure authentication, database integrations, and **10+ REST endpoints** for an app serving **400+ users**, built across Agile sprints with peer code reviews.',
    ],
  },
];

// ─────────────────────────────────────────────
// ORGANIZATIONS
// ─────────────────────────────────────────────
export type Organization = {
  name: string;
  shortName?: string; // used on mobile when name overflows
  role: string;
  period: string;
  category?: 'Tech' | 'Student' | 'Community';
  logo?: string; // optional path under /public, e.g. '/org-something.png'
  logoBg?: string; // optional CSS background for the logo tile (use for transparent PNGs)
  link?: string;
};

export const organizations: Organization[] = [
  {
    name: 'ICPEP Student Edition - PUP',
    shortName: 'ICPEP SE - PUP',
    role: 'Vice President for Graphics',
    period: 'Sep 2025 — Jul 2026',
    category: 'Tech',
    logo: '/icpep.png',
    logoBg: '#ffffff',
  },
  {
    name: 'Google Developer Groups - PUP',
    shortName: 'GDG - PUP',
    role: 'Audio-Visual & Animations Co-Lead',
    period: 'Sep 2025 — Jul 2026',
    category: 'Tech',
    logo: '/gdgpup_logo.jpeg',
  },
  {
    name: 'PUP ACCESS',
    role: 'Junior Officer · Creatives Committee',
    period: 'Dec 2024 — Jul 2025',
    category: 'Student',
    logo: '/access.jpeg',
  },
  {
    name: 'Arduino Day Philippines',
    shortName: 'Arduino Day PH',
    role: 'Creatives & Multimedia Team',
    period: 'Feb — Mar 2025',
    category: 'Community',
    logo: '/arduinodayph_logo.jpeg',
  },
];

// ─────────────────────────────────────────────
// BLOG / WRITING
// ─────────────────────────────────────────────
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  link?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 'fine-tuning-bert',
    title: 'Fine-tuning BERT for production: lessons from a 3am deployment',
    excerpt:
      'What I learned shipping my first NLP model — quantization, batching strategies, and why p99 latency matters more than accuracy.',
    date: 'Mar 2026',
    readTime: '8 min',
    tags: ['ML', 'BERT', 'Production'],
  },
  {
    id: 'nextjs-websockets',
    title: 'Building real-time dashboards with Next.js and WebSockets',
    excerpt:
      'A pragmatic guide to streaming live data in Next.js 14 — including the gotchas nobody warns you about.',
    date: 'Feb 2026',
    readTime: '12 min',
    tags: ['Next.js', 'WebSockets', 'Full-stack'],
  },
  {
    id: 'rag-from-scratch',
    title: 'RAG from scratch: why I stopped using LangChain (mostly)',
    excerpt:
      'After three RAG projects, here\'s what I keep, what I drop, and what I build myself.',
    date: 'Jan 2026',
    readTime: '10 min',
    tags: ['RAG', 'LLM', 'Architecture'],
  },
];
