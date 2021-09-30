// $(function(){ //eslint-disable-line
//   $('#selectOption').multiselect(); //eslint-disable-line
// });

$(function () { /* eslint-disable-line no-undef */
   $('.selectpicker').selectpicker(); /* eslint-disable-line no-undef */
});


(function($) {



	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();
//eslint-disable-next-line
})(jQuery);
