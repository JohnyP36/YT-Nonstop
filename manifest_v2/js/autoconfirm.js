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

    // 1. Method: Set last time active all 15 minutes to now | Does probably not help
    setTimeout(function(){window._lact = Date.now();log('Active Time Reset');}, 15000) //after 15 sec.
    setInterval(function(){window._lact = Date.now();log('Active Time Reset');}, 900000)

  } +
  ')();';

console.log(`[YT Nonstop v${chrome.runtime.getManifest().version}]`);

var script = document.createElement('script');
script.textContent = ynsInjection;
(document.head || document.documentElement).appendChild(script);
script.remove();
