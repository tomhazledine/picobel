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
    // Setup test DOM:
    document.body.innerHTML = testDOM;
    let nodes = Picobel().findAudio();
    expect(nodes.length).toEqual(2);
});
