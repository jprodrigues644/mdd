export default {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/app/app.config.ts",
    "<rootDir>/src/app/app.routes.ts",
    "<rootDir>/src/.*\\.css$",
    "<rootDir>/src/.*\\.html$",
    "<rootDir>/src/.*\\.spec\\.ts$",
    "<rootDir>/src/app/shared/models/"
  ],
};