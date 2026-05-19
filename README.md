# Portfolio — Premium Edition

A sleek, premium portfolio built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.
Designed for AI/ML engineers and software developers. Dark glassmorphism, editorial typography, and signature details.

---

## ✨ What's included

- **Hero** — Animated headline with gradient italic serif accent, status pill, your photo with corner ticks & metadata overlays, floating "currently building" card, and a 4-column metrics strip.
- **Projects** — Two-column glass cards with hover animations, tech tags, and project numbering.
- **About** — Personal narrative + quick-facts sidebar.
- **Tech Stack** — Categorized chips with alternating accent colors.
- **Experience** — Vertical timeline with glass cards and gradient dots.
- **Writing/Blog** — List of essays with read time and tags.
- **Contact** — Working contact form (opens mail client) + social links.
- **Footer** — Location, version, social links.

---

## 🚀 Quick start (5 minutes)

### 1. Install Node.js (if you don't have it)
Get the **LTS version** from https://nodejs.org. Run `node -v` in your terminal to confirm.

### 2. Install dependencies
Open this folder in your terminal and run:
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
Open **http://localhost:3000** in your browser. You should see your portfolio.

---

## ✏️ Customize your content

**👉 Almost everything you need to edit lives in ONE file:** `src/data/content.ts`

Open that file and replace the placeholder values:

```ts
export const personal = {
  name: 'Your Name',            // ← your full name
  initials: 'YN',               // ← shown in the logo
  role: 'Engineer · Builder',
  location: 'Manila, PH',
  email: 'you@yourname.dev',    // ← your real email
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitter: 'https://twitter.com/yourusername',
  cvUrl: '/cv.pdf',             // ← drop your CV at public/cv.pdf
  photoUrl: '/hero-photo.png',  // ← already set up with your photo
  availability: 'Open to roles · Summer 2026',
};
```

Then update:
- `hero` — your headline copy
- `metrics` — your stats (projects shipped, years coding, etc.)
- `projects` — replace with your actual projects (add as many as you want)
- `stack` — your tech stack categories
- `experience` — your roles, internships, and education
- `blogPosts` — your articles (or remove this section entirely)

### Hero photo
Your photo is already in `public/hero-photo.png`. To replace it, just drop a new image at the same path. **Tip:** use a vertical (4:5 ratio) photo for best results.

### CV / Resume
Drop your CV as `public/cv.pdf`. The "CV" button in the nav will open it.

---

## 🌐 Deploy to Vercel (10 minutes)

### Option A — Through Vercel's website (easiest, no CLI)

1. **Create a GitHub repo** for this project:
   - Go to https://github.com/new → name it `portfolio` → create
   - In your terminal, inside this folder:
     ```bash
     git init
     git add .
     git commit -m "Initial portfolio"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
     git push -u origin main
     ```

2. **Deploy on Vercel**:
   - Sign up / log in at https://vercel.com (use your GitHub account)
   - Click **"Add New… → Project"**
   - Select your `portfolio` repo → click **Import**
   - Leave everything default → click **Deploy**
   - Wait ~60 seconds. You'll get a live URL like `your-portfolio.vercel.app` 🎉

3. **Custom domain (optional)**:
   - In your Vercel project → **Settings → Domains** → add your domain
   - Or buy a fresh one through Vercel's interface ($10–15/yr for `.dev` or `.me`)

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel
```
Follow the prompts. Done in ~2 minutes.

---

## 🔄 Update your portfolio later

Anytime you change `content.ts` or any file:
```bash
git add .
git commit -m "Update projects"
git push
```
Vercel auto-deploys on every push to `main`. Your site updates in ~30 seconds.

---

## 🎨 Design details

- **Color system**: Dark navy base (`#050507`) with purple→blue gradient accents (`#C17BE8` → `#6080FF`) pulled from the hero photo's lighting.
- **Typography**: Geist (body), Geist Mono (labels & timestamps), Instrument Serif italic (gradient accent words).
- **Atmosphere**: Three blurred radial orbs, fixed grain overlay, glassmorphic cards.
- **Animations**: Staggered Framer Motion reveals on scroll, hover lifts, pulsing signal dots.
- **Signature touches**: Section numbering (001, 002…), corner ticks on photo, camera metadata overlays, live timestamp in top bar.

---

## 🛠 Tech stack

- **Next.js 14** (App Router) — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **React Icons** — Icon library
- **Vercel** — Hosting (auto-deploys from GitHub)

---

## 📁 Project structure

```
portfolio/
├── public/
│   ├── hero-photo.png      ← Your photo
│   └── cv.pdf              ← Drop your CV here
├── src/
│   ├── app/
│   │   ├── layout.tsx      ← Fonts & metadata
│   │   ├── page.tsx        ← Composes all sections
│   │   └── globals.css     ← Base styles & grain texture
│   ├── components/         ← One file per section
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── About.tsx
│   │   ├── Stack.tsx
│   │   ├── Experience.tsx
│   │   ├── Writing.tsx
│   │   ├── Contact.tsx
│   │   ├── Nav.tsx
│   │   ├── TopBar.tsx
│   │   ├── Footer.tsx
│   │   └── AmbientOrbs.tsx
│   └── data/
│       └── content.ts      ← ✏️ EDIT THIS for all your content
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 💡 Tips for landing the job

1. **Pin your best 4–6 projects.** Quality over quantity. Each project should include the problem, your approach, and a measurable outcome.
2. **Include metrics.** "94% accuracy", "60% faster", "200+ users" — specifics beat adjectives.
3. **Show, don't tell.** Link every project to a live demo or GitHub repo.
4. **Keep the blog section** even if you only have 2 posts. It signals you can communicate technical ideas.
5. **Set up a custom domain.** `yourname.dev` looks 10× more professional than `your-portfolio-v3.vercel.app`.

Good luck with the job hunt! 🚀
