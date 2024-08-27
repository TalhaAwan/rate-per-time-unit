import { RatePerSecond, RatePerMinute, RatePerHour } from '..';

const registerEvent = (event: RatePerSecond | RatePerMinute | RatePerHour, numOfCallsToRegister = 1) => {
  for (let i = 0; i < numOfCallsToRegister; i++) {
    event.registerEvent();
  }
};

describe("RatePerSecond", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('throw error if sliding window is less than 1 seconds', async () => {
    expect(() => {
      new RatePerSecond({ slidingWindow: 0 })
    }).toThrow("Sliding window for rate per second must be between 1 and 20 seconds");
  });

  test('throw error if sliding window is greater than 20 seconds', async () => {
    expect(() => {
      new RatePerSecond({ slidingWindow: 21 })
    }).toThrow("Sliding window for rate per second must be between 1 and 20 seconds");
  });

  test('get 0 rate per second when no event is registered', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 5 });
    expect(clickRate.getRatePerSecond()).toBe(0);
  });

  test('get 0 rate per second when all the registered events are old and outside the sliding window', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 7 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);


    mockedDate.setSeconds(15) // <-- outside the 7 second sliding window (14 - 7 = 8)
    jest.setSystemTime(mockedDate);
    expect(clickRate.getRatePerSecond()).toBe(0);

  });

  test('get rate per second for one second', async () => {
    const clickRate = new RatePerSecond();

    const mockedDate = new Date();
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    expect(clickRate.getRatePerSecond()).toBe(0.6);

  });

  test('get rate per second for 2 consecutive seconds', async () => {
    const clickRate = new RatePerSecond();

    const mockedDate = new Date();
    mockedDate.setSeconds(1)

    jest.setSystemTime(mockedDate);

    registerEvent(clickRate, 3);

    mockedDate.setSeconds(2);
    jest.setSystemTime(mockedDate);

    registerEvent(clickRate, 2);

    expect(clickRate.getRatePerSecond()).toBe(1);

  });

  test('get rate per second for 2 non-consecutive seconds', async () => {
    const clickRate = new RatePerSecond();

    const mockedDate = new Date();

    mockedDate.setSeconds(1)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(5);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    expect(clickRate.getRatePerSecond()).toBe(1);

  });

  test('get rate per second for 3 consecutive seconds', async () => {
    const clickRate = new RatePerSecond();

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 6);

    expect(clickRate.getRatePerSecond()).toBe(2.2);

  });

  test('get rate per second for 3 non-consecutive seconds', async () => {
    const clickRate = new RatePerSecond();

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 6);

    expect(clickRate.getRatePerSecond()).toBe(2.2);
  });

  test('get rate per second for a custom sliding window', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 5 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    expect(clickRate.getRatePerSecond()).toBe(2.6);

  });


  test('get rate per second for a sliding window over time', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 3 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 4);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    expect(clickRate.getRatePerSecond()).toBe(2.67);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);

    expect(clickRate.getRatePerSecond()).toBe(2);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);

    expect(clickRate.getRatePerSecond()).toBe(0.67);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);

    expect(clickRate.getRatePerSecond()).toBe(0);

    registerEvent(clickRate, 2);

    expect(clickRate.getRatePerSecond()).toBe(0.67);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    expect(clickRate.getRatePerSecond()).toBe(1.33);
  });

  test('get rate per second for a custom sliding window 1', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 1 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    expect(clickRate.getRatePerSecond()).toBe(2);
  });

  test('get rate per minute for a custom sliding window 20 & high count', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 20 });

    const mockedDate = new Date();

    for (let i = 0; i < 70; i++) {
      jest.setSystemTime(new Date(mockedDate.getTime() + (i * 1000)));

      registerEvent(clickRate, i % 2 === 0 ? 10000 : 20000);
    }

    expect(clickRate.getRatePerSecond()).toBe(15000);
  });

  test('get rate per second for a custom sliding window 1, ignoring seconds outside the sliding window', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 1 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(2);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 1);

    expect(clickRate.getRatePerSecond()).toBe(1);
  });

  test('get rate per second, ignoring from calculation the seconds that fall outside the sliding window start', async () => {
    const clickRate = new RatePerSecond({ slidingWindow: 5 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    // ^ to be ignored from calculation

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(clickRate, 3);

    expect(clickRate.getRatePerSecond()).toBe(3);

  });
});


