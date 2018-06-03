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
    },

    // Create markup for a custom slider
    buildSlider: (namespace = 'picobel', min = 0, max = 100, value = 0) => {
        // Create a container element to hold all the parts
        let wrapper = document.createElement('div');
        wrapper.className = `${namespace}-slider__wrapper`;

        // Create a background div
        let background = document.createElement('div');
        background.className = `${namespace}-slider__background`;
        // Add the background to the container
        wrapper.appendChild(background);

        // Create a progress indicator
        let progressIndicator = document.createElement('div');
        progressIndicator.className = `${namespace}-slider__progress-indicator`;
        wrapper.appendChild(progressIndicator);

        // Create a "playhead"
        let playhead = document.createElement('div');
        playhead.className = `${namespace}-slider__playhead`;
        wrapper.appendChild(playhead);

        // Create an (invisible) input (html range)
        let progress = document.createElement('input');
        progress.type = 'range';
        progress.min = min;
        progress.max = max;
        progress.value = value;
        progress.className = `${namespace}-slider__range`;
        wrapper.appendChild(progress);

        return wrapper;
    }
};

export default _helpers;
