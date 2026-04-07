module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|js|html)$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
};
