'use strict';

window.Rplus.ready(function() {

  var Rplus = window.Rplus;

  Rplus.hasClass = function($ele, $className) {
    if ($ele.classList) {
      return $ele.classList.contains($className);
    } else {
      return new RegExp('(^| )' + $className + '( |$)', 'gi').test($ele.className);
    }
  };

  Rplus.removeClass = function($el, $className) {
    var _classReg = new RegExp('\\b' + $className + '\\b', 'g');
    $el.className = $el.className.replace(_classReg, '');
  };

  Rplus.imageMIMEType = {
    jpg: 'image/jpg',
    png: 'image/png',
    svg: 'image/svg+xml'
  };

  Rplus.injectImage = function($src) {
    var img = document.createElement('img');
    var insertTarget = document.getElementById($src.parentId);

    for (var prop in $src.oriAttr) {
      if ($src.oriAttr.hasOwnProperty(prop)) {
        img.setAttribute(prop, $src.oriAttr[prop]);
      }
    }
    insertTarget.parentNode.insertBefore(img, insertTarget);

    if ('js-business-image' === $src.parentId) {
      document.querySelector('.business-card').style.backgroundImage = 'url("' + $src.oriAttr.src + '")';
    }
  };

  Rplus.cacheImage = function($src, $imgData, $cachedItem) {
    $src.oldSrc = $src.src;
    $src.oriAttr.src = $imgData;

    // cache data in localStorage
    localStorage.setItem($cachedItem, $imgData);
    Rplus.injectImage($src);
  };

  Rplus.loadImage = function($src) {
    var _srcOriAttr = $src.oriAttr;
    $src.ext = _srcOriAttr.src.split('.').reverse()[0];

    var _cachedItem = _srcOriAttr.src.split('/').reverse()[0];
    var localData = localStorage.getItem(_cachedItem);
    var canvas = document.createElement('canvas');

    // ensure canvas support
    if (!canvas.getContext) {
      console.log(3333);
      Rplus.injectImage($src);
      return;
    }

    if (Rplus.hasCache && localData) {
      $src.oldSrc = $src.src;
      _srcOriAttr.src = localData;
      Rplus.injectImage($src);
    } else {
      switch ($src.ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
          canvas.width = _srcOriAttr.width;
          canvas.height = _srcOriAttr.height;
          var ctx = canvas.getContext('2d');
          var _img = new Image();
          _img.onload = function() {
            ctx.drawImage(_img, 0, 0);
            var imgData = canvas.toDataURL();
            Rplus.cacheImage($src, imgData, _cachedItem);
          };
          _img.src = _srcOriAttr.src;
          break;

        case 'svg':
          // XDomainRequest for IE9
          var xhr = window.XDomainRequest ? new XDomainRequest() : new XMLHttpRequest();

          xhr.onload = function() {
            var imgData = ('data:' +  Rplus.imageMIMEType[$src.ext] + ',' + encodeURIComponent(xhr.responseText));
            Rplus.cacheImage($src, imgData, _cachedItem);
          };

          xhr.open('get', _srcOriAttr.src);

          xhr.send();
          break;

        default:
          break;
      }
    }
  };

  // cache image
  ;(function() {
    Rplus.loadImage(Rplus.getFBInfo(document.getElementById('js-avater-image')));
    Rplus.loadImage(Rplus.getFBInfo(document.getElementById('js-business-image')));
  })();

  // load font: limited char
  ;(function() {
    var webFontInfo = Rplus.getFBInfo(document.getElementById('js-google-font'));
    var webFontEle = document.querySelectorAll('.wf-inactive')[0];
    var webFontText = (webFontEle.textContent || webFontEle.innerText).replace(/<[^>]*>/g, '').trim();

    var shwoWFText = function() {
      Rplus.removeClass(webFontEle, 'wf-inactive');
    };

    // for web font load slowly, it'll remove the .wf-inactive class for showing the text
    var webfontLoaderTimeout;
    (function() {
      webfontLoaderTimeout = setTimeout(shwoWFText, 3000);
    })();

    var _link = document.createElement('link');
    _link.rel = 'stylesheet';
    _link.href = webFontInfo.oriAttr.href + '&text=' + encodeURIComponent(webFontText);
    _link.addEventListener('load', function() {
      shwoWFText();
      clearTimeout(webfontLoaderTimeout);
    });
    Rplus.ele.head.insertBefore(_link, Rplus.ele.head.lastChild);
  })();

  // init svg icons
  (function() {
    if ('undefined' !== typeof window.SVGRect) {
      Rplus.injectInline({
        tag: 'img',
        oriAttr: {
          src: './images/inject-svg/svgstore.svg'
        }
      });
    } else {
      Rplus.injectInline(Rplus.getFBInfo(document.getElementById('js-icons-fallback')));
    }
  })();

  // cache main.css if no-cache
  (function() {
    if (!Rplus.hasCache) {
      Rplus.injectInline(Rplus.getFBInfo(document.getElementById('js-main-style')), {cacheOnly: true});
    }
  })();

});
