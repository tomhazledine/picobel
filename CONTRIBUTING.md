# Contribute

This started out as a "scratch your own itch" tool for a specific project. I'm open-sourcing it in the hope it might prove useful to others too. There are _a few_ audio player tools/plugins out there, but most have too many features for my needs. I like simplicity, and I like any JS I add to my sites to be as lean as possible.

I'm hoping Picobel can be of use to as many people as possible. If you have an improvement or bug-fix or new feature, get in touch! Make a pull request on the [Picobel.js Github repo](https://github.com/tomhazledine/picobel). I'm just getting started with "open source", so I'd be very glad of any help or suggestions or advice.

## Code Style

Wherever possible I've tried to keep all functions as ["pure"](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976) as possible: given the same arguments, they should always return the same result, without any side effects. I'm a recent convert to the world of "functional" programming, so accept that I might not always get it right - if you can suggest any improvements, I'll be more than happy to hear them 👍.

As far as code organization goes, I've batched functions into roughly-similar groups, and put those groups into their own modules. The groups take the form of objects, that can then be imported into the main app. For example:

    // Module file:
    const groupedFunctions = {
        aCoolFunction: () => {/* the function code */},
        somethingUsefull: () => {/* the function code */}
    };
    export default groupedFunctions;

    // App file:
    import groupedFunctions from './path-to-module-file';
    function TheMainAPP() {
        // Use one of the grouped functions:
        groupedFunctions.aCoolFunction();
    }
    export default TheMainAPP;

## Dev dependencies

Once you've forked the repo, run `npm install` to install the development dependencies. I'm trying to keep the build chain as short as possible, so there's not too much to be installed:

* `babel-cli` and `babel-preset-env` are there to transpile the raw ES6 from [`/esm/picobel.js`](https://github.com/tomhazledine/picobel/blob/master/esm/picobel.js) into the ES5-compatible versions.
* `node-sass` is there to compile the SCSS in [`/scss/`](https://github.com/tomhazledine/picobel/blob/master/scss) into vanilla CSS.
* Once the regular SCSS has been compiled, it gets run through `autoprefixer` (using `postcss-cli`) to make sure the necessary browser prefixes are added to the raw CSS.

## Editing the JS

The canonical source code lives with the [`/src`](https://github.com/tomhazledine/picobel/blob/master/src) directory. This is where you should make any changes to the JavaScript code.

### Modules

The code is written using ES6 module syntax (e.g. `import VARIABLE from 'PACKAGE_NAME';`).

* `helpers.js`: contains simple helper function: string manipulation, etc.
* `Picobel.js`: the master function - this is what is called when `Picobel();` is used in your code. This modules pulls all the other modules together. It also contains the functions that require the `state` variable (created by Picobel to manage multiple audio elements on the same page).
* `PicobelData.js`: these functions handle the data we need to run Picobel (e.g. getting info on audio elements within a page, etc.).
* `PicobelMarkup.js`: these functions handle creating the markup that Picobel replaces native `<audio>` elements with.
* `PicobelSetup.js`: these functions initialize Picobel (parsing options, generating initial `state`, etc.).

### Tests

There are tests for most Picobel functions. Picobel uses Jest for running tests. Test files live in the `/tests` directory, and match the main module files: for example, the `/src/helpers.js` file has a corresponding test file called `/tests/helpers.tests.js`

Once you've finished, run `npm run build` to generate the UMD and CommonJS versions (which will appear in `/esm/picobel.js` and `/cjs/picobel.js` respectively).

## Editing the CSS

The CSS themes are written in [SCSS](https://sass-lang.com/guide) and compiled to vanilla CSS using the `npm run styles` command. `npm run styles` compiles the SCSS and then runs it through [Autoprefixer](https://github.com/postcss/autoprefixer) to add all the required vendor prefixes.

New themes should be named with the following pattern: `/scss/player.NEW_THEME_NAME.scss`. They must also be included in the "all themes" stylesheet: [`/scss/all.scss`](https://github.com/tomhazledine/picobel/blob/master/scss/all.scss)

    @import "player.NEW_THEME_NAME";
