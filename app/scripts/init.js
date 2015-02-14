(function() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  var insertSvgSprite = function () {
    var inlineSvg = localStorage.getItem('inlineSvg');

    var injectSvg = function (svgContent) {
        var div = document.createElement('div');
        div.innerHTML = svgContent;
        document.body.insertBefore(div, document.body.childNodes[0]);
    };

    if (inlineSvg) {
      ready(function () {
        injectSvg(inlineSvg);
      });
    } else {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', './images/inject-svg/svgstore.svg', true);
      ajax.send();
      ajax.onload = function(e) {
        var inlineSvgContent = ajax.responseText;
        injectSvg(inlineSvgContent);
        localStorage.setItem('inlineSvg', inlineSvgContent);
      };
    }
  };

  (function modernizrInit () {
    var htmlClassName = localStorage.getItem('modernizrAllClass');
    var lastDetectTime = localStorage.getItem('modernizrLastDetectTime') * 1;
    var detectDuration = lastDetectTime ? (new Date().getTime() - lastDetectTime) : false;

    if (htmlClassName && detectDuration < 259200000 ) { // 259200000 === 3 days
      document.documentElement.className = htmlClassName;
      insertSvgSprite();
      return;
    }

    var _head = document.getElementsByTagName('head')[0];
    var _injectJs = document.createElement('script');
    _injectJs.src = '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js';
    _injectJs.addEventListener('load', function () {
      localStorage.setItem('modernizrAllClass', document.documentElement.className);
      localStorage.setItem('modernizrLastDetectTime', new Date().getTime());
      insertSvgSprite();
    });
    _head.appendChild(_injectJs);
  })();

})();
