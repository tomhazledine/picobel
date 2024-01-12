import * as esbuild from "esbuild";
import { parseArgs, watchFiles } from "./build.utils.js";

const args = parseArgs(process.argv);

const globalConfig = {
    bundle: true,
    outdir: `build`,
    minify: args.mode !== "development",
    treeShaking: args.mode !== "development",
    sourcemap: args.mode === "development"
};

const config = {
    js: {
        ...globalConfig,
        format: "esm",
        entryPoints: ["src/js/Picobel.js"],
        entryNames: "picobel"
    },
    css: {
        ...globalConfig,
        entryPoints: [
            "src/css/picobel.all.css",
            "src/css/picobel.main.css",
            "src/css/picobel.default.css",
            "src/css/picobel.skeleton.css",
            "src/css/picobel.bbc.css",
            "src/css/picobel.eatenbymonsters.css",
            "src/css/picobel.itunes.css",
            "src/css/picobel.pitchfork.css",
            "src/css/picobel.soundcloud.css"
        ]
    }
};

const build = async config => {
    try {
        await esbuild.build(config.js);
        await esbuild.build(config.css);
    } catch (e) {
        console.log({ location: e.errors[0].location });
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
