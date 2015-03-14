(function(win$, doc$) {
  'use strict';

  var document = doc$;
  var window = win$;

  window.Rplus = {
    ele: {
      html: document.documentElement,
      head: document.head || document.getElementsByTagName('head')[0]
    },
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
      if ('function' === typeof $fn) {
        ajax.onload = function () {
          $fn({data: ajax.responseText});
        };
      }
    },
    injectHTML: function (inlineContent, insertBeforeTarget) {
      var div = document.createElement('div');
      div.innerHTML = inlineContent;

      if (document.readyState !== 'loading') {
        insertBeforeTarget = insertBeforeTarget || document.body.childNodes[0];
        document.body.insertBefore(div, insertBeforeTarget);
      } else {
        document.head.appendChild(div);
      }
    },
    getFallbackUrl: function (_noscriptEle, _attr) {
      _attr = _attr || 'href';
      var _pattern = new RegExp(_attr + '="(.+?)"' , 'i');
      return _noscriptEle.firstChild.data.match(_pattern)[1];
    },
    injectInline: function (_source, _specilTarget) {
      var _isSvgType = (/\.svg$/.test(_source));
      var _cachedItem = _source.split('/').reverse()[0];
      var localData = localStorage.getItem(_cachedItem);

      if (localData) {
        Rplus.injectHTML(localData, _specilTarget);
      } else {
        Rplus.ajaxGet(_source, function (response) {
          var inlineContent = response.data;

          if (!_isSvgType) {
            inlineContent = '<style>' + inlineContent + '</sctyle>';
          }

          Rplus.injectHTML(inlineContent, _specilTarget);
          localStorage.setItem(_cachedItem, inlineContent);
        });
      }
    }
  };

  var Rplus = window.Rplus || {};

  // init Rplus.ele.body
  Rplus.ready(function () {
    Rplus.ele.body = document.body || document.getElementsByTagName('body')[0];
  });

  // check cache version
  ;(function (ele$, lsItem$) {
    var _latestVersion = ele$.getAttribute('data-' + lsItem$);
    var _cacheVersion = localStorage.getItem(lsItem$);
    var _hasCache = (_cacheVersion === _latestVersion);

    if (!_hasCache || '#clear' === location.hash) {
      // forcely clear all localStorage data
      localStorage.clear();
      localStorage.setItem(lsItem$, _latestVersion);
    }

    Rplus.hasCache = _hasCache;
  })(document.getElementById('js-version'), 'version');

  Rplus.injectInline(Rplus.getFallbackUrl(document.getElementById('js-main-style')));

  ;(function modernizrInit () {
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
})(window, document);
