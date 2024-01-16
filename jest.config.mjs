/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  coverageProvider: "v8",
  setupFilesAfterEnv: ["./jest.setup.js"],
  verbose: true,
  silent: true,
  testEnvironment: "node",
  maxWorkers: 1,
};

export default config;
