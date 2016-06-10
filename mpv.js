const cp = require('child_process'),
      FIFO = require('fifo-js');

const commands = {
    togglePause: 'cycle pause',
    stop: 'stop',
    status: 'show-progress',
    seekBackward: 'seek -5',
    seekForward: 'seek +5',
    bigSeekBackward: 'seek -30',
    bigSeekForward: 'seek +30',
    increaseSpeed: 'multiply speed 1.1',
    decreaseSpeed: 'multiply speed 0.9',
    resetSpeed: 'set speed 1',
    decreaseVolume: 'add volume -5',
    increaseVolume: 'add volume 5',
    mute: 'cycle mute',
    toggleFullscreen: 'cycle fullscreen',
    toggleSubtitle: 'cycle sub'
};

const pausedStrings = [
    "(Paused)",
    "(Buffering)"
];

class mpv {
    constructor(listener) {
        this.dataHandler = new DataHandler(listener);

        this.registerControlFunctions();
    }

    registerControlFunctions() {
        for (let commandName in commands) {
            let command = commands[commandName];
            this[commandName] = this.sendCommand.bind(this, command);
        }
    }

    setListener(listener) {
        this.dataHandler.setListener(listener);
    }

    removeListener() {
        this.dataHandler.setListener();
    }

    limitStatusMessages(mod) {
        this.dataHandler.limit(mod);
    }

    play(first, second, third) {
        this.fifo = new FIFO();
        let flags = ["--input-file=" + this.fifo.path];
        if (Array.isArray(first)) {
            flags = flags.concat(first);
        } else {
            flags.push(first);
            if (Array.isArray(second)) {
                flags = flags.concat(second);
            } else {
                flags.push('--sub-file="' + second + '"');
                if (Array.isArray(third)) {
                    flags = flags.concat(third);
                }
            }
        }
        this.startMpv(flags);
    }

    startMpv(flags) {
        this.player = cp.spawn('mpv', flags);

        this.player.stdin.setEncoding('utf8');
        this.player.stderr.setEncoding('utf8');
        this.player.stderr.on('data',
                this.dataHandler.handleData.bind(this.dataHandler));
        this.player.stderr.on('close', () => {
            this.fifo.close();
            this.dataHandler.closed();
            this.player == null;
        });
    }

    sendCommand(command) {
        if (this.player) {
            this.fifo.write(command)
        }
    }

    kill() {
        cp.exec('killall -9 mpv');
        this.fifo.close();
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

