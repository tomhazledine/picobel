/**
 * ----------------------
 * STYLEABLE AUDIO PLAYER
 *
 * Replace native <audio>
 * elements with standard
 * DOM elements (buttons,
 * divs, & spans) that we
 * can then style however
 * we like.
 *
 * Functionality provided
 * by using HTML5 Audio.
 * ----------------------
 */
function customAudioPlayer(){

    // Find all the elements and store them
    // in an array (for easy access).
    var audioElements = findAudio();

    // Get our data from those elements.
    var data = getRawData(audioElements);

    // Replace those elements with our own custom markup.
    buildMarkup(audioElements);

    var wrappers = document.getElementsByClassName('customAudioPlayer');
    var playPauseButtons = document.getElementsByClassName('playerTrigger');
    var playPauseButtonsText = document.getElementsByClassName('buttonText');
    var playTimer = document.getElementsByClassName('songPlayTimer');
    var progressBar = document.getElementsByClassName('songProgressSlider');
    var songLengthBox = document.getElementsByClassName('songDuration');
    var titleDisplay = document.getElementsByClassName('titleDisplay');
    var artistDisplay = document.getElementsByClassName('artistDisplay');
    var playhead = document.getElementsByClassName('pseudoProgressPlayhead');
    var indicator = document.getElementsByClassName('pseudoProgressIndicator');


    // Initialize the audio.
    var myAudio = initAudio(data);

    console.log(myAudio);

    var currentSongIndex = 0;

    // console.log(data);

    /**
     * ----------------------
     * FIND <AUDIO> INSTANCES
     *
     * Return an array of all
     * the <audio> elements
     * found on the page.
     * ----------------------
     */
    function findAudio(){

        // Get all the <audio> occurrences in the page.
        var audioElements = document.getElementsByTagName('audio');
        
        // Save our audioElements as an array (so
        // we can manipulate the DOM but still
        // access our items).
        var items = [].slice.call(audioElements);

        return items;
    }

    /**
     * -------------------------
     * CREATE OBJECTS FROM INPUT
     *
     * Scan DOM for instances of
     * <audio>, and create a new
     * object for each instance.
     * -------------------------
     */
    function getRawData(data){
        output = [];

        for (var i = 0; i < data.length; i++) {
            item = {};
            // Get the file's URL
            item['url'] = data[i].src;

            output.push(item);
        }

        return output;
    }

    /**
     * ----------------
     * INITIALIZE AUDIO
     *
     * Setup the audio
     * for each file.
     * ----------------
     */
    function initAudio(data){

        var myAudio = [];

        for (var i = 0; i < data.length; i++) {
            myAudio[i] = new Audio(data[i].url);
            myAudio[i].currentTime = 0;
            // Setup event listeners
            // var playPauseButtons = document.getElementsByClassName('playerTrigger');
            // var playTimer = document.getElementsByClassName('songPlayTimer');
            // var progressBar = document.getElementsByClassName('songProgressSlider');
            // var songLengthBox = document.getElementsByClassName('songDuration');
            // 
            // console.log(playPauseButtons);
            playPauseButtons[i].addEventListener('click',_playPauseAudio,false);
            progressBar[i].addEventListener('input', sliderScrub, false);
            // playhead[i].addEventListener('click',_playheadClick,false);
            myAudio[i].addEventListener('timeupdate', _triggerUpdateProgress, false);
            myAudio[i].addEventListener('loadstart', _loadStart, false);
            myAudio[i].addEventListener('canplaythrough', _canplaythrough, false);
            myAudio[i].setAttribute('data-song-index',i);
        }

        return myAudio;
    }

    /**
     * LOADING
     */
    function _loadStart(){
        console.log('Load start');
    }
    function _canplaythrough(){
        var index = this.getAttribute('data-song-index');
        console.log('Can play through ' + index);
        _setLengthDisplay(index);
        _removeClass(wrappers[index], 'loading');

        _getMeta(index);
    }
    function _getMeta(i){
        var url = myAudio[i].src;
        var fileType = _getFileType(url);
        var fileName = _getFileName(url);

        var title = audioElements[i].title;
        var artist = audioElements[i].getAttribute('data-artist');;
        
        if (title != '') {
            titleDisplay[i].innerHTML = title;
        } else {
            titleDisplay[i].innerHTML = fileName + '.' + fileType;
        }

        if (artist != '') {
            artistDisplay[i].innerHTML = artist;
        }
    }

    /**
     * --------------------
     * BUILD MARKUP
     *
     * Create our own new
     * elements in place of
     * the native <audio>
     * element.
     * --------------------
     */
    function buildMarkup(data){
        for (var i = 0; i < data.length; i++) {
            // console.log(data[i]);
            // var newPlayer = document.createElement('div');
            // newPlayer.className = 'customPlayerWrapper player_' + i;
            // newPlayer.innerHTML = "test\n";
            // data[i].parentNode.replaceChild(newPlayer,data[i]);

            // Create a container for our new player
            var newPlayer = document.createElement('div');
            newPlayer.className = 'customAudioPlayer loading player_' + i;
            
            // Create a play/pause button
            var button = document.createElement('button');
            button.setAttribute('data-song-index',i);
            // button.value = data[i].url;
            button.className = 'playerTrigger';
            var buttonText = document.createElement('span');
            buttonText.className = 'buttonText';
            buttonText.innerHTML = 'play';//File #' + (i + 1);
            button.appendChild(buttonText);

            // Create a wrapper for our player's metadata
            var meta = document.createElement('div');
            meta.className = 'metaWrapper';

            // Create elements to display file metadata
            var meta_title = document.createElement('span');
            meta_title.className = 'titleDisplay';
            meta_title.innerHTML = 'File ' + (i + 1);
            meta.appendChild(meta_title);

            var meta_artist = document.createElement('span');
            meta_artist.className = 'artistDisplay';
            // meta_artist.innerHTML = 'Artist Number ' + (i + 1);
            meta.appendChild(meta_artist);

            var timings = document.createElement('div');
            timings.className = 'timingsWrapper';

            var meta_timer = document.createElement('span');
            meta_timer.className = 'songPlayTimer';
            meta_timer.innerHTML = '0:00';
            timings.appendChild(meta_timer);

            // Progress Indicator
            var meta_progress_wrapper = document.createElement('div');
            meta_progress_wrapper.setAttribute('data-song-index',i);
            meta_progress_wrapper.className = 'songProgressSliderWrapper';
            var meta_pseudo_progress_indicator = document.createElement('div');
            meta_pseudo_progress_indicator.className = 'pseudoProgressIndicator';
            meta_progress_wrapper.appendChild(meta_pseudo_progress_indicator);
            var meta_pseudo_progress_playhead = document.createElement('div');
            meta_pseudo_progress_playhead.className = 'pseudoProgressPlayhead';
            meta_progress_wrapper.appendChild(meta_pseudo_progress_playhead);
            var meta_progress = document.createElement('input');
            meta_progress.type = 'range';
            meta_progress.setAttribute('data-song-index',i);
            meta_progress.min = 0;
            meta_progress.max = 100;
            meta_progress.value = 0;
            meta_progress.className = 'songProgressSlider';
            meta_progress_wrapper.appendChild(meta_progress);
            
            timings.appendChild(meta_progress_wrapper);

            var meta_duration = document.createElement('span');
            meta_duration.className = 'songDuration';
            meta_duration.innerHTML = '-:--';
            timings.appendChild(meta_duration);

            // Volume Indicator
            var meta_volume = document.createElement('div');
            meta_volume.setAttribute('data-song-index',i);
            meta_volume.className = 'songVolume';
            var meta_volume_label = document.createElement('span');
            meta_volume_label.className = 'songVolumeLabel';
            meta_volume_label.innerHTML = 'Volume';
            meta_volume.appendChild(meta_volume_label);
            var meta_volume_value = document.createElement('span');
            meta_volume_value.className = 'songVolumeValue';
            meta_volume_value.innerHTML = '10';
            meta_volume.appendChild(meta_volume_value);
            var meta_volume_wrapper = document.createElement('div');
            meta_volume_wrapper.className = 'songVolumeSliderWrapper';
            var meta_pseudo_volume_indicator = document.createElement('div');
            meta_pseudo_volume_indicator.className = 'pseudoVolumeIndicator';
            meta_volume_wrapper.appendChild(meta_pseudo_volume_indicator);
            var meta_pseudo_volume_playhead = document.createElement('div');
            meta_pseudo_volume_playhead.className = 'pseudoVolumePlayhead';
            meta_volume_wrapper.appendChild(meta_pseudo_volume_playhead);
            var meta_volume_control = document.createElement('input');
            meta_volume_control.type = 'range';
            meta_volume_control.min = 0;
            meta_volume_control.max = 100;
            meta_volume_control.value = 100;
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
            data[i].parentNode.replaceChild(newPlayer,data[i]);
        }
    }


    /**
     * --------------------
     * PUBLIC
     * These methods can be
     * accessed directly
     *
     * Pause All
     * Play Song
     * Scrubber
     * --------------------
     */

    /**
     * Pause All:
     * Set all audio elements to 'paused'
     */
    function pauseAll(){
        for (var i = 0; i < data.length; i++) {
            myAudio[i].pause();
        }
    }

    /**
     * Play Song:
     * Play the selected song
     * @param  {integer} index The index number of the song to be played
     */
    function playSong(index){
        currentSongIndex = index;
        for (var i = 0; i < data.length; i++) {
            if (i != index) {
                myAudio[i].pause();
            }
        }
        myAudio[index].play();
    }

    /**
     * Scrubber:
     * Set the current position of selected song to specific value.
     * Public because it needs to be triggered by a 'range' input's onChange.
     * @param  {integer} newPosition The desired new song position in seconds.
     * @param  {integer} index       The index number of the song to be targeted.
     */
    function sliderScrub(){
        var value = this.value;
        var index = this.getAttribute('data-song-index');
        // console.log(value);
        // console.log(index);
        // currentSongIndex = index;
        var duration = myAudio[index].duration;
        var targetTime = duration * (value / 100);
        targetTime = targetTime.toFixed(2);
        // console.log(duration);
        // console.log(targetTime);
        myAudio[index].currentTime = targetTime;
        _updateProgress(index);
    }

    /**
     * ----------------------
     * PRIVATE
     * These methods can only
     * be used by internal
     * functions
     *
     * Play/Pause Toggle
     * Update Progress
     * Seconds to MMSS
     * Set Length Display
     * ----------------------
     */

    /**
     * Play/Pause Toggle:
     * Toggle 'play' and 'pause' for a song
     */
    function _playPauseAudio(){
        var targetSong = this.getAttribute('data-song-index');
        var buttonText = playPauseButtonsText[targetSong];
        if (_hasClass(this,'songPlaying')) {
            pauseAll();
            _removeClass(this,'songPlaying');
            _addClass(this,'songPaused');
            buttonText.innerHTML = 'play';
        } else {
            for (i = 0; i < playPauseButtons.length; i++) {
                _removeClass(playPauseButtons[i], 'songPlaying');
                _addClass(playPauseButtons[i], 'songPaused');
                playPauseButtonsText[i].innerHTML = 'play';

            }
            playSong(targetSong);
            _addClass(this,'songPlaying');
            _removeClass(this,'songPaused');
            buttonText.innerHTML = 'pause';
            // if (_hasClass(this,'notPlayedYet')) {
                _setLengthDisplay(targetSong);
                _removeClass(this, 'notPlayedYet');
            // }
        }
    }

    /**
     * Trigger "Update Progress":
     * Link to event handler. Gets the index
     * of the song to be updated, then passes
     * it to the _updateProgress() function.
     */
    function _triggerUpdateProgress(){
        var index = this.getAttribute('data-song-index');
        _updateProgress(index);
    }
    
    /**
     * Update Progress:
     * Set the value of the current-position display for a playing song.
     */
    function _updateProgress(index){
        // console.log(this.getAttribute('data-song-index'));
        var progress = myAudio[index].currentTime;
        var duration = myAudio[index].duration;
        progressParsed = _secondsToMMSS(progress);
        playTimer[index].innerHTML = progressParsed;

        if (progress >= duration) {
            _removeClass(playPauseButtons[index], 'songPlaying');
        }

        var progressPercent = (progress / duration * 100).toFixed(2);

        progressBar[index].value = progressPercent;
        indicator[index].style.width = progressPercent + '%';
        playhead[index].style.left = progressPercent + '%';
    }

    /**
     * Seconds to MMSS:
     * Convert seconds into minutes-and-seconds (MMSS) format
     * @param  {integer} seconds The seconds value to be parsed
     * @return {integer}         The MMSS value
     */
    function _secondsToMMSS(seconds){
        var mins = Math.floor(seconds % 3600 / 60);
        mins = mins.toFixed(0);
        mins = mins.toString();
        var secs = Math.floor(seconds % 3600 % 60);
        secs = secs.toFixed(0);
        secs = secs.toString();
        if (secs < 10) {
        secs = '0' + secs;
        };
        var mmss = mins + ':' + secs;
        return mmss;
    }

    /**
     * Set Length Display:
     * Set the value of the song-length display.
     * @param {integer} index The index number of the song we want to find the length of.
     */
    function _setLengthDisplay(index){
        var songLength = myAudio[index].duration;
        var duration = _secondsToMMSS(songLength);
        var songClass = '.song' + index;
        songLengthBox[index].innerHTML = duration;
    }

    /**
     * ------------------------------------
     * HELPERS
     * These are basic utilities that allow
     * for cross-browser support, replacing
     * the need to use jQuery.
     *
     * Has Class
     * Add Class
     * Remove Class
     * ------------------------------------
     */
    
    /**
     * Has Class:
     * Does the target element have the target class?
     * @param  {object}  el        The target element.
     * @param  {string}  className The target class.
     * @return {Boolean}           If the el has the class, output 'true'. Otherwise 'false'.
     */
    function _hasClass(el, className){
        if (el.classList) {
            var result = el.classList.contains(className);
        } else {
            var result = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
        return result;
    }

    /**
     * Add Class:
     * Add a class to the target element.
     * @param {object} el        The target element.
     * @param {string} className The target class.
     */
    function _addClass(el, className){
        if (el.classList) {
            el.classList.add(className);
        }
        else {
            el.className += ' ' + className;
        }
    }

    /**
     * Remove Class:
     * Remove a class from the target element.
     * @param  {object} el        The target element.
     * @param  {string} className The target class.
     */
    function _removeClass(el, className){
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * Get File Type
     */
    function _getFileType(string){
        return string.substr((~-string.lastIndexOf(".") >>> 0) + 2);
    }
    function _getFileName(string){
        var fullFileName = string.replace(/^.*[\\\/]/, '');
        var withNoExtension = fullFileName.split('.')[0];
        return withNoExtension;
    }

    // // HANDLE PLAYHEAD EVENTS
    // function _playheadClick(){
    //     // Get song index
    //     var index = this.parentNode.getAttribute('data-song-index');
    //     console.log(index);
    //     // Get position and width/height of playhead
    //     var rect = this.getBoundingClientRect();
    //     console.log(rect);
    // }


    return {
        sliderScrub: sliderScrub,
        playSong: playSong,
        pauseAll: pauseAll
    }
}


// Initialise the audio functions
customAudioPlayer();