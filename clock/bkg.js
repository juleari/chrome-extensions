(function(){
    var addPopup = function(){
        chrome.browserAction.setPopup({popup: 'popup.html'});
    }
    
    chrome.extension.onConnect.addListener(function(port){
        port.onMessage.addListener(function(obj){
            console.log(obj.time);
            setTimeout(function(){
                var notification = new Notify(obj.text || 'alarm');
                notification.show();
            }, obj.time)
        });

        port.onDisconnect.addListener(function() {
            setTimeout(addPopup, 150);
        });
    });
}());