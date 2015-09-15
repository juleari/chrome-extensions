var Notify = function(text){
    this.html = webkitNotifications.createNotification(
        'icons/clock48.png',
        text ? text : 'будильник',
        "wake up!!!"
    );
}

Notify.prototype = {
    show: function(){
        this.html.show();
    },
    
    close: function(){
        if (this.html){
            this.html.close();
        }
    }
}