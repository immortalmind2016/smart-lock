/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: ["**/test/**/*.test.[jt]s?(x)"],
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};
