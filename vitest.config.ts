import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { pool: 'threads', maxWorkers: 1, environment: 'jsdom', include: ['tests/*.test.ts', 'tests/*.test.tsx'], exclude: ['tests/rules.test.ts'], globals: false, restoreMocks: true } });
