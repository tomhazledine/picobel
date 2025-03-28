import { getFileName, getFileType } from "../utils/helpers";

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

    const audioElementsArrayWithKeys = [...audioElements].map(
        // don't spread the node, just assign the key
        (node, i) => Object.assign(node, { key: i }) as AudioElement
    );
    
    return audioElementsArrayWithKeys;
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