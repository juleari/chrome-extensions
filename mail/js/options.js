(function(){
	var init = function(callback){
		if (localStorage['notify'] == "true"){
			$('.notify__control').addClass('notify__control_on');
		}
		setTimeout(callback, 100);
	}

	var trans = function() {
		$('.notify__control').addClass('notify__control_transition')
	};

	$(document).on({
		click : function(){
			var th 		= $(this),
				checked = th.is('.notify__control_on');
  			
			localStorage["notify"] = !checked;

			(checked) ?
				th.removeClass('notify__control_on') :
				th.addClass('notify__control_on');
		}
	}, '.notify__control');

	init(trans);
}());