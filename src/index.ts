// in seconds
const MIN_SLIDING_WINDOW_SECOND = 1;
const MAX_SLIDING_WINDOW_SECOND = 20;
const DEFAULT_SLIDING_WINDOW_SECOND = 5;

const MIN_SLIDING_WINDOW_MINUTE = 1;
const MAX_MIN_SLIDING_WINDOW_MINUTE = 120;
const DEFAULT_SLIDING_WINDOW_MINUTE = 6;

// in minutes
const MIN_SLIDING_WINDOW_HOUR = 1;
const MAX_SLIDING_WINDOW_HOUR = 120;
const DEFAULT_SLIDING_WINDOW_HOUR = 10;

interface RateOptions {
  slidingWindow?: number;
}

class RatePerTimeUnit {
  protected hash: Map<number, number> = new Map();
  protected slidingWindow: number;

  constructor({ slidingWindow }: RateOptions) {
    this.slidingWindow = slidingWindow!;
  }

  protected registerEvent(seconds: number = 1) {
    const thisTimeUnit = Math.round(new Date().getTime() / (1000 * seconds));

    if (this.hash.has(thisTimeUnit)) {
      this.hash.set(thisTimeUnit, this.hash.get(thisTimeUnit) as number + 1);
    } else {
      if (this.hash.size >= this.slidingWindow) {
        this.hash.delete(this.hash.keys().next().value);
      }
      this.hash.set(thisTimeUnit, 1);
    }
  }

  protected getRate(seconds: number = 1) {
    const thisTimeUnit = Math.round(new Date().getTime() / (1000 * seconds));
    const windowStart = thisTimeUnit - this.slidingWindow;

    let count = 0;
    let occurrences = 0;

    for (const [key, value] of this.hash.entries()) {
      if (key >= windowStart) {
        count += value;
        occurrences++;
      }
    }

    return {
      count,
      occurrences,
    };
  }
}

class RatePerSecond extends RatePerTimeUnit {
  constructor(options: RateOptions = {}) {
    const slidingWindow = options.slidingWindow ?? DEFAULT_SLIDING_WINDOW_SECOND;
    if (Number.isInteger(slidingWindow) && slidingWindow >= MIN_SLIDING_WINDOW_SECOND && slidingWindow <= MAX_SLIDING_WINDOW_SECOND) {
      super({ slidingWindow });
    } else {
      throw new Error(
        `Sliding window for rate per second must be between ${MIN_SLIDING_WINDOW_SECOND} and ${MAX_SLIDING_WINDOW_SECOND} seconds`
      );
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
  constructor(options: RateOptions = {}) {
    const slidingWindow = options.slidingWindow ?? DEFAULT_SLIDING_WINDOW_MINUTE;
    if (Number.isInteger(slidingWindow) && slidingWindow >= MIN_SLIDING_WINDOW_MINUTE && slidingWindow <= MAX_MIN_SLIDING_WINDOW_MINUTE) {
      super({ slidingWindow });
    } else {
      throw new Error(
        `Sliding window for rate per minute must be between ${MIN_SLIDING_WINDOW_MINUTE} and ${MAX_MIN_SLIDING_WINDOW_MINUTE} seconds`
      );
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
  constructor(options: RateOptions = {}) {
    const slidingWindow = options.slidingWindow ?? DEFAULT_SLIDING_WINDOW_HOUR;
    if (Number.isInteger(slidingWindow) && slidingWindow >= MIN_SLIDING_WINDOW_HOUR && slidingWindow <= MAX_SLIDING_WINDOW_HOUR) {
      super({ slidingWindow });
    } else {
      throw new Error(
        `Sliding window for rate per hour must be between ${MIN_SLIDING_WINDOW_HOUR} and ${MAX_SLIDING_WINDOW_HOUR} minutes`
      );
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
