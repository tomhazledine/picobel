import Picobel from '../esm/new';
// import 'picobel/css/player.default.css';

console.log('file loaded');
let picobel_instance = Picobel({ theme: 'bbc' });

// console.log(picobel_instance.testing());
let nodes = picobel_instance.findAudio(document);
console.log(nodes);
