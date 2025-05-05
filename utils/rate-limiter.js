const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // Maximum 5 emails per window

// Track requests with IP as key
const requestCounts = new Map();
const requestTimestamps = new Map();

export function rateLimitEmail(ip) {
  const now = Date.now();

  // Clean up old entries from previous windows
  if (requestTimestamps.has(ip)) {
    const timestamps = requestTimestamps.get(ip);
    const validTimestamps = timestamps.filter((ts) => now - ts < WINDOW_MS);

    if (validTimestamps.length === 0) {
      // Reset if all previous timestamps are expired
      requestCounts.delete(ip);
      requestTimestamps.delete(ip);
    } else {
      requestTimestamps.set(ip, validTimestamps);
      requestCounts.set(ip, validTimestamps.length);
    }
  }

  // Get current count for this IP
  const currentCount = requestCounts.get(ip) || 0;

  // Check if rate limit exceeded
  if (currentCount >= MAX_REQUESTS) {
    return {
      allowed: false,
      message: 'Rate limit exceeded. Try again later.',
      remainingTime: WINDOW_MS, // Time until reset (simplified)
    };
  }

  // Record this request
  const newTimestamps = requestTimestamps.get(ip) || [];
  newTimestamps.push(now);
  requestTimestamps.set(ip, newTimestamps);
  requestCounts.set(ip, currentCount + 1);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - (currentCount + 1),
  };
}
