import { buildSlider } from "./slider";

describe("markup: slider", () => {
    it("can create a slider", () => {
        const NAMESPACE = "progress";
        const MIN = 0;
        const MAX = 100;
        const VALUE = 50;

        const slider = buildSlider({
            namespace: NAMESPACE,
            min: MIN,
            max: MAX,
            value: VALUE
        });
        // Renders a container with two children: a label and a slider wrapper div.
        expect(slider.localName).toBe("div");
        expect(slider.children.length).toBe(2);
        expect(slider.children[0].classList).toContain(`${NAMESPACE}-label`);
        expect(slider.children[0].localName).toBe("label");
        expect(slider.children[1].classList).toContain(
            `${NAMESPACE}-slider__wrapper`
        );
        expect(slider.children[1].children.length).toBe(2);
        expect(slider.children[1].children[1].localName).toBe("input");
        expect(slider.children[1].children[1].min).toBe(MIN.toString());
        expect(slider.children[1].children[1].max).toBe(MAX.toString());
        expect(slider.children[1].children[1].value).toBe(VALUE.toString());
    });
});
