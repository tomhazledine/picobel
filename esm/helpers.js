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

export default _helpers;
