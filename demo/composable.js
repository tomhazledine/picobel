import picobel from "../build/picobel.js";

const section01 = document.querySelector("#section-01");

const instance01 = picobel({
    theme: "bare",
    components: ["playPause", "progress"],
    context: section01
});

console.log({ instance01 });
