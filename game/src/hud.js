function overlay(ctx) {
  ctx.fillStyle = "rgba(23,31,36,.72)";
  ctx.fillRect(0, 0, 960, 600);
}

function panel(ctx, y, height = 300) {
  ctx.fillStyle = "#f8eed9";
  ctx.strokeStyle = "#c9a875";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(250, y, 460, height, 22);
  ctx.fill();
  ctx.stroke();
}

function centered(ctx, text, y, font, color = "#29343a") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.fillText(text, 480, y);
}

export function drawTitle(ctx) {
  overlay(ctx);
  panel(ctx, 124, 352);
  centered(ctx, "SIZZLE LANE", 206, "900 43px system-ui, sans-serif");
  centered(ctx, "DINER SHIFT", 238, "800 16px system-ui, sans-serif", "#a7663e");
  centered(ctx, "Tickets are stacking up! Build each burger in order,", 295, "600 15px system-ui, sans-serif");
  centered(ctx, "keep your ingredients fresh, and serve before patience runs out.", 321, "600 15px system-ui, sans-serif");
  centered(ctx, "WASD / ARROWS  Move     E  Interact     SPACE  Chop / cook", 368, "700 13px system-ui, sans-serif", "#58635e");
  centered(ctx, "ENTER TO START", 423, "900 19px system-ui, sans-serif", "#bd6d3d");
  centered(ctx, "A 2 minute lunch rush", 450, "600 12px system-ui, sans-serif", "#89806c");
  ctx.textAlign = "left";
}

export function drawPause(ctx) {
  overlay(ctx);
  panel(ctx, 195, 210);
  centered(ctx, "SHIFT PAUSED", 270, "900 31px system-ui, sans-serif");
  centered(ctx, "Take a breath, chef.", 315, "600 16px system-ui, sans-serif", "#6c746e");
  centered(ctx, "PRESS P OR ENTER TO RESUME", 360, "800 15px system-ui, sans-serif", "#bd6d3d");
  ctx.textAlign = "left";
}

export function drawEnd(ctx, state) {
  overlay(ctx);
  panel(ctx, 130, 340);
  const won = state.reputation > 0 && state.dayRemaining <= 0;
  centered(ctx, won ? "LUNCH RUSH COMPLETE" : "SHIFT OVER", 210, "900 30px system-ui, sans-serif");
  centered(ctx, state.reputation > 0 ? "Nice work keeping the neighborhood fed." : "Too many tickets slipped away today.", 248, "600 15px system-ui, sans-serif", "#6c746e");
  centered(ctx, String(state.coins) + " COINS EARNED", 306, "900 27px system-ui, sans-serif", "#a7663e");
  centered(ctx, "" + state.served + " burgers served   ·   best combo " + state.bestCombo + "×", 342, "700 15px system-ui, sans-serif");
  centered(ctx, "PRESS ENTER TO PLAY AGAIN", 410, "900 17px system-ui, sans-serif", "#bd6d3d");
  ctx.textAlign = "left";
}

export function isStartKey(event) {
  return event.key === "Enter";
}

export function isPauseKey(event) {
  return event.key.toLowerCase() === "p";
}
