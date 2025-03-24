import { findAudio, getMeta, getRawData, prepareClasses } from "./data";

const TEST_DOM = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Picobel.js Test Page</title>
    </head>
    <body>
        <audio class="customPlayer" src="http://audio.eatenbymonsters.com/reviews/daughter/human.mp3" title="Human" data-artist="Daughter" controls>
            Your browser does not support the <code>audio</code> element.
        </audio>
        <audio class="customPlayer" src="http://audio.eatenbymonsters.com/reviews/coldWarKids/lostThatEasy.mp3" title="Lost That Easy" data-artist="Cold War Kids" controls>
            Your browser does not support the <code>audio</code> element.
        </audio>
    </body>
    </html>
`;

const TEST_NODES = [
    {
        currentSrc:
            "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3",
        title: "Human",
        dataset: {
            artist: "Daughter"
        }
    },
    {
        currentSrc:
            "http://audio.eatenbymonsters.com/reviews/coldWarKids/lostThatEasy.mp3",
        title: "Lost That Easy",
        dataset: {
            artist: "Cold War Kids"
        }
    },
    {
        currentSrc:
            "http://audio.eatenbymonsters.com/reviews/coldWarKids/lostThatEasy.mp3"
    }
];

describe("data handling", () => {
    it("finds the audio nodes", () => {
        // With test DOM:
        document.body.innerHTML = TEST_DOM;
        const nodes01 = findAudio(document);
        expect(nodes01.length).toEqual(2);
        // With empty DOM:
        document.body.innerHTML = "";
        const nodes02 = findAudio(document);
        expect(nodes02.length).toEqual(0);
    });

    it("creates an array of class names", () => {
        const classList01 = prepareClasses(0, "some classes", "themeName");

        expect(Array.isArray(classList01)).toEqual(true);
        expect(classList01.length).toEqual(6);
        expect(classList01).toContain("picobel");
        expect(classList01).toContain("loading");
        expect(classList01).toContain("picobel--index-0");
        expect(classList01).toContain("some");
        expect(classList01).toContain("classes");
        expect(classList01).toContain("themeName");

        const classList02 = prepareClasses(2, "", "something");
        expect(Array.isArray(classList02)).toEqual(true);
        expect(classList02.length).toEqual(4);
        expect(classList02).toContain("picobel");
        expect(classList02).toContain("loading");
        expect(classList02).toContain("picobel--index-2");
        expect(classList02).toContain("something");
    });

    it("sets the correct key for each node", () => {
        const nodes = getRawData(TEST_NODES);
        expect(nodes.length).toEqual(TEST_NODES.length);
        nodes.map((node, key) => {
            expect(node.key).toEqual(key);
        });
    });

    it("sets the starting values", () => {
        const nodes = getRawData(TEST_NODES);
        expect(nodes.length).toEqual(3);
        nodes.map((node, key) => {
            expect(node.mute).toEqual(false);
            expect(node.tmpVolume).toEqual(1);
        });
    });

    it("sets the correct meta values", () => {
        // Adds meta to every node (even if the node is missing the prerequisits)
        const newNodes = TEST_NODES.map(node => {
            const meta = getMeta(node);
            expect(meta).toHaveProperty("artist");
            expect(meta).toHaveProperty("title");
            return meta;
        });
        // Correctly adds the titles
        expect(newNodes[0].title).toEqual("Human");
        expect(newNodes[1].title).toEqual("Lost That Easy");
        expect(newNodes[2].title).toEqual("lostThatEasy.mp3");
        // Correctly adds the artists
        expect(newNodes[0].artist).toEqual("Daughter");
        expect(newNodes[1].artist).toEqual("Cold War Kids");
        expect(newNodes[2].artist).toEqual(false);
    });
});
