import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import Link from 'next/link';
import { FiGithub, FiLinkedin, FiMail, FiFileText, FiArrowUpRight } from 'react-icons/fi';

// Parses "[Label](url)" markdown-style links out of bot replies and
// renders them as small pill chips with a link-appropriate icon —
// everything else stays as plain text (line breaks preserved by the
// caller's `whitespace-pre-line`).
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function pickIcon(url: string): IconType {
  if (url.startsWith('mailto:')) return FiMail;
  if (url.includes('github.com')) return FiGithub;
  if (url.includes('linkedin.com')) return FiLinkedin;
  if (url.startsWith('/') || url.endsWith('.pdf')) return FiFileText;
  return FiArrowUpRight;
}

function ChatLink({ href, label }: { href: string; label: string }) {
  const Icon = pickIcon(href);
  const className =
    'mx-0.5 inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-accent-1/30 bg-accent-1/[0.08] px-2.5 py-1 align-middle text-[12px] font-medium text-text no-underline transition-colors hover:border-accent-1/60 hover:bg-accent-1/[0.16]';

  const isInternal = href.startsWith('/');
  if (isInternal) {
    return (
      <Link href={href} className={className}>
        <Icon size={11} />
        {label}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <Icon size={11} />
      {label}
    </a>
  );
}

export function renderChatText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  LINK_RE.lastIndex = 0;

  while ((match = LINK_RE.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(<ChatLink key={key++} href={match[2]} label={match[1]} />);
    lastIndex = LINK_RE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return nodes;
}
