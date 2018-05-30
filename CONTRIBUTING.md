# Contribute

This started out as a "scratch your own itch" tool for a specific project. I'm open-sourcing it in the hope it might prove useful to others too. There are _a few_ audio player tools/plugins out there, but most have too many features for my needs. I like simplicity, and I like any JS I add to my sites to be as lean as possible.

I'm hoping Picobel can be of use to as many people as possible. If you have an improvement or bug-fix or new feature, get in touch! Make a pull request on the [Picobel.js Github repo](https://github.com/tomhazledine/picobel). I'm just getting started with "open source", so I'd be very glad of any help or suggestions or advice.

## Dev dependencies

Once you've forked the repo, run `npm install` to install the development dependencies. I'm trying to keep the build chain as short as possible, so there's not too much to be installed:

* `babel-cli` and `babel-preset-env` are there to transpile the raw ES6 from [`/esm/picobel.js`](https://github.com/tomhazledine/picobel/blob/master/esm/picobel.js) into the ES5-compatible versions.
* `node-sass` is there to compile the SCSS in [`/scss/`](https://github.com/tomhazledine/picobel/blob/master/scss) into vanilla CSS.
* Once the regular SCSS has been compiled, it gets run through `autoprefixer` (using `postcss-cli`) to make sure the necessary browser prefixes are added to the raw CSS.

## Editing the JS

The canonical source file is [`/esm/picobel.js`](https://github.com/tomhazledine/picobel/blob/master/esm/picobel.js). This is where you should make any changes to the JavaScript code.

Once you've finished, run `npm run build` to generate the CommonJS version (which will appear in `/cjs/picobel.js`).

## Editing the CSS

The CSS themes are written in [SCSS](https://sass-lang.com/guide) and compiled to vanilla CSS using the `npm run styles` command. `npm run styles` compiles the SCSS and then runs it through [Autoprefixer](https://github.com/postcss/autoprefixer) to add all the required vendor prefixes.

New themes should be named with the following pattern: `/scss/player.NEW_THEME_NAME.scss`. They must also be included in the "all themes" stylesheet: [`/scss/all.scss`](https://github.com/tomhazledine/picobel/blob/master/scss/all.scss)

    @import "player.NEW_THEME_NAME";