describe("RatePerMinute", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('throw error if sliding window is less than 1 seconds', async () => {
    expect(() => {
      new RatePerMinute({ slidingWindow: 0 })
    }).toThrow("Sliding window for rate per minute must be between 1 and 120 seconds");
  });

  test('throw error if sliding window is greater than 120 seconds', async () => {
    expect(() => {
      new RatePerMinute({ slidingWindow: 121 })
    }).toThrow("Sliding window for rate per minute must be between 1 and 120 seconds");
  });

  test('get 0 rate per minute when no event is registered', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 5 });
    expect(heartbeat.getRatePerMinute()).toBe(0);
  });

  test('get 0 rate per minute when all the registered events are old and outside the sliding window', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 7 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);


    mockedDate.setSeconds(15) // <-- outside the 7 second sliding window (14 - 7 = 8)
    jest.setSystemTime(mockedDate);
    expect(heartbeat.getRatePerMinute()).toBe(0);

  });

  test('get rate per minute for one second', async () => {
    const heartbeat = new RatePerMinute();

    const mockedDate = new Date();
    jest.setSystemTime(mockedDate);

    registerEvent(heartbeat, 3);

    expect(heartbeat.getRatePerMinute()).toBe(30);

  });

  test('get rate per minute for 2 consecutive seconds', async () => {
    const heartbeat = new RatePerMinute();

    const mockedDate = new Date();
    mockedDate.setSeconds(1)

    jest.setSystemTime(mockedDate);

    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(2);
    jest.setSystemTime(mockedDate);

    registerEvent(heartbeat, 2);

    expect(heartbeat.getRatePerMinute()).toBe(50);

  });

  test('get rate per minute for 2 non-consecutive seconds', async () => {
    const heartbeat = new RatePerMinute();

    const mockedDate = new Date();

    mockedDate.setSeconds(1)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(5);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    expect(heartbeat.getRatePerMinute()).toBe(50);

  });

  test('get rate per minute for 3 consecutive seconds', async () => {
    const heartbeat = new RatePerMinute();

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 6);

    expect(heartbeat.getRatePerMinute()).toBe(110);

  });

  test('get rate per minute for 3 non-consecutive seconds', async () => {
    const heartbeat = new RatePerMinute();

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 6);

    expect(heartbeat.getRatePerMinute()).toBe(110);

  });


  test('get rate per minute for a custom sliding window', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 5 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    expect(heartbeat.getRatePerMinute()).toBe(156);

  });


  test('get rate per minute for a sliding window over time', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 3 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 4);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    expect(heartbeat.getRatePerMinute()).toBe(160);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);

    expect(heartbeat.getRatePerMinute()).toBe(120);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);

    expect(heartbeat.getRatePerMinute()).toBe(40);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);

    expect(heartbeat.getRatePerMinute()).toBe(0);

    registerEvent(heartbeat, 2);

    expect(heartbeat.getRatePerMinute()).toBe(40);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    expect(heartbeat.getRatePerMinute()).toBe(80);
  });


  test('get rate per minute for a custom sliding window 1', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 1 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    expect(heartbeat.getRatePerMinute()).toBe(120);
  });

  test('get rate per minute for a custom sliding window 120', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 120 });

    const mockedDate = new Date();

    for (let i = 0; i < 120; i++) {
      jest.setSystemTime(new Date(mockedDate.getTime() + (i * 1000)));

      registerEvent(heartbeat, i % 2 === 0 ? 1 : 2);
    }

    expect(heartbeat.getRatePerMinute()).toBe(90);
  });

  test('get rate per minute for a custom sliding window 70 & high count', async () => {
    const networkRequests = new RatePerMinute({ slidingWindow: 70 });

    const mockedDate = new Date();

    for (let i = 0; i < 70; i++) {
      jest.setSystemTime(new Date(mockedDate.getTime() + (i * 1000)));

      registerEvent(networkRequests, i % 2 === 0 ? 10000 : 20000);
    }

    expect(networkRequests.getRatePerMinute()).toBe(900000);
  });

  test('get rate per minute for a custom sliding window 1, ignoring seconds outside the sliding window', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 1 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(2);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 1);

    expect(heartbeat.getRatePerMinute()).toBe(60);
  });

  test('get rate per minute, ignoring from calculation the seconds that fall outside the sliding window start', async () => {
    const heartbeat = new RatePerMinute({ slidingWindow: 5 });

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    // ^ to be ignored from calculation

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(heartbeat, 3);

    expect(heartbeat.getRatePerMinute()).toBe(180);

  });
});


