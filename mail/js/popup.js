var Popup = function() {
    this.mail = chrome.extension.getBackgroundPage().mail;
    this.month = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 
            'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    this.port = chrome.extension.connect();
    this.mess = [];
    this.mbox = [];
    this.unseen;
    this.init();
}

Popup.prototype = {
    curMess : {},
    
    name : function(){
        if (this.curMess.name) {
            if (this.curMess.name.length < 25){
                return this.curMess.name
            } else {
                return (this.curMess.name.substr(0, 25) + '...')
            }
        } else {
            return '(Без имени)'
        }
    },
    
    topic : function(t) {
        if (t) {
            if (t.length < 20){
                return t
            } else {
                return (t.substr(0, 20) + '...')
            }
        } else {
            return 'без темы'
        }
    },
    
    time : function(t) {
        var now = new Date(),
            timeM;
        
        if (now.getDate() === t.getDate() &&
        now.getMonth() === t.getMonth() &&
        now.getFullYear() === t.getFullYear()) {
            timeM = (t.getMinutes() < 10) ?
                t.getHours() + ':0' + t.getMinutes() :
                timeM = t.getHours() + ':' + t.getMinutes();
        } else {
            timeM = t.getDate() + ' ' + this.month[t.getMonth()];
        }
        
        return timeM
    },
    
    mails : function() {
        var i,      /*счетчик*/
            list  = $('.b-wid__ul'),
			empty = $('.b-mailbox-empty'),
            li,     /*<li class="b-wid__li"></li>*/
            name,   /*<h3 class="b-letter-name"</h3>*/
            topic,  /*<span class="b-letter-subj"></span>*/
            time,   /*<span class="b-letter-time"></span>*/
            url;    /*<div class="b-wid__none"></div>*/
            
        $('.b-wid__li').remove();
		$('.b-wid__list').removeClass('b-wid__none');
		empty.addClass('b-wid__none');
        
        for (i = 0; i < this.mess.length; i ++){
            this.curMess = this.mess[i];
        
                li = $('<li class="b-wid__li"></li>');
                    name = $('<h3 class="b-letter-name"</h3>');
                    name.html(this.name());
                    
                    if (!this.curMess.isRead) {
                        li.addClass('b-wid__li_unread');
                        this.unseen--;
                    }
                    
                    topic = $('<span class="b-letter-subj"></span>');
                    topic.html(this.topic(this.curMess.topic));
                    
                    if (this.curMess.hasAtt){
                        topic.html(topic.html() + '<i class="b-wid__li_atachment"></i>')
                    }
                    
                    time = $('<span class="b-letter-time"></span>');
                    time.html(this.time(this.curMess.time));
                    
                    if (this.curMess.isFav){
                        li.addClass("b-wid__li_rated");
                    }
                    
                    url = $('<div class="b-wid__none"></div>');
                    url.html(this.curMess.url);
                    
                li.append(name);
                li.append(topic);
                li.append(time);
                li.append(url);
            list.append(li);
        }

        if (i === 0) {
            $('.b-wid__list').addClass('b-wid__none');
			empty.removeClass('b-wid__none');
        }
        
        for (i = 0; i < this.mbox.length; i++){
            li = $('<li class="b-wid__li b-wid__mailbox"></li>');
                name = $('<h3 class="b-letter-name"></h3>');
                name.html(this.mbox[i].text);
                
                url = $('<div class="b-wid__none"></div>');
                url.html(this.mbox[i].url);
            li.append(name);
            li.append(url);
            list.append(li);
        }

        $('.b-wid__list').jScrollPane();
        return this.unseen;
    },
    
    redraw : function(){
        this.mess = this.mail.mess;
        this.mbox = this.mail.mbox;
        this.unseen = this.mail.unseen;
        
        $('.b-wid').removeClass('b-wid_loader');
        if (this.mail.isErr) {
            $('.b-wid').addClass('b-wid_error');
        } else {
            $('.b-wid').removeClass('b-wid_error');
            this.mails();
        }

        chrome.browserAction.setPopup({popup: ''});
    },
    
    init : function(){
        this.redraw();
        this.port.postMessage('refresh');
    }
}