import Picobel from '../esm/new';

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

/**
 * -----------------------------------------------------------------------------
 * SETUP
 * -----------------------------------------------------------------------------
 */
describe('setup', () => {
    it('sets the correct theme option', () => {
        expect(Picobel().state.theme).toEqual('default');
        expect(Picobel({ theme: 'bbc' }).state.theme).toEqual('bbc');
    });

    it('finds the audio nodes', () => {
        // With test DOM:
        document.body.innerHTML = TEST_DOM;
        let nodes = Picobel().findAudio();
        expect(nodes.length).toEqual(2);
        // With empty DOM:
        document.body.innerHTML = '';
        nodes = Picobel().findAudio();
        expect(nodes.length).toEqual(0);
    });

    it('correctly sets component state', () => {
        const startingOptions = { components: { playPause: false } };
        let picobel = Picobel(startingOptions);
        // Does it work when called as part of the whole app?
        expect(picobel.state.components).toEqual(EXPECTED_COMPONENTS);
        // Does it work when called directly?
        let components = picobel.setComponentsByTheme('default', startingOptions.components);
        expect(components).toEqual(EXPECTED_COMPONENTS);
    });
});

/**
 * -----------------------------------------------------------------------------
 * MARKUP GENERATION
 * -----------------------------------------------------------------------------
 */
describe('markup generation', () => {
    // Create some test nodes to trigger markup generation.
    document.body.innerHTML = TEST_DOM;
    let audioElements = document.getElementsByTagName('audio');
    const TEST_NODES = [].slice.call(audioElements);

    it('generates a div for each audio element', () => {
        // With three arbitrary array entries.
        let markup = Picobel().generateMarkup(['test', 'test', 'test'], EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(3);
        expect(markup[0].localName).toEqual('div');

        // With two arbitrary array entries.
        markup = Picobel().generateMarkup(['test', 'test'], EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual('div');

        // With our test nodes.
        markup = Picobel().generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual('div');
    });

    it('creates an array of class names', () => {
        let classList = Picobel().prepareClasses(0, 'some classes', 'themeName');

        expect(Array.isArray(classList)).toEqual(true);
        expect(classList.length).toEqual(6);
        expect(classList).toContain('customAudioPlayer');
        expect(classList).toContain('loading');
        expect(classList).toContain('player_0');
        expect(classList).toContain('some');
        expect(classList).toContain('classes');
        expect(classList).toContain('themeName');

        classList = Picobel().prepareClasses(2, '', 'something');
        expect(Array.isArray(classList)).toEqual(true);
        expect(classList.length).toEqual(4);
        expect(classList).toContain('customAudioPlayer');
        expect(classList).toContain('loading');
        expect(classList).toContain('player_2');
        expect(classList).toContain('something');
    });

    it('adds the correct data attribute to each audio element', () => {
        const markup = Picobel().generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);
        expect(markup[0].getAttribute('data-song-index')).toEqual('0');
        expect(markup[1].getAttribute('data-song-index')).toEqual('1');
    });

    it('adds a loading indicator each audio element', () => {
        const markup = Picobel().generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);

        let firstIndicator = markup[0].getElementsByTagName('div');
        expect(firstIndicator.length).toEqual(1);
        expect(firstIndicator[0].classList).toContain('loader');

        let secondIndicator = markup[1].getElementsByTagName('div');
        expect(secondIndicator.length).toEqual(1);
        expect(secondIndicator[0].classList).toContain('loader');
    });
});
