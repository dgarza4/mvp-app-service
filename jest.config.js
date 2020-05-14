module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ["json", "lcov", "html"],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ]
};