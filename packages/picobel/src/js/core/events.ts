import * as PicobelAudio from "./audio-functions";
import { type AudioElement } from "./data";

export const _setupLocalListeners = (nodes: AudioElement[]) => {
    return nodes.map(node => {
        // Audio event listeners
        node.addEventListener(
            "progress",
            () => PicobelAudio.handleBuffering(node),
            false
        );
        node.addEventListener(
            "timeupdate",
            PicobelAudio.triggerUpdateProgress,
            false
        );
        node.addEventListener(
            "canplaythrough",
            () => PicobelAudio.canplaythrough(node),
            false
        );
        node.addEventListener(
            "loadedmetadata",
            () => PicobelAudio.loadedmetadata(node),
            false
        );
        node.addEventListener("error", () => PicobelAudio.errors(node), false);

        // DOM interaction event listeners
        if (node.elements?.playPauseButton) {
            node.elements?.playPauseButton.addEventListener(
                "click",
                () => PicobelAudio.playPauseAudio(node, nodes),
                false
            );
        }
        if (node.elements?.progressRange) {
            node.elements?.progressRange.addEventListener(
                "input",
                e => PicobelAudio.sliderScrub(e, node),
                false
            );
        }
        if (node.elements?.progressRange) {
            node.elements?.progressRange.addEventListener(
                "focus",
                () => PicobelAudio.sliderFocus(node, true),
                false
            );
        }
        if (node.elements?.progressRange) {
            node.elements?.progressRange.addEventListener(
                "blur",
                () => PicobelAudio.sliderFocus(node, false),
                false
            );
        }
        if (node.elements?.volumeControl) {
            node.elements?.volumeControl.addEventListener(
                "input",
                e => PicobelAudio.volume(e, node),
                false
            );
        }
        if (node.elements?.volumeControl) {
            node.elements?.volumeControl.addEventListener(
                "focus",
                () => PicobelAudio.volumeFocus(node, true),
                false
            );
        }
        if (node.elements?.volumeControl) {
            node.elements?.volumeControl.addEventListener(
                "blur",
                () => PicobelAudio.volumeFocus(node, false),
                false
            );
        }
        if (node.elements?.muteButton) {
            node.elements?.muteButton.addEventListener(
                "click",
                () => PicobelAudio.muteUnmuteAudio(node),
                false
            );
        }
        return node;
    });
};
