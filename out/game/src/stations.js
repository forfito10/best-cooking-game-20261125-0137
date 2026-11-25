import { INGREDIENTS, makeIngredient } from "./state.js";
import { canAddToPlate, showMessage } from "./orders.js";
import { distanceToChef } from "./chef.js";
import { playSound } from "./audio.js";

const PANTRY = [
  { x: 92, y: 286, type: "bread" },
  { x: 160, y: 286, type: "patty" },
  { x: 92, y: 358, type: "lettuce" },
  { x: 160, y: 358, type: "tomato" },
  { x: 92, y: 430, type: "cheese" },
  { x: 160, y: 430, type: "bun-top" }
];

export function pantryItems() {
  return PANTRY;
}

export function updateStationWork(state, keys, pressed, deltaTime) {
  const board = state.stations.board;
  const stove = state.stations.stove;
  const nearBoard = distanceToChef(state.chef, board) < 78;
  const nearStove = distanceToChef(state.chef, stove) < 78;
  if (nearBoard && pressed.has(" ") && board.item) {
    if (INGREDIENTS[board.item.type]?.needsChop && !board.item.chopped) {
      board.item.chops += 1;
      playSound(state, "chop");
      if (board.item.chops >= 2) {
        board.item.chopped = true;
        showMessage(state, INGREDIENTS[board.item.type].label + " chopped and ready");
      } else {
        showMessage(state, "Chop once more");
      }
    } else {
      showMessage(state, "That ingredient is ready to plate");
    }
  }
  if (nearStove && stove.item?.type === "patty" && !stove.item.cooked && keys.has(" ")) {
    stove.progress = Math.min(2, stove.progress + deltaTime);
    if (stove.progress >= 2) {
      stove.item.cooked = true;
      showMessage(state, "Patty cooked! Pick it up from the pan");
      playSound(state, "sizzle");
    }
  }
}

export function interactWithKitchen(state, pressed) {
  if (!pressed.has("e")) return;
  const chef = state.chef;
  const stations = state.stations;
  const nearby = [
    { name: "trash", point: stations.trash, range: 76 },
    { name: "board", point: stations.board, range: 74 },
    { name: "stove", point: stations.stove, range: 74 },
    { name: "plating", point: stations.plating, range: 80 }
  ].map(entry => ({ ...entry, distance: distanceToChef(chef, entry.point) }))
    .filter(entry => entry.distance < entry.range)
    .sort((a, b) => a.distance - b.distance);

  if (nearby.length && nearby[0].name === "trash") {
    useTrash(state);
    return;
  }
  if (chef.carry) {
    const target = nearby.find(entry => entry.name === "board" || entry.name === "stove" || entry.name === "plating");
    if (target) {
      if (target.name === "board") placeOnBoard(state);
      if (target.name === "stove") placeOnStove(state);
      if (target.name === "plating") addToPlate(state);
      return;
    }
    showMessage(state, "Move beside a station to set that ingredient down");
    return;
  }
  if (nearby.length) {
    const target = nearby[0];
    if (target.name === "board" && stations.board.item) {
      chef.carry = stations.board.item;
      stations.board.item = null;
      showMessage(state, INGREDIENTS[chef.carry.type].label + " picked up");
      return;
    }
    if (target.name === "stove" && stations.stove.item) {
      if (!stations.stove.item.cooked) {
        showMessage(state, "Hold SPACE here to cook the patty");
      } else {
        chef.carry = stations.stove.item;
        stations.stove.item = null;
        stations.stove.progress = 0;
        showMessage(state, "Cooked patty picked up");
      }
      return;
    }
    if (target.name === "plating" && stations.plating.plate.length) {
      showMessage(state, "Press ENTER here to serve the plate");
      return;
    }
  }
  const shelf = PANTRY.map(item => ({ ...item, distance: distanceToChef(chef, item) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (shelf && shelf.distance < 78) {
    chef.carry = makeIngredient(shelf.type);
    showMessage(state, INGREDIENTS[shelf.type].label + " picked from pantry");
  } else {
    showMessage(state, "Move to the pantry or a station and press E");
  }
}

function placeOnBoard(state) {
  if (state.stations.board.item) {
    showMessage(state, "The cutting board is occupied");
    return;
  }
  state.stations.board.item = state.chef.carry;
  state.chef.carry = null;
  showMessage(state, "SPACE twice to chop produce");
}

function placeOnStove(state) {
  if (state.chef.carry.type !== "patty") {
    showMessage(state, "The pan is for patties");
    return;
  }
  if (state.stations.stove.item) {
    showMessage(state, "The pan is occupied");
    return;
  }
  state.stations.stove.item = state.chef.carry;
  state.chef.carry = null;
  state.stations.stove.progress = 0;
  showMessage(state, "Hold SPACE by the pan to cook");
}

function addToPlate(state) {
  const plate = state.stations.plating.plate;
  if (!canAddToPlate(state, plate, state.chef.carry)) {
    showMessage(state, "No open order needs " + INGREDIENTS[state.chef.carry.type].label + " next");
    return;
  }
  if (state.chef.carry.type === "patty" && !state.chef.carry.cooked) {
    showMessage(state, "Cook the patty before plating");
    return;
  }
  if (INGREDIENTS[state.chef.carry.type].needsChop && !state.chef.carry.chopped) {
    showMessage(state, "Chop that ingredient before plating");
    return;
  }
  plate.push(state.chef.carry);
  state.chef.carry = null;
  showMessage(state, INGREDIENTS[plate[plate.length - 1].type].label + " added to burger");
}

function useTrash(state) {
  if (state.chef.carry) {
    state.chef.carry = null;
    showMessage(state, "Ingredient tossed");
  } else if (state.stations.plating.plate.length) {
    state.stations.plating.plate = [];
    showMessage(state, "Plate cleared");
  } else {
    showMessage(state, "Trash is empty");
  }
}
