var ynsInjection =
  '(' +
  function () {
    const tag = '[YT Nonstop]';

    function log(message) {
      console.log(`${tag}[${getTimestamp()}] ${message}`);
    }

    function getTimestamp() {
      let dt = new Date();
      let time = asDoubleDigit(dt.getHours()) + ':' + asDoubleDigit(dt.getMinutes()) + ':' + asDoubleDigit(dt.getSeconds());
      return time;
    }
    
    function asDoubleDigit(value) {
      return value < 10 ? '0' + value : value;
    }
    
    
    // 1. Method: Set last time active all 15 minutes to now | Does probably not help
    setTimeout(function(){window._lact = Date.now();log('Active Time Reset');}, 15000) //after 15 sec.
    setInterval(function(){window._lact = Date.now();log('Active Time Reset');}, 900000)

    
    //2. Method: Looks for popup and close it (only works if tab is active or when playing 'Picture-in-Picture').
    const isYoutubeMusic = window.location.hostname === 'music.youtube.com';
    const popupEventNodename = isYoutubeMusic ? 'YTMUSIC-YOU-THERE-RENDERER' : 'YT-CONFIRM-DIALOG-RENDERER';  //the element that contains the confirm dialog
    const popupContainer = isYoutubeMusic ? 'ytmusic-popup-container' : 'ytd-popup-container';
    let videoElement = document.querySelector('video');

    const appName = isYoutubeMusic ? 'ytmusic-app' : 'ytd-app';

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let appObserver = null;

    const idleTimeoutMillis = 5000;
    let lastInteractionTime = new Date().getTime();

    function getIdleTime() {
      return new Date().getTime() - lastInteractionTime;
    }

    function isIdle() {
      return getIdleTime() >= idleTimeoutMillis;
    }

    function listenForPopupEvent() {
      document.addEventListener('yt-popup-opened', (e) => {
        if (isIdle() && e.detail.nodeName === popupEventNodename) {
          log('YouTube Confirm Popup has been closed');
          document.querySelector(popupContainer).handleClosePopupAction_();
//        pauseVideo();
          videoElement.play();
        }
      });
    }

    listenForPopupEvent();
  } +
  ')();';

console.log(`[YT Nonstop v${chrome.runtime.getManifest().version}]`);

var script = document.createElement('script');
script.textContent = ynsInjection;
(document.head || document.documentElement).appendChild(script);
script.remove();
