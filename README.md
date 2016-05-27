# mpv-controller
Node module which controls mpv media player.

## Usage
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

## TODO
Implement more commands  
Fix sendKey(key)

