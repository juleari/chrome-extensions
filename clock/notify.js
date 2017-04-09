var Notify = function(text){
    this.html = new Notification(
        'wake up!!!', 
        {
            title: text ? text : 'будильник',
            icon: 'icons/clock48.png'
        });
    /*webkitNotifications.createNotification(
        ,
        ,
        "wake up!!!"
    );*/
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