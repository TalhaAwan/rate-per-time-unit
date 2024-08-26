class RatePerTimeUnit {
  protected hash: Map<number, number> = new Map();
  protected window: number;

  constructor(window: number) {
    this.window = window;
  }

  protected registerEvent(seconds: number = 1) {
    const thisTimeUnit = Math.round(new Date().getTime() / (1000 * seconds));

    if (this.hash.has(thisTimeUnit)) {
      this.hash.set(thisTimeUnit, this.hash.get(thisTimeUnit) as number + 1);
    } else {
      if (this.hash.size >= this.window) {
        this.hash.delete(this.hash.keys().next().value);
      }
      this.hash.set(thisTimeUnit, 1);
    }
  }

  protected getRate(seconds: number = 1) {
    const thisTimeUnit = Math.round(new Date().getTime() / (1000 * seconds));
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
      super(5);
    }
    else if (Number.isInteger(window) && window > 0 && window <= 20) {
      super(window);
    } else {
      throw new Error("Sliding window for rate per second must be an integer between 1 and 20 seconds");
    }
  }

  registerEvent() {
    super.registerEvent();
  }

  getRatePerSecond() {
    const { count, occurrences } = super.getRate();
    if (!count) return 0;
    return parseFloat((count / occurrences).toFixed(2));
  }
}

class RatePerMinute extends RatePerTimeUnit {
  constructor(window?: number) {
    if (!window) {
      super(6);
    }
    else if (Number.isInteger(window) && window > 0 && window <= 120) {
      super(window);
    } else {
      throw new Error("Sliding window for rate per minute must be an integer between 1 and 120 seconds");
    }
  }

  registerEvent() {
    super.registerEvent();
  }

  getRatePerMinute() {
    const { count, occurrences } = super.getRate();
    if (!count) return 0;
    return parseFloat(((60 / occurrences) * count).toFixed(2));
  }
}

class RatePerHour extends RatePerTimeUnit {
  constructor(window?: number) {
    if (!window) {
      super(10);
    }
    else if (Number.isInteger(window) && window > 0 && window <= 20) {
      super(window);
    } else {
      throw new Error("Sliding window for rate per hour must be an integer between 1 and 120 minutes");
    }
  }

  registerEvent() {
    super.registerEvent(60);
  }

  getRatePerHour() {
    const { count, occurrences } = super.getRate(60);
    if (!count) return 0;
    return parseFloat(((60 / occurrences) * count).toFixed(2));
  }
}

export { RatePerSecond, RatePerMinute, RatePerHour };
