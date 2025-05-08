import { build, context } from "esbuild";
import readline from "readline";

import { parseArgs } from "../picobel/build.utils.js";

import _package from "../picobel/package.json" assert { type: "json" };
const version = _package.version;

const args = parseArgs(process.argv);

const config = {
    bundle: true,
    outdir: `pages/build`,
    minify: args.mode !== "development",
    treeShaking: args.mode !== "development",
    sourcemap: args.mode === "development",
    format: "esm",
    entryPoints: [
        "./scripts/*.js",
        "./scripts/*.jsx",
        "../picobel/build/picobel-component-default.js",
        "picobel/styles/all",
        { out: `manual`, in: `../picobel/build/picobel.${version}.js` }
    ],
    loader: { ".ts": "ts", ".tsx": "tsx", ".css": "css", ".jsx": "jsx" },
    entryNames: "picobel-demo-[name]",
    jsx: "automatic"
};

console.log(`Running in folder ${process.cwd()}`);

if (args.mode === "development") {
    const demoContext = await context(config);
    await demoContext.watch();

    console.log("Watching files...");

    console.log('Press "q" to exit');
    readline.emitKeypressEvents(process.stdin);

    process.stdin.on("keypress", async (str, key) => {
        if (key.name === "q") {
            await demoContext.dispose();
            console.log("stopped watching");
            process.exit();
        }
    });
} else {
    // Production mode
    await build(config);
    console.log("Build complete.");
}
