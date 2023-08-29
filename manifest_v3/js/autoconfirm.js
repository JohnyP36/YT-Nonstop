const tag = '[YT Nonstop]';

function log(message) {
  console.log(`${tag} ${getTimestamp()} | ${message}`);
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
setTimeout( function() { window._lact = Date.now(); log('Active Time Reset'); }, 15000)  //after 15 sec.
setInterval( function() { window._lact = Date.now(); log('Active Time Reset'); }, 900000)


//2. Method: Looks for popup and close it (only works if tab is active or when playing 'Picture-in-Picture').
const isYTMusic = window.location.hostname === 'music.youtube.com';
const appName = isYTMusic ? 'ytmusic-app' : 'ytd-app';
const popupEventNodename = isYTMusic ? 'YTMUSIC-YOU-THERE-RENDERER' : 'YT-CONFIRM-DIALOG-RENDERER';  //the element that contains the confirm dialog
const popupContainer = isYTMusic ? 'ytmusic-popup-container' : 'ytd-popup-container';
let videoElement = document.querySelector('video');

function listenForPopupEvent() {
  document.addEventListener('yt-popup-opened', (e) => {
    if (e.detail.nodeName === popupEventNodename && isYTMusic) {
      log('YouTube Confirm Popup has been closed and video starts playing again');
      document.querySelector(popupContainer).handleClosePopupAction_();
      videoElement.pause();
      videoElement.play();
    }
  });
}

listenForPopupEvent();
