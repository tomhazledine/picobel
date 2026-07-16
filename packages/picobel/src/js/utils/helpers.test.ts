import { getFileName, getFileType, parseTime } from "./helpers";

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

    it("returns a placeholder for non-finite durations", () => {
        // duration is NaN until the audio's metadata has loaded
        expect(parseTime(NaN)).toEqual("0:00");
        expect(parseTime(Infinity)).toEqual("0:00");
        expect(parseTime(undefined as unknown as number)).toEqual("0:00");
    });

    it("gets the filetype from a url", () => {
        expect(
            getFileType(
                "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3"
            )
        ).toEqual("mp3");
    });

    it("gets the filetype from a filename containing dots", () => {
        expect(getFileType("music/my.favourite.song.mp3")).toEqual("mp3");
    });

    it("gets the filetype from a url with a query string or hash", () => {
        expect(getFileType("song.mp3?v=2")).toEqual("mp3");
        expect(getFileType("song.mp3#t=30")).toEqual("mp3");
    });

    it("returns an empty filetype when there is no extension", () => {
        expect(getFileType("music/song")).toEqual("");
    });

    it("gets the file name from a url", () => {
        expect(
            getFileName(
                "http://audio.eatenbymonsters.com/reviews/daughter/human.mp3"
            )
        ).toEqual("human");
    });

    it("gets the file name from a filename containing dots", () => {
        expect(getFileName("music/my.favourite.song.mp3")).toEqual(
            "my.favourite.song"
        );
    });

    it("gets the file name from a url with a query string or hash", () => {
        expect(getFileName("song.mp3?v=2")).toEqual("song");
        expect(getFileName("song.mp3#t=30")).toEqual("song");
    });

    it("returns the whole name when there is no extension", () => {
        expect(getFileName("music/song")).toEqual("song");
    });
});
