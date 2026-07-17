<p align="center"><a href="https://github.com/tomhazledine/picobel" target="_blank"><img width="200"src="https://github.com/tomhazledine/picobel/blob/main/images/heroLogo.png"></a></p>

<h1 align="center">Picobel.js</h1>

<p align="center"><a href="https://www.npmjs.com/package/picobel"><img src="https://img.shields.io/npm/v/picobel" alt="npm version"></a></p>

<p align="center"><a href="https://github.com/tomhazledine/picobel/actions/workflows/tests.yml"><img src="https://github.com/tomhazledine/picobel/actions/workflows/tests.yml/badge.svg" alt="Picobel test status" style="max-width: 100%;"></a></p>

Picobel.js (pronounced _peek-o-bell_, as in _decibel_) is a lightweight dependency-free JavaScript tool that converts html audio tags into styleable markup.

Documentation can be found at [picobel.tomhazledine.com](https://picobel.tomhazledine.com/).

---

## Quick start

### Install from npm

```bash
npm install picobel
```

```js
import picobel from "picobel";

picobel();

// ...or with options:
picobel({ theme: "default" });
```

#### Cleaning up

`picobel()` returns an instance with a `destroy()` method. Call it if you
ever need to remove the players (for example before a client-side
navigation): it stops playback, removes all event listeners, and puts the
original `<audio>` elements back in the document.

```js
const players = picobel();

// ...later:
players.destroy();
```

### React

```js
import { Picobel } from "picobel/react";

<Picobel theme="default" />;
```

### Install manually

If you prefer not to use npm, you can load Picobel from the jsDelivr CDN (which serves the published npm package):

```html
<script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/picobel@3/build/picobel.js"
></script>
<script type="text/javascript">
    picobel();
</script>
```

Pin an exact version with `picobel@3.3.4` (recommended for production — the file can never change underneath you).

> Older instructions linked files from `raw.githubusercontent.com`. Those URLs still work, but the CDN is faster, sends correct content types, and versions are pinned to real releases rather than whatever is on the `main` branch.

---

## CSS (optional)

Picobel's primary aim is to provide structured markup for styling audio players. If you're committed to writing all your own CSS then you do not need to include any of the Picobel stylesheets (although feel free to [use the pre-made themes as inspiration](https://picobel.tomhazledine.com/themes) or as a jumping-off point for [writing your own styles](https://picobel.tomhazledine.com/styling)).

Picobel also comes with several pre-made themes. Adding a theme is a two-step process:

1. Declare the `theme` option when initialising Picobel.
2. Include the relevant stylesheet in your project.

```js
picobel({ theme: "default" });
```

CSS files for each theme are available in the [`/build` directory](https://github.com/tomhazledine/picobel/tree/main/packages/picobel/build). The filename convention is `picobel.THEME_NAME.css`.
