(function(){
    /**
     * Возвращает url потока
     * @param {String} quality Качество, если параметр не передан возвращается ссылка на URL c максимальным качеством
     * @param {Function} callback
     * @returns {Object} url потока и качество
     */
    window.getStream = function(m3uUrl, callback){
        $.ajax({ 
            url: m3uUrl,
            timeout: 15000,
            success: function(streamUrl){
                callback(streamUrl);
            },
            error: function(){
                console.log(arguments);
                if (window.popupPort !== undefined){
                    window.popupPort.port.postMessage('error');
                }
                
                window.mp3Player.stop();
                window.isPlay = false;
                
                window.isErr = 2;
				console.log('isErr:', 2);
                chrome.browserAction.setBadgeText({text:''});
            }
        });
    }
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 79, 87, 255]});
}());