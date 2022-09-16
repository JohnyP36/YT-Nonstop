"use strict";chrome.runtime.onInstalled.addListener((function()
             {chrome.tabs.query({url:["https://www.youtube.com/*","https://m.youtube.com/*"]},
                                t=>{for(let o of t){console.log(o);chrome.tabs.reload(o.id)}})}));
