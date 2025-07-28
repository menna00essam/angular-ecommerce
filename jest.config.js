export default {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.spec.json',
        isolatedModules: false,  // نرجعها false أو نحذفها
      },
    ],
    '^.+\\.m?js$': 'babel-jest',  // إضافة هذا لتحويل ملفات mjs داخل node_modules
  },
  transformIgnorePatterns: [
    'node_modules/(?!(\\@angular|rxjs|tslib)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
