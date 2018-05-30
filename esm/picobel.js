/**
 * -----------------------------------------
 *  ____  _           _          _    _
 * |  _ \(_) ___ ___ | |__   ___| |  (_)___
 * | |_) | |/ __/ _ \| '_ \ / _ \ |  | / __|
 * |  __/| | (_| (_) | |_) |  __/ |_ | \__ \
 * |_|   |_|\___\___/|_.__/ \___|_(_)| |___/
 * Picobel.js                       _/ |
 * tomhazledine.com/audio          |__/
 *
 * =========================================
 *
 * Replace any native <audio> instances with
 * standard elements (spans, buttons & divs)
 * that we can style however we like.
 *
 * Functionality powered by Web Audio API.
 * -----------------------------------------
 */
function Picobel(options) {
    /**
     * -----------------------
     * PARSE OPTIONS
     *
     * Make sure we have valid
     * options. If we don't we
     * should provide sensible
     * fallbacks.
     * -----------------------
     */
    options = typeof options !== 'undefined' ? options : {};
    options.theme = options.theme || 'defaultPlayerTheme';
    // Setting a value for `preload` here will override the audio element's value.
    options.preload = options.preload || false;

    /**
     * ---------------------------------------------
     * MAKE STUFF HAPPEN
     *
     * The following lines initialize functions we
     * declare further down the file. We need to
     * call them in a specific order (so things like
     * element-selection work properly).
     * ---------------------------------------------
     */

    // Find all the elements and store them
    // in an array (for easy access).
    let audioElements = findAudio();

    // Get our data from those elements.
    let data = getRawData(audioElements);

    // Replace those elements with our own custom markup.
    buildMarkup(audioElements);

    // Now we've placed our elements in the DOM, we can select them.
    let wrappers = document.getElementsByClassName('customAudioPlayer');
    let playPauseButtons = document.getElementsByClassName('playerTrigger');
    let muteButtons = document.getElementsByClassName('songMuteButton');
    let playPauseButtonsText = document.getElementsByClassName('buttonText');
    let playTimer = document.getElementsByClassName('songPlayTimer');
    let songLengthBox = document.getElementsByClassName('songDuration');
    let titleDisplay = document.getElementsByClassName('titleDisplay');
    let artistDisplay = document.getElementsByClassName('artistDisplay');
    let progressBar = document.getElementsByClassName('songProgressSlider');
    let playhead = document.getElementsByClassName('pseudoProgressPlayhead');
    let indicator = document.getElementsByClassName('pseudoProgressIndicator');
    let volumeControl = document.getElementsByClassName('songVolumeSlider');
    let volumeDisplay = document.getElementsByClassName('songVolumeValue');
    let volumeIndicator = document.getElementsByClassName('pseudoVolumeIndicator');
    let volumePlayhead = document.getElementsByClassName('pseudoVolumePlayhead');

    // Initialize the audio.
    let myAudio = initAudio(data);

    // Create a var to store the index of the file currently
    // being played (defaulting to the first track in the DOM)
    let currentSongIndex = 0;

    /**
     * ---------------------------------
     * SETUP
     *
     * These functions find our targets,
     * generate our elements, and set up
     * our environment.
     * ---------------------------------
     */

    // Return an array of all the <audio> elements found on the page.
    function findAudio() {
        // Get all the <audio> occurrences in the page.
        let audioElements = document.getElementsByTagName('audio');
        // Save our audioElements as an array (so
        // we can manipulate the DOM but still
        // access our items).
        let items = [].slice.call(audioElements);
        return items;
    }

    // Get the url for each audio file
    // we want to load [using elements
    // found by findAudio()]
    function getRawData(_data) {
        let output = _data.map(item => ({
            preload: options.preload ? options.preload : item.preload,
            url: item.src
        }));
        return output;
    }

    // Create our own markup in place of the native <audio> elements.
    function buildMarkup(_data) {
        for (let i = 0; i < _data.length; i++) {
            // Create a container for our new player
            let newPlayer = document.createElement('div');
            newPlayer.className = 'customAudioPlayer loading player_' + i;
            // If the element has a valid class, add that to the player's wrapper
            let className = audioElements[i].className;
            if (className !== '') {
                _addClass(newPlayer, className);
            }
            // Add the class set in our options.
            _addClass(newPlayer, options.theme);
            newPlayer.setAttribute('data-song-index', i);

            // Create a loading indicator
            let loading = document.createElement('div');
            loading.className = 'loader';
            newPlayer.appendChild(loading);

            // Add "waiting" indicator here.

            // Create a play/pause button
            let button = document.createElement('button');
            button.className = 'playerTrigger';
            let buttonText = document.createElement('span');
            buttonText.className = 'buttonText';
            buttonText.innerHTML = 'play';
            button.appendChild(buttonText);

            // Create a wrapper for our player's metadata
            let meta = document.createElement('div');
            meta.className = 'metaWrapper';

            // Create elements to display file metadata
            let meta_title = document.createElement('span');
            meta_title.className = 'titleDisplay';
            meta_title.innerHTML = 'File ' + (i + 1);
            meta.appendChild(meta_title);

            let meta_artist = document.createElement('span');
            meta_artist.className = 'artistDisplay';
            meta.appendChild(meta_artist);

            let timings = document.createElement('div');
            timings.className = 'timingsWrapper';

            let meta_timer = document.createElement('span');
            meta_timer.className = 'songPlayTimer';
            meta_timer.innerHTML = '0:00';
            timings.appendChild(meta_timer);

            // Progress Indicator
            let meta_progress_wrapper = document.createElement('div');
            meta_progress_wrapper.className = 'songProgressSliderWrapper';
            let meta_pseudo_progress_background = document.createElement('div');
            meta_pseudo_progress_background.className = 'pseudoProgressBackground';
            meta_progress_wrapper.appendChild(meta_pseudo_progress_background);
            let meta_pseudo_progress_indicator = document.createElement('div');
            meta_pseudo_progress_indicator.className = 'pseudoProgressIndicator';
            meta_progress_wrapper.appendChild(meta_pseudo_progress_indicator);
            let meta_pseudo_progress_playhead = document.createElement('div');
            meta_pseudo_progress_playhead.className = 'pseudoProgressPlayhead';
            meta_progress_wrapper.appendChild(meta_pseudo_progress_playhead);
            let meta_progress = document.createElement('input');
            meta_progress.type = 'range';
            meta_progress.min = 0;
            meta_progress.max = 100;
            meta_progress.value = 0;
            meta_progress.className = 'songProgressSlider';
            meta_progress_wrapper.appendChild(meta_progress);

            timings.appendChild(meta_progress_wrapper);

            let meta_duration = document.createElement('span');
            meta_duration.className = 'songDuration';
            meta_duration.innerHTML = '-:--';
            timings.appendChild(meta_duration);

            // Volume Indicator
            let meta_volume = document.createElement('div');
            meta_volume.className = 'songVolume';
            let meta_mute = document.createElement('button');
            meta_mute.className = 'songMuteButton';
            meta_mute.innerHTML = 'Mute';
            meta_volume.appendChild(meta_mute);
            let meta_volume_label_wrapper = document.createElement('div');
            meta_volume_label_wrapper.className = 'songVolumeLabelWrapper';
            let meta_volume_label = document.createElement('span');
            meta_volume_label.className = 'songVolumeLabel';
            meta_volume_label.innerHTML = 'Volume';
            meta_volume_label_wrapper.appendChild(meta_volume_label);
            let meta_volume_value = document.createElement('span');
            meta_volume_value.className = 'songVolumeValue';
            meta_volume_value.innerHTML = '10';
            meta_volume_label_wrapper.appendChild(meta_volume_value);
            meta_volume.appendChild(meta_volume_label_wrapper);
            let meta_volume_wrapper = document.createElement('div');
            meta_volume_wrapper.className = 'songVolumeSliderWrapper';
            let meta_pseudo_volume_background = document.createElement('div');
            meta_pseudo_volume_background.className = 'pseudoVolumeBackground';
            meta_volume_wrapper.appendChild(meta_pseudo_volume_background);
            let meta_pseudo_volume_indicator = document.createElement('div');
            meta_pseudo_volume_indicator.className = 'pseudoVolumeIndicator';
            meta_volume_wrapper.appendChild(meta_pseudo_volume_indicator);
            let meta_pseudo_volume_playhead = document.createElement('div');
            meta_pseudo_volume_playhead.className = 'pseudoVolumePlayhead';
            meta_volume_wrapper.appendChild(meta_pseudo_volume_playhead);
            let meta_volume_control = document.createElement('input');
            meta_volume_control.type = 'range';
            meta_volume_control.min = 0;
            meta_volume_control.max = 1;
            meta_volume_control.value = 1;
            meta_volume_control.step = 0.1;
            meta_volume_control.className = 'songVolumeSlider';
            meta_volume_wrapper.appendChild(meta_volume_control);
            meta_volume.appendChild(meta_volume_wrapper);

            // Add the button to the player
            newPlayer.appendChild(button);

            // Add the metadata to the player
            newPlayer.appendChild(meta);

            // Add the timings to the player
            newPlayer.appendChild(timings);

            // Add the volume display to the player
            newPlayer.appendChild(meta_volume);

            // Replace the original audio element with our new creation.
            _data[i].parentNode.replaceChild(newPlayer, _data[i]);
        }
    }

    // Initialize the audio for each file, and setup the event listeners.
    function initAudio(_data) {
        let _myAudio = _data.map((item, key) => {
            let node = new Audio();

            // Apply the preload attr. if needed
            if (item.preload) {
                node.preload = item.preload;
            }

            // Add the audio source (by URL) to the audio node
            node.src = item.url;

            // Check if file exists before setting time, to prevent IE11 error
            if (!isNaN(node.duration)) {
                node.currentTime = 0;
            }

            // Assign an index to each audio node:
            // this links the audio elements to the
            // relevant markup
            node.setAttribute('data-song-index', key);

            // Setup event listeners
            node.addEventListener('timeupdate', _triggerUpdateProgress, false);
            node.addEventListener('loadstart', _loadStart, false);
            node.addEventListener('canplaythrough', _canplaythrough, false);
            node.addEventListener('error', _errors, false);
            node.addEventListener('stalled', _stalled, false);
            node.addEventListener('waiting', _errors, false);
            node.addEventListener('progress', _progress, false);

            playPauseButtons[key].addEventListener('click', _playPauseAudio, false);
            progressBar[key].addEventListener('input', sliderScrub, false);
            volumeControl[key].addEventListener('input', volume, false);
            muteButtons[key].addEventListener('click', _muteUnmuteAudio, false);

            return node;
        });

        return _myAudio;
    }

    /**
     * -----------------------------
     * LOADING STATES
     *
     * Handle the buffering of audio
     * data and update displays to
     * show this.
     * -----------------------------
     */

    // Fire this event when loading starts [TEST]
    function _loadStart() {}

    // Fire this event when we can play the audio
    // all the way through (ie. it is fully loaded)
    function _canplaythrough() {
        let index = this.getAttribute('data-song-index');
        _setLengthDisplay(index);
        _removeClass(wrappers[index], 'loading');

        _getMeta(index);
    }

    // Get info about the audio track, and update the display with this info
    function _getMeta(i) {
        // Get the filename and type
        let url = myAudio[i].src;
        let fileType = _helpers.getFileType(url);
        let fileName = _helpers.getFileName(url);

        // If there is a valid title, display that title...
        let title = audioElements[i].title;
        if (title !== '') {
            titleDisplay[i].innerHTML = title;
        } else {
            // ...otherwise show the file name.
            titleDisplay[i].innerHTML = fileName + '.' + fileType;
        }

        // If there is a valid 'artist', display the artist name.
        let artist = audioElements[i].getAttribute('data-artist');
        if (artist !== '') {
            artistDisplay[i].innerHTML = artist;
        }

        // // If the element has a valid class, add that to the player's wrapper
        // var className = audioElements[i].className;
        // if (className != '') {
        //     _addClass(wrappers[i], className)
        // }
    }

    /**
     * -----------------------
     * PLAYBACK SETTING
     *
     * These functions control
     * the functionality of
     * the audio players.
     * -----------------------
     */

    // Set all audio elements to 'paused'
    function pauseAll() {
        for (let i = 0; i < data.length; i++) {
            myAudio[i].pause();
        }
    }

    // Play the selected song
    function playSong(index) {
        currentSongIndex = index;
        for (let i = 0; i < data.length; i++) {
            if (i != index) {
                myAudio[i].pause();
            }
        }
        myAudio[index].play();
    }

    // Set the current position of selected song to specific value.
    function sliderScrub() {
        let value = this.value;
        let index = this.parentNode.parentNode.parentNode.getAttribute('data-song-index');
        let duration = myAudio[index].duration;
        let targetTime = duration * (value / 100);
        targetTime = targetTime.toFixed(2);
        myAudio[index].currentTime = targetTime;
        _updateProgress(index);
    }

    // Volume
    function volume() {
        let value = this.value;
        let index = this.parentNode.parentNode.parentNode.getAttribute('data-song-index');
        mute(index, false);
        setVolume(index, value);
    }

    function setVolume(index, value) {
        let valueMapped = value * 10;
        let volumePercent = value * 100;
        myAudio[index].volume = value;
        volumeDisplay[index].innerHTML = valueMapped;
        volumeControl[index].value = value;
        volumeIndicator[index].style.width = volumePercent + '%';
        volumePlayhead[index].style.left = volumePercent + '%';
    }

    // Mute
    function mute(index, state) {
        let oldVolume;
        if (state) {
            oldVolume = myAudio[index].volume;
            muteButtons[index].setAttribute('data-saved-volume', oldVolume);
            setVolume(index, 0);
            _addClass(muteButtons[index], 'songMuted');
            _removeClass(muteButtons[index], 'songUnmuted');
            muteButtons[index].innerHTML = 'unmute';
        } else {
            // myAudio[index].volume = 0;
            oldVolume = muteButtons[index].getAttribute('data-saved-volume');
            if (typeof oldVolume != 'undefined' && oldVolume > 0) {
                setVolume(index, oldVolume);
            } else {
                setVolume(index, 1);
            }
            _removeClass(muteButtons[index], 'songMuted');
            _addClass(muteButtons[index], 'songUnmuted');
            muteButtons[index].innerHTML = 'mute';
        }
    }

    // Play or pause a track
    function playPause(index, state) {
        let buttonText = playPauseButtonsText[index];
        let target = playPauseButtons[index];
        if (state) {
            for (let i = 0; i < playPauseButtons.length; i++) {
                _removeClass(playPauseButtons[i], 'songPlaying');
                _addClass(playPauseButtons[i], 'songPaused');
                playPauseButtonsText[i].innerHTML = 'play';
            }
            playSong(index);
            _addClass(target, 'songPlaying');
            _removeClass(target, 'songPaused');
            buttonText.innerHTML = 'pause';
        } else {
            pauseAll();
            _removeClass(target, 'songPlaying');
            _addClass(target, 'songPaused');
            buttonText.innerHTML = 'play';
        }
    }

    // Toggle 'play' and 'pause' for a track
    function _playPauseAudio() {
        let targetSong = this.parentNode.getAttribute('data-song-index');
        if (typeof targetSong != 'undefined') {
            let playSong = _hasClass(this, 'songPlaying') ? false : true;
            playPause(targetSong, playSong);
        } else {
            console.log('too soon to play!');
        }
    }

    // Toggle 'mute' for a track
    function _muteUnmuteAudio() {
        let targetSong = this.parentNode.parentNode.getAttribute('data-song-index');
        let buttonText = playPauseButtonsText[targetSong];
        if (_hasClass(this, 'songMuted')) {
            mute(targetSong, false);
            // _removeClass(this,'songMuted');
            // _addClass(this,'songUnmuted');
            // buttonText.innerHTML = 'mute';
        } else {
            mute(targetSong, true);
            // _addClass(this,'songMuted');
            // _removeClass(this,'songUnmuted');
            // buttonText.innerHTML = 'unmute';
        }
    }

    // Get index of track to be updated, then pass it to _updateProgress()
    function _triggerUpdateProgress() {
        let index = this.getAttribute('data-song-index');
        _updateProgress(index);
    }

    // Set the value of the current-position display for a playing song
    function _updateProgress(index) {
        let progress = myAudio[index].currentTime;
        let duration = myAudio[index].duration;
        let progressParsed = _helpers.parseTime(progress);
        playTimer[index].innerHTML = progressParsed;
        if (progress >= duration) {
            _removeClass(playPauseButtons[index], 'songPlaying');
        }
        let progressPercent = (progress / duration * 100).toFixed(2);
        progressBar[index].value = progressPercent;
        indicator[index].style.width = progressPercent + '%';
        playhead[index].style.left = progressPercent + '%';
    }

    // Set the value of the song-length display
    function _setLengthDisplay(index) {
        let songLength = myAudio[index].duration;
        let duration = _helpers.parseTime(songLength);
        let songClass = '.song' + index;
        songLengthBox[index].innerHTML = duration;
    }

    /**
     * --------------
     * ERROR HANDLING
     *
     * Functions that
     * will display a
     * warning notice
     * when any error
     * is triggered.
     * --------------
     */

    function _errors(e) {
        // console.log( 'error: ' );
        // console.log( e.type );
        let index = this.getAttribute('data-song-index');
        // console.log( myAudio[index].error );
        // console.log(e);
    }

    function _error(e) {
        let index = this.getAttribute('data-song-index');
        let error = myAudio[index].error;
        // console.log( 'error: ' );
        // console.log(e);
        // console.log( error );
    }
    function _stalled(e) {
        // console.log( 'stalled!' );
        let index = this.getAttribute('data-song-index');
        // console.log( 'Target: ' + index );
        // console.log( 'Play?: ' + false );
        playPause(index, false);
    }
    function _waiting() {
        // console.log( 'waiting!' );
    }

    function _progress(e) {
        let index = this.getAttribute('data-song-index');
        let readyState = myAudio[index].readyState;
    }

    /**
     * -----------------------------
     * HELPERS
     *
     * These are basic utilities to
     * parse data, add/remove/toggle
     * classes etc.
     * -----------------------------
     */

    // Does the target element have the target class?
    function _hasClass(el, className) {
        let result;
        if (el.classList) {
            result = el.classList.contains(className);
        } else {
            result = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
        return result;
    }

    // Add a class to the target element.
    function _addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    // Remove a class from the target element.
    function _removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(
                new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
                ' '
            );
        }
    }

    /**
     * ----------------------
     * PUBLIC METHODS
     *
     * Declare the methods we
     * want to be accessible
     * from outside scope.
     * ----------------------
     */

    return {
        sliderScrub: sliderScrub,
        playSong: playSong,
        pauseAll: pauseAll
    };
}

