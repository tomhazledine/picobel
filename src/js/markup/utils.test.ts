import { createElement } from "./utils";

describe("markup: creation", () => {
    it("can create new elements", () => {
        // Works without second arg
        const elementNoClass = createElement("div");
        expect(elementNoClass.localName).toEqual("div");
        // Creates a span
        const elementSpan = createElement("span", "songVolumeValue");
        expect(elementSpan.localName).toEqual("span");
        expect(elementSpan.classList).toContain("songVolumeValue");
        // Creates a div
        const elementDiv = createElement("div", "test");
        expect(elementDiv.localName).toEqual("div");
        expect(elementDiv.classList).toContain("test");
        // Creates a button
        const elementButton = createElement("button", "testing");
        expect(elementButton.localName).toEqual("button");
        expect(elementButton.classList).toContain("testing");
        // Creates an input
        const elementInput = createElement("input", "something");
        expect(elementInput.localName).toEqual("input");
        expect(elementInput.classList).toContain("something");
    });
});
