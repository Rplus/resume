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

RplusFns.injectImg = function (_imgInfo) {
  var img = document.createElement('img');
  img.className = _imgInfo.className;
  img.alt = _imgInfo.alt;
  img.src = _imgInfo.dataURL;
  // img.src = 'data:' + imageMIMEType[ext] + ';base64,' + _imgInfo.data_base64;
  _imgInfo.el.parentNode.insertBefore(img, _imgInfo.el);
};

RplusFns.getImage = function (_imgInfo, cb) {
  // ref: http://stackoverflow.com/a/8022521
  var xhr = new XMLHttpRequest();
  xhr.open('GET', _imgInfo.src, true);
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

      _imgInfo.dataURL = 'data:' + RplusFns.imageMIMEType[_imgInfo.ext] + ';base64,' + base64;
      // cache data in localStorage
      localStorage.setItem(_imgInfo.localItem, _imgInfo.dataURL);

      cb(_imgInfo);
    }
  };

  xhr.send();
};

RplusFns.loadImage = function (_img) {

  var _imgInfo = (function (_info) {
    _info.el = _img;
    _info.src = RplusFns.getFallbackAttr(_img, 'src');
    _info.localItem = _info.src.split('/').reverse()[0];
    _info.ext = _info.localItem.split('.').reverse()[0];
    _info.alt = RplusFns.getFallbackAttr(_img, 'alt');
    _info.className = RplusFns.getFallbackAttr(_img, 'class');
    _info.dataURL = localStorage.getItem(_info.localItem);

    return _info;
  })({});

  if (_imgInfo.dataURL) {
    RplusFns.injectImg(_imgInfo);
  } else {
    RplusFns.getImage(_imgInfo, RplusFns.injectImg);
  }
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

  // load nickname svg
  RplusFns.loadImage(document.getElementById('js-svg-avatar'));
});
