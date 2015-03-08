'use strict';

var RplusFns = window.RplusFns || {};

RplusFns.removeClass = function (_el, _className) {
  var _classReg = new RegExp('\\b' + _className + '\\b', 'g');
  _el.className = _el.className.replace(_classReg, '');
};

RplusFns.imageMIMEType = {
  jpg: 'image/jpg',
  png: 'image/png',
  svg: 'image/svg+xml'
};

RplusFns.loadImage = function (_img) {
  var _imageSrc = RplusFns.getFallbackAttr(_img, 'src');
  var ext = _imageSrc.split('.').reverse()[0];

  // ref: http://stackoverflow.com/a/8022521
  var xhr = new XMLHttpRequest();
  xhr.open('GET', _imageSrc, true);


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

      var img = document.createElement('img');
      img.src = 'data:' + RplusFns.imageMIMEType[ext] + ';base64,' + base64;
      img.className = RplusFns.getFallbackAttr(_img, 'class');
      img.alt = RplusFns.getFallbackAttr(_img, 'alt');
      _img.parentNode.insertBefore(img, _img);
    }
  };

  xhr.send();
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
    _link.addEventListener('load', function () {
      shwoWFText();
      clearTimeout(webfontLoaderTimeout);
    });
    document.body.insertBefore(_link, document.body.childNodes[0]);
  })();

  // init svg icons
  (function initIcons() {
    if (RplusFns.hasClass(document.documentElement, 'inlinesvg')) {
      RplusFns.injectInline('./images/inject-svg/svgstore.svg');
    } else {
      RplusFns.injectInline( RplusFns.getFallbackAttr(document.getElementById('js-icons-fallback')) );
    }
  })();

  // load avarter image
  RplusFns.loadImage(document.getElementById('js-avater-image'));
});
