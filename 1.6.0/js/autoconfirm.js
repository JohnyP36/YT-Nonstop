var ynsInjection =
  '(' +
  function () {
    const tag = '[YT Nonstop]';
    const isYoutubeMusic = window.location.hostname === 'music.youtube.com';

    function log(message) {
      console.log(`${tag}[${getTimestamp()}] ${message}`);
    }

    function asDoubleDigit(value) {
      return value < 10 ? '0' + value : value;
    }

    function getTimestamp() {
      let dt = new Date();
      let time = asDoubleDigit(dt.getHours()) + ':' + asDoubleDigit(dt.getMinutes()) + ':' + asDoubleDigit(dt.getSeconds());
      return time;
    }

    setInterval(() => window._lact = Date.now(), 900000);
      log('Active Time Reset');

  } +
  ')();';

console.log(`[YT Nonstop v${chrome.runtime.getManifest().version}]`);

var script = document.createElement('script');
script.textContent = ynsInjection;
(document.head || document.documentElement).appendChild(script);
script.remove();
