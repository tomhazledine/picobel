import { PicobelMarkup } from '../esm/new.js';

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

describe('Markup helpers', () => {
    it('can create a slider', () => {
        const NAMESPACE = 'progress';
        const MIN = 0;
        const MAX = 100;
        const VALUE = 50;

        let slider = PicobelMarkup.buildSlider(NAMESPACE, MIN, MAX, VALUE);
        expect(slider.localName).toEqual('div');
        expect(slider.classList).toContain(`${NAMESPACE}-slider__wrapper`);
        expect(slider.children.length).toEqual(4);
        expect(slider.children[3].localName).toEqual('input');
        expect(slider.children[3].min).toEqual(MIN.toString());
        expect(slider.children[3].max).toEqual(MAX.toString());
        expect(slider.children[3].value).toEqual(VALUE.toString());
    });

    it('can create new elements', () => {
        // Works without second arg
        let elementNoClass = PicobelMarkup.createElement('div');
        expect(elementNoClass.localName).toEqual('div');
        // Creates a span
        let elementSpan = PicobelMarkup.createElement('span', 'songVolumeValue');
        expect(elementSpan.localName).toEqual('span');
        expect(elementSpan.classList).toContain('songVolumeValue');
        // Creates a div
        let elementDiv = PicobelMarkup.createElement('div', 'test');
        expect(elementDiv.localName).toEqual('div');
        expect(elementDiv.classList).toContain('test');
        // Creates a button
        let elementButton = PicobelMarkup.createElement('button', 'testing');
        expect(elementButton.localName).toEqual('button');
        expect(elementButton.classList).toContain('testing');
        // Creates an input
        let elementInput = PicobelMarkup.createElement('input', 'something');
        expect(elementInput.localName).toEqual('input');
        expect(elementInput.classList).toContain('something');
    });
});

describe('markup generation', () => {
    // Create some test nodes to trigger markup generation.
    const TEST_NODES = [
        {
            key: 0,
            preload: 'metadata',
            url: 'http://audio.eatenbymonsters.com/reviews/daughter/human.mp3',
            className: 'customPlayer'
        },
        {
            key: 1,
            preload: 'metadata',
            url: 'http://audio.eatenbymonsters.com/reviews/coldWarKids/lostThatEasy.mp3',
            className: ''
        }
    ];

    it('generates a div for each audio element', () => {
        // With three arbitrary array entries.
        let markup = PicobelMarkup.generateMarkup(
            [...TEST_NODES, ...TEST_NODES],
            EXPECTED_COMPONENTS
        );
        expect(markup.length).toEqual(4);
        expect(markup[0].localName).toEqual('div');

        // With two arbitrary array entries.
        markup = PicobelMarkup.generateMarkup(['test', 'test'], EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual('div');

        // With our test nodes.
        markup = PicobelMarkup.generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);
        expect(markup.length).toEqual(2);
        expect(markup[1].localName).toEqual('div');
    });

    it('adds the correct data attribute to each audio element', () => {
        const markup = PicobelMarkup.generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);
        expect(markup[0].getAttribute('data-song-index')).toEqual('0');
        expect(markup[1].getAttribute('data-song-index')).toEqual('1');
    });

    it('adds a loading indicator each audio element', () => {
        const markup = PicobelMarkup.generateMarkup(TEST_NODES, EXPECTED_COMPONENTS);

        let firstIndicator = markup[0].getElementsByClassName('loader');
        expect(firstIndicator.length).toEqual(1);
        expect(firstIndicator[0].classList).toContain('loader');

        let secondIndicator = markup[1].getElementsByTagName('div');
        expect(secondIndicator.length).toBeTruthy();
        expect(secondIndicator[0].classList).toContain('loader');
    });
});
