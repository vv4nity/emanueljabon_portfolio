import type { IconType } from 'react-icons';
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiCplusplus,
  SiPostgresql,
  SiGnubash,
  SiPytorch,
  SiTensorflow,
  SiHuggingface,
  SiLangchain,
  SiScikitlearn,
  SiOpencv,
  SiNumpy,
  SiPandas,
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiFastapi,
  SiExpress,
  SiRedis,
  SiMongodb,
  SiDocker,
  SiVercel,
  SiGit,
  SiLinux,
  SiGithubactions,
  SiFlask,
  SiOpenai,
  SiPhp,
  SiMysql,
  SiApache,
  SiHtml5,
  SiGooglegemini,
  SiMediapipe,
  SiCloudflare,
  SiNetlify,
  SiVite,
  SiTailwindcss,
  SiFirebase,
  SiArduino,
  SiEspressif,
  SiSupabase,
} from 'react-icons/si';
import { TbDatabase, TbTerminal2, TbCloud, TbBox, TbVectorTriangle, TbScan, TbApi, TbUsersGroup, TbAntenna, TbPlugConnected } from 'react-icons/tb';

export type Tool = { icon: IconType; color: string };

export const TOOLS: Record<string, Tool> = {
  // Languages
  Python: { icon: SiPython, color: '#FFD43B' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
  'C++': { icon: SiCplusplus, color: '#00599C' },
  SQL: { icon: TbDatabase, color: '#E48E3F' },
  Bash: { icon: SiGnubash, color: '#A8C0A0' },

  // AI / ML
  PyTorch: { icon: SiPytorch, color: '#EE4C2C' },
  TensorFlow: { icon: SiTensorflow, color: '#FF6F00' },
  'Hugging Face': { icon: SiHuggingface, color: '#FFD21E' },
  LangChain: { icon: SiLangchain, color: '#1C3C3C' },
  'scikit-learn': { icon: SiScikitlearn, color: '#F7931E' },
  OpenCV: { icon: SiOpencv, color: '#5C3EE8' },
  NumPy: { icon: SiNumpy, color: '#4D77CF' },
  Pandas: { icon: SiPandas, color: '#150458' },
  OpenAI: { icon: SiOpenai, color: '#FFFFFF' },
  Pinecone: { icon: TbVectorTriangle, color: '#3CDFB0' },
  'Gemini 2.5': { icon: SiGooglegemini, color: '#8AB4F8' },
  Gemini: { icon: SiGooglegemini, color: '#8AB4F8' },
  MediaPipe: { icon: SiMediapipe, color: '#0097A7' },
  YOLOv8: { icon: TbScan, color: '#00FFFF' },
  'TensorFlow Lite': { icon: SiTensorflow, color: '#FF6F00' },

  // Web & Backend
  'Next.js': { icon: SiNextdotjs, color: '#FFFFFF' },
  React: { icon: SiReact, color: '#61DAFB' },
  'Node.js': { icon: SiNodedotjs, color: '#5FA04E' },
  FastAPI: { icon: SiFastapi, color: '#009688' },
  Flask: { icon: SiFlask, color: '#FFFFFF' },
  Express: { icon: SiExpress, color: '#FFFFFF' },
  PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
  Postgres: { icon: SiPostgresql, color: '#4169E1' },
  PHP: { icon: SiPhp, color: '#777BB4' },
  MySQL: { icon: SiMysql, color: '#4479A1' },
  Apache: { icon: SiApache, color: '#D22128' },
  'HTML/CSS': { icon: SiHtml5, color: '#E34F26' },
  Redis: { icon: SiRedis, color: '#FF4438' },
  Firebase: { icon: SiFirebase, color: '#FFCA28' },
  Arduino: { icon: SiArduino, color: '#00878F' },
  ESP32: { icon: SiEspressif, color: '#E7352C' },
  MongoDB: { icon: SiMongodb, color: '#47A248' },
  WebSockets: { icon: TbPlugConnected, color: '#8AA0FF' },
  Supabase: { icon: SiSupabase, color: '#3ECF8E' },
  IoT: { icon: TbAntenna, color: '#4FD1C5' },

  // DevOps
  Docker: { icon: SiDocker, color: '#2496ED' },
  AWS: { icon: TbCloud, color: '#FF9900' },
  Vercel: { icon: SiVercel, color: '#FFFFFF' },
  Netlify: { icon: SiNetlify, color: '#00C7B7' },
  Vite: { icon: SiVite, color: '#646CFF' },
  Tailwind: { icon: SiTailwindcss, color: '#38BDF8' },
  Git: { icon: SiGit, color: '#F05032' },
  Linux: { icon: SiLinux, color: '#FCC624' },
  'CI/CD': { icon: SiGithubactions, color: '#2088FF' },
  'Cloudflare Tunnel': { icon: SiCloudflare, color: '#F38020' },
  'Agile/Scrum': { icon: TbUsersGroup, color: '#9EE493' },
  'REST APIs': { icon: TbApi, color: '#8AA0FF' },
};

export const FALLBACK_TOOL: Tool = { icon: TbBox, color: '#C17BE8' };

export function getTool(name: string): Tool {
  return TOOLS[name] ?? FALLBACK_TOOL;
}

export const CATEGORY_ICON: Record<string, IconType> = {
  Languages: TbTerminal2,
  'AI / Machine Learning': SiPytorch,
  'Web & Backend': TbDatabase,
  'Tools & DevOps': SiDocker,
};
