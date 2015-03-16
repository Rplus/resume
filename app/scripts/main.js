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
      document.querySelector('.business-card').style.backgroundImage = 'url(' + $src.oriAttr.src + ')';
    }
  };

  Rplus.loadImage = function($src) {
    $src.ext = $src.oriAttr.src.split('.').reverse()[0];

    var _cachedItem = $src.oriAttr.src.split('/').reverse()[0];
    var localData = localStorage.getItem(_cachedItem);

    if (Rplus.hasCache && localData) {
      $src.oldSrc = $src.src;
      $src.oriAttr.src = localData;
      Rplus.injectImage($src);
    } else {
      // ajax jpg & trans to base64
      // ref: http://stackoverflow.com/a/8022521
      var xhr = new XMLHttpRequest();
      xhr.open('GET', $src.oriAttr.src, true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function(e) {
        if (this.status === 200) {
          var uInt8Array = new Uint8Array(this.response);
          var i = uInt8Array.length;
          var biStr = new Array(i);

          while (i--) {
            biStr[i] = String.fromCharCode(uInt8Array[i]);
          }

          var data = biStr.join('');
          var base64 = window.btoa(data); // gte IE10

          $src.oldSrc = $src.src;
          $src.oriAttr.src = 'data:' + Rplus.imageMIMEType[$src.ext] + ';base64,' + base64;

          // cache data in localStorage
          localStorage.setItem(_cachedItem, $src.oriAttr.src);

          Rplus.injectImage($src);
        }
      };

      xhr.send();
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
    var webFontText = (webFontEle.textContent || webFontEle.innerText).trim();

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
