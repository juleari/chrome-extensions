var Radio = function(){
    this.stationsList = [];
};

Radio.prototype = {
    timer   : undefined,
    tryings : 0,
	mess	: function() { 
		if ((window.popupPort != undefined)){
			window.popupPort.port.postMessage('edit'); 
		}
	},
    
    getCurList : function() {
        var i, j = 0;
        for (i in this.stationsList){
            if (!localStorage.hasOwnProperty(this.stationsList[i].name)){
                window.currentList[j] = {}
                window.currentList[j].name = this.stationsList[i].name;
                window.currentList[j].url = this.stationsList[i].url;
                j++;
            }
        }
        for (i = window.currentList.length - 1; i >= j; i--){
            currentList.pop();
        }
    },

    stationsLoad : function(xml, callback) {

        var stations = xml.getElementsByTagName('result'),
            i, ind;
            
        for (i = 0; i < stations.length; i++){
            this.stationsList[i] = {};
            
            this.stationsList[i].name = stations[i].getElementsByTagName('text')[0].textContent;
            this.stationsList[i].now_playing = stations[i].getElementsByTagName('now_playing')[0].textContent;
            this.stationsList[i].url = stations[i].getElementsByTagName('url')[0].textContent;
            this.stationsList[i].description = stations[i].getElementsByTagName('description')[0].textContent;
            this.stationsList[i].alias = stations[i].getElementsByTagName('alias')[0].textContent;
            this.stationsList[i].stream = stations[i].getElementsByTagName('stream')[0].textContent;
        }
        
        this.getCurList();
        
        if (localStorage.lastPlay == undefined) {
            localStorage.clear();
            localStorage.lastPlay = '';
        } else {
            ind = this.getIndex(localStorage.lastPlay);
            window.link = this.stationsList[ind].url;
        }
        
        if (callback){
			callback();
		}
    },
    
    ajax : function() {
        if (this.timer) {
            clearTimeout(this.timer); this.timer = undefined;
        }
        
        $.ajax({
            url: 'http://informers.rambler.ru/radio/?version=5',
            timeout: 10000,
            dataType: 'xml',
            success: function(xml) {
				window.radio.stationsLoad(xml, this.mess);
                window.isErr = 0;
                if (window.popupPort !== undefined){
                    window.popupPort.port.postMessage('edit');
                }
				console.log('isErr:', isErr);
            },
            error: function(){
                window.radio.timer = setTimeout(window.radio.ajax, 180000);
                window.isErr = 1;
                if (window.popupPort !== undefined){
                    window.popupPort.port.postMessage('error');
                }
				console.log('isErr:', isErr);
            }
        });
    },
    
    getIndex : function(name) {
        for (var i = 0; i < this.stationsList.length; i++){
            if (name == this.stationsList[i].name){
                return i;
            }
        }
        return this.stationsList.length - 1;
    },
	
	getNumber : function(name) {
		return (localStorage.hasOwnProperty(name) ?
			localStorage[name] :
			(this.getFutureIndex(name) + 1))
	},

    getFutureIndex : function(name) {
        var j = localStorage.length - 2;
        for (var i = 0; i < this.stationsList.length; i++){
            if (name == this.stationsList[i].name){
                return j;
            }
            if (!localStorage.hasOwnProperty(this.stationsList[i].name)){
                j++;
            }
        }
        return this.stationsList.length - 1;
    },
    
    init : function() {
        chrome.browserAction.setBadgeBackgroundColor({color:[255, 79, 87, 255]});
        chrome.browserAction.setBadgeText({text: ''});
        
        this.ajax();
    },
    
    refresh: function() {
        if (this.tryings < 5) {
            window.getStream(radio.stationsList[ind].stream, function(url){
                window.mp3Player.setUrl(url);
                window.mp3Player.play();
                window.isPlay = true;
				window.isErr = 0;
				console.log('isErr:', window.isErr)
            });
            this.tryings++;
        } else {
            this.isErr = 2;
            if (window.popupPort)
                window.popupPort.port.postMessage('error');
            this.tryings = 0;
        }
    }
}