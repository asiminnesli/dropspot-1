export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
  jitter?: boolean;
}

/**
 * Standardized retry policy utility establishing exponential backoff pattern
 * for all external integration and resilient network operations.
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  let delay = options.initialDelayMs ?? 200;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= options.backoffMultiplier ?? 2;
    }
  }
  throw new Error("Retry policy failed");
}
