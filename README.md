# Picobel.js

Picobel.js (pronounced *peek-o-bell*, as in *decibel*) is a lightweight dependency-free Javascript tool that converts html audio tags into styleable markup.

## Why would I need this?

There are two reasons you might want to use Picobel...

1. You want a uniform cross-browser experience for the audio players on your site. Pick a pre-made Picobel theme, and you're all set.

2. You're frontender and CSS magician who loves to have control over every aspect the sites you create. You can use the markup-only version of Picobel, and write your own CSS.

The native html `<audio>` tag provides fantastic functionality, but gives you no styling options at all. Picobel rebuilds the audio player with regular html elements: you get all the functionality of the native audio element, *and* complete control of it's appearance.

Using Picobel you can turn this:

![Native audio player](images/native_players.png)
*Default browser audio players*

Into this:

![Picobel-styled audio player](images/picobel_players.png)
*Picobel-styled audio players*

**Picobel** allows you to create custom styles for your audio players: providing cross-browser consistency and a seamless integration with your existing brand styles.

## Usage

To use **Picobel.js** you'll need to include the `styleFreeAudio.min.js` file in your project. This needs to be called before your custom scripts, and ideally in the `<foot>` of your page.

    <script src="/path/to/styleFreeAudio.min.js"></script>
    <script src="/path/to/yourCustom.js"></script>

Then, in your custom JS script file, initialize the function: 

    customAudioPlayer();

When your page loads, Picobel will replace any default `<audio>` elements with a block of custom-markup, complete with classes that you can use to apply your custom CSS.

### This:

    <audio src="http://audio.eatenbymonsters.com/reviews/chvrches/gun.mp3"></audio>

### Gets turned into this:

    <div class="customAudioPlayer player_0" data-song-index="0">
        <div class="loader"></div>
        <button class="playerTrigger">
            <span class="buttonText">play</span>
        </button>
        <div class="metaWrapper">
            <span class="titleDisplay">gun.mp3</span>
            <span class="artistDisplay"></span>
        </div>
        <div class="timingsWrapper">
            <span class="songPlayTimer">0:00</span>
            <div class="songProgressSliderWrapper">
                <div class="pseudoProgressBackground"></div>
                <div class="pseudoProgressIndicator"></div>
                <div class="pseudoProgressPlayhead"></div>
                <input type="range" min="0" max="100" class="songProgressSlider">
            </div>
            <span class="songDuration">3:51</span>
        </div>
        <div class="songVolume">
            <div class="songVolumeLabelWrapper">
                <span class="songVolumeLabel">Volume</span>
                <span class="songVolumeValue">10</span>
            </div>
            <div class="songVolumeSliderWrapper">
                <div class="pseudoVolumeBackground"></div>
                <div class="pseudoVolumeIndicator"></div>
                <div class="pseudoVolumePlayhead"></div>
                <input type="range" min="0" max="1" step="0.1" class="songVolumeSlider">
            </div>
        </div>
    </div>


---

* MIT license
* No dependencies
* v0.2.0
* Most recent release date: 20160717

---






