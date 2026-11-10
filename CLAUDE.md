# Japan trip app: context for Claude

A phone web app (PWA) and 3D trip map for a group of 6 (2 men, 4 women) on a vacation extension in Japan, **Fri 20 – Sun 22 Nov 2026**. The extension is **vacation, not business**: suggestions should focus on views, places, food and a little shopping. No karaoke.

- **Live app:** Vercel project `japan-trip-app` (team "Hai Anh Pham's projects"). It deploys automatically on every push to `main`. The site is the static `public/` folder (see `vercel.json`).
- **Claude artifact:** the same page without the app features, at https://claude.ai/artifact/2cmq4zqsT4JJrjYfWUeyfi (built as `dist/artifact.html`).

## The trip (current plan)
- **Thu night:** APA Hotel & Resort Osaka Namba Ekimae Tower (booked).
- **Fri 20:** Hikari 640 to Shizuoka (09:37). Optional dawn stop at Fushimi Inari, boarding at Kyoto 07:51. Nihondaira Yume Terrace (Mt Fuji view), Kunozan Toshogu by ropeway, lunch at Kashi no Ichi, Miho no Matsubara at sunset, oden dinner, optional Sunpu Castle light-up. Hotel in Shizuoka not booked yet.
- **Sat 21:** Hikari 634 08:12 to Tokyo (seat E for Fuji). Optional Imperial Palace East Gardens, Meiji Jingu and Harajuku, Icho Namiki ginkgo avenue, Shibuya, optional Shibuya Sky at sunset. **Shinjuku night walk** (agreed with the user): Minamillumi 17:15, Tocho light show 18:30, Omoide Yokocho dinner 19:00, Kabukicho / Godzilla 19:55, Don Quijote 20:05–21:00, JR to Ueno about 21:25. Hotel in Ueno not booked yet.
- **Sun 22:** Senso-ji at 07:00 and Azumabashi bridge. Then either Naritasan (Keisei Rapid Ltd. Express 10:06, eel lunch) or Ameyoko plus **Skyliner 41** at 12:00. **Be at Narita T2 by 13:00.** VietJet **VJ935 departs 16:25**; counters are open 13:25–15:25. Since 1 Nov 2026 the tax-free refund is done at a customs kiosk before check-in.
- **Budget** is per person and **excludes hotels**: full plan ¥42,050, all options off ¥35,280. Recheck these after any data change.

## How the code is organised
- `src/trip-map.template.html` is the whole app: CSS, HTML and one big script. Placeholders (`__D__`, `__XY__`, `__LL__`, `__APP__`, `__APPURL__`, `__THREE__`, `__ORBIT__`, `__PWAHEAD__`) are filled by `src/build.mjs`.
- **Data** (top of the script):
  - `PLACES`: place cards.
  - `OPT` / `CH`: transport choices.
  - `OPTS`: optional stops the user can switch off.
  - `ALL_STOPS`: the itinerary. A stop with `v:'k'` shows only when option k is on; one with `v:'-k'` shows only when it is off.
  - `FOOD`, `BK` (links), `BOOKS`, `checks()`.
- Every leg can carry `how:` with the numbered route: line names and codes (e.g. Ginza Line G16 → G19), platform numbers, bus route and stop numbers, and train numbers.
- **The "phone app layer"** (`renderToday`, `locate`, `icsText`, `renderLinks`, …) sits **before** the 3D code and uses only the data. If WebGL or three.js fails, the fallback script at the end shows a simple view. Keep it that way.
- **The 3D scene** uses three.js 0.147 with OrbitControls.
  - Place positions are in `src/map.json` (`xy`, Mercator fit; see `src/merc.mjs`).
  - Real coordinates for directions and GPS are in `src/ll.json`.
- **Phone settings:** `LOWP` lowers the pixel ratio and terrain resolution. The postcard viewer reuses one WebGL renderer, and the render loop pauses when hidden or when the WebGL context is lost.

## Workflow
1. Edit `src/trip-map.template.html` (and `src/map.json` for new places).
2. `cd src && npm install && node build.mjs`. This writes `public/index.html`, `public/sw.js` (with a new cache version) and `dist/artifact.html`.
3. Test before shipping:
   - open `public/index.html` through a local server, e.g. `python3 -m http.server` in `public/`;
   - check the full-plan and all-options-off budgets;
   - check a phone-sized viewport.
4. Commit and push to `main`; Vercel redeploys.
5. Regenerate `public/trip.ics` from the page (`icsText()` with the full plan) if the times changed.

## Facts to keep straight
- Keisei changes its timetable on 21 Nov 2026. Weekend Skyliners are renumbered: the 12:00 from Keisei-Ueno is **Skyliner 41**, arriving T2 at 12:41.
- The Shinjuku Yamanote Line for Ikebukuro / Ueno leaves from **platform 15**.
- Mark estimates as estimates (`est:1`) and do not invent platform numbers: say "platform for <direction>" when unsure.
