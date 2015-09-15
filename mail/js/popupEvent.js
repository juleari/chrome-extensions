(function(){
    popup = new Popup();
    popup.port.onMessage.addListener(function(){
        popup.redraw();
        console.log('popup', popup);
    });
	
	$(document).on({
		scroll : function(){
			( parseInt( $('.jspPane').css('top') ) ) ?
				$('.b-wid__header_after').css('opacity', 1) :
				$('.b-wid__header_after').css('opacity', 0);
		}
	},'.b-wid');
    
    $(document).on({
        click: function(){
            chrome.tabs.create({url: 'http://mail.rambler.ru/#/compose'});
        }
    }, '.g-icn_write');
    
    var postLoad = function () {
        popup.port.postMessage('refresh');
    }
    
    $(document).on({
        click: function(){
            $('.b-wid').removeClass('b-wid_error');
            $('.b-wid').addClass('b-wid_loader');
            setTimeout(postLoad, 1000);
        }
    }, '.g-btn');

    $(document).on({
        click: function(){
            var url     = this.lastChild.innerText;
            chrome.tabs.create({url: url});
        }
    }, '.b-wid__li');
    
    $(document).on({
        click: function(){
            chrome.tabs.create({url: 'http://mail.rambler.ru/?utm_source=r02&utm_medium=distribution&utm_content=e01&utm_campaign=a25#/folder/INBOX/'});
        }
    }, '.b-wid__title');
})();