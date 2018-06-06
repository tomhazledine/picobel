import Picobel, { PicobelSetup, PicobelData, PicobelMarkup } from '../esm/new';

const TEST_DOM = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Picobel.js Test Page</title>
    </head>
    <body>
        <audio class="customPlayer" src="http://audio.eatenbymonsters.com/reviews/daughter/human.mp3" title="Human" data-artist="Daughter" controls>
            Your browser does not support the <code>audio</code> element.
        </audio>
        <audio class="customPlayer" src="http://audio.eatenbymonsters.com/reviews/coldWarKids/lostThatEasy.mp3" title="Lost That Easy" data-artist="Cold War Kids" controls>
            Your browser does not support the <code>audio</code> element.
        </audio>
    </body>
    </html>
`;

const EXPECTED_COMPONENTS = {
    theme: 'default',
    playPause: false,
    progress: true,
    volume: true,
    download: false,
    mute: true,
    duration: true,
    timer: true
};

describe('setup', () => {
    it('sets the correct theme option', () => {
        expect(PicobelSetup.parseOptions().theme).toEqual('default');
        expect(PicobelSetup.parseOptions({ theme: 'bbc' }).theme).toEqual('bbc');
    });

    it('correctly sets component state', () => {
        const startingOptions = { components: { playPause: false } };
        let picobel = Picobel(startingOptions);
        // Does it work when called as part of the whole app?
        expect(picobel.state.components).toEqual(EXPECTED_COMPONENTS);
        // Does it work when called directly?
        let components = PicobelSetup.setComponentsByTheme('default', startingOptions.components);
        expect(components).toEqual(EXPECTED_COMPONENTS);
    });
});

describe('data handling', () => {
    it('finds the audio nodes', () => {
        // With test DOM:
        document.body.innerHTML = TEST_DOM;
        let nodes = PicobelData.findAudio();
        expect(nodes.length).toEqual(2);
        // With empty DOM:
        document.body.innerHTML = '';
        nodes = PicobelData.findAudio();
        expect(nodes.length).toEqual(0);
    });

    it('creates an array of class names', () => {
        let classList = PicobelData.prepareClasses(0, 'some classes', 'themeName');

        expect(Array.isArray(classList)).toEqual(true);
        expect(classList.length).toEqual(6);
        expect(classList).toContain('customAudioPlayer');
        expect(classList).toContain('loading');
        expect(classList).toContain('player_0');
        expect(classList).toContain('some');
        expect(classList).toContain('classes');
        expect(classList).toContain('themeName');

        classList = PicobelData.prepareClasses(2, '', 'something');
        expect(Array.isArray(classList)).toEqual(true);
        expect(classList.length).toEqual(4);
        expect(classList).toContain('customAudioPlayer');
        expect(classList).toContain('loading');
        expect(classList).toContain('player_2');
        expect(classList).toContain('something');
    });
});
