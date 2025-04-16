import React from "react";
import { createRoot } from "react-dom/client";
import Picobel, { PicobelProvider } from "picobel/react";

const container = document.getElementById("picobel-react-container");
const root = createRoot(container);
root.render(
    <>
        <h2>Standalone</h2>
        <Picobel
            src="./audio-examples/taken-at-the-flood.mp3"
            title="Taken at the Flood"
            artist="Freeze Them"
        />
        <hr />
        <h2>In a playlist</h2>
        <PicobelProvider>
            <Picobel
                src="./audio-examples/taken-at-the-flood.mp3"
                title="Taken at the Flood"
                artist="Freeze Them"
            />
            <Picobel
                src="./audio-examples/long-audio-example.mp3"
                title="Long example"
                artist="A Question of Code"
            />
        </PicobelProvider>
    </>
);
