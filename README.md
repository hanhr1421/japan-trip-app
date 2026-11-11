# Japan Trip app · Shizuoka & Tokyo, 20–22 Nov 2026

**Open it:** https://japan-trip-app-wine.vercel.app

A trip app for the phone: the day's plan with train, bus and platform numbers, Google Maps directions, "Where am I?", calendar reminders, bookings, and a 3D map. It works offline after the first open.

## Install on your phone
- **iPhone:** open the link in **Safari**, tap **Share**, then **Add to Home Screen** → Add.
- **Android:** open the link in **Chrome**, tap the menu (three dots), then **Install app** (or **Add to Home screen**).

Open it once with internet. After that, it keeps a copy of the whole trip on the phone.

## Permissions
- **Location:** only when you tap *Where am I?*. It shows how far you are from the next stop.
- **Calendar:** only if you tap *Add reminders to my calendar* and accept the file.
- No account, no notifications and no tracking.

## Group sync
On the Today tab, enter your name and the group code from the organiser. Everyone then sees the same plan, the same "Booked" ticks and a shared notice board. It needs mobile data; without a signal the app keeps showing the last synced plan.

## For developers
See `CLAUDE.md`. In short: edit `src/trip-map.template.html`, run `node src/build.mjs` (after `npm install` in `src/`), then push to `main`. Vercel serves `public/`.
