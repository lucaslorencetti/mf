export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-environment-node',
  setupFiles: ['<rootDir>/config/setup_tests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};