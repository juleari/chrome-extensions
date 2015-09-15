var Popup = function() {
	this.bkg = chrome.extension.getBackgroundPage();
	
	this.now = this.bkg.weather.data.locative;
	this.url = this.bkg.weather.data.url;
	
	this.periods = this.bkg.weather.times;
	
	this.port = chrome.extension.connect();
	
	this.redraw();
}

Popup.prototype = {
	redraw : function(){
		$('.b-wid__li').remove();
                
        var ul = $('.b-wid__list'),
            li,     /*<li class="b-wid__li"></li>*/
            span,   /*<span class="b-wid__li-txt"></span>*/
            div,   	/*<div class="b-degree"></div>*/
			ii;		/*<i class="g-icn g-icn_small_cloudy"></i>*/
		
		$('.b-wid').removeClass('b-wid_error');
        $('.b-wid').addClass('b-wid_loader');
		
		if (this.periods[0] != undefined){
				li = $('<li class="b-wid__li"></li>');
				li.addClass('w-picture');
				li.addClass('b-wid__li_big');
				li.addClass('b-wid__li_' + this.periods[0].style);
				li.attr('title', this.periods[0].description);
				
					span = $('<span class="b-wid__li-txt"></span>');
					span.html(this.now);
					
					div = $('<div class="b-degree"></div>');
					div.html(this.periods[0].temperature + '°');
					
				li.append(span);
				li.append(div);
				
			ul.append(li);
			
			for (i = 1; i < 3; i++){
				li = $('<li class="b-wid__li"></li>');
				
					span = $('<span class="b-wid__li-txt"></span>');
					span.html(this.periods[i].when);
					
					div = $('<div class="b-degree"></div>');
						
						ii = $('<i class="g-icn"></i>');
						ii.addClass('g-icn_small');
						ii.addClass('g-icn_small_' + this.periods[i].style);
						ii.attr('title', this.periods[i].description);
						
					div.append(ii);
					div.html(div.html() + this.periods[i].temperature + '°');
					
				li.append(span);
				li.append(div);
				
				ul.append(li);
			}
			$('.b-wid').removeClass('b-wid_loader');
		} else {
			$('.b-wid').removeClass('b-wid_loader');
            $('.b-wid').addClass('b-wid_error');
            this.port.postMessage('load');
		}

        chrome.browserAction.setPopup({popup: ''});
	}
};

(function(){
    window.popup = new Popup();
	
	popup.port.postMessage('load');
	
	$(document).on({
        click : function(){
            chrome.tabs.create({url: popup.url});
        }
    }, '.b-wid__title');
    
  	$(document).on({
        click : function(){
            chrome.tabs.create({url: popup.url});
        }
    }, '.w-picture');

  	var postLoad = function () {
  		popup.port.postMessage('load');
  	}
	
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
})();