import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { Preloader } from '@/components/Preloader';
import { PageTransition } from '@/components/PageTransition';

const geistSans = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Emanuel Jabon — Computer Engineer & Artificial Intelligence &amp; Machine Learning Developer',
  description:
    'Computer engineer specializing in machine learning systems and full-stack development. Building production-grade ML pipelines and interfaces that ship.',
  keywords: ['Computer Engineer', 'Artificial Intelligence Engineer', 'Machine Learning Engineer', 'Full-stack Developer', 'Portfolio'],
  authors: [{ name: 'Emanuel Jabon' }],
  openGraph: {
    title: 'Emanuel Jabon — Computer Engineer & Artificial Intelligence &amp; Machine Learning Developer',
    description: 'Building intelligent systems at the intersection of AI & software.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans">
        <Preloader />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
