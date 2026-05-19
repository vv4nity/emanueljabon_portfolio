# emanueljabon_portfolio

My personal site. Built it because the templated ones felt soulless and I wanted somewhere to point recruiters that actually looks like me. BSCpE student in Manila, into ML systems and full-stack work.

Live at: (link goes here once Vercel finishes building)

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Most of the content lives in `src/data/content.ts` — name, bio, projects, stack, experience. If I want to add a new project I just append to that array.

## Contact form

The form on the contact section posts to Web3Forms and emails me directly. The access key is in `.env.local` (gitignored). If you're cloning this and want the form to work, get your own free key at web3forms.com and put it in a `.env.local`:

```
NEXT_PUBLIC_WEB3FORMS_KEY=your-key-here
```

On Vercel I added the same env var in project settings so it works in production too.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind
- Framer Motion for the animations
- React Icons for the brand logos in the stack section

## Notes to self

- Hero photo lives at `public/hero-photo.png`. Replace and the site picks it up — don't forget to clear `.next/cache/images` if it gets stuck on the old one.
- The preloader is in `src/components/Preloader.tsx`. Runs on every refresh.
- Anchor links use `/#section` so they work from the `/projects` page too.
- Adding a new tool icon: edit `src/lib/toolIcons.ts`, both the Stack section and project tags will pick it up automatically.

## Deploy

Pushes to `main` auto-deploy on Vercel. No CI config needed — Vercel handles it.
