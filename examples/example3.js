const mpv = require('./../mpv');

let player = new mpv(console.log.bind(console));
player.limitStatusMessages(40);
player.play("https://www.youtube.com/watch?v=rOOdfugvsIY");

