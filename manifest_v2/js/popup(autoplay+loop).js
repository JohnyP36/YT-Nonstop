window.onload = () => {
    document.getElementById("disableAutoplayCheckbox").addEventListener("click", function(event) {
        //native html input element toggles on click
        setAutoTubeListeners("autoSkip")
    });

    document.getElementById("loopButton").addEventListener("click", function(event) {
        document.getElementById("loopButton").toggleAttribute("active");
        setAutoTubeListeners("autoLoop")
    });

    document.getElementById("clickButton").addEventListener("click", function(event) {
        document.getElementById("clickButton").toggleAttribute("active");
        setAutoTubeListeners("autoClick")
    });

    setSettings([
        {key:"autoSkip", cb:setAutoSkip},
        {key:"autoLoop", cb:setAutoLoop},
        {key:"autoClick", cb:setAutoClick}
    ]);
}; //end window.onload

//helpers
function setSettings(buttons) {
    chrome.storage.sync.get(null, function(data) {
        const setButtons={};
        buttons.forEach( ({key, cb}) => {
            if(data===undefined || data[key]===undefined || data[key]===null) {
                setButtons.key = cb(true)
            }
            else if(!data[key]) {
                cb(false)
            }
            else {
                cb(true)
            }
        });
        //update items if they were undefined or null
        Object.keys(setButtons).length > 0 && chrome.storage.sync.set(setButtons, function() {} )
    })
}

function setAutoTubeListeners(key) {
    const value = {
        autoSkip:document.getElementById("disableAutoplayCheckbox").checked,
        autoLoop:document.getElementById("loopButton").hasAttribute("active"),
        autoClick:document.getElementById("clickButton").hasAttribute("active")
    }[key];

    chrome.tabs.query( {
        url:["*://www.youtube.com/*","*://music.youtube.com/*","*://m.youtube.com/*"]
    }, tabs => {
        for(let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, {[key]:value})
        }
    });

    chrome.storage.sync.set({[key]:value})
}

function setAutoLoop(status) { return document.getElementById("loopButton").toggleAttribute("active", status) }
function setAutoSkip(status) { return document.getElementById("disableAutoplayCheckbox").toggleAttribute("checked", status) }
function setAutoClick(status) { return document.getElementById("clickButton").toggleAttribute("active", status) }

document.getElementById("version").append(`${chrome.runtime.getManifest().version}`)