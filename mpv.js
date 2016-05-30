const cp = require('child_process');

const keys = {
    pause: 'p',
    stop: 'q',
    status: 'o',
    seekBackward: 'Left',
    seekForward: 'Right',
    bigSeekBackward: 'Down',
    bigSeekForward: 'Up'
};

const pausedStrings = [
    "(Paused)",
    "(Buffering)"
];

class mpv {
    constructor(listener) {
        this.dataHandler = new DataHandler(listener);
    }

    set listener(listener) {
        this.dataHandler.setListener(listener);
    }

    limitStatusMessages(mod) {
        this.dataHandler.limit(mod);
    }

    play(first, second, third) {
        let flags = [];
        if (Array.isArray(first)) {
            flags = flags.concat(first);
        } else {
            flags.push(first);
            if (Array.isArray(second)) {
                flags = flags.concat(second);
            } else {
                flags.push('--sub="' + second + '"');
                if (Array.isArray(third)) {
                    flags = flags.concat(third);
                }
            }
        }
        this.player = cp.spawn('mpv', flags);
        this.preparePlayer();
    }

    preparePlayer() {
        this.player.stdin.setEncoding('utf8');
        this.player.stderr.setEncoding('utf8');
        this.player.stderr.on('data',
                this.dataHandler.handleData.bind(this.dataHandler));
        this.player.stderr.on('close', () => {
            this.dataHandler.closed();
            this.player == null;
        });
    }

    // Should be done with this.player.stdin.write(key) which I can't manage to
    // get working.
    sendKey(key) {
        if (this.player) {
            cp.exec('xdotool search --name " - mpv"', (_, result) => {
                result = result.trim();
                cp.exec('xdotool key --window ' + result + ' ' + key);
            });
        }
    }

    // This force kills mpv.
    kill() {
        cp.exec('killall -9 mpv');
    }


    pause() {
        this.sendKey(keys.pause);
    }

    stop() {
        this.sendKey(keys.stop);
    }

    seekBackward() {
        this.sendKey(keys.seekBackward);
    }

    seekForward() {
        this.sendKey(keys.seekForward);
    }

    bigSeekBackward() {
        this.sendKey(keys.bigSeekBackward);
    }

    bigSeekForward() {
        this.sendKey(keys.bigSeekForward);
    }

    displayStatus() {
        this.sendKey(keys.status);
    }
}

class DataHandler {
    constructor(listener) {
        this.listener = listener;
        this.statusLimit = 1;
        this.statusCounter = 0;
        this.open = false;
    }

    setListener(listener) {
        this.listener = listener;
    }

    limit(mod) {
        this.statusLimit = mod < 1 ? 1 : mod;
    }

    handleData(data) {
        this.open = true;
        if (typeof this.listener !== 'undefined'
                && this.statusCounter++ % this.statusLimit === 0) {
            let status = this.parseData(data.toString());
            this.listener(status);
        }
    }

    closed() {
        if (typeof this.listener !== 'undefined' && this.open) {
            this.open = false;
            this.listener({
                exit: true
            });
        }
    }

    parseData(data) {
        let parts = data.split(' ');

        let playing = pausedStrings.indexOf(parts[0]) === -1;
        let buffering = parts[0] === pausedStrings[1];
        if (!playing) {
            parts.shift();
        }

        let percentage = parts[4].replace(/\(|\)|%/g, '')
        let status = {
            playing: playing,
            buffering: buffering,
            elapsed: this.parseTime(parts[1]),
            total: this.parseTime(parts[3]),
            elapsedStr: parts[1],
            totalStr: parts[3],
            progress: percentage / 100
        }

        return status;
    }

    parseTime(time) {
        var arr = time.split(':');
        var seconds = (+arr[0]) * 60 * 60 + (+arr[1]) * 60 + (+arr[2]);
        return seconds;
    }
}

module.exports = mpv;

