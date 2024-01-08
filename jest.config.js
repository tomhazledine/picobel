const config = {
    verbose: true,
    collectCoverage: true,
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    testEnvironment: "jsdom",
    automock: false,
    moduleDirectories: ["<rootDir>/node_modules", "<rootDir>/src"]
};

export default config;
