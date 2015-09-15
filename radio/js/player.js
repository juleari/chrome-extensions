(function(){
	window.port  = chrome.extension.connect();
    window.popup = new Popup();
    
	port.onMessage.addListener(function(name){
		//window.popup = new Popup(true);
        switch (name) {
			case 'edit' : 
				window.popup = new Popup(true);
				break;
			case 'error' : 
				window.popup = new Popup(false);
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
	
	$(document).on({
		click : function(){
			chrome.tabs.create({url: 'http://radio.rambler.ru/?utm_source=r02&utm_medium=distribution&utm_content=e01&utm_campaign=a25'});
		}
	}, '.b-wid__header');
    
    var postLoad = function () {
        port.postMessage('load');
    }

    $(document).on({
        click : function(){
            if ($('.b-wid').is('.b-wid_error_play')){
                $('.b-wid').removeClass('b-wid_error_play');
            } else {
                $('.b-wid').removeClass('b-wid_error');
                $('.b-wid').addClass('b-wid_loader');
                setTimeout(postLoad, 1000);
            }
        }
    }, '.g-btn');
    
    popup.bkg.mp3Player.bind('canplay', function(){
        $('.b-wid__li_loader').removeClass('b-wid__li_loader');
    });
	
	var documentOn = $(document);
    window.timerTwist;
    
    /*действия со станциями*/
    documentOn.on({
        click: function(e){
            var li = $(this),
                station = this.children[0].children[0].childNodes[0].textContent,
                elem = document.elementFromPoint(e.pageX, e.pageY);
            
            $('.b-wid__li_loader').removeClass('b-wid__li_loader');
			
            /*проигрывание-остановка проигрывания станции*/
            if (elem.classList[0] != 'g-icn' || elem.classList[1] == 'g-icn_play'){
                
				if (li.is('.b-wid__li_playing')){
                    li.removeClass('b-wid__li_loader');
                    
					/*остановка*/
                    if (li.children('.g-icn_play').is('.g-icn_pause')) {
                        li.children('.g-icn_play').removeClass('g-icn_pause');
						li.children('.g-icn_play').attr('title', 'Включить');
                        port.postMessage('stop');
                    } 
					/*проигрывание*/
					else {
                        li.children('.g-icn_play').addClass('g-icn_pause');
						li.children('.g-icn_play').attr('title', 'Выключить');
                        li.addClass('b-wid__li_loader');
                        port.postMessage(station);
                    }
                } else {
					/*включение новой станции*/
                    $('.b-wid__li_playing').removeClass('b-wid__li_playing');
                    $('.g-icn_pause').removeClass('g-icn_pause');
                    li.addClass('b-wid__li_playing');
                    li.children('.g-icn_play').addClass('g-icn_pause');
					li.children('.g-icn_play').attr('title', 'Выключить');
                    li.addClass('b-wid__li_loader');
                    
                    port.postMessage(station);
                }
            } else {
                if (elem.classList[1] == 'g-icn_detach'){
                    chrome.tabs.create({url: 'http://' + elem.innerHTML});
                } else {
                    if (!popup.isGo){
                        /*удаление из избранного*/
                        if (li.is('.b-wid__li_rated')){
                            var fIndex = popup.bkg.radio.getFutureIndex(station);
                                top = (fIndex - popup.fav[station]) * 41;
                        
                            li.removeClass('b-wid__li_rated');
                            
                            if (fIndex != popup.fav[station]){
                                li.removeClass('b-wid__li_rated');
                                li.addClass('b-wid__li_going');
                                
                                console.log(fIndex);
                                
                                popup.isGo = true;
                                li.css('margin-top', top + 'px');
                                
                                popup.drawGoingBack(station, fIndex);
                                
                                this.addEventListener('webkitTransitionEnd', function(){
                                    port.postMessage('del '+ station);
                                    $('.b-wid__li').removeClass('transition');
                                    popup.isGo = false;
                                }, false );
                                this.removeEventListener('webkitTransitionEnd', function(){
                                    port.postMessage('del '+ station);
                                    $('.b-wid__li').removeClass('transition');
                                    popup.isGo = false;
                                }, false );
                            } else {
                                li.removeClass('b-wid__li_rated');
                                port.postMessage('del '+ station);
                            }
                        } else {
                            /*добавление в избранное*/
                            li.addClass('b-wid__li_rated');
                            
                            var top	 = parseInt(this.offsetTop) + 41,
                                ul	 = $('.b-wid__li'),
                                wli  = $('.b-wid__li').eq(0),
                                drag = $('.jspDrag').eq(0),
                                pane = $('.jspPane').eq(0);
                            
                            if(station === popup.cList[0].name && popup.fav.length === 2){
                                port.postMessage('add ' + station);
                            } else {
                                ul.addClass('transition');
                                popup.isGo = true;
                                
                                li.addClass('b-wid__li_going');
                                li.css('margin-top', '-' + top + 'px');
                                wli.css('margin-top', '41px');
                                drag.addClass('jspDrag_going');
                                pane.addClass('jspPane_going');
                                drag.css('top', '0px');
                                pane.css('top', '0px');
                                this.addEventListener('webkitTransitionEnd', function(){
                                    port.postMessage('add ' + station);
                                    drag.removeClass('jspDrag_going');
                                    pane.removeClass('jspPane_going');
                                    ul.removeClass('transition');
                                    popup.isGo = false;
                                }, false);
                                this.removeEventListener('webkitTransitionEnd', function(){
                                    port.postMessage('add ' + station);
                                    drag.removeClass('jspDrag_going');
                                    pane.removeClass('jspPane_going');
                                    ul.removeClass('transition');
                                    popup.isGo = false;
                                }, false);    
                            }
                        }
                    }
                }
            }
        }
    }, '.b-wid__li');
}());