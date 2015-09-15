var ChromeMailEvent = function(){
}

ChromeMailEvent.prototype = {
    page : 'authorize.html',

    createTab : function(url){
        chrome.tabs.create({url: url});
    },
    
    setBadge : function (text) {
        chrome.browserAction.setBadgeText({text: text});
    },
    
    setPage : function() {
        chrome.browserAction.setPopup({popup: this.page});
    },

    check : function(popup) {
        if(popup) {
            window.mailEvent.setPage();
        }
    },

    setIndex : function(url) {
        this.page = 'index.html';
        chrome.browserAction.getPopup({}, this.check);
        chrome.browserAction.setBadgeBackgroundColor({color:[255, 79, 87, 255]});
        if (window.mail.unseen) {
            (window.mail.unseen > 99) ?
                this.setBadge('99+') :
                this.setBadge(window.mail.unseen.toString());
        } else {
            chrome.browserAction.setBadgeText({text: ''});
        }
    },
    
    setAuthorise: function(){
        this.page = 'authorize.html';
        chrome.browserAction.getPopup({}, this.check);
        chrome.browserAction.setBadgeBackgroundColor({color:[61,63,67, 255]});
        chrome.browserAction.setBadgeText({text: '?'});
    }
}