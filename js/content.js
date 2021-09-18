const supportUrl = "http://game.granbluefantasy.jp/#quest/supporter";

function urlCopy() {
    if(window.location.href.search("supporter") > 0){
        chrome.runtime.sendMessage({
            "type": "supporterPage",
            "url": window.location.href
        });
    }
    else if(window.location.href.startsWith("http://game.granbluefantasy.jp/#raid")){
        var totalStage = document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].lastElementChild.className;                   
        if(document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].firstElementChild.className === totalStage){
            chrome.runtime.sendMessage({
                "type": "toResult",
                "url": window.location.href.replace("raid", "result")
            });
        }
        else{ 
            chrome.runtime.sendMessage({
                "type": "inStage"
            });
        }
    }
    else if (window.location.href.startsWith("http://game.granbluefantasy.jp/#result")) {                   
        chrome.runtime.sendMessage({
            "type": "resultPage"
        });
    }
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Home') {
        urlCopy();
    }
});
