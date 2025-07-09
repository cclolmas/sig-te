/** @type {import('jest').Config} */
module.exports = {
  // The test environment that will be used for testing.
  // This directly solves the "jest-environment-jsdom cannot be found" error.
  testEnvironment: 'jest-environment-jsdom',

  // A list of paths to modules that run some code to configure or set up the testing framework before each test.
  // This avoids having to import '@testing-library/jest-dom' in every test file.
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],

  // A map from regular expressions to module names that allow you to stub out resources.
  // This handles CSS imports in your components during tests.
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Automatically clear mock calls, instances, contexts and results before every test.
  clearMocks: true,

  // The directory where Jest should output its coverage files.
  coverageDirectory: 'coverage',
};