import nextJest from 'next/jest';
import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig: Config = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  testEnvironment: 'jest-environment-jsdom',
  modulePaths: ['<rootDir>'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
    './utils/': {
      branches: 50,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  fakeTimers: {
    enableGlobally: true,
  },
};

module.exports = createJestConfig(customJestConfig);
