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
            setTimeout(inBattle, 800);
            break;
        case 'toResult': 
            setTimeout(function() {
                chrome.tabs.update({url: msg.url});
            }, 800);
            break;  
        case 'resultPage':
            setTimeout(inBattle, 50);
        	break;
    }
});
