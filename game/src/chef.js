export function updateChef(state, keys, deltaTime) {
  const chef = state.chef;
  let horizontal = 0;
  let vertical = 0;
  if (keys.has("ArrowLeft") || keys.has("a")) horizontal -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) horizontal += 1;
  if (keys.has("ArrowUp") || keys.has("w")) vertical -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) vertical += 1;
  if (horizontal && vertical) {
    horizontal *= Math.SQRT1_2;
    vertical *= Math.SQRT1_2;
  }
  if (horizontal) chef.facing = horizontal < 0 ? "left" : "right";
  else if (vertical) chef.facing = vertical < 0 ? "up" : "down";
  chef.x = Math.max(32, Math.min(928, chef.x + horizontal * chef.speed * deltaTime));
  chef.y = Math.max(155, Math.min(565, chef.y + vertical * chef.speed * deltaTime));
}

export function distanceToChef(chef, point) {
  return Math.hypot(chef.x - point.x, chef.y - point.y);
}
