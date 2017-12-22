const cp = require('child_process'),
      FIFO = require('fifo-js'),
      commands = require('./commands');

const pausedStrings = [
    "(Paused)",
    "(Buffering)"
];

const AV = "AV:";

class mpv {
    constructor(listener) {
        this.dataHandler = new DataHandler(listener);
        this.registerControlFunctions();
    }

    registerControlFunctions() {
        for (let name in commands) {
            let f = commands[name];
            this[name] = (...args) => this.sendCommand(f(...args));
        }
    }

    setListener(listener) {
        this.dataHandler.setListener(listener);
    }

    removeListener() {
        this.dataHandler.setListener();
    }

    limitStatusMessages(mod) {
        this.dataHandler.limit = mod;
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

        this.player.stderr.setEncoding('utf8');
        this.player.stderr.on('data',
                this.dataHandler.handleData.bind(this.dataHandler));
        this.player.stderr.on('close', this.closed.bind(this));
    }

    closed() {
        this.fifo.close();
        this.dataHandler.closed();
        this.player == null;
    }

    sendCommand(command) {
        if (this.player) {
            this.fifo.write(command)
        }
    }

    kill() {
        this.fifo.close();
        this.player.kill();
    }
}

class DataHandler {
    constructor(listener) {
        this.listener = listener;
        this._limit = 1;
        this.statusCounter = 0;
        this.lastStatus;
    }

    setListener(listener) {
        this.listener = listener;
    }

    set limit(mod) {
        this._limit = mod < 1 ? 1 : mod;
    }

    handleData(data) {
        let status = this.parseData(data.toString());
        if (status !== undefined && typeof this.listener !== 'undefined'
                && (this.statusCounter++ % this._limit === 0
                    || this.lastStatus !== status.playing)) {
            this.lastStatus = status.playing;
            this.listener(status);
        }
    }

    closed() {
        if (typeof this.listener !== 'undefined') {
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

        if (parts[0] === AV) {
          let percentage = typeof parts[4] === 'undefined' ? 0 : parts[4].replace(/\(|\)|%/g, '')
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
    }

    parseTime(time) {
        var arr = time.split(':');
        var seconds = (+arr[0]) * 60 * 60 + (+arr[1]) * 60 + (+arr[2]);
        return seconds;
    }
}

module.exports = mpv;
