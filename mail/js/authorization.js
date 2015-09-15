(function(){
    var documentOn = $(document);
    
    port = chrome.extension.connect();
    port.postMessage('refresh');
    port.onMessage.addListener(function(mess){
        if(mess === 'ok') {
            window.close();
        }
    });

    chrome.browserAction.setPopup({popup: ''});
    
    /*focused login*/
    documentOn.on({
        focusin: function(){
            $(this).addClass('r--group__focus');
        },
        focusout: function(){
            $(this).removeClass('r--group__focus');
        }
    }, '.r--group');
        
    /*close select onClick out of select list*/
    documentOn.on({
        click: function(e){
            console.log(e);
            var elem = document.elementFromPoint(e.pageX, e.pageY),
                ul = $('#js-domain');
            
            if (elem.classList[0] != 'r--option_value' && elem.classList[0].substr(0, 11) != 'r--dropdown' && elem.classList[0] != 'b-domain'){
                ul.removeClass('b-domain_block');
            }
        }
    }, '#extauth');
    
    /*open/close select list*/
    documentOn.on({
        click: function(){
            console.log('ak');
            var ul = $('#js-domain');
            
            if (ul.is('.b-domain_block')){
                ul.removeClass('b-domain_block');
            } else {
                ul.addClass('b-domain_block');
            }
        }
    }, '#select-domain');
    
    /*select domain*/
    documentOn.on({
        click: function(){
            var th      = $(this),
                options = $('.r--option_value');
            
            $('#js-domain').removeClass('b-domain_block');
            
            options.removeClass('r--option__active');
            th.addClass('r--option__active');
            
            $('#select-domain-name').html(th.html());
        }
    }, '.r--option_value');
    
    /*close popup*/
    documentOn.on({
        click: function(){
            window.close();
        } 
    }, '.b-auth--cancel');
})();