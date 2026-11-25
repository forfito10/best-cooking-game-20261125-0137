export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 600;
export const DAY_LENGTH = 120;

export const INGREDIENTS = {
  bread: { label: "Bread", color: "#d99a48", mark: "B", needsChop: false },
  patty: { label: "Patty", color: "#8b4934", mark: "P", needsChop: false },
  lettuce: { label: "Lettuce", color: "#64ad58", mark: "L", needsChop: true },
  tomato: { label: "Tomato", color: "#e9674f", mark: "T", needsChop: true },
  cheese: { label: "Cheese", color: "#f2c94c", mark: "C", needsChop: false },
  "bun-top": { label: "Bun top", color: "#e6a950", mark: "↑", needsChop: false }
};

export function makeIngredient(type) {
  return { type, chopped: false, cooked: false, chops: 0 };
}

export function createGameState() {
  return {
    phase: "title",
    elapsed: 0,
    dayRemaining: DAY_LENGTH,
    coins: 0,
    served: 0,
    reputation: 3,
    combo: 0,
    bestCombo: 0,
    chef: { x: 475, y: 470, speed: 230, carry: null, facing: "up" },
    stations: {
      board: { x: 285, y: 230, item: null },
      stove: { x: 490, y: 230, item: null, progress: 0 },
      plating: { x: 700, y: 230, plate: [] },
      trash: { x: 860, y: 230 }
    },
    orders: [],
    nextOrderId: 1,
    orderSpawnClock: 0,
    message: "",
    messageTime: 0,
    lastOrderResult: "",
    audio: null
  };
}
