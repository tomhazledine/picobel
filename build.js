import * as esbuild from "esbuild";
import { parseArgs, getPackageVersion, watchFiles } from "./build.utils.js";

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
            { out: "picobel", in: "src/js/index.js" },
            { out: "picobel-component", in: "src/js/web-component.js" },
            ...components.map(theme => ({
                out: `picobel-component-${theme}`,
                in: `src/js/web-component.${theme}.js`
            }))
        ],
        loader: { ".css": "text" }
    },
    legacy: {
        ...globalConfig,
        entryPoints: ["src/js/legacy.js"],
        entryNames: `picobel.${version}`,
        format: "iife"
    },
    css: {
        ...globalConfig,
        entryPoints: stylesheets.map(theme => `src/css/picobel.${theme}.css`)
    }
};

const build = async config => {
    try {
        await esbuild.build(config.css);
        await esbuild.build(config.js);
        await esbuild.build(config.legacy);
    } catch (e) {
        if (e.errors && e.errors[0].location) {
            console.log({ location: e.errors[0].location });
        }
        console.warn("esbuild error", e);
    }
};

if (args.mode === "development") {
    // Development mode
    watchFiles(["src/js", "src/css"], async file => {
        console.log(`Changes detected in ${file}.\nRebuilding...`);
        await build(config);
        console.log("Build complete.");
    });
} else {
    // Production mode
    await build(config);
    console.log("Build complete.");
}
