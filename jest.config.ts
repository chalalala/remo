import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  testEnvironment: 'jest-environment-jsdom',
  modulePaths: ['<rootDir>/app'],
};

module.exports = createJestConfig(customJestConfig);
