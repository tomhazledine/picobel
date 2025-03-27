<p align="center"><a href="https://github.com/tomhazledine/picobel" target="_blank"><img width="200"src="https://github.com/tomhazledine/picobel/blob/main/images/heroLogo.png"></a></p>

<h1 align="center">Picobel.js</h1>

<p align="center">v3.0.2</p>

<p align="center"><a href="https://github.com/tomhazledine/picobel/actions/workflows/node.js.yml"><img src="https://github.com/tomhazledine/picobel/actions/workflows/node.js.yml/badge.svg" alt="Node.js CI" style="max-width: 100%;"></a></p>

Picobel.js (pronounced _peek-o-bell_, as in _decibel_) is a lightweight dependency-free JavaScript tool that converts html audio tags into styleable markup.

Documentation can be found at [picobel.tomhazledine.com](https://picobel.tomhazledine.com/).

## Quick Start

### JavaScript

Picobel is a JavaScript utility, so you'll need to include the script somehow. The recommended method is to [install from npm](#install-js-from-npm) but you can also download the script bundle and [include it directly](#install-js-manually).

#### Install JS from [npm](https://www.npmjs.com/package/picobel)

`npm install picobel` will install Picobel in your project and add Picobel into the `dependencies` section of your `package.json` file. 

```js
// Include Picobel in your project:
import picobel from 'picobel';

// Initialise picobel:
picobel();

// ...or initialise picobel with your chosen options:
picobel({ theme: 'default' });
```

#### Install JS manually

If you prefer not to use npm, you can include the Picobel build file directly.

```html
<!-- Load Picobel -->
<script type='text/javascript' src='picobel.min.js'></script>
<script type='text/javascript'>
    picobel();
</script>
```

### CSS (optional)

Picobel's primary aim is to provide structured markup for styling audio players. If you're commited to writing all your own CSS then you do not need to include any of the Picobel stylesheets (although feel free to [use the pre-made themes as inspiration](/themes) or as a jumping-off point for [writing your own styles](/styling)). 

But you don't **have** to write your own CSS. Picobel comes with several "pre made" themes that you can include.

Adding a theme is a two-step process:

1. Declare the `theme` option when initialising Picobel.
2. Be sure to inclde the relevant stylesheet in your project.

```js
picobel({ theme: 'default' });
```

You can find the CSS files for each theme in the [`/src/css` directory of the GitHub repo](https://github.com/tomhazledine/picobel/tree/main/src/css), along with minified production-ready versions [here](https://github.com/tomhazledine/picobel/tree/main/build). The filename convention is `picobel.THEME_NAME.css`.