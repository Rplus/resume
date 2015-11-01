'use strict';

// for webfont loader
;((doc) => {
  window.WebFontConfig = {
    timeout: 2000,
    google: {
      families: ['Courgette'],
      text: [].map.call(doc.querySelectorAll('.webfont'), function(tag) {
        return tag.textContent;
      }).join('').replace(/\s/g, '')
    }
  };

  let wf = doc.createElement('script');
  let s = doc.scripts[0];
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
  s.parentNode.insertBefore(wf, s);

})(document);
