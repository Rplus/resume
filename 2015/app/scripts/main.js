'use strict';

// for webfont loader
(function() {
  window.WebFontConfig = {
    timeout: 2000,
    google: {
      families: ['Courgette'],
      text: [].map.call(document.querySelectorAll('.webfont'), function(tag) {
        return tag.textContent;
      }).join('').replace(/\s/g, '')
    }
  };

})();
