'use strict';

var RplusFns = window.RplusFns || {};

RplusFns.removeClass = function (_el, _className) {
  var _classReg = new RegExp('\\b' + _className + '\\b', 'g');
  _el.className = _el.className.replace(_classReg, '');
};

RplusFns.ready(function () {
  (function loadLimitedCharFont() {
    var googleFontSource = document.getElementById('js-google-font').firstChild.data.match(/href="(.+?)"/)[1];
    var googleFontUsed = document.querySelectorAll('.wf-inactive')[0];
    var googleFontText = (googleFontUsed.textContent || googleFontUsed.innerText).trim();
    var googleFontURL = googleFontSource + '&text=' + encodeURIComponent(googleFontText);

    var shwoWFText = function () {
      RplusFns.removeClass(googleFontUsed, 'wf-inactive');
    };

    // for web font load slowly, it'll remove the .wf-inactive class for showing the text
    var webfontLoaderTimeout;

    (function () {
      webfontLoaderTimeout = setTimeout(shwoWFText, 3000);
    })();

    var _link = document.createElement('link');
    _link.rel = 'stylesheet';
    _link.href = googleFontURL;
    _link.onload = function () {
      shwoWFText();
      clearTimeout(webfontLoaderTimeout);
    };
    document.body.insertBefore(_link, document.body.childNodes[0]);
  })();

  var injectInline = function (type) {
    var _isSvgType = (type === 'svg');
    var _type = (_isSvgType ? 'inlineSvg' : 'inlinePng');
    var localData = localStorage.getItem(_type);

    if (localData) {
      RplusFns.injectHTML(localData);
    } else {
      var iconSource = (_isSvgType ? './images/inject-svg/svgstore.svg' : document.getElementById('js-icons-fallback').firstChild.data.match(/href="(.+?)"/)[1]);
      RplusFns.ajaxGet(iconSource, function (response) {
        var inlineContent = response.data;

        if (!_isSvgType) {
          inlineContent = '<style>' + inlineContent + '</sctyle>';
        }

        RplusFns.injectHTML(inlineContent);
        localStorage.setItem(_type, inlineContent);
      });
    }
  };

  var initIcons = function () {
    RplusFns.ready(function () {
      if (RplusFns.hasClass(document.documentElement, 'inlinesvg')) {
        injectInline('svg');
      } else {
        injectInline('png');
      }
    });
  };

  initIcons();
});
