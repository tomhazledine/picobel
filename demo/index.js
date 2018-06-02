import Picobel from '../esm/new';
// import 'picobel/css/player.default.css';

console.log('file loaded');
let picobel_instance = Picobel({ theme: 'bbc' });

let nodes = picobel_instance.findAudio(document);
console.log(nodes);
console.log(picobel_instance.state);
