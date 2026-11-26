# Portfolio redesign: handoff brief

This folder holds the approved redesign of chloefeierabend.com. Build it into the existing site, following this brief.

## What's in this folder

```
design-handoff/
  HANDOFF.md            this brief
  pages/
    home-desktop.html   homepage, desktop (designed at 1440px wide)
    home-mobile.html    homepage, phone (designed at 390px wide)
    work.html           work index
    about.html          about page
    contact.html        contact page
    gatore.html         GATORE case study (new version)
  assets/
    bird-creature.png              Chloe's hand-drawn character (transparent)
    bird-head-logo.png             nav logo / brand mark
    favicon-32.png, favicon-64.png favicons
    gatore-preferences-before.png  GATORE case study, section 05
    gatore-preferences-after.png   GATORE case study, section 05
```

Open the HTML files in a browser to see each page. They are static references: treat them as the source of truth for layout, copy, colours and spacing, not as production code to paste in.

## The task

1. Look at the existing repo first and work in its stack and conventions. Don't introduce a new framework.
2. Build every page as **one responsive page**. Only the homepage has a dedicated phone design (`home-mobile.html`). Use the same rules for the other pages on phones: one column, 20px side padding, the nav collapses into a "menu" button, the giant headings scale down, and side-by-side layouts stack.
3. Keep existing URLs. The GATORE case study stays at `/gatore/` and Karla Learn at `/financial-literacy/`. Put the new pages at `/work/`, `/about/` and `/contact/`, or match however the repo already structures pages.
4. Build the shared header and footer once and reuse them on every page, including the existing Karla Learn case study. Karla Learn hasn't been redesigned yet: keep its content, but give it the new header, fonts and colours so it doesn't look out of place.
5. Don't change any copy without asking. The wording has been carefully checked for accuracy.
6. Show me the plan before making large changes, and don't commit or push without asking.

## Shared parts

- **Header:** the bird-head logo on the left (links home, `aria-label="Chloe Feierabend, home"`, the image has empty alt text). Nav on the right in DM Mono: `./work`, `./about`, `./side-quests`, `./contact`. The current page's link gets a 3px teal underline and `aria-current="page"`.
- **Hide `./side-quests` for now.** That page doesn't exist yet.
- **Section pattern:** a small mono label in brackets, like `[featured work]`, above a large Bricolage heading. Sections are separated by 2px ink lines, with generous space between them. Keep that space, since it's part of the look.
- **Paper grain:** a very faint SVG noise overlay across each page, at 7% opacity. Keep it subtle, or drop it if it hurts performance.
- **Page titles:** "Chloe Feierabend: UX/UI & Product Designer" on the homepage, and "[Page] · Chloe Feierabend" on the others.

## Design tokens

| Token | Value |
|---|---|
| Background (cream) | `#F7F1E6` |
| Ink (text, borders) | `#2B1F17` |
| Secondary text | `#5C4A3C` |
| Teal accent (underlines, dots, big numbers) | `#1B9A8F` |
| Teal for small text (passes contrast) | `#12766D` |
| Mustard ("in progress" tag) | `#E8B23A` |
| Image tints | `#D7EEEA` (GATORE), `#F6E6BC` (Karla Learn), `#E6E0F4` (Fyzz) |
| Display font | Bricolage Grotesque 800 (Google Fonts) |
| Body font | DM Sans 400/500/600 |
| Mono font (labels, tags, nav) | DM Mono 400 |
| Borders | 2px ink for section lines and cards, 1.5px for tags and inner dividers |
| Radius | 16px cards and large images, 12px buttons, pill-shaped tags |
| Content width | max 1200px, 40px side padding on desktop |

## Page notes

**Home:** the bird stands at the bottom right of the hero, with its feet on the line that ends the hero. Then come the three-item highlights strip, the three featured work cards (exactly three tags each, so titles line up, with links pinned to the bottom of each card), and "Decisions I'm proud of".

**Work:** three case study rows, then a "Smaller pieces" list. Fyzz has no case study yet, so it shows "Case study coming soon" with no link.

**About:** the intro with a photo frame (the bird-head logo sits on its corner like a sticker), "What I care about", the experience timeline, toolkit, "Where I'm headed", and "Outside of work" with the full bird.

**Contact:** "Let's talk.", the bird on the hero line, then four large link rows (email, LinkedIn, resume, GitHub). There's no contact form on purpose.

**GATORE case study:** replace the existing `/gatore/` page content with this version. It's one continuous page, with sections 01–07. Reuse the existing GATORE images already in the repo for the placeholder boxes (the logo, the hero, the decision screens, the owner dashboard, a customer screen and the final screens gallery). The two preferences screenshots are included in `assets/`.

## Placeholders to fill

- **Images:** any box with `[ ... ]` text is a placeholder. Use existing project images from the repo where they exist, and ask me for anything missing (for example the About page photo, Karla Learn and Fyzz screenshots).
- **Links:** all buttons and nav links point to `#`. Wire them to the real pages, the resume PDF, LinkedIn and email. The contact page shows `[your email]`; ask me for the address. The GitHub link assumes the username `chloefeierabend`, so confirm it from the repo.

## Accessibility requirements (non-negotiable)

- Use real `<a>` and `<button>` elements, with visible focus styles. Touch targets must be at least 44px.
- Keep the alt text from the designs. Decorative images and SVGs stay hidden from screen readers (`alt=""` or `aria-hidden="true"`).
- Body text must meet 4.5:1 contrast. Use `#12766D`, not `#1B9A8F`, for small teal text.
- Wrap any animation in `prefers-reduced-motion`.

## Cleanup

The HTML files may contain unused CSS left over from earlier explorations (for example the `.flapL` and `.flapR` animations, and the `.ink` classes). Leave that out.
