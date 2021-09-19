const supportUrl = "http://game.granbluefantasy.jp/#quest/supporter";
const configCheckUrl = { childList: true };
const configCheckInBattle = { attributes: true, childList: true, subtree: true };
var observerUrl; 
var observerAttackButton; 
var observerBattle;
var changeUrl = false;

function battleCheck(){
    if(window.location.href.startsWith("http://game.granbluefantasy.jp/#raid") && document.getElementById("mobage-game-container").getElementsByClassName("btn-auto").length > 0 && document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].lastElementChild !== null && changeUrl === true){
        var totalStage = document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].lastElementChild.className;                   
        if(document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].firstElementChild.className === totalStage && document.getElementById("mobage-game-container").getElementsByClassName("btn-auto")[0].getAttribute("style") === "display: block;"){
            chrome.runtime.sendMessage({
                "type": "toResult",
                "url": window.location.href.replace("raid", "result")
            });
            observerUrl.observe(document.head, configCheckUrl);
        }
        else if(document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].firstElementChild.className !== totalStage && document.getElementById("mobage-game-container").getElementsByClassName("btn-auto")[0].getAttribute("style") === "display: block;"){ 
            chrome.runtime.sendMessage({
                "type": "inStage"
            });
            observerUrl.observe(document.head, configCheckUrl);
        }
        changeUrl = false;
    }
}

const callbackBattle = function(mutationsList, observer) {
    if(document.getElementById("mobage-game-container").getElementsByClassName("btn-auto").length > 0){
        if(document.getElementById("mobage-game-container").getElementsByClassName("btn-auto")[0].getAttribute("style") === "display: block;"){
            changeUrl = true;
            observerBattle.disconnect();
            battleCheck();
        }
    } 
};

const attackButton = function(mutationsList, observer) {
    if(document.getElementById("mobage-game-container") !== null){
        observerAttackButton.disconnect();
        observerBattle = new MutationObserver(callbackBattle);
        observerBattle.observe(document.getElementById("mobage-game-container"), configCheckInBattle);
    }
};

function urlCopy() {
    console.log("urlCopy");
    if(window.location.href.search("supporter") > 0){
        chrome.runtime.sendMessage({
            "type": "supporterPage",
            "url": window.location.href
        });
    }
    else if (window.location.href.startsWith("http://game.granbluefantasy.jp/#raid")) {                   
        observerAttackButton = new MutationObserver(attackButton);
        observerAttackButton.observe(document.body, configCheckInBattle);
        observerUrl.disconnect();
    }
    else if (window.location.href.startsWith("http://game.granbluefantasy.jp/#result") && document.getElementById("cnt-result") !== null) {                   
        chrome.runtime.sendMessage({
            "type": "resultPage"
        });
    }
}

const callback = function(mutationsList, observer) {
    urlCopy();
};

observerUrl = new MutationObserver(callback);
observerUrl.observe(document.head, configCheckUrl);