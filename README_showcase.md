# CPE Hardhatting 2026 — portfolio case study

A drop-in, self-contained **Next.js / React** case-study page with an interactive
carousel of the showcase slides. No external UI libraries — it brings its own styles.

## What's here

```
portfolio/
├─ HardhattingCaseStudy.tsx     ← the component (client component)
├─ public/showcase/*.webp       ← 10 web-optimized slides (~630 KB total)
└─ README.md
```

## Install (2 steps)

**1. Copy the files into your portfolio repo**

- Move `HardhattingCaseStudy.tsx` into your components folder
  (e.g. `components/HardhattingCaseStudy.tsx`).
- Copy the `public/showcase/` folder into your project's **`public/`**
  so the images resolve at `/showcase/slide-01.webp` … `/showcase/slide-10.webp`.

**2. Render it on a page**

App Router — create `app/work/hardhatting/page.tsx`:

```tsx
import HardhattingCaseStudy from "@/components/HardhattingCaseStudy";

export const metadata = {
  title: "CPE Hardhatting 2026 — Case Study",
  description: "Attendance & QR-seating platform for the PUP CpE Hardhatting Ceremony.",
};

export default function Page() {
  return <HardhattingCaseStudy />;
}
```

Pages Router — create `pages/work/hardhatting.tsx`:

```tsx
import HardhattingCaseStudy from "../../components/HardhattingCaseStudy";
export default function Page() {
  return <HardhattingCaseStudy />;
}
```

Then link to `/work/hardhatting` from your projects list. That's it.

## Customize

- **Live URL** — in the component, replace the `Live site ↗` `href="#"` with your
  deployed app URL (or delete that `<a>` if there's no public demo).
- **Colors** — all colors are CSS variables at the top of the `CSS` string
  (`--cream`, `--ink`, `--amber`, …). Change them to match your portfolio, or wrap
  the component so its cream card sits nicely on your page background.
- **Copy** — edit the `SLIDES`, `FEATURES`, and hero text arrays/strings at the top
  of the file.
- **Full-res downloads** — the parent `showcase-carousel/` folder has the original
  2160-px PNGs (portrait `carousel-*.png` and square `facebook-1x1/fb-*.png`) if you
  ever want print-quality or social versions.

## Notes

- The component is a **client component** (`"use client"`) because the carousel is
  interactive (arrows, dots, keyboard ←/→, touch-swipe). No effect on SEO — the
  surrounding page can still be a server component.
- Images use a plain `<img>` with `loading="lazy"` for portability. If you prefer
  `next/image`, swap the `<img className="hhc-slide">` for `<Image fill …>` inside a
  positioned wrapper.
