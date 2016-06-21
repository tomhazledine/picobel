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
function customAudioPlayer(context){

    // NOTE: `context` is the audio context for
    // the webAudioAPI. This must be set before
    // we initialize our function. (View bottom
    // of this file for an example).

    // Find all the elements and store them
    // in an array (for easy access).
    var audioElements = findAudio();

    // Get our data from those elements.
    var data = getRawData(audioElements);

    // Replace those elements with our own custom markup.
    buildMarkup(audioElements);


    // Initialize the audio.
    var myAudio = initAudio(data);

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
     * INITIALIZE AUDIO
     */
    function initAudio(data){

        var myAudio = [];

        for (var i = 0; i < data.length; i++) {
            myAudio[i] = new Audio(data[i].url);
            // Setup event listeners
            playPauseButtons[i].addEventListener('click',_playPauseAudio,false);
            myAudio[i].addEventListener('timeupdate', _updateProgress, false);
        }
    }

    /**
     * 
     */
    function buildMarkup(data){
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            newPlayer = "test\n";
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
        for (var i = 0; i < songs.length; i++) {
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
        for (var i = 0; i < songs.length; i++) {
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
    function sliderScrub(newPosition,index){
        var duration = myAudio[index].duration;
        var targetTime = duration * (newPosition / 100);
        myAudio[index].currentTime = targetTime;
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
        if (_hasClass(this,'songPlaying')) {
            pauseAll();
            _removeClass(this,'songPlaying');
            _addClass(this,'songPaused');
        } else {
            for (i = 0; i < playPauseButtons.length; i++) {
                _removeClass(playPauseButtons[i], 'songPlaying');
                _addClass(playPauseButtons[i], 'songPaused');
            }
            playSong(targetSong);
            _addClass(this,'songPlaying');
            _removeClass(this,'songPaused');
            if (_hasClass(this,'notPlayedYet')) {
                _setLengthDisplay(targetSong);
                _removeClass(this, 'notPlayedYet');
            }
        }
    }

    /**
     * Update Progress:
     * Set the value of the current-position display for a playing song.
     */
    function _updateProgress(){
        var progress = myAudio[currentSongIndex].currentTime;
        var duration = myAudio[currentSongIndex].duration;
        progressParsed = _secondsToMMSS(progress);
        playTimer[currentSongIndex].innerHTML = progressParsed;

        if (progress >= duration) {
            _removeClass(playPauseButtons[currentSongIndex], 'songPlaying');
        }

        var progressPercent = (progress / duration * 100).toFixed(2);

        progressBar[currentSongIndex].value = progressPercent;
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

    return {
        sliderScrub: sliderScrub,
        playSong: playSong,
        pauseAll: pauseAll
    }
}


/**
 * 
 */

// for (var i = 0; i < items.length; i++) {

//         var currentAudioElement = items[i];
//         // console.log(audioElements[i]);
//         var source = currentAudioElement.src;
//         // console.log(source);
//         sources.push(source);

//         myAudio[i] = new Audio(source);


//         // Create a container for our new player
//         var newPlayer = document.createElement('div');
//         newPlayer.className = 'customAudioPlayer player_' + i; 
//         // Create a play/pause button
//         var button = document.createElement('button');
//         button.value = source;
//         button.innerHTML = 'File #' + (i + 1);

//         // Add the button to the player
//         newPlayer.appendChild(button);

//         // Create a wrapper for our player's metadata
//         var meta = document.createElement('div');
//         meta.className = 'metaWrapper';

//         // Create spans to display file data
//         var meta_title = document.createElement('span');
//         meta_title.className = 'titleDisplay';
//         meta_title.innerHTML = 'Title Number ' + (i + 1);
//         meta.appendChild(meta_title);

//         var meta_artist = document.createElement('span');
//         meta_artist.className = 'artistDisplay';
//         meta_artist.innerHTML = 'Artist Number ' + (i + 1);
//         meta.appendChild(meta_title);

//         // Add the metadata to the player
//         newPlayer.appendChild(meta);

//         // newPlayer.innerHTML = source;
        
//         // Replace the original audio element with our new creation.
//         currentAudioElement.parentNode.replaceChild(newPlayer,currentAudioElement);
//     }

//     return sources;


// var myAduioUrls = parseDom();

// console.log(myAduioUrls);



// determine if Web Audio API is available
// (`contextClass` will return `false` if
// the API is not supported).
var contextClass = (window.AudioContext || window.webkitAudioContext);


if (contextClass) {
    // Initialise the audio functions
    customAudioPlayer(contextClass);
}