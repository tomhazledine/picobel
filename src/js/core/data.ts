import { getFileName, getFileType } from "../utils/helpers";
import { errors, setBuffered } from "./audio-functions";

export type AudioElement = HTMLAudioElement & {
    key: number;
    mute?: boolean;
    tmpVolume?: number;
    elements?: {
        [key: string]: HTMLElement;
    };
};

type Meta = {
    url: string;
    fileType: string;
    fileName: string;
    title: string;
    artist: string | false;
};

// Return an array of all the <audio> elements found on the page.
export const findAudio = (context: HTMLElement | Document): AudioElement[] => {
    // Get all the <audio> occurrences in the page.
    const audioElements = context.getElementsByTagName("audio");
    // Save our audioElements as an array (so we can manipulate the DOM but
    // still access our items).
    return [...audioElements].map((node, i) => ({ ...node, key: i }));
};

// Build an array of classes to add to each new "player" element
export const prepareClasses = (
    index: number,
    classes: string,
    theme: string
) => {
    const classesString = `picobel loading picobel--index-${index} ${classes}`;
    const classesArray = classesString.trim().split(" ");
    return [...classesArray, theme];
};

// Get the url for each audio file we want to load [using elements found by findAudio()]
export const getRawData = (nodes: AudioElement[]) =>
    nodes.map((node, key) => {
        node.key = key;
        node.mute = false;
        node.tmpVolume = 1;
        return node;
    });

// Get info about the audio track
export const getMeta = (item: AudioElement): Meta => {
    const url = item.currentSrc;
    const fileType = getFileType(url);
    const fileName = getFileName(url);
    const title =
        item.title && item.title !== ""
            ? item.title
            : `${fileName}.${fileType}`;
    const artist = item.dataset?.artist ? item.dataset.artist : false;
    return { url, fileType, fileName, title, artist };
};

export const checkURL = async (url: string): Promise<boolean | null> => {
    try {
        const response = await fetch(url);
        console.log({ url, response });
        return response.ok; // URL is valid and reachable
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown error");
        }
        // Handle the error accordingly (e.g., set an error state or use a fallback URL)
        return null; // Indicate failure
    }
};

export const pollForLoadingStatus = async (
    node: AudioElement,
    intervalState: Record<string, NodeJS.Timeout>
) => {
    const interval = 1000; // Poll every 1000 milliseconds (1 second)
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
                // If fully buffered, clear the interval
                clearInterval(intervalState[node.currentSrc]);
            }
        }
        if (checks >= maxChecks) {
            if (node.buffered.length <= 0 && node.readyState <= 0) {
                errors(node);
            }
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
