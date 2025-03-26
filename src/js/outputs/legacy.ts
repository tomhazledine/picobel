import { picobel } from "../Picobel";

// Declare the global window interface extension
declare global {
    interface Window {
        picobel: typeof picobel;
    }
}

window.picobel = picobel;
