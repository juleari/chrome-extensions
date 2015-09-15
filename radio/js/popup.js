var Popup = function(opened){
    this.bkg    = chrome.extension.getBackgroundPage();
    this.fav    = this.bkg.localStorage;
    this.lPlay  = this.fav.lastPlay;
    this.cList  = this.bkg.currentList;
    this.isGo   = false;
    this.err    = this.bkg.isErr;
	this.isPlay = this.bkg.isPlay;
    this.online = this.bkg.online;
    this.redraw(opened);
}

Popup.prototype = {
    favStations : [],
    
    drawStation : function(name, url, isF, isL){
        var ul = $('.b-wid__ul'),
            li = $('<li class="b-wid__li"></li>'),
            div = $('<div class="b-wid__station"></div>'),
                span = $('<span></span>'),
                    ii = $('<i class="g-icn g-icn_detach" title="Перейти на сайт станции"></i>');
                    ii.html(url);

            span.html(name);
            span.append(ii);
            
            div.append(span);
            
        li.append(div);
            
            ii = $('<i class="g-icn g-icn_star" title="Добавить в избранное"></i>');
            
            if (isF){
                ii.attr('title', 'Убрать из избранного');
                li.addClass('b-wid__li_rated');
            }    
        li.append(ii);
                
            ii = $('<i class="g-icn g-icn_play" title="Включить"></i>')
                
            if (isL){
                li.addClass('b-wid__li_playing');
				if (this.isPlay){
					ii.addClass('g-icn_pause');
					ii.attr('title', 'Выключить');
				}
            }
            
        li.append(ii);
        ul.append(li);
    },
    
    favToList : function() {
        
        for (var name in this.fav){
            if (name != 'lastPlay'){
                this.favStations[parseInt(this.fav[name])] = name;
            }
        }
    },
    
    redraw : function(opened){
        $('.b-wid__li').remove();
        
		console.log(opened);
        
        var temp, i = 0;
        
        $('.b-wid').removeClass('b-wid_error');
        $('.b-wid').removeClass('b-wid_error_play');
        $('.b-wid').addClass('b-wid_loader');
        
        if (this.bkg.radio.stationsList.length > 0){
            temp = this.fav.length - 1;
            
            if (temp) {
                this.favToList();
                
                for (; i < temp; i++) {
                    (this.favStations[i] == this.lPlay) ?
                        this.drawStation(this.favStations[i], this.bkg.radio.stationsList[this.bkg.radio.getIndex(this.favStations[i])].url, true, true) :
                        this.drawStation(this.favStations[i], this.bkg.radio.stationsList[this.bkg.radio.getIndex(this.favStations[i])].url, true, false)
                }
            }
            
            for (i = 0; i < this.cList.length; i++) {
                (this.cList[i].name == this.lPlay) ?
                    this.drawStation(this.cList[i].name, this.cList[i].url, false, true) :
                    this.drawStation(this.cList[i].name, this.cList[i].url, false, false)
            }
            
            $('.b-wid').removeClass('b-wid_loader');
        }  else {
            $('.b-wid').removeClass('b-wid_loader');
            $('.b-wid').addClass('b-wid_error');
            //window.port.postMessage('load');
        }
		
		if (this.err == 1){
            $('.b-wid').removeClass('b-wid_loader');
            
            $('.b-wid').addClass('b-wid_error')
            
            $('.b-wid__header_after').css('opacity', 0);
			//window.port.postMessage('load');
		} else {
			$('.b-wid__list').jScrollPane();
			
			var number = this.bkg.radio.getNumber(this.lPlay),
				length = this.bkg.radio.stationsList.length - 9,
				maxTop = parseInt($('.jspTrack').css('height')) - parseInt($('.jspDrag').css('height'));
			
			console.log(number, maxTop);
			
			if (!opened && this.lPlay){
                if (number < length){
					$('.jspPane').css('top', '-' + (number * 42) + 'px');
					$('.jspDrag').css('top', (number * maxTop / (length + 1)) + 'px');
				} else {
					$('.jspPane').css('top', '-' + (length * 42) + 'px');
					$('.jspDrag').css('top', maxTop + 'px');
				}
				
				(number) ?
					$('.b-wid__header_after').css('opacity', 1) :
					$('.b-wid__header_after').css('opacity', 0);
			} else {
				$('.b-wid__header_after').css('opacity', 0);
			}

            if (this.err == 2){  
                $('.b-wid').removeClass('b-wid_loader');
                
                $('.b-wid-error_play').html('При воспроизведении радиостанции<br>'+
                    this.lPlay +
                    '<br> возникла ошибка<br><br>' 
                    + '<button class="g-btn">ОК</button>');
                $('.b-wid').addClass('b-wid_error_play')
                
                $('.b-wid__header_after').css('opacity', 0); 
            }
		}

        chrome.browserAction.setPopup({popup: ''});
    },
	
	drawGoingBack: function(name, index) {
		var li = $('.b-wid__li'),
			top,
			i = parseInt(this.fav[name]) + 1;
		
		li.eq(i).css('margin-top', '41px');
		li.addClass('transition');
		li.eq(i).css('margin-top', '0px');
		
		li.eq(index + 1).css('margin-top', '41px');
		
		console.log(i, li[i], li[index+1]);
	}	
};