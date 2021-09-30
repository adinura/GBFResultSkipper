var supporterUrl;
var tabId;

function inBattle(){
	chrome.tabs.update(tabId, {url: supporterUrl});
}

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
    switch(msg.type) {
        case 'supporterPage':
            supporterUrl = msg.url;
            chrome.tabs.query({pinned: true}, function (tabs) {
                tabId = tabs[0].id;
            });
            break;
        case 'inStage':
            setTimeout(inBattle, 800);
            break;
        case 'toResult': 
            setTimeout(function() {
                chrome.tabs.update(tabId, {url: msg.url});
            }, 800);
            break;  
        case 'resultPage':
            setTimeout(inBattle, 50);
        	break;
    }
});
