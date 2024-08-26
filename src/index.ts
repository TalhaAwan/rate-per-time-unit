class RatePerTimeUnit {
  protected hash: Map<number, number> = new Map();
  protected window: number;

  constructor(window: number = 10) {
    if (Number.isInteger(window) && window > 0 && window <= 20) {
      this.window = window;
    } else {
      throw new Error("Window must be an integer between 1 and 20");
    }
  }

  protected registerEvent(timeUnit: number) {
    const thisTimeUnit = Math.round(new Date().getTime() / (1000 * timeUnit));

    if (this.hash.has(thisTimeUnit)) {
      this.hash.set(thisTimeUnit, this.hash.get(thisTimeUnit) as number + 1);
    } else {
      if (this.hash.size >= this.window) {
        this.hash.delete(this.hash.keys().next().value);
      }
      this.hash.set(thisTimeUnit, 1);
    }
  }

  protected getRate(timeUnit: number) {
    const thisTimeUnit = Math.round(new Date().getTime() / (1000 * timeUnit));
    const windowStart = thisTimeUnit - this.window;

    let count = 0;
    let occurrences = 0;

    for (const [key, value] of this.hash.entries()) {
      if (key >= windowStart) {
        count += value;
        occurrences++;
      }
    }


    return {
      count, occurrences
    }
  }
}


class RatePerSecond extends RatePerTimeUnit {
  constructor(window?: number) {
    if (!window) {
      super(10);
    }
    else if (Number.isInteger(window) && window > 0 && window <= 20) {
      super(window);
    } else {
      throw new Error("Sliding window for rate per second must be an integer between 1 and 20");
    }
  }

  registerEvent() {
    super.registerEvent(1);
  }

  getRatePerSecond() {
    const { count, occurrences } = super.getRate(1);
    if (!count) return 0;
    return parseFloat((count / occurrences).toFixed(2));
  }
}


class RatePerMinute {
  private hash: Map<number, number> = new Map();
  private window: number = 10;

  constructor(window?: number) {
    if (window && Number.isInteger(window) && window > 0 && window <= 120) {
      this.window = window;
    }
  }

  registerEvent() {
    const thisSecond = Math.floor(new Date().getTime() / 1000);

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

  getRatePerMinute() {
    const thisSecond = Math.floor(new Date().getTime() / 1000);
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

    return parseFloat(((60 / occurences) * count).toFixed(2));
  }
}


class RatePerHour {
  private hash: Map<number, number> = new Map();
  private window: number = 10;

  constructor(window?: number) {
    if (window && Number.isInteger(window) && window > 0 && window <= 120) {
      this.window = window;
    }
  }

  registerEvent() {
    const thisSecond = Math.floor(new Date().getTime() / 60000);

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

  getRatePerHour() {
    const thisSecond = Math.floor(new Date().getTime() / 60000);
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

    return parseFloat(((60 / occurences) * count).toFixed(2));
  }
}

export { RatePerSecond, RatePerMinute, RatePerHour };
