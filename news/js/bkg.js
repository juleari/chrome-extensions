(function(){
    window.news = new News();
    
    var addPopup = function(){
        chrome.browserAction.setPopup({popup: 'index.html'});
    }

    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(name) {
            news.port = port;
            if (name == 'load'){
                news.pool(1);
            }
        });

        port.onDisconnect.addListener(function() {
        	setTimeout(addPopup, 150);
        });
    });
})();