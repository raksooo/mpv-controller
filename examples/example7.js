const mpv = require('./../mpv');

let player = new mpv();
player.play(["https://www.youtube.com/watch?v=rOOdfugvsIY", "--hwdec=no" , "--ytdl-format=best"]);

setTimeout(() => {
    player.kill();
}, 15000);

