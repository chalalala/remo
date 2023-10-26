import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  testEnvironment: 'jest-environment-jsdom',
  modulePaths: ['<rootDir>/app'],
  coverageThreshold: {
    './utils/': {
      branches: 50,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
