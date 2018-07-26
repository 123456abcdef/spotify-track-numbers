// ==UserScript==
// @name         Spotify Track Numbers
// @namespace    https://github.com/123456abcdef/
// @version      0.1
// @description  Adds track numbers to Spotify's track list view.
// @author       123456abcdef
// @match        https://open.spotify.com/*
// @updateURL    https://raw.githubusercontent.com/123456abcdef/spotify-track-numbers/master/spotify-track-numbers.user.js
// @downloadURL  https://raw.githubusercontent.com/123456abcdef/spotify-track-numbers/master/spotify-track-numbers.user.js
// @grant        none
// ==/UserScript==

function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}

var Spotify = {
    _url: '',
    _observerConfig: {
        subtree: true,
        attributeFilter: ['class']
    },
    initTracklistObserver: function() {
        Spotify.writeTrackNumbers();

        var target = Spotify._getTracklistContainer();

        if (target) {
            var observer = new MutationObserver(function() {
                Spotify.watchTracklist(Spotify.writeTrackNumbers, observer)
            });
            observer.observe(target, Spotify._observerConfig);
        }
    },
    watchTracklist: function(callback, observer) {
        observer.disconnect();

        callback();

        observer.observe(Spotify._getTracklistContainer(), Spotify._observerConfig);
    },
    onUrlChange: function() {
        setInterval(function() {
            if (Spotify._url !== window.location.href) {
                Spotify._url = window.location.href;

                setTimeout(Spotify.initTracklistObserver, 200);
            }
        }, 500);
    },
    writeTrackNumbers: function() {
        var elements = document.querySelectorAll('.tracklist .tracklist-row');

        if (elements) {
            elements.forEach(function (element, i) {
                var e = element.querySelector('.spoticon-track-16');
                if (e) {
                    e.innerText = pad(i + 1, 2);
                }
            });
        }
    },
    _getTracklistContainer: function() {
        return document.querySelector('.tracklist');
    }
};

Spotify.onUrlChange();
