import NodeCache from 'node-cache';

export class InMemoryCacheService {
    private cache: NodeCache;

    constructor(ttlSeconds: number = 600) { // Default 10 minutes
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2 }); // Check every 20% of TTL
    }

    get<T>(key: string): T | undefined {
        return this.cache.get(key);
    }

    set<T>(key: string, value: T): void {
        this.cache.set(key, value);
    }

    del(keys: string | string[]): void {
        this.cache.del(keys);
    }

    flush(): void {
        this.cache.flushAll();
    }
}