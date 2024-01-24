import Picobel from "../js/index.js";
import { parseOptions } from "../js/PicobelSetup";

const EXPECTED_COMPONENTS = [
    "playPause",
    ["mute", "volume"],
    ["title", "artist"],
    ["timer", "progress", "duration"]
];

describe("setup", () => {
    it("sets the correct theme option", () => {
        expect(parseOptions().theme).toEqual("default");
        expect(parseOptions({ theme: "bbc" }).theme).toEqual("bbc");
    });

    it("correctly sets default components", () => {
        let picobel = Picobel();
        expect(picobel.state.components).toEqual(EXPECTED_COMPONENTS);
    });
    it("correctly sets manual components", () => {
        const startingOptions = { components: ["playPause"] };
        let picobel = Picobel(startingOptions);
        expect(picobel.state.components).toEqual(["playPause"]);
    });
});
