import express from "express";
import path from "path";
import readline from "readline";
import fs from "fs";

export const server = (buildPath, port) => {
    // Check if the directory exists
    if (!fs.existsSync(buildPath)) {
        console.error(`Error: Directory ${buildPath} does not exist!`);
        process.exit(1);
    }

    // Log the contents of the directory
    // console.log("Directory contents:", fs.readdirSync(buildPath));

    const app = express();
    
    // Log all requests
    // app.use((req, res, next) => {
    //     console.log(`Received request for: ${req.url}`);
    //     next();
    // });
    
    // Serve static files
    app.use(express.static(buildPath));
    
    // Handle 404s
    app.use((req, res) => {
        console.error(`Error serving ${req.url}: 404 Not Found`);
        res.status(404).send('Not Found');
    });
    
    // Start the server
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
};

const PORT = 8080;
const OUT = path.resolve(".", `./demo/`);
server(OUT, PORT);

console.log(`Press "q" to exit`);
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
        process.exit();
    }
});
