function loadScript(e, t) {
    var i = document.createElement("script");
    i.type = "text/javascript",
        i.readyState ? i.onreadystatechange = function() {
            "loaded" != i.readyState && "complete" != i.readyState || (i.onreadystatechange = null,
                t())
        } : i.onload = function() {
            t()
        },
        i.src = e,
        document.getElementsByTagName("head")[0].appendChild(i)
}

function depthCompare(e, t) {
    if (void 0 == e.base || void 0 == t.base)
        return 0;
    if (e.base.y < t.base.y)
        return -1;
    if (e.base.y > t.base.y)
        return 1;
    if (e.base.y == t.base.y) {
        if (e.ordering < t.ordering)
            return -1;
        if (e.ordering > t.ordering)
            return 1
    }
    return 0
}

function sortCompare(e, t) {
    return e.ry < t.ry ? -1 : e.ry > t.ry ? 1 : 0
}

function vertCompare(e, t) {
    return e.y + e.height < t.y + t.height ? -1 : e.y + e.height > t.y + t.height ? 1 : 0
}

function zCompare(e, t) {
    return void 0 == e || void 0 == t ? 0 : e.z < t.z ? -1 : e.z > t.z ? 1 : 0
}! function() {
    "use strict";
    var e = function() {
        this.init()
    };
    e.prototype = {
        init: function() {
            var e = this || t;
            return e._counter = 1e3,
                e._codecs = {},
                e._howls = [],
                e._muted = !1,
                e._volume = 1,
                e._canPlayEvent = "canplaythrough",
                e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null,
                e.masterGain = null,
                e.noAudio = !1,
                e.usingWebAudio = !0,
                e.autoSuspend = !0,
                e.ctx = null,
                e.mobileAutoEnable = !0,
                e._setup(),
                e
        },
        volume: function(e) {
            var i = this || t;
            if (e = parseFloat(e),
            i.ctx || d(),
            void 0 !== e && e >= 0 && e <= 1) {
                if (i._volume = e,
                    i._muted)
                    return i;
                i.usingWebAudio && (i.masterGain.gain.value = e);
                for (var o = 0; o < i._howls.length; o++)
                    if (!i._howls[o]._webAudio)
                        for (var a = i._howls[o]._getSoundIds(), n = 0; n < a.length; n++) {
                            var r = i._howls[o]._soundById(a[n]);
                            r && r._node && (r._node.volume = r._volume * e)
                        }
                return i
            }
            return i._volume
        },
        mute: function(e) {
            var i = this || t;
            i.ctx || d(),
                i._muted = e,
            i.usingWebAudio && (i.masterGain.gain.value = e ? 0 : i._volume);
            for (var o = 0; o < i._howls.length; o++)
                if (!i._howls[o]._webAudio)
                    for (var a = i._howls[o]._getSoundIds(), n = 0; n < a.length; n++) {
                        var r = i._howls[o]._soundById(a[n]);
                        r && r._node && (r._node.muted = !!e || r._muted)
                    }
            return i
        },
        unload: function() {
            for (var e = this || t, i = e._howls.length - 1; i >= 0; i--)
                e._howls[i].unload();
            return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(),
                e.ctx = null,
                d()),
                e
        },
        codecs: function(e) {
            return (this || t)._codecs[e.replace(/^x-/, "")]
        },
        _setup: function() {
            var e = this || t;
            if (e.state = e.ctx ? e.ctx.state || "running" : "running",
                e._autoSuspend(), !e.usingWebAudio)
                if ("undefined" != typeof Audio)
                    try {
                        var i = new Audio;
                        void 0 === i.oncanplaythrough && (e._canPlayEvent = "canplay")
                    } catch (t) {
                        e.noAudio = !0
                    } else
                    e.noAudio = !0;
            try {
                var i = new Audio;
                i.muted && (e.noAudio = !0)
            } catch (e) {}
            return e.noAudio || e._setupCodecs(),
                e
        },
        _setupCodecs: function() {
            var e = this || t,
                i = null;
            try {
                i = "undefined" != typeof Audio ? new Audio : null
            } catch (t) {
                return e
            }
            if (!i || "function" != typeof i.canPlayType)
                return e;
            var o = i.canPlayType("audio/mpeg;").replace(/^no$/, ""),
                a = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
                n = a && parseInt(a[0].split("/")[1], 10) < 33;
            return e._codecs = {
                mp3: !(n || !o && !i.canPlayType("audio/mp3;").replace(/^no$/, "")),
                mpeg: !!o,
                opus: !!i.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!i.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                oga: !!i.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!i.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                aac: !!i.canPlayType("audio/aac;").replace(/^no$/, ""),
                caf: !!i.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                m4a: !!(i.canPlayType("audio/x-m4a;") || i.canPlayType("audio/m4a;") || i.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(i.canPlayType("audio/x-mp4;") || i.canPlayType("audio/mp4;") || i.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!i.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                webm: !!i.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                dolby: !!i.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                flac: !!(i.canPlayType("audio/x-flac;") || i.canPlayType("audio/flac;")).replace(/^no$/, "")
            },
                e
        },
        _enableMobileAudio: function() {
            var e = this || t,
                i = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator && e._navigator.userAgent),
                o = !!("ontouchend" in window || e._navigator && e._navigator.maxTouchPoints > 0 || e._navigator && e._navigator.msMaxTouchPoints > 0);
            if (!e._mobileEnabled && e.ctx && (i || o)) {
                e._mobileEnabled = !1,
                e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0,
                    e.unload()),
                    e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
                var a = function() {
                    t._autoResume();
                    var i = e.ctx.createBufferSource();
                    i.buffer = e._scratchBuffer,
                        i.connect(e.ctx.destination),
                        void 0 === i.start ? i.noteOn(0) : i.start(0),
                    "function" == typeof e.ctx.resume && e.ctx.resume(),
                        i.onended = function() {
                            i.disconnect(0),
                                e._mobileEnabled = !0,
                                e.mobileAutoEnable = !1,
                                document.removeEventListener("touchstart", a, !0),
                                document.removeEventListener("touchend", a, !0)
                        }
                };
                return document.addEventListener("touchstart", a, !0),
                    document.addEventListener("touchend", a, !0),
                    e
            }
        },
        _autoSuspend: function() {
            var e = this;
            if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && t.usingWebAudio) {
                for (var i = 0; i < e._howls.length; i++)
                    if (e._howls[i]._webAudio)
                        for (var o = 0; o < e._howls[i]._sounds.length; o++)
                            if (!e._howls[i]._sounds[o]._paused)
                                return e;
                return e._suspendTimer && clearTimeout(e._suspendTimer),
                    e._suspendTimer = setTimeout(function() {
                        e.autoSuspend && (e._suspendTimer = null,
                            e.state = "suspending",
                            e.ctx.suspend().then(function() {
                                e.state = "suspended",
                                e._resumeAfterSuspend && (delete e._resumeAfterSuspend,
                                    e._autoResume())
                            }))
                    }, 3e4),
                    e
            }
        },
        _autoResume: function() {
            var e = this;
            if (e.ctx && void 0 !== e.ctx.resume && t.usingWebAudio)
                return "running" === e.state && e._suspendTimer ? (clearTimeout(e._suspendTimer),
                    e._suspendTimer = null) : "suspended" === e.state ? (e.ctx.resume().then(function() {
                    e.state = "running";
                    for (var t = 0; t < e._howls.length; t++)
                        e._howls[t]._emit("resume")
                }),
                e._suspendTimer && (clearTimeout(e._suspendTimer),
                    e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0),
                    e
        }
    };
    var t = new e,
        i = function(e) {
            var t = this;
            return e.src && 0 !== e.src.length ? void t.init(e) : void console.error("An array of source files must be passed with any new Howl.")
        };
    i.prototype = {
        init: function(e) {
            var i = this;
            return t.ctx || d(),
                i._autoplay = e.autoplay || !1,
                i._format = "string" != typeof e.format ? e.format : [e.format],
                i._html5 = e.html5 || !1,
                i._muted = e.mute || !1,
                i._loop = e.loop || !1,
                i._pool = e.pool || 5,
                i._preload = "boolean" != typeof e.preload || e.preload,
                i._rate = e.rate || 1,
                i._sprite = e.sprite || {},
                i._src = "string" != typeof e.src ? e.src : [e.src],
                i._volume = void 0 !== e.volume ? e.volume : 1,
                i._xhrWithCredentials = e.xhrWithCredentials || !1,
                i._duration = 0,
                i._state = "unloaded",
                i._sounds = [],
                i._endTimers = {},
                i._queue = [],
                i._onend = e.onend ? [{
                    fn: e.onend
                }] : [],
                i._onfade = e.onfade ? [{
                    fn: e.onfade
                }] : [],
                i._onload = e.onload ? [{
                    fn: e.onload
                }] : [],
                i._onloaderror = e.onloaderror ? [{
                    fn: e.onloaderror
                }] : [],
                i._onplayerror = e.onplayerror ? [{
                    fn: e.onplayerror
                }] : [],
                i._onpause = e.onpause ? [{
                    fn: e.onpause
                }] : [],
                i._onplay = e.onplay ? [{
                    fn: e.onplay
                }] : [],
                i._onstop = e.onstop ? [{
                    fn: e.onstop
                }] : [],
                i._onmute = e.onmute ? [{
                    fn: e.onmute
                }] : [],
                i._onvolume = e.onvolume ? [{
                    fn: e.onvolume
                }] : [],
                i._onrate = e.onrate ? [{
                    fn: e.onrate
                }] : [],
                i._onseek = e.onseek ? [{
                    fn: e.onseek
                }] : [],
                i._onresume = [],
                i._webAudio = t.usingWebAudio && !i._html5,
            void 0 !== t.ctx && t.ctx && t.mobileAutoEnable && t._enableMobileAudio(),
                t._howls.push(i),
            i._autoplay && i._queue.push({
                event: "play",
                action: function() {
                    i.play()
                }
            }),
            i._preload && i.load(),
                i
        },
        load: function() {
            var e = this,
                i = null;
            if (t.noAudio)
                return void e._emit("loaderror", null, "No audio support.");
            "string" == typeof e._src && (e._src = [e._src]);
            for (var a = 0; a < e._src.length; a++) {
                var r, s;
                if (e._format && e._format[a])
                    r = e._format[a];
                else {
                    if ("string" != typeof(s = e._src[a])) {
                        e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                        continue
                    }
                    r = /^data:audio\/([^;,]+);/i.exec(s),
                    r || (r = /\.([^.]+)$/.exec(s.split("?", 1)[0])),
                    r && (r = r[1].toLowerCase())
                }
                if (r || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),
                r && t.codecs(r)) {
                    i = e._src[a];
                    break
                }
            }
            return i ? (e._src = i,
                e._state = "loading",
            "https:" === window.location.protocol && "http:" === i.slice(0, 5) && (e._html5 = !0,
                e._webAudio = !1),
                new o(e),
            e._webAudio && n(e),
                e) : void e._emit("loaderror", null, "No codec support for selected audio sources.")
        },
        play: function(e, i) {
            var o = this,
                a = null;
            if ("number" == typeof e)
                a = e,
                    e = null;
            else {
                if ("string" == typeof e && "loaded" === o._state && !o._sprite[e])
                    return null;
                if (void 0 === e) {
                    e = "__default";
                    for (var n = 0, r = 0; r < o._sounds.length; r++)
                        o._sounds[r]._paused && !o._sounds[r]._ended && (n++,
                            a = o._sounds[r]._id);
                    1 === n ? e = null : a = null
                }
            }
            var s = a ? o._soundById(a) : o._inactiveSound();
            if (!s)
                return null;
            if (a && !e && (e = s._sprite || "__default"),
            "loaded" !== o._state) {
                s._sprite = e,
                    s._ended = !1;
                var l = s._id;
                return o._queue.push({
                    event: "play",
                    action: function() {
                        o.play(l)
                    }
                }),
                    l
            }
            if (a && !s._paused)
                return i || setTimeout(function() {
                    o._emit("play", s._id)
                }, 0),
                    s._id;
            o._webAudio && t._autoResume();
            var d = Math.max(0, s._seek > 0 ? s._seek : o._sprite[e][0] / 1e3),
                c = Math.max(0, (o._sprite[e][0] + o._sprite[e][1]) / 1e3 - d),
                _ = 1e3 * c / Math.abs(s._rate);
            s._paused = !1,
                s._ended = !1,
                s._sprite = e,
                s._seek = d,
                s._start = o._sprite[e][0] / 1e3,
                s._stop = (o._sprite[e][0] + o._sprite[e][1]) / 1e3,
                s._loop = !(!s._loop && !o._sprite[e][2]);
            var p = s._node;
            if (o._webAudio) {
                var u = function() {
                    o._refreshBuffer(s);
                    var e = s._muted || o._muted ? 0 : s._volume;
                    p.gain.setValueAtTime(e, t.ctx.currentTime),
                        s._playStart = t.ctx.currentTime,
                        void 0 === p.bufferSource.start ? s._loop ? p.bufferSource.noteGrainOn(0, d, 86400) : p.bufferSource.noteGrainOn(0, d, c) : s._loop ? p.bufferSource.start(0, d, 86400) : p.bufferSource.start(0, d, c),
                    _ !== 1 / 0 && (o._endTimers[s._id] = setTimeout(o._ended.bind(o, s), _)),
                    i || setTimeout(function() {
                        o._emit("play", s._id)
                    }, 0)
                };
                "running" === t.state ? u() : (o.once("resume", u),
                    o._clearTimer(s._id))
            } else {
                var h = function() {
                        p.currentTime = d,
                            p.muted = s._muted || o._muted || t._muted || p.muted,
                            p.volume = s._volume * t.volume(),
                            p.playbackRate = s._rate;
                        try {
                            if (p.play(),
                                p.paused)
                                return void o._emit("playerror", s._id, "Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction.");
                            _ !== 1 / 0 && (o._endTimers[s._id] = setTimeout(o._ended.bind(o, s), _)),
                            i || o._emit("play", s._id)
                        } catch (e) {
                            o._emit("playerror", s._id, e)
                        }
                    },
                    v = window && window.ejecta || !p.readyState && t._navigator.isCocoonJS;
                if (4 === p.readyState || v)
                    h();
                else {
                    var g = function() {
                        h(),
                            p.removeEventListener(t._canPlayEvent, g, !1)
                    };
                    p.addEventListener(t._canPlayEvent, g, !1),
                        o._clearTimer(s._id)
                }
            }
            return s._id
        },
        pause: function(e) {
            var t = this;
            if ("loaded" !== t._state)
                return t._queue.push({
                    event: "pause",
                    action: function() {
                        t.pause(e)
                    }
                }),
                    t;
            for (var i = t._getSoundIds(e), o = 0; o < i.length; o++) {
                t._clearTimer(i[o]);
                var a = t._soundById(i[o]);
                if (a && !a._paused && (a._seek = t.seek(i[o]),
                    a._rateSeek = 0,
                    a._paused = !0,
                    t._stopFade(i[o]),
                    a._node))
                    if (t._webAudio) {
                        if (!a._node.bufferSource)
                            continue;
                        void 0 === a._node.bufferSource.stop ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0),
                            t._cleanBuffer(a._node)
                    } else
                        isNaN(a._node.duration) && a._node.duration !== 1 / 0 || a._node.pause();
                arguments[1] || t._emit("pause", a ? a._id : null)
            }
            return t
        },
        stop: function(e, t) {
            var i = this;
            if ("loaded" !== i._state)
                return i._queue.push({
                    event: "stop",
                    action: function() {
                        i.stop(e)
                    }
                }),
                    i;
            for (var o = i._getSoundIds(e), a = 0; a < o.length; a++) {
                i._clearTimer(o[a]);
                var n = i._soundById(o[a]);
                n && (n._seek = n._start || 0,
                    n._rateSeek = 0,
                    n._paused = !0,
                    n._ended = !0,
                    i._stopFade(o[a]),
                n._node && (i._webAudio ? n._node.bufferSource && (void 0 === n._node.bufferSource.stop ? n._node.bufferSource.noteOff(0) : n._node.bufferSource.stop(0),
                    i._cleanBuffer(n._node)) : isNaN(n._node.duration) && n._node.duration !== 1 / 0 || (n._node.currentTime = n._start || 0,
                    n._node.pause())),
                t || i._emit("stop", n._id))
            }
            return i
        },
        mute: function(e, i) {
            var o = this;
            if ("loaded" !== o._state)
                return o._queue.push({
                    event: "mute",
                    action: function() {
                        o.mute(e, i)
                    }
                }),
                    o;
            if (void 0 === i) {
                if ("boolean" != typeof e)
                    return o._muted;
                o._muted = e
            }
            for (var a = o._getSoundIds(i), n = 0; n < a.length; n++) {
                var r = o._soundById(a[n]);
                r && (r._muted = e,
                    o._webAudio && r._node ? r._node.gain.setValueAtTime(e ? 0 : r._volume, t.ctx.currentTime) : r._node && (r._node.muted = !!t._muted || e),
                    o._emit("mute", r._id))
            }
            return o
        },
        volume: function() {
            var e, i, o = this,
                a = arguments;
            if (0 === a.length)
                return o._volume;
            1 === a.length || 2 === a.length && void 0 === a[1] ? o._getSoundIds().indexOf(a[0]) >= 0 ? i = parseInt(a[0], 10) : e = parseFloat(a[0]) : a.length >= 2 && (e = parseFloat(a[0]),
                i = parseInt(a[1], 10));
            var n;
            if (!(void 0 !== e && e >= 0 && e <= 1))
                return n = i ? o._soundById(i) : o._sounds[0],
                    n ? n._volume : 0;
            if ("loaded" !== o._state)
                return o._queue.push({
                    event: "volume",
                    action: function() {
                        o.volume.apply(o, a)
                    }
                }),
                    o;
            void 0 === i && (o._volume = e),
                i = o._getSoundIds(i);
            for (var r = 0; r < i.length; r++)
                (n = o._soundById(i[r])) && (n._volume = e,
                a[2] || o._stopFade(i[r]),
                    o._webAudio && n._node && !n._muted ? n._node.gain.setValueAtTime(e, t.ctx.currentTime) : n._node && !n._muted && (n._node.volume = e * t.volume()),
                    o._emit("volume", n._id));
            return o
        },
        fade: function(e, i, o, a) {
            var n = this;
            if ("loaded" !== n._state)
                return n._queue.push({
                    event: "fade",
                    action: function() {
                        n.fade(e, i, o, a)
                    }
                }),
                    n;
            n.volume(e, a);
            for (var r = n._getSoundIds(a), s = 0; s < r.length; s++) {
                var l = n._soundById(r[s]);
                if (l) {
                    if (a || n._stopFade(r[s]),
                    n._webAudio && !l._muted) {
                        var d = t.ctx.currentTime,
                            c = d + o / 1e3;
                        l._volume = e,
                            l._node.gain.setValueAtTime(e, d),
                            l._node.gain.linearRampToValueAtTime(i, c)
                    }
                    n._startFadeInterval(l, e, i, o, r[s])
                }
            }
            return n
        },
        _startFadeInterval: function(e, t, i, o, a) {
            var n = this,
                r = t,
                s = t > i ? "out" : "in",
                l = Math.abs(t - i),
                d = l / .01,
                c = d > 0 ? o / d : o;
            c < 4 && (d = Math.ceil(d / (4 / c)),
                c = 4),
                e._interval = setInterval(function() {
                    d > 0 && (r += "in" === s ? .01 : -.01),
                        r = Math.max(0, r),
                        r = Math.min(1, r),
                        r = Math.round(100 * r) / 100,
                        n._webAudio ? (void 0 === a && (n._volume = r),
                            e._volume = r) : n.volume(r, e._id, !0), (i < t && r <= i || i > t && r >= i) && (clearInterval(e._interval),
                        e._interval = null,
                        n.volume(i, e._id),
                        n._emit("fade", e._id))
                }, c)
        },
        _stopFade: function(e) {
            var i = this,
                o = i._soundById(e);
            return o && o._interval && (i._webAudio && o._node.gain.cancelScheduledValues(t.ctx.currentTime),
                clearInterval(o._interval),
                o._interval = null,
                i._emit("fade", e)),
                i
        },
        loop: function() {
            var e, t, i, o = this,
                a = arguments;
            if (0 === a.length)
                return o._loop;
            if (1 === a.length) {
                if ("boolean" != typeof a[0])
                    return !!(i = o._soundById(parseInt(a[0], 10))) && i._loop;
                e = a[0],
                    o._loop = e
            } else
                2 === a.length && (e = a[0],
                    t = parseInt(a[1], 10));
            for (var n = o._getSoundIds(t), r = 0; r < n.length; r++)
                (i = o._soundById(n[r])) && (i._loop = e,
                o._webAudio && i._node && i._node.bufferSource && (i._node.bufferSource.loop = e,
                e && (i._node.bufferSource.loopStart = i._start || 0,
                    i._node.bufferSource.loopEnd = i._stop)));
            return o
        },
        rate: function() {
            var e, i, o = this,
                a = arguments;
            if (0 === a.length)
                i = o._sounds[0]._id;
            else if (1 === a.length) {
                var n = o._getSoundIds(),
                    r = n.indexOf(a[0]);
                r >= 0 ? i = parseInt(a[0], 10) : e = parseFloat(a[0])
            } else
                2 === a.length && (e = parseFloat(a[0]),
                    i = parseInt(a[1], 10));
            var s;
            if ("number" != typeof e)
                return s = o._soundById(i),
                    s ? s._rate : o._rate;
            if ("loaded" !== o._state)
                return o._queue.push({
                    event: "rate",
                    action: function() {
                        o.rate.apply(o, a)
                    }
                }),
                    o;
            void 0 === i && (o._rate = e),
                i = o._getSoundIds(i);
            for (var l = 0; l < i.length; l++)
                if (s = o._soundById(i[l])) {
                    s._rateSeek = o.seek(i[l]),
                        s._playStart = o._webAudio ? t.ctx.currentTime : s._playStart,
                        s._rate = e,
                        o._webAudio && s._node && s._node.bufferSource ? s._node.bufferSource.playbackRate.value = e : s._node && (s._node.playbackRate = e);
                    var d = o.seek(i[l]),
                        c = (o._sprite[s._sprite][0] + o._sprite[s._sprite][1]) / 1e3 - d,
                        _ = 1e3 * c / Math.abs(s._rate);
                    !o._endTimers[i[l]] && s._paused || (o._clearTimer(i[l]),
                        o._endTimers[i[l]] = setTimeout(o._ended.bind(o, s), _)),
                        o._emit("rate", s._id)
                }
            return o
        },
        seek: function() {
            var e, i, o = this,
                a = arguments;
            if (0 === a.length)
                i = o._sounds[0]._id;
            else if (1 === a.length) {
                var n = o._getSoundIds(),
                    r = n.indexOf(a[0]);
                r >= 0 ? i = parseInt(a[0], 10) : o._sounds.length && (i = o._sounds[0]._id,
                    e = parseFloat(a[0]))
            } else
                2 === a.length && (e = parseFloat(a[0]),
                    i = parseInt(a[1], 10));
            if (void 0 === i)
                return o;
            if ("loaded" !== o._state)
                return o._queue.push({
                    event: "seek",
                    action: function() {
                        o.seek.apply(o, a)
                    }
                }),
                    o;
            var s = o._soundById(i);
            if (s) {
                if (!("number" == typeof e && e >= 0)) {
                    if (o._webAudio) {
                        var l = o.playing(i) ? t.ctx.currentTime - s._playStart : 0,
                            d = s._rateSeek ? s._rateSeek - s._seek : 0;
                        return s._seek + (d + l * Math.abs(s._rate))
                    }
                    return s._node.currentTime
                }
                var c = o.playing(i);
                c && o.pause(i, !0),
                    s._seek = e,
                    s._ended = !1,
                    o._clearTimer(i),
                c && o.play(i, !0), !o._webAudio && s._node && (s._node.currentTime = e),
                    o._emit("seek", i)
            }
            return o
        },
        playing: function(e) {
            var t = this;
            if ("number" == typeof e) {
                var i = t._soundById(e);
                return !!i && !i._paused
            }
            for (var o = 0; o < t._sounds.length; o++)
                if (!t._sounds[o]._paused)
                    return !0;
            return !1
        },
        duration: function(e) {
            var t = this,
                i = t._duration,
                o = t._soundById(e);
            return o && (i = t._sprite[o._sprite][1] / 1e3),
                i
        },
        state: function() {
            return this._state
        },
        unload: function() {
            for (var e = this, i = e._sounds, o = 0; o < i.length; o++) {
                i[o]._paused || e.stop(i[o]._id),
                e._webAudio || (/MSIE |Trident\//.test(t._navigator && t._navigator.userAgent) || (i[o]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"),
                    i[o]._node.removeEventListener("error", i[o]._errorFn, !1),
                    i[o]._node.removeEventListener(t._canPlayEvent, i[o]._loadFn, !1)),
                    delete i[o]._node,
                    e._clearTimer(i[o]._id);
                var n = t._howls.indexOf(e);
                n >= 0 && t._howls.splice(n, 1)
            }
            var r = !0;
            for (o = 0; o < t._howls.length; o++)
                if (t._howls[o]._src === e._src) {
                    r = !1;
                    break
                }
            return a && r && delete a[e._src],
                t.noAudio = !1,
                e._state = "unloaded",
                e._sounds = [],
                e = null,
                null
        },
        on: function(e, t, i, o) {
            var a = this,
                n = a["_on" + e];
            return "function" == typeof t && n.push(o ? {
                id: i,
                fn: t,
                once: o
            } : {
                id: i,
                fn: t
            }),
                a
        },
        off: function(e, t, i) {
            var o = this,
                a = o["_on" + e],
                n = 0;
            if ("number" == typeof t && (i = t,
                t = null),
            t || i)
                for (n = 0; n < a.length; n++) {
                    var r = i === a[n].id;
                    if (t === a[n].fn && r || !t && r) {
                        a.splice(n, 1);
                        break
                    }
                } else if (e)
                o["_on" + e] = [];
            else {
                var s = Object.keys(o);
                for (n = 0; n < s.length; n++)
                    0 === s[n].indexOf("_on") && Array.isArray(o[s[n]]) && (o[s[n]] = [])
            }
            return o
        },
        once: function(e, t, i) {
            var o = this;
            return o.on(e, t, i, 1),
                o
        },
        _emit: function(e, t, i) {
            for (var o = this, a = o["_on" + e], n = a.length - 1; n >= 0; n--)
                a[n].id && a[n].id !== t && "load" !== e || (setTimeout(function(e) {
                    e.call(this, t, i)
                }
                    .bind(o, a[n].fn), 0),
                a[n].once && o.off(e, a[n].fn, a[n].id));
            return o
        },
        _loadQueue: function() {
            var e = this;
            if (e._queue.length > 0) {
                var t = e._queue[0];
                e.once(t.event, function() {
                    e._queue.shift(),
                        e._loadQueue()
                }),
                    t.action()
            }
            return e
        },
        _ended: function(e) {
            var i = this,
                o = e._sprite;
            if (!i._webAudio && e._node && !e._node.paused)
                return setTimeout(i._ended.bind(i, e), 100),
                    i;
            var a = !(!e._loop && !i._sprite[o][2]);
            if (i._emit("end", e._id), !i._webAudio && a && i.stop(e._id, !0).play(e._id),
            i._webAudio && a) {
                i._emit("play", e._id),
                    e._seek = e._start || 0,
                    e._rateSeek = 0,
                    e._playStart = t.ctx.currentTime;
                var n = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                i._endTimers[e._id] = setTimeout(i._ended.bind(i, e), n)
            }
            return i._webAudio && !a && (e._paused = !0,
                e._ended = !0,
                e._seek = e._start || 0,
                e._rateSeek = 0,
                i._clearTimer(e._id),
                i._cleanBuffer(e._node),
                t._autoSuspend()),
            i._webAudio || a || i.stop(e._id),
                i
        },
        _clearTimer: function(e) {
            var t = this;
            return t._endTimers[e] && (clearTimeout(t._endTimers[e]),
                delete t._endTimers[e]),
                t
        },
        _soundById: function(e) {
            for (var t = this, i = 0; i < t._sounds.length; i++)
                if (e === t._sounds[i]._id)
                    return t._sounds[i];
            return null
        },
        _inactiveSound: function() {
            var e = this;
            e._drain();
            for (var t = 0; t < e._sounds.length; t++)
                if (e._sounds[t]._ended)
                    return e._sounds[t].reset();
            return new o(e)
        },
        _drain: function() {
            var e = this,
                t = e._pool,
                i = 0,
                o = 0;
            if (!(e._sounds.length < t)) {
                for (o = 0; o < e._sounds.length; o++)
                    e._sounds[o]._ended && i++;
                for (o = e._sounds.length - 1; o >= 0; o--) {
                    if (i <= t)
                        return;
                    e._sounds[o]._ended && (e._webAudio && e._sounds[o]._node && e._sounds[o]._node.disconnect(0),
                        e._sounds.splice(o, 1),
                        i--)
                }
            }
        },
        _getSoundIds: function(e) {
            var t = this;
            if (void 0 === e) {
                for (var i = [], o = 0; o < t._sounds.length; o++)
                    i.push(t._sounds[o]._id);
                return i
            }
            return [e]
        },
        _refreshBuffer: function(e) {
            var i = this;
            return e._node.bufferSource = t.ctx.createBufferSource(),
                e._node.bufferSource.buffer = a[i._src],
                e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node),
                e._node.bufferSource.loop = e._loop,
            e._loop && (e._node.bufferSource.loopStart = e._start || 0,
                e._node.bufferSource.loopEnd = e._stop),
                e._node.bufferSource.playbackRate.value = e._rate,
                i
        },
        _cleanBuffer: function(e) {
            var t = this;
            if (t._scratchBuffer) {
                e.bufferSource.onended = null,
                    e.bufferSource.disconnect(0);
                try {
                    e.bufferSource.buffer = t._scratchBuffer
                } catch (e) {}
            }
            return e.bufferSource = null,
                t
        }
    };
    var o = function(e) {
        this._parent = e,
            this.init()
    };
    o.prototype = {
        init: function() {
            var e = this,
                i = e._parent;
            return e._muted = i._muted,
                e._loop = i._loop,
                e._volume = i._volume,
                e._rate = i._rate,
                e._seek = 0,
                e._paused = !0,
                e._ended = !0,
                e._sprite = "__default",
                e._id = ++t._counter,
                i._sounds.push(e),
                e.create(),
                e
        },
        create: function() {
            var e = this,
                i = e._parent,
                o = t._muted || e._muted || e._parent._muted ? 0 : e._volume;
            return i._webAudio ? (e._node = void 0 === t.ctx.createGain ? t.ctx.createGainNode() : t.ctx.createGain(),
                e._node.gain.setValueAtTime(o, t.ctx.currentTime),
                e._node.paused = !0,
                e._node.connect(t.masterGain)) : (e._node = new Audio,
                e._errorFn = e._errorListener.bind(e),
                e._node.addEventListener("error", e._errorFn, !1),
                e._loadFn = e._loadListener.bind(e),
                e._node.addEventListener(t._canPlayEvent, e._loadFn, !1),
                e._node.src = i._src,
                e._node.preload = "auto",
                e._node.volume = o * t.volume(),
                e._node.load()),
                e
        },
        reset: function() {
            var e = this,
                i = e._parent;
            return e._muted = i._muted,
                e._loop = i._loop,
                e._volume = i._volume,
                e._rate = i._rate,
                e._seek = 0,
                e._rateSeek = 0,
                e._paused = !0,
                e._ended = !0,
                e._sprite = "__default",
                e._id = ++t._counter,
                e
        },
        _errorListener: function() {
            var e = this;
            e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0),
                e._node.removeEventListener("error", e._errorFn, !1)
        },
        _loadListener: function() {
            var e = this,
                i = e._parent;
            i._duration = Math.ceil(10 * e._node.duration) / 10,
            0 === Object.keys(i._sprite).length && (i._sprite = {
                __default: [0, 1e3 * i._duration]
            }),
            "loaded" !== i._state && (i._state = "loaded",
                i._emit("load"),
                i._loadQueue()),
                e._node.removeEventListener(t._canPlayEvent, e._loadFn, !1)
        }
    };
    var a = {},
        n = function(e) {
            var t = e._src;
            if (a[t])
                return e._duration = a[t].duration,
                    void l(e);
            if (/^data:[^;]+;base64,/.test(t)) {
                for (var i = atob(t.split(",")[1]), o = new Uint8Array(i.length), n = 0; n < i.length; ++n)
                    o[n] = i.charCodeAt(n);
                s(o.buffer, e)
            } else {
                var d = new XMLHttpRequest;
                d.open("GET", t, !0),
                    d.withCredentials = e._xhrWithCredentials,
                    d.responseType = "arraybuffer",
                    d.onload = function() {
                        var t = (d.status + "")[0];
                        return "0" !== t && "2" !== t && "3" !== t ? void e._emit("loaderror", null, "Failed loading audio file with status: " + d.status + ".") : void s(d.response, e)
                    },
                    d.onerror = function() {
                        e._webAudio && (e._html5 = !0,
                            e._webAudio = !1,
                            e._sounds = [],
                            delete a[t],
                            e.load())
                    },
                    r(d)
            }
        },
        r = function(e) {
            try {
                e.send()
            } catch (t) {
                e.onerror()
            }
        },
        s = function(e, i) {
            t.ctx.decodeAudioData(e, function(e) {
                e && i._sounds.length > 0 && (a[i._src] = e,
                    l(i, e))
            }, function() {
                i._emit("loaderror", null, "Decoding audio data failed.")
            })
        },
        l = function(e, t) {
            t && !e._duration && (e._duration = t.duration),
            0 === Object.keys(e._sprite).length && (e._sprite = {
                __default: [0, 1e3 * e._duration]
            }),
            "loaded" !== e._state && (e._state = "loaded",
                e._emit("load"),
                e._loadQueue())
        },
        d = function() {
            try {
                "undefined" != typeof AudioContext ? t.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? t.ctx = new webkitAudioContext : t.usingWebAudio = !1
            } catch (e) {
                t.usingWebAudio = !1
            }
            var e = /iP(hone|od|ad)/.test(t._navigator && t._navigator.platform),
                i = t._navigator && t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
                o = i ? parseInt(i[1], 10) : null;
            if (e && o && o < 9) {
                var a = /safari/.test(t._navigator && t._navigator.userAgent.toLowerCase());
                (t._navigator && t._navigator.standalone && !a || t._navigator && !t._navigator.standalone && !a) && (t.usingWebAudio = !1)
            }
            t.usingWebAudio && (t.masterGain = void 0 === t.ctx.createGain ? t.ctx.createGainNode() : t.ctx.createGain(),
                t.masterGain.gain.value = t._muted ? 0 : 1,
                t.masterGain.connect(t.ctx.destination)),
                t._setup()
        };
    "function" == typeof define && define.amd && define([], function() {
        return {
            Howler: t,
            Howl: i
        }
    }),
    "undefined" != typeof exports && (exports.Howler = t,
        exports.Howl = i),
        "undefined" != typeof window ? (window.HowlerGlobal = e,
            window.Howler = t,
            window.Howl = i,
            window.Sound = o) : "undefined" != typeof global && (global.HowlerGlobal = e,
            global.Howler = t,
            global.Howl = i,
            global.Sound = o)
}(), ! function() {
    "use strict";
    HowlerGlobal.prototype._pos = [0, 0, 0],
        HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0],
        HowlerGlobal.prototype.stereo = function(e) {
            var t = this;
            if (!t.ctx || !t.ctx.listener)
                return t;
            for (var i = t._howls.length - 1; i >= 0; i--)
                t._howls[i].stereo(e);
            return t
        },
        HowlerGlobal.prototype.pos = function(e, t, i) {
            var o = this;
            return o.ctx && o.ctx.listener ? (t = "number" != typeof t ? o._pos[1] : t,
                i = "number" != typeof i ? o._pos[2] : i,
                "number" != typeof e ? o._pos : (o._pos = [e, t, i],
                    o.ctx.listener.setPosition(o._pos[0], o._pos[1], o._pos[2]),
                    o)) : o
        },
        HowlerGlobal.prototype.orientation = function(e, t, i, o, a, n) {
            var r = this;
            if (!r.ctx || !r.ctx.listener)
                return r;
            var s = r._orientation;
            return t = "number" != typeof t ? s[1] : t,
                i = "number" != typeof i ? s[2] : i,
                o = "number" != typeof o ? s[3] : o,
                a = "number" != typeof a ? s[4] : a,
                n = "number" != typeof n ? s[5] : n,
                "number" != typeof e ? s : (r._orientation = [e, t, i, o, a, n],
                    r.ctx.listener.setOrientation(e, t, i, o, a, n),
                    r)
        },
        Howl.prototype.init = function(e) {
            return function(t) {
                var i = this;
                return i._orientation = t.orientation || [1, 0, 0],
                    i._stereo = t.stereo || null,
                    i._pos = t.pos || null,
                    i._pannerAttr = {
                        coneInnerAngle: void 0 !== t.coneInnerAngle ? t.coneInnerAngle : 360,
                        coneOuterAngle: void 0 !== t.coneOuterAngle ? t.coneOuterAngle : 360,
                        coneOuterGain: void 0 !== t.coneOuterGain ? t.coneOuterGain : 0,
                        distanceModel: void 0 !== t.distanceModel ? t.distanceModel : "inverse",
                        maxDistance: void 0 !== t.maxDistance ? t.maxDistance : 1e4,
                        panningModel: void 0 !== t.panningModel ? t.panningModel : "HRTF",
                        refDistance: void 0 !== t.refDistance ? t.refDistance : 1,
                        rolloffFactor: void 0 !== t.rolloffFactor ? t.rolloffFactor : 1
                    },
                    i._onstereo = t.onstereo ? [{
                        fn: t.onstereo
                    }] : [],
                    i._onpos = t.onpos ? [{
                        fn: t.onpos
                    }] : [],
                    i._onorientation = t.onorientation ? [{
                        fn: t.onorientation
                    }] : [],
                    e.call(this, t)
            }
        }(Howl.prototype.init),
        Howl.prototype.stereo = function(t, i) {
            var o = this;
            if (!o._webAudio)
                return o;
            if ("loaded" !== o._state)
                return o._queue.push({
                    event: "stereo",
                    action: function() {
                        o.stereo(t, i)
                    }
                }),
                    o;
            var a = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";
            if (void 0 === i) {
                if ("number" != typeof t)
                    return o._stereo;
                o._stereo = t,
                    o._pos = [t, 0, 0]
            }
            for (var n = o._getSoundIds(i), r = 0; r < n.length; r++) {
                var s = o._soundById(n[r]);
                if (s) {
                    if ("number" != typeof t)
                        return s._stereo;
                    s._stereo = t,
                        s._pos = [t, 0, 0],
                    s._node && (s._pannerAttr.panningModel = "equalpower",
                    s._panner && s._panner.pan || e(s, a),
                        "spatial" === a ? s._panner.setPosition(t, 0, 0) : s._panner.pan.value = t),
                        o._emit("stereo", s._id)
                }
            }
            return o
        },
        Howl.prototype.pos = function(t, i, o, a) {
            var n = this;
            if (!n._webAudio)
                return n;
            if ("loaded" !== n._state)
                return n._queue.push({
                    event: "pos",
                    action: function() {
                        n.pos(t, i, o, a)
                    }
                }),
                    n;
            if (i = "number" != typeof i ? 0 : i,
                o = "number" != typeof o ? -.5 : o,
            void 0 === a) {
                if ("number" != typeof t)
                    return n._pos;
                n._pos = [t, i, o]
            }
            for (var r = n._getSoundIds(a), s = 0; s < r.length; s++) {
                var l = n._soundById(r[s]);
                if (l) {
                    if ("number" != typeof t)
                        return l._pos;
                    l._pos = [t, i, o],
                    l._node && (l._panner && !l._panner.pan || e(l, "spatial"),
                        l._panner.setPosition(t, i, o)),
                        n._emit("pos", l._id)
                }
            }
            return n
        },
        Howl.prototype.orientation = function(t, i, o, a) {
            var n = this;
            if (!n._webAudio)
                return n;
            if ("loaded" !== n._state)
                return n._queue.push({
                    event: "orientation",
                    action: function() {
                        n.orientation(t, i, o, a)
                    }
                }),
                    n;
            if (i = "number" != typeof i ? n._orientation[1] : i,
                o = "number" != typeof o ? n._orientation[2] : o,
            void 0 === a) {
                if ("number" != typeof t)
                    return n._orientation;
                n._orientation = [t, i, o]
            }
            for (var r = n._getSoundIds(a), s = 0; s < r.length; s++) {
                var l = n._soundById(r[s]);
                if (l) {
                    if ("number" != typeof t)
                        return l._orientation;
                    l._orientation = [t, i, o],
                    l._node && (l._panner || (l._pos || (l._pos = n._pos || [0, 0, -.5]),
                        e(l, "spatial")),
                        l._panner.setOrientation(t, i, o)),
                        n._emit("orientation", l._id)
                }
            }
            return n
        },
        Howl.prototype.pannerAttr = function() {
            var t, i, o, a = this,
                n = arguments;
            if (!a._webAudio)
                return a;
            if (0 === n.length)
                return a._pannerAttr;
            if (1 === n.length) {
                if ("object" != typeof n[0])
                    return o = a._soundById(parseInt(n[0], 10)),
                        o ? o._pannerAttr : a._pannerAttr;
                t = n[0],
                void 0 === i && (t.pannerAttr || (t.pannerAttr = {
                    coneInnerAngle: t.coneInnerAngle,
                    coneOuterAngle: t.coneOuterAngle,
                    coneOuterGain: t.coneOuterGain,
                    distanceModel: t.distanceModel,
                    maxDistance: t.maxDistance,
                    refDistance: t.refDistance,
                    rolloffFactor: t.rolloffFactor,
                    panningModel: t.panningModel
                }),
                    a._pannerAttr = {
                        coneInnerAngle: void 0 !== t.pannerAttr.coneInnerAngle ? t.pannerAttr.coneInnerAngle : a._coneInnerAngle,
                        coneOuterAngle: void 0 !== t.pannerAttr.coneOuterAngle ? t.pannerAttr.coneOuterAngle : a._coneOuterAngle,
                        coneOuterGain: void 0 !== t.pannerAttr.coneOuterGain ? t.pannerAttr.coneOuterGain : a._coneOuterGain,
                        distanceModel: void 0 !== t.pannerAttr.distanceModel ? t.pannerAttr.distanceModel : a._distanceModel,
                        maxDistance: void 0 !== t.pannerAttr.maxDistance ? t.pannerAttr.maxDistance : a._maxDistance,
                        refDistance: void 0 !== t.pannerAttr.refDistance ? t.pannerAttr.refDistance : a._refDistance,
                        rolloffFactor: void 0 !== t.pannerAttr.rolloffFactor ? t.pannerAttr.rolloffFactor : a._rolloffFactor,
                        panningModel: void 0 !== t.pannerAttr.panningModel ? t.pannerAttr.panningModel : a._panningModel
                    })
            } else
                2 === n.length && (t = n[0],
                    i = parseInt(n[1], 10));
            for (var r = a._getSoundIds(i), s = 0; s < r.length; s++)
                if (o = a._soundById(r[s])) {
                    var l = o._pannerAttr;
                    l = {
                        coneInnerAngle: void 0 !== t.coneInnerAngle ? t.coneInnerAngle : l.coneInnerAngle,
                        coneOuterAngle: void 0 !== t.coneOuterAngle ? t.coneOuterAngle : l.coneOuterAngle,
                        coneOuterGain: void 0 !== t.coneOuterGain ? t.coneOuterGain : l.coneOuterGain,
                        distanceModel: void 0 !== t.distanceModel ? t.distanceModel : l.distanceModel,
                        maxDistance: void 0 !== t.maxDistance ? t.maxDistance : l.maxDistance,
                        refDistance: void 0 !== t.refDistance ? t.refDistance : l.refDistance,
                        rolloffFactor: void 0 !== t.rolloffFactor ? t.rolloffFactor : l.rolloffFactor,
                        panningModel: void 0 !== t.panningModel ? t.panningModel : l.panningModel
                    };
                    var d = o._panner;
                    d ? (d.coneInnerAngle = l.coneInnerAngle,
                        d.coneOuterAngle = l.coneOuterAngle,
                        d.coneOuterGain = l.coneOuterGain,
                        d.distanceModel = l.distanceModel,
                        d.maxDistance = l.maxDistance,
                        d.refDistance = l.refDistance,
                        d.rolloffFactor = l.rolloffFactor,
                        d.panningModel = l.panningModel) : (o._pos || (o._pos = a._pos || [0, 0, -.5]),
                        e(o, "spatial"))
                }
            return a
        },
        Sound.prototype.init = function(e) {
            return function() {
                var t = this,
                    i = t._parent;
                t._orientation = i._orientation,
                    t._stereo = i._stereo,
                    t._pos = i._pos,
                    t._pannerAttr = i._pannerAttr,
                    e.call(this),
                    t._stereo ? i.stereo(t._stereo) : t._pos && i.pos(t._pos[0], t._pos[1], t._pos[2], t._id)
            }
        }(Sound.prototype.init),
        Sound.prototype.reset = function(e) {
            return function() {
                var t = this,
                    i = t._parent;
                return t._orientation = i._orientation,
                    t._pos = i._pos,
                    t._pannerAttr = i._pannerAttr,
                    e.call(this)
            }
        }(Sound.prototype.reset);
    var e = function(e, t) {
        t = t || "spatial",
            "spatial" === t ? (e._panner = Howler.ctx.createPanner(),
                e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle,
                e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle,
                e._panner.coneOuterGain = e._pannerAttr.coneOuterGain,
                e._panner.distanceModel = e._pannerAttr.distanceModel,
                e._panner.maxDistance = e._pannerAttr.maxDistance,
                e._panner.refDistance = e._pannerAttr.refDistance,
                e._panner.rolloffFactor = e._pannerAttr.rolloffFactor,
                e._panner.panningModel = e._pannerAttr.panningModel,
                e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]),
                e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2])) : (e._panner = Howler.ctx.createStereoPanner(),
                e._panner.pan.value = e._stereo),
            e._panner.connect(e._node),
        e._paused || e._parent.pause(e._id, !0).play(e._id)
    }
}(),
    function(e) {
        var t = !1;
        if ("function" == typeof define && define.amd && (define(e),
            t = !0),
        "object" == typeof exports && (module.exports = e(),
            t = !0), !t) {
            var i = window.Cookies,
                o = window.Cookies = e();
            o.noConflict = function() {
                return window.Cookies = i,
                    o
            }
        }
    }(function() {
        function e() {
            for (var e = 0, t = {}; e < arguments.length; e++) {
                var i = arguments[e];
                for (var o in i)
                    t[o] = i[o]
            }
            return t
        }

        function t(i) {
            function o(t, a, n) {
                var r;
                if ("undefined" != typeof document) {
                    if (arguments.length > 1) {
                        if (n = e({
                            path: "/"
                        }, o.defaults, n),
                        "number" == typeof n.expires) {
                            var s = new Date;
                            s.setMilliseconds(s.getMilliseconds() + 864e5 * n.expires),
                                n.expires = s
                        }
                        n.expires = n.expires ? n.expires.toUTCString() : "";
                        try {
                            r = JSON.stringify(a),
                            /^[\{\[]/.test(r) && (a = r)
                        } catch (e) {}
                        a = i.write ? i.write(a, t) : encodeURIComponent(String(a)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent),
                            t = encodeURIComponent(String(t)),
                            t = t.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent),
                            t = t.replace(/[\(\)]/g, escape);
                        var l = "";
                        for (var d in n)
                            n[d] && (l += "; " + d,
                            n[d] !== !0 && (l += "=" + n[d]));
                        return document.cookie = t + "=" + a + l
                    }
                    t || (r = {});
                    for (var c = document.cookie ? document.cookie.split("; ") : [], _ = /(%[0-9A-Z]{2})+/g, p = 0; p < c.length; p++) {
                        var u = c[p].split("="),
                            h = u.slice(1).join("=");
                        '"' === h.charAt(0) && (h = h.slice(1, -1));
                        try {
                            var v = u[0].replace(_, decodeURIComponent);
                            if (h = i.read ? i.read(h, v) : i(h, v) || h.replace(_, decodeURIComponent),
                                this.json)
                                try {
                                    h = JSON.parse(h)
                                } catch (e) {}
                            if (t === v) {
                                r = h;
                                break
                            }
                            t || (r[v] = h)
                        } catch (e) {}
                    }
                    return r
                }
            }
            return o.set = o,
                o.get = function(e) {
                    return o.call(o, e)
                },
                o.getJSON = function() {
                    return o.apply({
                        json: !0
                    }, [].slice.call(arguments))
                },
                o.defaults = {},
                o.remove = function(t, i) {
                    o(t, "", e(i, {
                        expires: -1
                    }))
                },
                o.withConverter = t,
                o
        }
        return t(function() {})
    }),
    function() {
        "use strict";
        var e = "undefined" != typeof window && "undefined" != typeof window.document ? window.document : {},
            t = "undefined" != typeof module && module.exports,
            i = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
            o = function() {
                for (var t, i = [
                    ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                    ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
                    ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
                    ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
                    ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
                ], o = 0, a = i.length, n = {}; o < a; o++)
                    if (t = i[o],
                    t && t[1] in e) {
                        for (o = 0; o < t.length; o++)
                            n[i[0][o]] = t[o];
                        return n
                    }
                return !1
            }(),
            a = {
                change: o.fullscreenchange,
                error: o.fullscreenerror
            },
            n = {
                request: function(t) {
                    var a = o.requestFullscreen;
                    t = t || e.documentElement,
                        / Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent) ? t[a]() : t[a](i && Element.ALLOW_KEYBOARD_INPUT)
                },
                exit: function() {
                    e[o.exitFullscreen]()
                },
                toggle: function(e) {
                    this.isFullscreen ? this.exit() : this.request(e)
                },
                onchange: function(e) {
                    this.on("change", e)
                },
                onerror: function(e) {
                    this.on("error", e)
                },
                on: function(t, i) {
                    var o = a[t];
                    o && e.addEventListener(o, i, !1)
                },
                off: function(t, i) {
                    var o = a[t];
                    o && e.removeEventListener(o, i, !1)
                },
                raw: o
            };
        return o ? (Object.defineProperties(n, {
            isFullscreen: {
                get: function() {
                    return Boolean(e[o.fullscreenElement])
                }
            },
            element: {
                enumerable: !0,
                get: function() {
                    return e[o.fullscreenElement]
                }
            },
            enabled: {
                enumerable: !0,
                get: function() {
                    return Boolean(e[o.fullscreenEnabled])
                }
            }
        }),
            void(t ? module.exports = n : window.screenfull = n)) : void(t ? module.exports = !1 : window.screenfull = !1)
    }();
var jv = {};
jv.assets = [],
    jv.state = "init",
    jv.pixiver = 4,
    jv.fps = 0,
    jv.load = function(e) {
        jv.assets.push(e)
    },
    jv.include = function(e) {
        jv.includes += 1,
            loadScript(e, jv.include_loaded)
    },
    jv.include_loaded = function() {
        jv.includes -= 1
    },
    jv.fps_obj = {
        startTime: 0,
        frameNumber: 0,
        getFPS: function() {
            this.frameNumber++;
            var e = (new Date).getTime(),
                t = (e - this.startTime) / 1e3,
                i = Math.round(this.frameNumber / t);
            return t > 1 && (this.startTime = e,
                this.frameNumber = 0),
                i
        }
    },
    jv.frame = function() {
        requestAnimationFrame(jv.frame),
            jv.fps_num = jv.fps_obj.getFPS(),
            jv.loop(),
            jv.renderer.render(jv.stage)
    },
    jv.add = jv.addChild = function(e) {
        jv.stage.addChild(e)
    },
    jv.gpu_detect = function(e) {
        var t, i, o, a, n = document.createElement("canvas");
        try {
            t = n.getContext("webgl") || n.getContext("experimental-webgl")
        } catch (e) {}
        return !(!t || (i = t.getExtension("WEBGL_debug_renderer_info"),
            o = t.getParameter(i.UNMASKED_VENDOR_WEBGL),
            a = t.getParameter(i.UNMASKED_RENDERER_WEBGL),
        o.indexOf(e) === -1 && a.indexOf(e) === -1))
    },
    jv.screen = function(e, t) {
        var i = jv.gpu_detect("Mali-4");
        jv.renderer = new PIXI.autoDetectRenderer(e, t, {
            antialias: !1,
            view: document.getElementById("jv"),
            preserveDrawingBuffer: i,
            roundPixels: !0
        }),
            PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST,
            jv.stage = new PIXI.Container,
            jv.stage.scaleMode = PIXI.SCALE_MODES.NEAREST,
            jv.stage.interactive = !0,
            jv.stage.hitArea = new PIXI.Rectangle(0, 0, e, t),
            jv.mouseDown = !1,
            jv.stage.mousedown = function() {
                jv.mouseDown = !0
            },
            jv.stage.mouseup = function() {
                jv.mouseDown = !1
            },
            jv.mouse = jv.renderer.plugins.interaction.mouse.global
    },
    jv.image = function(e) {
        var t = PIXI.Texture.fromImage(e);
        return t
    },
    jv.scene = function() {
        return new PIXI.Container
    },
    jv.text = function(e, t) {
        return "undefined" == typeof t && (t = {
            font: "24px Verdana",
            fill: "white"
        }),
            new PIXI.Text(e, t)
    },
    jv.spritesheet = function(e, t, i, o) {
        var a = "string" == typeof e ? PIXI.TextureCache[e] : e;
        1 === a.baseTexture.width && (a.baseTexture = PIXI.Texture.WHITE);
        var n = a.baseTexture;
        if (24 == t && 32 == i && 128 != n.width && (t = Math.floor(n.width / 3),
            i = Math.floor(n.height / 4),
            o = 2),
            n.scaleMode = a.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST,
            o)
            if (4 == jv.pixiver) {
                var r = new PIXI.BaseRenderTexture(n.width * o, n.height * o, PIXI.SCALE_MODES.NEAREST, 1),
                    s = new PIXI.RenderTexture(r),
                    l = new PIXI.Sprite.from(n);
                l.scale.x = o,
                    l.scale.y = o,
                    jv.renderer.render(l, s),
                    n = s.baseTexture,
                    t *= o,
                    i *= o
            } else {
                var s = new PIXI.RenderTexture(jv.renderer, n.width * o, n.height * o, PIXI.SCALE_MODES.NEAREST, 1),
                    l = new PIXI.Sprite(a),
                    d = new PIXI.Container;
                l.scale.x = o,
                    l.scale.y = o,
                    d.addChild(l),
                    s.render(d),
                    n = s.baseTexture,
                    t *= o,
                    i *= o
            }
        var c, _, p = [];
        for (c = 0; c < Math.floor(n.width / t); c++)
            for (void 0 == p[c] && (p[c] = []),
                     _ = 0; _ < Math.floor(n.height / i); _++)
                p[c][_] = new PIXI.Texture(n, new PIXI.Rectangle(c * t, _ * i, t, i));
        return p
    },
    jv.sprite = function(e) {
        return "string" == typeof e ? new PIXI.Sprite.fromImage(e) : new PIXI.Sprite(e)
    },
    jv.bringToFront = function(e) {
        if (e.parent) {
            var t = e.parent;
            t.removeChild(e),
                t.addChild(e)
        }
    },
    jv.prevent = function(e) {
        return e.preventDefault(),
            1
    },
    jv.key_array = [],
    jv.keyboard = function(e) {
        var t = {};
        return jv.key_array.push(t),
            t.code = e,
            t.isDown = !1,
            t.isUp = !0,
            t.press = void 0,
            t.release = void 0,
            t.downHandler = function(e) {
                jv.prevent(e) && e.keyCode === t.code && (t.isUp && t.press && t.press(),
                    t.isDown = !0,
                    t.isUp = !1)
            },
            t.upHandler = function(e) {
                jv.prevent(e) && e.keyCode === t.code && (t.isDown && t.release && t.release(),
                    t.isDown = !1,
                    t.isUp = !0)
            },
            window.addEventListener("keydown", t.downHandler.bind(t), !1),
            window.addEventListener("keyup", t.upHandler.bind(t), !1),
            t
    },
    jv.unzip = function(e) {
        for (var t, i = {}, o = (e + "").split(""), a = o[0], n = a, r = [a], s = 57344, l = 1; l < o.length; l++) {
            var d = o[l].charCodeAt(0);
            t = d < 57344 ? o[l] : i[d] ? i[d] : n + a,
                r.push(t),
                a = t.charAt(0),
                i[s] = n + a,
                s++,
                n = t
        }
        return r.join("")
    },
    jv.zip = function(e) {
        for (var t, i = {}, o = (e + "").split(""), a = [], n = o[0], r = 57344, s = 1; s < o.length; s++)
            t = o[s],
                null != i[n + t] ? n += t : (a.push(n.length > 1 ? i[n] : n.charCodeAt(0)),
                    i[n + t] = r,
                    r++,
                    n = t);
        a.push(n.length > 1 ? i[n] : n.charCodeAt(0));
        for (var s = 0; s < a.length; s++)
            a[s] = String.fromCharCode(a[s]);
        return a.join("")
    },
    jv.random = function(e, t) {
        return Math.floor(Math.random() * t + e)
    },
    jv.toString = function(e) {
        return JSON.stringify(e)
    },
    jv.fromString = function(e) {
        return JSON.parse(e)
    },
    jv.hit = function(e, t) {
        var i, o, a, n, r;
        return i = !1,
            e.centerX = e.x + e.width / 2,
            e.centerY = e.y + e.height / 2,
            t.centerX = t.x + t.width / 2,
            t.centerY = t.y + t.height / 2,
            e.halfWidth = e.width / 2,
            e.halfHeight = e.height / 2,
            t.halfWidth = t.width / 2,
            t.halfHeight = t.height / 2,
            n = e.centerX - t.centerX,
            r = e.centerY - t.centerY,
            o = e.halfWidth + t.halfWidth,
            a = e.halfHeight + t.halfHeight,
            i = Math.abs(n) < o && Math.abs(r) < a
    };
var Warehouse = {
    create: function(e) {
        "undefined" == typeof e && (e = "wid");
        var t = {};
        return t.items = [],
            t.next_id = 0,
            t.index = e,
            t.add = function(e) {
                e[this.index] = this.next_id++,
                    e.array_obj = this,
                    e.remove = function() {
                        this.ref && (this.ref[this.id] = null),
                            this.array_obj.items[this.array_index] = null
                    };
                var t, i = this.items.length;
                for (t = 0; t < i; t++)
                    if (!this.items[t])
                        return e.array_index = t,
                            void(this.items[t] = e);
                e.array_index = this.items.length,
                    this.items.push(e)
            },
            t.fetch = function(e, t) {
                "undefined" == typeof t && (t = this.index);
                var i, o = this.items.length;
                for (i = 0; i < o; i++)
                    if (this.items[i] && this.items[i][t] == e)
                        return this.items[i];
                return o && null === this.items[o - 1] && (this.items.length = o - 1),
                    null
            },
            t.process = function(e) {
                var t, i = this.items.length;
                for (t = 0; t < i; t++)
                    this.items[t] && e(this.items[t]);
                i && null === this.items[i - 1] && (this.items.length = i - 1)
            },
            t
    }
};
jv.Shelf = {
    create: function(e, t) {
        var i = {};
        return i.items = [],
            i.hole = [],
            i.next_id = 1,
            i.label = e,
            i.useid = t,
            i.add = function(e) {
                this.hole.length ? e[this.label] = this.hole.pop() : e[this.label] = this.items.length,
                this.useid && (e.id = this.next_id++),
                    this.items[e[this.label]] = e
            },
            i.remove = function(e) {
                "undefined" != typeof e[this.label] && (e[this.label] == this.items.length - 1 ? (this.items[e[this.label]] = null,
                    this.items.length--) : (this.hole[this.hole.length] = e[this.label],
                    this.items[e[this.label]] = null),
                    delete e[this.label])
            },
            i.fetch = function(e) {
                var t, i = this.items.length;
                for (t = 0; t < i; t++)
                    if (this.items[t] && this.items[t].id == e)
                        return this.items[t];
                return null
            },
            i.exists = function(e) {
                return null != e[this.label]
            },
            i.process = function(e) {
                var t, i = this.items.length;
                if (this.hole.length)
                    for (t = 0; t < i; t++)
                        this.items[t] && e(this.items[t]);
                else
                    for (t = 0; t < i; t++)
                        e(this.items[t])
            },
            i
    }
};
var Effect = {
        create: function(e, t) {
            var i = {};
            return i.x = Math.floor(e / 32),
                i.y = Math.floor(t / 32),
                i.life = 5,
                i.sprite = 155,
                i.draw = function() {},
                i.update = function() {
                    this.life--,
                    this.life <= 0 && this.destroy()
                },
                i
        }
    },
    Tile = {
        sprite: 0,
        x: 0,
        y: 0
    },
    Map = {
        create: function(e, t, i) {
            var o = {};
            return o.map = [
                []
            ],
                o.container = e,
                o.sheet = t,
                o.sheet_width = i,
                o.get = function(e, t) {
                    return void 0 == this.map[e] && (this.map[e] = []),
                        this.map[e][t]
                },
                o.set = function(e, t, i, o) {
                    var a = jv.sprite(this.sheet[i][o]);
                    return a.sprite = i + o * this.sheet_width,
                    void 0 == this.map[e] && (this.map[e] = []),
                    void 0 != a.x && (void 0 != this.map[e][t] && void 0 != this.map[e][t].x && this.map[e][t].parent.removeChild(this.map[e][t]),
                        a.x = e * a.width,
                        a.y = t * a.height),
                        this.map[e][t] = a,
                        this.container.addChild(a),
                        a
                },
                o.clear = function() {
                    this.process(function(e, t, i) {
                        void 0 != i && void 0 != i.x && i.parent.removeChild(i),
                            i = null
                    }),
                        this.map = [
                            []
                        ]
                },
                o.load = function(e) {
                    this.clear(),
                    "string" == typeof e && (e = jv.fromString(e));
                    for (var t in e)
                        for (var i in e[t])
                            void 0 != e[t][i] && null != e[t][i] && this.set(t, i, e[t][i] % this.sheet_width, Math.floor(e[t][i] / this.sheet_width))
                },
                o.raw = function() {
                    var e = [];
                    for (var t in this.map) {
                        void 0 == this.map[t] && (this.map[t] = []),
                            e[t] = [];
                        for (var i in this.map[t])
                            e[t][i] = this.map[t][i].sprite
                    }
                    return e
                },
                o.process = function(e) {
                    for (var t in this.map) {
                        void 0 == this.map[t] && (this.map[t] = []);
                        for (var i in this.map[t])
                            void 0 != this.map[t][i] && e(t, i, this.map[t][i])
                    }
                },
                o.draw = function() {},
                o
        }
    };
jv.base64_encode = function(e) {
    if ("undefined" == typeof window)
        return new Buffer(e).toString("base64");
    if ("undefined" != typeof window.btoa)
        return window.btoa(decodeURIComponent(encodeURIComponent(e)));
    var t, i, o, a, n, r, s, l, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        c = 0,
        _ = 0,
        p = "",
        u = [];
    if (!e)
        return e;
    e = decodeURIComponent(encodeURIComponent(e));
    do
        t = e.charCodeAt(c++),
            i = e.charCodeAt(c++),
            o = e.charCodeAt(c++),
            l = t << 16 | i << 8 | o,
            a = l >> 18 & 63,
            n = l >> 12 & 63,
            r = l >> 6 & 63,
            s = 63 & l,
            u[_++] = d.charAt(a) + d.charAt(n) + d.charAt(r) + d.charAt(s);
    while (c < e.length);
    p = u.join("");
    var h = e.length % 3;
    return (h ? p.slice(0, h - 3) : p) + "===".slice(h || 3)
},
    jv.base64_decode = function(e) {
        if ("undefined" == typeof window)
            return new Buffer(e, "base64").toString("utf-8");
        if ("undefined" != typeof window.atob)
            return decodeURIComponent(encodeURIComponent(window.atob(e)));
        var t, i, o, a, n, r, s, l, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            c = 0,
            _ = 0,
            p = "",
            u = [];
        if (!e)
            return e;
        e += "";
        do
            a = d.indexOf(e.charAt(c++)),
                n = d.indexOf(e.charAt(c++)),
                r = d.indexOf(e.charAt(c++)),
                s = d.indexOf(e.charAt(c++)),
                l = a << 18 | n << 12 | r << 6 | s,
                t = l >> 16 & 255,
                i = l >> 8 & 255,
                o = 255 & l,
                64 === r ? u[_++] = String.fromCharCode(t) : 64 === s ? u[_++] = String.fromCharCode(t, i) : u[_++] = String.fromCharCode(t, i, o);
        while (c < e.length);
        return p = u.join(""),
            decodeURIComponent(encodeURIComponent(p.replace(/\0+$/, "")))
    };
var game_load = function() {
        var e = document.getElementById("mlloader");
        e && (e.outerHTML = "",
            delete e),
        "init" === jv.state && (jv.state = "scripts",
        jv.init && jv.init(),
        jv.loop && jv.frame(),
            jv.state = "loading",
            PIXI.loader.add(jv.assets).load(jv.ready),
        void 0 !== load_progress && PIXI.loader.on("progress", load_progress))
    },
    version = "4.9.1";
"undefined" != typeof mlmeta && (version = mlmeta.version);
var vt = "?v=" + version,
    path = "";
window.location && window.location.host && window.location.host.indexOf("mysteralegacy.com") !== -1 && (path = "/");
var res = [],
    debugging = 0,
    clothes_fixed = [1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    clothes_hooded = [5, 9, 12, 14],
    hair_fixed = [6, 11, 12, 16, 17, 19, 20, 21, 22],
    hair_front = [10, 14],
    max_clothes = 16,
    max_body = 9,
    max_hair = 22,
    max_costume = 148;
jv.selected_ip = "use.mysteralegacy.com",
    jv.update_x = 18,
    jv.update_y = 13,
    jv.update_map_width = 2 * jv.update_x,
    jv.update_map_height = 2 * jv.update_y;
var phone = !!window.cordova;
phone ? (path = "",
    Howler.mobileAutoEnable = !0,
    document.addEventListener("deviceready", game_load)) : window.onload = game_load,
    res.push(path + "data/body/e1.png" + vt);
for (var i = 1; i <= max_body; i++)
    res.push(path + "data/body/b" + i + ".png" + vt);
for (var i = 1; i <= max_clothes; i++)
    res.push(path + "data/clothes/c" + i + "_a.png" + vt),
    clothes_fixed.indexOf(i) != -1 && res.push(path + "data/clothes/c" + i + "_b.png" + vt);
for (var i = 1; i <= max_hair; i++)
    res.push(path + "data/hair/h" + i + "_a.png" + vt),
    hair_fixed.indexOf(i) != -1 && res.push(path + "data/hair/h" + i + "_b.png" + vt),
    hair_front.indexOf(i) != -1 && res.push(path + "data/hair/h" + i + "_c.png" + vt);
for (var i = 1; i <= max_costume; i++)
    res.push(path + "data/monsters/" + i + ".png" + vt);
res = res.concat([path + "data/misc/splash_screen.jpg" + vt, path + "data/misc/mapfont.fnt" + vt, path + "data/misc/tile16.png" + vt, path + "data/misc/item16.png" + vt, path + "data/misc/compass.png" + vt, path + "data/misc/button.png" + vt, path + "data/misc/star.png" + vt, path + "data/misc/edges.png" + vt, path + "data/misc/chat_say.png" + vt, path + "data/misc/chat_tell.png" + vt, path + "data/misc/chat_global.png" + vt, path + "data/misc/chat_tribe.png" + vt, path + "data/misc/sound_icon.png" + vt, path + "data/misc/music_icon.png" + vt, path + "data/misc/color.png" + vt, path + "data/misc/buffs.png" + vt]),
    jv.load(res);
var sound = [],
    load_sounds = function() {
        sound.swish = [new Howl({
            src: [path + "sounds/swish.mp3"]
        }), new Howl({
            src: [path + "sounds/swish2.mp3"]
        })],
            sound.pickaxe = [new Howl({
                src: [path + "sounds/pickaxe1.mp3"]
            }), new Howl({
                src: [path + "sounds/pickaxe2.mp3"]
            })],
            sound.shovel = [new Howl({
                src: [path + "sounds/shovel1.mp3"]
            }), new Howl({
                src: [path + "sounds/shovel2.mp3"]
            })],
            sound.chop = [new Howl({
                src: [path + "sounds/chop.mp3"]
            })],
            sound.drop = [new Howl({
                src: [path + "sounds/drop.mp3"]
            })],
            sound.bush = [new Howl({
                src: [path + "sounds/berry.mp3"]
            })],
            sound.hammer = [new Howl({
                src: [path + "sounds/hammer_wall.mp3"]
            })],
            sound.blood = [new Howl({
                src: [path + "sounds/slap.mp3"]
            })],
            sound.hit = [new Howl({
                src: [path + "sounds/punch.mp3"]
            })],
            sound.crit = [new Howl({
                src: [path + "sounds/splatter.mp3"]
            })],
            sound.stab = [new Howl({
                src: [path + "sounds/stab.mp3"]
            })],
            sound.sword_equip = [new Howl({
                src: [path + "sounds/sword_equip.mp3"]
            })],
            sound.chicken = [new Howl({
                src: [path + "sounds/chicken.mp3"]
            })],
            sound.chick = [new Howl({
                src: [path + "sounds/chick.mp3"]
            })],
            sound.water = [new Howl({
                src: [path + "sounds/water.mp3"]
            })],
            sound.water_pour = [new Howl({
                src: [path + "sounds/water_pour.mp3"]
            })],
            sound.cow = [new Howl({
                src: [path + "sounds/cow1.mp3"]
            }), new Howl({
                src: [path + "sounds/cow2.mp3"]
            })],
            sound.sheep = [new Howl({
                src: [path + "sounds/sheep.mp3"]
            })],
            sound.door_open = [new Howl({
                src: [path + "sounds/door_open.mp3"]
            })],
            sound.door_close = [new Howl({
                src: [path + "sounds/door_close.mp3"]
            })],
            sound.cooking = [new Howl({
                src: [path + "sounds/cooking.mp3"]
            })],
            sound.shield_block = [new Howl({
                src: [path + "sounds/shieldblock1.mp3"]
            }), new Howl({
                src: [path + "sounds/shieldblock2.mp3"]
            })],
            sound.death = [new Howl({
                src: [path + "sounds/death_animal.mp3"]
            })],
            sound.arrow = [new Howl({
                src: [path + "sounds/arrow.mp3"]
            })],
            sound.knitting = [new Howl({
                src: [path + "sounds/knitting.mp3"]
            })],
            sound.thud = [new Howl({
                src: [path + "sounds/thud.mp3"]
            })],
            sound.building = [new Howl({
                src: [path + "sounds/building.mp3"]
            })],
            sound.twinkle = [new Howl({
                src: [path + "sounds/twinkle.mp3"]
            })],
            sound.woosh = [new Howl({
                src: [path + "sounds/woosh.mp3"]
            })],
            sound.swoosh = [new Howl({
                src: [path + "sounds/swoosh.mp3"]
            })],
            sound.restore = [new Howl({
                src: [path + "sounds/restore.mp3"]
            })],
            sound.level = [new Howl({
                src: [path + "sounds/level.mp3"]
            })],
            sound.fireball = [new Howl({
                src: [path + "sounds/fireball.mp3"]
            })],
            sound.whip = [new Howl({
                src: [path + "sounds/whip.mp3"]
            })],
            sound.steps = [new Howl({
                src: [path + "sounds/steps.mp3"]
            })],
            sound.eat = [new Howl({
                src: [path + "sounds/eating1.mp3"]
            }), new Howl({
                src: [path + "sounds/eating2.mp3"]
            })],
            sound.click = [new Howl({
                src: [path + "sounds/click.mp3"]
            })],
            sound.myst = [new Howl({
                src: [path + "sounds/myst1.mp3"]
            }), new Howl({
                src: [path + "sounds/myst2.mp3"]
            })],
            sound.rain = [new Howl({
                src: [path + "sounds/rain.mp3"]
            })],
            sound.dash = [new Howl({
                src: [path + "sounds/dash.mp3"]
            })],
            sound.barrier = [new Howl({
                src: [path + "sounds/barrier.mp3"]
            })],
            sound.pages = [new Howl({
                src: [path + "sounds/pages.mp3"]
            })],
            sound.skill_up = [new Howl({
                src: [path + "sounds/skill_up.mp3"]
            })],
            sound.swap = [new Howl({
                src: [path + "sounds/swap.mp3"]
            })],
            sound.pop = [new Howl({
                src: [path + "sounds/pop.mp3"]
            })],
            sound.beepup = [new Howl({
                src: [path + "sounds/beepup.mp3"]
            })],
            sound.beepdown = [new Howl({
                src: [path + "sounds/beepdown.mp3"]
            })]
    },
    music = [];
jv.current_song = null,
    jv.music_volume = .4,
    jv.sound_volume = .5,
    Howler.volume(.75);
var show_fps = 0;
debugging && (show_fps = 1);
var GAME_INIT = 0,
    GAME_TITLE = 1,
    GAME_PLAYING = 2,
    me = -1,
    myself, family, fps, fps_time, fps_frames = 0, //
    game_state = GAME_INIT,
    editor, editing = 0,
    inputting = 0,
    action = 0,
    dest = -1,//
    last_ping = Date.now(),
    ping_count = 0,
    ping = 100,
    dlevel = "",
    cur_wall = 0,
    cur_cover = 0,
    last_dest = 0,//
    has_focus = 1,//
    has_quit = 0,//
    drag = void 0,
    sound_on = 1,
    select = 0,
    build_type = "",
    build_page = 0,
    cave_wall = 175,
    cave_floor = 73,
    keyRight = jv.keyboard(39),
    keyLeft = jv.keyboard(37),
    keyUp = jv.keyboard(38),
    keyDown = jv.keyboard(40),
    keyCtrl = jv.keyboard(17),
    keyShift = jv.keyboard(16),
    keySpace = jv.keyboard(32),
    keyEnter = jv.keyboard(13),
    keyEscape = jv.keyboard(27),
    keyQ = jv.keyboard(81),
    keyE = jv.keyboard(69),
    keyR = jv.keyboard(82),
    keyT = jv.keyboard(84),
    keyF = jv.keyboard(70),
    keyW = jv.keyboard(87),
    keyA = jv.keyboard(65),
    keyS = jv.keyboard(83),
    keyD = jv.keyboard(68),
    keyC = jv.keyboard(67),
    keyB = jv.keyboard(66),
    keyI = jv.keyboard(73),
    keyK = jv.keyboard(75),
    keyU = jv.keyboard(85),
    keyM = jv.keyboard(77),
    key1 = jv.keyboard(49),
    key2 = jv.keyboard(50),
    key3 = jv.keyboard(51),
    key4 = jv.keyboard(52),
    key5 = jv.keyboard(53),
    key6 = jv.keyboard(54),
    key7 = jv.keyboard(55),
    key8 = jv.keyboard(56),
    key9 = jv.keyboard(57),
    keyComma = jv.keyboard(188),
    keyPeriod = jv.keyboard(190),
    keySlash = jv.keyboard(191),
    keyBackslash = jv.keyboard(220),
    keyBracket = jv.keyboard(221),
    keyQuote = jv.keyboard(222),
    keyTab = jv.keyboard(9);
jv.hot_slot = [0, 2, 4, 1, 3, 5];
var connection, theme, myName = !1, //
    mobs = jv.Shelf.create("sm"),
    objects = jv.Shelf.create("so"),
    effects = jv.Shelf.create("se"),
    hp_status, skill_status, exp_status, hunger_status, object_dict = [], //
    player_dict = [], //
    effect_dict = [],
    obj_ref = [],
    mob_ref = [],
    map = [],
    MAP_WIDTH = 100,
    MAP_HEIGHT = 100,
    item_length = 15,
    build_length = 15,
    view_width = 17,
    view_height = 13,
    hero_x = 224,
    hero_y = 224,
    mx = 0,
    my = 0,
    center_x, center_y, last_status, now = Date.now(),
    animation_timer = Date.now(),
    heading = "",
    drop_amt = "all",
    last_tell = "",
    master_container, map_container, object_container, player_container, anim_map_container, edge_container, effect_container, hover_container, ui_container, cover = [],
    map_index = {},
    item_page = 0,
    item_data = [],
    inv = [], //
    bld = [],
    build_data = [];
tile_speed = {};
var space_timer = Date.now(),
    space_toggle = 0,
    update_sort = 1,
    last_sort = 0,
    is_chatting = 0,
    monster = [],
    chars = [],
    clothes = [],
    hair = [],
    tiles, items, edges, wall_sprite, compass, inventory, graphics, ph_pickup, ph_action, input_field, touching = 0,
    touchx, touchy, target, map_fade, game_fade, fade_to = 1;
jv.game_width = 740,
    jv.game_height = 416,
    jv.color_bright = 7834252,
    jv.color_light = 6583413,
    jv.color_medium = 5005152,
    jv.color_base = 3686992,
    jv.color_dark = 2699322,
    jv.initializeStore = function() {
        jv.store_initialized = 1,
            store.verbosity = store.INFO,
            store.register({
                id: "diamond10usd",
                alias: "30 Diamonds",
                type: store.CONSUMABLE
            }),
            store.register({
                id: "diamond25usd",
                alias: "90 Diamonds",
                type: store.CONSUMABLE
            }),
            store.ready(function() {
                alert("STORE READY")
            }),
            store.when("product").updated(function(e) {
                alert("Product updated. ID:" + e.id + " Valid:" + e.valid + " Owned:" + e.owned + " State:" + e.state)
            }),
            store.when("product").approved(function(e) {
                alert("Product approved. ID:" + e.id + " Valid:" + e.valid + " Owned:" + e.owned + " State:" + e.state),
                    e.finish()
            }),
            store.error(function(e) {
                alert("ERROR " + e.code + ": " + e.message)
            }),
            store.refresh()
    },
    jv.purchase = function(e) {
        e || (e = "diamond10usd"),
            store.order(e).then(function() {
                alert("Waiting on approval..")
            })
    },
    jv.init = function() {
        function e(e) {
            return e.preventDefault(),
            keyEscape.press && keyEscape.press(), !1
        }
        phone && (StatusBar.hide(),
            screen.orientation.lock("landscape"),
            document.addEventListener("backbutton", e, !1)),
            jv.screen(jv.game_width, jv.game_height),
        "undefined" != typeof do_resize && do_resize();
        var t = new PIXI.Graphics;
        t.beginFill(4473924, 1),
            t.drawRect(0, 0, jv.game_width / 2, 40),
            t.endFill(),
            t.beginFill(5592405, 1),
            t.drawRect(4, 4, jv.game_width / 2 - 8, 32),
            t.endFill(),
            t.beginFill(6710886, 1),
            t.drawRect(8, 8, jv.game_width / 2 - 16, 24),
            t.endFill(),
            jv.loading_bar = new PIXI.Graphics,
            jv.loading_text = jv.text("Loading 0%", {
                font: "10px Verdana",
                fill: 16777215,
                lineJoin: "round",
                stroke: 6710886,
                strokeThickness: 1
            }),
            jv.loading_text.y = -16,
            jv.loading_text_sprite = new PIXI.Sprite,
            jv.loading_text_sprite.addChild(jv.loading_text),
            jv.loading_text_sprite.scale.x = 2,
            jv.loading_text_sprite.scale.y = 2,
            jv.loading_container = new PIXI.Container,
            jv.loading_container.addChild(t),
            jv.loading_container.addChild(jv.loading_bar),
            jv.loading_container.addChild(jv.loading_text_sprite),
            jv.loading_container.x = jv.game_width / 2 - jv.loading_container.width / 2,
            jv.loading_container.y = jv.game_height / 2 - jv.loading_container.height / 2,
            jv.add(jv.loading_container),
            player_container = jv.scene(),
        phone && (AndroidFullScreen.showUnderStatusBar(),
            AndroidFullScreen.showUnderSystemUI(),
            AndroidFullScreen.immersiveMode()),
            load_sounds()
    };
var load_progress = function(e, t) {
        var i = Math.ceil(e.progress);
        e.progress >= 99 && (i = 100),
            jv.loading_text.text = "Loading " + i + "%";
        var o = e.progress * Math.abs(jv.loading_container.width - 8) / 100;
        jv.loading_bar.beginFill(43520, 1),
            jv.loading_bar.drawRect(4, 4, o, 32),
            jv.loading_bar.endFill(),
            jv.loading_bar.beginFill(56576, 1),
            jv.loading_bar.drawRect(8, 8, Math.abs(o - 8), 24),
            jv.loading_bar.endFill(),
            jv.loading_bar.beginFill(13434828, 1),
            jv.loading_bar.drawRect(8, 8, Math.abs(o - 8), 4),
            jv.loading_bar.endFill()
    },
    dist = function(e, t) {
        return Math.sqrt(e * e + t * t)
    },
    send = function(e) {
        connection.send(JSON.stringify(e))
    },
    show_console = function() {
        jv.stage.addChild(jv.chat_box),
            jv.chat_box.gfx.alpha = 0
    },
    build_doll = function(e, t, i, o, a, n) {
        var r = new PIXI.Container,
            s = jv.sprite(path + "data/body/b" + e + ".png" + vt),
            l = jv.sprite(path + "data/body/e1.png" + vt),
            d = jv.sprite(path + "data/clothes/c" + t + "_a.png" + vt);
        if (clothes_fixed.indexOf(t) != -1)
            var c = jv.sprite(path + "data/clothes/c" + t + "_b.png" + vt);
        var _ = jv.sprite(path + "data/hair/h" + o + "_a.png" + vt);
        if (hair_fixed.indexOf(o) != -1)
            var p = jv.sprite(path + "data/hair/h" + o + "_b.png" + vt);
        if (hair_front.indexOf(Number(o)) != -1)
            var u = jv.sprite(path + "data/hair/h" + o + "_c.png" + vt);
        return r.addChild(s),
            l.tint = n,
            r.addChild(l),
            d.tint = i,
            r.addChild(d),
        c && r.addChild(c),
        clothes_hooded.indexOf(Number(t)) == -1 && (_.tint = a,
            r.addChild(_),
        p && r.addChild(p)),
        u && (u.tint = a,
            r.addChild(u)),
            jv.spritesheet(jv.renderer.generateTexture(r), 18, 26)
    },
    update_inventory = function() {
        var e, t, i;
        for (e in inv)
            inv[e].clear_item();
        for (e in item_data)
            e >= item_page * item_length && e < (item_page + 1) * item_length && "undefined" != typeof item_data[e].slot && (t = item_data[e].slot - item_page * item_length,
                inv[t].draw_item(item_data[e].n, item_data[e].qty, item_data[e].spr, item_data[e].eqp, "#" + item_data[e].col),
            "undefined" != typeof info_pane.slot && e == info_pane.slot && info_pane.set_info(inv[t])),
            "undefined" != typeof info_pane.slot && "undefined" == typeof item_data[e].slot && e == info_pane.slot && info_pane.set_info();
        for (update_recipes(),
                 update_build(),
                 e = 0; e < 6; e++)
            item_data[jv.hot_slot[e]] && "undefined" != typeof item_data[jv.hot_slot[e]].slot ? (item_data[jv.hot_slot[e]].spr < 0 ? jv.hot_button[e].graphic.texture = tiles[-item_data[jv.hot_slot[e]].spr % 16][Math.floor(-item_data[jv.hot_slot[e]].spr / 16)] : jv.hot_button[e].graphic.texture = items[item_data[jv.hot_slot[e]].spr % 16][Math.floor(item_data[jv.hot_slot[e]].spr / 16)],
                jv.hot_button[e].visible = 1,
                item_data[jv.hot_slot[e]].qty > 1 ? jv.hot_button[e].qty_text.text = item_data[jv.hot_slot[e]].qty : (i = jv.hot_button[e].main_color,
                    jv.hot_button[e].main_color = jv.color_dark,
                    1 === item_data[jv.hot_slot[e]].eqp ? jv.hot_button[e].qty_text.text = "E" : 2 === item_data[jv.hot_slot[e]].eqp ? (jv.hot_button[e].qty_text.text = "E",
                        jv.hot_button[e].main_color = 8912896) : jv.hot_button[e].qty_text.text = "",
                i !== jv.hot_button[e].main_color && (jv.hot_button[e].clear_item(),
                    jv.hot_button[e].draw_item()))) : (jv.hot_button[e].graphic.texture = items[0][0],
                jv.hot_button[e].visible = 0)
    },
    update_recipes = function() {
        build_data = JSON.parse(jv.raw_build_data);
        for (o in build_data) {
            build_data[o].total = 0;
            for (n in build_data[o].r)
                build_data[o].total += build_data[o].r[n]
        }
        var e, t, i, o, a, n, r = [],
            s = [],
            l = ["fire", "stone_axe", "stone_pickaxe", "bone_dagger", "grass_band"];
        for (o in build_data) {
            t = 1,
                i = 0;
            for (n in build_data[o].r) {
                e = build_data[o].r[n] <= 10 ? 1 : 0;
                for (a in item_data)
                    item_data[a].tpl == n && (i = 1,
                        e = item_data[a].qty >= build_data[o].r[n] ? 2 : 1);
                if (0 == e) {
                    t = -1;
                    break
                }
                1 == e && (t = 0)
            }
            i || (t = -1),
            t == -1 && l.indexOf(build_data[o].t) !== -1 && (t = 0),
                0 == t ? r.push(build_data[o]) : 1 == t && (build_data[o].can_make = 1,
                    s.push(build_data[o]))
        }
        r.sort(function(e, t) {
            return e.total - t.total
        }),
            s.sort(function(e, t) {
                return e.total - t.total
            }),
            build_data = s.concat(r)
    },
    update_build = function() {
        var e, t = build_data;
        build_data.length <= build_page * build_length && (build_page = 0);
        for (e in bld)
            bld[e].clear_item();
        var i = 0;
        for (e in t)
            e >= build_page * build_length && e < (build_page + 1) * build_length && (bld[e - build_page * build_length].template = t[e].t,
                bld[e - build_page * build_length].build_type = t[e].c,
                bld[e - build_page * build_length].can_pickup = t[e].p,
                t[e].can_make ? bld[e - build_page * build_length].draw_item(t[e].n, 1, t[e].s, 0, "#" + t[e].col) : bld[e - build_page * build_length].draw_item(t[e].n, 0, t[e].s, 0, "#" + t[e].col)),
            jv.build_dialog.info.obj && jv.build_dialog.info.template == t[e].t && t[e].can_make && (i = 1);
        !i && jv.build_dialog.info.obj && jv.build_dialog.info.obj.build && jv.build_dialog.info.set_info(),
            0 == build_page ? build_pane.prev.visible = !1 : build_pane.prev.visible = !0,
            build_data.length <= (build_page + 1) * build_length ? build_pane.next.visible = !1 : build_pane.next.visible = !0
    },
    romanize = function(e) {
        var t, i = {
                M: 1e3,
                CM: 900,
                D: 500,
                CD: 400,
                C: 100,
                XC: 90,
                L: 50,
                XL: 40,
                X: 10,
                IX: 9,
                V: 5,
                IV: 4,
                I: 1
            },
            o = "";
        for (t in i)
            for (; e >= i[t];)
                o += t,
                    e -= i[t];
        return o
    },
    inbounds = function(e, t) {
        return !(e < -1 || e > MAP_WIDTH || t < -1 || t > MAP_HEIGHT)
    },
    getkey = function(e, t) {
        return 1e4 * e + t
    },
    occupied = function(e, t, i) {
        if (!inbounds(e, t))
            return 1;
        var o = map[loc2tile(e, t)];
        if (void 0 == o || void 0 == o.spr)
            return 1;
        if (325 == o.spr || cur_wall && o.spr == cur_wall)
            return 1;
        var a = 0;
        if (mobs.process(function(o) {
            if (o.id !== i && o.x === e && o.y === t)
                return void(a = 1)
        }),
            a)
            return 1;
        var n = map_index[getkey(e, t)];
        return n && n.block ? 1 : 0
    },
    do_mob_title = function(e) {
        e.title = jv.text(e.name.toString(), {
            font: "12px Verdana",
            fill: 14540253,
            stroke: 6710886,
            lineJoin: "round",
            strokeThickness: 2,
            align: "center"
        }),
            e.title.yoff = -5,
            e.title.xoff = e.title.width / 2,
            e.title.alpha = 0,
            e.monster_sprite.interactive = !0,
            e.monster_sprite.mouseover = function(t) {
                e.title.alpha = 1
            },
            e.monster_sprite.mouseout = function(t) {
                e.title.alpha = 0
            },
            hover_container.addChild(e.title),
            player_container.addChild(e.monster_sprite),
            e.monster_sprite.do_click = function() {
                info_pane.set_info(e),
                    select = 0
            },
            e.monster_sprite.on("mouseup", e.monster_sprite.do_click),
            e.monster_sprite.on("touchend", e.monster_sprite.do_click),
            e.monster_sprite.on("mousedown", function() {
                select = 1
            }),
            e.monster_sprite.on("touchstart", function() {
                select = 1
            }),
            e.monster_sprite.on("mouseupoutside", function() {
                select = 0
            }),
            e.monster_sprite.on("touchendoutside", function() {
                select = 0
            })
    },
    hex_to_int = function(e) {
        var t = e.substr(0, 2) + e.substr(2, 2) + e.substr(4, 2);
        return parseInt(t, 16)
    },
    rgb_to_int = function(e, t, i) {
        return (e << 16) + (t << 8) + i
    },
    color_limit = function(e, t) {
        if (void 0 !== e) {
            t = t || 50;
            var i = e >> 16 & 255,
                o = e >> 8 & 255,
                a = 255 & e,
                n = Math.floor(t - (Math.min(i, o, a) + Math.max(i, o, a)) / 2);
            return n > 0 && (i = Math.min(i + n, 255),
                o = Math.min(o + n, 255),
                a = Math.min(a + n, 255)),
                rgb_to_int(i, o, a)
        }
    },
    do_player_title = function(e) {
        e.title = jv.text((e.prefix || "") + e.name.toString(), {
            font: "12px Verdana",
            fill: e.title_color,
            lineJoin: "round",
            stroke: 2236962,
            strokeThickness: 4,
            align: "center"
        }),
            e.title.xoff = e.title.width / 2,
            e.title.yoff = -10;
        var t = e.body_sprite;
        t || (t = e.monster_sprite),
            t.interactive = !0,
            t.mouseover = function(t) {
                var i = e.name + " Lvl " + e.level;
                "" !== e.tribe && (i += "\n" + e.tribe + " Tribe "),
                    e.title.text = i.trim(),
                    e.title.xoff = e.title.width / 2,
                    e.title.yoff = -18,
                    e.title.x = e.spr.x - e.title.xoff + e.halfx,
                    e.title.y = e.spr.y + e.title.yoff
            },
            t.mouseout = function(t) {
                e.title.text = (e.prefix || "") + e.name.toString().trim(),
                    e.title.xoff = e.title.width / 2,
                    e.title.yoff = -10,
                    e.title.x = e.spr.x - e.title.xoff + e.halfx,
                    e.title.y = e.spr.y + e.title.yoff
            },
            hover_container.addChild(e.title),
            player_container.addChild(t),
            t.do_click = function() {
                info_pane.set_info(e),
                    select = 0
            },
            t.on("mouseup", t.do_click),
            t.on("touchend", t.do_click),
            t.on("mousedown", function() {
                select = 1
            }),
            t.on("touchstart", function() {
                select = 1
            }),
            t.on("mouseupoutside", function() {
                select = 0,
                e.id == me && (jv.mouse.y < 140 ? (e.dir = 0,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })) : jv.mouse.x > 440 ? (e.dir = 1,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })) : jv.mouse.y > 276 ? (e.dir = 2,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })) : jv.mouse.x < 310 && (e.dir = 3,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })))
            }),
            t.on("touchendoutside", function(t) {
                select = 0;
                var i = t.data.global.x,
                    o = t.data.global.y;
                e.id == me && (o < 130 ? (e.dir = 0,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })) : i > 420 ? (e.dir = 1,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })) : o > 240 ? (e.dir = 2,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })) : i < 320 && (e.dir = 3,
                    send({
                        type: "m",
                        x: e.x,
                        y: e.y,
                        d: e.dir
                    })))
            })
    },
    pos2tile = function(e, t) {
        return (e + jv.update_x) * jv.update_map_height + 1 * (t + jv.update_y)
    },
    tile_sprite = function(e, t) {
        var i = pos2tile(e, t);
        return map[i] ? 218 === map[i].spr ? 3 : 215 === map[i].spr || 248 === map[i].spr ? 2 : 36 === map[i].spr || 21 === map[i].spr ? 1 : 0 : 0
    },
    get_edge = function(e, t, i) {
        var o = tile_sprite(e, t),
            a = tile_sprite(e, t - 1),
            n = tile_sprite(e + 1, t),
            r = tile_sprite(e, t + 1),
            s = tile_sprite(e - 1, t);
        if (1 === o)
            return edges[0][1];
        var l = 0;
        return o || 2 !== a && 2 !== n && 2 !== r && 2 !== s ? o || 3 !== a && 3 !== n && 3 !== r && 3 !== s || (l = 4) : l = 2,
        o === a && (a = 0),
        o === n && (n = 0),
        o === r && (r = 0),
        o === s && (s = 0),
            a && n && r && s ? edges[15][l] : a && n && r ? edges[14][l] : a && n && s ? edges[7][l] : a && r && s ? edges[11][l] : n && r && s ? edges[13][l] : a && r ? edges[10][l] : a && n ? edges[6][l] : a && s ? edges[3][l] : n && s ? edges[5][l] : n && r ? edges[12][l] : s && r ? edges[9][l] : a ? edges[1][l] : n ? edges[4][l] : r ? edges[8][l] : s ? edges[2][l] : edges[0][1]
    },
    make_covers = function() {
        wall_sprite.texture = tiles[cur_wall % 16][Math.floor(cur_wall / 16)],
            wall_sprite.tint = 16777215;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRect(0, 0, 32, 32),
            e.endFill(),
            wall_sprite.mask = e,
            4 == jv.pixiver ? (cover[0] = jv.renderer.generateTexture(wall_sprite),
                cover[1] = jv.renderer.generateTexture(wall_sprite),
                cover[2] = jv.renderer.generateTexture(wall_sprite),
                cover[4] = jv.renderer.generateTexture(wall_sprite),
                cover[5] = jv.renderer.generateTexture(wall_sprite),
                cover[8] = jv.renderer.generateTexture(wall_sprite),
                cover[10] = jv.renderer.generateTexture(wall_sprite)) : (cover[0] = wall_sprite.generateTexture(jv.renderer),
                cover[1] = wall_sprite.generateTexture(jv.renderer),
                cover[2] = wall_sprite.generateTexture(jv.renderer),
                cover[4] = wall_sprite.generateTexture(jv.renderer),
                cover[5] = wall_sprite.generateTexture(jv.renderer),
                cover[8] = wall_sprite.generateTexture(jv.renderer),
                cover[10] = wall_sprite.generateTexture(jv.renderer)),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(0, 0, 16, 16),
            e.drawRect(0, 16, 16, 16),
            e.drawRect(16, 0, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[6] = wall_sprite.generateTexture(jv.renderer) : cover[6] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(0, 0, 16, 16),
            e.drawRect(0, 16, 16, 16),
            e.drawRect(16, 16, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[3] = wall_sprite.generateTexture(jv.renderer) : cover[3] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215, 1),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(16, 0, 16, 16),
            e.drawRect(0, 16, 16, 16),
            e.drawRect(16, 16, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[9] = wall_sprite.generateTexture(jv.renderer) : cover[9] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(16, 0, 16, 16),
            e.drawRect(0, 0, 16, 16),
            e.drawRect(16, 16, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[12] = wall_sprite.generateTexture(jv.renderer) : cover[12] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(0, 16, 16, 16),
            e.drawRect(16, 16, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[11] = wall_sprite.generateTexture(jv.renderer) : cover[11] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(0, 0, 16, 16),
            e.drawRect(16, 0, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[14] = wall_sprite.generateTexture(jv.renderer) : cover[14] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(0, 0, 16, 16),
            e.drawRect(0, 16, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[7] = wall_sprite.generateTexture(jv.renderer) : cover[7] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.drawRect(16, 0, 16, 16),
            e.drawRect(16, 16, 16, 16),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[13] = wall_sprite.generateTexture(jv.renderer) : cover[13] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null;
        var e = new PIXI.Graphics;
        e.beginFill(16777215),
            e.drawRoundedRect(0, 0, 32, 32, 6),
            e.endFill(),
            wall_sprite.mask = jv.sprite(jv.renderer.generateTexture(e)),
            3 == jv.pixiver ? cover[15] = wall_sprite.generateTexture(jv.renderer) : cover[15] = jv.renderer.generateTexture(wall_sprite),
            e.destroy(),
            e = null
    },
    update_edges = function() {
        edge_container.cacheAsBitmap && (edge_container.cacheAsBitmap = !1),
            edge_container.edges = 0;
        var e, t, i = 0;
        for (e = -jv.update_x; e < jv.update_x; e++)
            for (t = -jv.update_y; t < jv.update_y; t++) {
                if (map[i].edge.texture = get_edge(e, t, map[i].spr),
                    map[i].edge.texture == edges[0][1] ? map[i].edge.visible = 0 : (edge_container.edges++,
                        map[i].edge.visible = 1),
                "" !== dlevel)
                    if (cur_wall && map[i].spr == cur_wall) {
                        map[i].tint = 5592422;
                        var o = 0,
                            a = map[i + 1];
                        a && a.spr != map[i].spr && (o += 4,
                            a.tint = 11184810);
                        var a = map[i - 1];
                        a && a.spr != map[i].spr && (o += 1);
                        var a = map[i + 26];
                        a && a.spr != map[i].spr && (o += 2);
                        var a = map[i - 26];
                        a && a.spr != map[i].spr && (o += 8),
                            map[i].cover.texture = cover[o],
                            map[i].cover.visible = 1
                    } else {
                        map[i].cover.visible = 0;
                        var a = map[i - 1];
                        a && a.spr !== cur_wall && (map[i].tint = 16777215)
                    } else
                    map[i].cover.texture != tiles[0][0] && (map[i].cover.visible = 0);
                i += 1
            }
    };
jv.update_map = function(mapData) {
    mapData.x - jv.update_x - mx,
    mapData.y - jv.update_y - my;
    mx = mapData.x - jv.update_x,
        my = mapData.y - jv.update_y,
        map_container.x = 32 * mx + 32 * jv.update_x,
        map_container.y = 32 * my + 32 * jv.update_y,
        edge_container.x = map_container.x,
        edge_container.y = map_container.y,
        anim_map_container.x = map_container.x,
        anim_map_container.y = map_container.y,
    object_container.cacheAsBitmap && (object_container.cacheAsBitmap = !1,
        anim1_container.cacheAsBitmap = !1,
        anim2_container.cacheAsBitmap = !1),
    map_container.cacheAsBitmap && (map_container.cacheAsBitmap = !1,
        anim_map_container.cacheAsBitmap = !1),
        anim_map_container.animations = 0;
    var t, i, j, a, n, r, relative_cord, l = mapData.tiles.split(":"),
        d = 0,
        c = [],
        _ = [];
    for (i = -jv.update_x; i < jv.update_x; i++)
        for (j = -jv.update_y; j < jv.update_y; j++) {
            if (l[d] ? (t = l[d].split("_"),
                _[d] = Number(t.shift())) : (_[d] = 0,
                t = []),
                325 == _[d] ? (map[d].anim.visible = 1,
                    anim_map_container.animations++) : map[d].anim.visible = 0,
            19 == _[d] && (_[d] = cave_floor),
            112 == _[d] && (_[d] = cave_wall),
                map[d].texture = tiles[_[d] % 16][Math.floor(_[d] / 16)],
                map[d].tint = 16777215,
                map[d].spr = _[d],
                map[d].cover.x = 32 * i + map_container.x,
                map[d].cover.y = 32 * j + map_container.y - 20,
                map[d].cover.ry = map[d].cover.y + 32,
                relative_cord = 1e4 * (mapData.x + i) + (mapData.y + j),
                r = map_index[relative_cord]) {
                if (r.template === l[d]) {
                    r.update = now,
                        d += 1;
                    continue
                }
                for (a in r.o)
                    c.push(r.o[a])
            } else
                map_index[relative_cord] = {},
                    r = map_index[relative_cord];
            r.o = [],
                r.update = now,
                r.template = l[d],
                r.block = 0;
            for (a in t)
                n = jv.Object.create(),
                    n.template = t[a],
                    n.x = mapData.x + i,
                    n.y = mapData.y + j,
                    n.name = object_dict[n.template].name,
                    n.description = object_dict[n.template].description,
                    n.build = object_dict[n.template].build,
                n.buildup() || (n.sprite = object_dict[n.template].sprite,
                    n.sprite < 0 ? n.obj_sprite = jv.sprite(tiles[-n.sprite % 16][Math.floor(-n.sprite / 16)]) : n.obj_sprite = jv.sprite(items[n.sprite % 16][Math.floor(n.sprite / 16)]),
                    n.obj_sprite.x = 32 * n.x,
                    n.obj_sprite.y = 32 * n.y,
                    object_container.addChild(n.obj_sprite)),
                    n.can_block = object_dict[n.template].can_block,
                    n.can_stack = object_dict[n.template].can_stack,
                    n.can_pickup = object_dict[n.template].can_pickup,
                n.can_block && (r.block = 1),
                    r.o.push(n),
                    objects.add(n);
            d += 1
        }
    for (a in map_index)
        if (map_index[a].update !== now) {
            for (d in map_index[a].o)
                c.push(map_index[a].o[d]);
            delete map_index[a]
        }
    var p = c.length;
    for (a = 0; a < p; a++)
        c[a].cleanup();
    update_edges(),
    jv.transition && (jv.transition = 2),
        update_sort = 1
},
    recheck_caches = function() {
        object_container.cacheAsBitmap || (object_container.children.length && (object_container.cacheAsBitmap = !0),
        anim1_container.children.length && (anim1_container.cacheAsBitmap = !0),
        anim2_container.children.length && (anim2_container.cacheAsBitmap = !0)),
        map_container.cacheAsBitmap || (map_container.cacheAsBitmap = !0,
        anim_map_container.animations && (anim_map_container.cacheAsBitmap = !0)), !edge_container.cacheAsBitmap && edge_container.edges && (edge_container.cacheAsBitmap = !0)
    },
    update_container = function() {
        master_container.x = hero_x + 132 - myself.spr.x + myself.xoffset,
            master_container.y = hero_y + -32 - myself.spr.y + myself.yoffset
    };
var playSound = function(e) {
        var t = Math.floor(Math.random() * sound[e].length);
        sound[e][t].volume(jv.sound_volume),
            sound[e][t].play()
    },
    fadeSong = function(e) {
        if (e && e.playing()) {
            e.fade(option_dialog.music_slider.percent / 100, 0, 2e3);
            var t = e;
            setTimeout(function() {
                t.playing() && jv.current_song != t && (t.stop(),
                    t.volume(option_dialog.music_slider.percent / 100))
            }, 3e3)
        }
    };
jv.songEnd = function(e) {},
    jv.songFade = function(e) {},
    jv.songStop = function(e) {},
    jv.songLoaded = function(e) {},
    jv.songError = function(e, t) {};
var playMusic = function(e, t, i) {
    if (!(i && jv.current_song && jv.current_song.playing() || i && jv.last_song == e || music[e] && music[e].playing())) {
        if (e && "undefined" == typeof music[e] && (phone ? music[e] = new Howl({
            src: ["http://www.mysteralegacy.com/music/" + e + ".webm", "http://www.mysteralegacy.com/music/" + e + ".mp3"],
            autoplay: !1,
            loop: !0,
            html5: !0,
            preload: !0,
            volume: jv.music_volume,
            onload: jv.songLoaded,
            onloaderror: jv.songError,
            onstop: jv.songStop,
            onend: jv.songEnd,
            onfade: jv.songFade
        }) : music[e] = new Howl({
            src: ["//www.mysteralegacy.com/music/" + e + ".webm", "//www.mysteralegacy.com/music/" + e + ".mp3"],
            autoplay: !1,
            loop: !1,
            html5: !0,
            preload: !0,
            xhrWithCredentials: !0,
            volume: jv.music_volume,
            onload: jv.songLoaded,
            onloaderror: jv.songError,
            onstop: jv.songStop,
            onend: jv.songEnd,
            onfade: jv.songFade
        }),
            music[e].on("load", function() {
                i || this.loop(!0)
            }),
            music[e].on("play", function() {
                "rpgtitle" == e && (game_state == GAME_PLAYING || jv.current_song && jv.current_song != music[e]) ? music[e].stop() : "rpgtitle" !== e && music.rpgtitle && music.rpgtitle.playing() ? music.rpgtitle.stop() : jv.current_song && jv.current_song !== music[e] && music[e].stop()
            })), !e || "undefined" == typeof music[e])
            return jv.playlist = null,
            jv.current_song && fadeSong(jv.current_song),
                void(jv.current_song = null);
        if (jv.current_song && fadeSong(jv.current_song),
            jv.current_song = music[e],
            jv.last_song = e,
            jv.current_song.stop(),
        0 != option_dialog.music_slider.percent) {
            var o = jv.current_song.play();
            i && jv.current_song.loop(!1, o),
            t || jv.current_song.fade(0, option_dialog.music_slider.percent / 100, 2e3)
        }
    }
};
String.prototype.capitalize = function() {
    return this.replace(/\w\S*/g, function(e) {
        return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
    })
},
    String.prototype.replaceAll = function(e, t) {
        var i = this;
        return i.split(e).join(t)
    },
    confirmLeave = function(e) {
        return jv.before_blur(),
            has_focus = 1,
            "Really close this page?"
    },
    getMob = function(e) {
        return mob_ref[e] || (mob_ref[e] = mobs.fetch(e, "id"),
        mob_ref[e] && (mob_ref[e].ref = mob_ref)),
            mob_ref[e]
    },
    getObj = function(e) {
        return obj_ref[e] || (obj_ref[e] = objects.fetch(e, "id"),
        obj_ref[e] && (obj_ref[e].ref = obj_ref)),
            obj_ref[e]
    },
    mob_x = function(e) {
        return -effect_container.x + e.sx + e.halfx
    },
    mob_y = function(e) {
        return -effect_container.y + e.sy + e.halfy
    },
    jv.before_blur = function() {
        has_focus = 0;
        var e;
        for (e in jv.key_array)
            jv.key_array[e].isDown && (jv.key_array[e].release && jv.key_array[e].release(),
                jv.key_array[e].isDown = 0,
                jv.key_array[e].isUp = 1);
        action && !space_toggle && (action = 0,
            space_timer = now,
            send({
                type: "a"
            })),
        dest != -1 && (send({
            type: "h",
            x: this.x,
            y: this.y
        }),
            dest = -1)
    },
    jv.prevent = function(e) {
        return editing || jv.current_input && jv.current_input.hasFocus ? 0 : (e.preventDefault(),
            1)
    };
var loc2tile = function(e, t) {
        return (e - mx) * jv.update_map_height + 1 * (t - my)
    },
    tile2x = function(e) {},
    append = function(e) {
        jv.chat_box.append(e),
        jv.chat_fade.lines.length || (jv.chat_fade.offset = 0,
            jv.chat_fade.line_container.y = 0),
            jv.chat_fade.append(e)
    };
jv.ChatBubble = {
    create: function(e, t, i) {
        var o = jv.sprite();
        return e = e.replace(/&quot;/g, '"'),
            e = e.replace(/&amp;/g, "&"),
            e = e.replace(/&lt;/g, "<"),
            e = e.replace(/&gt;/g, ">"),
            "number" == typeof t ? (o.fixed = 1,
                o.x = 32 * t + 16,
                o.y = 32 * i - 4) : (o.x = t.spr.x + t.halfx,
                o.y = t.spr.y - 6,
                t.bubble = this,
                o.talker = t),
            o.life = Date.now(),
            o.max_life = 50 * e.length,
            o.max_life < 3e3 ? o.max_life = 3e3 : o.max_life > 8e3 && (o.max_life = 8e3),
        o.fixed && (o.max_life += 1e3),
            o.gfx = new PIXI.Graphics,
            o.gfx.x = 0,
            o.gfx.y = 0,
            o.addChild(o.gfx),
            o.title = jv.text(e, {
                font: "14px Verdana",
                fill: 16777215,
                stroke: 6710886,
                strokeThickness: 2,
                lineJoin: "round",
                wordWrap: !0,
                wordWrapWidth: 240,
                padding: 5
            }),
            o.title.x = 4 - o.title.width / 2 - 4,
            o.title.y = 3 - o.title.height - 8,
            o.gfx.x = 0 - o.title.width / 2 - 6,
            o.gfx.y = 0 - o.title.height - 8,
            o.addChild(o.title),
            hover_container.addChild(o),
            o.check = setInterval(function() {
                if (!o.fixed) {
                    if (!o.talker || !o.talker.monster_sprite && !o.talker.body_sprite)
                        return void o.cleanup();
                    o.talker.bubble !== this && (o.x = o.talker.spr.x + o.talker.halfx,
                        o.y = o.talker.spr.y - 6)
                }
                now - o.life > o.max_life && o.cleanup()
            }, 20),
            o.draw = function() {
                var e = this.title.width + 13,
                    t = this.title.height + 6,
                    i = [0, 0, e, 0, e, t, e / 2 + 4, t, e / 2, t + 4, e / 2 - 4, t, 0, t, 0, 0];
                this.gfx.clear(),
                    this.gfx.beginFill(3355460, .3),
                    this.gfx.lineStyle(3, 7829384, .5),
                    this.gfx.drawPolygon(i),
                    this.gfx.lineStyle(1, 15658751, .5),
                    this.gfx.drawPolygon(i),
                    this.gfx.endFill()
            },
            o.cleanup = function() {
                null !== this.title && this.title.parent.removeChild(this.title),
                    this.title = null,
                    this.gfx.parent.removeChild(this.gfx),
                    this.gfx = null,
                    clearInterval(this.check),
                this.fixed || this.talker.bubble != this || (this.talker.bubble = null),
                    delete this
            },
            o.draw(),
            o
    }
},
    jv.StatusBar = {
        create: function(e, t) {
            var i = jv.sprite();
            return i.max = 100,
                i.val = 75,
                i.color = t,
                i.x = jv.game_width - 140,
                i.y = 320,
                i.gfx = new PIXI.Graphics,
                i.gfx.x = 0,
                i.gfx.y = 0,
                i.addChild(i.gfx),
                i.title = jv.text(e, {
                    font: "10px Verdana",
                    fill: 16777215,
                    lineJoin: "round",
                    stroke: jv.color_dark,
                    strokeThickness: 4
                }),
                i.title.x = 4,
                i.title.y = -8,
                i.addChild(i.title),
                ui_container.addChild(i),
                i.draw = function() {
                    this.gfx.clear(),
                        this.gfx.lineStyle(2, jv.color_dark, 0),
                        this.gfx.beginFill(jv.color_base, 1),
                        this.gfx.drawRect(0, 0, 100, 10),
                        this.gfx.endFill(),
                        this.gfx.beginFill(this.color, 1),
                        this.gfx.drawRect(0, 0, 100 * this.val / 100, 10),
                        this.gfx.endFill(),
                        this.gfx.beginFill(15658734, .2),
                        this.gfx.drawRect(0, 0, 100 * this.val / 100, 5),
                        this.gfx.endFill(),
                        this.gfx.lineStyle(2, jv.color_light, .9),
                        this.gfx.drawRoundedRect(0, 0, 100, 10, 4),
                        this.gfx.moveTo(0, 10),
                        this.gfx.lineTo(100, 10)
                },
                i.set = function(e) {
                    this.val = e,
                        this.draw()
                },
                i.cleanup = function() {},
                i
        }
    },
    jv.HPBar = {
        create: function(e, t) {
            var i = jv.sprite();
            return i.player = e,
                e.hpbar = this,
                e.spr ? (i.x = e.spr.x + 2,
                    i.y = e.spr.y + 0,
                    i.w = e.spr.width - 4) : (i.x = i.player.obj_sprite.x + 2,
                    i.x = i.player.obj_sprite.y + 7,
                    i.w = 28),
                i.life = Date.now(),
                i.max_life = 4e3,
                i.max = 1e3,
                i.val = t,
                i.chaser = t,
                i.color = 65280,
                i.gfx = new PIXI.Graphics,
                i.gfx.x = 0,
                i.gfx.y = 0,
                i.addChild(i.gfx),
                hover_container.addChild(i),
                i.check = setInterval(function() {
                    return i.player && (i.player.monster_sprite || i.player.body_sprite || i.player.obj_sprite) ? (i.player.spr || (i.x = i.player.obj_sprite.x + 2,
                        i.y = i.player.obj_sprite.y + 7),
                    i.chaser !== i.val && (i.chaser < i.val && (i.chaser += 12,
                    i.chaser > i.val && (i.chaser = i.val)),
                    i.chaser > i.val && (i.chaser -= 12,
                    i.chaser < i.val && (i.chaser = i.val)),
                        i.draw()),
                        void(Date.now() - i.life > i.max_life && i.chaser == i.val && (i.alpha -= .05,
                        i.alpha <= 0 && i.cleanup()))) : void i.cleanup()
                }, 20),
                i.draw = function() {
                    this.gfx.clear(),
                        this.gfx.beginFill(0, .6),
                        this.gfx.drawRect(0, 0, this.w, 6),
                        this.gfx.endFill(),
                    this.chaser > this.val && (this.gfx.beginFill(16711680, 1),
                        this.gfx.lineStyle(0, 16777215),
                        this.gfx.drawRect(this.val * this.w / 1e3, 0, this.chaser * this.w / 1e3 - this.val * this.w / 1e3, 6),
                        this.gfx.endFill()),
                        this.gfx.beginFill(this.color, 1),
                        this.gfx.lineStyle(0, 16777215),
                        this.gfx.drawRect(0, 0, this.val * this.w / 1e3, 6),
                        this.gfx.endFill(),
                        this.gfx.beginFill(15658734, .5),
                        this.gfx.lineStyle(0, 16777215),
                        this.gfx.drawRect(0, 0, this.val * this.w / 1e3, 3),
                        this.gfx.endFill(),
                    this.chaser < this.val && (this.gfx.beginFill(16777215, 1),
                        this.gfx.lineStyle(0, 16777215),
                        this.gfx.drawRect(this.val * this.w / 1e3, 0, this.chaser * this.w / 1e3 - this.val * this.w / 1e3, 6),
                        this.gfx.endFill()),
                        this.gfx.lineStyle(2, 12303291, 1),
                        this.gfx.drawRect(0, 0, this.w, 6)
                },
                i.set = function(e) {
                    this.val = e,
                        this.alpha = 1,
                        this.life = Date.now(),
                        this.draw()
                },
                i.cleanup = function() {
                    this.player && this.player.hpbar == this && (this.player.hpbar = null),
                        this.gfx.parent.removeChild(this.gfx),
                        this.gfx = null,
                        clearInterval(this.check),
                    this.player.hpbar == this && (this.player.hpbar = null),
                        delete this
                },
                i.draw(),
                i
        }
    },
    jv.Entity = {
        create: function() {
            var e = {};
            return e.x = 0,
                e.y = 0,
                e.dx = 0,
                e.dy = 0,
                e.fromx = 0,
                e.fromy = 0,
                e.sx = 0,
                e.sy = 0,
                e.flip = 0,
                e.dir = 0,
                e.last_dir = -1,
                e.frame = 0,
                e.foot = 1,
                e.body = 0,
                e.body_sprite = null,
                e.hair = 0,
                e.hair_sprite = null,
                e.clothes = 0,
                e.clothes_sprite = null,
                e.name = "",
                e.title = null,
                e.chat_sprite = null,
                e.chat_dots = null,
                e.sprite = 0,
                e.spr = null,
                e.monster_sprite = null,
                e.walking = 0,
                e.speed = 750,
                e.tile_speed = 0,
                e.net_tile_speed = 0,
                e.bonus = 0,
                e.cur_speed = e.speed,
                e.traveled = 0,
                e.travel_start = 0,
                e.last_check = new Date,
                e.now = e.last_check,
                e.updated = 0,
                e.tweenx = 0,
                e.tweeny = 0,
                e.xoffset = 4,
                e.yoffset = -16,
                e.still = function() {
                    return this.fromx == this.x && this.fromy == this.y
                },
                e.move = function(oX, oY) {
                    return this.fromx = this.x,
                        this.fromy = this.y,
                        this.x > oX ? this.dir = 3 : this.x < oX ? this.dir = 1 : this.y > oY ? this.dir = 0 : this.y < oY && (this.dir = 2),
                        this.id == me && (space_toggle && (space_toggle = 0,
                            ph_action.gfx.tint = 16777215,
                            jv.action_button.tint = jv.color_base,
                            space_timer = now),
                            keyCtrl.isDown) ? void(this.last_dir !== this.dir && (send({
                            type: "m",
                            x: this.x,
                            y: this.y,
                            d: this.dir
                        }),
                            this.last_dir = this.dir)) : (this.id !== me && (this.traveled = 0),
                            this.id == me && occupied(oX, oY, this.id) ? void(this.last_dir !== this.dir && (send({
                                type: "m",
                                x: this.x,
                                y: this.y,
                                d: this.dir
                            }),
                                this.last_dir = this.dir,
                            dest !== -1 && (send({
                                type: "h",
                                x: this.x,
                                y: this.y
                            }),
                                dest = -1))) : (this.x = oX,
                                this.y = oY,
                                this.last_dir = this.dir,
                                void(this.id == me && (dest == -1 || this.dir !== dest || Date.now() - last_dest >= 1e3) && (send({
                                    type: "h",
                                    x: this.fromx,
                                    y: this.fromy,
                                    d: this.dir
                                }),
                                    last_ping = Date.now(),
                                    dest = this.dir,
                                    last_dest = Date.now()))))
                },
                e.set_sprite = function() {
                    null !== this.monster_sprite ? this.spr = this.monster_sprite : this.spr = this.body_sprite
                },
                e.update_pos = function() {
                    this.spr.x = 32 * this.fromx + this.tweenx + this.xoffset,
                        this.spr.y = 32 * this.fromy + this.tweeny + this.yoffset,
                        this.title.x = this.spr.x - this.title.xoff + this.halfx,
                        this.title.y = this.spr.y + this.title.yoff,
                        this.chat_sprite.x = this.spr.x + this.halfx - 8,
                        this.chat_sprite.y = this.spr.y + this.title.yoff - 12,
                    this.id == target.id && (target.x = this.spr.x + this.halfx,
                        target.y = this.spr.y + this.spr.height - 2),
                    this.bubble && (this.bubble.x = this.spr.x + this.halfx,
                        this.bubble.y = this.spr.y - 6),
                    this.hpbar && (this.hpbar.x = this.spr.x + 2,
                        this.hpbar.y = this.spr.y + 0),
                    this.sy != this.spr.y && (this.spr.ry = this.spr.y + this.spr.height,
                        update_sort = 1),
                        this.sx = this.spr.x,
                        this.sy = this.spr.y
                },
                e.check_chat_indicator = function() {
                    this.chat_sprite.visible && (this.chat_dots.alpha = Math.floor(now / 400) % 2)
                },
                e.update = function() {
                    this.still() ? (this.check_chat_indicator(),
                    this.id == me && (jv.transition || (keyRight.isDown || keyD.isDown ? this.move(this.x + 1, this.y) : keyLeft.isDown || keyA.isDown ? this.move(this.x - 1, this.y) : keyDown.isDown || keyS.isDown ? this.move(this.x, this.y + 1) : keyUp.isDown || keyW.isDown ? this.move(this.x, this.y - 1) : dest != -1 && (send({
                        type: "h",
                        x: this.x,
                        y: this.y
                    }),
                        dest = -1)),
                        keyShift.isDown ? ph_pickup.is_pressed || (ph_pickup.clear_item(),
                            ph_pickup.draw_item(1),
                            ph_pickup.is_pressed = 1,
                            ph_pickup.key_press = 1) : ph_pickup.is_pressed && ph_pickup.key_press && (ph_pickup.clear_item(),
                            ph_pickup.draw_item(),
                            ph_pickup.is_pressed = 0,
                            ph_pickup.key_press = 0),
                        keySpace.isDown ? (action ? space_toggle && (space_toggle = 0,
                            ph_action.gfx.tint = 16777215,
                            jv.action_button.tint = jv.color_base,
                            space_timer = now) : (space_timer = now,
                            space_toggle = 0,
                            ph_action.clear_item(),
                            ph_action.draw_item(1),
                            ph_action.gfx.tint = 16777215,
                            jv.action_button.tint = jv.color_base,
                            action = 1,
                            send({
                                type: "A"
                            })),
                        now - space_timer >= 2500 && 1131605 !== jv.action_button.tint && (ph_action.gfx.tint = 13434879,
                            jv.action_button.tint = 1131605,
                            ph_action.clear_item(),
                            ph_action.draw_item(1))) : action && !space_toggle && (now - space_timer < 2500 ? (action = 0,
                            space_timer = now,
                            send({
                                type: "a"
                            }),
                            ph_action.clear_item(),
                            ph_action.draw_item()) : (space_toggle = 1,
                            space_timer = now))),
                        this.moved = 0) : (this.traveled += Date.now() - this.last_check,
                    this.traveled >= this.cur_speed && (this.traveled -= this.cur_speed,
                    this.traveled >= this.cur_speed && (this.traveled = 0),
                        this.travel_start = this.traveled,
                        this.fromx = this.x,
                        this.fromy = this.y,
                        this.frame = 1,
                        this.foot = -this.foot),
                        this.traveled >= (this.cur_speed - this.travel_start) / 2 + this.travel_start ? this.frame = 1 + this.foot : this.frame = 1,
                        this.tweenx = Math.floor((this.x - this.fromx) * (this.traveled / this.cur_speed) * 32),
                        this.tweeny = Math.floor((this.y - this.fromy) * (this.traveled / this.cur_speed) * 32),
                    this.traveled == this.cur_speed && (this.traveled = 0),
                        this.update_pos(),
                        this.moved = 1), (this.dir < 0 || this.dir > 3) && (this.dir = 0),
                        null !== this.monster_sprite && monster[this.sprite][this.frame][this.dir] != this.spr.texture ? this.spr.texture = monster[this.sprite][this.frame][this.dir] : null !== this.body_sprite && this.sheet[this.frame][this.dir] != this.body_sprite.texture && (this.body_sprite.texture = this.sheet[this.frame][this.dir]),
                        this.last_check = Date.now()
                },
                e.cleanup = function() {
                    mob_ref[this.id] = null,
                    target.id == this.id && (target.id = me,
                        target.visible = !1,
                        info_pane.set_info()),
                    null !== this.monster_sprite && (null !== this.title && this.title.parent.removeChild(this.title),
                        this.title = null,
                        this.monster_sprite.parent.removeChild(this.monster_sprite),
                        this.monster_sprite = null),
                    null !== this.body_sprite && (null !== this.title && this.title.parent.removeChild(this.title),
                        this.title = null,
                        this.body_sprite.parent.removeChild(this.body_sprite),
                        this.clothes_sprite = null,
                        this.hair_sprite = null,
                        this.body_sprite = null),
                    null !== this.chat_sprite && (null !== this.chat_dots && this.chat_dots.parent.removeChild(this.chat_dots),
                        this.chat_sprite.parent.removeChild(this.chat_sprite)),
                        this.chat_sprite = null,
                        this.chat_dots = null,
                        mobs.remove(this)
                },
                e
        }
    },
    jv.buildup_object = function(e) {
        if (!e.build || 0 == e.build.length)
            return 0;
        null !== e.obj_sprite && (e.obj_sprite.parent.removeChild(e.obj_sprite),
            e.obj_sprite = null);
        var t;
        for (t in e.other)
            null !== e.other[t] && (e.other[t].parent.removeChild(e.other[t]),
                e.other[t] = null);
        e.other = [];
        var i, o, a, n, r, s, l, d, c = e.build.indexOf("a") !== -1,
            _ = e.build.split(","),
            p = e.x,
            u = e.y,
            h = 0,
            v = 0,
            g = 0;
        for (t in _)
            i = 0,
                o = 0,
                "n" === _[t] ? u-- : "s" === _[t] ? u++ : "w" === _[t] ? p-- : "e" === _[t] ? p++ : (_[t].indexOf("b") !== -1 && (e.can_block = 1,
                    _[t] = _[t].replace("b", "")),
                _[t].indexOf("f") !== -1 && (i = 1,
                    _[t] = _[t].replace("f", "")),
                _[t].indexOf("a") !== -1 && (o = 1,
                    _[t] = _[t].replace("a", "")),
                _[t].indexOf("o") !== -1 && (s = _[t].split(""),
                    l = s.indexOf("o"),
                    d = s.indexOf("|", l),
                    v = s.splice(l, d - l + 1),
                    v.pop(),
                    v.shift(),
                    v = Number(v.join("")),
                    _[t] = s.join("")),
                _[t].indexOf("t") !== -1 && (s = _[t].split(""),
                    l = s.indexOf("t"),
                    d = s.indexOf("|", l),
                    a = s.splice(l, d - l + 1),
                    a.pop(),
                    a.shift(),
                    a = Number("0x" + a.join("")),
                    _[t] = s.join("")),
                _[t].indexOf("q") !== -1 && (s = _[t].split(""),
                    l = s.indexOf("q"),
                    d = s.indexOf("|", l),
                    n = s.splice(l, d - l + 1),
                    n.pop(),
                    n.shift(),
                    n = Number(n.join("")),
                    _[t] = s.join("")),
                    _[t] = Number(_[t]),
                isNaN(_[t]) && (_[t] = 858),
                    r = _[t] < 0 ? jv.sprite(tiles[-_[t] % 16][Math.floor(-_[t] / 16)]) : jv.sprite(items[_[t] % 16][Math.floor(_[t] / 16)]),
                    r.x = 32 * p,
                    r.y = 32 * u + v,
                    r.ordering = g,
                v && (v = 0),
                a && (r.tint = a,
                    a = void 0),
                n && (r.alpha = n,
                    n = void 0),
                    0 == g ? (e.sprite = _[t],
                        e.obj_sprite = r,
                        i ? (h++,
                            r.ry = r.y + 32,
                            player_container.addChild(r),
                            update_sort = 1) : c ? o ? anim2_container.addChild(r) : anim1_container.addChild(r) : object_container.addChild(r)) : (r.base = e.obj_sprite,
                        e.other.push(r),
                        i ? (r.foreground = !0,
                            h++,
                            r.ry = (r.base.y > r.y ? r.base.y : r.y) + 32,
                        h > 1 && (r.ry += h),
                            player_container.addChild(r),
                            update_sort = 1,
                            debug_obj = r) : c ? o ? anim2_container.addChild(r) : anim1_container.addChild(r) : object_container.addChild(r)),
                    g += 1);
        return 1
    },
    jv.cleanup_object = function(e) {
        obj_ref[e.id] = null,
            delete obj_ref[e.id],
            object_container.cacheAsBitmap = !1,
        null !== e.obj_sprite && e.obj_sprite.parent.removeChild(e.obj_sprite);
        var t;
        for (t in e.other)
            null !== e.other[t] && e.other[t].parent.removeChild(e.other[t]);
        e.hpbar && e.hpbar.cleanup(),
            objects.remove(e)
    },
    jv.Object = {
        create: function(e, t) {
            var i = {};
            return i.template = "",
                i.name = "",
                i.owner = -1,
                i.x = -1,
                i.y = -1,
                i.sprite = 8,
                i.obj_sprite = null,
                i.other = [],
                i.can_block = 0,
                i.update = function() {},
                i.buildup = function() {
                    return jv.buildup_object(this)
                },
                i.cleanup = function() {
                    jv.cleanup_object(this)
                },
                i
        }
    },
    jv.Effect = {
        create: function(e, t) {
            var i = {};
            return i.template = "",
                i.x = e,
                i.y = t,
                i.life = 100,
                i.frame = 0,
                i.started = 0,
                i.created = Date.now(),
                i.p = [],
                i.start = function() {},
                i.particle = function() {
                    var e = new PIXI.Graphics;
                    return e.created = Date.now(),
                        e.move = function() {},
                        e.life = 50,
                        e.frame = 0,
                        e.x = this.x,
                        e.y = this.y,
                        effect_container.addChild(e),
                        this.p.push(e),
                        e
                },
                i.circle = function(e, t) {
                    var i = this.particle();
                    return i.lineStyle(0),
                        i.beginFill(e, .4),
                        i.drawCircle(0, 0, t),
                        i.beginFill(e, .9),
                        i.drawCircle(0, 0, t - 1),
                        i.endFill(),
                        i
                },
                i.text = function(e, t) {
                    void 0 == t && (t = {
                        font: "12px Verdana",
                        lineJoin: "round",
                        fill: 15658734
                    });
                    var i = jv.text(e, t);
                    return i.created = Date.now(),
                        i.move = function() {},
                        i.life = 50,
                        i.frame = 0,
                        i.x = this.x,
                        i.y = this.y,
                        effect_container.addChild(i),
                        this.p.push(i),
                        i
                },
                i.sprite = function(e) {
                    if (e < 0)
                        var t = jv.sprite(tiles[-e % 16][Math.floor(-e / 16)]);
                    else
                        var t = jv.sprite(items[e % 16][Math.floor(e / 16)]);
                    return t.created = Date.now(),
                        t.move = function() {},
                        t.life = 50,
                        t.frame = 0,
                        t.position.x -= 16,
                        t.position.y -= 16,
                        t.x = this.x,
                        t.y = this.y,
                        t.anchor.x = .5,
                        t.anchor.y = .5,
                        effect_container.addChild(t),
                        this.p.push(t),
                        t
                },
                i.run = function() {},
                i.update = function() {
                    this.started || (this.start(),
                        this.started = 1),
                        this.run(this.p[e]);
                    for (var e in this.p)
                        this.p[e].x += this.p[e].dx,
                            this.p[e].y += this.p[e].dy,
                            this.move(this.p[e]),
                            this.p[e].frame++,
                        this.p[e].frame >= this.p[e].life && (void 0 !== this.p[e].clear && this.p[e].clear(),
                            this.p[e].parent.removeChild(this.p[e]),
                            delete this.p[e]);
                    this.frame++,
                    this.frame > this.life && this.cleanup()
                },
                i.cleanup = function() {
                    for (var e in this.p)
                        void 0 !== this.p[e].clear && this.p[e].clear(),
                            this.p[e].parent.removeChild(this.p[e]),
                            delete this.p[e];
                    effects.remove(this)
                },
                i
        }
    },
    jv.InventorySlot = {
        create: function(e, t, i, o) {
            var a = jv.sprite();
            return o || (o = ui_container),
                a.slot = i,
                a.z = i + 50,
                a.interactive = !0,
                a.do_touch = function(e) {
                    this.build || this.texture == tiles[0][0] || (this.scale.x = 2,
                        this.scale.y = 2,
                        this.do_drag(),
                        this.do_touch_move(e))
                },
                a.do_touch_move = function(e) {
                    touching += 1,
                        touchx = e.data.getLocalPosition(this.parent).x,
                        touchy = e.data.getLocalPosition(this.parent).y,
                    drag == this && (drag.x = touchx - 32,
                        drag.y = touchy - 42)
                },
                a.do_click = function() {
                    if (this.texture != tiles[0][0]) {
                        if (drag) {
                            var e, t = 0,
                                i = 16,
                                o = 16;
                            touching && (i = 32,
                                o = 42);
                            for (var a = 0; a < item_length; a++)
                                if (this.slot != a && this.x + i > inv[a].x + t && this.x + i < inv[a].x + 32 + t && this.y + o > inv[a].y && this.y + o < inv[a].y + 32) {
                                    e = a;
                                    break
                                }
                            if (this.x < -32 && this.x > -1e3)
                                send({
                                    type: "d",
                                    slot: this.slot + item_page * item_length,
                                    amt: drop_amt
                                });
                            else if (void 0 !== e && e !== this.slot && (!touching || touching > 100)) {
                                send({
                                    type: "sw",
                                    slot: this.slot + item_page * item_length,
                                    swap: e + item_page * item_length
                                });
                                var n = this.title.text,
                                    r = this.quantity,
                                    s = this.sprite,
                                    l = this.equip;
                                this.clear_item(),
                                void 0 !== inv[e].sprite && this.draw_item(inv[e].title.text, inv[e].quantity, inv[e].sprite, inv[e].equip),
                                    inv[e].clear_item(),
                                void 0 !== s && inv[e].draw_item(n, r, s, l);
                                var d = inv[e]
                            }
                            drag.reset_drag(),
                                drag = void 0
                        }
                        if (this.build)
                            return void jv.build_dialog.info.set_info(this);
                        this.texture != tiles[0][0] && info_pane.set_info(this),
                        d && info_pane.set_info(d),
                            touching = 0
                    }
                },
                a.do_drag = function() {
                    this.build || this.texture == tiles[0][0] || (drag && drag.reset_drag(),
                        drag = this,
                        this.qty_text.visible = !1,
                        this.title.visible = !1,
                        this.z = 100,
                        this.parent.children.sort(zCompare))
                },
                a.reset_drag = function() {
                    this.scale.x = 1,
                        this.scale.y = 1,
                        this.x = this.ox,
                        this.y = this.oy,
                        this.z = this.slot + 50,
                        this.qty_text.visible = !0,
                        this.title.visible = !0
                },
                a.mouse_over = function(e) {
                    this.title.alpha = 1,
                        this.scale.x = 1.1,
                        this.scale.y = 1.1
                },
                a.mouse_out = function(e) {
                    this.title.alpha = 0,
                        this.scale.x = 1,
                        this.scale.y = 1
                },
                a.on("mouseover", a.mouse_over),
                a.on("mouseout", a.mouse_out),
                a.on("mouseup", a.do_click),
                a.on("mouseupoutside", a.do_click),
                a.on("touchend", a.do_click),
                a.on("touchendoutside", a.do_click),
                a.on("mousedown", a.do_drag),
                a.on("touchstart", a.do_touch),
                a.on("touchmove", a.do_touch_move),
                a.x = e,
                a.y = t,
                a.ox = e,
                a.oy = t,
                a.quantity = 0,
                a.qty_text = jv.text("", {
                    font: "10px Verdana",
                    fill: 16777215,
                    lineJoin: "round",
                    stroke: jv.color_medium,
                    strokeThickness: 4
                }),
                a.qty_text.x = 0,
                a.qty_text.y = 22,
                a.addChild(a.qty_text),
                a.title = jv.text("", {
                    font: "9px Verdana",
                    fill: 16777215,
                    lineJoin: "round",
                    stroke: jv.color_medium,
                    strokeThickness: 3
                }),
                a.title.x = 16 - a.title.width / 2,
                a.title.y = -8,
                a.title.alpha = 0,
                a.equip = 0,
                a.sprite = void 0,
                a.gfx = new PIXI.Graphics,
                a.gfx.x = a.x - 1,
                a.gfx.y = a.y - 1,
                a.gfx.z = a.slot,
                a.clear_item = function() {
                    this.texture = tiles[0][0],
                        this.tint = 16777215,
                        this.sprite = void 0,
                        this.qty_text.text = "",
                        this.title.text = "",
                        this.gfx.clear(),
                        this.gfx.beginFill(jv.color_light, 1),
                        this.gfx.drawRect(0, 0, 32, 32, 1),
                        this.gfx.endFill(),
                        this.gfx.lineStyle(2, jv.color_bright, 1),
                        this.gfx.beginFill(jv.color_light, 0),
                        this.gfx.moveTo(32, 32),
                        this.gfx.lineTo(32, 0),
                        this.gfx.moveTo(32, 32),
                        this.gfx.lineTo(0, 32),
                        this.gfx.lineStyle(2, jv.color_dark, 1),
                        this.gfx.moveTo(0, 0),
                        this.gfx.lineTo(32, 0),
                        this.gfx.moveTo(0, 0),
                        this.gfx.lineTo(0, 32),
                        this.gfx.endFill()
                },
                a.draw_item = function(e, t, i, o, a) {
                    e && (i < 0 ? this.texture = tiles[-i % 16][Math.floor(-i / 16)] : this.texture = items[i % 16][Math.floor(i / 16)],
                        this.quantity = t,
                    this.quantity > 1 && (this.qty_text.text = this.quantity),
                    this.quantity || (this.tint = 5592405),
                        this.title.text = e,
                        this.title.x = 16 - this.title.width / 2,
                        this.equip = o,
                        this.sprite = i,
                    1 != o && 2 != o || (1 == o && (this.gfx.lineStyle(0, 7829384, 0),
                        this.gfx.beginFill(65535, .1),
                        this.gfx.drawRoundedRect(1, 1, 31, 31, 2),
                        this.gfx.endFill(),
                        this.gfx.beginFill(4521983, .2),
                        this.gfx.drawCircle(16, 16, 12),
                        this.gfx.endFill()),
                        1 == o ? this.gfx.lineStyle(2, 7454404, .9) : this.gfx.lineStyle(2, 10027008, .8),
                        this.gfx.drawRoundedRect(1, 0, 31, 32, 2)))
                },
                o.addChild(a.gfx),
                o.addChild(a),
                a.addChild(a.title),
                a.parent.children.sort(zCompare),
                a
        }
    },
    jv.loop = function() {
        if (now = Date.now(),
        "ready" == jv.state) {
            if (show_fps && (jv.fps.text = "FPS: " + Math.round(jv.fps_num)),
            jv.mouseDown && jv.mouse.y < 416 && (inputting || editing) && editor.blur(),
            jv.transition && (1 === jv.transition ? (map_fade.alpha += .03,
                map_fade.visible = 1,
            map_fade.alpha >= 1 && (map_fade.alpha = 1)) : (map_fade.alpha -= .02,
            map_fade.alpha <= 0 && (jv.map_title.alpha = .8,
                jv.map_title.timer = now,
                map_fade.alpha = 0,
                map_fade.visible = 0,
                jv.transition = 0))),
            jv.map_title.alpha > 0 && now - jv.map_title.timer > 1e3 && (jv.map_title.alpha -= .01,
            jv.map_title.alpha <= 0 && (jv.map_title.alpha = 0)),
                game_fade.alpha < fade_to ? (game_fade.alpha += .01,
                game_fade.alpha >= fade_to && (game_fade.alpha = fade_to)) : game_fade.alpha > fade_to && (game_fade.alpha -= .01,
                game_fade.alpha <= fade_to && (game_fade.alpha = fade_to)),
            skill_status.alpha && now - skill_status.timer > 2600 && (skill_status.alpha -= .02,
            skill_status.alpha <= 0 && (skill_status.interactive = !1)),
            drag && !touching && (drag.x = jv.mouse.x - 596,
                drag.y = jv.mouse.y - 16),
            jv.upgrade_number !== jv.upgrade_current) {
                0 == jv.upgrade_add.alpha && jv.upgrade_number > jv.upgrade_current && (jv.upgrade_add.text = "+" + (jv.upgrade_number - jv.upgrade_current),
                    jv.upgrade_add.x = 569 - jv.upgrade_add.width,
                    jv.upgrade_add.alpha = .8,
                    jv.upgrade_timer = now),
                    jv.upgrade_number > jv.upgrade_current + 1e4 ? jv.upgrade_current += 1e3 : jv.upgrade_number > jv.upgrade_current + 1e3 ? jv.upgrade_current += 100 : jv.upgrade_number > jv.upgrade_current + 100 ? jv.upgrade_current += 10 : jv.upgrade_number > jv.upgrade_current ? jv.upgrade_current++ : jv.upgrade_number < jv.upgrade_current - 1e4 ? jv.upgrade_current -= 1e3 : jv.upgrade_number < jv.upgrade_current - 1e3 ? jv.upgrade_current -= 100 : jv.upgrade_number < jv.upgrade_current - 100 ? jv.upgrade_current -= 10 : jv.upgrade_number < jv.upgrade_current && jv.upgrade_current--;
                var e = "00000000" + String(jv.upgrade_current);
                jv.upgrade_counter.text = e.substr(e.length - 8),
                    jv.upgrade_counter.x = 569 - jv.upgrade_counter.width
            } else
                now - jv.upgrade_timer > 2e3 && jv.upgrade_add.alpha > 0 && (jv.upgrade_add.alpha -= .04,
                jv.upgrade_add.alpha < 0 && (jv.upgrade_add.alpha = 0));
            effects.process(function(e) {
                e.update()
            }),
                mobs.process(function(e) {
                    e.update()
                }),
            myself && myself.moved && update_container(),
            update_sort && now - last_sort > 500 && (player_container.children.sort(sortCompare),
                update_sort = 0,
                last_sort = now),
            now - animation_timer > 500 && (animation_timer = now,
                anim_map_container.visible = !anim_map_container.visible,
                anim1_container.visible = !anim1_container.visible,
                anim2_container.visible = !anim2_container.visible),
                is_chatting ? input_field.hasFocus && "say" === jv.toggle_chat.mode && "/" != input_field.chars[0] && input_field.chars.length || (is_chatting = 0,
                    send({
                        type: "c",
                        r: "c0"
                    })) : input_field.hasFocus && "say" == jv.toggle_chat.mode && "/" !== input_field.chars[0] && input_field.chars.length && (is_chatting = 1,
                    send({
                        type: "c",
                        r: "c1"
                    }));
            var t;
            for (t = 0; t < jv.chat_fade.lines.length; t++)
                if (jv.chat_fade.lines[t].timer = jv.chat_fade.lines[t].timer + 1 || 1,
                jv.chat_fade.lines[t].timer > 600 && (jv.chat_fade.lines[t].alpha -= .02),
                jv.chat_fade.lines[t].alpha <= 0) {
                    var i = jv.chat_fade.lines.shift();
                    jv.chat_fade.line_container.removeChild(i),
                        jv.chat_fade.offset += i.height + jv.chat_fade.line_space,
                        i = null
                }
            jv.chat_fade.line_container.y > -jv.chat_fade.offset && (jv.chat_fade.line_container.y -= 2)
        }
    };
var parse = function(json) {
        if ("zip" === json.type) {
            var i, packets = JSON.parse(jv.unzip(json.data));
            if (void 0 !== packets.type)
                parse(packets);
            else
                for (i = 0; i < packets.length; i++)
                    parse(JSON.parse(packets[i]))
        } else if ("pkg" === json.type) {
            var i, packets = JSON.parse(json.data);
            for (i = 0; i < packets.length; i++)
                parse(JSON.parse(packets[i]))
        } else if ("logmsg" === json.type)
            jv.login_dialog.notice.text = json.text,
                jv.login_dialog.notice.w = 0,
                jv.login_dialog.notice.center(),
                jv.login_dialog.okay.enable(1),
                jv.login_dialog.create.enable(1),
                jv.login_dialog.worlds.enable(1),
                jv.login_dialog.guest.enable(1);
        else if ("crtmsg" === json.type)
            jv.create_dialog.notice.text = json.text,
                jv.create_dialog.notice.w = 0,
                jv.create_dialog.notice.center(),
                jv.create_dialog.okay.enable(1),
                jv.create_dialog.login.enable(1);
        else if ("mload" === json.type)
            ;
        else if ("music" === json.type)
            playMusic(json.m, 0, json.s);
        else if ("P" === json.type)
            ;
        else if ("accepted" === json.type) {
            if (json.created)
                return Cookies.set("ml_user", jv.base64_encode(jv.create_dialog.username.chars), {
                    expires: 730
                }),
                    Cookies.set("ml_pass", jv.base64_encode(jv.create_dialog.password.chars), {
                        expires: 730
                    }),
                    jv.choose_name.visible = 0,
                    jv.login_dialog.username.setText(jv.create_dialog.username.chars),
                    jv.login_dialog.password.setText(jv.create_dialog.password.chars),
                    jv.create_dialog.visible = 0,
                    jv.create_dialog.okay.enable(1),
                    jv.create_dialog.login.enable(1),
                    jv.create_dialog.notice.text = "",
                    void(myName = jv.create_dialog.username.chars);
            json.guest ? (Cookies.set("ml_user", jv.base64_encode(json.name), {
                expires: 730
            }),
                Cookies.set("ml_pass", jv.base64_encode(jv.base64_encode(json.pass)), {
                    expires: 730
                }),
                jv.login_dialog.username.setText(json.name),
                jv.login_dialog.password.setText(jv.base64_encode(json.pass)),
                jv.login_dialog.guest.visible = 0) : jv.login_dialog.visible && jv.login_dialog.username.chars ? (Cookies.set("ml_user", jv.base64_encode(jv.login_dialog.username.chars), {
                expires: 730
            }),
                Cookies.set("ml_pass", jv.base64_encode(jv.login_dialog.password.chars), {
                    expires: 730
                }),
                jv.login_dialog.username.setText(jv.login_dialog.username.chars),
                jv.login_dialog.password.setText(jv.login_dialog.password.chars)) : jv.create_dialog.visible && jv.create_dialog.username.chars && (Cookies.set("ml_user", jv.base64_encode(jv.create_dialog.username.chars), {
                expires: 730
            }),
                Cookies.set("ml_pass", jv.base64_encode(jv.create_dialog.password.chars), {
                    expires: 730
                }),
                jv.login_dialog.username.setText(jv.create_dialog.username.chars),
                jv.login_dialog.password.setText(jv.create_dialog.password.chars)),
                jv.create_dialog.notice.text = "",
                jv.login_dialog.notice.text = "",
                splash.visible = 0,
                jv.login_dialog.hide(),
                jv.create_dialog.hide(),
                me = json.id,
                ui_container.visible = 1,
                static_container.visible = 1,
                game_fade.visible = 1,
                game_state = GAME_PLAYING,
                jv.login_dialog.username.blur(),
                jv.login_dialog.password.blur(),
                window.onbeforeunload = confirmLeave,
                MAP_WIDTH = json.mw,
                MAP_HEIGHT = json.mh,
                tile_speed = JSON.parse(JSON.stringify(json.tile)),
                myName = json.name;
            var input_field = document.getElementById("input_field");
            input_field && input_field.blur(),
                fade_to = 0,
                fadeSong(music.rpgtitle)
        } else if ("death" === json.type)
            myName = "",
                family = "",
                me = -1,
                window.onbeforeunload = null,
                myself = void 0,
                game_fade.visible = 1,
                fade_to = 1,
                splash.visible = 0,
                jv.login_dialog.hide(),
                jv.spawn_dialog.death.text = json.death.replace(/(<([^>]+)>)/gi, ""),
                jv.spawn_dialog.dust.text = json.angel_dust,
                jv.spawn_dialog.show();
        else if ("quit" === json.type)
            has_quit = 1,
                connection.close(),
                show_reconnect("");
        else if ("fade" === json.type)
            fade_to = json.f;
        else if ("pass" === json.type)
            ;
        else if ("message" === json.type) {
            if (json.text = unescape(json.text),
            void 0 !== json.id) {
                var talker = getMob(json.id);
                talker && (talker.bubble = jv.ChatBubble.create(json.text, talker),
                    json.text = talker.name + ": <span style='color:#e8e87d'>" + json.text + "</span>")
            } else if ("undefined" != typeof json.x)
                return jv.ChatBubble.create(json.text, json.x, json.y),
                    void(json.sound && playSound(json.sound));
            append(json.text),
            void 0 !== json.error && (jv.disconnect_error = json.error)
        } else if ("script" === json.type)
            document.getElementById("script_code").style.display = "",
                document.getElementById("script_name").style.display = "",
                document.getElementById("script_name").value = json.name,
                editor.setValue(json.script),
                editor.clearSelection();
        else if ("mt" === json.type)
            jv.transition = 1,
                map_fade.alpha = 1,
                json.s ? jv.map_title.tint = 8978312 : jv.map_title.tint = 16777215,
                jv.map_title.alpha = 0,
                dest = -1,
                last_dest = Date.now(),
                json.m ? playMusic(json.m) : playMusic(),
            json.w && (MAP_WIDTH = json.w),
            json.h && (MAP_HEIGHT = json.h),
                jv.map_title.text = json.t,
                jv.map_title.x = Math.floor(378 - jv.map_title.width / 2),
                dlevel = json.n,
            cave_wall != json.c && (cave_wall = json.c,
                cur_wall = cur_cover = cave_wall,
                make_covers()),
                cave_floor = json.f;
        else if ("mi" === json.type)
            ;
        else if ("obj_tpl" === json.type) {
            var tpl = {};
            tpl.name = json.name,
                tpl.description = json.desc,
                tpl.can_stack = json.stack,
                tpl.can_pickup = json.pickup,
                tpl.can_block = json.block,
                tpl.sprite = json.spr,
                tpl.build = json.build,
                object_dict[json.tpl] = tpl,
                objects.process(function(e) {
                    e.template == json.tpl && e.cleanup()
                })
        } else if ("plr_tpl" === json.type) {
            var tpl = {};
            tpl.name = json.n,
                tpl.tribe = json.t,
                tpl.level = json.l,
                void 0 == json.p ? tpl.title_color = 15724527 : tpl.title_color = json.p,
                tpl.premium = json.pr,
            myself && json.id == myself.id && (jv.premium = json.pr,
            jv.dialog_costume && (jv.dialog_costume.diamonds.text = jv.premium || 0), (jv.premium || tpl.level >= 15) && (jv.costume_button.visible = !0)),
                tpl.sprite = json.s,
                tpl.body = json.b,
                tpl.hair = json.h,
                tpl.hair_color = json.hc,
                tpl.clothes = json.c,
                tpl.clothes_color = json.cc,
                tpl.eye_color = json.ec,
                tpl.id = json.id,
            tpl.body && tpl.body != -1 && (tpl.sheet = build_doll(tpl.body, tpl.clothes, tpl.clothes_color, tpl.hair, tpl.hair_color, tpl.eye_color)),
                player_dict[json.id] = tpl,
                mobs.process(function(e) {
                    e.template == json.id && e.cleanup()
                })
        } else if ("fx_tpl" === json.type)
            eval("var ob = " + json.code),
                effect_dict[json.tpl] = ob;
        else if ("fx" === json.type) {
            var ef = jv.Effect.create(),
                ob = effect_dict[json.tpl];
            ef.sound = json.s,
                ef.x = 32 * json.x + 16,
                ef.y = 32 * json.y,
                ef.dir = json.d,
                ef.start = ob.start,
                ef.run = ob.run,
                ef.move = ob.move,
            has_focus && effects.add(ef),
            void 0 !== sound[ef.sound] && playSound(ef.sound)
        } else if ("obj" === json.type) {
            object_container.cacheAsBitmap && (object_container.cacheAsBitmap = !1,
                anim1_container.cacheAsBitmap = !1,
                anim2_container.cacheAsBitmap = !1),
                objects.process(function(e) {
                    e.updated = 0
                });
            for (var i = 0; i < json.data.length; i++)
                parse(JSON.parse(json.data[i]));
            var to_cleanup = [];
            objects.process(function(e) {
                0 === e.updated && to_cleanup.push(e)
            });
            for (var len = to_cleanup.length, i = 0; i < len; i++)
                to_cleanup[i].cleanup()
        } else if ("pl" === json.type) {
            mobs.process(function(e) {
                e.updated = 0
            });
            for (var i = 0; i < json.data.length; i++)
                parse(JSON.parse(json.data[i]));
            var to_cleanup = [];
            mobs.process(function(e) {
                0 == e.updated && to_cleanup.push(e)
            });
            for (var len = to_cleanup.length, i = 0; i < len; i++)
                to_cleanup[i].cleanup()
        } else if ("o" === json.type) {
            object_container.cacheAsBitmap && (object_container.cacheAsBitmap = !1,
                anim1_container.cacheAsBitmap = !1,
                anim2_container.cacheAsBitmap = !1),
                json.x = Number(json.x),
                json.y = Number(json.y);
            var key = getkey(json.x, json.y);
            delete map_index[key],
                map_index[key] = {};
            var tile_index = map_index[key];
            tile_index.o = [],
                tile_index.update = now,
                tile_index.template = json.d,
                tile_index.block = 0;
            var to_cleanup = [];
            objects.process(function(e) {
                e.x === json.x && e.y === json.y && to_cleanup.push(e)
            });
            var i, len = to_cleanup.length;
            for (i = 0; i < len; i++)
                to_cleanup[i].cleanup();
            var obj = json.d.split("|");
            "" == obj[0] && (obj = []);
            for (i in obj)
                object = jv.Object.create(),
                    object.template = obj[i],
                    object.x = Number(json.x),
                    object.y = Number(json.y),
                    object.name = object_dict[object.template].name,
                    object.description = object_dict[object.template].description,
                    object.build = object_dict[object.template].build,
                object.buildup() || (object.sprite = object_dict[object.template].sprite,
                    object.sprite < 0 ? object.obj_sprite = jv.sprite(tiles[-object.sprite % 16][Math.floor(-object.sprite / 16)]) : object.obj_sprite = jv.sprite(items[object.sprite % 16][Math.floor(object.sprite / 16)]),
                    object.obj_sprite.x = 32 * object.x,
                    object.obj_sprite.y = 32 * object.y,
                    object_container.addChild(object.obj_sprite)),
                    object.can_block = object_dict[object.template].can_block,
                    object.can_stack = object_dict[object.template].can_stack,
                    object.can_pickup = object_dict[object.template].can_pickup,
                object.can_block && (tile_index.block = 1),
                    tile_index.o.push(object),
                    objects.add(object)
        } else if ("mp" === json.type)
            jv.mapping_dialog.show();
        else if ("stat" === json.type) {
            var i;
            for (i in json.obj)
                jv.stat_dialog[i] && (jv.stat_dialog[i].text = json.obj[i])
        } else if ("upg" === json.type)
            jv.upgrades = JSON.parse(JSON.stringify(json.obj)),
                jv.upgrade_dialog.do_update(),
                jv.upgrade_dialog.show();
        else if ("reinc" === json.type)
            jv.reinc = JSON.parse(JSON.stringify(json.obj)),
                jv.reincarnate_dialog.do_update();
        else if ("abc" === json.type) {
            if (!jv.ability[json.i])
                return;
            jv.ability[json.i].activate()
        } else if ("abl" === json.type) {
            jv.abl = JSON.parse(JSON.stringify(json.obj));
            var i;
            for (i = 0; i < jv.abl.length || i < jv.ability.length; i++)
                jv.abl[i] ? (jv.ability[i] ? jv.ability[i].spr !== jv.abl[i].spr && (jv.ability[i].icon.texture = items[jv.abl[i].spr % 16][Math.floor(jv.abl[i].spr / 16)]) : jv.ability[i] = jv.AbilityButton.create(520 - 68 * i, 362, jv.abl[i].spr, static_container),
                jv.ability[i].ready && (Date.now() - jv.abl[i].c) / (1e3 * jv.abl[i].cd) < 1 && jv.ability[i].activate(),
                    jv.ability[i].checkerCooldown = 1e3 * jv.abl[i].cd,
                    jv.ability[i].last_click = jv.abl[i].c,
                    jv.ability[i].spr = jv.abl[i].spr,
                    jv.ability[i].ind = i,
                    jv.ability[i].do_update(),
                    jv.ability[i].visible = 1) : jv.ability[i] && (jv.ability[i].visible = 0)
        } else if ("quest" === json.type)
            jv.quest = JSON.parse(JSON.stringify(json.obj)),
                jv.quest_dialog.do_update(),
                jv.quest_dialog.show();
        else if ("skill" === json.type) {
            var i;
            jv.skills = JSON.parse(JSON.stringify(json.obj)),
                jv.skill_tier = json.tier,
                jv.skill_order = [];
            for (i in jv.skills)
                jv.skill_order.push(i);
            jv.skill_order.sort(function(e, t) {
                return jv.skills[t][2] - jv.skills[e][2]
            }),
                jv.skill_dialog.do_update(),
                jv.skill_dialog.show()
        } else if ("cb" === json.type)
            json.b && (jv.costumes.push(Number(json.b)),
                jv.costume_percent = Math.ceil(jv.costumes.length / max_costume * 100),
            jv.dialog_costume && (jv.dialog_costume.percent.text = jv.costume_percent + "%")),
            json.pr && (jv.premium = Number(json.pr),
            jv.dialog_costume && (jv.dialog_costume.diamonds.text = jv.premium || 0)),
            jv.dialog_costume && jv.dialog_costume.notice && (jv.dialog_costume.notice.text = json.r,
                jv.dialog_costume.notice.x = jv.dialog_costume.w / 2 - jv.dialog_costume.notice.width / 2,
                jv.dialog_costume.apply_button.enable(1),
                jv.dialog_costume.diamonds.text = jv.premium,
            json.b && jv.dialog_costume.update());
        else if ("costumes" === json.type)
            jv.costumes = json.c,
                jv.costume_list = json.l,
                jv.costume_percent = Math.ceil(jv.costumes.length / max_costume * 100),
            jv.dialog_costume && (jv.dialog_costume.percent.text = jv.costume_percent + "%");
        else if ("game" === json.type)
            jv.lock_body = json.lb,
                jv.lock_hair = json.lh,
                jv.lock_clothes = json.lc,
                jv.premium = json.pr,
            jv.dialog_costume && (jv.dialog_costume.diamonds.text = jv.premium || 0), (jv.premium || myself && myself.level >= 15) && (jv.costume_button.visible = !0);
        else if ("ping" === json.type)
            json.c == ping_count && (ping = Date.now() - last_ping,
                ping_count++);
        else if ("pos" === json.type) {
            var mob = getMob(me);
            mob && (json.t ? (jv.transition = 1,
                map_fade.alpha = 1,
                jv.map_title.alpha = 0,
                dest = -1,
                last_dest = Date.now()) : mob.x >= 0 && mob.y >= 0 && mob.x < MAP_WIDTH && mob.y < MAP_HEIGHT && (dest = -1),
                mob.x = json.x,
                mob.y = json.y,
                mob.fromx = json.x,
                mob.fromy = json.y,
                mob.tweenx = 0,
                mob.tweeny = 0,
                mob.traveled = 0,
                mob.last_check = Date.now(),
                mob.update_pos(),
                update_container())
        } else if ("hpp" === json.type) {
            var mob = getMob(json.id);
            mob && (mob.hpbar || (mob.hpbar = jv.HPBar.create(mob, json.o)),
                mob.hpbar.set(json.n))
        } else if ("hpo" === json.type) {
            var object;
            objects.process(function(e) {
                object || e.x != json.x || e.y != json.y || (object = e)
            }),
            object && (object.hpbar || (object.hpbar = jv.HPBar.create(object, json.o)),
                object.hpbar.set(json.n))
        } else if ("t" === json.type) {
            var mob = getMob(json.id);
            if (!mob)
                return;
            if (void 0 == player_dict[json.tpl])
                return;
            if (mob.template = json.tpl,
                mob.name = player_dict[json.tpl].name,
                mob.tribe = player_dict[json.tpl].tribe,
                mob.level = player_dict[json.tpl].level,
                mob.sprite = player_dict[json.tpl].sprite,
                mob.body = player_dict[json.tpl].body,
                mob.hair = player_dict[json.tpl].hair,
                mob.clothes = player_dict[json.tpl].clothes,
                mob.title_color = player_dict[json.tpl].title_color,
                mob.hair_color = player_dict[json.tpl].hair_color,
                mob.clothes_color = player_dict[json.tpl].clothes_color,
                mob.eye_color = player_dict[json.tpl].eye_color,
            mob.sprite !== -1) {
                mob.monster_sprite.texture = monster[mob.sprite][0][0],
                mob.monster_sprite.width < 32 && (mob.monster_sprite.scale.x = 32 / mob.monster_sprite.width),
                mob.monster_sprite.height < 32 && (mob.monster_sprite.scale.y = 32 / mob.monster_sprite.height),
                    mob.halfx = Math.floor(mob.monster_sprite.width / 2),
                    mob.halfy = Math.floor(mob.monster_sprite.height / 2),
                    mob.xoffset = 16 - mob.halfx,
                    mob.yoffset = 16 - Math.floor(mob.monster_sprite.height),
                    mob.body >= 0 ? do_player_title(mob) : (null !== mob.title && mob.title.parent.removeChild(mob.title),
                        mob.title = null,
                        do_mob_title(mob));
                var lb = mob.monster_sprite.getLocalBounds();
                mob.monster_sprite.width <= 48 ? mob.monster_sprite.hitArea = new PIXI.Rectangle(lb.x - 8, lb.y - 8, lb.width + 16, lb.height + 16) : mob.monster_sprite.hitArea = new PIXI.Rectangle(lb.x, lb.y, lb.width, lb.height)
            }
            mob.set_sprite(),
                mob.update_pos()
        } else if ("p" === json.type) {
            var mob = getMob(json.id);
            if (null !== mob)
                mob.speed = json.s,
                    mob.cur_speed = json.s, (json.id !== me || json.x == mob.x && json.y == mob.y) && (mob.last_dir = json.d,
                    mob.dir = json.d),
                    mob.chat_sprite.visible ? json.ch || (mob.chat_sprite.visible = 0) : json.ch && (mob.chat_sprite.visible = 1),
                    json.i ? mob.prefix || (mob.prefix = json.i,
                        mob.title.text = mob.prefix + mob.name,
                        mob.title.xoff = mob.title.width / 2,
                        mob.title.x = mob.spr.x - mob.title.xoff + mob.halfx) : mob.prefix && (delete mob.prefix,
                        mob.title.text = mob.name,
                        mob.title.xoff = mob.title.width / 2,
                        mob.title.x = mob.spr.x - mob.title.xoff + mob.halfx), (Math.abs(mob.x - json.x) > 1 || Math.abs(mob.y - json.y) > 1) && (json.id === me && dest != -1 || (mob.fromx = mob.x,
                    mob.fromy = mob.y,
                    mob.x = json.x,
                    mob.y = json.y,
                json.id == me && (mob.fromx = mob.x,
                    mob.fromy = mob.y,
                    mob.tweenx = 0,
                    mob.tweeny = 0,
                    mob.traveled = 0,
                    mob.last_check = Date.now(),
                    mob.update_pos(),
                    update_container())), (Math.abs(mob.x - json.x) > 4 || Math.abs(mob.y - json.y) > 4) && (mob.fromx = json.x,
                    mob.fromy = json.y,
                    mob.x = json.x,
                    mob.y = json.y,
                    mob.traveled = 0,
                json.id == me && (mob.fromx = mob.x,
                    mob.fromy = mob.y,
                    mob.tweenx = 0,
                    mob.tweeny = 0,
                    mob.traveled = 0,
                    mob.last_check = Date.now(),
                    mob.update_pos(),
                    update_container()))),
                mob.x === json.x && mob.y === json.y || json.id !== me && (mob.fromx = mob.x,
                    mob.fromy = mob.y,
                    mob.move(json.x, json.y));
            else {
                if (void 0 == player_dict[json.tpl])
                    return;
                if (mob = jv.Entity.create(),
                    mob.id = json.id,
                    mob.x = json.x,
                    mob.y = json.y,
                    mob.template = json.tpl,
                    mob.traveling = 0,
                    mob.fromx = mob.x,
                    mob.fromy = mob.y,
                    mob.dx = json.dx,
                    mob.dy = json.dy,
                    mob.speed = json.s,
                    mob.cur_speed = json.s,
                    mob.dir = json.d,
                    mob.name = player_dict[json.tpl].name,
                    mob.tribe = player_dict[json.tpl].tribe,
                    mob.level = player_dict[json.tpl].level,
                    mob.sprite = player_dict[json.tpl].sprite,
                    mob.body = player_dict[json.tpl].body,
                    mob.hair = player_dict[json.tpl].hair,
                    mob.clothes = player_dict[json.tpl].clothes,
                    mob.title_color = player_dict[json.tpl].title_color,
                    mob.hair_color = player_dict[json.tpl].hair_color,
                    mob.clothes_color = player_dict[json.tpl].clothes_color,
                    mob.eye_color = player_dict[json.tpl].eye_color,
                mob.id == me && (myself = mob, (jv.premium || myself.level >= 15) && (jv.costume_button.visible = !0)),
                    mob.moved = 1,
                mob.sprite !== -1) {
                    if (mob.monster_sprite = jv.sprite(monster[mob.sprite][0][0]),
                    mob.monster_sprite.width < 32 && (mob.monster_sprite.scale.x = 32 / mob.monster_sprite.width),
                    mob.monster_sprite.height < 32 && (mob.monster_sprite.scale.y = 32 / mob.monster_sprite.height),
                        mob.halfx = Math.floor(mob.monster_sprite.width / 2),
                        mob.halfy = Math.floor(mob.monster_sprite.height / 2),
                        mob.xoffset = 16 - mob.halfx,
                        mob.yoffset = 16 - Math.floor(mob.monster_sprite.height),
                        mob.body >= 0 ? do_player_title(mob) : do_mob_title(mob),
                    mob.monster_sprite.width <= 48) {
                        var lb = mob.monster_sprite.getLocalBounds();
                        mob.monster_sprite.hitArea = new PIXI.Rectangle(lb.x - 8, lb.y - 8, lb.width + 16, lb.height + 16)
                    }
                } else
                    mob.sheet = player_dict[json.tpl].sheet,
                        mob.body_sprite = jv.sprite(mob.sheet[0][0]),
                        mob.body_sprite.scale.x = 2,
                        mob.body_sprite.scale.y = 2,
                        mob.halfx = Math.floor(mob.body_sprite.width / 2),
                        mob.halfy = Math.floor(mob.body_sprite.height / 2),
                        mob.xoffset = 16 - mob.halfx,
                        mob.yoffset = 18 - Math.floor(mob.body_sprite.height),
                        do_player_title(mob);
                mob.set_sprite(),
                mob.chat_sprite || (mob.chat_sprite = jv.sprite(),
                    mob.chat_sprite.texture = jv.chat_say.texture,
                    mob.chat_sprite.scale.x = 2,
                    mob.chat_sprite.scale.y = 2,
                    mob.chat_sprite.visible = 0,
                    hover_container.addChild(mob.chat_sprite),
                    mob.chat_dots = new PIXI.Graphics,
                    mob.chat_dots.lineStyle(0, 1),
                    mob.chat_dots.beginFill(3355443, 1),
                    mob.chat_dots.drawRect(1.5, 3, 1, 1),
                    mob.chat_dots.drawRect(3.5, 3, 1, 1),
                    mob.chat_dots.drawRect(5.5, 3, 1, 1),
                    mob.chat_dots.endFill(),
                    mob.chat_sprite.addChild(mob.chat_dots)),
                    mob.update_pos(),
                mob.id == me && update_container(),
                    mobs.add(mob)
            }
            mob.updated = 1
        } else if ("inv" === json.type) {
            var data = json.data,
                i;
            for (i in item_data)
                item_data[i] = {};
            for (i in data)
                item_data[data[i].slot] = {},
                    item_data[data[i].slot].slot = data[i].slot,
                    item_data[data[i].slot].n = data[i].n,
                    item_data[data[i].slot].tpl = data[i].t,
                    item_data[data[i].slot].spr = data[i].spr,
                    item_data[data[i].slot].qty = data[i].qty,
                    item_data[data[i].slot].eqp = data[i].eqp,
                    item_data[data[i].slot].col = data[i].col;
            update_inventory()
        } else if ("bld" === json.type)
            json.data && (jv.raw_build_data = json.data),
                update_recipes(),
                update_build();
        else if ("remove" === json.type) {
            var mob = getMob(json.id);
            mob && mob.cleanup()
        } else if ("object" === json.type)
            ;
        else if ("tile" === json.type) {
            var c = loc2tile(json.x, json.y);
            if (!map[c])
                return;
            map_container.cacheAsBitmap && (map_container.cacheAsBitmap = !1,
                anim_map_container.cacheAsBitmap = !1),
                map[c].texture = tiles[json.tile % 16][Math.floor(json.tile / 16)],
                map[c].spr = json.tile,
                325 == json.tile ? (map[c].anim.visible = 1,
                    anim_map_container.animations++) : map[c].anim.visible = 0,
            16777215 != map[c].tint && (map[c].tint = 16777215),
                update_edges(),
                update_sort = 1
        } else if ("map" === json.type)
            jv.update_map(json);
        else if ("s" === json.type) {
            json.t && last_status !== json.t + json.k && (skill_status.timer = Date.now(),
                skill_status.interactive = !0,
                skill_status.alpha = .6,
                last_status = json.t + json.k),
            void 0 !== json.h && hp_status.set(json.h),
            void 0 !== json.k && skill_status.set(json.k),
            void 0 !== json.t && (skill_status.title.text = json.t.charAt(0).toUpperCase() + json.t.slice(1)),
            void 0 !== json.f && hunger_status.set(json.f),
            void 0 !== json.e && exp_status.set(json.e),
            void 0 !== json.p && (jv.upgrade_number = Math.floor(Number(json.p))),
            void 0 !== json.q && jv.equip_sprite !== json.q && (jv.equip_sprite = json.q,
                jv.equip_sprite < 0 ? ph_action.graphic.texture = tiles[Number(-jv.equip_sprite) % 16][Math.floor(Number(-jv.equip_sprite) / 16)] : jv.equip_sprite > 0 ? ph_action.graphic.texture = items[Number(jv.equip_sprite) % 16][Math.floor(Number(jv.equip_sprite) / 16)] : ph_action.graphic.texture = items[7][Math.floor(791 / 16)]),
            void 0 !== json.u && jv.pickup_sprite !== json.u && (jv.pickup_sprite = json.u,
                jv.pickup_sprite <= 0 ? ph_pickup.graphic.texture = tiles[Number(-jv.pickup_sprite) % 16][Math.floor(Number(-jv.pickup_sprite) / 16)] : jv.pickup_sprite > 0 && (ph_pickup.graphic.texture = items[Number(jv.pickup_sprite) % 16][Math.floor(Number(jv.pickup_sprite) / 16)]));
            var i;
            for (i in jv.buffbar)
                jv.buffbar[i].visible = 0,
                    jv.buffbar[i].gfx.visible = 0,
                    jv.buffbar[i].t = "";
            if (void 0 !== json.b && json.b.length)
                for (i in json.b)
                    jv.buffbar[i] || (jv.buffbar[i] = jv.sprite(jv.buffs[0][0]),
                        jv.buffbar[i].gfx = new PIXI.Graphics,
                        jv.buffbar[i].gfx.beginFill(12303291, .1),
                        jv.buffbar[i].gfx.drawCircle(4, 4, 9),
                        jv.buffbar[i].gfx.beginFill(13421772, .2),
                        jv.buffbar[i].gfx.drawCircle(4, 4, 7),
                        jv.buffbar[i].gfx.beginFill(16777215, .3),
                        jv.buffbar[i].gfx.drawCircle(4, 4, 5),
                        jv.buffbar[i].gfx.endFill(),
                        jv.buffbar[i].visible = 0,
                        jv.buffbar[i].x = 12 * i,
                        jv.buffbar[i].gfx.x = jv.buffbar[i].x,
                        jv.buffbar[i].gfx.y = jv.buffbar[i].y,
                        jv.buff_container.addChild(jv.buffbar[i].gfx),
                        jv.buff_container.addChild(jv.buffbar[i]),
                        jv.buffbar[i].interactive = !0,
                        jv.buffbar[i].buttonMode = !0,
                        jv.buffbar[i].do_click = function() {
                            var e, t = [];
                            for (e in jv.buffbar)
                                "" !== jv.buffbar[e].t && t.push(jv.buffbar[e].t);
                            append("<color:#AAAAAA>" + t.join("\n"))
                        },
                        jv.buffbar[i].on("mouseup", jv.buffbar[i].do_click),
                        jv.buffbar[i].on("touchend", jv.buffbar[i].do_click)),
                        jv.buffbar[i].t = json.b[i].t,
                        jv.buffbar[i].texture = jv.buffs[json.b[i].s][0],
                        jv.buffbar[i].visible = 1,
                        jv.buffbar[i].gfx.visible = 1
        } else
            "effect" === json.type || ("move" === json.type ? getMob(json.id).set_dest(json.x, json.y) : console.log("Message parsing error", json))
    },
    show_reconnect = function(e) {
        var t = [];
        objects.process(function(e) {
            t.push(e)
        });
        var i, o = t.length;
        for (i = 0; i < o; i++)
            t[i].cleanup();
        for (o = jv.ability.length,
                 i = 0; i < o; i++)
            jv.ability[i].visible = 0;
        map_index = {},
            item_page = 0,
            item_data = [],
            build_data = [],
            tile_speed = {},
            item_length = 15,
            build_length = 15,
            build_page = 0,
            myName = "",
            family = "",
            me = -1,
            myself = void 0,
            window.onbeforeunload = null,
            clearInterval(jv.net_timer),
            jv.net_timer = null,
            clearInterval(jv.ping_timer),
            jv.ping_timer = null,
            ui_container.visible = 0,
            static_container.visible = 0,
            game_fade.visible = 0,
            game_state = GAME_TITLE,
            splash.visible = 1,
            playMusic("rpgtitle"),
            jv.establish_dialog.hide(),
            jv.reconnect_dialog.show(),
        jv.disconnect_error && (e = jv.disconnect_error,
            jv.disconnect_error = null),
        e && (jv.reconnect_dialog.notice.text = e,
            jv.reconnect_dialog.notice.w = 0,
            jv.reconnect_dialog.notice.center(),
            jv.reconnect_dialog.notice.top(22))
    },
    do_connect = function() {
        jv.reconnect_dialog.hide(),
            init_network()
    },
    init_network = function() {
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        var e = {};
        document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
            function t(e) {
                return decodeURIComponent(e.split("+").join(" "))
            }
            e[t(arguments[1])] = t(arguments[2])
        }),
        e.ip && "" !== e.ip || (e.ip = jv.selected_ip),
        connection && (delete connection.onopen,
            connection.onopen = null,
            delete connection.onerror,
            connection.onerror = null,
            connection.close()),
            connection = jv.connection_attempt ? new WebSocket("ws://" + e.ip + ":8080") : new WebSocket("wss://" + e.ip + ":443"),
            jv.reconnect_dialog.hide(),
            jv.establish_dialog.show(),
            jv.connection_attempt = jv.connection_attempt + 1 || 1,
            connection.onopen = function() {
                jv.connection_attempt = 0,
                    jv.establish_dialog.hide(),
                    jv.login_dialog.show(),
                    game_state = GAME_TITLE,
                    jv.tutorial_window.visible = 0,
                    jv.choose_name.visible = 0,
                    jv.create_dialog.modal = 1,
                    jv.create_dialog.login.visible = 1,
                    jv.create_dialog.y = 200,
                    jv.create_dialog.heading.text = "Create New Character",
                    jv.create_dialog.heading.x = jv.create_dialog.w / 2 - jv.create_dialog.heading.width / 2,
                    jv.create_dialog.close.visible = 0,
                    jv.login_dialog.okay.enable(1),
                    jv.login_dialog.guest.enable(1),
                    jv.login_dialog.create.enable(1),
                    jv.login_dialog.worlds.enable(1),
                jv.ping_timer || (jv.ping_timer = setInterval(function() {
                    send({
                        type: "P"
                    })
                }, 9e3)),
                    send({
                        type: "client",
                        ver: version,
                        mobile: phone,
                        agent: navigator.userAgent
                    })
            },
            connection.onerror = function(e) {
                return jv.login_dialog.hide(),
                    jv.create_dialog.hide(),
                    1 === jv.connection_attempt ? void do_connect() : (show_reconnect(2 === jv.connection_attempt ? "Unable to reach server. Try a different network connection or at another time." : has_quit ? "Couldn't connect to server." : "Lost connection to server."),
                        void(jv.connection_attempt = 0))
            },
            connection.onmessage = function(e) {
                parse(JSON.parse(e.data)),
                    recheck_caches()
            },
        jv.net_timer || (jv.net_timer = setInterval(jv.net_timer_function, 6e3))
    };
jv.net_timer_function = function() {
    if (1 !== connection.readyState) {
        if (1 === jv.connection_attempt)
            return void do_connect();
        jv.login_dialog.hide(),
            jv.create_dialog.hide(),
            show_reconnect(jv.connection_attempt ? "Unable to connect to server." : "Lost connection to server."),
            jv.connection_attempt = 0
    }
},
    jv.command = function(e) {
        if (!editing) {
            var t = e,
                i = t.split(" ");
            if (me == -1)
                return void send({
                    type: "login",
                    data: t
                });
            if ("/sound" == i[0] && (sound_on = Math.abs(sound_on - 1),
                append(sound_on ? "<em>Sounds are now on.</em>" : "<em>Sounds are now off.</em>")),
            "/showfps" == i[0] && (show_fps = Number(!show_fps),
                jv.fps.visible = show_fps),
            "/fontsize" == i[0]) {
                var o = Number(i[1]);
                if (isNaN(o))
                    return;
                o > 16 ? o = 16 : o < 9 && (o = 9),
                    jv.chat_box.text_style.font = o + "px Verdana",
                    jv.chat_fade.text_style.font = o + "px Verdana"
            }
            if ("/chat" == i[0] && (jv.chat_toggle ? (jv.chat_toggle = 0,
                jv.chat_fade.visible = !0,
                jv.chat_box.visible = !1) : (jv.chat_toggle = 1,
                jv.chat_fade.visible = !1,
                jv.chat_box.visible = !0),
                append("Chat box toggled.")),
            "/chatwidth" == i[0]) {
                var o = Number(i[1]);
                if (isNaN(o))
                    return;
                o > 100 ? o = 100 : o < 30 && (o = 30);
                var a = Math.floor(346 * o / 100);
                jv.chat_box.w = a,
                    jv.chat_box.gfx.width = a,
                    jv.chat_box.m.width = a,
                    jv.chat_box.resume.x = jv.chat_box.w / 2 - 35,
                    jv.chat_box.text_style.wordWrapWidth = jv.chat_box.w - 2 * jv.chat_box.padding,
                    jv.chat_fade.w = a,
                    jv.chat_fade.gfx.width = a,
                    jv.chat_fade.m.width = a,
                    jv.chat_fade.resume.x = jv.chat_fade.w / 2 - 35,
                    jv.chat_fade.text_style.wordWrapWidth = jv.chat_fade.w - 2 * jv.chat_fade.padding
            }
            if ("/chatopacity" == i[0]) {
                var o = Number(i[1]);
                if (isNaN(o))
                    return;
                o > 100 ? o = 100 : o < 0 && (o = 0),
                    jv.chat_box.gfx.max_alpha = 1 * o / 100,
                jv.chat_box.visible && (jv.chat_box.gfx.alpha = jv.chat_box.gfx.max_alpha)
            }
            "/action" == i[0] && (ph_action.visible ? (jv.action_button.visible = 0,
                ph_action.visible = 0,
                info_pane.x = 580,
                info_pane.y = 284) : (jv.action_button.visible = 1,
                ph_action.visible = 1,
                info_pane.x = 480,
                info_pane.y = 34),
                append("Action button toggled.")),
            "/quickuse" == i[0] && (jv.quick_toggle ? (jv.hot_scene.visible = 0,
                jv.quick_toggle = 0) : (jv.hot_scene.visible = 1,
                jv.quick_toggle = 1),
                append("Quick use buttons toggled.")),
            "/pickup" == i[0] && send({
                type: "g"
            }),
            "/invicons" == i[0] && (jv.inv_icons ? (jv.inv_icons = 0,
                jv.inv_button.visible = 0,
                ui_container.build.visible = 0) : (jv.inv_icons = 1,
                jv.inv_button.visible = 1,
                ui_container.build.visible = 1),
                append("Inv icons toggled.")),
            "/dpad" == i[0] && (compass2.visible ? (compass.visible = 0,
                compass2.visible = 0,
                ph_dpad.visible = 0,
                jv.chat_box.h = 377,
                jv.chat_box.gfx.height = 379,
                jv.chat_box.m.height = 377,
                jv.chat_box.mask.height = 377,
                jv.chat_box.resume.y = jv.chat_box.h - 35) : (compass.visible = 1,
                compass2.visible = 1,
                ph_dpad.visible = 1,
                jv.chat_box.h = 210,
                jv.chat_box.gfx.height = 212,
                jv.chat_box.m.height = 210,
                jv.chat_box.mask.height = 210,
                jv.chat_box.resume.y = jv.chat_box.h - 35),
                append("Dpad toggled.")),
                "/upload" == t ? send({
                    type: "script",
                    name: document.getElementById("script_name").value,
                    script: editor.getValue()
                }) : "/t" == i[0] ? (last_tell = i[1],
                    send({
                        type: "chat",
                        data: t
                    })) : "/drop" == i[0] ? (amt = 1,
                void 0 === i[1] || isNaN(i[1]) && "all" != i[1] || (amt = i[1]),
                    drop_amt = amt,
                    amt > 0 && amt < 1e3 ? info_pane.drop_amount.set_text("Drop: " + amt) : info_pane.drop_amount.set_text("Drop: #"),
                    append("Drop amount set to " + amt + ".")) : 0 === t.indexOf("/") ? send({
                    type: "chat",
                    data: t
                }) : "say" == jv.toggle_chat.mode ? send({
                    type: "chat",
                    data: t
                }) : "global" == jv.toggle_chat.mode ? send(0 === t.indexOf("/b ") ? {
                    type: "chat",
                    data: t
                } : {
                    type: "chat",
                    data: "/b " + t
                }) : "tribe" == jv.toggle_chat.mode ? send(0 === t.indexOf("/tc ") ? {
                    type: "chat",
                    data: t
                } : {
                    type: "chat",
                    data: "/tc " + t
                }) : "tell" == jv.toggle_chat.mode && (0 === t.indexOf("/t ") ? (last_tell = i[1],
                    send({
                        type: "chat",
                        data: t
                    })) : (last_tell = i[0],
                    send({
                        type: "chat",
                        data: "/t " + t
                    })))
        }
    },
    jv.current_input = null,
    jv.hidden_input = null,
    jv.stars = "************************************************************************************",
    jv.TextInput = {
        create: function(e, t, i, o, a) {
            var n = jv.sprite();
            return a || (a = ui_container),
                n.interactive = !0,
                n.hasFocus = 0,
                n.h = o,
                n.w = i,
                n.x = e,
                n.y = t,
                n.pos = 0,
                n.mobile = 0,
                n.password = 0,
                n.maxChars = 300,
                n.chars = "",
                n.text_style = {
                    font: "12px Verdana",
                    align: "left",
                    fill: 16777215,
                    lineJoin: "round"
                },
                n.placeholder_style = JSON.parse(JSON.stringify(n.text_style)),
                n.placeholder_style.fill = 11184810,
                n.str = jv.text(" ", n.text_style),
                n.str.x += 2,
                n.str.y += 4,
                n.placeholder = jv.text("", n.placeholder_style),
                n.placeholder.x += 4,
                n.placeholder.y += 4,
                n.placeholder.alpha = .8,
                n.hidden_str = jv.text(" ", n.text_style),
                n.hidden_str.x += 2,
                n.hidden_str.y += 4,
                n.cursor = jv.text("|", n.text_style),
                n.cursor.y += 3,
                n.container = new PIXI.Container,
                n.gfx = new PIXI.Graphics,
                n.gfx.beginFill(jv.color_dark, .4),
                n.gfx.lineStyle(2, 7829367, .2),
                n.gfx.drawRoundedRect(0, 0, i, o, 4),
                n.gfx.endFill(),
                n.m = new PIXI.Graphics,
                n.m.beginFill(1118481, 0),
                n.m.drawRect(0, 0, i, o),
                n.m.endFill(),
                n.mask = n.m,
                n.onSubmit = function() {
                    "" !== this.chars && jv.command(this.chars),
                        this.chars = "",
                        jv.hidden_input.value = "",
                        this.pos = 0,
                        this.blur()
                },
                n.onFocus = function() {
                    jv.current_input = this,
                        jv.hidden_input.style.display = "block",
                        jv.hidden_input.focus(),
                        this.hasFocus = 1,
                    this.placeholder.text.indexOf("Tell") === -1 || this.chars.length || (last_tell && "" != last_tell ? (this.chars = last_tell + " ",
                        jv.hidden_input.value = last_tell + " ") : (this.chars = "",
                        jv.hidden_input.value = ""),
                        this.pos = this.chars.length),
                        this.update(),
                    phone && Keyboard.show(),
                    input_field !== this || jv.chat_toggle || (jv.chat_box.gfx.alpha = jv.chat_box.gfx.max_alpha,
                        jv.chat_box.visible = !0,
                        jv.chat_fade.visible = !1,
                        jv.chat_box.interactive = !0)
                },
                n.setText = function(e) {
                    this.chars = e,
                    this.hasFocus && (jv.hidden_input.value = e),
                        this.pos = this.chars.length,
                        this.update()
                },
                n.onBlur = function() {
                    this.hasFocus = 0,
                        jv.hidden_input.style.display = "none",
                        jv.hidden_input.blur(),
                        this.update(),
                    input_field !== this || jv.chat_toggle || jv.chat_box.resume.visible || (jv.chat_box.gfx.alpha = 0,
                        jv.chat_box.visible = 0,
                        jv.chat_fade.visible = 1,
                        jv.chat_box.interactive = !1)
                },
                n.focus = function() {
                    this.onFocus()
                },
                n.blur = function() {
                    this.onBlur()
                },
                n.update = function() {
                    jv.hidden_input && (phone && jv.login_dialog && game_state == GAME_TITLE && (document.activeElement == jv.hidden_input ? (jv.login_dialog.y = 12,
                        jv.login_dialog.okay.left(40),
                        jv.login_dialog.create.right(40),
                        jv.login_dialog.create.bottom(20),
                        jv.create_dialog.y = 12,
                        jv.create_dialog.login.right(32),
                        jv.create_dialog.login.bottom(20)) : jv.checkFocus = setTimeout(function() {
                        document.activeElement != jv.hidden_input && (jv.login_dialog.y = 200,
                            jv.login_dialog.okay.center(),
                            jv.login_dialog.create.left(32),
                            jv.login_dialog.create.bottom(-40),
                            jv.create_dialog.y = 200,
                            jv.create_dialog.login.center(),
                            jv.create_dialog.login.bottom(-40))
                    }, 200)),
                    this.mobile || (jv.hidden_input.value = this.chars,
                        jv.hidden_input.selectionStart = this.pos,
                        jv.hidden_input.selectionEnd = this.pos)),
                        this.cursor.visible = this.hasFocus,
                        this.placeholder.visible = !this.hasFocus && !this.chars.length;
                    var e = this.str.text;
                    this.password ? (this.str.text = jv.stars.slice(0, this.chars.length),
                        this.hidden_str.text = this.str.text.slice(0, this.pos)) : (this.str.text = this.chars,
                        this.hidden_str.text = this.chars.slice(0, this.pos)),
                        this.pos < 1 ? this.cursor.x = 0 : this.cursor.x = this.hidden_str.width - 1,
                        this.cursor.x > this.w - 6 ? this.container.x = this.w - 6 - this.cursor.x : this.container.x = 0,
                    this.str.text !== e && this.on_change && this.on_change()
                },
                n.moveCursorLeft = function() {
                    this.pos > 0 && this.pos--,
                        this.update()
                },
                n.moveCursorRight = function() {
                    this.pos < this.chars.length && this.pos++,
                        this.update()
                },
                n.onClick = function(e) {
                    var t = e.data.global.x - this.x - this.container.x - this.parent.x,
                        i = this.cursor.x;
                    if (t < this.cursor.x) {
                        for (; this.pos > 0 && Math.floor(t) <= this.cursor.x;)
                            i = this.cursor.x,
                                this.moveCursorLeft();
                        Math.abs(this.cursor.x - t) > Math.abs(i - t) && this.moveCursorRight()
                    } else {
                        for (; this.pos < this.chars.length && Math.floor(t) >= this.cursor.x;)
                            i = this.cursor.x,
                                this.moveCursorRight();
                        Math.abs(this.cursor.x - t) > Math.abs(i - t) && this.moveCursorLeft()
                    }
                    this.onFocus()
                },
                n.deleteText = function(e, t) {
                    1 == this.chars.length ? this.chars = "" : this.chars = this.chars.slice(0, e) + this.chars.slice(t, this.chars.length),
                        this.update()
                },
                n.onKey = function(e) {
                    if (this.hasFocus) {
                        var t = e.key;
                        if ("WakeUp" !== t && "CapsLock" !== t && "Shift" !== t && "Control" !== t && "Alt" !== t && "AltGraph" !== t && !t.match(/^F\d{1,2}$/) && "Insert" !== t && "NumLock" !== t && "Meta" !== t && "Win" !== t && "Dead" !== t && "Unidentified" !== t && "AudioVolumeDown" !== t && "AudioVolumeUp" !== t && "AudioVolumeMute" !== t) {
                            if ("Tab" === t)
                                return void(this.tab_next && (this.mobile = 1,
                                    this.tab_next.mobile = 1,
                                    this.hasFocus = 0,
                                    this.update(),
                                    this.pos = this.chars.length,
                                    jv.hidden_input.value = this.tab_next.chars,
                                    this.tab_next.pos = this.tab_next.chars.length,
                                    this.tab_next.focus(),
                                    jv.hidden_input.selectionStart = this.tab_next.pos,
                                    jv.hidden_input.selectionEnd = this.tab_next.pos,
                                    this.mobile = 0,
                                    this.tab_next.mobile = 0));
                            if ("Enter" === t || 13 == e.keyCode)
                                return this.onSubmit(),
                                    void(phone && Keyboard.hide());
                            switch (t) {
                                case "Left":
                                case "ArrowLeft":
                                    this.moveCursorLeft();
                                    break;
                                case "Escape":
                                    this.chars = "",
                                        this.pos = 0,
                                        jv.hidden_input.value = "",
                                        this.blur();
                                    break;
                                case "Right":
                                case "ArrowRight":
                                    this.moveCursorRight();
                                    break;
                                case "PageDown":
                                case "PageUp":
                                case "Home":
                                case "End":
                                    break;
                                case "Up":
                                case "ArrowUp":
                                    break;
                                case "Down":
                                case "ArrowDown":
                                    break;
                                case "Backspace":
                                    this.pos > 0 && (this.moveCursorLeft(),
                                        this.deleteText(this.pos, this.pos + 1)),
                                        e.preventDefault();
                                    break;
                                case "Del":
                                case "Delete":
                                    this.pos < this.chars.length && this.deleteText(this.pos, this.pos + 1);
                                    break;
                                default:
                                    if (e.ctrlKey && ("j" === t.toLowerCase() || "r" === t.toLowerCase()))
                                        return;
                                    if ("Spacebar" === t && (t = " "),
                                    " " === t && e.preventDefault(),
                                    1 !== t.length,
                                    this.maxChars > 0 && this.chars.length >= this.maxChars)
                                        return
                            }
                        }
                    }
                },
                n.sync = function() {
                    this.chars = jv.hidden_input.value,
                        this.pos = this.chars.length,
                        this.update()
                },
                n.blink = function() {
                    this.hasFocus && (this.cursor.alpha ? this.cursor.alpha = 0 : this.cursor.alpha = 1)
                },
                n.blink_timer = setInterval(function() {
                    n.blink()
                }, 250),
                jv.stage.on("mousedown", function() {
                    n.blur()
                }),
                jv.stage.on("touchstart", function() {
                    n.blur()
                }),
                n.on("mouseup", n.onClick),
                n.on("touchend", n.onClick),
                n.addChild(n.gfx),
                n.addChild(n.m),
                n.addChild(n.container),
                n.container.addChild(n.str),
                n.container.addChild(n.placeholder),
                n.container.addChild(n.cursor),
                a.addChild(n),
                n.update(),
                n
        }
    };
var setup_mobile_input = function() {
    var e = document.createElement("input");
    e.type = "text",
        e.style.display = "none",
        e.style.position = "fixed",
        e.style.opacity = 0,
        e.style.pointerEvents = "none",
        e.style.left = "0px",
        e.style.bottom = "0px",
        e.style.left = "-100px",
        e.style.top = "-100px",
        e.style.zIndex = 10,
        e.autocapitalize = "off",
        e.addEventListener("blur", function() {
            jv.current_input && (jv.current_input.blur(),
            phone && setTimeout(function() {
                jv.current_input || Keyboard.hide()
            }, 5))
        }, !1),
        e.addEventListener("keydown", function(e) {
            9 === e.keyCode && e.preventDefault(),
            jv.current_input && (e = e || window.event,
            jv.current_input.hasFocus && (jv.current_input.mobile = 1,
                jv.current_input.chars = jv.hidden_input.value,
                jv.current_input.pos = jv.hidden_input.selectionStart,
                jv.current_input.update(),
                jv.current_input.mobile = 0))
        }),
        e.addEventListener("keypress", function(e) {
            phone && jv.current_input && (e = e || window.event,
            13 == e.keyCode && (jv.current_input.onSubmit(),
                Keyboard.hide()))
        }),
        e.addEventListener("input", function(e) {
            setTimeout(function() {
                phone && jv.current_input && jv.current_input.hasFocus && jv.current_input.chars != jv.hidden_input.value && (jv.current_input.mobile = 1,
                    jv.current_input.chars = jv.hidden_input.value,
                    jv.current_input.pos = jv.hidden_input.selectionStart,
                    jv.current_input.update(),
                    jv.current_input.mobile = 0)
            }, 5)
        }),
        e.addEventListener("keyup", function(e) {
            return jv.current_input && (e = e || window.event,
            jv.current_input.hasFocus && (jv.current_input.mobile = 1,
                jv.current_input.onKey(e),
                jv.current_input.chars = jv.hidden_input.value,
                jv.current_input.pos = jv.hidden_input.selectionStart,
                jv.current_input.update(),
                jv.current_input.mobile = 0)), !1
        }),
        jv.hidden_input = e;
    var t = document.getElementById("all_container");
    t.appendChild(jv.hidden_input)
};
jv.ChatBox = {
    create: function(e, t, i, o, a) {
        var n = jv.sprite();
        a || (a = ui_container),
            n.interactive = !1,
            n.h = o,
            n.w = i,
            n.x = e,
            n.y = t,
            n.line_limit = 500,
            n.drag = 0,
            n.dragy = 0,
            n.padding = 4,
            n.offset = 0,
            n.line_space = 2,
            n.text_style = {
                font: "12px Verdana",
                align: "left",
                wordWrap: !0,
                wordWrapWidth: i - 2 * n.padding,
                breakWords: !0,
                fill: 16777215,
                stroke: 2236962,
                strokeThickness: 4,
                lineJoin: "round"
            },
        phone && (n.text_style.font = "14px Verdana"),
            n.lines = [],
            n.gfx = new PIXI.Graphics,
            n.gfx.beginFill(1580828, 1),
            n.gfx.lineStyle(2, 3686992, 1),
            n.gfx.drawRect(0, 0, i, o),
            n.gfx.endFill(),
            n.gfx.alpha = 0,
            n.gfx.max_alpha = .55,
            n.m = new PIXI.Graphics,
            n.m.beginFill(1118481),
            n.m.drawRect(0, 0, i, o),
            n.m.endFill(),
            n.m.alpha = 0,
            n.mask = n.m,
            n.m.visible = !1,
            n.m.interactive = !1,
            n.addChild(n.mask),
            n.resume = new PIXI.Graphics;
        var r = [0, 0, 60, 0, 30, 30, 0, 0];
        return n.resume.beginFill(4473907, .3),
            n.resume.lineStyle(5, 4473924, .6),
            n.resume.drawPolygon(r),
            n.resume.lineStyle(3, 8947848, .6),
            n.resume.drawPolygon(r),
            n.resume.lineStyle(1, 13421772, .6),
            n.resume.drawPolygon(r),
            n.resume.endFill(),
            n.resume.x = 110,
            n.resume.y = n.h - 35,
            n.resume.cacheAsBitmap = !0,
            n.resume.interactive = !0,
            n.resume.visible = 0,
            n.line_container = new PIXI.Container,
            n.line_container.interactive = !1,
            n.line_container.x = n.padding,
            n.append = function(e, t) {
                var i = e.indexOf("color:#");
                if (i !== -1 && (i = e.substring(i + 7, i + 13),
                    /^[a-z0-9]+$/i.test(i)))
                    var t = "#" + i;
                t ? 3 == jv.pixiver ? this.text_style.fill = t : this.text_style.fill = ["#FFFFFF", "#DDDDDD", "#AAAAAA"] : 3 == jv.pixiver ? this.text_style.fill = 16777215 : this.text_style.fill = ["#FFFFFF", "#DDDDDD", "#AAAAAA"],
                    e = e.replace(/<br>/g, "\n"),
                    e = e.replace(/(<([^>]+)>)/gi, ""),
                    e = e.replace(/&quot;/g, '"'),
                    e = e.replace(/&amp;/g, "&"),
                    e = e.replace(/&lt;/g, "<"),
                    e = e.replace(/&gt;/g, ">");
                var o = jv.text(e, this.text_style);
                if (4 == jv.pixiver && t && (o.tint = hex_to_int(t.substr(1))),
                    this.lines.length ? o.y = this.lines[this.lines.length - 1].y + this.lines[this.lines.length - 1].height + this.line_space : o.y = 0,
                    this.lines.push(o),
                    this.line_container.addChild(o),
                this.resume.visible || (this.fade ? this.line_container.height > this.h && this.line_container.height + this.offset + 2 * this.padding > this.h && (this.line_container.y = this.h - this.offset - this.line_container.height - 2 * this.padding) : this.line_container.height + this.offset + 2 * this.padding > this.h && (this.line_container.y = this.h - this.offset - this.line_container.height - 2 * this.padding)),
                this.lines.length == this.line_limit) {
                    var a = this.lines.shift();
                    this.line_container.removeChild(a),
                        this.offset += a.height + this.line_space,
                        a = null
                }
            },
            n.on_up = function(e) {
                var t = e.data.getLocalPosition(this.parent).y;
                !this.drag && t > this.y + this.h - 60 && (this.resume.visible = 0,
                    this.line_container.y = this.h - this.line_container.height - this.padding - this.offset),
                    this.drag = 0
            },
            n.on_down = function(e) {
                if (!(this.line_container.height < this.h - this.padding)) {
                    var t = e.data.getLocalPosition(this.parent).y;
                    t > this.y + this.h - 60 || (this.drag = 1,
                        this.dragy = t,
                        this.origy = this.line_container.y,
                        this.resume.visible = 1,
                        this.gfx.alpha = this.gfx.max_alpha,
                        this.interactive = !0)
                }
            },
            n.do_move = function(e) {
                var t = e.data.getLocalPosition(this.parent).y;
                this.cur_y = t,
                this.drag && (this.line_container.y = this.origy + t - this.dragy,
                    this.line_container.y < this.h - this.offset - this.line_container.height - this.padding ? (this.line_container.y = this.h - this.offset - this.line_container.height - this.padding,
                    t < this.dragy - 5 && (this.drag = 0,
                        this.resume.visible = 0)) : this.line_container.y > -this.offset && (this.line_container.y = -this.offset))
            },
            jv.chat_box ? (n.hitArea = new PIXI.Rectangle(0, 0, 0, 0),
                n.line_container.hitArea = new PIXI.Rectangle(0, 0, 0, 0),
                n.m.hitArea = new PIXI.Rectangle(0, 0, 0, 0)) : (n.on("mouseup", n.on_up),
                n.on("mouseupoutside", n.on_up),
                n.on("touchend", n.on_up),
                n.on("touchendoutside", n.on_up),
                n.on("mousedown", n.on_down),
                n.on("touchstart", n.on_down),
                n.on("mousemove", n.do_move),
                n.on("touchmove", n.do_move)),
            n.addChild(n.gfx),
            n.addChild(n.line_container),
            n.addChild(n.resume),
            a.addChild(n),
            n
    }
},
    jv.init_dialogs = function() {
        var e = {
            font: "12px Verdana",
            fill: 15658734,
            lineJoin: "round",
            stroke: 4473924,
            strokeThickness: 4,
            align: "center"
        };
        quit_dialog = jv.Dialog.create(170, 70),
            quit_dialog.heading = jv.text("Do you want to log out?", e),
            quit_dialog.add(quit_dialog.heading),
            quit_dialog.heading.center(),
            quit_dialog.heading.top(8),
            quit_dialog.yes = jv.Button.create(0, 0, 34, "Yes", quit_dialog),
            quit_dialog.add(quit_dialog.yes),
            quit_dialog.yes.left(32),
            quit_dialog.yes.bottom(12),
            quit_dialog.yes.on_click = function() {
                send({
                    type: "chat",
                    data: "/quit"
                }),
                    quit_dialog.hide()
            },
            quit_dialog.no = jv.Button.create(0, 0, 34, "No", quit_dialog),
            quit_dialog.add(quit_dialog.no),
            quit_dialog.no.right(32),
            quit_dialog.no.bottom(12),
            quit_dialog.no.on_click = function() {
                quit_dialog.hide()
            },
            rate_dialog = jv.Dialog.create(370, 100),
            rate_dialog.y -= 110,
            rate_dialog.heading = jv.text("You graduated from Newbie Village!", e),
            rate_dialog.add(rate_dialog.heading),
            rate_dialog.heading.center(),
            rate_dialog.heading.top(8),
            rate_dialog.heading2 = jv.text("Please help me out with a rating if you like the game 😊︎", {
                font: "11px Verdana",
                fill: 11783372,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "left",
                wordWrap: !0,
                wordWrapWidth: 370,
                breakWords: !0
            }),
            rate_dialog.add(rate_dialog.heading2),
            rate_dialog.heading2.center(),
            rate_dialog.heading2.top(34),
            rate_dialog.yes = jv.Button.create(0, 0, 120, "Rate my app", rate_dialog, 30),
            rate_dialog.add(rate_dialog.yes),
            rate_dialog.yes.center(),
            rate_dialog.yes.bottom(12),
            rate_dialog.yes.on_click = function() {
                window.open("market://details?id=com.mysteralegacy.mmorpg.sandbox", "_system"),
                    rate_dialog.hide()
            },
            rate_dialog.no = jv.Button.create(0, 0, 24, "X", rate_dialog),
            rate_dialog.add(rate_dialog.no),
            rate_dialog.no.right(8),
            rate_dialog.no.top(8),
            rate_dialog.no.on_click = function() {
                rate_dialog.hide()
            },
            jv.reincarnate_dialog = jv.Dialog.create(320, 220),
            jv.reincarnate_dialog.heading = jv.text("Reincarnation", e),
            jv.reincarnate_dialog.add(jv.reincarnate_dialog.heading),
            jv.reincarnate_dialog.heading.center(),
            jv.reincarnate_dialog.heading.top(8),
            jv.reincarnate_dialog.info = jv.text("", {
                font: "10px Verdana",
                fill: 11783372,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "left",
                wordWrap: !0,
                wordWrapWidth: 280,
                breakWords: !0
            }),
            jv.reincarnate_dialog.add(jv.reincarnate_dialog.info),
            jv.reincarnate_dialog.info.left(20),
            jv.reincarnate_dialog.info.top(44),
            jv.reincarnate_dialog.gain = jv.text("Exp: Myst: Top skill: ", {
                font: "10px Verdana",
                fill: 13434879,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "left"
            }),
            jv.reincarnate_dialog.add(jv.reincarnate_dialog.gain),
            jv.reincarnate_dialog.gain.left(36),
            jv.reincarnate_dialog.gain.bottom(52),
            jv.reincarnate_dialog.yes = jv.Button.create(0, 0, 100, "Level 60 Required", jv.reincarnate_dialog),
            jv.reincarnate_dialog.add(jv.reincarnate_dialog.yes),
            jv.reincarnate_dialog.yes.center(),
            jv.reincarnate_dialog.yes.bottom(16),
            jv.reincarnate_dialog.yes.on_click = function() {
                send({
                    type: "c",
                    r: "re"
                }),
                    jv.reincarnate_dialog.hide()
            },
            jv.reincarnate_dialog.yes.enable(0),
            jv.reincarnate_dialog.okay = jv.Button.create(0, 0, 24, "X", jv.reincarnate_dialog),
            jv.reincarnate_dialog.add(jv.reincarnate_dialog.okay),
            jv.reincarnate_dialog.okay.right(8),
            jv.reincarnate_dialog.okay.top(8),
            jv.reincarnate_dialog.okay.on_click = function() {
                jv.reincarnate_dialog.hide()
            },
            jv.reincarnate_dialog.do_update = function() {
                jv.reincarnate_dialog.info.text = jv.reinc.desc,
                    jv.reinc.able ? (jv.reincarnate_dialog.yes.set_text("My Body Is Ready"),
                        jv.reincarnate_dialog.yes.enable(1)) : (jv.reincarnate_dialog.yes.set_text("Level " + jv.reinc.req + " Required"),
                        jv.reincarnate_dialog.yes.enable(0)),
                    jv.reincarnate_dialog.gain.text = "Exp: +" + jv.reinc.exp + "%  Myst: +" + jv.reinc.myst + "%  Top skill: " + jv.reinc.skill.capitalize()
            },
            jv.upgrade_dialog = jv.Dialog.create(320, 280),
            jv.upgrade_dialog.heading = jv.text("Myst Upgrades", e),
            jv.upgrade_dialog.add(jv.upgrade_dialog.heading),
            jv.upgrade_dialog.heading.center(),
            jv.upgrade_dialog.heading.top(8);
        var t, i = 48;
        for (jv.upgrade_dialog.btn = [],
                 jv.upgrade_dialog.page = 0,
                 jv.upgrade_dialog.per = 8,
                 t = 0; t < jv.upgrade_dialog.per; t++)
            jv.upgrade_dialog.btn[t] = jv.Button.create(0, 0, 140, ""),
                jv.upgrade_dialog.btn[t].on_click = function() {
                    jv.upgrade_dialog.info.text = this.title.text + ": " + this.desc,
                        jv.upgrade_dialog.cost.text = "Cost: " + this.cost,
                        jv.upgrade_dialog.buy.enable(this.afford),
                        jv.upgrade_dialog.buy.name = this.name,
                        jv.upgrade_dialog.trigger = this
                },
                jv.upgrade_dialog.add(jv.upgrade_dialog.btn[t]),
            t && t % 2 == 0 && (i += 32),
                t % 2 ? jv.upgrade_dialog.btn[t].right(16) : jv.upgrade_dialog.btn[t].left(16),
                jv.upgrade_dialog.btn[t].top(i),
                jv.upgrade_dialog.btn[t].icon = jv.sprite(items[0][Math.floor(0)]),
                jv.upgrade_dialog.btn[t].icon.scale.x = .5,
                jv.upgrade_dialog.btn[t].icon.scale.y = .5,
                jv.upgrade_dialog.btn[t].icon.x = 6,
                jv.upgrade_dialog.btn[t].icon.y = 6,
                jv.upgrade_dialog.btn[t].addChild(jv.upgrade_dialog.btn[t].icon);
        jv.upgrade_dialog.do_update = function() {
            var e, t = jv.upgrade_dialog.page * jv.upgrade_dialog.per;
            for (e = 0; e < jv.upgrade_dialog.btn.length; e++)
                jv.upgrades[t + e] ? (jv.upgrade_dialog.btn[e].visible = 1,
                    jv.upgrade_dialog.btn[e].set_text(jv.upgrades[t + e].t + " " + romanize(jv.upgrades[t + e].l)),
                    jv.upgrade_dialog.btn[e].icon.texture = items[Number(jv.upgrades[t + e].s) % 16][Math.floor(Number(jv.upgrades[t + e].s) / 16)],
                    jv.upgrade_dialog.btn[e].cost = jv.upgrades[t + e].c,
                    jv.upgrade_dialog.btn[e].desc = jv.upgrades[t + e].d,
                    jv.upgrade_dialog.btn[e].name = jv.upgrades[t + e].n,
                    jv.upgrade_dialog.btn[e].afford = jv.upgrades[t + e].a,
                jv.upgrade_dialog.btn[e] == jv.upgrade_dialog.trigger && jv.upgrade_dialog.btn[e].on_click()) : jv.upgrade_dialog.btn[e].visible = 0;
            jv.upgrades[(jv.upgrade_dialog.page + 1) * jv.upgrade_dialog.per] ? jv.upgrade_dialog.next.enable(1) : jv.upgrade_dialog.next.enable(0),
                jv.upgrade_dialog.page > 0 ? jv.upgrade_dialog.prev.enable(1) : jv.upgrade_dialog.prev.enable(0)
        },
            jv.upgrade_dialog.next = jv.Button.create(30, 32, 40, "Next", jv.upgrade_dialog),
            jv.upgrade_dialog.add(jv.upgrade_dialog.next),
            jv.upgrade_dialog.next.right(16),
            jv.upgrade_dialog.next.bottom(76),
            jv.upgrade_dialog.next.on_click = function() {
                jv.upgrade_dialog.page++,
                    jv.upgrade_dialog.do_update()
            },
            jv.upgrade_dialog.prev = jv.Button.create(30, 32, 40, "Prev", jv.upgrade_dialog),
            jv.upgrade_dialog.add(jv.upgrade_dialog.prev),
            jv.upgrade_dialog.prev.left(16),
            jv.upgrade_dialog.prev.bottom(76),
            jv.upgrade_dialog.prev.on_click = function() {
                jv.upgrade_dialog.page--,
                    jv.upgrade_dialog.do_update()
            },
            jv.upgrade_dialog.buy = jv.Button.create(0, 0, 80, "Buy Upgrade", jv.upgrade_dialog),
            jv.upgrade_dialog.add(jv.upgrade_dialog.buy),
            jv.upgrade_dialog.buy.right(16),
            jv.upgrade_dialog.buy.bottom(16),
            jv.upgrade_dialog.buy.on_click = function() {
                send({
                    type: "c",
                    r: "ub",
                    u: this.name
                })
            },
            jv.upgrade_dialog.buy.enable(0),
            jv.upgrade_dialog.info = jv.text("Select an upgrade above to read more about it.", {
                font: "10px Verdana",
                fill: 11783372,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "left",
                wordWrap: !0,
                wordWrapWidth: 200,
                breakWords: !0
            }),
            jv.upgrade_dialog.add(jv.upgrade_dialog.info),
            jv.upgrade_dialog.info.x = 16,
            jv.upgrade_dialog.info.y = jv.upgrade_dialog.buy.y - 22,
            jv.upgrade_dialog.cost = jv.text("", {
                font: "10px Verdana",
                fill: 16777147,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "left"
            }),
            jv.upgrade_dialog.add(jv.upgrade_dialog.cost),
            jv.upgrade_dialog.cost.x = jv.upgrade_dialog.buy.x + 4,
            jv.upgrade_dialog.cost.y = jv.upgrade_dialog.buy.y - 22,
            jv.upgrade_dialog.okay = jv.Button.create(0, 0, 24, "X", jv.upgrade_dialog),
            jv.upgrade_dialog.add(jv.upgrade_dialog.okay),
            jv.upgrade_dialog.okay.right(8),
            jv.upgrade_dialog.okay.top(8),
            jv.upgrade_dialog.okay.on_click = function() {
                jv.upgrade_dialog.hide()
            },
            option_dialog = jv.Dialog.create(200, 310);
        var i = 10;
        option_dialog.heading = jv.text("Menu", e),
            option_dialog.add(option_dialog.heading),
            option_dialog.heading.center(),
            option_dialog.heading.top(8),
            option_dialog.sound_label = jv.text("Sound Volume", {
                font: "10px Verdana",
                fill: 16777215,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "left"
            }),
            option_dialog.add(option_dialog.sound_label),
            option_dialog.sound_label.center(),
            option_dialog.sound_label.top(i += 32),
            option_dialog.sound_slider = jv.Slider.create(100),
            option_dialog.add(option_dialog.sound_slider),
            option_dialog.sound_slider.center(),
            option_dialog.sound_slider.top(i += 16),
            option_dialog.sound_slider.onChange = function() {
                jv.sound_volume = this.percent / 100
            },
            option_dialog.music_label = jv.text("Music Volume", {
                font: "10px Verdana",
                fill: 16777215,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "left"
            }),
            option_dialog.add(option_dialog.music_label),
            option_dialog.music_label.center(),
            option_dialog.music_label.top(i += 32),
            option_dialog.music_slider = jv.Slider.create(100),
            option_dialog.add(option_dialog.music_slider),
            option_dialog.music_slider.center(),
            option_dialog.music_slider.top(i += 16),
            option_dialog.music_slider.onChange = function() {
                var e;
                for (e in music)
                    music[e].volume(this.percent / 100),
                        0 == this.percent ? music[e].stop() : jv.current_song !== music[e] || music[e].playing() || music[e].play()
            },
            option_dialog.music_slider.set_percent(40),
            option_dialog.help = jv.Button.create(0, 0, 80, "Help"),
            option_dialog.help.on_click = function() {
                send({
                    type: "c",
                    r: "hl"
                }),
                    option_dialog.hide()
            },
            option_dialog.add(option_dialog.help),
            option_dialog.help.center(),
            option_dialog.help.top(i += 32),
            option_dialog.credits = jv.Button.create(0, 0, 80, "Credits"),
            option_dialog.credits.on_click = function() {
                send({
                    type: "c",
                    r: "cr"
                }),
                    option_dialog.hide()
            },
            option_dialog.add(option_dialog.credits),
            option_dialog.credits.center(),
            option_dialog.credits.top(i += 32),
            option_dialog.fullscreen = jv.Button.create(0, 0, 80, "Fullscreen: Off"),
            option_dialog.fullscreen.on_click = function() {
                if (screenfull.enabled) {
                    var e = document.getElementById("all_container");
                    screenfull.toggle(e),
                        screenfull.isFullscreen,
                        screenfull.isFullscreen ? this.set_text("Fullscreen: On") : this.set_text("Fullscreen: Off")
                }
            },
        screenfull.enabled && document.addEventListener(screenfull.raw.fullscreenchange, function() {
            screenfull.isFullscreen ? option_dialog.fullscreen.set_text("Fullscreen: On") : option_dialog.fullscreen.set_text("Fullscreen: Off")
        }),
            option_dialog.add(option_dialog.fullscreen),
            option_dialog.fullscreen.center(),
            option_dialog.fullscreen.top(i += 32),
            option_dialog.interface = jv.Button.create(0, 0, 80, "Interface"),
            option_dialog.interface.on_click = function() {
                jv.ui_options_dialog.show()
            },
            option_dialog.add(option_dialog.interface),
            option_dialog.interface.center(),
            option_dialog.interface.top(i += 32),
            option_dialog.log = jv.Button.create(0, 0, 80, "Log Out", option_dialog),
            option_dialog.add(option_dialog.log),
            option_dialog.log.center(),
            option_dialog.log.top(i += 32),
            option_dialog.log.on_click = function() {
                quit_dialog.show()
            },
            option_dialog.okay = jv.Button.create(0, 0, 24, "X", option_dialog),
            option_dialog.add(option_dialog.okay),
            option_dialog.okay.right(8),
            option_dialog.okay.top(8),
            option_dialog.okay.on_click = function() {
                Cookies.set("ml_sound", option_dialog.sound_slider.percent, {
                    expires: 730
                }),
                    Cookies.set("ml_music", option_dialog.music_slider.percent, {
                        expires: 730
                    }),
                    option_dialog.hide()
            },
            jv.build_dialog = jv.Dialog.create(160, 320),
            jv.build_dialog.right(160),
            jv.build_dialog.top(0),
            jv.build_dialog.heading = jv.text("Build & Craft", {
                font: "12px Verdana",
                fill: 15658734,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 4,
                align: "left"
            }),
            jv.build_dialog.add(jv.build_dialog.heading),
            jv.build_dialog.heading.left(12),
            jv.build_dialog.heading.top(8),
            jv.build_dialog.add(build_pane),
            build_pane.left(0),
            build_pane.top(0),
            c = 0;
        for (var o = 0; o < 5; o++)
            for (var a = 0; a < 3; a++)
                bld[c] = jv.InventorySlot.create(16 + 47 * a, 40 + 38 * o, c, build_pane),
                    bld[c].build = 1,
                    c += 1;
        build_pane.next = jv.Button.create(0, 232, 38, "Next", build_pane),
            jv.build_dialog.add(build_pane.next),
            build_pane.next.right(16),
            build_pane.next.on_click = function() {
                build_page++,
                    update_build()
            },
            build_pane.prev = jv.Button.create(0, 232, 38, "Prev", build_pane),
            jv.build_dialog.add(build_pane.prev),
            build_pane.prev.left(14),
            build_pane.prev.on_click = function() {
                build_page--,
                    update_build()
            },
            jv.build_dialog.okay = jv.Button.create(30, 32, 24, "X", jv.build_dialog),
            jv.build_dialog.add(jv.build_dialog.okay),
            jv.build_dialog.okay.right(8),
            jv.build_dialog.okay.top(8),
            jv.build_dialog.okay.on_click = function() {
                jv.build_dialog.visible = !1
            },
            jv.build_dialog.info = jv.scene(),
            jv.build_dialog.add(jv.build_dialog.info),
            jv.build_dialog.info.left(0),
            jv.build_dialog.info.bottom(60),
            jv.build_dialog.info.heading = jv.text("", {
                font: "10px Verdana",
                fill: jv.color_bright,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 4,
                align: "left"
            }),
            jv.build_dialog.info.heading.x = 60,
            jv.build_dialog.info.heading.y = 0,
            jv.build_dialog.info.addChild(jv.build_dialog.info.heading),
            jv.build_dialog.info.sprite = jv.sprite(),
            jv.build_dialog.info.sprite.x = 16,
            jv.build_dialog.info.sprite.y = 4,
            jv.build_dialog.info.addChild(jv.build_dialog.info.sprite),
            jv.build_dialog.info.use = jv.Button.create(60, 21, 36, "Build", jv.build_dialog.info, 26),
            jv.build_dialog.info.use.on_click = function() {
                this.parent.obj && send({
                    type: "bld",
                    tpl: this.parent.template
                })
            },
            jv.build_dialog.info.detail = jv.Button.create(103, 21, 36, "Info", jv.build_dialog.info, 26),
            jv.build_dialog.info.detail.on_click = function() {
                this.parent.obj && send({
                    type: "nfo",
                    tpl: this.parent.template
                })
            },
            jv.build_dialog.info.set_info = function(e) {
                if (me != -1) {
                    if (this.obj = e, !e)
                        return void(this.visible = !1);
                    this.visible = !0,
                        0 == e.quantity ? this.use.enable(0) : this.use.enable(1),
                        e.build_type ? this.use.set_text(e.build_type.capitalize()) : this.obj.can_pickup ? this.use.set_text("Craft") : this.use.set_text("Build"),
                        this.slot = e.slot,
                    void 0 !== e.template && (this.template = e.template),
                        e.quantity > 1 ? this.heading.text = e.title.text + "  ( " + e.quantity + " )" : this.heading.text = e.title.text,
                        this.sprite.texture = e.texture,
                        this.use.visible = !0,
                        this.detail.visible = !0
                }
            },
            jv.build_dialog.info.use.visible = !1,
            jv.build_dialog.info.detail.visible = !1,
            jv.stat_dialog = jv.Dialog.create(318, 270),
            jv.stat_dialog.heading = jv.text("Character Stats", {
                font: "12px Verdana",
                fill: 15658734,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 4,
                align: "left"
            }),
            jv.stat_dialog.add(jv.stat_dialog.heading),
            jv.stat_dialog.heading.center(),
            jv.stat_dialog.heading.top(8);
        var t, n = {
                font: "10px Verdana",
                fill: 15658734,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 1,
                align: "center"
            },
            r = {
                font: "10px Verdana",
                fill: 61166,
                lineJoin: "round",
                align: "left",
                wordWrap: !0,
                wordWrapWidth: 184,
                breakWords: !0,
                stroke: 4473924,
                strokeThickness: 1
            },
            s = 24,
            l = ["level", "hp", "attack", "defense", "speed", "crit_chance", "exp_bonus", "myst_bonus", "exp_to_level", "myst_refund", "daily_bonus", "weight", "time_alive", "steps", "angel_dust", "dust_earned", "traits"];
        for (t in l)
            jv.stat_dialog[l[t] + "_label"] = jv.text(l[t].capitalize().replaceAll("_", " ") + ": ", n),
                jv.stat_dialog.add(jv.stat_dialog[l[t] + "_label"]),
                t % 2 != 0 && "traits" !== l[t] ? (jv.stat_dialog[l[t] + "_label"].right(80),
                    jv.stat_dialog[l[t] + "_label"].top(s)) : (jv.stat_dialog[l[t] + "_label"].right(230),
                    jv.stat_dialog[l[t] + "_label"].top(s += 16)),
                jv.stat_dialog[l[t]] = jv.text("", r),
                jv.stat_dialog.add(jv.stat_dialog[l[t]]),
                jv.stat_dialog[l[t]].x = jv.stat_dialog[l[t] + "_label"].x + jv.stat_dialog[l[t] + "_label"].width + 2,
                jv.stat_dialog[l[t]].y = jv.stat_dialog[l[t] + "_label"].y;
        jv.stat_dialog.okay = jv.Button.create(30, 32, 24, "X", jv.stat_dialog),
            jv.stat_dialog.add(jv.stat_dialog.okay),
            jv.stat_dialog.okay.right(8),
            jv.stat_dialog.okay.top(8),
            jv.stat_dialog.okay.on_click = function() {
                jv.stat_dialog.visible = !1
            },
            jv.stat_dialog.skill = jv.Button.create(0, 0, 96, "Skills", jv.stat_dialog),
            jv.stat_dialog.add(jv.stat_dialog.skill),
            jv.stat_dialog.skill.left(10),
            jv.stat_dialog.skill.bottom(38),
            jv.stat_dialog.skill.on_click = function() {
                send({
                    type: "c",
                    r: "sk"
                }),
                    jv.skill_dialog.show()
            },
            jv.stat_dialog.upgrades = jv.Button.create(0, 0, 96, "Upgrades", jv.stat_dialog),
            jv.stat_dialog.add(jv.stat_dialog.upgrades),
            jv.stat_dialog.upgrades.left(111),
            jv.stat_dialog.upgrades.bottom(38),
            jv.stat_dialog.upgrades.on_click = function() {
                send({
                    type: "c",
                    r: "up"
                }),
                    jv.upgrade_dialog.show()
            },
            jv.stat_dialog.reincarnate = jv.Button.create(0, 0, 96, "Reincarnate", jv.stat_dialog),
            jv.stat_dialog.add(jv.stat_dialog.reincarnate),
            jv.stat_dialog.reincarnate.right(10),
            jv.stat_dialog.reincarnate.bottom(38),
            jv.stat_dialog.reincarnate.on_click = function() {
                send({
                    type: "c",
                    r: "rn"
                }),
                    jv.reincarnate_dialog.show()
            },
            jv.stat_dialog.reincarnate.enable(1),
            jv.stat_dialog.quest = jv.Button.create(0, 0, 96, "Quests", jv.stat_dialog),
            jv.stat_dialog.add(jv.stat_dialog.quest),
            jv.stat_dialog.quest.left(61),
            jv.stat_dialog.quest.bottom(8),
            jv.stat_dialog.quest.on_click = function() {
                send({
                    type: "c",
                    r: "qs"
                })
            },
            jv.stat_dialog.appearance = jv.Button.create(0, 0, 96, "Appearance", jv.stat_dialog),
            jv.stat_dialog.add(jv.stat_dialog.appearance),
            jv.stat_dialog.appearance.right(61),
            jv.stat_dialog.appearance.bottom(8),
            jv.stat_dialog.appearance.enable(1),
            jv.stat_dialog.appearance.on_click = function() {
                jv.appearance_dialog.show()
            },
            jv.skill_dialog = jv.Dialog.create(320, 250),
            jv.skill_dialog.heading = jv.text("Character Skills", {
                font: "12px Verdana",
                fill: 15658734,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 4,
                align: "left"
            }),
            jv.skill_dialog.add(jv.skill_dialog.heading),
            jv.skill_dialog.heading.center(),
            jv.skill_dialog.heading.top(8),
            jv.skill_dialog.slot = [],
            jv.skill_dialog.page = 0,
            jv.skill_dialog.do_update = function() {
                var e = jv.skill_dialog.page;
                if (jv.skills) {
                    var t, i, o = 0,
                        a = 16;
                    for (t = 0; t < jv.skill_dialog.slot.length; t++)
                        jv.skill_dialog.slot[t] && (jv.skill_dialog.slot[t].label.visible = 0,
                            jv.skill_dialog.slot[t].stars.visible = 0);
                    for (i in jv.skill_order)
                        if (t = jv.skill_order[i],
                        o < 10 * e)
                            o++;
                        else {
                            if (o >= 10 * (e + 1))
                                break;
                            jv.skill_dialog.slot[o] || (a = 40 + i % 10 * 16,
                                jv.skill_dialog.slot[o] = {},
                                jv.skill_dialog.slot[o].stars = new PIXI.Container,
                                jv.skill_dialog.add(jv.skill_dialog.slot[o].stars),
                                jv.skill_dialog.slot[o].stars.row = [],
                                jv.skill_dialog.slot[o].stars.right(172),
                                jv.skill_dialog.slot[o].stars.top(a),
                                jv.skill_dialog.slot[o].label = jv.text("", n),
                                jv.skill_dialog.add(jv.skill_dialog.slot[o].label),
                                jv.skill_dialog.slot[o].label.right(298),
                                jv.skill_dialog.slot[o].label.top(a));
                            var r, s = Math.floor(jv.skills[t][3] / 10),
                                l = jv.skills[t][0];
                            for (r = 0; r < jv.skill_dialog.slot[o].stars.row.length; r++)
                                jv.skill_dialog.slot[o].stars.row[r] && (jv.skill_dialog.slot[o].stars.row[r].visible = 0);
                            for (r = 0; r < s || r < jv.skill_tier; r++)
                                jv.skill_dialog.slot[o].stars.row[r] || (jv.skill_dialog.slot[o].stars.row[r] = jv.sprite(jv.star.texture),
                                    jv.skill_dialog.slot[o].stars.addChild(jv.skill_dialog.slot[o].stars.row[r]),
                                    jv.skill_dialog.slot[o].stars.row[r].x = 16 * r,
                                    jv.skill_dialog.slot[o].stars.row[r].scale.x = 1,
                                    jv.skill_dialog.slot[o].stars.row[r].scale.y = 1),
                                    r >= s ? (jv.skill_dialog.slot[o].stars.row[r].alpha = .8,
                                        jv.skill_dialog.slot[o].stars.row[r].tint = 3355494) : (jv.skill_dialog.slot[o].stars.row[r].alpha = 1,
                                        l ? (jv.skill_dialog.slot[o].stars.row[r].tint = 43775,
                                            l--) : (jv.skill_dialog.slot[o].stars.row[r].tint = 16776994,
                                        r >= jv.skill_tier && (jv.skill_dialog.slot[o].stars.row[r].alpha = .4))),
                                    jv.skill_dialog.slot[o].stars.row[r].visible = 1;
                            jv.skill_dialog.slot[o].label.visible = 1,
                                jv.skill_dialog.slot[o].stars.visible = 1,
                                jv.skill_dialog.slot[o].label.text = t.capitalize() + ": " + (jv.skills[t][0] >= jv.skill_tier ? 10 * jv.skills[t][0] : jv.skills[t][2]),
                            jv.skills[t][2] != jv.skills[t][1] && (jv.skill_dialog.slot[o].label.text = jv.skill_dialog.slot[o].label.text + " (+" + (jv.skills[t][2] - jv.skills[t][1]) + ")"),
                                jv.skill_dialog.slot[o].label.right(298),
                                o++
                        }
                    o >= jv.skill_order.length ? jv.skill_dialog.next.visible = 0 : jv.skill_dialog.next.visible = 1,
                        e > 0 ? jv.skill_dialog.prev.visible = 1 : jv.skill_dialog.prev.visible = 0
                }
            },
            jv.skill_dialog.next = jv.Button.create(30, 32, 40, "Next", jv.skill_dialog),
            jv.skill_dialog.add(jv.skill_dialog.next),
            jv.skill_dialog.next.right(36),
            jv.skill_dialog.next.bottom(16),
            jv.skill_dialog.next.on_click = function() {
                jv.skill_dialog.page++,
                    jv.skill_dialog.do_update()
            },
            jv.skill_dialog.prev = jv.Button.create(30, 32, 40, "Prev", jv.skill_dialog),
            jv.skill_dialog.add(jv.skill_dialog.prev),
            jv.skill_dialog.prev.left(36),
            jv.skill_dialog.prev.bottom(16),
            jv.skill_dialog.prev.on_click = function() {
                jv.skill_dialog.page--,
                    jv.skill_dialog.do_update()
            },
            jv.skill_dialog.okay = jv.Button.create(30, 32, 24, "X", jv.skill_dialog),
            jv.skill_dialog.add(jv.skill_dialog.okay),
            jv.skill_dialog.okay.right(8),
            jv.skill_dialog.okay.top(8),
            jv.skill_dialog.okay.on_click = function() {
                jv.skill_dialog.page = 0,
                    jv.skill_dialog.visible = !1
            },
            jv.spawn_dialog = jv.Dialog.create(260, 180, jv.stage),
            jv.spawn_dialog.left(240),
            jv.spawn_dialog.top(118),
            jv.spawn_dialog.modal = 1,
            jv.spawn_dialog.heading = jv.text("Just a Scratch..", e),
            jv.spawn_dialog.add(jv.spawn_dialog.heading),
            jv.spawn_dialog.heading.center(),
            jv.spawn_dialog.heading.top(8),
            n = {
                font: "10px Verdana",
                fill: 15658734,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 1,
                align: "center"
            },
            r = {
                font: "11px Verdana",
                fill: 16776960,
                lineJoin: "round",
                align: "left",
                wordWrap: !0,
                wordWrapWidth: 180,
                breakWords: !0,
                stroke: 4473924,
                strokeThickness: 1
            };
        var d = {
            font: "11px Verdana",
            fill: 11783372,
            lineJoin: "round",
            align: "center",
            wordWrap: !0,
            wordWrapWidth: 180,
            breakWords: !0,
            stroke: jv.color_dark,
            strokeThickness: 2
        };
        s = 16,
            jv.spawn_dialog.death = jv.text("Hero has fallen! They were level 10 and skilled at dagger. Killed by a wolf.", d),
            jv.spawn_dialog.add(jv.spawn_dialog.death),
            jv.spawn_dialog.death.center(),
            jv.spawn_dialog.death.top(s += 16),
            jv.spawn_dialog.dust_label = jv.text("Angel Dust Gained:", n),
            jv.spawn_dialog.add(jv.spawn_dialog.dust_label),
            jv.spawn_dialog.dust_label.right(90),
            jv.spawn_dialog.dust_label.top(s += 78),
            jv.spawn_dialog.dust = jv.text("120", r),
            jv.spawn_dialog.add(jv.spawn_dialog.dust),
            jv.spawn_dialog.dust.x = jv.spawn_dialog.dust_label.x + jv.spawn_dialog.dust_label.width + 2,
            jv.spawn_dialog.dust.y = jv.spawn_dialog.dust_label.y,
            jv.spawn_dialog.yes = jv.Button.create(0, 0, 80, "Respawn", jv.spawn_dialog),
            jv.spawn_dialog.add(jv.spawn_dialog.yes),
            jv.spawn_dialog.yes.center(),
            jv.spawn_dialog.yes.bottom(16),
            jv.spawn_dialog.yes.on_click = function() {
                send({
                    type: "login",
                    data: "/me"
                }),
                    jv.spawn_dialog.hide()
            },
            jv.quest_dialog = jv.Dialog.create(320, 260),
            jv.quest_dialog.heading = jv.text("Current Quests", e),
            jv.quest_dialog.add(jv.quest_dialog.heading),
            jv.quest_dialog.heading.center(),
            jv.quest_dialog.heading.top(8),
            jv.quest_dialog.task = [],
            jv.quest_dialog.task[0] = {},
            jv.quest_dialog.task[1] = {},
            jv.quest_dialog.task[0].name = jv.text("Safe Keeping", {
                font: "12px Verdana",
                fill: 15658683,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 1,
                align: "center"
            }),
            jv.quest_dialog.add(jv.quest_dialog.task[0].name),
            jv.quest_dialog.task[0].name.left(32),
            jv.quest_dialog.task[0].name.top(36),
            jv.quest_dialog.task[0].desc = jv.text("Make a floor tile with wood, clay, or stone. Build one in your inventory then use it to create a floor under you. Floor tiles keep your items safe so they don't decay.", {
                font: "11px Verdana",
                fill: 11783372,
                lineJoin: "round",
                align: "left",
                wordWrap: !0,
                wordWrapWidth: 260,
                breakWords: !0,
                stroke: jv.color_dark,
                strokeThickness: 2
            }),
            jv.quest_dialog.add(jv.quest_dialog.task[0].desc),
            jv.quest_dialog.task[0].desc.left(32),
            jv.quest_dialog.task[0].desc.top(56),
            jv.quest_dialog.task[1].name = jv.text("Safe Keeping", {
                font: "12px Verdana",
                fill: 15658683,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 1,
                align: "center"
            }),
            jv.quest_dialog.add(jv.quest_dialog.task[1].name),
            jv.quest_dialog.task[1].name.left(32),
            jv.quest_dialog.task[1].name.top(142),
            jv.quest_dialog.task[1].desc = jv.text("Make a floor tile with wood, clay, or stone. Build one in your inventory then use it to create a floor under you. Floor tiles keep your items safe so they don't decay.", {
                font: "11px Verdana",
                fill: 11783372,
                lineJoin: "round",
                align: "left",
                wordWrap: !0,
                wordWrapWidth: 260,
                breakWords: !0,
                stroke: jv.color_dark,
                strokeThickness: 2
            }),
            jv.quest_dialog.add(jv.quest_dialog.task[1].desc),
            jv.quest_dialog.task[1].desc.left(32),
            jv.quest_dialog.task[1].desc.top(162),
            jv.quest_dialog.okay = jv.Button.create(30, 32, 24, "X", jv.quest_dialog),
            jv.quest_dialog.add(jv.quest_dialog.okay),
            jv.quest_dialog.okay.right(8),
            jv.quest_dialog.okay.top(8),
            jv.quest_dialog.okay.on_click = function() {
                jv.quest_dialog.page = 0,
                    jv.quest_dialog.visible = !1
            },
            jv.quest_dialog.do_update = function() {
                jv.quest_dialog.task[0].name.text = "",
                    jv.quest_dialog.task[0].desc.text = "",
                    jv.quest_dialog.task[1].name.text = "",
                    jv.quest_dialog.task[1].desc.text = "";
                var e, t, i = 0;
                for (e in jv.quest)
                    t = jv.quest[e].name,
                    jv.quest[e].prog && (t += " [" + jv.quest[e].prog + "]"),
                        jv.quest_dialog.task[i].name.text = t,
                        jv.quest_dialog.task[i].desc.text = jv.quest[e].desc,
                        i++
            },
            jv.mapping_dialog = jv.Dialog.create(380, 340),
            jv.mapping_dialog.page = 0,
            jv.preview_tile = jv.sprite(tiles[0][Math.floor(0)]),
            jv.preview_tile.tile = 0,
            jv.mapping_dialog.add(jv.preview_tile),
            jv.preview_tile.left(300),
            jv.preview_tile.top(16),
            jv.mapping_dialog.tile_label = jv.text("", {
                font: "12px Verdana",
                fill: 15658734,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 4,
                align: "left"
            }),
            jv.mapping_dialog.add(jv.mapping_dialog.tile_label),
            jv.mapping_dialog.tile_label.left(300),
            jv.mapping_dialog.tile_label.top(48),
            jv.map_tile = [],
            jv.itm_tile = [],
            jv.mapping_dialog.update = function() {
                var e, t, i = 0;
                for (t = 0; t < 8; t++)
                    for (e = 0; e < 16; e++)
                        jv.map_tile[i] ? (jv.map_tile[i].texture = tiles[(i + 128 * jv.mapping_dialog.page) % 16][Math.floor((i + 128 * jv.mapping_dialog.page) / 16)],
                            jv.map_tile[i].tile = i + 128 * jv.mapping_dialog.page) : (jv.map_tile[i] = jv.sprite(tiles[(i + 128 * jv.mapping_dialog.page) % 16][Math.floor((i + 128 * jv.mapping_dialog.page) / 16)]),
                            jv.map_tile[i].tile = i + 128 * jv.mapping_dialog.page,
                            jv.map_tile[i].interactive = !0,
                            jv.map_tile[i].scale.x = .5,
                            jv.map_tile[i].scale.y = .5,
                            jv.map_tile[i].mouseover = function() {
                                jv.preview_tile.texture = tiles[this.tile % 16][Math.floor(this.tile / 16)]
                            },
                            jv.map_tile[i].mouseout = function() {
                                jv.preview_tile.texture = tiles[jv.preview_tile.tile % 16][Math.floor(jv.preview_tile.tile / 16)]
                            },
                            jv.map_tile[i].do_click = function() {
                                jv.preview_tile.tile = this.tile,
                                    jv.mapping_dialog.tile_label.text = "" + this.tile,
                                    jv.preview_tile.texture = tiles[jv.preview_tile.tile % 16][Math.floor(jv.preview_tile.tile / 16)],
                                    playSound("click"),
                                    send({
                                        type: "c",
                                        r: "mp",
                                        s: this.tile
                                    })
                            },
                            jv.map_tile[i].on("mouseup", jv.map_tile[i].do_click),
                            jv.map_tile[i].on("touchend", jv.map_tile[i].do_click),
                            jv.mapping_dialog.add(jv.map_tile[i]),
                            jv.map_tile[i].top(17 * t + 16),
                            jv.map_tile[i].left(17 * e + 16)),
                            jv.itm_tile[i] ? (jv.itm_tile[i].texture = items[(i + 128 * jv.mapping_dialog.page) % 16][Math.floor((i + 128 * jv.mapping_dialog.page) / 16)],
                                jv.itm_tile[i].tile = i + 128 * jv.mapping_dialog.page) : (jv.itm_tile[i] = jv.sprite(items[(i + 128 * jv.mapping_dialog.page) % 16][Math.floor((i + 128 * jv.mapping_dialog.page) / 16)]),
                                jv.itm_tile[i].tile = i + 128 * jv.mapping_dialog.page,
                                jv.itm_tile[i].interactive = !0,
                                jv.itm_tile[i].scale.x = .5,
                                jv.itm_tile[i].scale.y = .5,
                                jv.itm_tile[i].mouseover = function() {
                                    jv.preview_tile.texture = items[this.tile % 16][Math.floor(this.tile / 16)]
                                },
                                jv.itm_tile[i].mouseout = function() {
                                    jv.preview_tile.texture = items[jv.preview_tile.tile % 16][Math.floor(jv.preview_tile.tile / 16)]
                                },
                                jv.itm_tile[i].do_click = function() {
                                    jv.preview_tile.tile = this.tile,
                                        jv.mapping_dialog.tile_label.text = "" + this.tile,
                                        jv.preview_tile.texture = items[jv.preview_tile.tile % 16][Math.floor(jv.preview_tile.tile / 16)]
                                },
                                jv.itm_tile[i].on("mouseup", jv.itm_tile[i].do_click),
                                jv.itm_tile[i].on("touchend", jv.itm_tile[i].do_click),
                                jv.mapping_dialog.add(jv.itm_tile[i]),
                                jv.itm_tile[i].top(17 * t + 160),
                                jv.itm_tile[i].left(17 * e + 16)),
                            i++;
                jv.mapping_dialog.page <= 0 ? jv.mapping_dialog.prev.enable(0) : jv.mapping_dialog.prev.enable(1),
                    jv.mapping_dialog.page >= 7 ? jv.mapping_dialog.next.enable(0) : jv.mapping_dialog.next.enable(1)
            },
            jv.mapping_dialog.next = jv.Button.create(30, 32, 32, ">", jv.mapping_dialog),
            jv.mapping_dialog.add(jv.mapping_dialog.next),
            jv.mapping_dialog.next.left(266),
            jv.mapping_dialog.next.bottom(16),
            jv.mapping_dialog.next.on_click = function() {
                jv.mapping_dialog.page++,
                    jv.mapping_dialog.update()
            },
            jv.mapping_dialog.prev = jv.Button.create(30, 32, 32, "<", jv.mapping_dialog),
            jv.mapping_dialog.add(jv.mapping_dialog.prev),
            jv.mapping_dialog.prev.left(16),
            jv.mapping_dialog.prev.bottom(16),
            jv.mapping_dialog.prev.on_click = function() {
                jv.mapping_dialog.page--,
                    jv.mapping_dialog.update()
            },
            jv.mapping_dialog.okay = jv.Button.create(30, 32, 24, "X", jv.mapping_dialog),
            jv.mapping_dialog.add(jv.mapping_dialog.okay),
            jv.mapping_dialog.okay.right(8),
            jv.mapping_dialog.okay.top(8),
            jv.mapping_dialog.okay.on_click = function() {
                jv.mapping_dialog.visible = !1
            },
            jv.mapping_dialog.update(),
            jv.stage.addChild(splash),
            jv.login_dialog = jv.Dialog.create(260, 160, jv.stage),
            jv.login_dialog.left(Math.floor(jv.game_width / 2) - 128),
            jv.login_dialog.top(200),
            jv.login_dialog.modal = 1,
            jv.login_dialog.heading = jv.text("Character Login", e),
            jv.login_dialog.add(jv.login_dialog.heading),
            jv.login_dialog.heading.center(),
            jv.login_dialog.heading.top(8),
            jv.login_dialog.notice = jv.text("", {
                font: "9px Verdana",
                fill: 13413034,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 1,
                align: "center"
            }),
            jv.login_dialog.add(jv.login_dialog.notice),
            jv.login_dialog.notice.center(),
            jv.login_dialog.notice.top(26),
            jv.login_dialog.username = jv.TextInput.create(0, 0, 180, 24, jv.login_dialog),
            jv.login_dialog.username.placeholder.text = "Username",
            jv.login_dialog.add(jv.login_dialog.username),
            jv.login_dialog.username.center(),
            jv.login_dialog.username.bottom(90),
            jv.login_dialog.username.on_change = function() {
                "" === this.chars && (jv.login_dialog.guest.visible = 1)
            },
            jv.login_dialog.password = jv.TextInput.create(0, 0, 180, 24, jv.login_dialog),
            jv.login_dialog.password.placeholder.text = "Password",
            jv.login_dialog.password.password = !0,
            jv.login_dialog.add(jv.login_dialog.password),
        jv.login_dialog.password.center(),
        jv.login_dialog.password.bottom(58),
        jv.login_dialog.username.tab_next = jv.login_dialog.password,
        jv.login_dialog.password.tab_next = jv.login_dialog.username,
        jv.login_dialog.username.onSubmit = function() {
            jv.login_dialog.okay.on_click()
        },
        jv.login_dialog.password.onSubmit = jv.login_dialog.username.onSubmit,
        jv.login_dialog.okay = jv.Button.create(30, 32, 60, "Login", jv.login_dialog),
        jv.login_dialog.add(jv.login_dialog.okay),
        jv.login_dialog.okay.center(),
        jv.login_dialog.okay.bottom(20),
        jv.login_dialog.okay.on_click = function() {
            "" != jv.login_dialog.username.chars && "" != jv.login_dialog.password.chars && (jv.login_dialog.okay.enable(0),
                jv.login_dialog.create.enable(0),
                jv.login_dialog.worlds.enable(0),
                jv.login_dialog.guest.enable(0),
                jv.login_dialog.notice.text = "",
                send({
                    type: "login",
                    user: jv.base64_encode(jv.login_dialog.username.chars.trim()),
                    pass: jv.base64_encode(jv.login_dialog.password.chars.trim())
                }))
        },
        jv.login_dialog.guest = jv.Button.create(30, 32, 100, "Play as Guest", jv.login_dialog, 42),
        jv.login_dialog.add(jv.login_dialog.guest),
        jv.login_dialog.guest.right(-120),
        jv.login_dialog.guest.middle(),
        jv.login_dialog.guest.on_click = function() {
            jv.login_dialog.guest.enable(0),
                jv.login_dialog.create.enable(0),
                jv.login_dialog.worlds.enable(0),
                jv.login_dialog.guest.enable(0),
                jv.login_dialog.notice.text = "",
                send({
                    type: "guest"
                })
        },
        jv.login_dialog.guest.visible = 0,
        jv.login_dialog.create = jv.Button.create(30, 32, 80, "Create New", jv.login_dialog),
        jv.login_dialog.add(jv.login_dialog.create),
        jv.login_dialog.create.left(32),
        jv.login_dialog.create.bottom(-40),
        jv.login_dialog.create.on_click = function() {
            jv.login_dialog.hide(),
                jv.create_dialog.show()
        },
        jv.login_dialog.worlds = jv.Button.create(30, 32, 80, "Worlds", jv.login_dialog),
        jv.login_dialog.add(jv.login_dialog.worlds),
        jv.login_dialog.worlds.right(32),
        jv.login_dialog.worlds.bottom(-40),
        jv.login_dialog.worlds.on_click = function() {
            jv.login_dialog.hide(),
                jv.create_dialog.hide(),
                connection.close(),
                show_reconnect(" ")
        },
        jv.login_dialog.okay.enable(0),
        jv.login_dialog.create.enable(0);
        var _ = 500;
        jv.reconnect_dialog = jv.Dialog.create(_, 190, jv.stage),
            jv.reconnect_dialog.left(Math.floor(jv.game_width / 2) - _ / 2),
            jv.reconnect_dialog.top(192),
            jv.reconnect_dialog.modal = 1,
            jv.reconnect_dialog.heading = jv.text("- Choose a World -", e),
            jv.reconnect_dialog.add(jv.reconnect_dialog.heading),
            jv.reconnect_dialog.heading.center(),
            jv.reconnect_dialog.heading.top(8),
            jv.reconnect_dialog.notice = jv.text("", {
                font: "9px Verdana",
                fill: 13413034,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 1,
                align: "center"
            }),
            jv.reconnect_dialog.add(jv.reconnect_dialog.notice),
            jv.reconnect_dialog.notice.center(),
            jv.reconnect_dialog.notice.top(82);
        var p = 1;
        if (jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 156, "USTexas", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "ust.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].center(),
            jv.reconnect_dialog["connect" + p].top(35),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 156, "USWest", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "usw.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].left(12),
            jv.reconnect_dialog["connect" + p].top(35),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 156, "USEast", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "use.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].right(12),
            jv.reconnect_dialog["connect" + p].top(35),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 116, "Europe", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "eu.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].right(132),
            jv.reconnect_dialog["connect" + p].top(75),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 156, "Brasil", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "br.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].center(),
            jv.reconnect_dialog["connect" + p].top(115),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 156, "SE Asia", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "sea.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].right(12),
            jv.reconnect_dialog["connect" + p].top(115),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 116, "London", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "ldn.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].left(132),
            jv.reconnect_dialog["connect" + p].top(75),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 116, "USEast2", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "use2.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].right(12),
            jv.reconnect_dialog["connect" + p].top(75),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 156, "Sudamérica", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "sa.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].left(12),
            jv.reconnect_dialog["connect" + p].top(115),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            p++,
            jv.reconnect_dialog["connect" + p] = jv.Button.create(40, 40, 116, "USWest2", jv.reconnect_dialog, 34),
            jv.reconnect_dialog["connect" + p].ip = "usw2.mysteralegacy.com",
            jv.reconnect_dialog.add(jv.reconnect_dialog["connect" + p]),
            jv.reconnect_dialog["connect" + p].left(12),
            jv.reconnect_dialog["connect" + p].top(75),
            jv.reconnect_dialog["connect" + p].on_click = function() {
                jv.selected_ip = this.ip,
                    do_connect()
            },
            jv.reconnect_dialog.info = jv.text("Account names are shared across servers. Stats and items are different on each world.", {
                font: "10px Verdana",
                fill: 11783372,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "center",
                wordWrap: !0,
                wordWrapWidth: 500,
                breakWords: !1
            }),
            jv.reconnect_dialog.add(jv.reconnect_dialog.info),
            jv.reconnect_dialog.info.center(),
            jv.reconnect_dialog.info.bottom(24),
            phone ? jv.reconnect_dialog.news = jv.text("You can also play from the website: www.mysteralegacy.com", {
                font: "9px Verdana",
                fill: 10730427,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "center",
                wordWrap: !0,
                wordWrapWidth: 500,
                breakWords: !1
            }) : jv.reconnect_dialog.news = jv.text("You can also play from the phone app on the Google Play Store", {
                font: "9px Verdana",
                fill: 10730427,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 2,
                align: "center",
                wordWrap: !0,
                wordWrapWidth: 500,
                breakWords: !1
            }),
            jv.reconnect_dialog.add(jv.reconnect_dialog.news),
            jv.reconnect_dialog.news.center(),
            jv.reconnect_dialog.news.bottom(6),
            jv.reconnect_dialog.tip = jv.text("Tip: If you hold down the action button for a few seconds it will stay pressed!", {
                font: "12px Verdana",
                fill: 13413119,
                lineJoin: "round",
                stroke: jv.color_dark,
                strokeThickness: 4,
                align: "right",
                wordWrap: !0,
                wordWrapWidth: 700,
                breakWords: !0
            }),
            jv.reconnect_dialog.add(jv.reconnect_dialog.tip),
            jv.reconnect_dialog.tip.center(),
            jv.reconnect_dialog.tip.bottom(-20),
            jv.reconnect_dialog.tip.alpha = .6,
        "undefined" != typeof mlmeta) {
            if (jv.metaconfig = mlmeta,
            jv.metaconfig.servers && jv.metaconfig.servers.length) {
                var t, u, h;
                for (t = 0; t < jv.metaconfig.servers.length; t++)
                    h = jv.metaconfig.servers[t],
                        u = jv.reconnect_dialog["connect" + (t + 1)],
                        u.set_text(h.title),
                        u.ip = h.ip
            }
            jv.metaconfig.tip && (jv.reconnect_dialog.tip.text = jv.metaconfig.tip,
                jv.reconnect_dialog.tip.x = _ / 2 - jv.reconnect_dialog.tip.width / 2 + 1),
            jv.metaconfig.news && "" !== jv.metaconfig.news && (jv.reconnect_dialog.news.text = jv.metaconfig.news),
            jv.metaconfig.music && playMusic(jv.metaconfig.music)
        }
        jv.create_dialog = jv.Dialog.create(460, 160, jv.stage),
            jv.create_dialog.left(Math.floor(jv.game_width / 2) - 230),
            jv.create_dialog.top(200),
            jv.create_dialog.modal = 1,
            jv.create_dialog.heading = jv.text("Create New Character", e),
            jv.create_dialog.add(jv.create_dialog.heading),
            jv.create_dialog.heading.center(),
            jv.create_dialog.heading.top(8),
            jv.create_dialog.notice = jv.text("", {
                font: "9px Verdana",
                fill: 13413034,
                lineJoin: "round",
                stroke: 4473924,
                strokeThickness: 1,
                align: "center"
            }),
            jv.create_dialog.add(jv.create_dialog.notice),
            jv.create_dialog.notice.center(),
            jv.create_dialog.notice.top(26),
            jv.create_dialog.username = jv.TextInput.create(0, 0, 180, 24, jv.create_dialog),
            jv.create_dialog.username.placeholder.text = "Player name",
            jv.create_dialog.add(jv.create_dialog.username),
            jv.create_dialog.username.left(32),
            jv.create_dialog.username.bottom(90),
            jv.create_dialog.email = jv.TextInput.create(0, 0, 180, 24, jv.create_dialog),
            jv.create_dialog.email.placeholder.text = "Email (for lost passwords)",
            jv.create_dialog.add(jv.create_dialog.email),
            jv.create_dialog.email.right(32),
            jv.create_dialog.email.bottom(90),
            jv.create_dialog.password = jv.TextInput.create(0, 0, 180, 24, jv.create_dialog),
            jv.create_dialog.password.placeholder.text = "Password",
            jv.create_dialog.password.password = !0,
            jv.create_dialog.add(jv.create_dialog.password),
            jv.create_dialog.password.left(32),
            jv.create_dialog.password.bottom(58),
            jv.create_dialog.confirm = jv.TextInput.create(0, 0, 180, 24, jv.create_dialog),
            jv.create_dialog.confirm.placeholder.text = "Confirm password",
            jv.create_dialog.confirm.password = !0,
            jv.create_dialog.add(jv.create_dialog.confirm),
            jv.create_dialog.confirm.right(32),
            jv.create_dialog.confirm.bottom(58),
            jv.create_dialog.username.tab_next = jv.create_dialog.email,
            jv.create_dialog.email.tab_next = jv.create_dialog.password,
            jv.create_dialog.password.tab_next = jv.create_dialog.confirm,
            jv.create_dialog.confirm.tab_next = jv.create_dialog.username,
            jv.create_dialog.username.onSubmit = function() {
                jv.create_dialog.okay.on_click()
            },
            jv.create_dialog.password.onSubmit = jv.create_dialog.username.onSubmit,
            jv.create_dialog.email.onSubmit = jv.create_dialog.username.onSubmit,
            jv.create_dialog.confirm.onSubmit = jv.create_dialog.username.onSubmit,
            jv.create_dialog.okay = jv.Button.create(30, 32, 60, "Create", jv.create_dialog),
            jv.create_dialog.add(jv.create_dialog.okay),
            jv.create_dialog.okay.center(),
            jv.create_dialog.okay.bottom(20),
            jv.create_dialog.okay.on_click = function() {
                if ("" != jv.create_dialog.username.chars && "" != jv.create_dialog.password.chars) {
                    if ("" == jv.create_dialog.email.chars)
                        return jv.create_dialog.notice.text = "Email required.",
                            jv.create_dialog.notice.w = 0,
                            void jv.create_dialog.notice.center();
                    if (jv.create_dialog.password.chars != jv.create_dialog.confirm.chars)
                        return jv.create_dialog.notice.text = "Password and confirmation don't match.",
                            jv.create_dialog.notice.w = 0,
                            void jv.create_dialog.notice.center();
                    jv.create_dialog.okay.enable(0),
                        jv.create_dialog.login.enable(0),
                        jv.create_dialog.notice.text = "",
                        send({
                            type: "login",
                            user: jv.base64_encode(jv.create_dialog.username.chars.trim()),
                            email: jv.base64_encode(jv.create_dialog.email.chars.trim()),
                            pass: jv.base64_encode(jv.create_dialog.password.chars.trim())
                        })
                }
            },
            jv.create_dialog.login = jv.Button.create(30, 32, 40, "Back", jv.create_dialog),
            jv.create_dialog.add(jv.create_dialog.login),
            jv.create_dialog.login.center(),
            jv.create_dialog.login.bottom(-40),
            jv.create_dialog.login.on_click = function() {
                jv.create_dialog.hide(),
                    jv.login_dialog.show()
            },
            jv.create_dialog.close = jv.Button.create(30, 32, 24, "X", jv.create_dialog),
            jv.create_dialog.add(jv.create_dialog.close),
            jv.create_dialog.close.right(8),
            jv.create_dialog.close.top(8),
            jv.create_dialog.close.on_click = function() {
                jv.create_dialog.visible = !1
            },
            jv.create_dialog.close.visible = 0;
        var v, g = jv.establish_dialog = make_dialog(260, 90, "Establishing Connection", {
            no_close: 1,
            parent: jv.stage
        });
        g.x = 250,
            g.y = 190,
            g.progress = make_label(" "),
            g.progress.left(4),
            g.progress.bottom(4),
            g.animal_choices = [8, 19, 131],
            g.animal_choice = g.animal_choices[Math.floor(Math.random() * g.animal_choices.length)],
            g.animal = jv.sprite(monster[g.animal_choice][1][2]),
            g.frame = 0,
            g.foot = 1,
            g.count = 0,
            g.add(g.animal),
            g.animal.center(),
            g.animal.top(38),
            g.on_open = function() {
                jv.establish_dialog.animate || (jv.establish_dialog.progress.text = " ",
                    jv.establish_dialog.animal_choice = jv.establish_dialog.animal_choices[Math.floor(Math.random() * jv.establish_dialog.animal_choices.length)],
                    jv.establish_dialog.animal.alpha = 0,
                    jv.establish_dialog.animate = setInterval(function() {
                        jv.establish_dialog.visible || (clearInterval(jv.establish_dialog.animate),
                            jv.establish_dialog.animate = null),
                            jv.establish_dialog.frame += jv.establish_dialog.foot,
                        2 != jv.establish_dialog.frame && 0 != jv.establish_dialog.frame || (jv.establish_dialog.foot = -jv.establish_dialog.foot),
                            jv.establish_dialog.count++,
                        jv.establish_dialog.animal.alpha < 1 && (jv.establish_dialog.animal.alpha += .05),
                        jv.establish_dialog.count > 5 && (jv.establish_dialog.count = 0,
                            jv.establish_dialog.progress.text = jv.establish_dialog.progress.text + ".",
                            jv.establish_dialog.progress.x = 128,
                            jv.establish_dialog.progress.x -= jv.establish_dialog.progress.width / 2),
                            jv.establish_dialog.animal.texture = monster[jv.establish_dialog.animal_choice][jv.establish_dialog.frame][2]
                    }, 200))
            };
        var v, g = jv.appearance_dialog = make_dialog(300, 300, "Character Appearance");
        g.frame = 0,
            g.foot = 1,
            g.sheet = jv.spritesheet(path + "data/body/b1.png" + vt, 18, 26),
            g.update_doll = function() {
                var e, t = jv.appearance_dialog;
                e = t.hair_color.get_selected() ? t.hair_color.get_selected().block_color : t.hair_color_custom.block_color || 16711680;
                var i;
                i = t.clothes_color.get_selected() ? t.clothes_color.get_selected().block_color : t.clothes_color_custom.block_color || 16711680;
                var o;
                o = t.eye_color.get_selected() ? t.eye_color.get_selected().block_color : t.eye_color_custom.block_color || 255,
                    t.sheet = build_doll(t.body.value, t.clothes.value, i, t.hair.value, e, o),
                    t.locked.visible = 0,
                    t.doll_left.alpha = 1,
                    t.doll_back.alpha = 1,
                    t.doll_face.alpha = 1,
                    t.apply.enable(1),
                jv.lock_body.indexOf(t.body.value) === -1 && jv.lock_hair.indexOf(t.hair.value) === -1 && jv.lock_clothes.indexOf(t.clothes.value) === -1 || (jv.premium || (t.doll_left.alpha = .7,
                    t.doll_back.alpha = .7,
                    t.doll_face.alpha = .7,
                    t.apply.enable(0)),
                    t.locked.visible = 1)
            },
            g.on_open = function() {
                var e = jv.appearance_dialog;
                e.body.choose(myself.body),
                    e.hair.choose(myself.hair),
                    e.clothes.choose(myself.clothes),
                e.hair_color.choose(myself.hair_color) || (e.hair_color.unselect_all(),
                    e.hair_color_custom.select(myself.hair_color)),
                e.clothes_color.choose(myself.clothes_color) || (e.clothes_color.unselect_all(),
                    e.clothes_color_custom.select(myself.clothes_color)),
                e.eye_color.choose(myself.eye_color) || (e.eye_color.unselect_all(),
                    e.eye_color_custom.select(myself.eye_color)),
                    jv.premium ? (e.special_color_custom.select(myself.title_color),
                        e.hair_color_custom.set_lock(0),
                        e.clothes_color_custom.set_lock(0),
                        e.special_color_custom.set_lock(0),
                        e.eye_color_custom.set_lock(0)) : (e.hair_color_custom.set_lock(1),
                        e.clothes_color_custom.set_lock(1),
                        e.special_color_custom.set_lock(1),
                        e.eye_color_custom.set_lock(1)),
                e.doll_left || (jv.dialog_construction = e,
                    v = e.doll_left = make_sprite(e.sheet[0][3]),
                    v.top(30),
                    v.left(25),
                    v.scale.x = 2,
                    v.scale.y = 2,
                    v = e.doll_face = make_sprite(e.sheet[0][2]),
                    v.top(30),
                    v.left(70),
                    v.scale.x = 2,
                    v.scale.y = 2,
                    v = e.doll_back = make_sprite(e.sheet[0][0]),
                    v.top(30),
                    v.left(115),
                    v.scale.x = 2,
                    v.scale.y = 2,
                    v = e.locked = make_label("-supporter style-"),
                    v.alpha = .3,
                    v.top(78),
                    v.left(37),
                    v.visible = 0),
                    e.update_doll(),
                    e.animate = setInterval(function() {
                        e.visible || clearInterval(e.animate),
                            e.frame += e.foot,
                        2 != e.frame && 0 != e.frame || (e.foot = -e.foot),
                            e.doll_left.texture = e.sheet[e.frame][3],
                            e.doll_face.texture = e.sheet[e.frame][2],
                            e.doll_back.texture = e.sheet[e.frame][0]
                    }, 200)
            },
            v = make_label("Choose Body"),
            v.top(32),
            v.left(180),
            v = g.body = make_range(["1", "2", "3", "4", "5", "6", "7", "8", "9"]),
            v.top(50),
            v.left(185),
            v.on_change = function() {
                jv.appearance_dialog.update_doll()
            },
            v = make_label("Hair Style"),
            v.top(96),
            v.left(49),
            v = g.hair = make_range(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"]),
            v.top(120),
            v.left(40),
            v.on_change = function() {
                jv.appearance_dialog.update_doll()
            },
            v = make_label("Hair Color"),
            v.top(96),
            v.left(175),
            v = g.hair_color = make_option(6504471, "hair_color", {
                selected: 1
            }),
            v.top(120),
            v.left(150),
            v = make_option(2960169, "hair_color"),
            v.top(120),
            v.left(180),
            v = make_option(16772694, "hair_color"),
            v.top(120),
            v.left(210),
            v.on_change = function() {
                jv.appearance_dialog.hair_color_custom.unselect(),
                    jv.appearance_dialog.update_doll()
            },
            v = g.hair_color_custom = make_color_picker(),
            v.top(120),
            v.left(240),
            v.low = 40,
            v.on_change = function() {
                jv.appearance_dialog.hair_color.unselect_all(),
                    jv.appearance_dialog.update_doll()
            },
            v = make_label("Clothing Style"),
            v.top(160),
            v.left(38),
            v = g.clothes = make_range(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]),
            v.top(184),
            v.left(40),
            v.on_change = function() {
                jv.appearance_dialog.update_doll()
            },
            v = make_label("Clothing Color"),
            v.top(160),
            v.left(165),
            v = g.clothes_color = make_option(14540253, "clothes_color", {
                selected: 1
            }),
            v.top(184),
            v.left(150),
            v = make_option(4958277, "clothes_color"),
            v.top(184),
            v.left(180),
            v = make_option(7059967, "clothes_color"),
            v.top(184),
            v.left(210),
            v.on_change = function() {
                jv.appearance_dialog.clothes_color_custom.unselect(),
                    jv.appearance_dialog.update_doll()
            },
            v = g.clothes_color_custom = make_color_picker(),
            v.top(184),
            v.left(240),
            v.low = 30,
            v.on_change = function() {
                jv.appearance_dialog.clothes_color.unselect_all(),
                    jv.appearance_dialog.update_doll()
            },
            v = make_label("Eye Color"),
            v.top(224),
            v.left(46),
            v = g.eye_color = make_option(9682175, "eye_color", {
                selected: 1
            }),
            v.top(248),
            v.left(20),
            v = make_option(11700288, "eye_color"),
            v.top(248),
            v.left(50),
            v = make_option(8843904, "eye_color"),
            v.top(248),
            v.left(80),
            v.on_change = function() {
                jv.appearance_dialog.eye_color_custom.unselect(),
                    jv.appearance_dialog.update_doll()
            },
            v = g.eye_color_custom = make_color_picker(),
            v.top(248),
            v.left(110),
            v.low = 120,
            v.on_change = function() {
                jv.appearance_dialog.eye_color.unselect_all(),
                    jv.appearance_dialog.update_doll()
            },
            v = make_label("Name Color"),
            v.top(224),
            v.left(151),
            v = g.special_color_custom = make_color_picker(),
            v.top(248),
            v.left(174),
            v.low = 100,
            v = g.apply = make_button("Apply"),
            v.bottom(12),
            v.right(12),
            v.on_click = function() {
                var e, t = jv.appearance_dialog;
                e = t.hair_color.get_selected() ? t.hair_color.get_selected().block_color : t.hair_color_custom.block_color || 16711680;
                var i;
                i = t.clothes_color.get_selected() ? t.clothes_color.get_selected().block_color : t.clothes_color_custom.block_color || 16711680;
                var o;
                o = t.eye_color.get_selected() ? t.eye_color.get_selected().block_color : t.eye_color_custom.block_color || 255,
                    send({
                        type: "c",
                        r: "ap",
                        c: t.clothes.value,
                        b: t.body.value,
                        h: t.hair.value,
                        cc: i,
                        hc: e,
                        ec: o,
                        nc: t.special_color_custom.block_color || 16777215
                    }),
                    t.hide()
            },
            v = jv.costume_button = make_button("Costume Shop"),
            v.bottom(-36),
            v.center(),
            v.on_click = function() {
                send({
                    type: "c",
                    r: "cs"
                })
            },
            v.visible = !1, (jv.premium || myself && myself.level >= 15) && (v.visible = !0);
        var v, g = jv.ui_options_dialog = make_dialog(300, 300, "Interface Options");
        v = g.inv_buttons = make_button("Toggle Inventory Buttons", {
            width: 132
        }),
            v.top(40),
            v.left(16),
            v.on_click = function() {
                jv.inv_icons ? (jv.inv_icons = 0,
                    jv.inv_button.visible = 0,
                    ui_container.build.visible = 0,
                    Cookies.set("ml_inventory_buttons", !1)) : (jv.inv_icons = 1,
                    jv.inv_button.visible = 1,
                jv.inv_button.expanded || (ui_container.build.visible = 1),
                    Cookies.set("ml_inventory_buttons", !0))
            },
            v = g.lock_chat = make_button("Toggle Chat Window", {
                width: 132
            }),
            v.top(70),
            v.left(16),
            v.on_click = function() {
                jv.chat_toggle ? (jv.chat_toggle = 0,
                    jv.chat_fade.visible = !0,
                    jv.chat_box.visible = !1,
                    jv.chat_box.interactive = !1,
                    Cookies.set("ml_chat_window", !1)) : (jv.chat_toggle = 1,
                    jv.chat_fade.visible = !1,
                    jv.chat_box.visible = !0,
                    jv.chat_box.gfx.alpha = jv.chat_box.gfx.max_alpha,
                    jv.chat_box.interactive = !0,
                    Cookies.set("ml_chat_window", !0))
            },
            v = g.lock_chat = make_button("Toggle D-Pad", {
                width: 132
            }),
            v.top(100),
            v.left(16),
            v.on_click = function() {
                compass2.visible ? (compass.visible = 0,
                    compass2.visible = 0,
                    ph_dpad.visible = 0,
                    jv.chat_box.h = 377,
                    jv.chat_box.gfx.height = 379,
                    jv.chat_box.m.height = 377,
                    jv.chat_box.mask.height = 377,
                    jv.chat_box.resume.y = jv.chat_box.h - 35,
                    Cookies.set("ml_dpad", !1)) : (compass.visible = 1,
                    compass2.visible = 1,
                    ph_dpad.visible = 1,
                    jv.chat_box.h = 210,
                    jv.chat_box.gfx.height = 212,
                    jv.chat_box.m.height = 210,
                    jv.chat_box.mask.height = 210,
                    jv.chat_box.resume.y = jv.chat_box.h - 35,
                    Cookies.set("ml_dpad", !0))
            },
            v = g.lock_chat = make_button("Toggle Quick Buttons", {
                width: 132
            }),
            v.top(40),
            v.left(152),
            v.on_click = function() {
                jv.quick_toggle ? (jv.hot_scene.visible = 0,
                    jv.quick_toggle = 0,
                    Cookies.set("ml_quick_buttons", !1)) : (jv.inv_button.expanded || (jv.hot_scene.visible = 1),
                    jv.quick_toggle = 1,
                    Cookies.set("ml_quick_buttons", !0))
            },
            v = g.lock_chat = make_button("Toggle Action Button", {
                width: 132
            }),
            v.top(70),
            v.left(152),
            v.on_click = function() {
                ph_action.visible ? (jv.action_button.visible = 0,
                    ph_action.visible = 0,
                    info_pane.x = 580,
                    info_pane.y = 284,
                    Cookies.set("ml_action_button", !1)) : (jv.action_button.visible = 1,
                    ph_action.visible = 1,
                    info_pane.x = 480,
                    info_pane.y = 34,
                    Cookies.set("ml_action_button", !0))
            },
            v = g.chat_opacity_label = make_label("Chat Opacity"),
            v.top(130),
            v.center(),
            v = g.chat_opacity = make_slider({
                width: 120
            }),
            v.top(150),
            v.center(),
            v.set_percent(Cookies.get("ml_chat_opacity") || 50),
            v.onChange = function() {
                jv.chat_box.gfx.max_alpha = this.percent / 100,
                jv.chat_box.visible && (jv.chat_box.gfx.alpha = jv.chat_box.gfx.max_alpha),
                    Cookies.set("ml_chat_opacity", this.percent)
            },
            v = g.chat_width_label = make_label("Chat Width"),
            v.top(180),
            v.center(),
            v = g.chat_width = make_slider({
                width: 120
            }),
            v.top(200),
            v.center(),
            v.set_percent(Cookies.get("ml_chat_width") || 50),
            v.onChange = function() {
                var e = .7 * this.percent + 30;
                if (!isNaN(e)) {
                    e > 100 ? e = 100 : e < 30 && (e = 30);
                    var t = Math.floor(346 * e / 100);
                    jv.chat_box.w = t,
                        jv.chat_box.gfx.width = t,
                        jv.chat_box.m.width = t,
                        jv.chat_box.resume.x = jv.chat_box.w / 2 - 35,
                        jv.chat_box.text_style.wordWrapWidth = jv.chat_box.w - 2 * jv.chat_box.padding,
                        jv.chat_fade.w = t,
                        jv.chat_fade.gfx.width = t,
                        jv.chat_fade.m.width = t,
                        jv.chat_fade.resume.x = jv.chat_fade.w / 2 - 35,
                        jv.chat_fade.text_style.wordWrapWidth = jv.chat_fade.w - 2 * jv.chat_fade.padding,
                        Cookies.set("ml_chat_width", this.percent)
                }
            },
            v = g.font_size_label = make_label("Font Size"),
            v.top(230),
            v.center(),
            v = g.font_size = make_slider({
                width: 120
            }),
            v.top(250),
            v.center(),
            v.set_percent(Cookies.get("ml_font_size") || 50),
            v.onChange = function() {
                var e = .07 * this.percent + 9;
                isNaN(e) || (e > 16 ? e = 16 : e < 9 && (e = 9),
                    jv.chat_box.text_style.font = e + "px Verdana",
                    jv.chat_fade.text_style.font = e + "px Verdana",
                    Cookies.set("ml_font_size", this.percent))
            },
        phone && (jv.app_exit = jv.Button.create(splash.width - 74, splash.height - 60, 40, "Exit", splash),
                jv.app_exit.alpha = .6,
                jv.app_exit.on_click = function() {
                    navigator.app.exitApp()
                }
        )
    };
var heading_style = {
        font: "12px Verdana",
        fill: 15658734,
        lineJoin: "round",
        stroke: 4473924,
        strokeThickness: 4,
        align: "left"
    },
    label_style = {
        font: "11px Verdana",
        fill: 14540253,
        lineJoin: "round",
        stroke: 3355443,
        strokeThickness: 3,
        align: "left"
    },
    plain_style = {
        font: "10px Verdana",
        fill: 16777215,
        lineJoin: "round",
        stroke: 4473924,
        strokeThickness: 1,
        align: "left"
    },
    make_dialog = function(e, t, i, o) {
        o || (o = {}),
        o.parent || (o.parent = ui_container);
        var a = jv.Dialog.create(e, t, o.parent);
        return i && (a.heading = jv.text(i, heading_style),
            a.add(a.heading),
            a.heading.center(),
            a.heading.top(8)),
        o.modal && (a.modal = 1),
        o.no_close || (a.close = jv.Button.create(30, 32, 24, "X", a),
                a.add(a.close),
                a.close.right(8),
                a.close.top(8),
                a.close.on_click = function() {
                    a.visible = !1
                }
        ),
            a
    },
    make_button = function(e, t) {
        t || (t = {}),
        t.parent || (t.parent = jv.dialog_construction || ui_container);
        var i = jv.Button.create(0, 0, t.width || Math.max(24, 7 * e.length + 14), e, t.parent);
        return t.parent.add(i),
            i.center(),
            i.middle(),
            i
    },
    make_slider = function(e) {
        e || (e = {}),
        e.parent || (e.parent = jv.dialog_construction || ui_container);
        var t = jv.Slider.create(e.width || 64, e.parent);
        return e.parent.add(t),
            t.center(),
            t.middle(),
            t
    },
    make_option = function(e, t, i) {
        i || (i = {}),
        i.parent || (i.parent = jv.dialog_construction || ui_container);
        var o = jv.OptionButton.create(0, 0, i.width || Math.max(24, 7 * (e.length || 0) + 7), e, t, i.parent);
        return i.parent.add(o),
            o.center(),
            o.middle(),
        i.selected && o.select(),
            o
    },
    make_color_picker = function(e) {
        e || (e = {}),
        e.parent || (e.parent = jv.dialog_construction || ui_container);
        var t = jv.ColorPicker.create(0, 0, e.parent);
        return e.parent.add(t),
            t.center(),
            t.middle(),
            t
    },
    make_label = function(e, t) {
        t || (t = {}),
        t.parent || (t.parent = jv.dialog_construction || ui_container);
        var i = jv.text(e || "Label", t.style || label_style);
        return t.parent.add(i),
            i.center(),
            i.middle(),
            i
    },
    make_text_field = function(e) {
        e || (e = {}),
        e.parent || (e.parent = jv.dialog_construction || ui_container);
        var t = jv.TextInput.create(0, 0, 120, 24, e.parent);
        return e.placeholder && (t.email.placeholder.text = e.placeholder),
            e.parent.add(t),
            t.center(),
            t.middle(),
            t.on_submit = function(e) {
                t.onSubmit(e)
            },
            t
    },
    make_sprite = function(e, t) {
        t || (t = {}),
        t.parent || (t.parent = jv.dialog_construction || ui_container);
        var i = jv.sprite(e);
        return t.parent.add(i),
            i.center(),
            i.middle(),
            i
    },
    make_range = function(e, t) {
        t || (t = {}),
        t.parent || (t.parent = jv.dialog_construction || ui_container);
        var i = new PIXI.Container;
        i.add = function(e) {
            this.addChild(e),
                e.w = e.w || e.width,
                e.h = e.h || e.height;
            var t = function() {};
            e.center = t,
                e.middle = t,
                e.left = t,
                e.right = t,
                e.top = t,
                e.bottom = t
        },
            i.list = e,
            i.index = 0,
            i.label = make_label(e[0], {
                style: plain_style,
                parent: i
            }),
            i.label.x = 32,
            i.label.y = 8,
            i.less = make_button("<", {
                parent: i
            }),
            i.less.on_click = function() {
                this.parent.index > 0 ? this.parent.index-- : this.parent.index = this.parent.list.length - 1,
                    this.parent.label.text = this.parent.list[this.parent.index],
                    this.parent.value = isNaN(Number(this.parent.label.text)) ? this.parent.label.text : Number(this.parent.label.text),
                this.parent.on_change && this.parent.on_change()
            },
            i.more = make_button(">", {
                parent: i
            }),
            i.more.on_click = function() {
                this.parent.index >= this.parent.list.length - 1 ? this.parent.index = 0 : this.parent.index++,
                    this.parent.label.text = this.parent.list[this.parent.index],
                    this.parent.value = isNaN(Number(this.parent.label.text)) ? this.parent.label.text : Number(this.parent.label.text),
                this.parent.on_change && this.parent.on_change()
            },
            i.value = isNaN(Number(i.label.text)) ? i.label.text : Number(i.label.text),
            i.choose = function(e) {
                var t;
                for (t in this.list)
                    if (this.list[t] == String(e))
                        return this.index = t,
                            this.label.text = this.list[this.index],
                            this.value = isNaN(Number(this.label.text)) ? this.label.text : Number(this.label.text),
                            1;
                return 0
            };
        var o, a = 0;
        for (o in e)
            e[o].length > a && (a = e[o].length);
        return i.more.x = 40 + 6 * a,
            t.parent.add(i),
            i.center(),
            i.middle(),
            i
    };
jv.Button = {
    create: function(e, t, i, o, a, n) {
        var r = jv.sprite();
        return a || (a = ui_container),
            r.interactive = !0,
            r.button_alpha = .8,
            r.h = n || 26,
            r.w = i,
            r.hitArea = new PIXI.Rectangle(0, 0, i, r.h),
            r.do_click = function() {
                this.is_enabled && (this.on_up(),
                this.silent || playSound("click"),
                this.on_click && this.on_click())
            },
            r.on_up = function() {
                this.is_enabled && (this.is_pressed = 0,
                this.graphic && (r.graphic.y = r.graphic.oy),
                    this.clear_item(),
                    this.draw_item())
            },
            r.on_down = function() {
                this.is_enabled && (this.clear_item(),
                    this.draw_item(1),
                    this.is_pressed = 1,
                this.graphic && (r.graphic.y = r.graphic.oy + 1),
                this.on_press && this.on_press())
            },
            r.buttonMode = !0,
            r.on("mouseup", r.do_click),
            r.on("mouseupoutside", r.on_up),
            r.on("touchend", r.do_click),
            r.on("touchendoutside", r.on_up),
            r.on("mousedown", r.on_down),
            r.on("touchstart", r.on_down),
            r.down = 0,
            r.is_pressed = 0,
            r.is_enabled = 1,
            r.x = e,
            r.y = t,
            r.z = -10,
        "string" != typeof o && (r.graphic = jv.sprite(o),
            r.graphic.x = r.w / 2 - r.graphic.width / 2,
            r.graphic.y = r.h / 2 - r.graphic.height / 2,
            r.graphic.oy = r.graphic.y,
            o = ""),
            r.title = jv.text(o, {
                font: "9px Verdana",
                fill: [13421772, 16777215, 11184810],
                lineJoin: "round",
                dropShadow: !0,
                dropShadowColor: jv.color_base,
                dropShadowDistance: 2,
                dropShadowAngle: 1
            }),
            r.title.x = i / 2 - r.title.width / 2 + 1,
            r.title.y = r.h / 2 - r.title.height / 2 + 1,
            r.title.oy = r.title.y,
            r.set_text = function(e) {
                this.title.text = e,
                    this.title.x = this.w / 2 - this.title.width / 2 + 1,
                    this.title.y = this.h / 2 - this.title.height / 2 + 1,
                    this.title.oy = this.title.y
            },
            r.gfx = new PIXI.Graphics,
            r.enable = function(e) {
                this.is_enabled = e,
                    this.buttonMode = e,
                    this.clear_item(),
                    e ? (this.title.style = {
                        font: "9px Verdana",
                        fill: [13421772, 16777215, 11184810],
                        lineJoin: "round",
                        dropShadow: !0,
                        dropShadowColor: jv.color_base,
                        dropShadowDistance: 2,
                        dropShadowAngle: 1
                    },
                        this.draw_item()) : (this.title.style = {
                        font: "9px Verdana",
                        fill: jv.color_dark,
                        lineJoin: "round",
                        dropShadow: !1
                    },
                        this.draw_item(1))
            },
            r.clear_item = function() {
                this.gfx.clear()
            },
            r.draw_item = function(e) {
                this.gfx.cacheAsBitmap = !1,
                    this.down = e || 0,
                this !== ph_action && (this.gfx.beginFill(jv.color_dark),
                    this.gfx.drawRect(0, 0, i, 2),
                    this.gfx.drawRect(0, 0, 2, this.h),
                    this.gfx.drawRect(0, this.h - 2, i, 2),
                    this.gfx.drawRect(i - 2, 0, 2, this.h),
                    this.gfx.beginFill(this.main_color || jv.color_light, this.button_alpha),
                    e ? (this.gfx.drawRect(2, 2, i - 4, this.h - 4),
                    this.is_enabled && (this.gfx.beginFill(jv.color_dark, .6),
                        this.gfx.drawRect(2, 2, i - 4, 2),
                        this.gfx.drawRect(i - 4, 2, 2, this.h - 6),
                        this.gfx.beginFill(16777215, .2),
                        this.gfx.drawRect(2, this.h - 4, i - 4, 2),
                        this.gfx.drawRect(2, 4, 2, this.h - 6),
                        this.gfx.endFill(),
                        this.title.y = this.title.oy + 1)) : (this.gfx.drawRect(2, 2, i - 4, this.h - 4),
                        this.gfx.beginFill(16777215, .2),
                        this.gfx.drawRect(2, 2, i - 4, 2),
                        this.gfx.drawRect(i - 4, 2, 2, this.h - 6),
                        this.gfx.beginFill(jv.color_dark, .6),
                        this.gfx.drawRect(2, this.h - 4, i - 4, 2),
                        this.gfx.drawRect(2, 4, 2, this.h - 6),
                        this.gfx.endFill(),
                        this.title.y = this.title.oy),
                    this.gfx.cacheAsBitmap = !0)
            },
            r.draw_item(),
            r.addChild(r.gfx),
        r.graphic && r.addChild(r.graphic),
            r.addChild(r.title),
            a.addChild(r),
            r
    }
},
    jv.OptionButton = {
        create: function(e, t, i, o, a, n, r) {
            var s = jv.sprite();
            return n || (n = ui_container),
                s.interactive = !0,
                s.h = r || 24,
                s.w = i,
                s.selected = 0,
                s.series = a,
            jv.option_container || (jv.option_container = []),
            jv.option_container[a] || (jv.option_container[a] = []),
                jv.option_container[a].push(s),
                s.hitArea = new PIXI.Rectangle(0, 0, i, s.h),
                s.do_click = function() {
                    if (this.is_enabled) {
                        this.on_up(),
                        this.silent || playSound("click"),
                        this.on_click && this.on_click();
                        var e, t;
                        for (e in jv.option_container[this.series])
                            jv.option_container[this.series][e].selected = 0,
                                jv.option_container[this.series][e].draw_item(), !t && jv.option_container[this.series][e].on_change && (t = jv.option_container[this.series][e].on_change);
                        this.selected = 1,
                            this.draw_item(),
                        t && t()
                    }
                },
                s.get_selected = function() {
                    var e;
                    for (e in jv.option_container[this.series])
                        if (jv.option_container[this.series][e].selected)
                            return jv.option_container[this.series][e]
                },
                s.unselect_all = function() {
                    var e;
                    for (e in jv.option_container[this.series])
                        jv.option_container[this.series][e].selected = 0,
                            jv.option_container[this.series][e].draw_item()
                },
                s.choose = function(e) {
                    var t;
                    for (t in jv.option_container[this.series])
                        if (jv.option_container[this.series][t].block_color == e || jv.option_container[this.series][t].label && jv.option_container[this.series][t].label.text == String(e))
                            return jv.option_container[this.series][t].select(),
                                1;
                    return 0
                },
                s.select = function(e) {
                    this.unselect_all(),
                        this.selected = 1,
                        this.draw_item()
                },
                s.on_up = function() {
                    this.is_enabled && (this.is_pressed = 0,
                        this.clear_item(),
                        this.draw_item())
                },
                s.on_down = function() {
                    this.is_enabled && (this.clear_item(),
                        this.draw_item(1),
                        this.is_pressed = 1,
                    this.on_press && this.on_press())
                },
                s.buttonMode = !0,
                s.on("mouseup", s.do_click),
                s.on("mouseupoutside", s.on_up),
                s.on("touchend", s.do_click),
                s.on("touchendoutside", s.on_up),
                s.on("mousedown", s.on_down),
                s.on("touchstart", s.on_down),
                s.down = 0,
                s.is_pressed = 0,
                s.is_enabled = 1,
                s.x = e,
                s.y = t,
                s.z = -10,
                "number" == typeof o ? s.block_color = o : (s.label = jv.text(o, {
                        font: "9px Verdana",
                        fill: 16777215,
                        lineJoin: "round",
                        dropShadow: !0,
                        dropShadowColor: jv.color_base,
                        dropShadowDistance: 2,
                        dropShadowAngle: 1
                    }),
                        s.label.x = i / 2 - s.label.width / 2 + 1,
                        s.label.y = s.h / 2 - s.label.height / 2 + 1,
                        s.label.oy = s.label.y,
                        s.set_text = function(e) {
                            this.label.text = e,
                                this.label.x = this.w / 2 - this.label.width / 2 + 1,
                                this.label.y = this.h / 2 - this.label.height / 2 + 1,
                                this.label.oy = this.label.y
                        }
                ),
                s.gfx = new PIXI.Graphics,
                s.enable = function(e) {
                    this.is_enabled = e,
                        this.buttonMode = e,
                        this.clear_item(),
                        e ? (this.label.style = {
                            font: "9px Verdana",
                            fill: 16777215,
                            lineJoin: "round",
                            dropShadow: !0,
                            dropShadowColor: jv.color_base,
                            dropShadowDistance: 2,
                            dropShadowAngle: 1
                        },
                            this.draw_item()) : (this.label.style = {
                            font: "9px Verdana",
                            fill: jv.color_base,
                            lineJoin: "round",
                            dropShadow: !1
                        },
                            this.draw_item(1))
                },
                s.clear_item = function() {
                    this.gfx.clear()
                },
                s.draw_item = function(e) {
                    this.clear_item(),
                        this.down = e || 0,
                        this.selected ? (this.gfx.lineStyle(2, 2236962),
                            this.gfx.drawRect(3, 3, this.w - 6, this.h - 6)) : (this.gfx.lineStyle(2, 5592405, .3),
                            this.gfx.drawRect(3, 3, this.w - 6, this.h - 6)),
                    this.block_color && (this.gfx.lineStyle(0, 0),
                        this.gfx.beginFill(this.block_color, 1),
                        this.gfx.drawRect(4, 4, this.w - 8, this.h - 8),
                        this.gfx.endFill())
                },
                s.draw_item(),
                s.addChild(s.gfx),
            s.label && s.addChild(s.label),
                n.addChild(s),
                s
        }
    },
    jv.ColorPicker = {
        create: function(e, t, i) {
            var o = jv.sprite();
            if (i || (i = ui_container),
                o.interactive = !0,
                o.h = 24,
                o.w = 24,
                o.hitArea = new PIXI.Rectangle(0, 0, o.w, o.h),
                o.do_click = function(e) {
                    this.silent || playSound("click"),
                    this.is_enabled && !this.locked && (this.on_up(),
                    this.on_click && this.on_click(),
                        this.active ? (touchx = e.data.getLocalPosition(this.picker).x,
                            touchy = e.data.getLocalPosition(this.picker).y,
                        touchx > 490 && (touchx = 490),
                            this.block_color = this.get_color(Math.floor(touchx), Math.floor(touchy)),
                        this.low && (this.block_color = color_limit(this.block_color, this.low)),
                            this.active = 0,
                            this.picker.width = 16,
                            this.picker.height = 5,
                            this.picker.x = 4,
                            this.picker.y = 16,
                            this.selected = 1,
                        this.on_change && this.on_change()) : (this.active = 1,
                            this.picker.width = 128,
                            this.picker.height = 128,
                            this.picker.x = -64,
                            this.picker.y = -64,
                            this.picker.visible = 1,
                            jv.bringToFront(this)),
                        this.draw_item())
                },
                o.set_lock = function(e) {
                    this.locked = e || 0,
                        this.draw_item()
                },
                o.unselect = function() {
                    this.active = 0,
                        this.picker.width = 16,
                        this.picker.height = 16,
                        this.picker.x = 4,
                        this.picker.y = 5,
                        this.selected = 0,
                        delete this.block_color,
                        this.draw_item()
                },
                o.select = function(e, t) {
                    this.block_color = e,
                        this.picker.width = 16,
                        this.picker.height = 5,
                        this.picker.x = 4,
                        this.picker.y = 16,
                        this.active = 0,
                        this.selected = 1,
                    t && this.on_change && this.on_change(),
                        this.draw_item()
                },
                o.on_up = function() {
                    this.is_enabled && (this.is_pressed = 0,
                        this.clear_item(),
                        this.draw_item())
                },
                o.on_down = function() {
                    this.is_enabled && (this.clear_item(),
                        this.draw_item(1),
                        this.is_pressed = 1,
                    this.on_press && this.on_press())
                },
                o.buttonMode = !0,
                o.on("mouseup", o.do_click),
                o.on("mouseupoutside", o.on_up),
                o.on("touchend", o.do_click),
                o.on("touchendoutside", o.on_up),
                o.on("mousedown", o.on_down),
                o.on("touchstart", o.on_down),
                o.down = 0,
                o.is_pressed = 0,
                o.is_enabled = 1,
                o.x = e,
                o.y = t,
                o.z = -10,
                o.lock = jv.sprite(items[9][55]),
                o.lock.visible = 0,
                o.lock.alpha = .8,
                o.lock.scale.x = .5,
                o.lock.scale.y = .5,
                o.lock.x = 4,
                o.lock.y = 4,
                o.picker = jv.sprite(jv.color_picker.texture),
                o.picker.interactive = !0,
                o.picker.buttonMode = !0,
                o.picker.x = 4,
                o.picker.y = 5,
                o.picker.width = 16,
                o.picker.height = 16,
                o.picker.alpha = 1,
                o.active = 0,
                o.gfx = new PIXI.Graphics,
            4 == jv.pixiver) {
                var a = new PIXI.Sprite(jv.color_picker.texture);
                o.pixels = jv.renderer.extract.pixels(a)
            } else {
                var n = new PIXI.RenderTexture(jv.renderer, 128, 128, PIXI.SCALE_MODES.NEAREST, 1),
                    a = new PIXI.Sprite(jv.color_picker.texture),
                    r = new PIXI.Container;
                r.addChild(a),
                    n.render(r),
                    o.pixels = n.getPixels()
            }
            return o.get_color = function(e, t) {
                var i = this.pixels[512 * t + 4 * e + 0],
                    o = this.pixels[512 * t + 4 * e + 1],
                    a = this.pixels[512 * t + 4 * e + 2],
                    n = i;
                return n = (n << 8) + o,
                    n = (n << 8) + a
            },
                o.enable = function(e) {
                    this.is_enabled = e,
                        this.buttonMode = e,
                        this.clear_item(),
                        e ? this.draw_item() : this.draw_item(1)
                },
                o.clear_item = function() {
                    this.gfx.clear()
                },
                o.draw_item = function() {
                    this.clear_item(),
                        this.lock.visible = this.locked,
                        this.selected ? this.gfx.lineStyle(2, 2236962) : this.gfx.lineStyle(2, 5592405, .4),
                        this.gfx.drawRect(3, 3, this.w - 6, this.h - 6),
                    this.block_color && (this.gfx.lineStyle(0, 0),
                        this.gfx.beginFill(this.block_color, 1),
                        this.gfx.drawRect(4, 4, this.w - 8, this.h - 8),
                        this.gfx.endFill())
                },
                o.draw_item(),
                o.addChild(o.gfx),
                o.addChild(o.picker),
                o.addChild(o.lock),
                i.addChild(o),
                o
        }
    },
    jv.AbilityButton = {
        create: function(e, t, i, o) {
            var a = jv.sprite();
            return o || (o = ui_container),
                a.interactive = !0,
                a.h = 42,
                a.w = 42,
                a.last_click = 0,
                a.cooldown = 5e3,
                a.spr = i,
                a.ready = 1,
                a.progress = 1,
                a.draw_timer = null,
                a.hitArea = new PIXI.Rectangle(0, 0, a.w, a.h),
                a.do_update = function() {
                    this.progress = (Date.now() - this.last_click) / this.cooldown,
                        this.cdcover.scale.y = Math.max(this.progress, 0),
                        this.cdcover.y = this.h - 2 - this.progress * (this.h - 2),
                    this.progress >= 1 && (clearInterval(this.draw_timer),
                        this.ready = 1,
                        this.icon.tint = 16777215,
                        this.cdcover.visible = 0,
                        this.cdcover.scale.y = .01)
                },
                a.activate = function() {
                    this.clear_item(),
                        this.draw_item(),
                        this.last_click = Date.now(),
                        this.draw_timer = setInterval(this.do_update.bind(this), 100),
                        this.ready = 0,
                        this.cdcover.visible = 1,
                        this.icon.tint = 4473924
                },
                a.do_click = function() {
                    this.is_enabled && this.ready && (this.on_up(),
                    this.silent || playSound("click"),
                    this.on_click && this.on_click(),
                        send({
                            type: "c",
                            r: "ab",
                            a: this.ind
                        }))
                },
                a.on_up = function() {
                    this.is_enabled && this.ready && (this.is_pressed = 0,
                        this.clear_item(),
                        this.draw_item())
                },
                a.on_down = function() {
                    this.is_enabled && this.ready && (this.clear_item(),
                        this.draw_item(1),
                        this.is_pressed = 1,
                    this.on_press && this.on_press())
                },
                a.buttonMode = !0,
                a.on("mouseup", a.do_click),
                a.on("mouseupoutside", a.on_up),
                a.on("touchend", a.do_click),
                a.on("touchendoutside", a.on_up),
                a.on("mousedown", a.on_down),
                a.on("touchstart", a.on_down),
                a.down = 0,
                a.is_pressed = 0,
                a.is_enabled = 1,
                a.x = e,
                a.y = t,
                a.z = -10,
                a.icon = jv.sprite(items[i % 16][Math.floor(i / 16)]),
                a.icon.x = a.w / 2 - a.icon.width / 2 + 0,
                a.icon.y = a.h / 2 - a.icon.height / 2 + 0,
                a.icon.oy = a.icon.y,
                a.set_text = function(e) {},
                a.gfx = new PIXI.Graphics,
                a.cdcover = new PIXI.Graphics,
                a.enable = function(e) {
                    this.is_enabled = e,
                        this.buttonMode = e,
                        this.clear_item(),
                        e ? this.draw_item() : this.draw_item(1)
                },
                a.clear_item = function() {
                    this.gfx.clear()
                },
                a.draw_item = function(e) {
                    this.down = e || 0,
                        this.gfx.beginFill(3355443, 1),
                        this.gfx.drawRect(0, 0, 2, this.h),
                        this.gfx.drawRect(0, 0, this.w, 2),
                        this.gfx.drawRect(0, this.h - 2, this.w, 2),
                        this.gfx.drawRect(this.w - 2, 0, 2, this.h),
                        e ? (this.gfx.beginFill(65535, .6),
                            this.gfx.drawRect(2, 2, this.w - 4, this.h - 4),
                            this.gfx.endFill(),
                            this.icon.y = this.icon.oy) : (this.gfx.beginFill(0, .8),
                            this.gfx.drawRect(2, 2, this.w - 4, this.h - 4),
                            this.gfx.endFill(),
                            this.icon.y = this.icon.oy),
                        this.gfx.alpha = .6
                },
                a.cdcover.beginFill(65535, .6),
                a.cdcover.drawRect(2, 2, a.w - 4, a.h - 4),
                a.cdcover.endFill(),
                a.cdcover.visible = 0,
                a.draw_item(),
                a.addChild(a.gfx),
                a.addChild(a.cdcover),
                a.addChild(a.icon),
                o.addChild(a),
                a
        }
    },
    jv.Slider = {
        create: function(e, t) {
            var i = jv.sprite();
            return t || (t = ui_container),
                i.interactive = !0,
                i.h = 20,
                i.w = e,
                i.x = 0,
                i.y = 0,
                i.buttonMode = !0,
                i.on_move = function(e) {
                    if (this.drag) {
                        var t = e.data.global.x - this.x - this.parent.x - this.knob.w / 2;
                        this.parent.parent && (t -= this.parent.parent.x),
                            t < 0 ? t = 0 : t > this.w - this.knob.w && (t = this.w - this.knob.w),
                            this.knob.x = t,
                            this.percent = Math.round(this.knob.x / (this.w - this.knob.w) * 100),
                        this.onChange && this.onChange()
                    }
                },
                i.on_up = function() {
                    this.drag = 0
                },
                i.on_down = function() {
                    this.drag = 1
                },
                i.on("mouseup", i.on_up),
                i.on("mouseupoutside", i.on_up),
                i.on("touchend", i.on_up),
                i.on("touchendoutside", i.on_up),
                i.on("mousedown", i.on_down),
                i.on("touchstart", i.on_down),
                i.on("mousemove", i.on_move),
                i.on("touchmove", i.on_move),
                i.percent = 50,
                i.gfx = new PIXI.Graphics,
                i.knob = new PIXI.Graphics,
                i.knob.w = 12,
                i.set_percent = function(e) {
                    e < 0 ? e = 0 : e > 100 && (e = 100),
                        this.percent = e,
                        this.knob.x = e / 100 * (this.w - this.knob.w)
                },
                i.set_percent(50),
                i.draw_item = function() {
                    this.gfx.beginFill(jv.color_dark),
                        this.gfx.drawRect(2, this.h / 2, this.w - 4, 3),
                        this.gfx.endFill(),
                        this.knob.beginFill(jv.color_dark, 0),
                        this.knob.drawRect(-8, -8, this.knob.w + 16, this.h + 16),
                        this.knob.endFill(),
                        this.knob.beginFill(jv.color_dark),
                        this.knob.drawRect(0, 0, this.knob.w, this.h),
                        this.knob.beginFill(jv.color_bright),
                        this.knob.drawRect(2, 2, this.knob.w - 4, this.h - 4),
                        this.knob.beginFill(jv.color_medium),
                        this.knob.drawRect(2, 4, this.knob.w - 4, this.h - 6),
                        this.knob.endFill()
                },
                i.draw_item(),
                i.addChild(i.gfx),
                i.addChild(i.knob),
                t.addChild(i),
                i
        }
    },
    jv.Dialog = {
        list: [],
        create: function(e, t, i) {
            var o = jv.sprite();
            return o.w = e,
                o.h = t,
            i || (i = ui_container,
                i.w = jv.game_width),
                jv.theme(o, e, t, .9),
                jv.Dialog.list.push(o),
                jv.dialog_construction = o,
                o.visible = !1,
                o.show = function() {
                    var e;
                    for (e in jv.Dialog.list) {
                        if (jv.Dialog.list[e].visible && jv.Dialog.list[e].modal)
                            return;
                        jv.Dialog.list[e].visible = !1
                    }
                    this.visible = !0,
                    this.on_open && this.on_open()
                },
                o.hide = function() {
                    this.visible = !1
                },
                o.center = function() {
                    jv.center(this)
                },
                o.middle = function() {
                    jv.middle(this)
                },
                o.left = function(e) {
                    jv.left(this, e)
                },
                o.right = function(e) {
                    jv.right(this, e)
                },
                o.top = function(e) {
                    jv.top(this, e)
                },
                o.bottom = function(e) {
                    jv.bottom(this, e)
                },
                o.add = function(e) {
                    e.parent !== this && this.addChild(e),
                        e.w = e.w || e.width,
                        e.h = e.h || e.height,
                        e.center = this.center,
                        e.middle = this.middle,
                        e.left = this.left,
                        e.right = this.right,
                        e.top = this.top,
                        e.bottom = this.bottom
                },
                i.addChild(o),
                o.center(),
                o.middle(),
                o
        }
    },
    jv.center = function(e, t) {
        t || (t = e.parent || ui_container),
            e.x = (t.w || t.width) / 2 - (e.w || e.width) / 2
    },
    jv.middle = function(e, t) {
        t || (t = e.parent || ui_container),
            e.y = (t.h || t.height) / 2 - (e.h || e.height) / 2
    },
    jv.left = function(e, t, i) {
        i || (i = e.parent || ui_container),
            e.x = t
    },
    jv.right = function(e, t, i) {
        i || (i = e.parent || ui_container),
            e.x = (i.w || i.width) - (e.w || e.width) - t
    },
    jv.top = function(e, t, i) {
        i || (i = e.parent || ui_container),
            e.y = t
    },
    jv.bottom = function(e, t, i) {
        i || (i = e.parent || ui_container),
            e.y = (i.h || i.height) - (e.h || e.height) - t
    },
    jv.theme = function(e, t, i, o) {
        e.background = new PIXI.Graphics,
            e.background.beginFill(jv.color_base, o || 1),
            e.background.drawRect(0, 0, t, i);
        var a, n, r, s;
        for (a = 0; a < t; a += 16)
            for (n = 0; n < i; n += 16)
                Math.random() * i <= n && (2 * Math.random() > 1.7 ? e.background.beginFill(jv.color_bright, .12) : e.background.beginFill(jv.color_dark, .4),
                    s = 16,
                    r = 16,
                a + s > t && (s = t - a),
                n + r > i && (r = i - n),
                    e.background.drawRect(a, n, s, r));
        e.frame = new PIXI.Graphics,
            e.frame.beginFill(16777215, .4),
            e.frame.drawRect(0, 0, t - 4, 4),
            e.frame.beginFill(jv.color_dark, .5),
            e.frame.drawRect(0, 0, 4, i - 4),
            e.frame.beginFill(16777215, .2),
            e.frame.drawRect(t - 4, 0, 4, i),
            e.frame.beginFill(jv.color_dark, .6),
            e.frame.drawRect(0, i - 4, t, 4),
            e.frame.lineStyle(2, jv.color_dark),
            e.frame.drawRect(1, 1, t - 2, i - 2),
            e.background.cacheAsBitmap = !0,
            e.frame.cacheAsBitmap = !0,
            e.addChild(e.background),
            e.addChild(e.frame)
    };
var init_ui = function() {
    jv.upgrade_sprite = jv.sprite(items[13][Math.floor(237 / 16)]),
        jv.upgrade_sprite.x = 548,
        jv.upgrade_sprite.y = -5,
        jv.upgrade_sprite.alpha = .4,
        ui_container.addChild(jv.upgrade_sprite),
        jv.upgrade_number = 0,
        jv.upgrade_current = 0,
        jv.upgrade_timer = 0,
        jv.upgrade_counter = new PIXI.extras.BitmapText("", {
            font: "20px mapfont",
            align: "center"
        }),
        jv.upgrade_counter.interactive = !0,
        jv.upgrade_counter.buttonMode = !0,
        jv.upgrade_counter.on("mouseup", function() {
            send({
                type: "c",
                r: "up"
            }),
                jv.upgrade_dialog.show()
        }),
        jv.upgrade_counter.on("touchend", function() {
            send({
                type: "c",
                r: "up"
            }),
                jv.upgrade_dialog.show()
        }),
        jv.upgrade_counter.alpha = .7,
        jv.upgrade_counter.x = 502,
        jv.upgrade_counter.y = 3,
        ui_container.addChild(jv.upgrade_counter),
        jv.upgrade_add = new PIXI.extras.BitmapText("", {
            font: "20px mapfont",
            align: "right"
        }),
        jv.upgrade_add.x = 518,
        jv.upgrade_add.y = 24,
        jv.upgrade_add.alpha = 0,
        jv.add_number = 0,
        ui_container.addChild(jv.upgrade_add),
        jv.ver_text = jv.text("Ver. " + version, {
            font: "10px Verdana",
            fill: 12311995,
            lineJoin: "round",
            stroke: jv.color_dark,
            strokeThickness: 2,
            align: "right"
        }),
        jv.ver_text.x = 665,
        jv.ver_text.y = 390,
        splash.addChild(jv.ver_text),
        jv.map_title = new PIXI.extras.BitmapText("", {
            font: "24px mapfont",
            align: "center"
        }),
        jv.map_title.x = 170,
        jv.map_title.y = 318,
        jv.map_title.alpha = 0,
        ui_container.addChild(jv.map_title),
        jv.choose_name = jv.Button.create(480, 270, 90, "Choose Name", ui_container, 36),
        jv.choose_name.on_click = function() {
            return jv.create_dialog.visible ? void jv.create_dialog.hide() : (jv.create_dialog.show(),
                jv.create_dialog.modal = 0,
                jv.create_dialog.login.visible = 0,
                jv.create_dialog.y = 12,
                jv.create_dialog.heading.text = "Choose Name",
                jv.create_dialog.heading.x = jv.create_dialog.w / 2 - jv.create_dialog.heading.width / 2,
                void(jv.create_dialog.close.visible = 1))
        },
        jv.choose_name.visible = 0,
        ph_dpad = jv.sprite(),
        ph_dpad.choose_dir = function(e) {
            if (!jv.chat_box.drag && (e || jv.mouseDown)) {
                var t = jv.mouse.x,
                    i = jv.mouse.y;
                e && (t = touchx,
                    i = touchy),
                t < this.x || t > this.x + this.width || i < this.y || i > this.y + this.height || (jv.glow.x = t,
                    jv.glow.y = i,
                    this.stop_move(),
                    jv.glow.visible = 1,
                    compass2.alpha = .85,
                    Math.abs(t - this.cx) > Math.abs(i - this.cy) ? t < this.cx ? keyLeft.isDown = 1 : keyRight.isDown = 1 : i < this.cy ? keyUp.isDown = 1 : keyDown.isDown = 1)
            }
        },
        ph_dpad.stop_move = function() {
            keyDown.isDown = 0,
                keyUp.isDown = 0,
                keyLeft.isDown = 0,
                keyRight.isDown = 0,
                jv.glow.visible = 0,
                compass2.alpha = .55
        },
        ph_dpad.do_touch_move = function(e) {
            touchx = e.data.getLocalPosition(this.parent).x,
                touchy = e.data.getLocalPosition(this.parent).y,
                this.choose_dir(1)
        },
        ph_dpad.do_mouse_move = function(e) {
            this.choose_dir(0)
        },
        ph_dpad.interactive = !0,
        inventory.alpha = .5,
        compass.x = 34,
        compass.y = 237,
        ph_dpad.x = 34,
        ph_dpad.y = 259,
        ph_dpad.width = 136,
        ph_dpad.height = 140,
        ph_dpad.cx = -1 + ph_dpad.x + ph_dpad.width / 2,
        ph_dpad.cy = -5 + ph_dpad.y + ph_dpad.height / 2,
        ph_dpad.alpha = 0,
        ph_dpad.on("mousedown", function() {
            jv.mouseDown = 1,
                ph_dpad.choose_dir()
        }),
        ph_dpad.on("touchstart", ph_dpad.do_touch_move),
        ph_dpad.on("mouseup", function() {
            jv.mouseDown = 0,
                this.stop_move()
        }),
        ph_dpad.on("mouseupoutside", function() {
            jv.mouseDown = 0,
                this.stop_move()
        }),
        ph_dpad.on("touchend", function() {
            this.stop_move()
        }),
        ph_dpad.on("touchendoutside", function() {
            this.stop_move()
        }),
        ph_dpad.on("touchmove", ph_dpad.do_touch_move),
        ph_dpad.on("mousemove", ph_dpad.do_mouse_move),
        compass2 = new PIXI.Sprite(compass.texture),
        compass2.x = 34,
        compass2.y = 236,
        compass2.alpha = .55,
        compass2.tint = jv.color_base,
        compass.hitArea = compass2.hitArea = new PIXI.Rectangle(0, 0, 136, 140),
        jv.glow = new PIXI.Graphics,
        jv.glow.beginFill(21845, .3),
        jv.glow.drawCircle(0, 0, 28),
        jv.glow.beginFill(26214, .6),
        jv.glow.drawCircle(0, 0, 20),
        jv.glow.beginFill(30583, .8),
        jv.glow.drawCircle(0, 0, 16),
        jv.glow.beginFill(34952, 1),
        jv.glow.drawCircle(0, 0, 12),
        jv.glow.beginFill(39321),
        jv.glow.drawCircle(0, 0, 10),
        jv.glow.beginFill(48059),
        jv.glow.drawCircle(0, 0, 8),
        jv.glow.beginFill(56797),
        jv.glow.drawCircle(0, 0, 6),
        jv.glow.beginFill(65535),
        jv.glow.drawCircle(0, 0, 4),
        jv.glow.endFill(),
        jv.glow.x = 37,
        jv.glow.y = 318,
        jv.glow.mask = compass,
        jv.glow.visible = 0,
        target_container = jv.scene(),
        master_container.addChild(target_container),
        player_container.x = 0,
        player_container.y = 0,
        master_container.addChild(player_container),
        target_container.addChildAt(target, 0),
        effect_container = jv.scene(),
        effect_container.x = 0,
        effect_container.y = 0,
        jv.add(master_container),
        hover_container = jv.scene(),
        skill_status = jv.StatusBar.create("Exploration", 3381759),
        skill_status.set(0),
        skill_status.alpha = 0,
    skill_status.x = 334,
    skill_status.y = 30,
    hp_status = jv.StatusBar.create("Health", 2271778),
    hp_status.x = 224,
    hp_status.y = 12,
    hp_status.alpha = .8,
    hp_status.set(100),
    hunger_status = jv.StatusBar.create("Hunger", 11149858),
    hunger_status.x = 224,
    hunger_status.y = 30,
    hunger_status.alpha = .8,
    hunger_status.set(50),
    exp_status = jv.StatusBar.create("Experience", 2237098),
    exp_status.x = 334,
    exp_status.y = 12,
    exp_status.alpha = .8,
    exp_status.set(0),
    inventory.x = jv.game_width - 160,
    inventory.y = 34,
    ui_container.addChild(inventory),
    jv.inv_button = jv.Button.create(680, 220, 60, items[15][Math.floor(191 / 16)], ui_container, 42),
    jv.inv_button.button_alpha = .2,
    jv.inv_button.arrow = new PIXI.Graphics;
    var e = [0, 8, 10, 0, 10, 16, 0, 8];
    jv.inv_button.arrow.beginFill(jv.color_dark, .3),
        jv.inv_button.arrow.lineStyle(3, 3355443, .3),
        jv.inv_button.arrow.drawPolygon(e),
        jv.inv_button.arrow.lineStyle(2, 4473924, .3),
        jv.inv_button.arrow.drawPolygon(e),
        jv.inv_button.arrow.lineStyle(1, 2236962, .3),
        jv.inv_button.arrow.drawPolygon(e),
        jv.inv_button.arrow.endFill(),
        jv.inv_button.arrow.x = 45,
        jv.inv_button.arrow.y = 14,
        jv.inv_button.addChildAt(jv.inv_button.arrow, jv.inv_button.children.length - 2),
        jv.inv_button.clear_item(),
        jv.inv_button.draw_item(),
        jv.inv_button.arrow.cacheAsBitmap = !0,
        jv.inv_button.on_click = function() {
            this.expanded ? (this.expanded = 0,
                inv_pane.visible = 0,
                inventory.visible = 0,
                ui_container.cur_page.visible = 0,
                ui_container.inv_prev.visible = 0,
                ui_container.inv_next.visible = 0,
            jv.inv_icons && (ui_container.build.visible = 1),
            jv.quick_toggle && (jv.hot_scene.visible = 1),
                info_pane.visible = !1,
                info_pane.slot = void 0,
                this.arrow.rotation = 0,
                this.arrow.x = 45,
                this.arrow.y = 14,
                this.x = 680) : (this.expanded = 1,
                inv_pane.visible = 1,
                inventory.visible = 1,
                ui_container.cur_page.visible = 1,
                ui_container.inv_prev.visible = 1,
                ui_container.inv_next.visible = 1,
                ui_container.build.visible = 0,
                jv.hot_scene.visible = 0,
                this.arrow.rotation = 3.1456,
                this.arrow.x = 59,
                this.arrow.y = 28,
                this.x = 520)
        },
        jv.hot_scene = jv.scene(),
        jv.hot_scene.x = 596,
        jv.hot_scene.y = 50,
        jv.hot_button = [];
    var t;
    for (t = 0; t < 6; t++)
        jv.hot_button[t] = jv.Button.create(t < 3 ? 0 : 66, 55 * t - (t < 3 ? 0 : 165), 60, items[0][Math.floor(0)], jv.hot_scene, 42),
            jv.hot_button[t].button_alpha = .5,
            jv.hot_button[t].main_color = jv.color_dark,
            jv.hot_button[t].slot = jv.hot_slot[t],
            jv.hot_button[t].qty_text = jv.text("", {
                font: "12px Verdana",
                fill: 15658734,
                lineJoin: "round",
                stroke: jv.color_medium,
                strokeThickness: 4
            }),
            jv.hot_button[t].qty_text.x = 0,
            jv.hot_button[t].qty_text.y = 28,
            jv.hot_button[t].addChild(jv.hot_button[t].qty_text),
            jv.hot_button[t].clear_item(),
            jv.hot_button[t].draw_item(),
            jv.hot_button[t].on_click = function() {
                send({
                    type: "u",
                    slot: this.slot
                })
            };
    ui_container.addChild(jv.hot_scene),
        ph_pickup = jv.Button.create(678, 284, 62, items[0][Math.floor(0)], ui_container, 44),
        ph_pickup.button_alpha = .6,
        ph_pickup.title.style = {
            font: "12px Verdana",
            fill: 16777215,
            lineJoin: "round",
            dropShadow: !0,
            dropShadowColor: jv.color_base,
            dropShadowDistance: 2,
            dropShadowAngle: 1
        },
        ph_pickup.on_press = function() {
            keyShift.press()
        },
        ph_pickup.uparrow = new PIXI.Graphics;
    var e = [0, 20, 16, 20, 16, 30, 32, 30, 32, 20, 48, 20, 24, 0, 0, 20];
    ph_pickup.uparrow.beginFill(2236996, .3),
        ph_pickup.uparrow.lineStyle(5, 3355443, .2),
        ph_pickup.uparrow.drawPolygon(e),
        ph_pickup.uparrow.lineStyle(3, 4473924, .2),
        ph_pickup.uparrow.drawPolygon(e),
        ph_pickup.uparrow.lineStyle(1, jv.color_dark, .3),
        ph_pickup.uparrow.drawPolygon(e),
        ph_pickup.uparrow.endFill(),
        ph_pickup.uparrow.x = 6,
        ph_pickup.uparrow.y = 6,
        ph_pickup.addChildAt(ph_pickup.uparrow, ph_pickup.children.length - 2),
        ph_pickup.uparrow.alpha = .5,
        ph_pickup.visible = 1,
        ph_pickup.gfx.alpha = 0,
        jv.pickup_button.tint = jv.color_base,
        jv.pickup_button.alpha = .55,
        jv.pickup_button.x = -20,
        jv.pickup_button.y = -26,
        jv.pickup_button.scale.x = .5,
        jv.pickup_button.scale.y = .5,
        ph_pickup.addChild(jv.pickup_button),
        ph_pickup.swapChildren(jv.pickup_button, ph_pickup.gfx),
        ph_pickup.clear_item(),
        ph_pickup.draw_item(),
        ph_action = jv.Button.create(574, 296, 100, items[7][Math.floor(791 / 16)], ui_container, 100),
        jv.action_button.tint = jv.color_base,
        jv.action_button.alpha = .55,
        jv.action_button.x = -40,
        jv.action_button.y = -38,
        jv.action_button.scale.x = .9,
        jv.action_button.scale.y = .9,
        ph_action.addChild(jv.action_button),
        ph_action.swapChildren(jv.action_button, ph_action.gfx),
        ph_action.button_alpha = .2,
        ph_action.clear_item(),
        ph_action.draw_item(),
        ph_action.title.style = {
            font: "12px Verdana",
            fill: 16777215,
            lineJoin: "round",
            dropShadow: !0,
            dropShadowColor: jv.color_base,
            dropShadowDistance: 2,
            dropShadowAngle: 1
        },
        ph_action.set_text(" "),
        ph_action.silent = 1,
        ph_action.on_click = function() {
            this.clear_item(),
                this.draw_item(),
                keySpace.isDown = 0,
                jv.action_button.alpha = .55
        },
        ph_action.on_press = function() {
            keySpace.isDown = 1,
                jv.action_button.alpha = .85
        },
        jv.tutorial_window = jv.scene(),
        jv.tutorial_window.x = 185,
        jv.tutorial_window.y = 320,
        jv.tutorial_window.background = new PIXI.Graphics,
        jv.tutorial_window.background.x = 0,
        jv.tutorial_window.background.y = 0,
        jv.tutorial_window.background.beginFill(0, .6),
        jv.tutorial_window.background.drawRoundedRect(0, 0, 325, 80, 4),
        jv.tutorial_window.background.endFill(),
        jv.tutorial_window.background.lineStyle(3, 16777215, .3),
        jv.tutorial_window.background.drawRoundedRect(0, 0, 325, 80, 4),
        jv.tutorial_window.background.cacheAsBitmap = !0,
        jv.tutorial_window.addChild(jv.tutorial_window.background),
        jv.tutorial_window.info = jv.text("", {
            font: "13px Verdana",
            fill: 16771483,
            lineJoin: "round",
            wordWrap: !0,
            wordWrapWidth: 309,
            breakWords: !0,
            stroke: 1118481,
            strokeThickness: 2,
            align: "left"
        }),
        jv.tutorial_window.info.alpha = .9,
        jv.tutorial_window.info.x = 8,
        jv.tutorial_window.info.y = 4,
        jv.tutorial_window.addChild(jv.tutorial_window.info),
        jv.tutorial_window.visible = 0,
        ui_container.addChild(jv.tutorial_window),
        info_pane = jv.scene(),
        info_pane.background = new PIXI.Graphics,
        info_pane.background.x = 0,
        info_pane.background.y = 0,
        info_pane.background.beginFill(jv.color_base, .5),
        info_pane.background.drawRect(0, 0, 100, 122),
        info_pane.background.cacheAsBitmap = !0,
        info_pane.addChild(info_pane.background),
        info_pane.x = 480,
        info_pane.y = 34,
        info_pane.visible = !1,
        info_pane.heading = jv.text("", {
            font: "10px Verdana",
            fill: jv.color_bright,
            lineJoin: "round",
            stroke: jv.color_dark,
            strokeThickness: 4,
            align: "left"
        }),
        info_pane.heading.x = 4,
        info_pane.heading.y = 0,
        info_pane.addChild(info_pane.heading),
        info_pane.sprite = jv.sprite(),
        info_pane.sprite.x = 35,
        info_pane.sprite.y = 18,
        info_pane.addChild(info_pane.sprite),
        info_pane.use = jv.Button.create(52, 55, 39, "Use", info_pane, 32),
        info_pane.use.on_click = function() {
            this.parent.obj && send(this.parent.obj.id ? {
                type: "c",
                r: "rp",
                id: this.parent.obj.id
            } : {
                type: "u",
                slot: this.parent.slot
            })
        },
        info_pane.drop = jv.Button.create(10, 55, 39, "Drop", info_pane, 32),
        info_pane.drop.on_click = function() {
            this.parent.obj && send({
                type: "d",
                slot: this.parent.slot,
                amt: drop_amt
            })
        },
        info_pane.drop_amount = jv.Button.create(10, 92, 80, "Drop Amt: all", info_pane),
        info_pane.drop_amount.on_click = function() {
            var e = 0;
            "all" !== drop_amt && "1" !== drop_amt && "10" !== drop_amt && (e = 1),
                drop_amt = "all" == drop_amt ? "1" : "1" == drop_amt ? "10" : "all",
                this.set_text("Drop Amt: " + drop_amt),
            e && append("Drop amount set to " + drop_amt + ".")
        },
        info_pane.drop_amount.visible = !1,
        info_pane.use.visible = !1,
        info_pane.drop.visible = !1,
        info_pane.set_info = function(e) {
            if (me != -1) {
                if (this.obj = e, !e)
                    return this.visible = !1,
                        void(this.slot = void 0);
                this.visible = !0,
                    this.sprite.x = 35,
                    this.sprite.y = 18,
                    "undefined" != typeof e.quantity ? (this.sprite.scale.x = 1,
                        this.sprite.scale.y = 1,
                        this.background.height = 122,
                        this.slot = e.slot + item_page * item_length,
                    void 0 !== e.template && (this.template = e.template),
                        e.quantity > 1 ? this.heading.text = e.title.text + "[" + e.quantity + "]" : this.heading.text = e.title.text,
                        this.heading.x = 50 - this.heading.width / 2,
                        this.sprite.texture = e.texture,
                        this.use.set_text("Use"),
                        this.use.x = 52,
                        this.use.y = 55,
                        this.use.visible = !0,
                        this.drop.visible = !0,
                        this.drop_amount.visible = !0) : (this.background.height = 85,
                        this.use.y = 48,
                        "" != e.tribe ? (this.heading.text = e.name + " (" + e.level + ")\r\n" + e.tribe,
                            this.sprite.y = 30,
                            this.use.y = 64,
                            this.background.height = 100) : "undefined" != typeof e.level ? this.heading.text = e.name + " (" + e.level + ")" : this.heading.text = e.name,
                        e.monster_sprite ? this.sprite.texture = e.monster_sprite.texture : (e.title.visible = !1,
                            this.sprite.texture = e.spr.texture,
                            e.title.visible = !0),
                        this.heading.x = 50 - this.heading.width / 2,
                        26 == e.spr.texture.height && 18 == e.spr.texture.width ? (this.sprite.scale.y = 2,
                            this.sprite.scale.x = 2,
                            "" == e.tribe ? (this.background.height = 108,
                                this.use.y = 72) : (this.background.height = 112,
                                this.sprite.y = 22,
                                this.use.y = 76)) : (this.sprite.scale.y = 32 / e.spr.texture.height,
                            this.sprite.scale.x = this.sprite.scale.y,
                        "" == e.tribe && (this.sprite.x = 35,
                            this.sprite.y = 12)),
                        myself && myself == e ? this.use.visible = !1 : this.use.visible = !0,
                        this.use.set_text("Info"),
                        this.use.x = 34,
                        this.drop.visible = !1,
                        this.drop_amount.visible = !1,
                        target.id = e.id,
                        target.redraw(e.spr.width),
                        target.x = e.spr.x + e.halfx,
                        target.y = e.spr.y + e.spr.height - 2,
                        send({
                            type: "t",
                            t: target.id
                        }),
                        target.id == me ? (target.visible = !1,
                            info_pane.visible = !1) : target.visible = !0)
            }
        },
        ui_container.addChild(info_pane),
        ui_container.build = jv.Button.create(610, 220, 60, items[15][Math.floor(719 / 16)], ui_container, 42),
        ui_container.build.button_alpha = .2,
        ui_container.build.clear_item(),
        ui_container.build.draw_item(),
        ui_container.build.on_click = function() {
            jv.build_dialog.visible ? jv.build_dialog.hide() : jv.build_dialog.show(),
                build_type && "" != build_type ? jv.build_dialog.info.use.set_text(build_type) : jv.build_dialog.info.use.set_text("Build"),
            jv.build_dialog.info.obj && (void 0 !== jv.build_dialog.info.obj.quantity || jv.build_dialog.info.obj.build) && jv.build_dialog.info.set_info(),
                update_build()
        },
        build_pane = jv.scene(),
        build_pane.x = 16,
        build_pane.visible = !0,
        jv.chat_box = jv.ChatBox.create(0, 40, 276, 210),
        jv.chat_fade = jv.ChatBox.create(0, 40, 276, 210),
    jv.chat_fade.fade = 1,
    jv.chat_fade.text_style.strokeThickness = 5,
    jv.chat_fade.text_style.stroke = 3355443,
    jv.chat_fade.line_limit = 20,
    jv.chat_fade.interactive = 0,
    jv.init_dialogs(),
    master_container.addChild(hover_container),
    master_container.addChild(effect_container),
    map_fade = new PIXI.Graphics,
    map_fade.beginFill(0),
    map_fade.lineStyle(1, 0),
    map_fade.drawRect(0, 0, jv.game_width, jv.game_height),
    map_fade.endFill(),
    map_fade.alpha = 0,
    static_container = jv.scene(),
    jv.add(static_container),
    jv.add(map_fade),
    jv.add(ui_container),
    inv_pane = jv.scene(),
    inv_pane.x = jv.game_width - 160,
    ui_container.addChild(inv_pane),
    c = 0;
    for (var i = 0; i < 5; i++)
        for (var o = 0; o < 3; o++)
            inv[c] = jv.InventorySlot.create(16 + 47 * o, 44 + 38 * i, c, inv_pane),
                c += 1;
    ui_container.interactive = !0,
        game_fade = new PIXI.Graphics,
        game_fade.beginFill(0),
        game_fade.lineStyle(1, 0),
        game_fade.drawRect(0, 0, jv.game_width, jv.game_height),
        game_fade.endFill(),
        jv.add(game_fade),
        ui_container.cur_page = jv.text("1", {
            font: "12px Verdana",
            fill: jv.color_light,
            lineJoin: "round",
            stroke: jv.color_dark,
            strokeThickness: 4,
            align: "center"
        }),
        ui_container.cur_page.x = jv.game_width - 87,
        ui_container.cur_page.y = 239,
        ui_container.addChild(ui_container.cur_page),
        ui_container.inv_next = jv.Button.create(jv.game_width - 49, 236, 32, ">"),
        ui_container.inv_next.on_click = function() {
            item_page < 4 && (item_page++,
                ui_container.cur_page.text = String(item_page + 1),
                update_inventory())
        },
        ui_container.inv_prev = jv.Button.create(jv.game_width - 146, 236, 32, "<"),
        ui_container.inv_prev.on_click = function() {
            item_page > 0 && (item_page--,
                ui_container.cur_page.text = String(item_page + 1),
                update_inventory())
        };
    var a = jv.game_width - 144,
        n = 8;
    ui_container.stats = jv.Button.create(a, 4, 60, "Character", null, 32),
        ui_container.stats.on_click = function() {
            jv.stat_dialog.show(),
                send({
                    type: "c",
                    r: "st"
                })
        },
        a += 66,
        ui_container.options = jv.Button.create(a, 4, 60, "Menu", null, 32),
        ui_container.options.on_click = function() {
            option_dialog.show()
        },
        a = jv.game_width - 144,
        n = 380,
        a += 66,
        a += 38,
        ui_container.addChild(compass2),
        ui_container.addChild(compass),
        ui_container.addChild(jv.glow),
        ui_container.addChild(ph_dpad),
        jv.fps = jv.text("FPS: ", {
            font: "12px Verdana",
            fill: 16777215,
            lineJoin: "round",
            stroke: jv.color_dark,
            strokeThickness: 4,
            align: "right"
        }),
        jv.fps.x = 505,
        jv.fps.y = 48,
        jv.fps.visible = show_fps,
        ui_container.addChild(jv.fps),
        jv.toggle_chat = new PIXI.Sprite,
        jv.toggle_chat.interactive = !0,
        jv.toggle_chat.scale.x = 2,
        jv.toggle_chat.scale.y = 2,
        jv.toggle_chat.x = 14,
        jv.toggle_chat.y = 14,
        jv.toggle_chat.alpha = .6,
        jv.toggle_chat.texture = jv.chat_say.texture,
        jv.toggle_chat.mode = "say",
        jv.toggle_chat.buttonMode = !0,
        jv.toggle_chat.hitArea = new PIXI.Polygon(new PIXI.Point(-5, -9), new PIXI.Point(18, -9), new PIXI.Point(18, 12), new PIXI.Point(-5, 12)),
        jv.toggle_chat.onClick = function() {
            "say" == this.mode ? (this.mode = "global",
                this.texture = jv.chat_global.texture,
                input_field.placeholder.text = "Global chat..") : "global" == this.mode ? (this.mode = "tribe",
                this.texture = jv.chat_tribe.texture,
                input_field.placeholder.text = "Tribe chat..") : "tribe" == this.mode ? (this.mode = "tell",
                this.texture = jv.chat_tell.texture,
                input_field.placeholder.text = "Tell..") : "tell" == this.mode && (this.mode = "say",
                this.texture = jv.chat_say.texture,
                input_field.placeholder.text = "Chat..")
        },
        jv.toggle_chat.on("mouseup", jv.toggle_chat.onClick),
        jv.toggle_chat.on("touchend", jv.toggle_chat.onClick),
        inv_pane.visible = 0,
        inventory.visible = 0,
        ui_container.cur_page.visible = 0,
        ui_container.inv_prev.visible = 0,
        ui_container.inv_next.visible = 0,
        ui_container.addChild(jv.toggle_chat),
        jv.ability = [],
        input_field = jv.TextInput.create(34, 10, 180, 24),
        input_field.placeholder.text = "Chat..",
        setup_mobile_input(),
        jv.bringToFront(jv.spawn_dialog),
        jv.bringToFront(jv.create_dialog),
        jv.quick_toggle = 1,
        jv.inv_icons = 1
};
jv.ready = function() {
    jv.state = "ready",
        splash = jv.sprite(path + "data/misc/splash_screen.jpg" + vt),
        jv.color_picker = jv.sprite(path + "data/misc/color.png" + vt),
        jv.sound_icon = jv.sprite(path + "data/misc/sound_icon.png" + vt),
        jv.music_icon = jv.sprite(path + "data/misc/music_icon.png" + vt),
        jv.music_icon.x = 12,
        jv.music_icon.y = 320,
        jv.music_icon.scale.x = .75,
        jv.music_icon.scale.y = .75,
        jv.music_icon.tint = 2237149,
        jv.music_icon.alpha = .7,
        jv.music_icon.interactive = !0,
        jv.music_icon.buttonMode = !0,
        jv.music_icon.onClick = function() {
            if (.7 == this.alpha) {
                this.alpha = .3,
                    jv.music_volume = 0;
                var e;
                for (e in music)
                    music[e].volume(0);
                option_dialog.music_slider.set_percent(0)
            } else {
                this.alpha = .7,
                    jv.music_volume = .4;
                var e;
                for (e in music)
                    music[e].volume(jv.music_volume);
                option_dialog.music_slider.set_percent(40)
            }
        },
        jv.music_icon.on("mouseup", jv.music_icon.onClick),
        jv.music_icon.on("touchend", jv.music_icon.onClick),
        splash.addChild(jv.music_icon),
        jv.sound_icon.x = 15,
        jv.sound_icon.y = 360,
        jv.sound_icon.scale.x = .75,
        jv.sound_icon.scale.y = .75,
        jv.sound_icon.tint = 2237149,
        jv.sound_icon.alpha = .7,
        jv.sound_icon.interactive = !0,
        jv.sound_icon.buttonMode = !0,
        jv.sound_icon.onClick = function() {
            .7 == this.alpha ? (this.alpha = .3,
                jv.sound_volume = 0,
                option_dialog.sound_slider.set_percent(0)) : (this.alpha = .7,
                jv.sound_volume = .5,
                option_dialog.sound_slider.set_percent(50))
        },
        jv.sound_icon.on("mouseup", jv.sound_icon.onClick),
        jv.sound_icon.on("touchend", jv.sound_icon.onClick),
        splash.addChild(jv.sound_icon);
    for (var e = 1; e <= max_costume; e++)
        monster[e] = jv.spritesheet(path + "data/monsters/" + e + ".png" + vt, 24, 32);
    tiles = jv.spritesheet(path + "data/misc/tile16.png" + vt, 16, 16, 2),
        items = jv.spritesheet(path + "data/misc/item16.png" + vt, 16, 16, 2),
        edges = jv.spritesheet(path + "data/misc/edges.png" + vt, 32, 32),
        compass = jv.sprite(path + "data/misc/compass.png" + vt),
        jv.action_button = jv.sprite(path + "data/misc/button.png" + vt),
        jv.pickup_button = jv.sprite(path + "data/misc/button.png" + vt),
        jv.chat_say = jv.sprite(path + "data/misc/chat_say.png" + vt),
        jv.chat_tell = jv.sprite(path + "data/misc/chat_tell.png" + vt),
        jv.chat_tribe = jv.sprite(path + "data/misc/chat_tribe.png" + vt),
        jv.chat_global = jv.sprite(path + "data/misc/chat_global.png" + vt),
        jv.buffs = jv.spritesheet(path + "data/misc/buffs.png" + vt, 8, 8),
        ui_container = jv.scene(),
        inventory = jv.sprite(),
        jv.theme(inventory, 160, 236),
        jv.star = jv.sprite(path + "data/misc/star.png" + vt),
        jv.star.x = 200,
        jv.star.y = 200,
        jv.buffbar = [],
        jv.buff_container = jv.scene(),
        jv.buff_container.scale.x = 2,
        jv.buff_container.scale.y = 2,
        ui_container.addChild(jv.buff_container),
        jv.buff_container.x = 194,
        jv.buff_container.y = 336,
        keyEnter.release = function() {
            input_field.hasFocus || input_field.focus()
        },
        keyShift.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "g"
            })
        },
        keyTab.press = function() {
            input_field.hasFocus || editing || me !== -1 && jv.inv_button.on_click()
        },
        keyC.press = function() {
            input_field.hasFocus || editing || me !== -1 && jv.toggle_chat.onClick()
        },
        keyB.press = function() {
            input_field.hasFocus || editing || me !== -1 && ui_container.build.on_click()
        },
        keyI.press = function() {
            input_field.hasFocus || editing || me !== -1 && (jv.stat_dialog.visible ? jv.stat_dialog.hide() : ui_container.stats.on_click())
        },
        keyK.press = function() {
            input_field.hasFocus || editing || me !== -1 && (jv.skill_dialog.visible ? jv.skill_dialog.hide() : jv.stat_dialog.skill.on_click())
        },
        keyU.press = function() {
            input_field.hasFocus || editing || me !== -1 && (jv.upgrade_dialog.visible ? jv.upgrade_dialog.hide() : jv.stat_dialog.upgrades.on_click())
        },
        keyM.press = function() {
            input_field.hasFocus || editing || me !== -1 && (jv.mapping_dialog.visible ? jv.mapping_dialog.hide() : send({
                type: "c",
                r: "mp"
            }))
        },
        keyQ.press = function() {
            input_field.hasFocus || editing || me !== -1 && jv.ability[0] && jv.ability[0].do_click()
        },
        keyE.press = function() {
            input_field.hasFocus || editing || me !== -1 && jv.ability[1] && jv.ability[1].do_click()
        },
        keyR.press = function() {
            input_field.hasFocus || editing || me !== -1 && jv.ability[2] && jv.ability[2].do_click()
        },
        keyT.press = function() {
            input_field.hasFocus || editing || me !== -1 && jv.ability[3] && jv.ability[3].do_click()
        },
        keyF.press = function() {
            input_field.hasFocus || editing || me !== -1 && jv.ability[4] && jv.ability[4].do_click()
        },
        keyEscape.press = function() {
            if (!input_field.hasFocus && !editing && me !== -1) {
                var e;
                for (e in jv.Dialog.list) {
                    if (jv.Dialog.list[e].visible && jv.Dialog.list[e].modal)
                        return;
                    jv.Dialog.list[e].visible = !1
                }
            }
        },
        keyComma.press = function() {
            input_field.hasFocus || editing || me !== -1 && ui_container.inv_prev.on_click();
        },
        keyPeriod.press = function() {
            input_field.hasFocus || editing || me !== -1 && ui_container.inv_next.on_click()
        },
        keySlash.press = function() {
            input_field.hasFocus || editing || me !== -1 && "" == input_field.chars && (input_field.chars = "/",
                input_field.pos = 1,
                input_field.focus(),
                setTimeout(function() {
                    keySlash.isUp = !0
                }, 100))
        },
        keyBackslash.press = function() {
            input_field.hasFocus || editing || me !== -1 && "" == input_field.chars && (input_field.chars = "/b ",
                input_field.pos = 3,
                input_field.focus(),
                setTimeout(function() {
                    keyBackslash.isUp = !0
                }, 100))
        },
        keyBracket.press = function() {
            input_field.hasFocus || editing || me !== -1 && "" == input_field.chars && (last_tell && "" != last_tell ? input_field.chars = "/t " + last_tell + " " : input_field.chars = "/t ",
                input_field.pos = input_field.chars.length,
                input_field.focus(),
                setTimeout(function() {
                    keyBracket.isUp = !0
                }, 100))
        },
        keyQuote.press = function() {
            input_field.hasFocus || editing || me !== -1 && "" == input_field.chars && (input_field.chars = "/tc ",
                input_field.pos = input_field.chars.length,
                input_field.focus(),
                setTimeout(function() {
                    keyQuote.isUp = !0
                }, 100))
        },
        key1.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 0
            })
        },
        key2.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 1
            })
        },
        key3.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 2
            })
        },
        key4.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 3
            })
        },
        key5.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 4
            })
        },
        key6.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 5
            })
        },
        key7.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 6
            })
        },
        key8.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 7
            })
        },
        key9.press = function() {
            input_field.hasFocus || editing || me !== -1 && send({
                type: "u",
                slot: 8
            })
        };
    var t = document.getElementById("jv");
    t.oncontextmenu = function(e) {
        if (e.preventDefault(),
            jv.inv_button.expanded)
            for (var t = 580, i = 0; i < item_length; i++)
                jv.mouse.x > inv[i].x + t && jv.mouse.x < inv[i].x + 32 + t && jv.mouse.y > inv[i].y && jv.mouse.y < inv[i].y + 32 && inv[i].texture != tiles[0][0] && send({
                    type: "d",
                    slot: i + item_page * item_length,
                    amt: drop_amt
                })
    },
        document.querySelector("canvas").onfocusout = function() {
            input_field.blur()
        },
        master_container = jv.scene(),
        master_container.x = 0,
        master_container.y = 0,
        map_container = jv.scene(),
        map_container.x = 0,
        map_container.y = 0,
        anim_map_container = jv.scene(),
        edge_container = jv.scene(),
        edge_container.x = 0,
        edge_container.y = 0;
    var i, o, a = 0;
    for (i = -jv.update_x; i < jv.update_x; i++)
        for (o = -jv.update_y; o < jv.update_y; o++)
            map[a] = new PIXI.Sprite,
                map[a].x = 32 * i,
                map[a].y = 32 * o,
                map_container.addChild(map[a]),
                map[a].anim = jv.sprite(tiles[6][Math.floor(20.375)]),
                map[a].anim.x = 32 * i,
                map[a].anim.y = 32 * o,
                map[a].anim.visible = 0,
                anim_map_container.addChild(map[a].anim),
                map[a].edge = jv.sprite(edges[0][1]),
                map[a].edge.x = 32 * i,
                map[a].edge.y = 32 * o,
                map[a].edge.spr = 16,
                map[a].edge.visible = 0,
                edge_container.addChild(map[a].edge),
                map[a].cover = jv.sprite(edges[0][1]),
                map[a].cover.x = 32 * i,
                map[a].cover.y = 32 * o - 20,
                map[a].cover.ry = map[a].cover.y,
                map[a].cover.visible = 0,
                player_container.addChild(map[a].cover),
                map[a].cover_mask = jv.sprite(edges[0][1]),
                map[a].cover_mask.x = 0,
                map[a].cover_mask.y = 0,
                map[a].cover_mask.visible = 0,
                map[a].cover.addChild(map[a].cover_mask),
                a += 1;
    anim_map_container.animations = 0,
        master_container.addChild(map_container),
        master_container.addChild(anim_map_container),
        master_container.addChild(edge_container),
        anim1_container = jv.scene(),
        master_container.addChild(anim1_container),
        anim2_container = jv.scene(),
        master_container.addChild(anim2_container),
        anim2_container.visible = 0,
        object_container = jv.scene(),
        object_container.x = 0,
        object_container.y = 0,
        master_container.addChild(object_container),
        target = jv.sprite(),
        target.gfx = new PIXI.Graphics,
        target.addChild(target.gfx),
        target.redraw = function(e) {
            this.gfx.clear(),
                this.gfx.lineStyle(2, 16777062, .8),
                this.gfx.beginFill(16777028, .4),
                this.gfx.drawEllipse(0, 0, e / 2, 8),
                this.gfx.endFill()
        },
        target.redraw(16),
        target.visible = !1,
        init_ui(),
        jv.ml_sound = Cookies.get("ml_sound"),
    jv.ml_sound && (jv.sound_volume = Number(jv.ml_sound),
        option_dialog.sound_slider.set_percent(jv.sound_volume)),
        jv.ml_music = Cookies.get("ml_music"),
    jv.ml_music && (option_dialog.music_slider.set_percent(Number(jv.ml_music)),
        option_dialog.music_slider.onChange());
    var n = Cookies.get("ml_user"),
        r = Cookies.get("ml_pass");
    n && r ? (jv.login_dialog.username.setText(jv.base64_decode(n)),
        jv.login_dialog.password.setText(jv.base64_decode(r))) : jv.login_dialog.guest.visible = 1,
        "true" === Cookies.get("ml_inventory_buttons") ? (jv.inv_icons = 1,
            jv.inv_button.visible = 1,
            ui_container.build.visible = 1) : "false" === Cookies.get("ml_inventory_buttons") && (jv.inv_icons = 0,
            jv.inv_button.visible = 0,
            ui_container.build.visible = 0),
        "true" === Cookies.get("ml_chat_window") ? (jv.chat_toggle = 1,
            jv.chat_fade.visible = !1,
            jv.chat_box.visible = !0,
            jv.chat_box.interactive = !0,
            jv.chat_box.gfx.alpha = jv.chat_box.gfx.max_alpha) : "false" === Cookies.get("ml_chat_window") && (jv.chat_toggle = 0,
            jv.chat_fade.visible = !0,
            jv.chat_box.visible = !1),
        "true" === Cookies.get("ml_dpad") ? (compass.visible = 1,
            compass2.visible = 1,
            ph_dpad.visible = 1,
            jv.chat_box.h = 210,
            jv.chat_box.gfx.height = 212,
            jv.chat_box.m.height = 210,
            jv.chat_box.mask.height = 210,
            jv.chat_box.resume.y = jv.chat_box.h - 35) : "false" === Cookies.get("ml_dpad") && (compass.visible = 0,
            compass2.visible = 0,
            ph_dpad.visible = 0,
            jv.chat_box.h = 377,
            jv.chat_box.gfx.height = 379,
            jv.chat_box.m.height = 377,
            jv.chat_box.mask.height = 377,
            jv.chat_box.resume.y = jv.chat_box.h - 35),
        "true" === Cookies.get("ml_quick_buttons") ? (jv.hot_scene.visible = 1,
            jv.quick_toggle = 1) : "false" === Cookies.get("ml_quick_buttons") && (jv.hot_scene.visible = 0,
            jv.quick_toggle = 0),
        "true" === Cookies.get("ml_action_button") ? (jv.action_button.visible = 1,
            ph_action.visible = 1,
            info_pane.x = 480,
            info_pane.y = 34) : "false" === Cookies.get("ml_action_button") && (jv.action_button.visible = 0,
            ph_action.visible = 0,
            info_pane.x = 580,
            info_pane.y = 284);
    var s = Cookies.get("ml_chat_opacity");
    "undefined" != typeof s && (jv.chat_box.gfx.max_alpha = Cookies.get("ml_chat_opacity") / 100,
    jv.chat_box.visible && (jv.chat_box.gfx.alpha = jv.chat_box.gfx.max_alpha));
    var l = .7 * Cookies.get("ml_chat_width") + 30;
    if (!isNaN(l)) {
        l > 100 ? l = 100 : l < 30 && (l = 30);
        var d = Math.floor(346 * l / 100);
        jv.chat_box.w = d,
            jv.chat_box.gfx.width = d,
            jv.chat_box.m.width = d,
            jv.chat_box.resume.x = jv.chat_box.w / 2 - 35,
            jv.chat_box.text_style.wordWrapWidth = jv.chat_box.w - 2 * jv.chat_box.padding,
            jv.chat_fade.w = d,
            jv.chat_fade.gfx.width = d,
            jv.chat_fade.m.width = d,
            jv.chat_fade.resume.x = jv.chat_fade.w / 2 - 35,
            jv.chat_fade.text_style.wordWrapWidth = jv.chat_fade.w - 2 * jv.chat_fade.padding
    }
    var l = .07 * Cookies.get("ml_font_size") + 9;
    if (isNaN(l) || (l > 16 ? l = 16 : l < 9 && (l = 9),
        jv.chat_box.text_style.font = l + "px Verdana",
        jv.chat_fade.text_style.font = l + "px Verdana"),
        jv.loading_container.visible = 0,
        playMusic("rpgtitle", 1),
        append("<strong><span style='color:#99ff66'>Mystera</span> <span style='color:#66ffff'>Legacy</span> <span style='color:#ffff66'>" + version + "</span></strong>"),
        wall_sprite = new PIXI.Sprite,
        make_covers(),
        jv.reconnect_dialog.show(),
        game_fade.visible = 0,
        ui_container.visible = 0,
    "undefined" != typeof ace && (editor = ace.edit("script_code"),
        editor.setTheme("ace/theme/monokai"),
        editor.getSession().setMode("ace/mode/javascript"),
        editor.on("blur", function() {
            editing = 0
        }),
        editor.on("focus", function() {
            editing = 1
        })), !phone) {
        var c = document.getElementById("script_name");
        c && (c.style.display = "none"),
            c = document.getElementById("script_code"),
        c && (c.style.display = "none")
    }
    document.addEventListener("visibilitychange", function() {
        document.hidden ? jv.before_blur() : has_focus = 1
    })
};
//# sourceMappingURL=ml.min.js.map
