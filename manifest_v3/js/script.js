// https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions/9517879#9517879
// or https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ib-hi7hPdW8?pli=1
var ac = document.createElement('script'); 
ac.src = chrome.runtime.getURL('js/autoconfirm.js');
ac.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(ac);

var apl = document.createElement('script'); 
apl.src = chrome.runtime.getURL('js/autoplay+loop.js');
apl.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(apl);

window.onload = event => {
  chrome.runtime.onMessage.addListener(data => {
    postMessage(data,"*")}
  );
  chrome.storage.sync.get(null, function(data) {
        data = {
          autoSkip: data.autoSkip===undefined || data.autoSkip===null ? true: JSON.parse(data.autoSkip),
          autoLoop: data.autoLoop===undefined || data.autoLoop===null ? true: JSON.parse(data.autoLoop)
        };
        postMessage(data,"*");
      }
    )
};

console.log(`[YT Nonstop v${chrome.runtime.getManifest().version}]`);
