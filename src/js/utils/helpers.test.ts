import { parseTime, getFileType, getFileName } from "./helpers";

describe("Utilities", () => {
    it("converts seconds into HH:MM:SS format", () => {
        // Round minutes.
        expect(parseTime(120)).toEqual("2:00");
        // Floating points
        expect(parseTime(211.670208)).toEqual("3:31");
        // zero-padding seconds < 10
        expect(parseTime(3424.025)).toEqual("57:04");
        // Durations longer than an hour
        expect(parseTime(3846)).toEqual("1:04:06");
    });

    it("gets the filetype from a url", () => {
        expect(
            getFileType(
                "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3"
            )
        ).toEqual("mp3");
    });

    it("gets the file name from a url", () => {
        expect(
            getFileName(
                "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3"
            )
        ).toEqual("human");
    });
});
