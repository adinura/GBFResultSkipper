const supportUrl = "http://game.granbluefantasy.jp/#quest/supporter";
const configCheckUrl = { childList: true };
const configCheckInBattle = { attributes: true, childList: true, subtree: true };
var observerUrl; 
var observerAttackButton; 
var observerBattle;
var changeUrl = false;
var saveUrl = false;
var goToResult = false;

function battleCheck(){
    if(window.location.href.startsWith("http://game.granbluefantasy.jp/#raid/") && document.getElementById("mobage-game-container").getElementsByClassName("btn-auto").length > 0 && document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].lastElementChild !== null && changeUrl === true){
        var totalStage = document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].lastElementChild.className;                   
        if(document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].firstElementChild.className === totalStage && document.getElementById("mobage-game-container").getElementsByClassName("btn-auto")[0].getAttribute("style") === "display: block;"){
            observerUrl.observe(document.head, configCheckUrl);
            goToResult = true;
            chrome.runtime.sendMessage({
                "type": "toResult",
                "url": window.location.href.replace("raid", "result")
            });
        }
        else if(document.getElementById("prt-wave-num").getElementsByClassName("txt-info-num")[0].firstElementChild.className !== totalStage && document.getElementById("mobage-game-container").getElementsByClassName("btn-auto")[0].getAttribute("style") === "display: block;"){ 
            observerUrl.observe(document.head, configCheckUrl);
            chrome.runtime.sendMessage({
                "type": "inStage"
            });    
        }
        changeUrl = false;
        
    }
    else if(window.location.href.startsWith("http://game.granbluefantasy.jp/#raid_multi/") && document.getElementById("mobage-game-container").getElementsByClassName("btn-auto").length > 0 && changeUrl === true){                  
        if(document.getElementById("mobage-game-container").getElementsByClassName("btn-auto")[0].getAttribute("style") === "display: block;"){
            observerUrl.observe(document.head, configCheckUrl);
            changeUrl = false;
            goToResult = true;
            chrome.runtime.sendMessage({
                "type": "toResult",
                "url": window.location.href.replace("raid", "result")
            });
        }
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
    if(window.location.href.search("supporter") > 0 && saveUrl === false){
        chrome.runtime.sendMessage({
            "type": "supporterPage",
            "url": window.location.href
        });
        saveUrl = true;
        goToResult = false;
    }
    else if (window.location.href.startsWith("http://game.granbluefantasy.jp/#raid") && goToResult === false) {                   
        observerAttackButton = new MutationObserver(attackButton);
        observerAttackButton.observe(document.body, configCheckInBattle);
        observerUrl.disconnect(); 
    }
    else if (window.location.href.search("result") > 0 && document.getElementById("cnt-result") !== null && goToResult === true) {       
        chrome.runtime.sendMessage({
            "type": "resultPage"
        });
        saveUrl = false;
    }
}

const callback = function(mutationsList, observer) {
    urlCopy();
};

observerUrl = new MutationObserver(callback);
observerUrl.observe(document.head, configCheckUrl);