# SFAP.js

## Style-Free Audio Player

A lightweight wrapper for HTML audio. Bring your own markup and CSS.

* MIT license
* No dependencies
* v1.0.1
* Most recent release date: 20150617

---

Find demos and prettier docs at [tomhazledine.com/audioDemo/](http://tomhazledine.com/audioDemo/).

Explanation and background at [tomhazledine.com/style-free-audio-player/](http://tomhazledine.com/style-free-audio-player/)

---

## Concept

Styling default HTML `<audio>` elements is a pain. We *should* be able to do it with CSS, but sadly at the moment we have to battle the "shadow DOM" to get anywhere. Thankfully we can use the Web Audio API to recreate our own audio player. One we can style with CSS. One where *we* have control of the markup.

This **Style-Free Audio Player (SFAP)** is a handy tool to help us do just that. Store details of the audio you want to include in JSON (currently all you need is the path to the file). Then pass it through the `StyleFreeAudio()` function in your javascript along with a reference to your markup. SFAP then links your markup to the audio functionality.

### SFAP gives you:

* A play/pause `<button>`.
* A `songPlayTimer` element that displays the current playhead position of the audio file in minutes and seconds (MM:SS).
* A `songDuration` element that displays the total length of the audio file in minutes and seconds (MM:SS).
* A HTML `<range>` input field that shows a visual representation of the audio file's play progress, and can manually change the play position of the audio file.

## Installation

To install SFAP, just include the `styleFreeAudio.min.js` file at the bottom of your HTML, before your custom javascript.

    <script src="/path/to/styleFreeAudio.min.js"></script>
    <script src="/path/to/yourCustom.js"></script>

Add the initialization code (see below) to your custom JS file.

Add the required markup to your page.

## Initialization

To initialize SFAP you need two things:

* Audio data.
* A wrapper element for your player markup.

Then pass these into the SFAP javascript function and you're good to go.

    // Get the element that wraps all your player's markup.
    var playerWrapper = document.getElementById('audioPlayerIdGoesHere');
    // Get the audio files' data.
    var audioData = audioDataGoesHere;
    // Pass them both into SFAP. 
    var myAudioPlayer = StyleFreeAudio(audioData,playerWrapper);

### Audio Data

This comes in the form of a simple JSON object that stores the URL for each audio file you want to be able to play on the page.

    {
        "url": "path/to/audio/file/one.mp3"
    },
    {
        "url": "path/to/audio/file/two.mp3"
    }

The simplest way to save this JSON data for **SFAP** to read is as a JS variable, either within your own javascript file or inline in the page html itself.

    <script>
        var audioExamples = [
            {
                "url": "path/to/audio/file/one.mp3"
            },
            {
                "url": "path/to/audio/file/two.mp3"
            }
        ];
    </script>

## Required Markup

To give your audio player controls ("Play", "Pause") and song-data displays ("Song Length", "Time Played"), you need to add some classes to your markup.

### The play/pause button.

The play/pause button needs three classes and a custom data attribute for it to work properly.

    <button class="playlistSongTrigger songPaused notPlayedYet" data-song-index="0">Play/Pause</button>

The `playlistSongTrigger` class links the element to SFAP.

The `songPaused` class indicates that the song is not currently playing. This will be changed to `songPlaying` when the associated audio file is being played.

The `notPlayedYet` class is used to tell SFAP to get the duration information the first time the song is played (until the browser tried to load the audio file, we can't measure how long the file is).

### The play timer element.

This displays the current playhead position of the audio file in minutes and seconds (MM:SS).

This can be any element with the class `songPlayTimer`. When the current playhead changes, the inner HTML of the element is updated to the current position in MM:SS format.

    <span class="songPlayTimer">0:00</span>


### The audio duration element.

This displays the total length of the audio file in minutes and seconds (MM:SS).

    <span class="songDuration">0:00</span>

### The current play position slider.

This is a HTML `range` input field that shows a visual representation of the audio file's play progress, and can manually change the play position of the audio file.

    <input type="range" class="songProgressSlider" min="0" max="100" value="0" oninput="myAudioPlayer.sliderScrub(this.value, 1)">

To work, this `range` element must trigger the `sliderScrub()` function on input change, and must pass the value of the input (`this.value`) and the target audio file's index number.

The position information is calculated as a percentage of the audio file's play-time, so set the input's `min` and `max` values to `0` and `100` respectively.








