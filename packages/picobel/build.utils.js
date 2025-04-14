import readline from "readline";
import fs from "fs";

export const parseArgs = rawArgs => {
    const [a, b, ...relevant] = rawArgs;
    return relevant
        .map(arg => {
            const [key, value] = arg.split("=");
            return { [key.replace(/-/g, "")]: value || true };
        })
        .reduce((args, arg) => ({ ...args, ...arg }), {});
};

export const watchFiles = (files, onChange) => {
    console.log(`Press "q" to exit`);
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on("keypress", async (str, key) => {
        if (key.name === "q") {
            console.log("stopped watching");
            process.exit();
        }
    });

    // All filepaths in `files` dirs:
    const allFiles = files.flatMap(dir => {
        return fs.readdirSync(dir).map(file => `${dir}/${file}`);
    });

    allFiles.forEach(file => {
        fs.watch(file, (eventType, filename) => {
            if (filename) {
                onChange(filename);
            }
        });
    });
};

export const getPackageVersion = () => {
    const packageJson = fs.readFileSync("./package.json");
    const { version } = JSON.parse(packageJson);
    return version;
};
