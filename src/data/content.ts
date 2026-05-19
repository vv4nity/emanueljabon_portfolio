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
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  instagram: 'https://instagram.com/yourusername',
  cvUrl: '/cv', // in-app viewer page
  cvFile: '/Emanuel_Jabon_CV.pdf', // actual PDF file in public/
  cvUpdated: 'May 2026',
  photoUrl: '/hero-photo.png', // place your photo at public/hero-photo.png
  availability: 'Open to roles · Summer 2026',
};

export const hero = {
  // Headline rendered as: "I engineer" + italic accent + " software" + muted closer
  line1: 'I engineer',
  italicWord: 'intelligent',
  line2Rest: 'software',
  closer: 'that ships.',
  lede:
    'Computer engineer specializing in machine learning systems and full-stack development. Currently building production-grade ML pipelines and crafting interfaces that feel inevitable.',
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
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: 'sentiment-classifier',
    number: '01',
    badge: 'ML',
    title: 'Sentiment Classifier',
    description:
      'BERT-based NLP model deployed via FastAPI & Docker. Achieved 94% accuracy on production data with sub-50ms latency.',
    tags: ['PyTorch', 'FastAPI', 'Docker', 'AWS'],
    github: 'https://github.com/yourusername/sentiment-classifier',
    featured: true,
  },
  {
    id: 'realtime-dashboard',
    number: '02',
    badge: 'WEB',
    title: 'Real-time Dashboard',
    description:
      'Full-stack analytics platform with live WebSocket streams. Sub-100ms updates across 50+ concurrent connections.',
    tags: ['Next.js', 'WebSockets', 'Postgres', 'Redis'],
    github: 'https://github.com/yourusername/realtime-dashboard',
    featured: true,
  },
  {
    id: 'image-segmentation',
    number: '03',
    badge: 'ML',
    title: 'Image Segmentation API',
    description:
      'U-Net model for medical image segmentation. Trained on 10K+ samples with 89% IoU score.',
    tags: ['TensorFlow', 'OpenCV', 'Flask'],
    github: 'https://github.com/yourusername/image-seg',
  },
  {
    id: 'rag-chatbot',
    number: '04',
    badge: 'AI',
    title: 'RAG Chatbot',
    description:
      'Retrieval-augmented generation chatbot using LangChain & Pinecone. Indexed 100K+ documents with sub-second retrieval.',
    tags: ['LangChain', 'Pinecone', 'OpenAI', 'Next.js'],
    github: 'https://github.com/yourusername/rag-chatbot',
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
    items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL', 'Bash'],
  },
  {
    name: 'AI / Machine Learning',
    items: ['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas'],
  },
  {
    name: 'Web & Backend',
    items: ['Next.js', 'React', 'Node.js', 'FastAPI', 'Express', 'PostgreSQL', 'Redis', 'MongoDB'],
  },
  {
    name: 'DevOps & Tools',
    items: ['Docker', 'AWS', 'Vercel', 'Git', 'Linux', 'CI/CD'],
  },
];

// ─────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────
export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  description: string;
  highlights?: string[];
  logo?: string;
};

export const experience: ExperienceItem[] = [
  {
    role: 'Software Developer Intern',
    org: 'American Express',
    period: 'Aug — Oct 2025',
    logo: '/logo-amex.png',
    description:
      'Contributed to enterprise software projects in a global financial services environment, collaborating with senior engineers on production-grade systems.',
    highlights: [
      'Developed backend services and internal tools, applying Agile workflows, version control, and code review best practices to ship reliable features.',
    ],
  },
  {
    role: 'IT Operations',
    org: 'Concentrix — EXXA',
    period: 'Jul — Sep 2025',
    logo: '/logo-concentrix.png',
    description:
      'Supported day-to-day IT operations including system monitoring, troubleshooting, and incident resolution across internal infrastructure.',
    highlights: [
      'Coordinated with technical teams to ensure uptime, deploy internal tools, and document recurring incidents to drive process improvements.',
    ],
  },
  {
    role: 'Full-Stack Web Developer Intern',
    org: 'ROC.PH',
    period: 'Jul — Sep 2024',
    logo: '/logo-rocph.jpg',
    description:
      'Developed responsive web applications using modern front-end frameworks and back-end APIs, contributing to both UI and database-layer features.',
    highlights: [
      'Collaborated in an Agile environment to plan sprints, conduct code reviews, and implement secure authentication and database integrations.',
    ],
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
