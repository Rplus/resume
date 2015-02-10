(function() {
  'use strict';

  (function modernizrInit () {
    var htmlClassName = localStorage.getItem('modernizrAllClass');
    var lastDetectTime = localStorage.getItem('modernizrLastDetectTime') * 1;
    var detectDuration = lastDetectTime ? (new Date().getTime() - lastDetectTime) : false;

    if (htmlClassName && detectDuration < 259200000 ) { // 259200000 === 3 days
      document.documentElement.className = htmlClassName;
      return;
    }

    var _head = document.getElementsByTagName('head')[0];
    var _injectJs = document.createElement('script');
    _injectJs.src = '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js';
    _injectJs.addEventListener('load', function () {
      localStorage.setItem('modernizrAllClass', document.documentElement.className);
      localStorage.setItem('modernizrLastDetectTime', new Date().getTime());
    });
    _head.appendChild(_injectJs);
  })();

})();
