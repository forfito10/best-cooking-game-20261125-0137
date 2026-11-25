import { INGREDIENTS } from "./state.js";
import { playSound } from "./audio.js";

const TOPPINGS = ["lettuce", "tomato", "cheese"];
const CUSTOMER_NAMES = ["Milo", "June", "Rae", "Pip", "Nico", "Bea", "Sol", "Kit"];
const CUSTOMER_COLORS = ["#e78c56", "#7bb9a4", "#9c87c6", "#e1b84f", "#d87a86"];

export function makeRecipe(seed = Math.random()) {
  const first = Math.floor(seed * 997) % TOPPINGS.length;
  const count = 1 + (Math.floor(seed * 1931) % 3);
  const toppings = [];
  for (let index = 0; index < count; index += 1) toppings.push(TOPPINGS[(first + index) % TOPPINGS.length]);
  if (count === 3 && Math.floor(seed * 7919) % 2) toppings.reverse();
  return ["bread", "patty", ...toppings, "bun-top"];
}

export function createOrder(state) {
  const id = state.nextOrderId++;
  const seed = Math.random();
  state.orders.push({
    id,
    name: CUSTOMER_NAMES[Math.floor(seed * CUSTOMER_NAMES.length)],
    color: CUSTOMER_COLORS[Math.floor(seed * CUSTOMER_COLORS.length)],
    recipe: makeRecipe(seed),
    patience: 32 + Math.random() * 14,
    maxPatience: 46,
    basePay: 12 + Math.floor(Math.random() * 5)
  });
}

export function seedOrders(state) {
  createOrder(state);
  createOrder(state);
  createOrder(state);
}

export function updateOrders(state, deltaTime) {
  for (let index = state.orders.length - 1; index >= 0; index -= 1) {
    const order = state.orders[index];
    order.patience = Math.max(0, order.patience - deltaTime);
    if (order.patience === 0) {
      state.orders.splice(index, 1);
      loseReputation(state, order.name + " left without lunch");
    }
  }
  state.orderSpawnClock -= deltaTime;
  if (state.orders.length < 3 && state.orderSpawnClock <= 0) {
    createOrder(state);
    state.orderSpawnClock = 1.6;
  }
}

export function findMatchingOrder(state, dish) {
  return state.orders.find(order =>
    order.recipe.length === dish.length && order.recipe.every((type, index) => type === dish[index].type)
  ) ?? null;
}

export function canAddToPlate(state, dish, item) {
  return state.orders.some(order =>
    dish.length < order.recipe.length &&
    order.recipe.slice(0, dish.length).every((type, index) => type === dish[index].type) &&
    order.recipe[dish.length] === item.type
  );
}

export function serveDish(state, play = true) {
  const dish = state.stations.plating.plate;
  if (!dish.length) {
    showMessage(state, "Build a burger on the plating counter first");
    return false;
  }
  const order = findMatchingOrder(state, dish);
  if (!order) {
    state.stations.plating.plate = [];
    state.combo = 0;
    loseReputation(state, "Wrong plate! The kitchen takes a hit");
    if (play) playSound(state, "fail");
    return false;
  }
  const ratio = order.patience / order.maxPatience;
  const tip = Math.max(0, Math.floor(ratio * 10));
  const perfect = ratio >= 0.5;
  state.combo = perfect ? state.combo + 1 : 0;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  const multiplier = perfect ? Math.min(3, 1 + Math.floor((state.combo - 1) / 3)) : 1;
  const pay = order.basePay + tip;
  state.coins += pay * multiplier;
  state.served += 1;
  state.orders = state.orders.filter(entry => entry.id !== order.id);
  state.stations.plating.plate = [];
  state.orderSpawnClock = 0.8;
  state.lastOrderResult = perfect ? "PERFECT" : "SERVED";
  showMessage(state, order.name + " served! +" + (pay * multiplier) + " coins" + (tip ? " (" + tip + " tip)" : ""));
  if (play) playSound(state, "serve");
  return true;
}

export function loseReputation(state, message) {
  state.reputation = Math.max(0, state.reputation - 1);
  state.combo = 0;
  showMessage(state, message);
  if (state.reputation === 0) state.dayRemaining = Math.min(state.dayRemaining, 0);
}

export function showMessage(state, message, duration = 2.5) {
  state.message = message;
  state.messageTime = duration;
}

export function ingredientName(type) {
  return INGREDIENTS[type]?.label ?? type;
}
