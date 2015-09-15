var Port = function(port){
	this.port = port;
	
	this.port.onDisconnect.addListener(function(port){
		window.popupPort = undefined;
	});
}