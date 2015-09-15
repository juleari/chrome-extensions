var Weather = function(){
	this.data = {};
	this.times = [];
	this.color = new WeatherColor();
	this.ajax();
};

Weather.prototype = {
	timer : undefined,
	
	getTime : function(period) {
		var name, when, result;
		
		name = period.attributes[0].textContent;
		when = period.attributes[1].textContent;
		
		result = (when == "today") ?
			'Сегодня ':
			'Завтра ';
		
		switch(name) {
			case 'morning':
				result += 'утром';
				break;
			case 'afternoon':
				result += 'днём';
				break;
			case 'evening':
				result += 'вечером';
				break;
			default:
				result += 'ночью';
		}
		
		return result
	},
	
	setData : function(xml){
		this.data.locative = 'Сейчас ' + xml.getElementsByTagName('town')[0].attributes[0].textContent;
		this.data.url = xml.getElementsByTagName('url')[0].textContent + '?utm_source=r02&utm_medium=distribution&utm_content=e01&utm_campaign=a25';
		var period = xml.getElementsByTagName('period'),
            i, j;
		for (i = 4; i--;) {
            j = i ? (i - 1) : i;
            this.times[j] = {};
            this.times[j].when 		  = this.getTime(period[i]);
            this.times[j].temperature = period[i].getElementsByTagName('temperature')[0].textContent;
            this.times[j].style 	  = period[i].getElementsByTagName('icon')[0].textContent;
            this.times[j].description = period[i].getElementsByTagName('icon')[0].attributes[0].textContent;
		}
	},
	
	setBadgeIcon : function(){
		this.color.init(this.times[0].style);
		
		chrome.browserAction.setBadgeText({text: this.times[0].temperature});
	},
	
	ajax : function(){
		if (this.timer != undefined){
			clearTimeout(this.timer);
			this.timer = undefined;
		}
		
		$.ajax({
			url: 'http://informers.rambler.ru/weather/geoid//?version=5',
			dataType: 'xml',
			success: function(xml) {
                var dat = new Date();
				console.log(dat.toLocaleString(), xml);
				window.weather.setData(xml);
		
				window.weather.setBadgeIcon();
				
				if (window.popupPort) {
                    window.popupPort.port.postMessage('edit');
                }
				
				window.weather.timer = setTimeout(window.weather.ajax, 600000);
			},
			error: function(){
				console.log(arguments);
				
				if (popupPort) {
                    popupPort.port.postMessage('error');
                }
				
				window.weather.timer = setTimeout(window.weather.ajax, 600000);
			}
		});
	}
}