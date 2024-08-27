# rate-per-time-unit

rate-per-time-unit is a lightweight JavaScript package that allows you to calculate the rate of recurring events per second, per minute, or per hour using a sliding window. It is useful for monitoring metrics like heartbeats per minute, network requests per hour, or clicks per second.

## Installation

> npm install rate-per-time-unit

## Usage

### 1. Rate Per Second (e.g., Clicks Per Second)

```JavaScript
import { RatePerSecond } from 'rate-per-time-unit';

const clickRate = new RatePerSecond({ slidingWindow: 3 }); // 6-second sliding window

// Register events (e.g., clicks)
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:01
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:01
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:03
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:03
// ...

console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:03

// -> 2 (events per second within the sliding window)

console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:04

// -> 5 (events per second within the sliding window)

console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:04

// -> 5 (events per second within the sliding window)


```

### 2. Rate Per Minute (e.g., Heartbeats Per Minute)

```JavaScript
import { RatePerMinute } from 'rate-per-time-unit';

const heartBeat = new RatePerMinute({ slidingWindow: 10 }); // 10-minute sliding window

// Register events (e.g., heartbeats)
heartBeat.registerEvent(); // at Tue Aug 27 2024 14:07:01
heartBeat.registerEvent(); // at Tue Aug 27 2024 14:07:01
heartBeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartBeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartBeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartBeat.registerEvent(); // at Tue Aug 27 2024 14:07:03
// ...

console.log(heartBeat.getRatePerMinute()); // Outputs the average rate of events per minute within the sliding window

```

### 3. Rate Per Hour (e.g., Network Requests Per Hour)

```JavaScript
import { RatePerHour } from 'rate-per-time-unit';

const ratePerHour = new RatePerHour({ slidingWindow: 2 }); // 2-hour sliding window

// Register events (e.g., network requests)
ratePerHour.registerEvent();
ratePerHour.registerEvent();
// ...

console.log(ratePerHour.getRatePerHour()); // Outputs the average rate of events per hour within the sliding window

```

## Options

### slidingWindow

The slidingWindow option controls the number of time units (seconds or minutes) that the rate calculation considers. This allows you to smooth out short-term fluctuations in event rates.

- Higher Value: A higher slidingWindow will average the events over a longer period, which can smooth out spikes and give a more stable long-term rate.

- Lower Value: A lower slidingWindow will be more sensitive to recent changes in the event rate, making it more responsive to short-term fluctuations.

**Default Sliding Window Values:**
RatePerSecond: Default is 5 seconds
RatePerMinute: Default is 6 minutes
RatePerHour: Default is 10 hours

**Min & Max Sliding Window Values:**
RatePerSecond: Min 1, Max 20 seconds
RatePerMinute: Min 1, Max 120 seconds
RatePerHour: Min 1, Max 120 minutes

## License

This project is licensed under the MIT License.
