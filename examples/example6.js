const mpv = require('./../mpv');

let started = false;

let player = new mpv(status => {
    if (!started) {
        player.addSubtitle("subtitle.srt");
        started = true;
    }
});

player.limitStatusMessages(10);
player.play(["https://www.youtube.com/watch?v=rOOdfugvsIY", "--hwdec=no" , "--ytdl-format=best"]);
