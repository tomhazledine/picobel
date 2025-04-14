import * as esbuild from "esbuild";
import { parseArgs, watchFiles } from "../picobel/build.utils.js";

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

const build = async config => {
    try {
        await esbuild.build(config);
    } catch (e) {
        console.log({ location: e.errors[0].location });
        console.warn("esbuild error", e);
    }
};

if (args.mode === "development") {
    // Development mode
    watchFiles(["scripts","../picobel/build"], async file => {
        console.log(`Changes detected in ${file}.\nRebuilding...`);
        await build(config);
    });
} else {
    // Production mode
    await build(config);
    console.log("Build complete.");
}
