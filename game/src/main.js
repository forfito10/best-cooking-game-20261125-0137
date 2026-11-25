import { createGameState, CANVAS_WIDTH, CANVAS_HEIGHT } from "./state.js";
import { seedOrders, updateOrders, serveDish, loseReputation } from "./orders.js";
import { updateStationWork, interactWithKitchen } from "./stations.js";
import { updateChef } from "./chef.js";
import { drawFrame } from "./render.js";
import { drawTitle, drawEnd, drawPause, isStartKey, isPauseKey } from "./hud.js";
import { playSound } from "./audio.js";

const canvas = document.querySelector("#game");
const status = document.querySelector("#status");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const STEP = 1 / 60;
const keys = new Set();
let pressed = new Set();
let state = createGameState();
let accumulator = 0;
let previousTime = 0;

function normalizeKey(key) {
  if (key === " " || key === "Spacebar") return " ";
  return key.length === 1 ? key.toLowerCase() : key;
}

function beginShift() {
  state = createGameState();
  state.phase = "playing";
  seedOrders(state);
  playSound(state, "serve");
  keys.clear();
  pressed.clear();
  accumulator = 0;
  announce("Lunch rush started. Build and serve!");
}

function announce(message) {
  if (status) status.textContent = message;
}

window.addEventListener("keydown", event => {
  const key = normalizeKey(event.key);
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) event.preventDefault();
  if (!keys.has(key)) pressed.add(key);
  keys.add(key);
  if (event.repeat) return;

  if (state.phase === "title" && isStartKey(event)) {
    beginShift();
    return;
  }
  if (state.phase === "end" && isStartKey(event)) {
    beginShift();
    return;
  }
  if (state.phase === "paused" && (isPauseKey(event) || isStartKey(event))) {
    state.phase = "playing";
    announce("Shift resumed.");
    return;
  }
  if (state.phase === "playing" && isPauseKey(event)) {
    state.phase = "paused";
    announce("Shift paused. Press P or Enter to resume.");
    return;
  }
  if (state.phase === "playing" && isStartKey(event)) {
    serveDish(state);
    announce(state.message);
  }
});

window.addEventListener("keyup", event => {
  keys.delete(normalizeKey(event.key));
});
window.addEventListener("blur", () => keys.clear());

function update(deltaTime) {
  if (state.phase !== "playing") return;
  state.elapsed += deltaTime;
  state.dayRemaining = Math.max(0, state.dayRemaining - deltaTime);
  state.messageTime = Math.max(0, state.messageTime - deltaTime);
  updateChef(state, keys, deltaTime);
  updateStationWork(state, keys, pressed, deltaTime);
  interactWithKitchen(state, pressed);
  updateOrders(state, deltaTime);
  if (state.dayRemaining <= 0 || state.reputation <= 0) {
    state.phase = "end";
    keys.clear();
    announce("Shift over. Press Enter to play again.");
  } else if (state.messageTime > 0) {
    announce(state.message);
  }
}

function frame(timestamp) {
  if (!previousTime) previousTime = timestamp;
  const frameTime = Math.min(0.1, (timestamp - previousTime) / 1000);
  previousTime = timestamp;
  accumulator += frameTime;
  while (accumulator >= STEP) {
    update(STEP);
    pressed = new Set();
    accumulator -= STEP;
  }

  drawFrame(ctx, state, timestamp / 1000);
  if (state.phase === "title") drawTitle(ctx);
  else if (state.phase === "paused") drawPause(ctx);
  else if (state.phase === "end") drawEnd(ctx, state);
  requestAnimationFrame(frame);
}

announce("Sizzle Lane. Press Enter to start.");
requestAnimationFrame(frame);
