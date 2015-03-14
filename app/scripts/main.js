'use strict';

window.Rplus.ready(function () {

  var Rplus = window.Rplus;

  Rplus.removeClass = function (_el, _className) {
    var _classReg = new RegExp('\\b' + _className + '\\b', 'g');
    _el.className = _el.className.replace(_classReg, '');
  };

  (function loadLimitedCharFont() {
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
  (function initIcons() {
    if (Rplus.hasClass(Rplus.ele.html, 'inlinesvg')) {
      Rplus.injectInline({
        tag: 'img',
        src: './images/inject-svg/svgstore.svg'
      });
    } else {
      Rplus.injectInline( Rplus.getFBInfo(document.getElementById('js-icons-fallback')) );
    }
  })();

});
