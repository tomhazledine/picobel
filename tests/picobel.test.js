import Picobel from '../esm/new';

const testDOM = `
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

it('sets the correct theme option', () => {
    expect(Picobel().state.theme).toEqual('default');
    expect(Picobel({ theme: 'bbc' }).state.theme).toEqual('bbc');
});

it('finds the audio nodes', () => {
    // With test DOM:
    document.body.innerHTML = testDOM;
    let nodes = Picobel().findAudio();
    expect(nodes.length).toEqual(2);
    // With empty DOM:
    document.body.innerHTML = '';
    nodes = Picobel().findAudio();
    expect(nodes.length).toEqual(0);
});

it('correctly sets component state', () => {
    const expectedComponents = {
        theme: 'default',
        playPause: false,
        progress: true,
        volume: true,
        download: false,
        mute: true,
        duration: true,
        timer: true
    };
    const startingOptions = { components: { playPause: false } };
    let picobel = Picobel(startingOptions);
    // Does it work when called as part of the whole app?
    expect(picobel.state.components).toEqual(expectedComponents);
    // Does it work when called directly?
    let components = picobel.setComponentsByTheme('default', startingOptions.components);
    expect(components).toEqual(expectedComponents);
});

it('generates a div for each audio element', () => {
    const expectedComponents = {
        theme: 'default',
        playPause: false,
        progress: true,
        volume: true,
        download: false,
        mute: true,
        duration: true,
        timer: true
    };
    const markup = Picobel().generateMarkup(['test', 'test', 'test'], expectedComponents);
    expect(markup.length).toEqual(3);
    expect(markup[0].localName).toEqual('div');
});

it('creates an array of class names', () => {
    let classList = Picobel().prepareClasses(0, 'some classes', 'themeName');

    expect(Array.isArray(classList)).toEqual(true);
    expect(classList.length).toEqual(6);
    expect(classList[0]).toEqual('customAudioPlayer');
    expect(classList[1]).toEqual('loading');
    expect(classList[2]).toEqual('player_0');
    expect(classList[3]).toEqual('some');
    expect(classList[4]).toEqual('classes');
    expect(classList[5]).toEqual('themeName');

    classList = Picobel().prepareClasses(2, '', 'something');
    expect(Array.isArray(classList)).toEqual(true);
    expect(classList.length).toEqual(4);
    expect(classList[0]).toEqual('customAudioPlayer');
    expect(classList[1]).toEqual('loading');
    expect(classList[2]).toEqual('player_2');
    expect(classList[3]).toEqual('something');
});
