import helpers from "./../js/helpers.js";

describe("Utilities", () => {
    it("converts seconds into HH:MM:SS format", () => {
        // Round minutes.
        expect(helpers.parseTime(120)).toEqual("2:00");
        // Floating points
        expect(helpers.parseTime(211.670208)).toEqual("3:31");
        // zero-padding seconds < 10
        expect(helpers.parseTime(3424.025)).toEqual("57:04");
        // Durations longer than an hour
        expect(helpers.parseTime(3846)).toEqual("1:04:06");
    });

    it("gets the filetype from a url", () => {
        expect(
            helpers.getFileType(
                "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3"
            )
        ).toEqual("mp3");
    });

    it("gets the file name from a url", () => {
        expect(
            helpers.getFileName(
                "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3"
            )
        ).toEqual("human");
    });

    it("finds an index from a data attribute", () => {
        const TEST_DOM = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Picobel.js Test Page</title>
            </head>
            <body>
                <div id="elementWithIndex" data-picobel-index="2">
                    <button id="childOfIndex"></button>
                    <div>
                        <div>
                            <div>
                                <div id="reallyDeep"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="hasNoIndex"></div>
            </body>
            </html>
        `;
        document.body.innerHTML = TEST_DOM;
        let childOfIndex = document.getElementById("childOfIndex");
        expect(helpers.findParentIndex(childOfIndex)).toEqual("2");
        let elementWithIndex = document.getElementById("elementWithIndex");
        expect(helpers.findParentIndex(elementWithIndex)).toEqual("2");
        let hasNoIndex = document.getElementById("hasNoIndex");
        expect(helpers.findParentIndex(hasNoIndex)).toEqual(false);
        let reallyDeep = document.getElementById("reallyDeep");
        expect(helpers.findParentIndex(reallyDeep)).toEqual("2");
    });
});
