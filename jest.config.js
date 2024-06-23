// /jest.config.js

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  moduleNameMapper: {
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
};