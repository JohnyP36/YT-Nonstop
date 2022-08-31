function injectScript(t,e){
    var o=document.getElementsByTagName(e)[0];
    var n=document.createElement("script");
    var u=document.createElement("script");
    n.setAttribute("type","text/javascript");
    u.setAttribute("type","text/javascript");
    n.append(`YTNonstop = ${t}()`);
    o.appendChild(n);
    u.append("autotube = YTNonstop = new YTNonstop();");
    o.appendChild(u);
    n.remove()
}

let YTNonstop=function t(e){
    const o=window.MutationObserver||window.WebKitMutationObserver;
    const n={
        loadedAt:Date.now(),
        _autoSkip:null,
        _autoLoop:null,
        _debug:false,
        getIsAutoSkip:function(){return n._autoSkip},
        getIsAutoLoop:function(){return n._autoLoop},
        getDebug:function(){return n._debug},
        setAutoSkip:function(t){return n._autoSkip=t},
        setAutoLoop:function(t){return n._autoLoop=t},
        setDebug:function(t){return typeof t==="boolean"?n._debug=t:n._debug}
    };

    const u={
        player:()=>document.getElementById("movie_player"),
        loop:{
            button:()=>a()[1],
            status:function(){
                return u.loop.button()?JSON.parse(u.loop.button().getAttribute("aria-pressed")):undefined
            }
        }
    };
    function a(){
        return[...document.querySelectorAll('div[id="playlist-action-menu"] button[aria-label="Playlist herhalen"], button[aria-label="Loop playlist"]')].filter(t=>t.id=="button")
    }

    const l=()=>{
        if(n.getIsAutoSkip()==true&&u.player().getPlayerState()===0){
            u.player().setAutonav(true);
            const t=u.player().getPlaylistIndex();
            const e=u.player().getPlaylist();
            if(e===null||e===undefined){
                return u.player().nextVideo()
            }
            if(n.getIsAutoLoop()){
                const o=()=>{
                    const n=Math.abs(Math.floor(Math.random()*e.length));
                    if(n==t)return o();
                    return n
                };
                u.player().playVideoAt(o());
                return
            }
            else{
                e.length-1==t?u.player().nextVideo():u.player().playVideoAt(t+1)
            }
        }
        else{
            u.player().setAutonav(false)
        }
    };

    const s=()=>!!document.fullscreenElement;
    const c=t=>{
        if(u.player().getPlayerState()===2){
            t.click();
            u.player().playVideo();
            document.getElementsByTagName("ytd-popup-container")[0]&&document.getElementsByTagName("ytd-popup-container")[0].remove();
            document.getElementsByTagName("ytmusic-popup-container")[0]&&document.getElementsByTagName("ytmusic-popup-container")[0].remove();
                if(n.getDebug()===true)console.log("Clicked popup container")
        }
    };
    function d(){
        const t={
            getButton:window.document.getElementsByClassName("ytp-play-button ytp-button")[0]||window.document.getElementById("play-pause-button"),
            config:{
                attributes:true,
                childList:true,
                subtree:true
            },
            callback:(t,e)=>{
                if(t.some(t=>t.type==="attributes")){
                    const t=window.document.getElementById("confirm-button")||undefined;
                    if(t){
                        c(t);
                            if(n.getDebug()==true)console.log("Clicked confirm button")
                    }
                    else{
                        l();
                            if(n.getDebug()==true)console.log("Didn't click confirm button")
                    }
                }
            }
        };

    const A=(t,e)=>{
        switch(t){
            case"autoSkip":n.setAutoSkip(e);
                break;
            case"autoLoop":n.setAutoLoop(e);
            if(e!==u.loop.status())u.loop.button()&&u.loop.button().click();
                break
        }
    };

    addEventListener("message",(
        function(t){
            for(key in t.data){
                A(key,t.data[key])
            }
        }
    ));
    return t
};
injectScript(YTNonstop,"html");
