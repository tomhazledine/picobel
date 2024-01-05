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
        entryPoints: ["src/css/player.default.css", "src/css/all.css"]
    }
};

const build = async config => {
    try {
        await esbuild.build(config.js);
        await esbuild.build(config.css);
    } catch (e) {
        console.warn("esbuild error", e);
    }
};

build(config);
