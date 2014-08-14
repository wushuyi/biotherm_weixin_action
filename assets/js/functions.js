;(function(fun, global) {
	var pgFun = {};
	var $cache = {};
	var pgScroll = [];
	pgFun.pubScroll = function(obj) {
		$cache.mainPg = $('.wrapper');
		if (!obj) {
			pgScroll[0] = new IScroll($cache.mainPg.get(0), {
				click : false,
				preventDefaultException : {
					tagName : /.*/
				},
				bounce : false

			});
		} else {
			pgScroll[0] = new IScroll($cache.mainPg.get(0), {
				click : true,
				bounce : false
			});
		}

		/*
		 * 输入框 提示信息 兼容性处理  by 巫书轶
		 * 用法  tipmsg="str" css : noTip
		 */
		$("input[tipMsg]").each(function() {
			var _thisDom = $(this);
			if (_thisDom.val() == "") {
				var oldVal = _thisDom.attr("tipMsg");
				if (_thisDom.val() == "") {
					_thisDom.attr("value", oldVal).addClass('noTip');
				}
				_thisDom.addClass('noTip').focus(function() {
					if (_thisDom.val() != oldVal) {
						_thisDom.removeClass('noTip');
					} else {
						_thisDom.val("").addClass('noTip');
					}
				}).blur(function() {
					if (_thisDom.val() == "") {
						_thisDom.val(oldVal).addClass('noTip');
					}
				}).keydown(function() {
					_thisDom.removeClass('noTip');
				});
			}
		});

	};
	pgFun.index = function() {
		this.pubScroll();
		$cache.yxgzBtn = $('.yxgzBtn');
		$cache.pop = $('#pop');
		$cache.infoCent = $('.info .js .cent');
		$cache.popHdxq = $('.popHdxq', $cache.pop);
		$cache.popHdxqX = $('.popHdxqX', $cache.popHdxqX);
		pgScroll[1] = new IScroll($cache.pop.get(0), {
			click : true,
			bounce : false
		});
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
	pgFun.regmobile = function() {
		this.pubScroll();
	};
	pgFun.upload = function() {
		this.pubScroll(false);
		var imgArr = [];
		$cache.upImg = $('#upImg');
		$cache.imgList = $('.imgList', $cache.upImg);
		$cache.imgListUl = $('ul', $cache.imgList);
		$cache.addImg = $('.add', $cache.upImg);
		$cache.delImg = $('.del', $cache.upImg);
		$cache.subImg = $('.subImg', $cache.upImg);
		$cache.subImg.on('change', function(e) {
			if (imgArr.length >= 9) {
				alert('对不起, 最多只能上传9张!');
				return;
			}
			var file = e.target.files[0];
			var reader = new FileReader();
			var image;
			reader.readAsDataURL(file);
			reader.onload = function() {
				toBase64(reader);
			};
			$(this).val('');
			function toBase64(base64) {
				var imgsrc = base64.result;
				//console.log(imgsrc);
				image = new Image();
				image.onload = function() {
					imageLoad(image);
				};
				image.src = imgsrc;
			};
			function imageLoad(img) {
				var imgW = img.width, imgH = img.height;
				if (imgW > 640) {
					var scal = 640 / imgW;
					imgW *= scal;
					imgH *= scal;
				}
				var canvas = document.createElement('canvas');
				canvas.setAttribute('width', imgW + 'px');
				canvas.setAttribute('height', imgH + 'px');
				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0, imgW, imgH);
				context.save();
				var imgdata = canvas.toDataURL('image/jpeg', 1);
				var html = $('<li><b>X</b></li>').css('backgroundImage', 'url("' + imgdata + '")');
				$cache.imgListUl.append(html);
				imgArr.push('test');
			}

		});
		$cache.imgList.on('click', 'b', function(e) {
			console.log(e);
			$(this).parent('li').remove();
		});
		/*
		 function toBase64(){
		 console.log(reader);
		 var imgsrc = reader.result;
		 console.log(imgsrc);
		 var html = $('<li></li>').css('backgroundImage' , 'url("'+imgsrc+'")');
		 console.log(html);
		 $cache.imgListUl.append(html);
		 };
		 */
		/*
		 $cache.upImg.on('click', function(e) {
		 $cache.imgListUl.append('<li></li>');
		 $cache.imgListLi = $('li', $cache.imgList);
		 var boxH = $cache.imgListLi.outerHeight();
		 var boxNum = $cache.imgListLi.size();
		 if (!(boxNum % 3)) {

		 }
		 console.log(boxNum);
		 });
		 */
	};
	pgFun.taskrank = function(){
		this.pubScroll();
	}
	pgFun.taskhistory = function(){
		this.pubScroll();
	}
	global[fun] = pgFun;
	global['pgScroll'] = pgScroll;
})('fun', this);

;(function($) {
	$(document).ready(function() {
		var pgNameList = {
			'index' : 'index',
			'regmobile' : 'regmobile',
			'upload' : 'upload',
			'taskrank' : 'taskrank',
			'taskhistory': 'taskhistory'
		};
		var pgName = window.pgName;
		fun[pgNameList[pgName]]();
	});
})(window.jQuery);
