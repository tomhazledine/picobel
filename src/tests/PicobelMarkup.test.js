import PicobelMarkup from "../js/PicobelMarkup";
import { buildSlider } from "../js/markup/slider.js";
import { createElement } from "../js/markup/utils";

const EXPECTED_COMPONENTS = [
    "playPause",
    "progress",
    "volume",
    "download",
    "mute",
    "duration",
    "timer"
];

// Create some test nodes to trigger markup generation.
const TEST_NODES = [
    {
        key: 0,
        preload: "metadata",
        url: "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3",
        className: "customPlayer",
        duration: 211,
        elements: {
            durationDisplay: [{ innerHTML: "" }],
            artistDisplay: [{ innerHTML: "" }],
            titleDisplay: [{ innerHTML: "" }]
        }
    },
    {
        key: 1,
        preload: "metadata",
        url: "http://audio.eatenbymonsters.com/reviews/coldWarKids/lostThatEasy.mp3",
        className: "",
        duration: 1345,
        elements: {
            durationDisplay: [{ innerHTML: "" }],
            artistDisplay: [{ innerHTML: "" }],
            titleDisplay: [{ innerHTML: "" }]
        }
    }
];

describe("markup helpers", () => {
    it("can create a slider", () => {
        const NAMESPACE = "progress";
        const MIN = 0;
        const MAX = 100;
        const VALUE = 50;

        let slider = buildSlider({
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

describe("markup generation", () => {
    it("generates a div for each audio element", () => {
        // With three arbitrary array entries.
        let markup = PicobelMarkup.generateMarkup(
            [...TEST_NODES, ...TEST_NODES],
            EXPECTED_COMPONENTS
        );
        expect(markup.length).toEqual(4);
        expect(markup[0].localName).toEqual("div");

        // With two arbitrary array entries.
        markup = PicobelMarkup.generateMarkup(
            ["test", "test"],
            EXPECTED_COMPONENTS
        );
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual("div");

        // With our test nodes.
        markup = PicobelMarkup.generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual("div");
    });

    it("adds the correct data attribute to each audio element", () => {
        const markup = PicobelMarkup.generateMarkup(
            TEST_NODES,
            EXPECTED_COMPONENTS
        );
        expect(markup[0].getAttribute("data-picobel-index")).toEqual("0");
        expect(markup[1].getAttribute("data-picobel-index")).toEqual("1");
    });

    it("adds a loading indicator each audio element", () => {
        const namespace = "TEST_NAMESPACE";
        const markup = PicobelMarkup.generateMarkup(
            TEST_NODES,
            EXPECTED_COMPONENTS,
            namespace
        );

        let firstIndicator = markup[0].getElementsByClassName(
            `${namespace}__loader`
        );
        expect(firstIndicator.length).toEqual(1);

        let secondIndicator = markup[1].getElementsByTagName("div");
        expect(secondIndicator.length).toBeTruthy();
        expect(secondIndicator[0].classList).toContain(`${namespace}__loader`);
    });
});

describe("content display", () => {
    it("displays the duration value", () => {
        let nodeOne = PicobelMarkup.setLengthDisplay(TEST_NODES[0]);
        expect(nodeOne.elements.durationDisplay.innerHTML).toEqual("3:31");
        let nodeTwo = PicobelMarkup.setLengthDisplay(TEST_NODES[1]);
        expect(nodeTwo.elements.durationDisplay.innerHTML).toEqual("22:25");
    });

    it("displays the node's meta", () => {
        const TEST_META = {
            artist: "an artist name",
            title: "a title for a node"
        };
        let elements = PicobelMarkup.setMeta(TEST_META, TEST_NODES[0].elements);
        expect(elements.artistDisplay.innerHTML).toEqual("an artist name");
        expect(elements.titleDisplay.innerHTML).toEqual("a title for a node");
    });
});
