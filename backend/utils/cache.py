"""
Simple in-memory cache for API responses
"""
import time
from threading import Lock

class SimpleCache:
    """Thread-safe in-memory cache with TTL support"""
    
    def __init__(self):
        self._cache = {}
        self._lock = Lock()
    
    def get(self, key):
        """
        Get value from cache if it exists and hasn't expired
        
        Args:
            key (str): Cache key
            
        Returns:
            Value if found and not expired, None otherwise
        """
        with self._lock:
            if key in self._cache:
                value, expiry = self._cache[key]
                if time.time() < expiry:
                    return value
                else:
                    # Remove expired entry
                    del self._cache[key]
            return None
    
    def set(self, key, value, ttl=300):
        """
        Set value in cache with TTL
        
        Args:
            key (str): Cache key
            value: Value to cache
            ttl (int): Time to live in seconds (default: 300 = 5 minutes)
        """
        with self._lock:
            expiry = time.time() + ttl
            self._cache[key] = (value, expiry)
    
    def clear(self):
        """Clear all cache entries"""
        with self._lock:
            self._cache.clear()
    
    def cleanup_expired(self):
        """Remove all expired entries"""
        with self._lock:
            current_time = time.time()
            expired_keys = [
                key for key, (_, expiry) in self._cache.items()
                if current_time >= expiry
            ]
            for key in expired_keys:
                del self._cache[key]

# Global cache instance
cache = SimpleCache()
