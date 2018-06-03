import helpers from '../esm/helpers.js';

describe('Utilities', () => {
    it('converts seconds into HH:MM:SS format', () => {
        // Round minutes.
        expect(helpers.parseTime(120)).toEqual('2:00');
        // Floating points
        expect(helpers.parseTime(211.670208)).toEqual('3:31');
        // zero-padding seconds < 10
        expect(helpers.parseTime(3424.025)).toEqual('57:04');
        // Durations longer than an hour
        expect(helpers.parseTime(3846)).toEqual('1:04:06');
    });

    it('gets the filetype from a url', () => {
        expect(
            helpers.getFileType('http://audio.eatenbymonsters.com/reviews/daughter/human.mp3')
        ).toEqual('mp3');
    });

    it('gets the file name from a url', () => {
        expect(
            helpers.getFileName('http://audio.eatenbymonsters.com/reviews/daughter/human.mp3')
        ).toEqual('human');
    });
});

describe('Markup helpers', () => {
    it('builds a slider', () => {
        const NAMESPACE = 'progress';
        const MIN = 0;
        const MAX = 100;
        const VALUE = 50;

        let slider = helpers.buildSlider(NAMESPACE, MIN, MAX, VALUE);
        expect(slider.localName).toEqual('div');
        expect(slider.classList).toContain(`${NAMESPACE}-slider__wrapper`);
        expect(slider.children.length).toEqual(4);
        expect(slider.children[3].localName).toEqual('input');
        expect(slider.children[3].min).toEqual(MIN.toString());
        expect(slider.children[3].max).toEqual(MAX.toString());
        expect(slider.children[3].value).toEqual(VALUE.toString());
    });
});
