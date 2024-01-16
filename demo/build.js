import * as esbuild from "esbuild";
import { parseArgs, watchFiles } from "../build.utils.js";

const args = parseArgs(process.argv);

const config = {
    bundle: true,
    outdir: `demo/build`,
    minify: args.mode !== "development",
    treeShaking: args.mode !== "development",
    sourcemap: args.mode === "development",
    entryPoints: ["demo/index.js", "demo/composable.js", "demo/types.js"],
    entryNames: "picobel-demo-[name]"
};

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
    watchFiles(["build", "demo/index.js"], async file => {
        console.log(`Changes detected in ${file}.\nRebuilding...`);
        await build(config);
    });
} else {
    // Production mode
    await build(config);
    console.log("Build complete.");
}
