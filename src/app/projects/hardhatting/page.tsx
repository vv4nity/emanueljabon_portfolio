import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { AmbientOrbs } from '@/components/AmbientOrbs';
import { TopBar } from '@/components/TopBar';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import HardhattingCaseStudy from '@/components/HardhattingCaseStudy';

export const metadata: Metadata = {
  title: 'CPE Hardhatting 2026 — Case Study',
  description:
    'Attendance & QR-seating platform for the PUP CpE Hardhatting Ceremony — invite-only onboarding, offline-first scanning, and a realtime command center.',
};

export default function Page() {
  return (
    <main id="top" className="relative overflow-hidden">
      <AmbientOrbs />
      <TopBar />
      <Nav />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-10 md:pt-24">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-faint transition-colors hover:text-text md:mb-10"
        >
          <FiArrowLeft size={12} />
          Back to projects
        </Link>

        <HardhattingCaseStudy />
      </div>

      <Footer />
    </main>
  );
}
