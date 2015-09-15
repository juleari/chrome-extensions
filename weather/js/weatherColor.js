var WeatherColor = function() {
	var color1 = [255, 173, 0,   255],
		color2 = [62,  62,  62,  255],
		color3 = [146, 146, 146, 255],
		color4 = [99,  125, 159, 255],
		color5 = [110, 174, 215, 255],
		color6 = [97,  92,  135, 255];

	this.type = [];
		
	this.type['clear'] 			= color1;
	this.type['clear-night'] 	= color2;
	this.type['cloudy']			= color3;
	this.type['cloudy-night'] 	= color2;
	this.type['occ-rain'] 		= color4;
	this.type['rain-night'] 	= color2;
	this.type['occ-snow'] 		= color5;
	this.type['snow-night'] 	= color5;
	this.type['partly-cloudy']	= color1;
	this.type['partly-cloudy-night'] 	= color2; 
	this.type['rain'] 			= color4;
	this.type['sleet'] 			= color5;
	this.type['snow'] 			= color5;
	this.type['thunder'] 		= color4;
	this.type['fog'] 			= color6;
	this.type['undefinedweather-2'] 	= color6;
	this.type['undefinedweather-3'] 	= color6;
	this.type['undefinedweather-4'] 	= color6;
	this.type['unknown']		= color3;
	this.type['light-rain']		= color4;
	this.type['light-rain-night']		= color4;
};

WeatherColor.prototype = {
	setColor : function(type) {
		if (this.type[type]){
			chrome.browserAction.setBadgeBackgroundColor({color:this.type[type]});
		} else {
			chrome.browserAction.setBadgeBackgroundColor({color:this.type['unknown']});
		}
		
	},
	
	setIcon : function(type) {
		chrome.browserAction.setIcon({path: 'icons/' + type + '.png'});
	},
	
	init : function(type) {
		this.setColor(type);
		this.setIcon(type);
	}
}