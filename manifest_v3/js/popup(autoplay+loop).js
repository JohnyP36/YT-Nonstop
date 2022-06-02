window.onload=()=>
  {
    document.getElementById("disableAutoplayCheckbox").addEventListener
      (
        "click",
        (
          function(t)
            {
              setAutoTubeListeners("autoSkip")
            }
        )
      );
    document.getElementById("loopButton").addEventListener
      (
        "click",
        (
          function(t)
            {
              document.getElementById("loopButton").toggleAttribute("active");
              setAutoTubeListeners("autoLoop")
            }
        )
      );
    setSettings([{key:"autoSkip",cb:setAutoSkip},{key:"autoLoop",cb:setAutoLoop}]);
    function setSettings(t)
      {
        chrome.storage.sync.get
          (
            null,
            (
              function(e)
                {
                  const o={};
                  t.forEach
                    (
                      ({key:t,cb:n})=>
                        {
                          if(e===undefined||e[t]===undefined||e[t]===null){o.key=n(true)}
                          else if(!e[t]){n(false)}
                          else{n(true)}
                        }
                    );
                  Object.keys(o).length>0&&chrome.storage.sync.set(o,(function(){}))
                }
            )
          )
      }
    function setAutoTubeListeners(t)
      {
        const e=
          {
            autoSkip:document.getElementById("disableAutoplayCheckbox").checked,
            autoLoop:document.getElementById("loopButton").hasAttribute("active")
          }[t];
        chrome.tabs.query
          (
            {url:["https://www.youtube.com/*","https://music.youtube.com/*","https://m.youtube.com/*"]},
            o=>
              {
                for(let n of o)
                {
                  console.log(n,{[t]:e});
                  chrome.tabs.sendMessage(n.id,{[t]:e})
                }
              }
          );
        chrome.storage.sync.set({[t]:e})
      }
    function setAutoLoop(t){return document.getElementById("loopButton").toggleAttribute("active",t)}
    function setAutoSkip(t){return document.getElementById("disableAutoplayCheckbox").toggleAttribute("checked",t)}
    document.getElementById("version").append(`${chrome.runtime.getManifest().version}`)
  }

