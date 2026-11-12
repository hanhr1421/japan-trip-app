# Japan trip app: context for Claude

A phone web app (PWA) and 3D trip map for a group of 6 (2 men, 4 women) on a vacation extension in Japan, **Fri 20 – Sun 22 Nov 2026**. The extension is **vacation, not business**: suggestions should focus on views, places, food and a little shopping. No karaoke.

- **Live app:** https://japan-trip-app-wine.vercel.app (Vercel project `japan-trip-app` (team "Hai Anh Pham's projects"). It deploys automatically on every push to `main`). The site is the static `public/` folder (see `vercel.json`).
- **Claude artifact:** the same page without the app features, at https://claude.ai/artifact/2cmq4zqsT4JJrjYfWUeyfi (built as `dist/artifact.html`).

## The trip (current plan)
There are two routes, chosen with the A / B switch (`PLAN.route`). Both start in Osaka and end at Narita, and both have Mt Fuji at dawn on Saturday.
- **Thu night:** APA Hotel & Resort Osaka Namba Ekimae Tower (booked).
- **Plan A, Fri 20 (Shizuoka):** Hikari 640 to Shizuoka (09:37). Optional dawn stop at Fushimi Inari, boarding at Kyoto 07:51. Nihondaira Yume Terrace, Kunozan Toshogu by ropeway, lunch at Kashi no Ichi, Miho no Matsubara at sunset, oden dinner, optional Sunpu Castle light-up. Hotel: **Sanco Inn Shizuoka Kitaguchi** (chosen by the user, 3 rooms, not booked yet; ¥8,850 per person in the budget as `HOTEL_A`).
- **Plan A, Sat dawn:** two pre-booked taxis 05:40 from Sanco Inn to the Nihondaira Yume Terrace deck (open all night; sunrise about 06:26), back for breakfast, **check out after**, Hikari 634 08:12 to Tokyo (seat E for Fuji).
- **Plan B, Fri 20 (Yamanashi), the "chill" version (user, 12 Nov: more time in fewer places):** no Fushimi Inari (an add-on for Plan A only), no ropeway, no lake cruise. Leave APA 06:05, **Hikari 636 from Shin-Osaka 06:42** to **Mishima (~08:57, estimated from the 08:37 Shizuoka arrival)**, Mishima–Kawaguchiko Liner at **09:20** from the South Exit stop 2, Kawaguchiko Station **10:50** (¥2,700, no Suica; next bus 10:20 → 11:50). Red Line 11:00 to **Oishi Park** (11:27–12:57), Red Line back 13:24, houtou lunch, Fujikyu local **14:25 → Shimoyoshida 14:39**, **Chureito Pagoda the whole afternoon** until sunset (~16:33, backlit), **Honcho Street at dusk** 17:00, **dinner in Nishiura** (西裏, Shinsekai Kanpai-dori, by Gekkoji Station) 17:45, Fujikyu **19:53** Shimoyoshida → Kawaguchiko ~20:06 (also 19:22, 20:23, 20:52, 21:34 … last 23:51), check in. Fujikyu times are from ekispert (25 Oct 2026 timetable). **Yamanashi hotel: Fuga A (風雅 A棟)**, chosen and booked by the user (11 Nov): a whole house about 2 min on foot from Kawaguchiko Station, check-in from 16:00 (contactless), check-out 10:00. It costs ₫7,428,000 for 6 (₫1,238,000 each; about ¥45,300 or ¥7,550 each at ₫164 to the yen, an estimate from 11 Nov), counted in the Plan B budget as `HOTEL_B` = ¥7,550; the number of bathrooms is not checked. Suitcases go in station lockers on Friday unless the host allows an early drop. The user decided to stay on the Mishima bus and to bring the suitcases: one each in the bus trunk, which cannot be reserved, so queue first.
- **Plan B, Sat 21 morning:** pre-booked taxi 05:45 from Fuga A to **Kogamasao Memorial Park** (古賀政男記念公園, the user's sunrise spot, 35.52342, 138.76503, north-east shore; sunrise ~06:25), walk ~0.8 km to the **Momiji Corridor** 07:00, taxi back 07:35, breakfast, **check out by 10:00**. No Red Line bus runs before 9:00. Taxi fares are estimates (¥800 per person per leg in the budget).
- **Plan B, Sat 21 to Tokyo:** default **highway bus ~10:10 → Busta Shinjuku ~11:55** (¥2,200, reserved; exact departure not checked, buses about every 10–20 min). That misses Sagawa's 11:00 same-day delivery, so suitcases are **stored** at the Sagawa counter (Busta 3F) and **collected at 20:45** after Don Quijote, then JR to Ueno 21:35. Add-on `tokyost`: Fujikyu bus **10:30 → Tokyo Station 12:35** (¥2,300, autumn 2026 listings), JR to Ueno, bags at Grids 13:00, Harajuku 13:45, no ginkgo avenue. Plan B Saturday times: Meiji 12:30, Icho Namiki 13:50, Shibuya Crossing 14:40 (an hour for shopping), Shibuya Sky 15:40 (option). Other Tokyo arrival terminals checked but not in the app: Shibuya Mark City (Tokyu bus 10:20 → 12:30, ¥2,100–2,300), Ueno / Akihabara (evening buses only).
- **Tokyo (user, 12 Nov):** keep the plan as it is; every stop can be switched off later.
- **Sat 21 (both plans, from Meiji Jingu on; Plan A times shown):** Plan A only: Tokyo Station, optional Imperial Palace East Gardens, Ueno bag drop. Then Meiji Jingu and Harajuku, Icho Namiki ginkgo avenue, Shibuya, optional Shibuya Sky at sunset. **Shinjuku night walk** (agreed with the user): Minamillumi 17:15, Tocho light show 18:30, Omoide Yokocho dinner 19:00, Kabukicho / Godzilla 19:55, Don Quijote 20:05–21:00, JR to Ueno about 21:25. **Tokyo hotel: Grids Tokyo Ueno Hotel & Hostel** (chosen by the user; 7-10-4 Ueno, 2 min from the JR Ueno Iriya Exit, about 9 min from Keisei-Ueno; check-in 16:00–23:00, check-out 11:00, luggage kept from 9:00). Its price is not in the budget.
- **Sun 22:** Senso-ji at 07:00 and Azumabashi bridge. Then either Naritasan (Keisei Rapid Ltd. Express 10:06, eel lunch) or Ameyoko plus **Skyliner 41** at 12:00. **Be at Narita T2 by 13:00.** VietJet **VJ935 departs 16:25**; counters are open 13:25–15:25. Since 1 Nov 2026 the tax-free refund is done at a customs kiosk before check-in.
- **Budget** is per person. Recheck these after any data change. "Full" = every stop on, add-ons off.
  - Plan A full ¥53,920, all options off ¥47,330. Both include ¥8,850 for Sanco Inn and ¥3,200 (estimate) for the dawn taxis; the Tokyo hotel is not included.
  - Plan B full ¥48,030, all options off ¥41,270. Both include ¥7,550 (estimate) for Fuga A and ¥1,600 (estimate) for the sunrise taxis; the Tokyo hotel is not included.

## How the code is organised
- `src/trip-map.template.html` is the whole app: CSS, HTML and one big script. Placeholders (`__D__`, `__XY__`, `__LL__`, `__APP__`, `__APPURL__`, `__THREE__`, `__ORBIT__`, `__PWAHEAD__`) are filled by `src/build.mjs`.
- **Data** (top of the script):
  - `PLACES`: place cards.
  - `OPT` / `CH`: transport choices.
  - `OPTS`: optional stops the user can switch off. `add:1` marks an add-on: off in the full plan (`FULLSET`), switched on in My plan (`inari`, `tokyost`).
  - `ALL_STOPS`: the itinerary. A stop with `v:'k'` shows only when option k is on; one with `v:'-k'` shows only when it is off.
    - `r:'A'` or `r:'B'` puts a stop (or an entry of `OPTS`) on one route only.
    - Every stop can be switched off except those marked `fx:1` (stations, hotels, the airport). A skipped stop is stored as `PLAN.mine['x:'+key]`, where the key is `sk` or the place id; stops that share a key are skipped together.
    - When a stop is skipped, the next leg gets a note (`_gap`) because its route was written from the skipped place.
  - `FOOD` (eat, drink and shopping suggestions near a stop; `type:'Shopping'` for shops), `BK` (links), `BOOKS`, `checks()`.
- Every leg can carry `how:` with the numbered route: line names and codes (e.g. Ginza Line G16 → G19), platform numbers, bus route and stop numbers, and train numbers.
- **The "phone app layer"** (`renderToday`, `locate`, `icsText`, `renderLinks`, …) sits **before** the 3D code and uses only the data. If WebGL or three.js fails, the fallback script at the end shows a simple view. Keep it that way.
- **The 3D scene** uses three.js 0.147 with OrbitControls.
  - Place positions are in `src/map.json` (`xy`, Mercator fit; see `src/merc.mjs`).
  - Real coordinates for directions and GPS are in `src/ll.json`.
- **Phone settings:** `LOWP` lowers the pixel ratio and terrain resolution. The postcard viewer reuses one WebGL renderer, and the render loop pauses when hidden or when the WebGL context is lost.

## Online features (phone app only, `APP` true)
- Source: `src/online.js`, injected by the build at `/*__ONLINE__*/`. The artifact build includes the code but never runs it (its sandbox blocks network calls).
- **Weather and Mt Fuji outlook:** Open-Meteo forecast API, cached in localStorage for an hour.
- **Group sync** (shared plan including the route and skipped stops, shared "Booked" ticks, notice board): Supabase project `japan-trip-app` (ref `ryzmxxlldyanzlgfyuav`, Tokyo region), migration `trip_group_sync`.
  - Tables `trip_groups` and `trip_notices` have RLS on and no policies. The app only calls the functions `trip_ping`, `trip_get`, `trip_set_plan`, `trip_set_booking`, `trip_post_notice`, `trip_delete_notice`, and the two location functions, each of which checks the group code (stored as a SHA-256 hash).
  - **This repo is public: never commit the group code.** The user has it.
  - **Location sharing** (migration `trip_location_sharing`, table `trip_locs`, functions `trip_set_loc` / `trip_clear_loc`): opt-in per person, sent only while the app is open (about every 45 s), cleared when switched off, hidden by the server after 2 hours. GPS dots are drawn relative to the nearest place model (`palXY`) because city places are spread apart on the map.
  - The plan uses a version number; a stale write gets `conflict:true` and the server version wins. The app polls every 25 s while visible.
- Test with two simulated phones against a mock of these functions before pushing; the sandbox cannot reach Supabase or Open-Meteo directly.

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
