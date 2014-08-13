;(function(fun, global) {
	var pgFun = {};
	var $cache = {};
	var pgScroll = [];
	pgFun.pubScroll = function() {
		pgScroll[0] = new IScroll('.wrapper', {
			click : true,
			bounce : false
		});
		pgScroll[1] = new IScroll('#pop', {
			click : true,
			bounce : false
		});
	};
	pgFun.index = function() {
		this.pubScroll();
		$cache.yxgzBtn = $('.yxgzBtn');
		$cache.pop = $('#pop');
		$cache.infoCent = $('.info .js .cent');
		$cache.popHdxq = $('.popHdxq', $cache.pop);
		$cache.popHdxqX = $('.popHdxqX', $cache.popHdxqX);
		console.log($cache.yxgzBtn);
		$cache.yxgzBtn.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$cache.pop.show();
			$cache.popHdxq.show();
			pgScroll[0].disable();
			pgScroll[1].refresh();
		});
		$cache.popHdxqX.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$cache.pop.hide();
			$cache.popHdxq.hide();
			pgScroll[0].enable();
		});
		/*
		$.getJSON("http://task.wangfan.com/task.ashx", function(data) {
			console.log(data);
			$cache.infoCent.append(data.jsonResponse.taskcontent).append('<img src="'+data.jsonResponse.taskbigimg+'" />');
		});
		*/
	};
	global[fun] = pgFun;
})('fun', this);

;(function($) {

	$(document).ready(function() {

		fun.index();
	});

})(window.jQuery);
