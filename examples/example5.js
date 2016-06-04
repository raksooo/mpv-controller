const mpv = require('./../mpv');

let player = new mpv(data => {
    console.log('decreaseVolume()')
    player.decreaseVolume();
    player.mute();
});
player.limitStatusMessages(100);
player.play('https://www.youtube.com/watch?v=0iZ_GPUjqS0');

