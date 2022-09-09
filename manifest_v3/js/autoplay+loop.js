function injectScript(YTNonstop, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var init = document.createElement("script");
    var run = document.createElement("script");

    init.setAttribute("type","text/javascript");
    run.setAttribute("type","text/javascript");

    init.append(`YTNonstop = ${YTNonstop}()`);
    node.appendChild(init);

    run.append("Nonstop = YTNonstop = new YTNonstop();");
    node.appendChild(run);

    init.remove()
}

let YTNonstop = function YTNonstop(options) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const Nonstop = {
        _autoSkip: null,
        _autoLoop: null,
        getIsAutoSkip: function(){return Nonstop._autoSkip},
        getIsAutoLoop: function(){return Nonstop._autoLoop},
        setAutoSkip: function(value){return Nonstop._autoSkip = value},
        setAutoLoop: function(value){return Nonstop._autoLoop = value},
    };

     /**
     * .getPlayerState():
     *  -1 – unstarted
     *  0 – ended
     *  1 – playing
     *  2 – paused
     *  3 – buffering
     *  5 – video cued
    */
    const get_YT={
        player: () => document.getElementById("movie_player"),
        loop: {
            button: () => playlistActionMenu()[1],
            status: function() {
                return get_YT.loop.button() ? JSON.parse(get_YT.loop.button().getAttribute("aria-pressed")) : undefined
            }
        }
    };
    function playlistActionMenu() {
        return[...document.querySelectorAll('div[id="playlist-action-menu"] button[aria-label="Playlist herhalen"], button[aria-label="Loop playlist"]')].filter(f => f.id == "button")
    }
    
    const AutoPlay = () => {
        if(Nonstop.getIsAutoSkip() == true && get_YT.player().getPlayerState() === 0) {
            get_YT.player().setAutonav(true);

            const Index = get_YT.player().getPlaylistIndex();
            const Playlist = get_YT.player().getPlaylist();

            // handle videos that are not in a playlist; skip to the next video
            if (Playlist === null || Playlist === undefined) {
                return get_YT.player().nextVideo()
            }
            if (Nonstop.getIsAutoLoop()) {
                const PlayAt = playList.length - 1 == currentIndex ? 0 : currentIndex + 1; // Go to the first video on the list if currently playing the last video on the list
                get_YT.player().playVideoAt(PlayAt);
                return
            } else {
                PlayList.length -1 == Index ? get_YT.player().nextVideo() : get_YT.player().playVideoAt(Index + 1)
            }
        }
        else {
            get_YT.player().setAutonav(false)
        }
    };

    // if paused ---> unpause
    const Play = p => {
        if(get_YT.player().getPlayerState() === 2) {
            p.click();
            get_YT.player().playVideo();

            //remove popup
            document.getElementsByTagName("ytd-popup-container")[0] && document.getElementsByTagName("ytd-popup-container")[0].remove();
            document.getElementsByTagName("ytmusic-popup-container")[0] && document.getElementsByTagName("ytmusic-popup-container")[0].remove();
        }
    };
    function Run() {
        const Play_Pause = {
            getButton:window.document.getElementsByClassName("ytp-play-button ytp-button")[0] || window.document.getElementById("play-pause-button"),
            config: {
                attributes:true,
                childList:true,
                subtree:true
            },
            callback: (MutationList, Observer) => {
                // check if mutationList has the 'attributes' type
                if(MutationList.some(t => t.type === "attributes")) {
                    // get "you there?" popup
                    const p = window.document.getElementById("confirm-button") || window.document.getElementsByClassName('ytmusic-you-there-renderer')[2] || undefined;
                    if(p){
                        Play(p);
                    }
                    else{
                        AutoPlay();
                    }
                }
            }
        };
        
        const Settings = {
            setInterval: setInterval(() => {
                if (window.location.href.indexOf("/watch") == -1) return;
                try {
                    //set play button observer
                    const pb_Observer = new MutationObserver(Play_Pause.callback);
                        pb_Observer.observe(Play_Pause.getButton, Play_Pause.config);
                    Settings.setLoop();
                    clearInterval(Settings.setInterval)
                }
                catch(t) {
                    window.location.reload();
                }
            }, 1000),

            setLoop: function() {
                if(get_YT.loop.button() && Nonstop.getIsAutoLoop() && !get_YT.loop.status()) {
                    get_YT.loop.button().click()
                }
            }
        };
    
        setInterval(() => {
            yt.util && yt.util.activity && yt.util.activity.setTimestamp();
            Settings.setLoop()
        }, 5000);
    
        return Nonstop
    }
    
    //exposing functions
    function _getSkip() {return Nonstop.getIsAutoSkip()}
    function _getLoop() {return Nonstop.getIsAutoLoop()}
    function _get_YT() {return get_YT}
    function YTNonstop(){
        this.isAutoSkip = _getSkip;
        this.isAutoLoop = _getLoop;
        this.get_yt = _get_YT;
        Run()
    }
    
    //private functions
    const eventHandler = (key, value) => {
        switch(key) {
            case"autoSkip": Nonstop.setAutoSkip(value);
              break;
            case"autoLoop": Nonstop.setAutoLoop(value);
            if(value !== get_YT.loop.status()) 
                get_YT.loop.button() && get_YT.loop.button().click();
              break
        }
    };
    addEventListener("message",(function(data) {
            for(key in data.data) {
                eventHandler(key, data.data[key])
            }
        }
    ));
    return YTNonstop
};
injectScript(YTNonstop,"html"); //If you remove this line, the whole script will stop working
