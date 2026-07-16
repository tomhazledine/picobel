const config = {
    verbose: true,
    collectCoverage: true,
    transform: {
        "^.+\\.(js|ts|tsx)$": "babel-jest"
    },
    testEnvironment: "jsdom",
    automock: false,
    // "node_modules" (relative) keeps Node's standard walk-up resolution,
    // which pnpm's symlinked layout relies on; an absolute path here would
    // pin resolution to one directory and break transitive deps.
    moduleDirectories: ["node_modules", "<rootDir>/src"],
    moduleFileExtensions: ["ts", "tsx", "js", "json", "node"]
};

export default config;
