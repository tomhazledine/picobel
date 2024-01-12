import Picobel from "../build/picobel.js";

const section01 = document.querySelector("#section-01");

Picobel({
    theme: "bare",
    components: ["playPause", "progress"],
    context: section01
});
