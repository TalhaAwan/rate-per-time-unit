# rate-per-time-unit

rate-per-time-unit is a lightweight JavaScript package that allows you to calculate the rate of recurring events per second, per minute, or per hour using a sliding window. It is useful for monitoring metrics like heartbeats per minute, network requests per hour, or clicks per second.

## Installation

> npm install rate-per-time-unit

## Usage

### 1. Rate Per Second (e.g., Clicks Per Second)

```JavaScript
import { RatePerSecond } from 'rate-per-time-unit';

const clickRate = new RatePerSecond({ slidingWindow: 3 }); // 3-second sliding window

clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:01
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:01
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:03
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:03

console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:03 -> 2.67
console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:04 -> 2
console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:05 -> 0.67
console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:06 -> 0

clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:06

console.log(clickRate.getRatePerSecond()); // at Tue Aug 27 2024 14:07:06 -> 0.67

```

### 2. Rate Per Minute (e.g., Heartbeats Per Minute)

```JavaScript
import { RatePerMinute } from 'rate-per-time-unit';

const heartbeat = new RatePerMinute({ slidingWindow: 3 }); // 3-second sliding window

heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:01
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:01
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:03
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:03

console.log(heartbeat.getRatePerMinute()); // at Tue Aug 27 2024 14:07:03 -> 160
console.log(heartbeat.getRatePerMinute()); // at Tue Aug 27 2024 14:07:04 -> 120
console.log(heartbeat.getRatePerMinute()); // at Tue Aug 27 2024 14:07:05 -> 40
console.log(heartbeat.getRatePerMinute()); // at Tue Aug 27 2024 14:07:06 -> 0

heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:06

console.log(heartbeat.getRatePerMinute()); // at Tue Aug 27 2024 14:07:06 -> 40

```

### 3. Rate Per Hour (e.g., Network Requests Per Hour)

```JavaScript
import { RatePerHour } from 'rate-per-time-unit';

const networkRequests = new RatePerHour({ slidingWindow: 3 }); // 3-minute sliding window

networkRequests.registerEvent(); // at Tue Aug 27 2024 14:01:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:01:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:01:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:02:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:02:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:02:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:03:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:03:01

console.log(networkRequests.getRatePerHour()); // at Tue Aug 27 2024 14:04:01 -> 160
console.log(networkRequests.getRatePerHour()); // at Tue Aug 27 2024 14:05:01 -> 120
console.log(networkRequests.getRatePerHour()); // at Tue Aug 27 2024 14:06:01 -> 40
console.log(networkRequests.getRatePerHour()); // at Tue Aug 27 2024 14:07:01 -> 0

networkRequests.registerEvent(); // at Tue Aug 27 2024 14:07:01

console.log(networkRequests.getRatePerHour()); // at Tue Aug 27 2024 14:07:01 -> 40

```

## Options

### slidingWindow

The `slidingWindow` option controls the number of time units (in seconds for per second and per minute calculations, or in minutes for per hour calculations) that the rate calculation considers. This allows you to smooth out short-term fluctuations in event rates.

- **Higher Value**: A higher `slidingWindow` will average the events over a longer period, which can smooth out spikes and give a more stable long-term rate.

- **Lower Value**: A lower `slidingWindow` will be more sensitive to recent changes in the event rate, making it more responsive to short-term fluctuations.

**Default Sliding Window Values**

- RatePerSecond: 5 seconds
- RatePerMinute: 6 seconds
- RatePerHour: 10 minutes

**Min & Max Sliding Window Values**

- RatePerSecond: Min 1, Max 20 seconds
- RatePerMinute: Min 1, Max 120 seconds
- RatePerHour: Min 1, Max 120 minutes

## License

This project is licensed under the MIT License.
