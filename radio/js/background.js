(function(){
    /*
        localStorage:
        lastPlay    - последняя проигрываемая станция
        `name`:`num`- названия : номера "избранных" станций
    */
    localStorage.removeItem('show');;
    
    window.mp3Player    = new window.RL.MP3layer({ type: 'html5' });
    window.currentList  = [];   /*массив названий "неизбранных" станций*/
    window.isPlay       = false;/*играет ли плеер*/
    window.isErr        = 1;
    window.online       = true;
    window.popupPort    = undefined;
    
    window.radio = new Radio();
    radio.init();
    
    window.local = new Local();
    
    var addPopup = function(){
        chrome.browserAction.setPopup({popup: 'index.html'});
    }
    
    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(name) {
            if (window.popupPort == undefined) {
                window.popupPort = new Port(port);
			}
            switch (name.substring(0, 4)) {
                case 'add ' : {
                    localStorage.setItem(name.substring(4), '-1');
                    local.change(local.add);
                    port.postMessage('edit');
                    break;
                }
                case 'del ' : {
                    var n = name.substring(4),
                        k = localStorage[n];

                    localStorage.removeItem(n);
                    local.change(local.del, k);
                    port.postMessage('edit');
                    break;
                }
                case 'stop' : {
                    window.mp3Player.stop();
                    window.isPlay = false;
                    
                    chrome.browserAction.setBadgeText({text:''});
                    break;
                }
                case 'load' : {
                    if (radio.timer || window.isErr){
                        radio.ajax();
                    } else 
						port.postMessage('edit');
					break;
                }
                default : {
                    localStorage.lastPlay = name;
            
                    ind = radio.getIndex(name);
                    window.isPlay = true;
                    window.isErr = 0;
					console.log('isErr:', window.isErr);
                    chrome.browserAction.setBadgeText({text:'on'});
                    radio.tryings = 0;
                    radio.refresh(port);
                }
            }
        });
        
        port.onDisconnect.addListener(function() {
            setTimeout(addPopup, 150);
        });
    });
    
    window.addEventListener('offline', function(){
        console.log('offline');
        if(window.isPlay) {
            window.isErr = 1;
			if (window.popupPort != undefined) {
				window.popupPort.port.postMessage('error');
			} 
			console.log('isErr:', window.isErr);
        }
    });
    window.addEventListener('online', function(){
        console.log('online');
		window.isErr = 0;
		console.log('isErr:', window.isErr);
		if (window.popupPort != undefined) {
			window.popupPort.port.postMessage('edit');
		}
        if (window.isPlay){
            radio.refresh();
        }
        if (radio.timer) {
            radio.ajax();
        }
    });
	
}());