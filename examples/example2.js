const mpv = require('./../mpv');

let player = new mpv();
player.play("https://www.youtube.com/watch?v=rOOdfugvsIY", "examples/subtitle.srt");

