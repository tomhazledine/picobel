import React from "react";
import { createRoot } from "react-dom/client";
import Picobel from "../build/picobel-react.js";

const container = document.getElementById("picobel-react-container");
const root = createRoot(container);
root.render(
    <>
        <h2>Hello, world!</h2>
        <Picobel />
    </>
);
