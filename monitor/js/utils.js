/*
 @name utils
*/

var tUri = {
    parse: function(u) {
        return u.match(new RegExp( '([^\/:])+', 'g' ));
    },
    getHost: function(u) {
        var a = tUri.parse(u);
        return (a[0] != undefined) && a[1].replace(/^www\./g, '') || '';
    },
    getScheme: function(u) {
        var a = tUri.parse(u);
        return (a[0] != undefined) && a[0] || '';
    }
};

function trimTitle(s, limit){
    var c = '', limit = limit || 20, a = s.split(/\s/g);
    for (var i=0; i<a.length; i++) {
        var w = a[i].replace(/[\\.,;!|?\/\\-]$/g, '');
        if ((c + w).length < limit) 
            c += ' ' + w;
        else 
            return (c += i ? '' :  (w.substr(0, limit - 1) + '…'));
    }
    return c;
};        

function contains(a, x) {
    return a ?
        (a.indexOf(x) != -1) :
        false
}
function hostInRemove(a, x) {
    if (a){
        for (var i = 0; i < x.length; i++){
            if (!(a.indexOf(x[i] + ' ')) || a.indexOf(' ' + x[i] +  ' ') !== -1)
                return true
        }
    }
    return false
}