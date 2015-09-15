'use strict';
var rkey = 'rdial_';
var dial = {

    host: '',
    elem: {},
    loadedTopSites: false,
    loadIteration: 0,
    loadTimeout: 0,
    dzone: $('.speedzone'),
    chromeTopSites: [],
    removeTimeout: 0,

    add: function (sdial) {
        var ddial, dlink, dscreen, dclose, dtitle, dtitleunder, dicon, dgtitle;

        ddial = $('<div class="speeddial"></div>');
            dclose = $('<div class="close" title="Не показывать"></div>');
            ddial.append(dclose);
            dlink = $('<a class="link" href="' + sdial.url +'"></a>');
                
                dscreen = $('<div class="speeddial_screen"></div>');
                (sdial.isimgweb) ?
                    dscreen.addClass('resize') :
                    ddial.addClass('resize');
                if (sdial.imgdata) {
                    (sdial.isimgweb) ?
                        dscreen.css(
                            'background', 'url(' + sdial.imgdata + ') no-repeat'
                        ) :
                        ddial.css({
                            'background': 'url(' + sdial.imgdata + ') 18px no-repeat'
                        });

                } else {
                    dscreen.css('background-color', '#eee');
                }
                    dtitleunder = $('<div class="speeddial_title speeddial_title_under"></div>');
                    dtitle = $('<div class="speeddial_title"></div>');
                        dicon = $('<i class="g-icon"></i>');
                        (sdial.isimgweb) ?
                            dicon.css(
                                'background-image', 'url(chrome://favicon/' + sdial.url +')'
                            ) :
                            dicon.css(
                                'background-image', 'url(css/icons/'+ sdial.host +'.ico)');

                        dgtitle = $('<div class="g-title"></div>');
                        dgtitle.html(sdial.title);

                    dtitle.append(dicon);
                    dtitle.append(dgtitle);
                dscreen.append(dtitleunder);
                dscreen.append(dtitle);
            dlink.append(dscreen);
        ddial.append(dlink)
        dial.dzone.append(ddial);
    },

    closeNote: function() {
        var note = $('.note');
        clearTimeout(dial.removeTimeout);
        dial.removeTimeout = 0;
        note.css('opacity', 0);
        note[0].addEventListener('webkitTransitionEnd', function(){
            $('.note_cancel').css('display', 'inline-block');
        }, false);
        note[0].removeEventListener('webkitTransitionEnd', function(){
            $('.note_cancel').css('display', 'inline-block');
        }, false);
    },

    del: function(a) {
        var resize,
            link = a.children('.link').attr('href');

        dial.host = tUri.getHost(link),
        dial.elem = a;

        (a.is('.resize')) ?
            resize = a :
            resize = a.children('.link').children('.speeddial_screen');

        resize.css('opacity', 0);
        setTimeout(dial.onremove, 900);
    }, 

    getIndex: function(t) {
        for (var i = 0; i < hash.length; i++){
            if (hash[i].host.indexOf(t) !== -1)
                return i
        }
        return -1;
    },

    loadTopSites: function() {
        if (dial.loadedTopSites)
            return;
        if (dial.loadIteration > 10){
            dial.processTopSites(0, hash);
            return;
        }

        dial.loadIteration++;
        chrome.topSites.get(function(data) {
            dial.processTopSites(0, data);
        });
        dial.loadTimeout = setTimeout(dial.loadTopSites, 2000);
    },

    onremove: function () {
        dial.elem.remove();
        clearTimeout(dial.removeTimeout);
        localStorage['last_remove'] = dial.host;
        localStorage.hasOwnProperty('remove') ?
            localStorage['remove'] += dial.host + ' ':
            localStorage['remove']  = dial.host + ' ';
        if (dial.getIndex(dial.host) != -1)
            hash[dial.getIndex(dial.host)].used = false;
        chrome.extension.getBackgroundPage().topHosts.splice(chrome.extension.getBackgroundPage().topHosts.indexOf(dial.host), 1);
        dial.loadedTopSites = false;
        dial.processTopSites(7, dial.chromeTopSites);
        $('.note_cancel').css('display', 'inline-block');
        $('.note').css({
            'display': 'block',
            'opacity': 1});
        clearTimeout(dial.removeTimeout);
        dial.removeTimeout = setTimeout(dial.closeNote, 30000);
    },

    processTopSites: function(l, data) {
        clearTimeout(dial.loadTimeout);
        dial.loadTimeout = 0;
        dial.loadIteration = 0;
        if (dial.loadedTopSites)
            return;
        dial.loadedTopSites = true;

        var topHosts = [], host, k = data.length, url, i, j,
            welcome = /http:\/\/www\.google\.com\/chrome\/intl\/(\w{2,3})\/welcome\.html/,
            webstore= /https:\/\/chrome\.google\.com\/webstore\?hl=(\w{2,3})/;
        $('.cell').css('height', $('.slides__inner').css('height'));

        if (l) {
            topHosts = chrome.extension.getBackgroundPage().topHosts;
        } else {
            $('.speeddial').remove();
        }

        for (i = 0; i < k; i++){
            host = tUri && tUri.getHost(data[i].url);
            url = data[i].url;
            
            if (webstore.test(url) || welcome.test(url) || contains(topHosts, host) || 
                contains(localStorage['remove'], (host + ' '))) 
                continue;

            j = dial.getIndex(host);
            l++;

            if (-1 === j) {
                topHosts.push(host);
                if (localStorage.hasOwnProperty(rkey + encodeURIComponent(host))){
                    dial.add({
                        host    : host,
                        title   : data[i].title,
                        url     : data[i].url,
                        imgdata : (host ? localStorage[ rkey + encodeURIComponent(host) ] : ''),
                        isimgweb: true
                    });
                } else {
                    l--;
                }
            } else {
                dial.add({
                    host    : hash[j].host[0],
                    title   : data[i].title,
                    url     : data[i].url,
                    imgdata : hash[j].imgdata,
                    isimgweb: false
                });
                hash[j].used = true;
                for (var u = 0; u < hash[j].host.length; u++)
                    topHosts.push(hash[j].host[u]);
            }
            dial.chromeTopSites = data.slice(i + 1);
            if (8 === l)
                break;
        }
        var firstindex = 0; k = l;

        for (i = l; i < 8; i++) {
            for (j = firstindex; j < 8; j++){
                if (hostInRemove(localStorage['remove'], hash[j].host))
                    continue
                if (!hash[j].used) {
                    host = hash[j].host[0];
                    dial.add({
                        host    : host,
                        title   : hash[j].title,
                        url     : hash[j].url,
                        imgdata : hash[j].imgdata,
                        isimgweb: false
                    });
                    firstindex = j + 1;
                    k++;
                    topHosts.push(host);
                    hash[j].used = true;
                    break;
                }
            }
        }
        if (k < 8) {
            for (; k < 8; k++)
                dial.dzone.append('<div class="speeddial"><div class="speeddial_screen"></div></div>');
        }
            
        chrome.extension.getBackgroundPage().topHosts = topHosts;
    },

    reestabl: function () {
        var last = localStorage['last_remove'],
            rem  = localStorage['remove'],
            ind  = rem.indexOf(last);
        localStorage['last_remove'] = '';
        if (ind > 0) {
            localStorage['remove'] = rem.substr(0, ind);
            $('.note_cancel').css('display', 'none');
        }
        else
            if (ind == 0) {
                localStorage['remove'] = '';
                dial.closeNote();
            }
            
        dial.loadedTopSites = false;
        for (var i = hash.length; i--;){
            hash[i].used = false;
        }
        chrome.topSites.get(function(data) {
            dial.processTopSites(0, data);
        });
    },

    reestablAll: function () {
        localStorage['last_remove'] = '';
        localStorage['remove'] = '';
        dial.loadedTopSites = false;
        for (var i = hash.length; i--;){
            hash[i].used = false;
        }
        chrome.topSites.get(function(data) {
            dial.processTopSites(0, data);
        });
    },

    start: function() {
        var w = parseInt($('body').css('width')) - 80;
        $('iframe[data-topic]').css('width', w + 'px');
        window.focus();

        dial.loadTimeout = setTimeout(dial.loadTopSites, 50);
    }
};


(function() {
  dial.start();
  setTimeout(function() {
    var frame = $('iframe');
    frame.css({
        'background-image': 'url(gfx/loader.gif)',
        'background-repeat': 'no-repeat',
        'background-position': 'center center'
    });
  }, 1500 );
  $(document).on({
    click: function(){
        var th = $(this),
            link = th.parent();
        if (th.is('.closing'))
            return
        else
            th.addClass('closing');
        dial.del(link);
    }
  }, '.close');
  $(document).on({
    click: function(){
        dial.reestabl();
    }
  }, '.note_cancel');
  $(document).on({
    click: function(){
        dial.reestablAll();
        dial.closeNote();
    }
  }, '.note_reestabl_all');
  $(document).on({
    click: function(){
        dial.closeNote();
    }
  }, '.note_close');
})();