describe("RatePerHour", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('throw error if sliding window is less than 1 minutes', async () => {
    expect(() => {
      new RatePerHour({ slidingWindow: 0 })
    }).toThrow("Sliding window for rate per hour must be between 1 and 120 minutes");
  });

  test('throw error if sliding window is greater than 120 minutes', async () => {
    expect(() => {
      new RatePerHour({ slidingWindow: 121 })
    }).toThrow("Sliding window for rate per hour must be between 1 and 120 minutes");
  });

  test('get 0 rate per hour when no event is registered', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 5 });
    expect(networkRequests.getRatePerHour()).toBe(0);
  });

  test('get 0 rate per hour when all the registered events are old and outside the sliding window', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 7 });

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(2)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(3)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(4)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(5)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(6)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(7)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);


    mockedDate.setMinutes(15) // <-- outside the 7 minute sliding window (14 - 7 = 8)
    jest.setSystemTime(mockedDate);
    expect(networkRequests.getRatePerHour()).toBe(0);

  });

  test('get rate per hour for one minute', async () => {
    const networkRequests = new RatePerHour();

    const mockedDate = new Date();
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    expect(networkRequests.getRatePerHour()).toBe(18);

  });

  test('get rate per hour for 2 consecutive minutes', async () => {
    const networkRequests = new RatePerHour();

    const mockedDate = new Date();
    mockedDate.setMinutes(1)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(2);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    expect(networkRequests.getRatePerHour()).toBe(30);

  });

  test('get rate per hour for 2 non-consecutive minutes', async () => {
    const networkRequests = new RatePerHour();

    const mockedDate = new Date();

    mockedDate.setMinutes(1)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(7);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    expect(networkRequests.getRatePerHour()).toBe(30);

  });

  test('get rate per hour for 3 consecutive minutes', async () => {
    const networkRequests = new RatePerHour();

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(2)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(3)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 6);

    expect(networkRequests.getRatePerHour()).toBe(66);

  });

  test('get rate per hour for 3 non-consecutive minutes', async () => {
    const networkRequests = new RatePerHour();

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(5)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(9)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 6);

    expect(networkRequests.getRatePerHour()).toBe(66);

  });


  test('get rate per hour for a custom sliding window', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 5 });

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(2)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(3)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(4)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(5)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    expect(networkRequests.getRatePerHour()).toBe(156);

  });

  test('get rate per hour for a custom sliding window 1', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 1 });

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    expect(networkRequests.getRatePerHour()).toBe(120);
  });

  test('get rate per hour for a custom sliding window 120', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 120 });

    const mockedDate = new Date();

    for (let i = 0; i < 120; i++) {
      jest.setSystemTime(new Date(mockedDate.getTime() + (i * 60000)));

      registerEvent(networkRequests, i % 2 === 0 ? 1 : 2);
    }

    expect(networkRequests.getRatePerHour()).toBe(90);
  });

  test('get rate per hour for a custom sliding window 70 & high count', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 70 });

    const mockedDate = new Date();

    for (let i = 0; i < 70; i++) {
      jest.setSystemTime(new Date(mockedDate.getTime() + (i * 60000)));

      registerEvent(networkRequests, i % 2 === 0 ? 10000 : 20000);
    }

    expect(networkRequests.getRatePerHour()).toBe(900000);
  });

  test('get rate per hour for a sliding window over time', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 3 });

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(2)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 4);

    mockedDate.setMinutes(3)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    expect(networkRequests.getRatePerHour()).toBe(160);

    mockedDate.setMinutes(4)
    jest.setSystemTime(mockedDate);

    expect(networkRequests.getRatePerHour()).toBe(120);

    mockedDate.setMinutes(5)
    jest.setSystemTime(mockedDate);

    expect(networkRequests.getRatePerHour()).toBe(40);

    mockedDate.setMinutes(6)
    jest.setSystemTime(mockedDate);

    expect(networkRequests.getRatePerHour()).toBe(0);

    registerEvent(networkRequests, 2);

    expect(networkRequests.getRatePerHour()).toBe(40);

    mockedDate.setMinutes(7)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    expect(networkRequests.getRatePerHour()).toBe(80);
  });


  test('get rate per hour for a custom sliding window 1, ignoring seconds outside the sliding window', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 1 });

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(2);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 1);

    expect(networkRequests.getRatePerHour()).toBe(60);
  });

  test('get rate per hour, ignoring from calculation the seconds that fall outside the sliding window start', async () => {
    const networkRequests = new RatePerHour({ slidingWindow: 5 });

    const mockedDate = new Date();

    mockedDate.setMinutes(1);
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 2);

    mockedDate.setMinutes(2)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    // ^ to be ignored from calculation

    mockedDate.setMinutes(3)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(4)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(5)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(6)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    mockedDate.setMinutes(7)
    jest.setSystemTime(mockedDate);
    registerEvent(networkRequests, 3);

    expect(networkRequests.getRatePerHour()).toBe(180);

  });
});

