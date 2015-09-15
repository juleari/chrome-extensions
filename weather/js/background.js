(function(){
    window.popupPort = undefined;
    window.weather = new Weather();
    
    var addPopup = function(){
        chrome.browserAction.setPopup({popup: 'index.html'});
    }

    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener(function() {
			window.weather.ajax();
            window.popupPort = new Port(port);
        });

        port.onDisconnect.addListener(function() {
            setTimeout(addPopup, 150);
        });
    });
    
    /*обновление cookies*/
    chrome.cookies.onChanged.addListener(function(cookies){
        if (cookies.cookie.name == 'geoid'){
            window.weather.ajax();
        }
    });
}());