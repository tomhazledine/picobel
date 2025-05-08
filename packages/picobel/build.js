import chalk from "chalk";
import { build, context } from "esbuild";
import readline from "readline";

import { parseArgs, getPackageVersion } from "./build.utils.js";

const version = getPackageVersion();

const args = parseArgs(process.argv);

const globalConfig = {
    bundle: true,
    outdir: `build`,
    minify: args.mode !== "development",
    treeShaking: args.mode !== "development",
    sourcemap: args.mode === "development"
};

const stylesheets = [
    "all",
    "main",
    "default",
    "skeleton",
    "bbc",
    "eatenbymonsters",
    "itunes",
    "pitchfork",
    "soundcloud"
];
const components = ["default", "skeleton"];

const config = {
    js: {
        ...globalConfig,
        format: "esm",
        entryPoints: [
            { out: "picobel", in: "src/js/outputs/index.ts" },
            { out: "picobel-component", in: "src/js/wc/web-component.ts" },
            ...components.map(theme => ({
                out: `picobel-component-${theme}`,
                in: `src/js/wc/web-component.${theme}.ts`
            }))
        ],
        loader: { ".ts": "ts", ".tsx": "tsx", ".css": "text" }
    },
    react: {
        ...globalConfig,
        entryPoints: ["src/js/react/index.tsx"],
        entryNames: `picobel-react`,
        external: ["react", "react/jsx-runtime", "react-dom"],
        format: "esm",
        loader: { ".ts": "ts", ".tsx": "tsx" },
        jsx: "automatic"
    },
    legacy: {
        ...globalConfig,
        entryPoints: ["src/js/outputs/legacy.ts"],
        entryNames: `picobel.${version}`,
        format: "iife",
        loader: { ".ts": "ts", ".tsx": "tsx" }
    },
    css: {
        ...globalConfig,
        entryPoints: stylesheets.map(theme => `src/css/picobel.${theme}.css`)
    }
};

// const build = async config => {
//     try {
//         await build(config.css);
//         await build(config.js);
//         await build(config.legacy);
//         await build(config.react);
//     } catch (e) {
//         if (e.errors && e.errors[0].location) {
//             console.log({ location: e.errors[0].location });
//         }
//         console.warn("esbuild error", e);
//     }
// };

if (args.mode === "development") {
    // Development mode

    // Build
    const cssContext = await context(config.css);
    const jsContext = await context(config.js);
    const legacyContext = await context(config.legacy);
    const reactContext = await context(config.react);

    await cssContext.watch();
    await jsContext.watch();
    await legacyContext.watch();
    await reactContext.watch();

    console.log("Watching files...");

    console.log(chalk.cyan.bold(`Press "q" to exit`));
    readline.emitKeypressEvents(process.stdin);

    process.stdin.on("keypress", async (str, key) => {
        if (key.name === "q") {
            await cssContext.dispose();
            await jsContext.dispose();
            await legacyContext.dispose();
            await reactContext.dispose();
            console.log("stopped watching");
            process.exit();
        }
    });
} else {
    // Production mode
    await build(config.css);
    await build(config.js);
    await build(config.legacy);
    await build(config.react);
    console.log("Build complete.");
}
