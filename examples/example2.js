const mpv = require('./../mpv');
const cp = require('child_process');

let player = new mpv();
player.play("https://www.youtube.com/watch?v=rOOdfugvsIY", "examples/subtitle.srt");

