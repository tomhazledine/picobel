import picobel from "../build/picobel.js";

const section01 = document.querySelector("#section-01");
const section02 = document.querySelector("#section-02");
const section03 = document.querySelector("#section-03");

const instance01 = picobel({
    theme: "bare",
    components: ["playPause", "progress"],
    context: section01
});

const instance02 = picobel({
    theme: "bare",
    // components: ["playPause", "progress"],
    context: section02
});
const instance03 = picobel({
    theme: "bare",
    components: ["playPause", ["progress", ["duration", "timer"]]],
    context: section03
});
