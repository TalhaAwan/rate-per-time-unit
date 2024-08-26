class RatePerSecond {
  private hash: Map<number, number> = new Map();
  private window: number = 10;

  constructor(window?: number) {
    if (window && Number.isInteger(window) && window > 0 && window <= 20) {
      this.window = window;
    }
  }

  registerEvent() {
    const thisSecond = Math.round(new Date().getTime() / 1000);

    if (this.hash.has(thisSecond)) {
      this.hash.set(thisSecond, this.hash.get(thisSecond) as number + 1)
    }
    else {
      if (this.hash.size >= this.window) {
        this.hash.delete(this.hash.keys().next().value);
      }
      this.hash.set(thisSecond, 1);
    }
  }

  getRatePerSecond() {
    const thisSecond = Math.round(new Date().getTime() / 1000);
    const windowStart = thisSecond - this.window;

    let count = 0;
    let occurences = 0;

    for (const [key, value] of this.hash.entries()) {
      if (key >= windowStart) {
        count += value;
        occurences++;
      }
    }

    if (!count) return 0;

    return parseFloat((count / occurences).toFixed(2));
  }
}

export { RatePerSecond };
