(function(){
    window.mail = new Mail();
    
    window.mailEvent = new ChromeMailEvent();
    
    var addPopup = function(){
        window.mailEvent.setPage();
    }

    if(!localStorage['notify']){
        localStorage['notify'] = true;
    }
    
    /*обновление popup*/
    chrome.extension.onConnect.addListener(function(port){
        port.onMessage.addListener(function(){
            mail.pool(port);
        });

        port.onDisconnect.addListener(function() {
            setTimeout(addPopup, 150);
        });        
    });
    
    /*обновление cookies*/
    chrome.cookies.onChanged.addListener(function(cookies){
        if (cookies.cookie.name == 'rsid'){
            /*человек авторизировался*/
            if (cookies.cause == 'explicit') {
                mail.pool();
                window.mailEvent.setIndex();
            } else if (cookies.cause == 'expired_overwrite'){
                /*разлогинился на рамблере*/
                clearTimeout(mail.refresh);
                window.mailEvent.setAuthorise();
            }
        }
    });
}());