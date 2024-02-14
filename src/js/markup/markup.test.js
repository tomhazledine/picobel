import { generateMarkup, setLengthDisplay, setMeta } from "./";

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

describe("markup: generation", () => {
    it("generates a div for each audio element", () => {
        // With three arbitrary array entries.
        let markup = generateMarkup(
            [...TEST_NODES, ...TEST_NODES],
            EXPECTED_COMPONENTS
        );
        expect(markup.length).toEqual(4);
        expect(markup[0].localName).toEqual("div");

        // With two arbitrary array entries.
        markup = generateMarkup(["test", "test"], EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual("div");

        // With our test nodes.
        markup = generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual("div");
    });

    it("adds the correct data attribute to each audio element", () => {
        const markup = generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);
        expect(markup[0].getAttribute("data-picobel-index")).toEqual("0");
        expect(markup[1].getAttribute("data-picobel-index")).toEqual("1");
    });

    it("adds a loading indicator each audio element", () => {
        const namespace = "TEST_NAMESPACE";
        const markup = generateMarkup(
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

describe("markup: display", () => {
    it("displays the duration value", () => {
        let nodeOne = setLengthDisplay(TEST_NODES[0]);
        expect(nodeOne.elements.durationDisplay.innerHTML).toEqual("3:31");
        let nodeTwo = setLengthDisplay(TEST_NODES[1]);
        expect(nodeTwo.elements.durationDisplay.innerHTML).toEqual("22:25");
    });

    it("displays the node's meta", () => {
        const TEST_META = {
            artist: "an artist name",
            title: "a title for a node"
        };
        let elements = setMeta(TEST_META, TEST_NODES[0].elements);
        expect(elements.artistDisplay.innerHTML).toEqual("an artist name");
        expect(elements.titleDisplay.innerHTML).toEqual("a title for a node");
    });
});
