(function(){
    var port = chrome.extension.connect();
    $(document).on({
        click: function(){
            var text = $('.text').val(),
                type = $('.type').val(),
                hour = parseInt($('.hour').val()),
                min  = parseInt($('.minute').val()),
                sec  = parseInt($('.sec').val()),
                now  = Date.now(),
                nowT = new Date(now),
                time;

            if (type == 'timer'){
                time = (hour * 60 * 60 + min * 60 + sec) * 1000;
            } else {
                if (nowT.getHours() > hour || 
                    (nowT.getHours() == hour && nowT.getMinutes() > min) ||
                    (nowT.getHours() == hour && nowT.getMinutes() == min && nowT.getSeconds() > sec)) {
                    nowT = new Date(now + 24 * 60 * 60 * 1000);
                }

                time = new Date(nowT.getFullYear(), nowT.getMonth(), nowT.getDate(), hour, min, sec) - now;
            }
            console.log(time);
            port.postMessage({'text': text, 'time' : time});
            self.close();
        }
    }, '.g-btn');

    chrome.browserAction.setPopup({popup: ''});
})();