<div align="center">

# DEVIL MAY CRY 5 — EXPERIENCE

**A cinematic, fan-made Devil May Cry microsite.**
Gothic UI, style ranks, a playable Bloody Palace and a lot of red light.

_Devils never cry._

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white&labelColor=111114)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white&labelColor=111114)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white&labelColor=111114)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white&labelColor=111114)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-animations-c8102e?logo=framer&logoColor=white&labelColor=111114)
![License](https://img.shields.io/badge/code-MIT-8b8d96?labelColor=111114)

![Hero](docs/screenshots/hero.jpg)

</div>

> **Fan project.** Not affiliated with or endorsed by CAPCOM. Devil May Cry and all related names, characters
> and artwork belong to CAPCOM. All official artwork © CAPCOM, used here for a non-commercial fan project.

---

## ✦ Features

|                          |                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Cinematic intro**      | "Red Grave City — Loading hell..." loader, then a staged hero reveal: title, red light sweep, background, embers.                                |
| **Mouse parallax hero**  | Background, foreground and particles move at different depths. Turns into a crossfading Ken Burns slideshow when you add key art.                |
| **The Hunters**          | Six expanding character panels (Dante, Vergil, Nero, Lady, Trish, V) with full-screen dossiers, verified in-game quotes and keyboard navigation. |
| **Style Rank**           | Scroll-driven D → SSS meter with screen shake, shockwaves, light rays and particles on _Smokin' Sexy Style_.                                     |
| **Before the Nightmare** | Pinned scroll story based on the prequel novel; the image card opens into a full-bleed frame at the end.                                         |
| **Devil Arms**           | Scroll-jacked horizontal armoury of seven weapons, with real move lists.                                                                         |
| **Bestiary**             | A "classified database": demons stay as silhouettes until you scan them. Filter by enemy or boss.                                                |
| **Universe**             | Animated lore timeline from Sparda to the Qliphoth.                                                                                              |
| **Media**                | The official DMC5 trailers in a cinematic YouTube player.                                                                                        |
| **Gallery**              | Poster wall with parallax columns and a full-screen viewer (keyboard and swipe).                                                                 |
| **Bloody Palace**        | A playable arcade mini-game: strike to clear floors before the clock runs out. Your best floor is saved.                                         |
| **Details**              | Custom cursor with contextual labels, hidden sword-slash Easter egg, synthesized sound (off by default), grain, scanlines, fog, scroll HUD.      |

<details>
<summary><b>Screenshots</b></summary>

|                                                      |                                                |
| ---------------------------------------------------- | ---------------------------------------------- |
| ![Characters](docs/screenshots/characters.jpg)       | ![Style rank](docs/screenshots/style-rank.jpg) |
| ![Weapons](docs/screenshots/weapons.jpg)             | ![Bestiary](docs/screenshots/bestiary.jpg)     |
| ![Bloody Palace](docs/screenshots/bloody-palace.jpg) | ![Mobile](docs/screenshots/mobile.jpg)         |

_These screenshots show the bundled placeholder art. Add official art locally for the full look._

</details>

---

## ✦ Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite 8**
- **Tailwind CSS 4**: design tokens live in `src/index.css` (`@theme`)
- **Framer Motion**: every animation is transform/opacity/clip-path based
- **Lucide React**: icons
- **@fontsource**: self-hosted Cinzel, Cormorant Garamond, Barlow and Barlow Condensed
- **Web Audio API**: original synthesized drone and SFX, no audio files

No other runtime dependencies.

---

## ✦ Getting started

You need **Node.js 20.19+ or 22.12+** and about 250 MB of free disk space.

````bash
# Devil May Cry — Fan-made Cinematic Microsite

An unofficial, non-commercial tribute built with React, TypeScript, Vite, Tailwind CSS v4, Framer Motion and Lucide.

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build
````

## Structure

```
public/assets/            ← every image lives here (swap freely)
  backgrounds/  hero-bg.svg · hero-sword.svg · palace.svg
  characters/   dante · vergil · nero · lady · trish · v   (.svg)
  weapons/      rebellion · yamato · red-queen · blue-rose · devil-sword-dante · balrog · cerberus
  demons/       hell-caina · empusa · fury · nobody · goliath · artemis · cavaliere-angelo · urizen
  icons/        emblem.svg
scripts/generate-assets.mjs  ← regenerates the original procedural placeholder art
src/
  data/        characters · weapons · demons · lore · ranks · nav · story · media   (all content is typed data)
  components/  Loader · Navbar · Hero · ParticleBackground · CharacterShowcase · CharacterModal
               StyleRank · StoryScroll · MediaSection · WeaponShowcase · Bestiary · LoreTimeline · BloodyPalace · Footer
               CustomCursor · SlashLayer · ScrollHUD · SectionTransition · TransitionOverlay · ui
  context/     Experience.tsx  (intro state, sound toggle, cinematic navigation)
  lib/         sound.ts (synthesised Web Audio — no music files) · asset.ts · scroll.ts
```

## Official artwork

`src/assets/official/` holds the official art you supplied, already cropped, cut out and compressed:

| Folder           | Contents                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero/`          | 5 images, shown as a crossfading slideshow behind the title (add more and they join the rotation)                                                                                                 |
| `characters/`    | Dante, Nero, V (full-scene shots, framed with a per-character focal point in `src/data/characters.ts`) and Vergil, Lady, Trish (transparent renders)                                              |
| `weapons/`       | all 7 Devil Arms, transparent renders                                                                                                                                                             |
| `demons/`        | all 8 demons, transparent renders (silhouette until hover)                                                                                                                                        |
| `bloody-palace/` | the four "The Legend Continues" key arts (hunter select)                                                                                                                                          |
| `backgrounds/`   | Bloody Palace arena                                                                                                                                                                               |
| `story/`         | Before the Nightmare cover and illustrations (`nico` / `morrison` images are optional)                                                                                                            |
| `gallery/`       | screenshots, key art and concept art (`concept`/`Graphic Arts` captions are framed as mounted prints). Anything dropped here appears in the gallery; prefix names with `01-`, `02-` to order them |

Swap any file by dropping a replacement with the same name (`.webp .png .jpg .jpeg .avif`) and rebuilding.
Transparent png/webp renders are treated as cut-outs; jpgs fill their frame.

## Media

`src/data/media.ts` lists the seven official videos from devilmaycry.com/5/us/movie/ (YouTube IDs).
Posters come from YouTube's thumbnail service and videos play in an embedded youtube-nocookie player.

All Capcom imagery and videos belong to Capcom. Keep this a non-commercial fan project with the footer disclaimer.

## Content accuracy

Names, titles, weapons, moves, enemies, style ranks and story facts follow the games. Quotes are verbatim in-game
lines with their source game. Nero and V have no quote because I couldn't verify one word-for-word — add a
`quote: { text, source }` in `src/data/characters.ts` if you have one.

## Notes

- Fonts are self-hosted via @fontsource (latin subsets only) — no render-blocking third-party requests.
- Sound is off by default; the SOUND toggle starts an original synthesised drone + slash effects.
- Custom cursor and mouse parallax are disabled on touch devices; heavy effects respect `prefers-reduced-motion`.
- Bloody Palace is playable: click/tap STRIKE or press Space/J. Best floor is stored in localStorage.
- `scripts/generate-assets.mjs` regenerates the placeholder art.
- `vite.artifact.config.ts` is only used to produce a single-file hosted preview; you can delete it.

Devil May Cry and all related names are trademarks of CAPCOM. This project is not affiliated with or endorsed by CAPCOM.

cd devil-may-cry-5-experience
npm install
npm run dev # → http://localhost:5173

```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build a production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |
| `npm run assets` | Regenerate the procedural placeholder art in `public/assets` |

---

## ✦ Official artwork

Capcom artwork is **git-ignored** (`src/assets/official/**`), so it never ends up on GitHub. Without it
the site uses the original placeholder art and hides the Gallery.

To get the full experience locally, drop images into `src/assets/official/`. File names decide where each
image goes:

```

src/assets/official/
├── hero/ any number of 1920×1080 shots → hero slideshow
├── characters/ dante · vergil · nero · lady · trish · v
├── weapons/ rebellion · yamato · red-queen · blue-rose · devil-sword-dante · balrog · cerberus
├── demons/ hell-caina · empusa · fury · nobody · goliath · artemis · cavaliere-angelo · urizen
├── bloody-palace/ dante · nero · v · vergil (hunter select)
├── backgrounds/ bloody-palace
├── story/ nero · dante · v · cover
└── gallery/ anything, e.g. 01-key-art.jpg

```

- **Transparent PNG/WebP:** used as a cut-out.
- **JPG:** fills its frame.

Full table: [`src/assets/official/README.md`](src/assets/official/README.md).

---

## ✦ Project structure

```

src/
├── components/ one file per section + shared UI
│ ├── Hero · Loader · Navbar · ScrollHUD · CustomCursor · SlashLayer
│ ├── CharacterShowcase · CharacterModal · CharacterArt
│ ├── StyleRank · StoryScroll · WeaponShowcase · Bestiary
│ ├── LoreTimeline · MediaSection · Gallery · BloodyPalace · Footer
│ └── ParticleBackground · SectionTransition · TransitionOverlay · ui
├── data/ all content as typed data (characters, weapons, demons, lore, ranks, story, media, gallery)
├── context/ Experience: intro state, sound, cinematic navigation
├── hooks/ media queries, active section, body lock
├── lib/ asset resolver, Web Audio engine, scroll helper
└── assets/official/ your local official art (git-ignored)
public/assets/ original placeholder art (generated by scripts/generate-assets.mjs)

```

You edit content in `src/data/*`. Components never hard-code it.

---

## ✦ Performance & accessibility

- **Animations:** GPU-friendly only (transform, opacity, clip-path). Springs and motion values avoid React re-renders.
- **Particles:** canvas-based, with a capped device-pixel ratio and fewer particles on touch devices. They pause when off-screen.
- **Loading:** images are lazy-loaded; fonts are self-hosted, latin subset only.
- **Mobile:** heavy parallax is disabled on touch, the custom cursor turns off on coarse pointers, and the horizontal rails become swipe carousels.
- **Reduced motion:** respects `prefers-reduced-motion`.
- **Keyboard:** dialogs support Esc and arrow keys; panels and cards are focusable.

---

## ✦ Deploy

**GitHub Pages:** the included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.
Enable it once under *Settings → Pages → Source: GitHub Actions*. The site will be at
https://yuvi1-1.github.io/devilMayCry5/

**Vercel / Netlify:** import the repo. Build command `npm run build`, output directory `dist`.

---

## ✦ Content & credits

- **Facts:** names, titles, weapons, moves, enemies, style ranks and lore follow the games.
- **Quotes:** verbatim in-game lines, credited to their source game.
- **Trailers:** embedded from CAPCOM's official YouTube channel, as listed on [devilmaycry.com](https://www.devilmaycry.com/5/us/movie/).
- **Prequel novel:** *Devil May Cry 5 — Before the Nightmare* by Bingo Morihashi, illustrated by Tsuyomaru (Kadokawa, 2019). Summaries on this site are original.
- **Placeholder art:** procedural SVG, created for this project.

## ✦ License

The code and the placeholder art are released under the [MIT License](LICENSE).
**Devil May Cry** © CAPCOM CO., LTD. All rights reserved. This is a non-commercial fan project.
```
