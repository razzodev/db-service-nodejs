"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test/services/cache.service.test.ts
const in_memory_1 = require("./in-memory");
describe('InMemoryCacheService', () => {
    let cacheService;
    beforeEach(() => {
        cacheService = new in_memory_1.InMemoryCacheService(1); // Short TTL for testing
    });
    it('should set and get a value', () => {
        cacheService.set('testKey', 'testValue');
        expect(cacheService.get('testKey')).toBe('testValue');
    });
    it('should return undefined for a non-existent key', () => {
        expect(cacheService.get('nonExistentKey')).toBeUndefined();
    });
    it('should delete a key', () => {
        cacheService.set('testKey', 'testValue');
        cacheService.del('testKey');
        expect(cacheService.get('testKey')).toBeUndefined();
    });
    it('should delete multiple keys', () => {
        cacheService.set('testKey1', 'testValue1');
        cacheService.set('testKey2', 'testValue2');
        cacheService.del(['testKey1', 'testKey2']);
        expect(cacheService.get('testKey1')).toBeUndefined();
        expect(cacheService.get('testKey2')).toBeUndefined();
    });
    it('should flush all keys', () => {
        cacheService.set('testKey1', 'testValue1');
        cacheService.set('testKey2', 'testValue2');
        cacheService.flush();
        expect(cacheService.get('testKey1')).toBeUndefined();
        expect(cacheService.get('testKey2')).toBeUndefined();
    });
    it('should get all keys', () => {
        cacheService.set('testKey1', 'testValue1');
        cacheService.set('testKey2', 'testValue2');
        const keys = cacheService.getKeys();
        expect(keys).toContain('testKey1');
        expect(keys).toContain('testKey2');
    });
    it('should expire a key after TTL', (done) => {
        cacheService = new in_memory_1.InMemoryCacheService(1); // Set TTL to 1 second
        cacheService.set('testKey', 'testValue');
        setTimeout(() => {
            expect(cacheService.get('testKey')).toBeUndefined();
            done();
        }, 1500); // Wait for 1.5 seconds to ensure expiry
    });
});
