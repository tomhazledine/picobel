import React from "react";
import { createRoot } from "react-dom/client";
import Picobel, {
    PicobelProvider,
    PlayPause,
    Artist,
    Title
} from "picobel/react";

const container = document.getElementById("picobel-react-container");
const root = createRoot(container);
root.render(
    <>
        <h2>Standalone</h2>
        <Picobel src="./audio-examples/taken-at-the-flood.mp3" />
        <hr />
        <h2>In a playlist</h2>
        <PicobelProvider>
            <Picobel
                id="taken-at-the-flood"
                src="./audio-examples/taken-at-the-flood.mp3"
                title="Taken at the Flood"
                artist="Freeze Them"
            />

            <Picobel
                id="taken-at-the-flood-2"
                src="./audio-examples/taken-at-the-flood.mp3"
                title="Taken at the Flood"
                artist="Freeze Them"
            >
                <Title />
                <PlayPause />
                <Artist />
            </Picobel>

            <Picobel src="./audio-examples/taken-at-the-flood.mp3" />

            <Picobel
                src="./audio-examples/long-audio-example.mp3"
                title="Long example"
                artist="A Question of Code"
            />

            <PlayPause trackKey="taken-at-the-flood" />
            <PlayPause />
        </PicobelProvider>
        <PlayPause trackKey="./audio-examples/taken-at-the-flood.mp3" />
    </>
);
