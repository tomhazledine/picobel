/**
 * Use custom markup to build an audio player within the DOM.
 * @param {JSON object} songData audio information: url/index number/ 
 * @param {[type]} playerWrapper containing HTML element for the player.
 */
function StyleFreeAudio(songData,playerWrapper){

    /**
     * ------------------------
     * INITIALIZE
     * Setup the audio contexts
     * from the input data
     * ------------------------
     */
    var songs = songData;
    var playPauseButtons = playerWrapper.getElementsByClassName('playlistSongTrigger');
    var currentSongIndex;
    var myAudio = [];
    var playTimer = playerWrapper.getElementsByClassName('songPlayTimer');
    var progressBar = playerWrapper.getElementsByClassName('songProgressSlider');
    var songLengthBox = playerWrapper.getElementsByClassName('songDuration');

    /**
     * Loop over song data to create audio instances for each song.
     */
    for (i = 0; i < songData.length; i++) {
        // Initialize Audio
        myAudio[i] = new Audio(songData[i].url);
        // Setup event listeners
        playPauseButtons[i].addEventListener('click',_playPauseAudio,false);
        myAudio[i].addEventListener('timeupdate', _updateProgress, false);
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
        
        // if (_hasClass(this,'songPlaying')) {
        //     pauseAll();
        //     _removeClass(this,'songPlaying');
        //     _addClass(this,'songPaused');
        // } else {
        //     for (i = 0; i < playPauseButtons.length; i++) {
        //         _removeClass(playPauseButtons[i], 'songPlaying');
        //         _addClass(playPauseButtons[i], 'songPaused');
        //     }
        //     playSong(targetSong);
        //     _addClass(this,'songPlaying');
        //     _removeClass(this,'songPaused');
        //     if (_hasClass(this,'notPlayedYet')) {
        //         _setLengthDisplay(targetSong);
        //         _removeClass(this, 'notPlayedYet');
        //     }
        // }
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