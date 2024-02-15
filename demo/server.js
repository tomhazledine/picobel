import http from "http";
import path from "path";
import readline from "readline";

import { Server } from "node-static";

export const server = (buildPath, port) => {
    const file = new Server(buildPath);

    http.createServer(function (request, response) {
        request
            .addListener("end", function () {
                // Serve files!
                file.serve(request, response);
            })
            .resume();
    }).listen(port);
};

const PORT = 8080;
const OUT = path.resolve(".", `./demo/`);
console.log(OUT);
console.log(`Serving result at http://localhost:${PORT}/`);
server(OUT, PORT);

console.log(`Press "q" to exit`);
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
        process.exit();
    }
});
