# mpv-controller
Node module which controls mpv media player written in ES6.

npm: https://www.npmjs.com/package/mpv-controller

## Installation
```sh
npm install mpv-controller
```

## Usage
### Example
```Javascript
const mpv = require('mpv');

var player = new mpv((status) => {
    console.log(status);
});
player.limitStatusMessages(5);

player.play("/path/to/video.mkv");

setTimeout(player.pause.bind(player), 5000); // Pauses after 5 seconds
```

### Creating an instance
```Javascript
var player =  new mpv(statusListener);
```
where statusListener will receive an object containing playback status on the
form
```Javascript
{
    playing: boolean,
    buffering: boolean,
    elapsed: "00:04:42",
    total: "00:07:01",
    progress: 0.6698
}
```

### Play a video
```Javascript
player.play("/path/to/video.mkv");
```

### Pause/resume
```Javascript
player.pause();
```

### Other commands
```Javascript
player.stop();
player.seekForward(); // Seek 5 seconds forwards
player.seekBackward(); // Seek 5 seconds backwards
player.bigSeekForward(); // Seek 30 seconds forwards
player.bigSeekBackward(); // Seek 30 secons Backwards
player.displayStatus(); // Displays status hud
```

### Limit the amount of statusmessages
Will show every *mod* update returned by mpv. mod = 5 will show every fifth
update.
```Javascript
player.limitStatusMessages(mod);
```

### Sending flags to mpv
```Javascript
player.play(["/path/to/video.mkv", "--hwdec=no", "--ytdl-format=best"]);
```

## Dependencies
* mpv

## TODO
* Implement more commands
* Fix sendKey(key) [#1](/../../issues/1)

## Contact
* http://oskarnyberg.com
* oskar@oskarnyberg.com

## Licence
MIT: https://opensource.org/licenses/MIT

