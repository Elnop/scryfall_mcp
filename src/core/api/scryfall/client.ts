// =====================================
// SCRYFALL API CLIENT
// Ultra-optimized with caching, rate limiting, and deduplication
// =====================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RequestMetrics {
  total: number;
  hits: number;
  misses: number;
  errors: number;
  avgResponseTime: number;
  lastUpdated: number;
}

// =====================================
// LRU CACHE
// =====================================

class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, data: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getStats() {
    const now = Date.now();
    const validEntries = Array.from(this.cache.values()).filter(
      entry => now - entry.timestamp <= entry.ttl
    );

    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      maxSize: this.maxSize,
      hitRate: 0
    };
  }
}

// =====================================
// RATE LIMITER
// =====================================

class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.checkLimit();
      }
    }

    this.requests.push(now);
  }

  getStats() {
    const now = Date.now();
    const recentRequests = this.requests.filter(time => now - time < this.windowMs);

    return {
      currentRequests: recentRequests.length,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
      remaining: Math.max(0, this.maxRequests - recentRequests.length)
    };
  }
}

// =====================================
// REQUEST DEDUPLICATOR
// =====================================

class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async execute<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    const promise = fn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

// =====================================
// API CLIENT
// =====================================

export class ScryfallApiClient {
  private static instance: ScryfallApiClient;
  private cache = new LRUCache<any>();
  private rateLimiter = new RateLimiter();
  private deduplicator = new RequestDeduplicator();
  private metrics: RequestMetrics = {
    total: 0,
    hits: 0,
    misses: 0,
    errors: 0,
    avgResponseTime: 0,
    lastUpdated: Date.now()
  };

  private readonly apiBase = "https://api.scryfall.com";
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000;

  static getInstance(): ScryfallApiClient {
    if (!ScryfallApiClient.instance) {
      ScryfallApiClient.instance = new ScryfallApiClient();
    }
    return ScryfallApiClient.instance;
  }

  async fetch<T>(
    endpoint: string,
    options: {
      cacheTTL?: number;
      skipCache?: boolean;
      skipRateLimit?: boolean;
    } = {}
  ): Promise<T> {
    const cacheKey = `${endpoint}`;
    const startTime = Date.now();

    try {
      if (!options.skipCache) {
        const cached = this.cache.get(cacheKey);
        if (cached) {
          this.metrics.hits++;
          this.updateMetrics(startTime);
          return cached as T;
        }
      }

      this.metrics.misses++;

      if (!options.skipRateLimit) {
        await this.rateLimiter.checkLimit();
      }

      const result = await this.deduplicator.execute(cacheKey, async () => {
        return this.fetchWithRetry<T>(endpoint);
      });

      if (!options.skipCache) {
        this.cache.set(cacheKey, result, options.cacheTTL);
      }

      this.updateMetrics(startTime);
      return result;

    } catch (error) {
      this.metrics.errors++;
      this.updateMetrics(startTime);
      throw this.enhanceError(error, endpoint);
    }
  }

  private async fetchWithRetry<T>(endpoint: string): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.apiBase}${endpoint}`, {
          headers: {
            'User-Agent': 'Scryfall-MCP-Server/2.0.0',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Scryfall API error (${response.status}): ${errorText}`);
        }

        return response.json() as Promise<T>;

      } catch (error) {
        lastError = error as Error;

        if (attempt < this.maxRetries - 1) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  private updateMetrics(startTime: number): void {
    this.metrics.total++;
    const responseTime = Date.now() - startTime;
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime * (this.metrics.total - 1) + responseTime) / this.metrics.total;
    this.metrics.lastUpdated = Date.now();
  }

  private enhanceError(error: any, endpoint: string): Error {
    const enhancedError = new Error(`Failed to fetch ${endpoint}: ${error.message}`);
    (enhancedError as any).originalError = error;
    (enhancedError as any).endpoint = endpoint;
    (enhancedError as any).metrics = this.getMetrics();
    return enhancedError;
  }

  getMetrics() {
    const hitRate = this.metrics.total > 0 ?
      (this.metrics.hits / this.metrics.total) * 100 : 0;

    return {
      requests: this.metrics,
      cache: { ...this.cache.getStats(), hitRate },
      rateLimiter: this.rateLimiter.getStats(),
      deduplicator: { pendingRequests: this.deduplicator.getPendingCount() }
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.fetch('/catalog/card-names', {
        skipCache: true,
        cacheTTL: 1000
      });
      return true;
    } catch {
      return false;
    }
  }
}

// =====================================
// EXPORTS
// =====================================

const apiClient = ScryfallApiClient.getInstance();

export async function fetchScryfall<T>(
  endpoint: string,
  options?: {
    cacheTTL?: number;
    skipCache?: boolean;
    skipRateLimit?: boolean;
  }
): Promise<T> {
  return apiClient.fetch<T>(endpoint, options);
}

export function getApiMetrics() {
  return apiClient.getMetrics();
}

export function clearApiCache() {
  apiClient.clearCache();
}

export async function checkApiHealth(): Promise<boolean> {
  return apiClient.healthCheck();
}
