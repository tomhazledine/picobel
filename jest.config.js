const config = {
    verbose: true,
    collectCoverage: true,
    transform: {
        "^.+\\.(js|ts)$": "babel-jest"
    },
    testEnvironment: "jsdom",
    automock: false,
    moduleDirectories: ["<rootDir>/node_modules", "<rootDir>/src"],
    moduleFileExtensions: ["ts", "js", "json", "node"]
};

export default config;
