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

window.onload=t=>{
  chrome.runtime.onMessage.addListener(t=>
    {postMessage(t,"*")}
  );
  chrome.storage.sync.get
    (null,(
      function(t){
        t={
          autoSkip:t.autoSkip===undefined||t.autoSkip===null?true:JSON.parse(t.autoSkip),
          autoLoop:t.autoLoop===undefined||t.autoLoop===null?true:JSON.parse(t.autoLoop)
        };
        postMessage(t,"*");
        injectScript(YTNonstop,"html")
      }
    ))
};

console.log(`[YT Nonstop v${chrome.runtime.getManifest().version}]`);
