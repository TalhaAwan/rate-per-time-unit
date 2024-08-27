# rate-per-time-unit

![rate-per-time-unit](https://github.com/TalhaAwan/rate-per-time-unit/actions/workflows/ci.yml/badge.svg)

A lightweight JavaScript package that allows you to calculate the rate of recurring events per second, per minute, or per hour using a sliding window.

## Installation

> npm install rate-per-time-unit

OR

> yarn add rate-per-time-unit

## Modules & Their Usage

### 1. RatePerSecond (example usage: clicks per second)

```JavaScript
import { RatePerSecond } from 'rate-per-time-unit';

const clickRate = new RatePerSecond({ slidingWindow: 3 }); // 3 seconds

clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:01
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:01
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:02
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:03
clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:03

clickRate.getRatePerSecond(); // at Tue Aug 27 2024 14:07:03 -> 2.67
clickRate.getRatePerSecond(); // at Tue Aug 27 2024 14:07:04 -> 2
clickRate.getRatePerSecond(); // at Tue Aug 27 2024 14:07:05 -> 0.67
clickRate.getRatePerSecond(); // at Tue Aug 27 2024 14:07:06 -> 0

clickRate.registerEvent(); // at Tue Aug 27 2024 14:07:06

clickRate.getRatePerSecond(); // at Tue Aug 27 2024 14:07:06 -> 0.67

```

### 2. RatePerMinute (example usage: heartbeats per minute)

```JavaScript
import { RatePerMinute } from 'rate-per-time-unit';

const heartbeat = new RatePerMinute({ slidingWindow: 3 }); // 3 seconds

heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:01
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:01
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:02
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:03
heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:03

heartbeat.getRatePerMinute(); // at Tue Aug 27 2024 14:07:03 -> 160
heartbeat.getRatePerMinute(); // at Tue Aug 27 2024 14:07:04 -> 120
heartbeat.getRatePerMinute(); // at Tue Aug 27 2024 14:07:05 -> 40
heartbeat.getRatePerMinute(); // at Tue Aug 27 2024 14:07:06 -> 0

heartbeat.registerEvent(); // at Tue Aug 27 2024 14:07:06

heartbeat.getRatePerMinute(); // at Tue Aug 27 2024 14:07:06 -> 40

```

### 3. RatePerHour (example usage: network requests per hour)

```JavaScript
import { RatePerHour } from 'rate-per-time-unit';

const networkRequests = new RatePerHour({ slidingWindow: 3 }); // 3 minutes

networkRequests.registerEvent(); // at Tue Aug 27 2024 14:01:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:01:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:01:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:02:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:02:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:02:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:03:01
networkRequests.registerEvent(); // at Tue Aug 27 2024 14:03:01

networkRequests.getRatePerHour(); // at Tue Aug 27 2024 14:04:01 -> 160
networkRequests.getRatePerHour(); // at Tue Aug 27 2024 14:05:01 -> 120
networkRequests.getRatePerHour(); // at Tue Aug 27 2024 14:06:01 -> 40
networkRequests.getRatePerHour(); // at Tue Aug 27 2024 14:07:01 -> 0

networkRequests.registerEvent(); // at Tue Aug 27 2024 14:07:01

networkRequests.getRatePerHour(); // at Tue Aug 27 2024 14:07:01 -> 40

```

## Options

Type: `Object`

### slidingWindow

Type: `Integer`

The `slidingWindow` option configures the number of time units (seconds or minutes) that are considered in calculating the event rate. You can choose this value as below:

- **Higher Value**: A higher `slidingWindow` will average the events over a longer period, which can smooth out spikes and give a more stable long-term rate.

- **Lower Value**: A lower `slidingWindow` will be more sensitive to recent changes in the event rate, making it more responsive to short-term fluctuations.

Default: `RatePerSecond`: 5, `RatePerMinute`: 6, `RatePerHour`: 10

Min: `RatePerSecond`: 1 , `RatePerMinute`: 1 , `RatePerHour`: 1

Max: `RatePerSecond`: 20, `RatePerMinute`: 120, `RatePerHour`: 120

**Note** that `RatePerSecond` and `RatePerMinute` take _seconds_, wherease `RatePerHour` takes _minutes_ in `slidingWindow` option.

## License

MIT © Talha Awan
