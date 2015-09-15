'use strict';

var rkey = 'rdial_', 
    topHosts = [], 
    tabsList = {}, 
    capturedTTL = 1000*60*1, // 1 min
    capturedAt = {},
    getCurrentTab = function(callback) {
        chrome.tabs.query({
            windowId: chrome.windows.WINDOW_ID_CURRENT,
            currentWindow: true,
            active: true
        }, function(tabs) {
            if (tabs && tabs.length) {
                callback(tabs[0]);
            }
        });
    },
    postMessage = function(what) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, what);
        });
    },
    enteredAt = Date.now();

chrome.webNavigation.onCompleted.addListener(function(navTab) {
    if (navTab.tabId){
        console.log(navTab.tabId);
        chrome.tabs.get(navTab.tabId, function(tab){
            var phost = tUri.getHost(tab.url),
                scheme= tUri.getScheme(tab.url);
            
            console.log(enteredAt, enteredAt >= Date.now() - 1000, phost, capturedTTL < enteredAt - Number(capturedAt[ phost ] || 0), contains(topHosts, phost), contains(['http', 'https'], scheme));
            if (enteredAt && enteredAt >= Date.now() - 1000) {
                return;
            } else {
                enteredAt = Date.now();
            }

            if (phost && 
                   (capturedTTL < enteredAt - Number(capturedAt[ phost ] || 0)) &&
                    contains(topHosts, phost) && 
                    contains(['http', 'https'], scheme)
                ) {
                setTimeout( (function(host){ return function(){ gfx.saveThumb(host) } } )(phost), 500 );
            }
        
        });
    } else {
        console.log('tabId', navTab.tabId);
    }
});

var gfx = {
    saveThumb: function(host){
        chrome.tabs.captureVisibleTab(null,function(dataurl){
            console.log(dataurl);
            getCurrentTab(function(tab){
                var capturedURI = {
                    host: tUri.getHost(tab.url),
                    scheme: tUri.getScheme(tab.url)
                };
                if ( !(host === capturedURI.host )) {
                    console.log('capture escaped: ', host + '!==' + capturedURI.host);
                    return;
                }
                localStorage[rkey + encodeURIComponent(host)]=dataurl;
                console.log(' * saveThumb(); #' + rkey + encodeURIComponent(host) , Date.now());
            });
        });
    }
};