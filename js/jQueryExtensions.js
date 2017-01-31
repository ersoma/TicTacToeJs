// Extend the jQuery object for animate.css (https://github.com/daneden/animate.css#usage)
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

// Extend the jQuery object for Array.reduce support (https://gist.github.com/johnhunter/649811)
(function ($) {
	$.reduce = function(arr, fnReduce, valueInitial) {
		if (Array.prototype.reduce) {
			return Array.prototype.reduce.call(arr, fnReduce, valueInitial);
		}	
		$.each(arr, function(i, value) {
			valueInitial = fnReduce.call(null, valueInitial, value, i, arr);
		});
		return valueInitial;
	};
})(jQuery);