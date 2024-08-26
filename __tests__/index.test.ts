import { RatePerSecond } from '../src';


const registerEvent = (heartBeat: RatePerSecond, numOfCalls = 1) => {
  for (let i = 0; i < numOfCalls; i++) {
    heartBeat.registerEvent();
  }
}

describe("RatePerSecond", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('get 0 rate per second when no event is registered', async () => {
    const heartBeat = new RatePerSecond(5);
    expect(heartBeat.getRatePerSecond()).toBe(0);
  });

  test('get 0 rate per second when all the registered events are old and outside the window', async () => {
    const heartBeat = new RatePerSecond(7);

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);


    mockedDate.setSeconds(15) // <-- outside the 7 second window (14 - 7 = 8)
    jest.setSystemTime(mockedDate);
    expect(heartBeat.getRatePerSecond()).toBe(0);

  });

  test('get rate per second for one second', async () => {
    const heartBeat = new RatePerSecond();

    const mockedDate = new Date();
    jest.setSystemTime(mockedDate);

    registerEvent(heartBeat, 3);

    expect(heartBeat.getRatePerSecond()).toBe(3);

  });

  test('get rate per second for 2 consecutive seconds', async () => {
    const heartBeat = new RatePerSecond();

    const mockedDate = new Date();
    mockedDate.setSeconds(1)

    jest.setSystemTime(mockedDate);

    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(2);
    jest.setSystemTime(mockedDate);

    registerEvent(heartBeat, 2);

    expect(heartBeat.getRatePerSecond()).toBe(2.5);

  });

  test('get rate per second for 2 non-consecutive seconds', async () => {
    const heartBeat = new RatePerSecond();

    const mockedDate = new Date();

    mockedDate.setSeconds(1)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(7);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    expect(heartBeat.getRatePerSecond()).toBe(2.5);

  });

  test('get rate per second for 3 consecutive seconds', async () => {
    const heartBeat = new RatePerSecond();

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 6);

    expect(heartBeat.getRatePerSecond()).toBe(3.67);

  });

  test('get rate per second for 3 non-consecutive seconds', async () => {
    const heartBeat = new RatePerSecond();

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(9)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 6);

    expect(heartBeat.getRatePerSecond()).toBe(3.67);

  });


  test('get rate per second for a custom window', async () => {
    const heartBeat = new RatePerSecond(5);

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    expect(heartBeat.getRatePerSecond()).toBe(2.6);

  });

  test('get rate per second for a custom window 1', async () => {
    const heartBeat = new RatePerSecond(1);

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    expect(heartBeat.getRatePerSecond()).toBe(2);
  });

  test('get rate per second for a custom window 1, ignoring seconds outside the window', async () => {
    const heartBeat = new RatePerSecond(1);

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    mockedDate.setSeconds(2);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 1);

    expect(heartBeat.getRatePerSecond()).toBe(1);
  });

  test('get rate per second, ignoring from calculation the seconds that fall outside the window start', async () => {
    const heartBeat = new RatePerSecond(5);

    const mockedDate = new Date();

    mockedDate.setSeconds(1);
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 2);

    mockedDate.setSeconds(2)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    // ^ to be ignored from calculation

    mockedDate.setSeconds(3)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(4)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(5)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(6)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    mockedDate.setSeconds(7)
    jest.setSystemTime(mockedDate);
    registerEvent(heartBeat, 3);

    expect(heartBeat.getRatePerSecond()).toBe(3);

  });
});


