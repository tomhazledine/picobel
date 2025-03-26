import { picobel as Picobel } from "../Picobel";

// Declare the global window interface extension
declare global {
    interface Window {
      picobel: typeof Picobel;
    }
  }

window.picobel = Picobel;
