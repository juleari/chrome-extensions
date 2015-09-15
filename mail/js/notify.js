var Notify = function(mess){
    this.html = webkitNotifications.createNotification(
        'icons/mail48.png',
        this.getText(mess),
        this.topic()
    );

    this.html.onclick = function () {
        chrome.tabs.create({url: mail.mess[0].url});
        mail.notification.openMessage();
    }
}

Notify.prototype = {
    getLocale: function(){
        return chrome.i18n.getMessage("@@ui_locale");
    },

    getTitle: function(){
        return chrome.i18n.getMessage("title");
    },

    getText: function (newMessage) {
        var notice,
            messages,
            lang = this.getLocale();

        if (lang == 'ru'){
            /*всплывающее окошко*/
            notice = newMessage;
            
            messages = newMessage;

            while (messages > 100){
                messages = messages % 10;
            }
            if (messages >= 21){
                messages = messages % 10;
            }

            if (messages == 1){
                notice += chrome.i18n.getMessage("finish1");
            } else if (messages <= 4){
                notice += chrome.i18n.getMessage("finish2");
            } else {
                notice += chrome.i18n.getMessage("finish3");
            }
        } else {
            notice = chrome.i18n.getMessage("start") + newMessage + chrome.i18n.getMessage("finish");
        }

        return notice
    },

    topic: function () {
        var t = mail.mess[0].topic;

        if (t) {
            if (t.length < 40){
                return t
            } else {
                return (t.substr(0, 40) + '...')
            }
        } else {
            return 'без темы'
        }
    },

    show: function(){
        this.html.show();
    },
    
    close: function(){
        if (this.html){
            this.html.close();
        }
    },
    
    openMessage: function(){ 
        this.close();
        
        chrome.windows.getLastFocused(function(wind){
            chrome.windows.update(wind.id, {focused: true});
        });
    }
}