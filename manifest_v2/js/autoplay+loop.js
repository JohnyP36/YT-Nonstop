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
        _autoClick: null,
        getIsAutoSkip: function(){return Nonstop._autoSkip},
        getIsAutoLoop: function(){return Nonstop._autoLoop},
        getIsAutoClick: function(){return Nonstop._autoClick},
        setAutoSkip: function(value){return Nonstop._autoSkip = value},
        setAutoLoop: function(value){return Nonstop._autoLoop = value},
        setAutoClick: function(value){return Nonstop._autoClick = value},
    };
    
    const tag = '[YT Nonstop]';
    function log(message) {
      console.log(`${tag} ${getTimestamp()} | ${message}`);
    }
    function getTimestamp() {
      let dt = new Date();
      let time = asDoubleDigit(dt.getHours()) + ':' + asDoubleDigit(dt.getMinutes()) + ':' + asDoubleDigit(dt.getSeconds());
      return time;
    }
    function asDoubleDigit(value) {
     return value < 10 ? '0' + value : value;
    }
    
    // .getPlayerState(): -1 – unstarted, 0 – ended, 1 – playing, 2 – paused, 3 – buffering, 5 – video cued
    
    const get_YT={
        player: () => document.getElementById("movie_player"),
        loop: {
            button: () => playlistLoop()[0],
 //           status: function() {
 //               return get_YT.loop.button() ? JSON.parse(get_YT.loop.button().getAttribute("aria-pressed")) : undefined
 //           }
        }
    };
    function playlistLoop() {
        if (window.location.hostname === 'www.youtube.com') { 
            return[...document.querySelectorAll('div[id="playlist-action-menu"] ytd-playlist-loop-button-renderer button[aria-label]')]
        } else 
        if (window.location.hostname === 'music.youtube.com') { 
            return[...document.querySelectorAll('ytmusic-player-bar > #right-controls > div[class^="right-controls-buttons"] yt-icon-button[class^="repeat"] > button[id="button"]')]
        } else {
            return
        }
    }
     //if video ended ---> skip to next video 
    const AutoPlay = () => {
        if(Nonstop.getIsAutoSkip() == true && get_YT.player().getPlayerState() === 0) {
            get_YT.player().setAutonav(true);

            const Index = get_YT.player().getPlaylistIndex();
            const Playlist = get_YT.player().getPlaylist();

//            const Loop = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d="M20,14h2v5L5.84,19.02l1.77,1.77l-1.41,1.41L1.99,18l4.21-4.21l1.41,1.41l-1.82,1.82L20,17V14z M4,7l14.21-0.02l-1.82,1.82 l1.41,1.41L22.01,6l-4.21-4.21l-1.41,1.41l1.77,1.77L2,5v6h2V7z"]');
            const Shuffle = document.querySelector('#playlist-action-menu ytd-toggle-button-renderer #button[aria-label][aria-pressed="true"]')
			    || document.querySelector('#playlist-action-menu ytd-toggle-button-renderer button[aria-label][aria-pressed="true"]');

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
    const Autoconfirm = () => {
        const isYTMusic = window.location.hostname === 'music.youtube.com';
        const popupEventNodename = isYTMusic ? document.querySelector('YTMUSIC-YOU-THERE-RENDERER') : document.querySelector('YT-CONFIRM-DIALOG-RENDERER');
        const popupContainer = isYTMusic ? document.getElementsByTagName('ytmusic-popup-container')[0] : document.getElementsByTagName('ytd-popup-container')[0];
        const wrongPopup = isYTMusic ? undefined : document.querySelector('YT-CONFIRM-DIALOG-RENDERER #cancel-button:not([hidden])');  //make sure not wrong popup gets closed
        const hidden = isYTMusic ? undefined : document.querySelector('ytd-popup-container[class] > .ytd-popup-container[role="dialog"][style*="display: none"]')
        
        if (get_YT.player() && popupEventNodename && !wrongPopup && !hidden && !isYTMusic) {
            popupContainer.handleClosePopupAction_();
            get_YT.player().playVideo();
            log('YouTube Confirm Popup has been closed and video starts playing again');
        }
    };
    
    function Run() {
        const Play_Pause = {
            getButton:window.document.getElementsByClassName("ytp-play-button ytp-button")[0] || window.document.getElementById("play-pause-button"),
            config: { attributes:true, childList:true, subtree:true },
            callback: (MutationList, Observer) => {
                Autoconfirm();
                AutoPlay();
            }
        };
        
        const Settings = {
            setInterval: setInterval(() => {
                if (window.location.href.indexOf("/watch") == -1) return;
                try {
                    const pb_Observer = new MutationObserver(Play_Pause.callback);  //set play button observer
                          pb_Observer.observe(Play_Pause.getButton, Play_Pause.config);
                } catch(e) {
                    log('Could not find play button; page got reloaded');
                    window.location.reload();
                }
                    
                    Settings.setAutonav(); //set autonav button
                    Settings.setLoop(); //set loop button
                    Settings.setError(); //set click on 'error' message
                    
                    clearInterval(Settings.setInterval)
            }, 1000),
            
            setError: function() {
                const message = document.querySelector('#player yt-playability-error-supported-renderers[hidden]')
                const button = document.querySelector('#player #info[class*="player-error-message"] #buttons[class*="error-message"] button[aria-label]')

                if (Nonstop.getIsAutoClick() == false && get_YT.loop.button() && Nonstop.getIsAutoLoop() == true && button && !message) {
                    button.click();
                    log('Clicked on 18+ message');
                } else {
                    return;
                }
            },
            
            setAutonav: function() {
                const on = document.querySelector('.ytp-autonav-toggle-button-container > .ytp-autonav-toggle-button[aria-checked="true"]') 
                            || document.querySelector('#automix[role="button"][aria-pressed="true"]')
                const off = document.querySelector('.ytp-autonav-toggle-button-container > .ytp-autonav-toggle-button[aria-checked="false"]') 
                            || document.querySelector('#automix[role="button"][aria-pressed="false"]')
        
                if (Nonstop.getIsAutoSkip() == true && off) {
                    off.click();
                    log('Autoplay has been enabled');
                } else 
                if (Nonstop.getIsAutoSkip() == false && on) {
                    on.click();
                    log('Autoplay has been disabled');
                } else {
                    return;
                }
            },
            
            setLoop: function() {
                const on = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d^="M20,"]')
			|| document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer button[aria-label] svg path[d^="M21"]')
                           || document.querySelector('ytmusic-player-bar > #right-controls > div[class^="right-controls-buttons"] button[aria-label] svg path[d^="M21"]') //path[d^="M3"] is now M21
                const off = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d^="M21,"]')
			 || document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer button[aria-label] svg path[d^="M17"][d*="0ZM21"]')
                           || document.querySelector('ytmusic-player-bar > #right-controls > div[class^="right-controls-buttons"] button[aria-label] svg path[d^="M17"][d*="0ZM21"]') //path[d^="M3"] is now M21
                const o1f = document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer #button[aria-label] > yt-icon path[d^="M13,"]')
			 || document.querySelector('#playlist-action-menu ytd-playlist-loop-button-renderer button[aria-label] svg path[d^="M17"][d*="0ZM13"]')
                            || document.querySelector('ytmusic-player-bar > #right-controls > div[class^="right-controls-buttons"] button[aria-label] svg path[d^="M17"][d*="0ZM13"]')
                
                if (get_YT.loop.button() && Nonstop.getIsAutoLoop() == true && off) {
                    get_YT.loop.button().click();
                    log('Playlist is been looped');
                } else 
                if (get_YT.loop.button() && Nonstop.getIsAutoLoop() == false && on) {
                    get_YT.loop.button().click();
                    log('Looping of playlist has been stopped');
                } else 
                if (get_YT.loop.button() && Nonstop.getIsAutoLoop() == false && o1f) {
                    get_YT.loop.button().click();  //this makes it impossible to loop a video if you turned 'loop playlist' off in the extension popup; you can only loop a video if 'loop playlist' is turned on
                    log('Loop Video has been disabled - you can only loop a video if Loop Playlist is turned on');
                } else {
                    return 
                }
            }
        };
        
        setInterval(() => {
            yt.util && yt.util.activity && yt.util.activity.setTimestamp();
            Settings.setLoop(); 
            Settings.setAutonav();
            Settings.setError()
        }, 5000);

        return Nonstop
    }

     //exposing functions
    function _getSkip() {return Nonstop.getIsAutoSkip()}
    function _getLoop() {return Nonstop.getIsAutoLoop()}
    function _getClick() {return Nonstop.getIsAutoClick()}
    function _get_YT() {return get_YT}
    function YTNonstop(){
        this.isAutoSkip = _getSkip;
        this.isAutoLoop = _getLoop;
        this.isAutoClick = _getClick;
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
              break;
            case"autoClick": Nonstop.setAutoClick(value);
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


window.onload = event => {
  chrome.runtime.onMessage.addListener(data => {
    postMessage(data,"*")}
  );
  chrome.storage.sync.get(null, function(data) {
        data = {
          autoSkip: data.autoSkip===undefined || data.autoSkip===null ? true: JSON.parse(data.autoSkip),
          autoLoop: data.autoLoop===undefined || data.autoLoop===null ? true: JSON.parse(data.autoLoop),
          autoClick: data.autoClick===undefined || data.autoClick===null ? true: JSON.parse(data.autoClick)
        };
        postMessage(data,"*");
        injectScript(YTNonstop,"html")
      }
    )
};
