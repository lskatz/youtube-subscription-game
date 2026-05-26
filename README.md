# SubRush

A turn-based browser game where you build a YouTube channel from zero to 500 million subscribers.

**Live site:** `https://lskatz.github.io/youtube-subscription-game`

---

## Gameplay

Each turn represents one week. You make decisions, click **Next Week**, and watch your channel grow (or suffer).

### Decisions each turn

| Decision | Options |
|---|---|
| Uploads per week | 1 – 7 |
| Video length | Short (~8 min), Medium (~18 min), Long (~35 min) |
| Video quality | Low, Medium, High |
| Ad spend | $0 – your available budget |
| Appear on camera | Toggle on/off |

### Resources to manage

- **Subscribers** — the main progression metric. Target: 500 million.
- **Budget** — starts at $500. Earns ad revenue once monetized; spent on equipment and ads.
- **Watch time** — accumulates from views. Required for monetization alongside subscriber count.

### Monetization

Your channel unlocks ad revenue once it reaches **1,000 subscribers** and **4,000 watch hours**. Before that, ad spend is a pure cost.

### Equipment

One-time purchases that add a quality bonus to every video. You can sell or replace gear at any time.

| Category | Tiers |
|---|---|
| Camera | Webcam → DSLR → Cinema Camera |
| Microphone | USB Mic → Condenser → Boom Mic |
| Lighting | Ring Light → Softbox Kit → LED Array |
| Graphics | Free Templates → Motion Pack → Custom Branding |
| Screen | Screen Share → Capture Card → 4K Capture |
| Background | Blank Wall → Green Screen → Custom Set |
| Music | Royalty-Free → Premium Library → Original Composer |
| Editor | Free Editor → Pro Editor → AI-Assisted Editor |

### Your persona

At setup you choose a **niche** (Gaming, Science, Humor, etc.) and a **personality** (Enthusiastic, Controversial, Calm, etc.). Appearing on camera with a personality that fits your niche gives a +12% subscriber bonus. A mismatch raises your controversy risk.

### Random events

Each week can trigger one or more events:

| Event | Effect |
|---|---|
| Viral video | 3× subscribers, 2.5× revenue |
| Controversy | 0.5× subscribers, 0.7× revenue |
| Algorithm boost | 1.8× subscribers, 1.5× revenue |
| Algorithm penalty | 0.6× on both |
| Collaboration | 2× subscribers, 1.3× revenue |
| Copyright strike | 0.4× subscribers, 0× revenue |
| Fan milestone | 1.4× subscribers, 1.2× revenue |
| Equipment failure | 0.7× subscribers, 0.8× revenue |

### Milestones

| Subscribers | Reward |
|---|---|
| 100 | First 100 Subscribers |
| 1,000 | Monetization Unlocked |
| 10,000 | Silver territory |
| 100,000 | Official Silver Play Button |
| 1,000,000 | Gold Play Button |
| 10,000,000 | Diamond Play Button |
| 50,000,000 | Custom Play Button |
| 500,000,000 | Winner — Prestige! |

### Prestige

Reaching 500M triggers a prestige. Your subscriber count resets to 0, but **everything else carries over** (budget, equipment, inventory). Each prestige adds a permanent **+10% growth multiplier** to all future runs. There is no prestige cap.

---

## Development

### Prerequisites

[Pixi](https://pixi.sh) is the only tool you need. It manages the Python environment and all dependencies.

```bash
# Install pixi (Linux/macOS)
curl -fsSL https://pixi.sh/install.sh | bash

# Windows (PowerShell)
iwr -useb https://pixi.sh/install.ps1 | iex
```

### Setup

```bash
git clone https://github.com/lskatz/youtube-subscription-game
cd youtube-subscription-game
make install
```

### Common tasks

```bash
make test     # Run all 47 pytest tests
make build    # Run tests, then compile Python → JS via Transcrypt
make clean    # Remove compiled output and caches
```

### Local play (no build needed)

The game UI runs entirely from `index.html` + `js/ui.js`. Open `index.html` in a browser directly — no server required. The Transcrypt-compiled JS (`js/__target__/`) is only needed if you want the Python game logic to be the authoritative source; the JS layer currently reimplements it in parallel.

---

## Architecture

```
youtube-subscription-game/
├── src/                   # Python game logic
│   ├── player.py          # Niche, Personality, Avatar, Player, persona_niche_match()
│   ├── channel.py         # Channel stats, monetization check, milestone tracking
│   ├── equipment.py       # Equipment catalog, Inventory, buy/sell/replace
│   ├── economy.py         # Views, subscribers, watch time, revenue calculations
│   ├── events.py          # Random event generation and application
│   ├── save.py            # JSON serialize/deserialize with semver versioning
│   └── game.py            # Turn loop, Decision dataclass, prestige logic
├── tests/                 # pytest suite (mirrors src/ module for module)
│   ├── conftest.py        # Adds src/ to sys.path
│   ├── test_player.py
│   ├── test_channel.py
│   ├── test_equipment.py
│   ├── test_economy.py
│   └── test_events.py
├── js/
│   ├── ui.js              # All DOM logic, event handling, canvas avatar renderer
│   └── __target__/        # Transcrypt output (generated, not committed)
├── css/style.css          # Dark dashboard theme
├── index.html             # All screens: save dialog, setup, game, prestige, avatar modal
├── .github/workflows/
│   └── ci.yml             # pytest on PR; pytest + Transcrypt + Pages deploy on push to main
├── pixi.toml              # Dependency manifest (Python 3.12, pytest, Transcrypt)
├── Makefile               # install / test / build / clean
└── .gitignore
```

### How Python and JS relate

Game logic is written in Python under `src/` and tested with pytest. `make build` compiles it to JavaScript via [Transcrypt](https://www.transcrypt.org). The UI layer (`js/ui.js`) is hand-written JavaScript that handles all DOM manipulation. The two layers share the same game rules — Python is the source of truth, tested and auditable; the compiled JS is what runs in the browser.

### Save format

Progress is stored in `localStorage` under the key `subrush_save` as JSON. The save includes a [semver](https://semver.org) `version` field. On load, major-version mismatches are rejected (incompatible schema); minor/patch mismatches load normally.

---

## CI / CD

| Trigger | Jobs |
|---|---|
| Pull request → `main` | `pytest tests/ -v` |
| Push → `main` | pytest → `make build` → deploy to GitHub Pages |

GitHub Pages source must be set to **GitHub Actions** in the repository settings (Settings → Pages → Source).

---

## Contributing

1. Fork and clone the repo.
2. `make install` to set up the environment.
3. Write or update game logic in `src/`.
4. Add or update tests in `tests/` — all tests must pass before opening a PR.
5. Run `make test` to confirm locally.
6. Open a PR against `main`. CI runs automatically.

When updating the game, bump the version in `src/save.py` and `js/ui.js`:
- **Patch** (`0.1.x`) — any release
- **Minor** (`0.x.0`) — new features
- **Major** (`x.0.0`) — breaking save schema changes
