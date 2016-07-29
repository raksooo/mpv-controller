const mpv = require('./../mpv');

let state = 0;

let player = new mpv(status => {
    if (state === 0) {
    } else if (status.playing && state === 1) {
        player.togglePause();
    } else if (!status.playing && state === 2) {
        player.bigSeekForward();
    } else if (!status.playing && state === 3) {
        player.togglePause();
    } else if (status.playing && state === 4) {
        player.togglePause();
    } else if (!status.playing && state === 5) {
        player.stop();
    } else if (status.exit && state === 6) {
        console.log('Success');
    } else {
        console.error('Failed');
        player.kill();
    }

    state++;
});

player.limitStatusMessages(10);
player.play(["https://www.youtube.com/watch?v=rOOdfugvsIY", "--hwdec=no" , "--ytdl-format=best"]);

