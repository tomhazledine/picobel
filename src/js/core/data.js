import { getFileType, getFileName } from "../utils/helpers";
import { errors, setBuffered } from "./audio-functions";

// Return an array of all the <audio> elements found on the page.
export const findAudio = context => {
    // Get all the <audio> occurrences in the page.
    const audioElements = context.getElementsByTagName("audio");
    // Save our audioElements as an array (so we can manipulate the DOM but
    // still access our items).
    return [...audioElements];
};

// Build an array of classes to add to each new "player" element
export const prepareClasses = (index, classes, theme) => {
    const classesString = `picobel loading picobel--index-${index} ${classes}`;
    const classesArray = classesString.trim().split(" ");
    return [...classesArray, theme];
};

// Get the url for each audio file we want to load [using elements found by findAudio()]
export const getRawData = nodes =>
    nodes.map((node, key) => {
        node.key = key;
        node.mute = false;
        node.tmpVolume = 1;
        return node;
    });

// Get info about the audio track
export const getMeta = item => {
    let meta = {};
    // Get the filename and type
    meta.url = item.currentSrc;
    meta.fileType = getFileType(meta.url);
    meta.fileName = getFileName(meta.url);
    // If there is a valid title, get that title, otherwise get the file name.
    meta.title =
        item.title && item.title !== ""
            ? item.title
            : `${meta.fileName}.${meta.fileType}`;
    // If there is a valid 'artist', get the artist name.
    if (item.dataset) {
        meta.artist = item.dataset.artist ? item.dataset.artist : false;
    } else {
        meta.artist = false;
    }
    return meta;
};

export const checkURL = async url => {
    try {
        const response = await fetch(url);
        console.log({ url, response });
        return response.ok; // URL is valid and reachable
    } catch (error) {
        console.error(error.message);
        // Handle the error accordingly (e.g., set an error state or use a fallback URL)
        return null; // Indicate failure
    }
};

export const pollForLoadingStatus = async (node, intervalState) => {
    const interval = 1000; // Poll every 1000 milliseconds (1 second)
    let isFullyBuffered = false; // Flag to track buffering status
    let checks = 0;
    const maxChecks = 15;

    const checkBufferedStatus = () => {
        checks++;
        // Assuming there's at least one range buffered
        if (node.buffered.length > 0) {
            const bufferedEnd = node.buffered.end(node.buffered.length - 1);
            const duration = node.duration;

            setBuffered(node, bufferedEnd);

            // Check if the audio is fully buffered
            if (bufferedEnd >= duration) {
                isFullyBuffered = true;
                // If fully buffered, clear the interval
                clearInterval(intervalState[node.currentSrc]);
            }
        }
        if (checks >= maxChecks && node.buffered.length <= 0) {
            errors(node);
            clearInterval(intervalState[node.currentSrc]);
        }
    };

    // Set up the interval to check buffering status
    intervalState[node.currentSrc] = setInterval(checkBufferedStatus, interval);

    // Optional: Clear interval on page unload or when no longer needed to avoid memory leaks
    window.addEventListener("unload", () =>
        clearInterval(intervalState[node.currentSrc])
    );
};
