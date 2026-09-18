export interface LogContext {
  correlationId: string;
  userId?: string;
  service: string;
}

/**
 * Standardized structured JSON logging convention for all backend services.
 * Enforces structured telemetry metadata and correlation ID tracing across request lifecycles.
 */
export class StructuredLogger {
  constructor(private context: LogContext) {}

  info(message: string, meta?: Record<string, any>): void {
    const entry = { level: "info", timestamp: new Date().toISOString(), message, ...this.context, ...meta };
    process.stdout.write(JSON.stringify(entry) + "\n");
  }

  warn(message: string, meta?: Record<string, any>): void {
    const entry = { level: "warn", timestamp: new Date().toISOString(), message, ...this.context, ...meta };
    process.stdout.write(JSON.stringify(entry) + "\n");
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    const entry = { level: "error", timestamp: new Date().toISOString(), message, stack: error?.stack, ...this.context, ...meta };
    process.stderr.write(JSON.stringify(entry) + "\n");
  }
}

export const logger = new StructuredLogger({
  correlationId: "system",
  service: "dropspot-backend",
});