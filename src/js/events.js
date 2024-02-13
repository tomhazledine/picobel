import * as PicobelAudio from "./audio-functions";

export const _setupLocalListeners = nodes =>
    nodes.map(node => {
        // Audio event listeners
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
        node.addEventListener("error", () => PicobelAudio.errors(node), false);

        // DOM interaction event listeners
        if (node.elements.playPauseButton) {
            node.elements.playPauseButton.addEventListener(
                "click",
                () => PicobelAudio.playPauseAudio(node, nodes),
                false
            );
        }
        if (node.elements.progressBar) {
            node.elements.progressBar.addEventListener(
                "input",
                e => PicobelAudio.sliderScrub(e, node),
                false
            );
        }
        if (node.elements.progressBar) {
            node.elements.progressBar.addEventListener(
                "focus",
                () => PicobelAudio.sliderFocus(node, true),
                false
            );
        }
        if (node.elements.progressBar) {
            node.elements.progressBar.addEventListener(
                "blur",
                () => PicobelAudio.sliderFocus(node, false),
                false
            );
        }
        if (node.elements.volumeControl) {
            node.elements.volumeControl.addEventListener(
                "input",
                e => PicobelAudio.volume(e, node),
                false
            );
        }
        if (node.elements.volumeControl) {
            node.elements.volumeControl.addEventListener(
                "focus",
                () => PicobelAudio.volumeFocus(node, true),
                false
            );
        }
        if (node.elements.volumeControl) {
            node.elements.volumeControl.addEventListener(
                "blur",
                () => PicobelAudio.volumeFocus(node, false),
                false
            );
        }
        if (node.elements.muteButton) {
            node.elements.muteButton.addEventListener(
                "click",
                () => PicobelAudio.muteUnmuteAudio(node),
                false
            );
        }
        return node;
    });
