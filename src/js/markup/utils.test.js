import { createElement } from "./utils.js";

describe("markup: creation", () => {
    it("can create new elements", () => {
        // Works without second arg
        let elementNoClass = createElement("div");
        expect(elementNoClass.localName).toEqual("div");
        // Creates a span
        let elementSpan = createElement("span", "songVolumeValue");
        expect(elementSpan.localName).toEqual("span");
        expect(elementSpan.classList).toContain("songVolumeValue");
        // Creates a div
        let elementDiv = createElement("div", "test");
        expect(elementDiv.localName).toEqual("div");
        expect(elementDiv.classList).toContain("test");
        // Creates a button
        let elementButton = createElement("button", "testing");
        expect(elementButton.localName).toEqual("button");
        expect(elementButton.classList).toContain("testing");
        // Creates an input
        let elementInput = createElement("input", "something");
        expect(elementInput.localName).toEqual("input");
        expect(elementInput.classList).toContain("something");
    });
});
