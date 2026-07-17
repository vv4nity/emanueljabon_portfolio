import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { AmbientOrbs } from '@/components/AmbientOrbs';
import { TopBar } from '@/components/TopBar';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import MiraFitCaseStudy from '@/components/mirafit/MiraFitCaseStudy';

export const metadata: Metadata = {
  title: 'MiraFit AI — Case Study',
  description:
    'MiraFit — an AI fitness coach that watches your form. Rep counting and A–F form grading through the camera, custom vision models, and Gemini-generated plans, all served from a Raspberry Pi 5.',
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

        <MiraFitCaseStudy />
      </div>

      <Footer />
    </main>
  );
}
