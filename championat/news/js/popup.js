var Popup = function(){
    this.news = chrome.extension.getBackgroundPage().news.item;
    this.err = chrome.extension.getBackgroundPage().news.isErr;
    this.link = chrome.extension.getBackgroundPage().news.link;
    this.month = ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 
            'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'];
    this.port = chrome.extension.connect();
    this.redraw();
}

Popup.prototype = {
    currItem : {},
    
    time : function(t){
        var now = new Date(),
            timeM = now.getTime() - t.getTime(),
            timeString;
        
        timeM = Math.floor(timeM / 60000);
        
        if (now.getDate() != t.getDate()) {
            if (Math.floor((timeM + now.getMinutes() + 60 * now.getHours())/ 1440) < 1)
                timeString = 'ВЧЕРА';
            else
                timeString = t.getDate() + ' ' + this.month[t.getMonth()];
        } else {
            if (timeM < 60)
                timeString = timeM + ' МИН НАЗАД';
            else { 
                timeM = Math.floor(timeM / 60);
                if (timeM == 1)
                    timeString = '1 ЧАС НАЗАД';
                else {
                    if (timeM < 5)
                        timeString = timeM + ' ЧАСА НАЗАД'
                    else
                        timeString = timeM + ' ЧАСОВ НАЗАД'
                }
            }
        }
        
        return timeString
    },

    pane : function(){
        $('.b-wid__list').jScrollPane();
    },
    
    redraw : function(){
        $('.b-wid__li').remove();
                
        var ui = $('.b-wid__ul'),
            li,     /*<li class="b-wid__li">*/
            img,    /*<img class="b-wid__img" src="1.jpg" alt="" />*/
            text,   /*<h3 class="b-letter-name"></h3>*/
            time,   /*<span class="b-letter-time"></span>*/
            url;    /*<div class="b-wid__none"></div>*/
        
        $('.b-wid').removeClass('b-wid_error');
        $('.b-wid').addClass('b-wid_loader');
        
        if (!this.err){
            for (i = 0; i < this.news.length; i++){
                this.currItem = this.news[i];
            
                li = $('<li class="b-wid__li"></li>');
                    text = $('<h3 class="b-letter-name"></h3>');
                    text.html(this.currItem.title);
                    
                    time = $('<span class="b-letter-time"></span>');
                    time.html(this.time(this.currItem.time) + ' / ' + this.currItem.sport);
                    
                    url = $('<div class="b-wid__none"></div>');
                    url.html(this.currItem.url);
                    
                li.append(text);
                li.append(time);
                li.append(url);
                
                ui.append(li);
            }
            
            $('.b-wid').removeClass('b-wid_loader');
        } else {
            $('.b-wid').removeClass('b-wid_loader');
            $('.b-wid').addClass('b-wid_error');
            this.port.postMessage('load');
        }
        
        setTimeout(this.pane, 500);
        chrome.browserAction.setPopup({popup: ''});
    }
};

(function(){
    window.popup = new Popup();

    var postLoad = function () {
        popup.port.postMessage('load');
    }

    postLoad();
        
	$(document).on({
		click : function(){
			chrome.tabs.create({url: popup.link});
		}
	}, '.b-wid__header');
	
    $(document).on({
        click : function(){
            var url = this.lastChild.outerText;
            chrome.tabs.create({url: url});
        }
    }, '.b-wid__li');

    $(document).on({
        click : function(){
            $('.b-wid').removeClass('b-wid_error');
            $('.b-wid').addClass('b-wid_loader');
            setTimeout(postLoad, 1000);
        }
    }, '.g-btn');
    
    popup.port.onMessage.addListener(function(name){
        switch (name) {
            case 'edit' : 
                window.popup = new Popup();
                console.log('ok');
                break;
            case 'error' : 
                console.log('err');
                $('.b-wid').removeClass('b-wid_loader');
                $('.b-wid').addClass('b-wid_error');
                break;
        }
    });
	
	$(document).on({
		scroll : function(){
			( parseInt( $('.jspPane').css('top') ) ) ?
				$('.b-wid__header_after').css('opacity', 1) :
				$('.b-wid__header_after').css('opacity', 0);
		}
	},'.b-wid');
})();