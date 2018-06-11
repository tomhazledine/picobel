import _helpers from './helpers';
import PicobelMarkup from './PicobelMarkup';
import PicobelData from './PicobelData';

export const PicobelAudio = {
    pauseAll: () => {
        const paused = state.audioNodes.map(node => {
            PicobelAudio.pause(node);
        });
    },
    triggerPlayPauseAudio: event => {
        let index = _helpers.findParentIndex(event.srcElement);
        let node = state.audioNodes.find(node => node.key == index);
        PicobelAudio.playPauseAudio(node);
    },
    playPauseAudio: node => {
        if (node.paused || node.currentTime === 0) {
            PicobelAudio.pauseAll();
            PicobelAudio.play(node);
        } else {
            PicobelAudio.pause(node);
        }
    },
    play: node => {
        node.play();
        let button = node.elements.playPauseButton[0];
        button.classList.remove('songPaused');
        button.classList.add('songPlaying');
    },
    pause: node => {
        node.pause();
        let button = node.elements.playPauseButton[0];
        button.classList.remove('songPlaying');
        button.classList.add('songPaused');
    },
    triggerUpdateProgress: event => PicobelAudio.updateProgress(event.srcElement),

    updateProgress: node => {
        let progress = node.currentTime;
        let duration = node.duration;
        let progressParsed = _helpers.parseTime(progress);
        node.elements.playTimer[0].innerHTML = progressParsed;
        if (progress >= duration) {
            node.elements.playPauseButton[0].classList.remove('songPlaying');
        }
        let progressPercent = (progress / duration * 100).toFixed(2);
        node.elements.progressBar[0].value = progressPercent;
        // console.log(node.elements.indicator);
        node.elements.indicator[0].style.width = progressPercent + '%';
        node.elements.playhead[0].style.left = progressPercent + '%';
    },
    loadStart: () => {
        // console.log('loadStart');
    },
    canplaythrough: function() {
        PicobelMarkup.setLengthDisplay(this);
        this.elements.wrapper.classList.remove('loading');
        let meta = PicobelData.getMeta(this);
        PicobelMarkup.setMeta(meta, this.elements);
    },
    errors: error => {
        // console.log(error);
    },
    stalled: () => {
        // console.log('stalled');
    },
    progress: () => {
        // console.log('progress');
    },
    sliderScrub: event => {
        let index = _helpers.findParentIndex(event.srcElement);
        let activeNode = state.audioNodes.find(node => node.key == index);
        let duration = activeNode.duration;
        let targetTime = duration * (event.srcElement.value / 100);
        targetTime = targetTime.toFixed(2);
        activeNode.currentTime = targetTime;
        PicobelAudio.updateProgress(activeNode);
    },
    volume: event => {
        let index = _helpers.findParentIndex(event.srcElement);
        let node = state.audioNodes.find(node => node.key == index);
        let volume = event.srcElement.value;
        PicobelAudio.mute(node, false);
        PicobelAudio.setVolume(node, volume);
    },
    setVolume: (node, value) => {
        let valueMapped = value * 10;
        let volumePercent = value * 100;
        node.volume = value;
        node.elements.volumeDisplay[0].innerHTML = valueMapped;
        node.elements.volumeControl[0].value = value;
        node.elements.volumeIndicator[0].style.width = volumePercent + '%';
        node.elements.volumePlayhead[0].style.left = volumePercent + '%';
    },
    muteUnmuteAudio: event => {
        let index = _helpers.findParentIndex(event.srcElement);
        let node = state.audioNodes.find(node => node.key == index);
        node.mute = !node.mute;
        PicobelAudio.mute(node, node.mute);
    },
    mute: (node, mute) => {
        // node.mute = !mute;
        let button = node.elements.muteButton[0];
        if (node.mute) {
            node.tmpVolume = node.volume;
            PicobelAudio.setVolume(node, 0);
            button.classList.add('songMuted');
            button.classList.remove('songUnmuted');
            button.innerHTML = 'unmute';
        } else {
            if (typeof node.tmpVolume != 'undefined' && node.tmpVolume > 0) {
                PicobelAudio.setVolume(node, node.tmpVolume);
            } else {
                PicobelAudio.setVolume(node, 1);
            }
            button.classList.remove('songMuted');
            button.classList.add('songUnmuted');
            button.innerHTML = 'mute';
        }
    }
};

export default PicobelAudio;
