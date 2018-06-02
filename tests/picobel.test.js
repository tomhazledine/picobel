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
    let components = picobel.setComponentsByTheme(null, startingOptions.components);
    expect(components).toEqual(expectedComponents);
});
