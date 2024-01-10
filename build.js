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
            "src/css/all.css",
            "src/css/player.default.css",
            "src/css/player.skeleton.css",
            "src/css/player.bbc.css",
            "src/css/player.eatenbymonsters.css",
            "src/css/player.itunes.css",
            "src/css/player.pitchfork.css",
            "src/css/player.soundcloud.css"
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
