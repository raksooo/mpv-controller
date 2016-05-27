(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cp = require('child_process');

var keys = {
    pause: 'p',
    stop: 'q',
    status: 'o',
    seekBackward: 'Left',
    seekForward: 'Right',
    bigSeekBackward: 'Down',
    bigSeekForward: 'Up'
};

var pausedStrings = ["(Paused)", "(Buffering)"];

var mpv = function () {
    function mpv(statusListener) {
        _classCallCheck(this, mpv);

        this.statusListener = statusListener;
        this.statusLimit = 0;
        this.statusCounter = 0;
    }

    _createClass(mpv, [{
        key: 'limitStatusMessages',
        value: function limitStatusMessages(mod) {
            this.statusLimit = mod;
        }
    }, {
        key: 'play',
        value: function play(flags) {
            this.player = cp.spawn('mpv', flags);
            this.player.stderr.on('data', this.handleData.bind(this));
        }
    }, {
        key: 'handleData',
        value: function handleData(data) {
            if (typeof this.statusListener !== 'undefined' && this.statusCounter++ % this.statusLimit === 0) {
                var status = this.parseData(data.toString());
                this.statusListener(status);
            }
        }
    }, {
        key: 'parseData',
        value: function parseData(data) {
            var parts = data.split(' ');

            var playing = pausedStrings.indexOf(parts[0]) === -1;
            var buffering = parts[0] === pausedStrings[1];
            if (!playing) {
                parts.shift();
            }

            var percentage = parts[4].replace(/\(|\)|%/g, '');
            var status = {
                playing: playing,
                buffering: buffering,
                elapsed: parts[1],
                total: parts[3],
                progress: percentage / 100
            };

            return status;
        }

        // Should be done with this.player.stdin.write(key) which I can't manage to
        // get working.

    }, {
        key: 'sendKey',
        value: function sendKey(key) {
            cp.exec('xdotool search --name mpv | tail -1', function (_, result) {
                result = result.trim();
                cp.exec('xdotool key --window ' + result + ' ' + key);
            });
        }

        // -- The functions below sends commands to mpv ---------------------------

    }, {
        key: 'pause',
        value: function pause() {
            this.sendKey(keys.pause);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.sendKey(keys.stop);
        }
    }, {
        key: 'seekBackward',
        value: function seekBackward() {
            this.sendKey(keys.seekBackward);
        }
    }, {
        key: 'seekForward',
        value: function seekForward() {
            this.sendKey(keys.seekForward);
        }
    }, {
        key: 'bigSeekBackward',
        value: function bigSeekBackward() {
            this.sendKey(keys.bigSeekBackward);
        }
    }, {
        key: 'bigSeekForward',
        value: function bigSeekForward() {
            this.sendKey(keys.bigSeekForward);
        }
    }, {
        key: 'displayStatus',
        value: function displayStatus() {
            this.sendKey(keys.status);
        }
    }]);

    return mpv;
}();

exports.mpv = mpv;

},{"child_process":2}],2:[function(require,module,exports){

},{}]},{},[1]);
