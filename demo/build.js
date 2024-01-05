import * as esbuild from "esbuild";

const parseArgs = rawArgs => {
    const [a, b, ...relevant] = rawArgs;
    return relevant
        .map(arg => {
            const [key, value] = arg.split("=");
            return { [key.replace(/-/g, "")]: value || true };
        })
        .reduce((args, arg) => ({ ...args, ...arg }), {});
};

const args = parseArgs(process.argv);

const config = {
    bundle: true,
    outdir: `demo/build`,
    minify: args.mode !== "development",
    treeShaking: args.mode !== "development",
    sourcemap: args.mode === "development",
    entryPoints: ["demo/index.js"],
    entryNames: "picobel-demo"
};

const build = async config => {
    try {
        await esbuild.build(config);
    } catch (e) {
        console.log({ location: e.errors[0].location });
        console.warn("esbuild error", e);
    }
};

build(config);
