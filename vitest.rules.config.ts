import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { pool: 'threads', maxWorkers: 1, environment: 'node', include: ['tests/rules.test.ts'], testTimeout: 30000, hookTimeout: 30000, fileParallelism: false } });
