const mpv = require('./../mpv');

let state = 0;

let player = new mpv(status => {
    if (state === 0) {
    } else if (status.playing && state === 1) {
        player.pause();
        console.log('Pausing');
    } else if (!status.playing && state === 2) {
        player.bigSeekForward();
        console.log('Seeking forward');
    } else if (!status.playing && state === 3) {
        player.pause();
        console.log('Resuming');
    } else if (status.playing && state === 4) {
        player.pause();
        console.log('Pausing');
    } else if (!status.playing && state === 5) {
        player.stop();
        console.log('Quitting');
    } else {
        console.error('Failed.')
    }
    state++;
});

player.limitStatusMessages(100);
player.play(["https://www.youtube.com/watch?v=rOOdfugvsIY", "--hwdec=no"
        , "--ytdl-format=best"]);

