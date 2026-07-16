import * as PicobelAudio from "./audio-functions";
import { type AudioElement } from "./data";

// One AbortController per player. Registering every listener with the
// controller's signal lets a single abort() detach them all — no need to
// keep a reference to each handler. A WeakMap ties the controller to the
// node without preventing the node from being garbage-collected.
const listenerControllers = new WeakMap<AudioElement, AbortController>();

export const removeLocalListeners = (node: AudioElement) => {
    listenerControllers.get(node)?.abort();
    listenerControllers.delete(node);
};

export const _setupLocalListeners = (nodes: AudioElement[]) => {
    return nodes.map(node => {
        const controller = new AbortController();
        listenerControllers.set(node, controller);
        const { signal } = controller;

        // Audio event listeners
        node.addEventListener(
            "progress",
            () => PicobelAudio.handleBuffering(node),
            { signal }
        );
        node.addEventListener(
            "timeupdate",
            PicobelAudio.triggerUpdateProgress,
            { signal }
        );
        node.addEventListener(
            "canplaythrough",
            () => PicobelAudio.canplaythrough(node),
            { signal }
        );
        node.addEventListener(
            "loadedmetadata",
            () => PicobelAudio.loadedmetadata(node),
            { signal }
        );
        node.addEventListener("error", () => PicobelAudio.errors(node), {
            signal
        });

        // DOM interaction event listeners
        node.elements?.playPauseButton?.addEventListener(
            "click",
            () => PicobelAudio.playPauseAudio(node, nodes),
            { signal }
        );
        node.elements?.progressRange?.addEventListener(
            "input",
            e => PicobelAudio.sliderScrub(e, node),
            { signal }
        );
        node.elements?.progressRange?.addEventListener(
            "focus",
            () => PicobelAudio.sliderFocus(node, true),
            { signal }
        );
        node.elements?.progressRange?.addEventListener(
            "blur",
            () => PicobelAudio.sliderFocus(node, false),
            { signal }
        );
        node.elements?.volumeControl?.addEventListener(
            "input",
            e => PicobelAudio.volume(e, node),
            { signal }
        );
        node.elements?.volumeControl?.addEventListener(
            "focus",
            () => PicobelAudio.volumeFocus(node, true),
            { signal }
        );
        node.elements?.volumeControl?.addEventListener(
            "blur",
            () => PicobelAudio.volumeFocus(node, false),
            { signal }
        );
        node.elements?.muteButton?.addEventListener(
            "click",
            () => PicobelAudio.muteUnmuteAudio(node),
            { signal }
        );
        return node;
    });
};
