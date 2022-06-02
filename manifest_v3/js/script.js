function loadPageAccess() {
    const pageAccess = document.createElement('script');
    pageAccess.src = chrome.runtime.getURL('js/autoconfirm.js');
    pageAccess.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(pageAccess);
}


_script = document.createElement('script');
_script.setAttribute('src', chrome.runtime.getURL('js/autoplay+loop.js'));
(document.head||document.documentElement).appendChild( _script  );
_script.parentNode.removeChild( _script);

window.onload=t=>
  {
    chrome.runtime.onMessage.addListener(t=>
      {postMessage(t,"*")}
    );
    chrome.storage.sync.get
      (
        null,
        (
          function(t)
            {
              t={
                autoSkip:t.autoSkip===undefined||t.autoSkip===null?true:JSON.parse(t.autoSkip),
                autoLoop:t.autoLoop===undefined||t.autoLoop===null?true:JSON.parse(t.autoLoop)
              };
              postMessage(t,"*");
              injectScript(YTNonstop,"html")
            }
        )
      )
  };