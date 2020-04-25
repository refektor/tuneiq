import { defaults } from 'jest-config'

module.exports = {
    testEnvironment: "node",
    roots: [
        "<rootDir>/components"
    ],
    preset: "ts-jest",
    setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    snapshotSerializers: ["enzyme-to-json/serializer"]
};