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

chrome.runtime.onInstalled.addListener(() => {
  ReloadYT();
});