RplusFns.ready(function () {
  (function loadLimitedCharFont() {
    var googleFontSource = document.getElementById('js-google-font').firstChild.data.match(/href="(.+?)"/)[1];
    var googleFontUsed = document.querySelectorAll('.say-hi')[0];
    var googleFontText = (googleFontUsed.textContent || googleFontUsed.innerText).trim();
    var googleFontURL = googleFontSource + '&text=' + encodeURIComponent(googleFontText);

    // for web font load slowly, it'll add a class for showing the text
    var webfontLoaderTimeout;

    (function () {
      webfontLoaderTimeout = setTimeout(function () {
        googleFontUsed.className += ' wf-slow';
      }, 1000);
    })();

    var _link = document.createElement('link');
    _link.rel = 'stylesheet';
    _link.href = googleFontURL;
    _link.onload = function () {
      googleFontUsed.className += ' wf-loaded';
      clearTimeout(webfontLoaderTimeout);
    };
    document.body.insertBefore(_link, document.body.childNodes[0]);
  })();
});
