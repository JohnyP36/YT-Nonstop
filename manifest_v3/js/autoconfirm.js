// Variables
let target = ["YT-CONFIRM-DIALOG-RENDERER"];

// custom quick functions
function log(text){console.log(text);}
function close(b){b.click(); console.log("We closed: ", b);}


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
  }



// 1. Method: Set last time active all 15 minutes to now | Does probably not help
setInterval(() => window._lact = Date.now(), 900000);
log("Set interval was executed!")


// 2. Method: Look for autoplay which gets dynamicially created
const settings = { childList: true, subtree: true };
const documentTarget = document.documentElement;

const callback = function(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.target.nodeName === target[0]) {
      log("Youtube Confirm Dialog Renderer was added to the page and get's now closed!");
      let a = document.getElementsByClassName("ytp-autonav-toggle-button-container")[0];
      let b = a.getElementsByClassName("ytp-autonav-toggle-button")[0];
      close(b);
    }
  }
}

const observer = new MutationObserver(callback);
observer.observe(documentTarget, settings);

// 3. Method: If autoplay is already on/off turn it off/on
if (document.getElementsByClassName("ytp-autonav-toggle-button-container")[0].getElementsByClassName("ytp-autonav-toggle-button")[1]) 
click(document.getElementsByClassName("ytp-autonav-toggle-button-container")[0].getElementsByTagName("ytp-autonav-toggle-button")[1]);


console.log(`[YT Nonstop v${chrome.runtime.getManifest().version}]`);