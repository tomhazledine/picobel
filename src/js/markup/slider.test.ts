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

        const label = slider.children[0] as HTMLLabelElement;
        expect(label.classList).toContain(`${NAMESPACE}-label`);
        expect(label.localName).toBe("label");

        const wrapper = slider.children[1] as HTMLDivElement;
        expect(wrapper.classList).toContain(
            `${NAMESPACE}-slider__wrapper`
        );
        expect(wrapper.children.length).toBe(2);

        const range = wrapper.children[1] as HTMLInputElement;
        expect(range.localName).toBe("input");
        expect(range.min).toBe(MIN.toString());
        expect(range.max).toBe(MAX.toString());
        expect(range.value).toBe(VALUE.toString());
    });
});
