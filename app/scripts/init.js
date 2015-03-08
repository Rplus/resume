(function() {
  'use strict';

  // forcely clear all localStorage data
  if ('#clear' === location.hash) {
    localStorage.clear();
  }

  window.RplusFns = {
    ready: function (fn) {
      if (document.readyState !== 'loading'){
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    },
    hasClass: function ($ele, $className) {
      if ($ele.classList) {
        return $ele.classList.contains($className);
      } else {
        return new RegExp('(^| )' + $className + '( |$)', 'gi').test($ele.className);
      }
    },
    ajaxGet: function ($path, $fn) {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', $path, true);
      ajax.send();
      ajax.onload = function () {
        $fn({data: ajax.responseText});
      };
    },
    injectHTML: function (inlineContent) {
      var div = document.createElement('div');
      div.innerHTML = inlineContent;
      document.body.insertBefore(div, document.body.childNodes[0]);
    }
  };

  var RplusFns = window.RplusFns || {};

  (function modernizrInit () {
    var htmlClassName = localStorage.getItem('modernizrAllClass');
    var lastDetectTime = localStorage.getItem('lastDetectTime') * 1;
    var detectDuration = lastDetectTime ? (new Date().getTime() - lastDetectTime) : false;

    if (htmlClassName && detectDuration < 259200000 ) { // 259200000 === 3 days
      // render form cached in 3 days
      document.documentElement.className = htmlClassName;
      return;
    }

    // clear cached
    localStorage.clear();

    var _head = document.getElementsByTagName('head')[0];
    var _injectJs = document.createElement('script');
    _injectJs.src = '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js';
    _injectJs.addEventListener('load', function () {
      localStorage.setItem('modernizrAllClass', document.documentElement.className);
      localStorage.setItem('lastDetectTime', new Date().getTime());
    });
    _head.appendChild(_injectJs);
  })();

})();
