(function() {
  'use strict';

  var RplusFns = {
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
    ajax: function ($path, $fn) {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', $path, true);
      ajax.send();
      ajax.onload = function(e) {
        $fn({data: ajax.responseText});
      };
    },
    injectHTML: function (inlineContent) {
      var div = document.createElement('div');
      div.innerHTML = inlineContent;
      document.body.insertBefore(div, document.body.childNodes[0]);
    }
  };

  var initIcons = function () {
    RplusFns.ready(function () {
      if (!RplusFns.hasClass(document.documentElement, 'inlinesvg')) {
        insertInlineSvg();
      } else {
        insertInlinePng();
      }
    });
  };

  var insertInlinePng = function () {
    var inlinePng = localStorage.getItem('inlinePng');

    if (inlinePng) {
      RplusFns.injectHTML(inlinePng);
    } else {
      var pngStylePath = document.getElementById('js-icons-fallback').firstChild.data.match(/href="(.+?)"/)[1];
      RplusFns.ajax(pngStylePath, function (ajaxRespond) {
        var inlinePngContent = '<style>' + ajaxRespond.data + '</sctyle>';
        RplusFns.injectHTML(inlinePngContent);
        localStorage.setItem('inlinePng', inlinePngContent);
      });
    }
  };

  var insertInlineSvg = function () {
    var inlineSvg = localStorage.getItem('inlineSvg');

    if (inlineSvg) {
      RplusFns.injectHTML(inlineSvg);
    } else {
      RplusFns.ajax('./images/inject-svg/svgstore.svg', function (ajaxRespond) {
        var inlineSvgContent = ajaxRespond.data;
        RplusFns.injectHTML(inlineSvgContent);
        localStorage.setItem('inlineSvg', inlineSvgContent);
      });
    }
  };

  (function modernizrInit () {
    var htmlClassName = localStorage.getItem('modernizrAllClass');
    var lastDetectTime = localStorage.getItem('modernizrLastDetectTime') * 1;
    var detectDuration = lastDetectTime ? (new Date().getTime() - lastDetectTime) : false;

    if (htmlClassName && detectDuration < 259200000 ) { // 259200000 === 3 days
      document.documentElement.className = htmlClassName;
      initIcons();
      return;
    }

    var _head = document.getElementsByTagName('head')[0];
    var _injectJs = document.createElement('script');
    _injectJs.src = '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js';
    _injectJs.addEventListener('load', function () {
      localStorage.setItem('modernizrAllClass', document.documentElement.className);
      localStorage.setItem('modernizrLastDetectTime', new Date().getTime());
      initIcons();
    });
    _head.appendChild(_injectJs);
  })();

})();