/**
 * -----------------------------
 * HELPERS
 *
 * These are basic utilities to
 * parse data, add/remove/toggle
 * classes etc.
 * -----------------------------
 */
const _helpers = {
    // Convert seconds into minutes-and-seconds (MMSS) format
    parseTime: seconds => {
        let hours = Math.floor(seconds / 3600);

        let mins = Math.floor((seconds % 3600) / 60)
            .toFixed(0)
            .toString();

        let secs = Math.floor((seconds % 3600) % 60)
            .toFixed(0)
            .toString();

        // Left-pad seconds string if needed
        secs = secs > 10 ? secs : `0${secs}`;

        let parsedTime = `${mins}:${secs}`;

        if (hours > 0) {
            // Left-pad minutes string if needed
            mins = mins > 10 ? mins : `0${mins}`;
            parsedTime = `${hours}:${mins}:${secs}`;
        }

        return parsedTime;
    },

    // Get File Type
    getFileType: string => string.substr((~-string.lastIndexOf('.') >>> 0) + 2),

    // Get File Name
    getFileName: string => {
        let fullFileName = string.replace(/^.*[\\\/]/, '');
        let withNoExtension = fullFileName.split('.')[0];
        return withNoExtension;
    }
};

export const helpers = _helpers;

export default Picobel;
