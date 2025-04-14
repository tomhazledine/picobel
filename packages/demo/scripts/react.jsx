import React from "react";
import { createRoot } from "react-dom/client";
import Picobel from "picobel/react";

const container = document.getElementById("picobel-react-container");
const root = createRoot(container);
root.render(
    <>
        <h2>Hello, world!</h2>
        <Picobel
            src="./audio-examples/taken-at-the-flood.mp3"
            title="Taken at the Flood"
            artist="Freeze Them"
        />
    </>
);
