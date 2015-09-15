var _gaq = _gaq || [],
	tabindex = localStorage['rdial_slide_number'] || '0',
	value = 'news';
_gaq.push(['_setAccount', 'UA-18804246-14']);

switch (tabindex) {
	case '0' : {
		value = 'news';
		break;
	}
	case '1': {
		value = 'recommendations';
		break;
	}
	case '2': {
		value = 'topsites';
		break;
	}
}
console.log(value);
_gaq.push(['_setCustomVar', 1, 'tabindex', value]);
_gaq.push(['_trackPageview']);
(function() { 
	var ga = document.createElement('script'); 
	ga.type = 'text/javascript'; 
	ga.async = true; 
	ga.src = 'https://ssl.google-analytics.com/ga.js'; 
	var s = document.getElementsByTagName('script')[0]; 
	s.parentNode.insertBefore(ga, s); 
})();