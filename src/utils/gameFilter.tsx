import type { ISlot } from "../types/slot";

export const isInCategory = (
  game: ISlot,
  target: string,
  forHome: boolean = false
) => {
  try {
    const categories = JSON.parse(game.category);
    return forHome
      ? game.show_on_homepage && categories.includes(target)
      : categories.includes(target);
  } catch {
    return false;
  }
};
