'use strict';

window.Rplus.ready(function () {

  var Rplus = window.Rplus;

  Rplus.hasClass = function ($ele, $className) {
    if ($ele.classList) {
      return $ele.classList.contains($className);
    } else {
      return new RegExp('(^| )' + $className + '( |$)', 'gi').test($ele.className);
    }
  };

  Rplus.removeClass = function ($el, $className) {
    var _classReg = new RegExp('\\b' + $className + '\\b', 'g');
    $el.className = $el.className.replace(_classReg, '');
  };

  // load font: limited char
  (function () {
    var googleFontSource = document.getElementById('js-google-font').firstChild.data.match(/href="(.+?)"/)[1];
    var googleFontUsed = document.querySelectorAll('.wf-inactive')[0];
    var googleFontText = (googleFontUsed.textContent || googleFontUsed.innerText).trim();
    var googleFontURL = googleFontSource + '&text=' + encodeURIComponent(googleFontText);

    var shwoWFText = function () {
      Rplus.removeClass(googleFontUsed, 'wf-inactive');
    };

    // for web font load slowly, it'll remove the .wf-inactive class for showing the text
    var webfontLoaderTimeout;

    (function () {
      webfontLoaderTimeout = setTimeout(shwoWFText, 3000);
    })();

    var _link = document.createElement('link');
    _link.rel = 'stylesheet';
    _link.href = googleFontURL;
    _link.addEventListener('load', function () {
      shwoWFText();
      clearTimeout(webfontLoaderTimeout);
    });
    Rplus.ele.body.insertBefore(_link, Rplus.ele.body.childNodes[0]);
  })();

  // init svg icons
  (function () {
    if ('undefined' !== typeof window.SVGRect) {
      Rplus.injectInline({
        tag: 'img',
        src: './images/inject-svg/svgstore.svg'
      });
    } else {
      Rplus.injectInline( Rplus.getFBInfo(document.getElementById('js-icons-fallback')) );
    }
  })();

  // cache main.css if no-cache
  (function () {
    if (!Rplus.hasCache) {
      Rplus.injectInline(Rplus.getFBInfo(document.getElementById('js-main-style')), {cacheOnly: true});
    }
  })();

});
