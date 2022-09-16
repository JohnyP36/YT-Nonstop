"use strict";
function ReloadYT() {
  chrome.tabs.query( {
    url:["*://www.youtube.com/*","*://music.youtube.com/*","*://m.youtube.com/*"]
  },
    tabs => { 
      for (let tab of tabs) {
        chrome.tabs.reload(tab.id)
      }
    }
  )
};

function EnablePopup() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: '^(https|http):\/\/(www|music|m)\.youtube\.com' }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
};

chrome.runtime.onInstalled.addListener(() => {
  ReloadYT();
  EnablePopup();
});
chrome.runtime.onStartup.addListener(() => {
  EnablePopup();
});
