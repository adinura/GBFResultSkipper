var supporterUrl;

function inBattle(){
	chrome.tabs.update({url: supporterUrl});
}

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
    switch(msg.type) {
        case 'supporterPage':
            supporterUrl = msg.url;
            break;
        case 'inStage':
            inBattle();
            break;
        case 'toResult': 
            chrome.tabs.update({url: msg.url});
            break;  
        case 'resultPage':
        		inBattle();
        		break;
    }
});
