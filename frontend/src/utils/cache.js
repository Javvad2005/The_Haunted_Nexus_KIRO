/**
 * Simple client-side cache for API responses
 */

class ClientCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Generate cache key from URL and params
   */
  generateKey(url, params = {}) {
    const paramString = JSON.stringify(params);
    return `${url}:${paramString}`;
  }

  /**
   * Get cached value if not expired
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { value, expiry } = cached;
    if (Date.now() > expiry) {
      this.cache.delete(key);
      return null;
    }

    return value;
  }

  /**
   * Set value in cache with TTL
   */
  set(key, value, ttl = 300000) {
    // Default TTL: 5 minutes (300000ms)
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, { expiry }] of this.cache.entries()) {
      if (now > expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const clientCache = new ClientCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  clientCache.cleanup();
}, 300000);

export default clientCache;
