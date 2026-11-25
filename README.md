# Sizzle Lane — a cooking game for make.fun

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/forfito10/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/forfito10/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

Sizzle Lane is an original 2D canvas cooking game: a diner kitchen where you run the lunch rush alone. Walk the kitchen, pull ingredients from the pantry, chop, grill patties on the stove, stack each burger on the plating counter in the order the ticket asks for, and serve before the customer's patience runs out.

## How it works

- `game/` — the playable game as static files (`game/index.html` and ES modules under `game/src/`). No build step, no network requests.
- `main.ts` — the program that hands the entry in: copies `game/` and `screenshots/` to `/output` and writes `dossier.json` with `vendor/makefun-game.ts`.
- `screenshots/` — four real renders of the game: the kitchen with the order board, a dish mid-assembly, a full plate, and a burger served.

## Controls

- Arrow keys / WASD — move the chef
- E — pick up or place (pantry, cutting board, stove, plating, trash)
- Space — chop at the board, hold to grill on the stove
- Enter — serve the plate at the plating counter; start / restart
- P — pause

## Run it

```sh
node serve.ts        # serves game/ at http://localhost:8080
```

Or open `game/index.html` through any static HTTP server.

Made for [make.fun](https://make.fun)'s “Make the best cooking game” bounty.
