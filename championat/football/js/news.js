var News = function(){
    this.item = [];
	this.link;
    this.isErr = true;
    this.pool();
}

News.prototype = {
    refresh: undefined,
    
    textfromarray: function(arr){
        var res = [];
        for (var i = 0; i < arr.length; i++){
            res[i] = arr[i].textContent;
        }
        return res;
    },

    items: function(xml){
        this.item = [];
        
        for (i = 0; i < xml.length; i++){
            this.item[i] = {};
            
            this.item[i].title = xml[i].getElementsByTagName('title')[0].textContent;
            this.item[i].description = xml[i].getElementsByTagName('description')[0].textContent;
            this.item[i].time = new Date (xml[i].getElementsByTagName('pubDate')[0].textContent);
            this.item[i].url = xml[i].getElementsByTagName('link')[0].textContent + '?utm_source=r02&utm_medium=distribution&utm_content=e01&utm_campaign=a25';
            this.item[i].categories = this.textfromarray(xml[i].getElementsByTagName('category'));
            this.item[i].section = (xml[i].getElementsByTagName('section')[0]) ?
                xml[i].getElementsByTagName('section')[0].textContent:
                (xml[i].getElementsByTagName('sport')[0])?
                    xml[i].getElementsByTagName('sport')[0].getAttribute('rus'):
                    '';
        }
    },
    
    pool: function(p){
        if (this.refresh != undefined)
            clearTimeout(this.refresh);
        $.ajax({
            url: 'http://www.championat.com/xml/rss_football.xml',
            timeout: 10000,
            success: function(xml){
                var it = xml.getElementsByTagName('item');
                var dat = new Date();
                console.log('success', dat.toLocaleString());
                news.items(it);
                news.refresh = setTimeout(news.pool, 180000);
                    
                news.isErr = false;
				console.log(xml.getElementsByTagName('link'));
				news.link = xml.getElementsByTagName('link')[0].textContent + '?utm_source=r02&utm_medium=distribution&utm_content=e01&utm_campaign=a25';
                
                if (p == 1 && news.port)
                    news.port.postMessage('edit');
            },
            error: function(xhr){
                var dat = new Date();
                console.log('error', xhr.status, dat.toLocaleString());
                news.refresh = setTimeout(news.pool, 180000);
                    
                news.isErr = true;
                
                if (p == 1)
                    news.port.postMessage('error');
            }
        });
    }
}