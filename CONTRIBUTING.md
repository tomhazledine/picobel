# Contribute

Picobel started out in 2015 as a "scratch your own itch" tool for a specific project which I then open-sourced in the hope it might prove useful to others. 

If you have an improvement or bug-fix or new feature, get in touch! Make a pull request on the [Picobel.js Github repo](https://github.com/tomhazledine/picobel). Contributions are encouraged and any feedback (positive or negative) is very welcome.

## Making changes

To make changes to Picobel, you'll need to follow these steps:

1. fork the repo and clone it to your local machine.
2. install the dev dependencies with `yarn` (or `npm install`).
3. make changes to the code in the `/src` directory.
4. run `yarn build` (or `npm run build`) to compile the code. There is also `yarn build:dev` (or `npm run build:dev`) which will watch for changes and recompile automatically as well as generating source maps for the compiled files. Once built, the final code will appear in the `/build` directory.
5. run `yarn test` (or `npm run test`) to run the test suite.
6. commit your changes and make a pull request.

## Project structure

### JavaScript

Picobel is first-and-foremost a JavaScript project, and all the JS code lives in [`/src/js`](https://github.com/tomhazledine/picobel/blob/master/src/js) with the main file being [`/src/js/Picobel.js`](https://github.com/tomhazledine/picobel/blob/master/src/js/Picobel.js). The function `picobel()` is the default export from this file, and is the function that gets called when you use Picobel in your own code.

JS is written using ESM module syntax (e.g. `import { foo } from './bar.js';`), and helper-functions and utilities are imported from partials that also live in `/src/js`.

There are several modules in this project:

* `helpers.js`: contains simple helper function: string manipulation, etc.
* `Picobel.js`: the master function - this is what is called when `Picobel();` is used in your code. This module pulls all the other modules together. It also contains the functions that require the `state` variable (created by Picobel to manage multiple audio elements on the same page).
* `PicobelData.js`: these functions handle the data we need to run Picobel (e.g. getting info on audio elements within a page, etc.).
* `PicobelMarkup.js`: these functions handle creating the markup that Picobel replaces native `<audio>` elements with.
* `PicobelSetup.js`: these functions initialize Picobel (parsing options, generating initial `state`, etc.).

The JS is compiled into a production-ready build using [esbuild](https://esbuild.github.io/), which is setup and configured in [`/build.js`](https://github.com/tomhazledine/picobel/blob/master/build.js) and run with `yarn build` (or `npm run build`).

### CSS

Picobel supports several pre-build "themes". A Picobel theme is a set of namespaced CSS rules that apply specific styles based on the theme name. For example, the default theme is called `default` and all the CSS rules for this theme are namespaced with `.picobel.default`.

The themes are all written in vanilla CSS and can be found in [`/src/css`](https://github.com/tomhazledine/picobel/blob/master/src/css). Running the build step (with `yarn build` etc.) will create minified versions of the themes in the `/build` directory.

There are several stylesheets available:

* `picobel.all.css`: a single stylesheet that contains all the themes. (useful for experimentation, but not recommended for production).
* `picobel.default.css`: the default theme.
* `picobel.skeleton.css`: a "bare bones" theme with minimal styling intended as a jumping-off point for folks to write their own themes. Includes basic layout, loading state, custom-styled volume and progress range sliders, etc.

* `picobel.bbc.css`: a theme that resembles the BBC iPlayer interface circa 2015.
* `picobel.eatenbymonsters.css`: the theme built for [eatenbymonsters.com](https://eatenbymonsters.com) that was the initial inspiration for Picobel.
* `picobel.itunes.css`: a theme that resembles the iTunes app mini-player interface circa 2015.
* `picobel.pitchfork.css`: a theme that resembles the [Pitchfork](https://pitchfork.com/) web audio player interface circa 2015.
* `picobel.soundcloud.css`: a theme that resembles the Soundcloud embedded web audio player interface circa 2015.