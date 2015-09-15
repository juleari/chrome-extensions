var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-18804246-13']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    
    function trackButtonClick(e) {
        _gaq.push(['_trackEvent', e.target, 'clicked']);
    };
    
    document.addEventListener('DOMContentLoaded', function(){
        document.getElementsByClassName('b-wid__title')[0].addEventListener('click', trackButtonClick);
        document.getElementsByClassName('g-icn_write')[0].addEventListener('click', trackButtonClick);
        
        var list = document.getElementsByClassName('b-wid__li');
        for (var i = 0; i < list.length; i++){
            list[i].addEventListener('click', trackButtonClick);
        }
    });
})();