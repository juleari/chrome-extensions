var Local = function(){
    this.storage = localStorage
}

Local.prototype = {
    change : function(changes, n) {
        for (name in localStorage) {
            if (name != 'lastPlay') {
                localStorage[name] = changes(name, n);
            }
        }
        radio.getCurList();
        this.storage = localStorage;
    },
    
    del : function(name, n) {
        var number = parseInt(localStorage[name]);
        return (number > n) ? (number - 1) : number;
    },
    
    add : function(name) {
        return parseInt(localStorage[name]) + 1;
    }
}