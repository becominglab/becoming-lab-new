/**
 * レート制限ユーティリティ
 */

/** 指定ミリ秒待機 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** リトライ付きで関数を実行 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoffMultiplier?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {},
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoffMultiplier = 2, onRetry } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const waitMs = delayMs * Math.pow(backoffMultiplier, attempt);
        onRetry?.(lastError, attempt + 1);
        await sleep(waitMs);
      }
    }
  }

  throw lastError;
}

/**
 * レートリミッター
 * 指定間隔で1リクエストずつ処理
 */
export class RateLimiter {
  private lastRequestTime = 0;

  constructor(private intervalMs: number) {}

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.intervalMs) {
      await sleep(this.intervalMs - elapsed);
    }
    this.lastRequestTime = Date.now();
  }
}
