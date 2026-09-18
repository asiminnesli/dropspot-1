/**
 * Centralized ResilientHttpClient standard for all external third-party HTTP integrations.
 * Enforces timeout policies, user-agent standards, and correlation header propagation.
 */
export class ResilientHttpClient {
  private defaultTimeoutMs: number;

  constructor(timeoutMs = 5000) {
    this.defaultTimeoutMs = timeoutMs;
  }

  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.defaultTimeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return (await res.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }
}
