// src/utils/cacheUtils.ts

import { InMemoryCacheService } from './in-memory';

export async function getCachedOrExecute<T>(
    cacheService: InMemoryCacheService,
    cacheKey: string,
    execute: () => Promise<T>
): Promise<T> {
    const cachedResult = cacheService.get<T>(cacheKey);
    if (cachedResult) {
        return cachedResult;
    }

    const result = await execute();
    cacheService.set(cacheKey, result);
    return result;
}