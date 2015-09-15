var Mail = function(){
    this.mess = [];
    this.mbox = [];
    this.isErr = true;
    this.notification = undefined;
    this.unseen = undefined;
    this.pool();
}

Mail.prototype = {
    refresh: undefined,

    box: function(mbox){
        this.mbox = [];

        for (i = 0; i < mbox.length; i++){
            this.mbox[i] = {};
            this.mbox[i].text = mbox[i].getAttribute('text');
            this.mbox[i].url = mbox[i].getAttribute('url') + 
                '?utm_source=r02&utm_medium=distribution&utm_content=e01&utm_campaign=a25';
        }
    },
    
    messages: function(item){
        var i, j, url;
        
        this.mess = [];
        
        for (i = 0; i < item.length; i++){
            this.mess[i] = {};
            
            this.mess[i].name    = item[i].getElementsByTagName('title')[0].textContent;
            this.mess[i].topic   = item[i].getElementsByTagName('description')[0].textContent;
            this.mess[i].time    = new Date(parseInt(item[i].getElementsByTagName('pubDate')[0].textContent * 1000));
            
            url = item[i].getElementsByTagName('link')[0].textContent;
            j = url.indexOf('#');
            this.mess[i].url     = url.substr(0, j) + 
                '?utm_source=r02&utm_medium=distribution&utm_content=e01&utm_campaign=a25' + 
                url.substr(j);
            
            this.mess[i].isRead  = parseInt(item[i].getElementsByTagName('seen')[0].textContent);
            this.mess[i].isFav   = parseInt(item[i].getElementsByTagName('flagged')[0].textContent);
            this.mess[i].hasAtt  = parseInt(item[i].getElementsByTagName('attachments')[0].textContent);
            this.mess[i].id      = parseInt(item[i].getElementsByTagName('uid')[0].textContent);
        }
    },
    
    isNew: function(unread, port){
        if (unread == '0') {
            window.mailEvent.setBadge('');
            console.log(new Date())
            this.unseen = 0;
        } else {
            if (this.unseen > parseInt(unread) || this.unseen === undefined){
                this.unseen = parseInt(unread);
                
                if (localStorage['notify'] == "true" && this.notification) {
                    this.notification.close();
                }
            }
            
            if (this.unseen < parseInt(unread)){
                this.unseen = parseInt(unread);

                if (localStorage['notify'] == "true" && !port) {
                    if (this.notification)
                        this.notification.close();
                    
                    this.notification = new Notify(unread);

                    this.notification.show();
                }
            }
            
            if (this.unseen > 99){
                window.mailEvent.setBadge('99+');
                console.log(new Date())
            } else {
                window.mailEvent.setBadge(unread);
                console.log(new Date())
            }
        }
    },
    
    pool: function(port){
        if (this.refresh){
            clearTimeout(this.refresh);
            this.refresh = undefined;
        }
        $.ajax({
            url: 'http://informers.rambler.ru/mail/?version=5',
            dataType: 'xml',
            success: function(xml) {
                var dat    = new Date(),
                    item   = xml.getElementsByTagName('item'),
                    mailbox= xml.getElementsByTagName('mailbox'),
                    unread = xml.getElementsByTagName('unread')[0].textContent;
                
                console.log('success', dat.toLocaleString(), unread);
                
                window.mail.messages(item);

                window.mail.box(mailbox);
                
                window.mail.isNew(unread, (!!port));
                
                window.mailEvent.setIndex();

                if (port != undefined)
                    port.postMessage('ok')
                else
                    window.mailEvent.setPage();
                
                window.mail.isErr = false;
                
                window.mail.refresh = setTimeout(window.mail.pool, 180000);
            },
            error: function(xhr){
                var dat = new Date();
                
                console.log('error', xhr.status, dat.toLocaleString());
                
                if (xhr.status !== 401){
                    window.mail.refresh = setTimeout(window.mail.pool, 180000);
                    window.mail.isErr = true;
                } else {
                    window.mailEvent.setAuthorise();
                }
                if (port != undefined)
                    port.postMessage('error');
                else
                    window.mailEvent.setPage();
            }
        });
    }
}