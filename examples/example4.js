const mpv = require('./../mpv');

let player = new mpv(data => {
    if (data.exit) {
        player.listener = undefined;
        player.play('https://www.youtube.com/watch?v=0iZ_GPUjqS0');
    }
});
player.play("https://www.youtube.com/watch?v=rOOdfugvsIY");

