# SFAP.js

## Style-Free Audio Player (Better name coming soon, hopefully)

SFAP is a lightweight dependency-free JS tool that converts html audio tags into styleable markup.

## Why would I need this?

Because you're frontender and CSS magician who loves to have control over every aspect the sites you create.

The native html `<audio>` tag provides fantastic functionality, but gives you no styling options at all. This tool rebuilds the audio player with regular html elements: you get all the functionality of the native audio element, *and* complete control of it's appearance.

![Native audio player](images/native_players.jpg)

With this tool, you can make the `<audio>` element look however you like.

## Demo

See **SFAP.js** in action at [tomhazledine.com/audio/](http://tomhazledine.com/audio/).

## Useage

To use **SFAP.js** you'll need to include the `styleFreeAudio.min.js` file in your project. This needs to be called before your custom scripts, and ideally in the `<foot>` of your page.

    <script src="/path/to/styleFreeAudio.min.js"></script>
    <script src="/path/to/yourCustom.js"></script>

Then, in your custom JS script file, initialize the function: 

    customAudioPlayer();

When your page loads, SFAP will replace any default `<audio>` elements with a block of custom-markup, complete with classes that you can use to target your custom CSS.

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






