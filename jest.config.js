module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,

  coverageDirectory: "coverage",

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/errors/",
    "/utils/",
    "responseModel.ts",
    "logger.ts",
  ],

  collectCoverageFrom: ["src/api/v1/**/*.{ts,tsx}"],

  coverageReporters: ["text", "html"],
};
// 'preset: "ts-jest"': use ts-jest preset to handle TS files
// 'testEnvironment: "node"': set environment to Node.js
