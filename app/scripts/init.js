(function($win, $doc) {
  'use strict';

  var document = $doc;
  var window = $win;

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
    getFBInfo: function ($noscriptEle) {
      var _allAttr = (function ($fbString) {
        return {
          arr: $fbString.match(/(?!\s)\w+?=".+?"/g),
          obj: {
            parentId: $noscriptEle.id,
            oriString: $fbString.trim(),
            oriAttr: {},
            tag: $fbString.match(/^\s+?<(\w+?)\s/)[1]
          }
        };
      })($noscriptEle.firstChild.data);

      for (var i = _allAttr.arr.length; i;) {
        i--;
        _allAttr._tmpArr = _allAttr.arr[i].match(/(\w+?)="(.+?)"/);
        _allAttr.obj.oriAttr[_allAttr._tmpArr[1]] = _allAttr._tmpArr[2];
      }

      return _allAttr.obj;
    },
    injectInline: function ($src, $specilOption) {
      $src.sourceAttr = {
        link: 'href',
        img: 'src'
      }[$src.tag];
      $src.sourceUrl = $src.oriAttr[$src.sourceAttr];
      $src.ext = $src.sourceUrl.split('.').reverse()[0];

      var _cachedItem = $src.sourceUrl.split('/').reverse()[0];
      var _isSvgType = ('svg' === $src.ext);
      var localData = localStorage.getItem(_cachedItem);

      var injectHTML = function (inlineContent) {
        var div = document.createElement('div');
        div.innerHTML = inlineContent;

        if (document.readyState !== 'loading') {
          var _insertBeforeEle = ($specilOption && $specilOption.insertBefore) || Rplus.ele.body.childNodes[0];
          Rplus.ele.body.insertBefore(div, _insertBeforeEle);
        } else {
          Rplus.ele.head.appendChild(div);
        }
      };

      if (Rplus.hasCache && localData) {
        injectHTML(localData);
      } else if ($specilOption && $specilOption.insertTag) {
        injectHTML($src.oriString);
      } else {
        Rplus.ajaxGet($src.sourceUrl, function (response) {
          var inlineContent = response.data;

          if (!_isSvgType) {
            inlineContent = '<style>' + inlineContent + '</sctyle>';
          }

          localStorage.setItem(_cachedItem, inlineContent);

          if ($specilOption && $specilOption.cacheOnly) {
            return;
          }

          injectHTML(inlineContent);
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
  ;(function ($ele, $lsItem) {
    var _latestVersion = $ele.getAttribute('data-' + $lsItem);
    var _cacheVersion = localStorage.getItem($lsItem);
    var _hasCache = (_cacheVersion === _latestVersion);

    if (!_hasCache || '#clear' === location.hash) {
      Rplus.hasCache = false;

      // forcely clear all localStorage data
      localStorage.clear();
      localStorage.setItem($lsItem, _latestVersion);
    } else {
      Rplus.hasCache = true;
    }
  })(document.getElementById('js-version'), 'version');

  // init modernizr class for <html>, from cache or inject script callback
  ;(function ($eles, $lsItem) {
    var htmlClassName = localStorage.getItem($lsItem);

    if (Rplus.hasCache && htmlClassName) {
      // init html class
      $eles.html.className = htmlClassName;
    } else {
      var _injectJsEle = document.createElement('script');

      // save html className into localStorage after script loaded
      _injectJsEle.src = '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js';
      _injectJsEle.addEventListener('load', function () {
        localStorage.setItem($lsItem, $eles.html.className);
      });

      $eles.head.appendChild(_injectJsEle);
    }
  })(Rplus.ele, 'modernizrAllClass');

  // init main style
  Rplus.injectInline(Rplus.getFBInfo(document.getElementById('js-main-style')), {insertTag: true});

})(window, document);
