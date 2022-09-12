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
        player: () => document.getElementById("movie_player") || document.getElementById("player"),
        loop: {
            button: () => playlistLoop()[0],
 //           status: function() {
 //               return get_YT.loop.button() ? JSON.parse(get_YT.loop.button().getAttribute("aria-pressed")) : undefined
 //           }
        }
    };
    function playlistLoop() {
        return[...document.querySelectorAll('div[id="playlist-action-menu"] ytd-playlist-loop-button-renderer button[aria-label]')].filter(f => f.id == "button")
    }
    
     //if video ended ---> skip to next video 
    const AutoPlay = () => {
        if(Nonstop.getIsAutoSkip() == true && get_YT.player().getPlayerState() === 0) {
            get_YT.player().setAutonav(true);

            const Index = get_YT.player().getPlaylistIndex();
            const Playlist = get_YT.player().getPlaylist();

//            const Loop = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d="M20,14h2v5L5.84,19.02l1.77,1.77l-1.41,1.41L1.99,18l4.21-4.21l1.41,1.41l-1.82,1.82L20,17V14z M4,7l14.21-0.02l-1.82,1.82 l1.41,1.41L22.01,6l-4.21-4.21l-1.41,1.41l1.77,1.77L2,5v6h2V7z"]');
            const Shuffle = document.querySelector('#playlist-action-menu ytd-toggle-button-renderer #button[aria-label][aria-pressed="true"]');

             /**
             * 1. If the video is not in a playlist ---> skip to the next video
             * 2. If the loop function is turned on in the extension popup & shuffle is turned on in YouTube ---> play a random video in the playlist
             * 3. If only the loop function is turned on in the extension popup and the last video of the playlist is playing ---> go to the 1st video
             * 4. If only the shuffle is turned on in YouTube ---> don't autoplay to a video outside the playlist if currently playing the last video
             * 5. If the loop function is turned off in the extension popup ---> autoplay to the next video if the last video in the playlist is playing 
             * If all above is not true AND/OR autoplay is turned off in the extension ---> don't autoplay to next video
            */

            if (Playlist === null || Playlist === undefined) {
                return get_YT.player().nextVideo()
            } 
            if ( (Nonstop.getIsAutoLoop() && Shuffle) || Shuffle) { 
//                const getRandomNum = () => {
//                    const rn = Math.abs(Math.floor(Math.random() * Playlist.length));
//                    if (rn == Index) return getRandomNum();
//                    return rn;
//                };
//                get_YT.player().playVideoAt(getRandomNum());
                return;
            } else 
            if (Nonstop.getIsAutoLoop()) {
                const PlayAt = Playlist.length - 1 == Index ? 0 : Index + 1;  //go to the first video on the list if currently playing the last video on the list
                get_YT.player().playVideoAt(PlayAt);
                return;
//            } else 
//            if (Shuffle) { 
//                return get_YT.player().setAutonav(false);
            } else {
                Playlist.length -1 == Index 
                    ? get_YT.player().nextVideo() 
                    : get_YT.player().playVideoAt(Index + 1)
            }
        }

        else {
            get_YT.player().setAutonav(false)
        }
    };

     //if paused ---> unpause
    const Play = p => {
        if(get_YT.player().getPlayerState() === 2) {
            p.click();
            get_YT.player().playVideo();
            console.log('Clicked to unpause video');
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
                 //check if mutationList has the 'attributes' type
                if(MutationList.some(el => el.type === "attributes")) {
                     //get "you there?" popup
                    const p = window.document.getElementById("confirm-button") || window.document.getElementsByClassName('ytmusic-you-there-renderer')[2] || undefined;
                    if(p) {
                        Play(p);
                        console.log('Popup gets closed and video will start playing again'); 
                    }
                    else {
                        AutoPlay();
                    }
                }
            }
        };
        
        const Settings = {
            setInterval: setInterval(() => {
                if (window.location.href.indexOf("/watch") == -1) return;
                
                     //set play button observer
                    const pb_Observer = new MutationObserver(Play_Pause.callback);
                      pb_Observer.observe(Play_Pause.getButton, Play_Pause.config);
                
                     //set autonav button
                    Settings.setAutonav(); 
        
                     //set loop button
                    Settings.setLoop();
        
                    clearInterval(Settings.setInterval)
            }, 1000),
              
            setAutonav: function() {
                const on = document.querySelector('.ytp-autonav-toggle-button-container > .ytp-autonav-toggle-button[aria-checked="true"]') 
                            || document.querySelector('#automix[role="button"][aria-pressed="true"]')
                const off = document.querySelector('.ytp-autonav-toggle-button-container > .ytp-autonav-toggle-button[aria-checked="false"]') 
                            || document.querySelector('#automix[role="button"][aria-pressed="false"]')
        
                if (Nonstop.getIsAutoSkip() == true) {
                    off.click();
                } else {
                    on.click();
                }
            },
            
            setLoop: function() {
                const on = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d="M20,14h2v5L5.84,19.02l1.77,1.77l-1.41,1.41L1.99,18l4.21-4.21l1.41,1.41l-1.82,1.82L20,17V14z M4,7l14.21-0.02l-1.82,1.82 l1.41,1.41L22.01,6l-4.21-4.21l-1.41,1.41l1.77,1.77L2,5v6h2V7z"]')
                const off = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d="M21,13h1v5L3.93,18.03l2.62,2.62l-0.71,0.71L1.99,17.5l3.85-3.85l0.71,0.71l-2.67,2.67L21,17V13z M3,7l17.12-0.03 l-2.67,2.67l0.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71l2.62,2.62L2,6v5h1V7z"]')
                const o1f = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d="M13,15h-1.37v-4.52l-1.3,0.38v-1L12.83,9H13V15z M20,17L5.79,17.02l1.82-1.82l-1.41-1.41L1.99,18l4.21,4.21l1.41-1.41 l-1.77-1.77L22,19v-5h-2V17z M4,7l14.21-0.02l-1.82,1.82l1.41,1.41L22.01,6l-4.21-4.21l-1.41,1.41l1.77,1.77L2,5v6h2V7z"]')
            
                if (get_YT.loop.button() && Nonstop.getIsAutoLoop() == true && off) {
                    get_YT.loop.button().click();
                } else 
                if (get_YT.loop.button() && Nonstop.getIsAutoLoop() == false && on) {
                    get_YT.loop.button().click();
                } else 
                if (get_YT.loop.button() && Nonstop.getIsAutoLoop() == false && o1f) {
                    get_YT.loop.button().click();  //this makes it impossible to loop a video if you turned 'loop playlist' off in the extension popup; you can only loop a video if 'loop playlist' is turned on
                } else {
                    return 
                }
            }
        };
        
        setInterval(() => {
            yt.util && yt.util.activity && yt.util.activity.setTimestamp();
            Settings.setLoop(); 
            Settings.setAutonav()
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
//            if(value !== get_YT.loop.status()) 
//                get_YT.loop.button() && get_YT.loop.button().click();
              break
        }
    };
    addEventListener("message", (function(data) {
            for(key in data.data) {
                eventHandler(key, data.data[key])
            }
    }));
    return YTNonstop
};
injectScript(YTNonstop,"html");  //if you remove this line, the whole script will stop working
