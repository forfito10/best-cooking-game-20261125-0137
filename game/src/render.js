import { CANVAS_WIDTH, CANVAS_HEIGHT, INGREDIENTS } from "./state.js";
import { pantryItems } from "./stations.js";

const COLORS = {
  ink: "#28333a",
  cream: "#fff4da",
  wood: "#a7663e",
  woodLight: "#c98550",
  counter: "#e8d5ae",
  floor: "#d8ae6c"
};

export function drawFrame(ctx, state, t) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawKitchen(ctx, t);
  drawOrderBoard(ctx, state);
  drawPantry(ctx);
  drawStations(ctx, state, t);
  drawChef(ctx, state.chef, t);
  drawHud(ctx, state);
  if (state.message && state.messageTime > 0) drawMessage(ctx, state.message);
}

function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function drawKitchen(ctx, t) {
  ctx.fillStyle = "#29343a";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "#ead7ad";
  ctx.fillRect(0, 147, CANVAS_WIDTH, 453);
  ctx.fillStyle = "#d6bc8c";
  for (let y = 158; y < CANVAS_HEIGHT; y += 54) {
    const offset = (Math.floor((y - 158) / 54) % 2) * 42;
    for (let x = -42 + offset; x < CANVAS_WIDTH; x += 84) {
      ctx.fillRect(x, y, 1, 54);
      ctx.fillRect(x, y, 84, 1);
    }
  }
  ctx.fillStyle = "#d6a762";
  ctx.fillRect(0, 145, CANVAS_WIDTH, 7);
  ctx.fillStyle = "#f7e7c5";
  ctx.font = "700 13px system-ui, sans-serif";
  ctx.fillText("SIZZLE LANE  /  PREP KITCHEN", 26, 170);
  ctx.fillStyle = "rgba(255,255,255,.14)";
  ctx.beginPath();
  ctx.arc(480, 402, 155 + Math.sin(t * 2) * 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrderBoard(ctx, state) {
  roundedRect(ctx, 15, 12, 930, 124, 15, "#f8eed9", "#c9a875");
  ctx.fillStyle = COLORS.ink;
  ctx.font = "800 15px system-ui, sans-serif";
  ctx.fillText("TODAY’S TICKETS", 31, 37);
  ctx.font = "600 11px system-ui, sans-serif";
  ctx.fillStyle = "#7a776d";
  ctx.fillText("Build each burger from left to right", 31, 56);

  const orders = state.orders.slice(0, 3);
  orders.forEach((order, index) => {
    const x = 282 + index * 216;
    roundedRect(ctx, x, 21, 204, 102, 10, "#fffaf0", "#e0cfac");
    ctx.fillStyle = order.color;
    ctx.beginPath();
    ctx.arc(x + 18, 40, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.ink;
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillText(order.name, x + 34, 44);
    ctx.font = "600 11px system-ui, sans-serif";
    ctx.fillStyle = "#786d5b";
    ctx.fillText("+" + order.basePay + " coins", x + 151, 44);
    order.recipe.forEach((type, itemIndex) => drawIngredientIcon(ctx, type, x + 18 + itemIndex * 28, 72, 17));
    const ratio = Math.max(0, order.patience / order.maxPatience);
    roundedRect(ctx, x + 10, 99, 184, 9, 5, "#e8ded0");
    roundedRect(ctx, x + 10, 99, 184 * ratio, 9, 5, ratio > 0.5 ? "#68ad71" : ratio > 0.25 ? "#e1ad4d" : "#d76558");
  });
  if (!orders.length) {
    ctx.fillStyle = "#938875";
    ctx.font = "600 14px system-ui, sans-serif";
    ctx.fillText("Fresh tickets coming up…", 300, 78);
  }
}

function drawPantry(ctx) {
  roundedRect(ctx, 25, 203, 200, 277, 12, "#9e653f", "#75472f");
  ctx.fillStyle = "#f9dfae";
  ctx.font = "800 13px system-ui, sans-serif";
  ctx.fillText("PANTRY", 42, 226);
  ctx.font = "500 10px system-ui, sans-serif";
  ctx.fillStyle = "#f2d4a4";
  ctx.fillText("Press E to pick up", 102, 226);
  ctx.fillStyle = "#704631";
  ctx.fillRect(38, 249, 174, 4);
  ctx.fillRect(38, 321, 174, 4);
  ctx.fillRect(38, 393, 174, 4);
  ctx.fillRect(38, 465, 174, 4);
  for (const item of pantryItems()) {
    const ingredient = INGREDIENTS[item.type];
    roundedRect(ctx, item.x - 22, item.y - 20, 44, 44, 8, "#f3e4c6", "#dbbd8c");
    drawIngredientIcon(ctx, item.type, item.x, item.y, 15);
    ctx.fillStyle = "#fff3d9";
    ctx.font = "600 9px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(ingredient.label, item.x, item.y + 23);
    ctx.textAlign = "left";
  }
}

function drawStations(ctx, state, t) {
  const stations = state.stations;
  drawCounter(ctx, stations.board, "CUTTING BOARD", "#b77849");
  roundedRect(ctx, stations.board.x - 74, stations.board.y - 31, 148, 45, 8, "#c58c54", "#815638");
  ctx.fillStyle = "#dfb67a";
  ctx.fillRect(stations.board.x - 62, stations.board.y - 22, 124, 26);
  if (stations.board.item) drawIngredientIcon(ctx, stations.board.item.type, stations.board.x, stations.board.y - 10, 18);
  ctx.fillStyle = "#fff4da";
  ctx.font = "600 10px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(stations.board.item?.chopped ? "READY" : stations.board.item?.type ? "SPACE × 2 TO CHOP" : "E TO PLACE / PICK UP", stations.board.x, stations.board.y + 42);

  drawCounter(ctx, stations.stove, "STOVE", "#64777a");
  roundedRect(ctx, stations.stove.x - 57, stations.stove.y - 34, 114, 54, 10, "#46555a", "#253238");
  for (let i = 0; i < 2; i += 1) {
    ctx.strokeStyle = "#a5a99e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(stations.stove.x - 27 + i * 54, stations.stove.y - 7, 16, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (stations.stove.item) {
    drawIngredientIcon(ctx, "patty", stations.stove.x, stations.stove.y - 8, 15);
    if (!stations.stove.item.cooked) {
      roundedRect(ctx, stations.stove.x - 36, stations.stove.y + 24, 72, 6, 3, "#293238");
      roundedRect(ctx, stations.stove.x - 36, stations.stove.y + 24, 72 * Math.min(1, stations.stove.progress / 2), 6, 3, "#ee8b45");
    }
  }
  ctx.fillStyle = "#fff4da";
  ctx.fillText(stations.stove.item?.cooked ? "PATTY READY" : stations.stove.item ? "HOLD SPACE TO COOK" : "E TO PLACE / PICK UP", stations.stove.x, stations.stove.y + 42);

  drawCounter(ctx, stations.plating, "PLATING", "#d89a58");
  roundedRect(ctx, stations.plating.x - 61, stations.plating.y - 31, 122, 43, 10, "#f1e5cb", "#aa8051");
  drawPlate(ctx, stations.plating.plate, stations.plating.x, stations.plating.y - 10, 14);
  ctx.fillStyle = "#fff4da";
  ctx.fillText(stations.plating.plate.length ? "ENTER TO SERVE" : "E TO BUILD BURGER", stations.plating.x, stations.plating.y + 42);

  drawCounter(ctx, stations.trash, "TRASH", "#6f7774");
  roundedRect(ctx, stations.trash.x - 26, stations.trash.y - 27, 52, 44, 8, "#5a6664", "#35403e");
  ctx.fillStyle = "#cad0c5";
  ctx.fillRect(stations.trash.x - 31, stations.trash.y - 31, 62, 7);
  ctx.fillStyle = "#fff4da";
  ctx.fillText("E TO DISCARD", stations.trash.x, stations.trash.y + 42);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(41,52,58,.12)";
  ctx.beginPath();
  ctx.ellipse(490, 532, 150 + Math.sin(t * 1.7) * 4, 14, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCounter(ctx, point, label, color) {
  roundedRect(ctx, point.x - 82, point.y + 5, 164, 47, 10, color, "#76573e");
  ctx.fillStyle = "rgba(0,0,0,.13)";
  ctx.fillRect(point.x - 76, point.y + 43, 152, 6);
  ctx.fillStyle = "#fff2d6";
  ctx.font = "800 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, point.x, point.y + 70);
}

function drawIngredientIcon(ctx, type, x, y, radius) {
  const item = INGREDIENTS[type] ?? { color: "#aaa", mark: "?" };
  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(71,50,31,.45)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = type === "patty" ? "#fff0d2" : "#523b2e";
  ctx.font = `800 ${Math.max(9, radius)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.mark, x, y + 1);
  ctx.textBaseline = "alphabetic";
}

function drawPlate(ctx, plate, x, y, spacing) {
  ctx.fillStyle = "#fffdf3";
  ctx.beginPath();
  ctx.ellipse(x, y, 49, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#c4b9a2";
  ctx.lineWidth = 2;
  ctx.stroke();
  const shown = plate.slice(0, 5);
  shown.forEach((item, index) => drawIngredientIcon(ctx, item.type, x - (shown.length - 1) * spacing / 2 + index * spacing, y, 10));
}

function drawChef(ctx, chef, t) {
  ctx.fillStyle = "rgba(44,49,48,.2)";
  ctx.beginPath();
  ctx.ellipse(chef.x, chef.y + 22, 17, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#477e89";
  roundedRect(ctx, chef.x - 15, chef.y - 6, 30, 33, 9, "#4f8791", "#31555c");
  ctx.fillStyle = "#f1c293";
  ctx.beginPath();
  ctx.arc(chef.x, chef.y - 15, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f7f4e9";
  ctx.beginPath();
  ctx.arc(chef.x, chef.y - 24, 12, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(chef.x - 12, chef.y - 24, 24, 4);
  ctx.fillStyle = "#28333a";
  const eyeX = chef.facing === "left" ? -4 : chef.facing === "right" ? 4 : 0;
  ctx.beginPath();
  ctx.arc(chef.x + eyeX, chef.y - 15, 1.5, 0, Math.PI * 2);
  ctx.fill();
  if (chef.carry) {
    const bob = Math.sin(t * 8) * 2;
    drawIngredientIcon(ctx, chef.carry.type, chef.x + (chef.facing === "left" ? -20 : 20), chef.y - 37 + bob, 11);
  }
}

function drawHud(ctx, state) {
  roundedRect(ctx, 234, 520, 492, 61, 13, "rgba(39,51,57,.94)", "rgba(255,245,220,.55)");
  const stats = [
    ["COINS", String(state.coins), "#f4c85f"],
    ["TIME", formatTime(state.dayRemaining), "#f4dfb2"],
    ["SERVED", String(state.served), "#9dd19c"],
    ["COMBO", state.combo + "×", "#efa17e"]
  ];
  stats.forEach(([label, value, color], index) => {
    const x = 258 + index * 117;
    ctx.fillStyle = "#b9c2bd";
    ctx.font = "800 9px system-ui, sans-serif";
    ctx.fillText(label, x, 541);
    ctx.fillStyle = color;
    ctx.font = "800 20px system-ui, sans-serif";
    ctx.fillText(value, x, 568);
  });
  ctx.fillStyle = "#f1e4c9";
  ctx.font = "700 13px system-ui, sans-serif";
  ctx.fillText("★", 742, 548);
  for (let index = 0; index < 3; index += 1) {
    ctx.fillStyle = index < state.reputation ? "#f4c85f" : "#59656a";
    ctx.font = "800 20px system-ui, sans-serif";
    ctx.fillText("♥", 758 + index * 19, 556);
  }
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function drawMessage(ctx, message) {
  roundedRect(ctx, 276, 483, 408, 29, 9, "rgba(40,51,57,.9)");
  ctx.fillStyle = "#fff3d8";
  ctx.font = "600 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(message, 480, 502, 390);
  ctx.textAlign = "left";
}
