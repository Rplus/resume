'use strict';
(function(_htmlTag) {
  _htmlTag.className = _htmlTag.className.replace(/\bno-js\b/, ' js ');

  if (!navigator.onLine) {
    _htmlTag.className += ' offline ';
  }

})(document.documentElement);
