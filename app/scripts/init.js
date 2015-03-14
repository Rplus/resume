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
    getFallbackUrl: function (_noscriptEle, _attr) {
      _attr = _attr || 'href';
      var _pattern = new RegExp(_attr + '="(.+?)"' , 'i');
      return _noscriptEle.firstChild.data.match(_pattern)[1];
    },
    getFBInfo: function (noscriptEle$) {
      var _allAttr = (function (fbString$) {
        return {
          arr: fbString$.match(/(?!\s)\w+?=".+?"/g),
          obj: {
            tag: fbString$.match(/^\s+?<(\w+?)\s/)[1]
          }
        };
      })(noscriptEle$.firstChild.data);

      for (var i = _allAttr.arr.length; i;) {
        i--;
        _allAttr._tmpArr = _allAttr.arr[i].match(/(\w+?)="(.+?)"/);
        _allAttr.obj[_allAttr._tmpArr[1]] = _allAttr._tmpArr[2];
      }

      return _allAttr.obj;
    },
    injectInline: function (_source, _specilTarget) {
      var _isSvgType = (/\.svg$/.test(_source));
      var _cachedItem = _source.split('/').reverse()[0];
      var localData = localStorage.getItem(_cachedItem);

      var injectHTML = function (inlineContent) {
        var div = document.createElement('div');
        div.innerHTML = inlineContent;

        if (document.readyState !== 'loading') {
          _specilTarget = _specilTarget || Rplus.ele.body.childNodes[0];
          Rplus.ele.body.insertBefore(div, _specilTarget);
        } else {
          Rplus.ele.head.appendChild(div);
        }
      };

      if (localData) {
        injectHTML(localData);
      } else {
        Rplus.ajaxGet(_source, function (response) {
          var inlineContent = response.data;

          if (!_isSvgType) {
            inlineContent = '<style>' + inlineContent + '</sctyle>';
          }

          injectHTML(inlineContent);
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

  // init modernizr class for <html>, from cache or inject script callback
  ;(function (eles$, lsItem$) {
    var htmlClassName = localStorage.getItem(lsItem$);

    if (Rplus.hasCache && htmlClassName) {
      // init html class
      eles$.html.className = htmlClassName;
    } else {
      var _injectJsEle = document.createElement('script');

      // save html className into localStorage after script loaded
      _injectJsEle.src = '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js';
      _injectJsEle.addEventListener('load', function () {
        localStorage.setItem(lsItem$, eles$.html.className);
      });

      eles$.head.appendChild(_injectJsEle);
    }
  })(Rplus.ele, 'modernizrAllClass');

})(window, document);
