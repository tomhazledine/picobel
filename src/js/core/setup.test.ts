import Picobel from "../outputs/index";
import { parseOptions } from "./setup";

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
        const picobel = Picobel();
        expect(picobel.state.components).toEqual(EXPECTED_COMPONENTS);
    });
    it("correctly sets manual components", () => {
        const startingOptions = { components: ["playPause"] };
        const picobel = Picobel(startingOptions);
        expect(picobel.state.components).toEqual(["playPause"]);
    });
});
