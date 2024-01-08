import Picobel from "../js/Picobel";
import PicobelSetup from "../js/PicobelSetup";

const EXPECTED_COMPONENTS = {
    theme: "default",
    playPause: false,
    progress: true,
    volume: true,
    download: false,
    mute: true,
    duration: true,
    timer: true
};

describe("setup", () => {
    it("sets the correct theme option", () => {
        expect(PicobelSetup.parseOptions().theme).toEqual("default");
        expect(PicobelSetup.parseOptions({ theme: "bbc" }).theme).toEqual(
            "bbc"
        );
    });

    it("correctly sets component state", () => {
        const startingOptions = { components: { playPause: false } };
        let picobel = Picobel(startingOptions);
        // Does it work when called as part of the whole app?
        expect(picobel.state.components).toEqual(EXPECTED_COMPONENTS);
        // Does it work when called directly?
        let components = PicobelSetup.setComponentsByTheme(
            "default",
            startingOptions.components
        );
        expect(components).toEqual(EXPECTED_COMPONENTS);
    });
});
