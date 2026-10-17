# Commonplay

**Find your people. Play your game.** Commonplay is an original editorial-style demo for finding local sports games, meeting teammates, discovering venues, and hosting community play. It was built as a portfolio concept for **FORM11 TECH STUDIOS**.

## Included

- A cinematic illustrated sports-ground hero with a floating, editorially composed event interface.
- Warm paper, charcoal, olive and clay styling, restrained paper grain, condensed display typography, and a responsive layout.
- Nine fictional sample events covering football, running, tennis, badminton, basketball, swimming, volleyball and cycling.
- Filters for sport, date, level, distance and keywords.
- Interactive list/map switching; map pins open the matching event details.
- Event detail dialogs, local demo joining, event creation, and a player card with preferred sports.
- Mobile navigation, keyboard focus states, and reduced-motion support.

There are no external JavaScript libraries, API keys, paid services, backend requirements, or build step. The stylesheet requests Barlow Condensed and DM Sans from Google Fonts when internet access is available, with local/system fallback stacks for offline use.

## Run locally

Open `index.html` in a modern browser, or run a static server from this directory. For example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Put the contents of this folder at the root of a GitHub repository.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
4. Wait for GitHub Pages to publish the site.

No compilation is required. Keep the `assets` folder beside `index.html`, `styles.css`, and `app.js`.

## Demo data and privacy

All event names, organizers, participants, locations and counts are fictional sample content. The map is an illustrated interaction surface, not a live map or GPS service. Joining a game updates only this browser's local demo state. Hosting a game and editing the player card use local storage; they do not contact real organizers, book venues, notify players, or upload personal information.

## Files

- `index.html` — semantic page structure, sections, and dialog shells.
- `styles.css` — art direction, typography, component states, layout and responsive rules.
- `app.js` — fictional event data, filters, map pins, dialogs, joins and local profile state.
- `assets/court-editorial.webp` — bundled watercolor-and-ink urban court illustration.
- `assets/pickup-football.webp` — bundled cinematic community football photo.
- `assets/favicon.svg` — compact Commonplay brand mark.

---

**Designed & Built by FORM11 TECH STUDIOS.**
