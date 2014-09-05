;(function() {
	//alert(window.document.cookie);
	//alert(window.location.href);

	// 判断浏览器是否为微信浏览器
	window.pgLock = false;
	var url = $.url();
	var isdebug = url.fparam('isdebug');
	var is_weixin = (function() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	})();

	var have_openid = (function() {
		if ($.cookie('biothermOpenID')) {
			return true;
		} else {
			return false;
		}
	})();

	if (isdebug) {
		if (!have_openid) {
			window.location.href = '../Handler.ashx';
		}
	} else {
		if (!is_weixin) {
			//alert('请在微信浏览器中打开活动网页!');
			//window.location.href = 'http://m.biotherm.com.cn/';
		} else if (!have_openid) {
			window.location.href = '../Handler.ashx';
		} else {
			window.pgLock = true;
			
		}
	}
	
	window.pgLock = true;
	
	
	/* 百度统计 */
	var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
	document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fb815daa1d02964fc5048838a34259329' type='text/javascript'%3E%3C/script%3E"));
	$(document).ready(function(){
		//$('body a:eq(0)').hide();
	});
})();

;(function(fun, scroll, global) {
	var inface = {};
	var pgFun = {};
	var $cache = {};
	var pgScroll = [];
	pgFun.getPath = function(){
		var pathFun = {
			full: null,
			absolute: (function() {
				var arry = window.location.href.split('/');
				var len = arry.length - 1;
				var path = '';
				for (var i = 0; i < len; i++) {
					path += arry[i] + "/";
				}
				return path;
			})(),
			relative: (function() {
				var re = new RegExp('functions(\.min)?\.js.*'),
				scripts = document.getElementsByTagName('script');
				for (var i = 0, ii = scripts.length; i < ii; i++) {
					var path = scripts[i].getAttribute('src');
					if (re.test(path)){
						return path.replace(re, '');
					}
				}
			})()
		};
		pathFun.full = pathFun.absolute +  pathFun.relative;
		window['urlpath'] = pathFun;
	}
	pgFun.setShare = function(){
		/*
		 *	开启微信菜单
		*/
		function onBridgeReady(){
			WeixinJSBridge.call('showOptionMenu');
		}
		
		if (typeof WeixinJSBridge == "undefined"){
			if( document.addEventListener ){
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			}else if (document.attachEvent){
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		}else{
			onBridgeReady();
		}
		/*
		* 开启微信分享
		*/
		
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			/*
			window.shareData = {
				"imgUrl" : urlpath.full + "../image/share/weixin.jpg",
				"timeLineLink" : urlpath.absolute + "hdxq.html",
				"sendFriendLink" : urlpath.absolute + "hdxq.html",
				"weiboLink" : urlpath.absolute + "hdxq.html",
				"tTitle" : "碧欧泉七夕礼遇，给TA一场非同寻常的告白！",
				"tContent" : "碧欧泉告诉你，爱要大声说出来，立刻对TA说出你的七夕泉心密语！",
				"fTitle" : "碧欧泉七夕礼遇，给TA一场非同寻常的告白！",
				"fContent" : "碧欧泉告诉你，爱要大声说出来，立刻对TA说出你的七夕泉心密语！",
				"wContent" : "碧欧泉告诉你，爱要大声说出来，立刻对TA说出你的七夕泉心密语！"
			};
			*/
			// 发送给好友
			WeixinJSBridge.on('menu:share:appmessage', function(argv) {
				WeixinJSBridge.invoke('sendAppMessage', {
					"img_url" : window.shareData.imgUrl,
					"link" : window.shareData.sendFriendLink,
					"desc" : window.shareData.fContent,
					"title" : window.shareData.fTitle
				}, function(res) {
					_report('send_msg', res.err_msg);
				})
			});
			// 分享到朋友圈
			WeixinJSBridge.on('menu:share:timeline', function(argv) {
				WeixinJSBridge.invoke('shareTimeline', {
					"img_url" : window.shareData.imgUrl,
					"img_width" : "640",
					"img_height" : "640",
					"link" : window.shareData.timeLineLink,
					"desc" : window.shareData.tContent,
					"title" : window.shareData.tTitle
				}, function(res) {
					_report('timeline', res.err_msg);
				});
			});
			// 分享到微博
			WeixinJSBridge.on('menu:share:weibo', function(argv) {
				WeixinJSBridge.invoke('shareWeibo', {
					"content" : window.shareData.wContent,
					"url" : window.shareData.weiboLink,
				}, function(res) {
					_report('weibo', res.err_msg);
				});
			});
		}, false);
	};
	pgFun.pubInit = function() {
		this.getPath();
		/*
		 * 输入框 提示信息 兼容性处理  by 巫书轶
		 * 用法  tipmsg="str" css : noTip
		 */
		 /*
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
			*/
		/*
		 *	隐藏微信菜单
		*/
		function onBridgeReady(){
			WeixinJSBridge.call('hideOptionMenu');
		}
		
		if (typeof WeixinJSBridge == "undefined"){
			if( document.addEventListener ){
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			}else if (document.attachEvent){
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		}else{
			onBridgeReady();
		}
	};
	pgFun.onLoad = function(){
		$cache.load = $('#loading');
		setTimeout(function(){
			$cache.load.addClass('close');
			setTimeout(function(){
				$cache.load.hide();
			}, 1000);
		}, 2000);
	};
	pgFun.pubScroll = function(obj) {
		$cache.mainPg = $('.wrapper');
		if (obj == false) {
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
	};
	pgFun.index = function() {
		this.pubInit();
		this.pubScroll();
		$cache.yxgzBtn = $('.yxgzBtn');
		$cache.pop = $('#pop');
		$cache.centBox = $('.centBox');
		$cache.taskName = $('.rw .cent', $cache.centBox);
		$cache.taskDate = $('.sj .cent', $cache.centBox);
		$cache.taskCent = $('.topCent', $cache.centBox);
		$cache.lqrwBtn = $('.lqrwBtn', $cache.centBox);
		$cache.mainPic = $('.mainPic', $cache.centBox);
		$cache.popShare2 = $('.popShare2', $cache.pop);
		$cache.popHdxq = $('.popHdxq', $cache.pop);
		$cache.popHdxqX = $('.popHdxqX', $cache.popHdxqX);
		
		var isFocus = false;

		function getDate(start, end) {
			var startdate = start.split(' ')[0].split('-').join('.');
			var enddate = end.split(' ')[0].split('-').join('.');
			return startdate + '-' + enddate;
		};
		
		$.ajax({
			type : "POST",
			dataType : 'json',
			url : "../issubscribe.ashx",
			success : function(data) {
				if (data.result == 'success') {
					isFocus = true;
				} else if (data.result == 'failed') {
					switch(data.jsonResponse) {
						case 'no subscribe':
							isFocus = false;
							break;
						default:
							alert('服务器错误!');
					};
				}
			},
			error : function() {
				alert('加载失败,请检查您的网络!');
			}
		});
		
		$.ajax({
			type : "GET",
			dataType : 'json',
			url : "../task.ashx",
			cache : false,
			success : function(data) {
				if (data.result == 'success') {
					var result = data.jsonResponse;
					//console.log(result);
					var taskDate = getDate(result.taskstartdate, result.taskdate);
					$cache.taskName.html(result.taskname);
					$cache.taskDate.html(taskDate);
					$cache.taskCent.html(result.taskcontent);
					$cache.mainPic.attr('src', '../'+result.taskbigimg);
					$.cookie('taskid', result.id);
					switch(result.state) {
						case 'no get':
							var lqrwBtnLock = false;
							$cache.lqrwBtn.html('领取任务').on('click', function(e) {
								if(!isFocus){
									//alert('请先关注碧欧泉官方公众账号!');
									$cache.pop.show();
									$cache.popShare2.show();
									setTimeout(function() {
										$cache.pop.hide();
										$cache.popShare2.hide();
										pgScroll[0].enable();
									}, 5000);
									return false;
								}
								if(lqrwBtnLock){
									return false;
								}
								lqrwBtnLock = true;
								var data = {
									taskid : $.cookie('taskid')
								};
								$.ajax({
									type : "POST",
									dataType : 'json',
									data : data,
									url : "../gettask.ashx",
									success : function(data) {
										lqrwBtnLock = false;
										if (data.result == 'success') {
											//alert('任务领取成功!');
											window.location.href = './main.html#type=share';
										} else if (data.result == 'failed') {
											if (data.jsonResponse == 'no reg') {
												//alert('请先绑定手机再进行任务!');
												window.location.href = './regmobile.html';
											} else if (data.jsonResponse == 'have get') {
												alert('您已经领取过该任务!');
											} else {
												alert('未知参数: ' + data.jsonResponse);
											}
										} else {
											alert('服务器错误!');
										}
									},
									error : function() {
										lqrwBtnLock = false;
										alert('加载失败,请检查您的网络!');
									}
								});
							});
							break;
						case 'no submit':
							$cache.lqrwBtn.html('继续任务').on('click', function() {
								window.location.href = './upload.html';
							});
							break;
						case 'have submit':
							$cache.lqrwBtn.html('分享成果').on('click', function() {
								window.location.href = './main.html#type=self&taskid='+$.cookie('taskid');
							});
							break;
						case 'over':
							$cache.lqrwBtn.html('活动过期').css('backgroundColor', '#969A9F');
							break;
						default:
					}
					var share = {
						imgUrl : urlpath.absolute + '../' + result.tasksmallimg,
						timeLineLink : urlpath.absolute + "index.html#source=weixin",
						sendFriendLink : urlpath.absolute + "index.html#source=weixin",
						weiboLink : urlpath.absolute + "index.html#source=weixin",
						tTitle : result.taskdesp,
						tContent : result.taskdesp,
						fTitle : result.taskdesp,
						fContent : result.taskdesp,
						wContent : result.taskdesp,
					};
					window.shareData = share;
					pgFun.setShare();
				} else if (data.result == 'failed') {
					var result = data.jsonResponse;
					if (result == "no task") {
						alert('当前没有任务!');
					} else {
						alert('未知返回!');
					}
				} else {
					alert('服务器错误!');
				}
				pgFun.onLoad();
			},
			error : function() {
				alert('加载失败,请检查您的网络!');
			}
		});

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
	};
	pgFun.regmobile = function() {
		this.pubInit();
		this.pubScroll();
		$cache.upBox = $('#updata');
		$cache.mobile = $('input.mobile', $cache.upBox);
		$cache.code = $('input.code', $cache.upBox);
		$cache.subCode = $('button.subCode', $cache.upBox);
		$cache.subAll = $('button.subAll', $cache.upBox);
		pgFun.onLoad();
		var subAllLock = false;
		$cache.subAll.on('click', function(e) {
			var mobile = $cache.mobile.val();
			var code = $cache.code.val();
			if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(mobile)) {
				alert('手机号码输入有误!');
				$cache.mobile.focus();
				return false;
			};
			if ($.trim(code).length == 0 || code == '请输入验证码') {
				alert('请输入验证码!');
				$cache.subCode.focus();
				return false;
			};
			if (subAllLock) {
				return false;
			}
			subAllLock = true;
			var data = {
				taskid : $.cookie('taskid'),
				code : code.toUpperCase(),
				mobile : mobile
			};
			$.ajax({
				type : "POST",
				dataType : 'json',
				url : "../bindinggettask.ashx",
				data : data,
				success : function(data) {
					subAllLock = false;
					if (data.result == 'success') {
						//alert('绑定成功!');
						window.location.href = 'main.html#type=share';
					} else if (data.result == 'failed') {
						switch(data.jsonResponse) {
							case 'error code':
								alert('验证码错误!');
								break;
							case 'code overdue':
								alert('验证码过期!');
								break;
							case 'binding error':
								alert('绑定错误!');
								break;
							case 'binding error':
								alert('系统错误!');
								break;
							default:
						}
					} else {
						alert('服务器错误!');
					}
				},
				error : function() {
					subAllLock = false;
					alert('加载失败,请检查您的网络!');
				}
			});
		});
		var subCodeLock = false;
		$cache.subCode.on('click', function(e) {
			var mobile = $cache.mobile.val();
			if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(mobile)) {
				alert('手机号码输入有误!');
				$cache.mobile.focus();
				return false;
			};
			if (subCodeLock) {
				return false;
			}
			subCodeLock = true;
			var data = {
				mobile : mobile
			};
			
			function bindreg() {
				$.ajax({
					type : "POST",
					dataType : 'json',
					url : "../sendmsg.ashx",
					data : data,
					success : function(data) {
						if (data.result == 'success') {
							var num = 60;
							$cache.subCode.css('backgroundColor', '#C9C9C9');
							var clock = setInterval(function() {
								$cache.subCode.html(num + 's 重新获取');
								num -= 1;
								if (num == 0) {
									clearInterval(clock);
									$cache.subCode.html('获取验证码').removeAttr('style');
									subCodeLock = false;
								}
							}, 1000);
						} else if (data.result == 'failed') {
							subCodeLock = false;
							alert('服务器错误!');
						}
					},
					error : function() {
						subCodeLock = false;
						alert('加载失败,请检查您的网络!');
					}
				});
			};
			
			$.ajax({
				type: "POST",
				dataType : 'json',
				url : "../IsMobileBind.ashx",
				data : data,
				success : function(data) {
					if (data.result == 'success') {
						bindreg();
					} else if (data.result == 'failed') {
						subCodeLock = false;
						if(data.jsonResponse == "mobile bind exist"){
							alert("对不起,该号码已绑定其他微信号!");
						}else{
							alert('服务器错误!');
						}
					}
				},
				error : function() {
					subCodeLock = false;
					alert('加载失败,请检查您的网络!');
				}
			});
		});
	};
	pgFun.upload = function() {
		/*
		if(document.referrer.indexOf('index.html') == -1){
			window.location.href = './index.html';
		}
		*/
		this.pubInit();
		this.pubScroll(false);
		var imgArr = [];
		var imgW, imgH, scale, status=0, imgLock = true, image, imgsrc, file;;
		
        Array.prototype.taskRemove = function(dx) {
            　		if(isNaN(dx)||dx>this.length){return false;}
            　　		for(var i=0,n=0;i<this.length;i++)
                　		　{
            　　		　　if(this[i]!=this[dx])
                    　　		　　{
                　	　　　　　this[n++]=this[i]
                　		　　　}
            　		　}
            　		　this.length-=1
            　		};
		
		$cache.upImg = $('#upImg');
		$cache.textCent = $('#upload .cent');
		$cache.imgList = $('.imgList', $cache.upImg);
		$cache.imgListUl = $('ul', $cache.imgList);
		//$cache.addImg = $('.add', $cache.upImg);
		$cache.delImg = $('.del', $cache.upImg);
		$cache.subImg = $('.subImg', $cache.upImg);
		$cache.submit = $('.submit', $cache.upImg);
		
		$cache.review = $('#review');
		$cache.img = $('.img', $cache.review);
		
		$cache.btn_X = $('.close', $cache.review);
		$cache.btn_L = $('.left', $cache.review);
		$cache.btn_R = $('.right', $cache.review);
		$cache.btn_sub = $('.submit', $cache.review);
		
		var submitLock = false;
		var taskid = $.cookie('taskid');
		var data = {
			taskid: taskid
		};
		$.ajax({
			type : "POST",
			dataType : 'json',
			url : "../getusertask.ashx",
			data : data,
			success : function(data) {
				//console.log(data);
				if (data.result == 'success') {
					var result = data.jsonResponse;
					if(result.state != 0){
						//$cache.submit.html("您已经发布任务请勿重复提交").css('backgroundColor', '#c2c2c2');
						//submitLock = true;
						//window.location.href = './index.html';
					}
					var img, imgIndex = 0, imgList = '';
					for (img in result) {
						imgIndex += 1;
						if (/img\d/.test(img) && result[img] != null) {
							imgList += '<li id="img' + imgIndex + '" style="background-image: url(../' + result[img] + ');"><b>X</b></li>';
							imgArr.push(result[img]);
						}
					}
					$('.cent', $cache.titBox).html(result.content);
					$cache.imgListUl.html(imgList);
					pgScroll[0].refresh();
				} else if (data.result == 'failed') {
					alert('服务器错误!');
				}
				pgFun.onLoad();
			},
			error : function() {
				alert('加载失败,请检查您的网络!');
			}
		});

		$cache.subImg.on('change', function(e){
			if (imgArr.length >= 9) {
				alert('对不起, 最多只能上传9张!');
				return;
			}
			$cache.review.show();
			file = e.target.files[0];
			if(!file){ return false; }
			//console.log(file);
			var URL = window.URL || window.webkitURL;
			imgsrc = URL.createObjectURL(file);
			image = new Image();
			image.onload = function() {
				//imageLoad(this);
				imgLock = false;
				$cache.img.css('backgroundImage', 'url('+imgsrc+')');
				imgW = image.width;
				imgH = image.height;
				scale = imgW / imgH;
				//console.log(scale);
			};
			image.src = imgsrc;
			//console.log(imgsrc);
		});
		$cache.btn_L.on('click', function(e){
			if(imgLock){ return false; }
            status == 0 ? status = 3 :  status -= 1;
			vImg();
		});
		$cache.btn_R.on('click', function(e){
			if(imgLock){ return false; }
            status == 3 ? status = 0 :  status += 1;
			vImg();
		});
		$cache.btn_X.on('click', function(e){
			$cache.subImg.val('');
			$cache.review.hide();
			status = 0;
			vImg();
			
		});
		$cache.btn_sub.on('click', function(e){
			$cache.subImg.val('');
			$cache.review.hide();
			imageLoad(image);
			status = 0;
			vImg();
		});
		
		function vImg(){
			var style = {};
			switch(status){
				case 0:
					style = {
						transform : 'rotate(0deg)'
					};
					break;
				case 1:
					style = {
						transform : 'rotate(90deg) scale('+scale+')'
					};
					break;
				case 2:
					style = {
						transform : 'rotate(180deg)'
					};
					break;
				case 3:
					style = {
						transform : 'rotate(270deg) scale('+scale+')'
					};
					break;
			}
			$cache.img.css(style);
		}

		function imageLoad(img){
            var imgW = img.width, imgH = img.height, imgWBig = false, mpImgSet;
            if(imgW > imgH){
                imgWBig = true
            }
			var liTmp = $('<li>0%</li>').css({
				'text-align': 'center',
				'line-height': '120px',
				'background-color': '#222222'
			});
			$cache.imgListUl.append(liTmp);
			pgScroll[0].refresh();
            var test = document.createElement('img');
            var mpImg = new MegaPixImage(file);
			switch(status){
				case 0:
                    if(imgWBig){
                        mpImgSet = { maxWidth: 640, orientation: 1};
                    }else{
                        mpImgSet = { maxHeight: 640, orientation: 1};
                    }
					break;
				case 1:
                    if(imgWBig){
                        mpImgSet = { maxWidth: 640, orientation: 6};
                    }else{
                        mpImgSet = { maxHeight: 640, orientation: 6};
                    }
                    break;
				case 2:
                    if(imgWBig){
                        mpImgSet = { maxWidth: 640, orientation: 3};
                    }else{
                        mpImgSet = { maxHeight: 640, orientation: 3};
                    }
					break;
				case 3:
                    if(imgWBig){
                        mpImgSet = { maxWidth: 640, orientation: 8};
                    }else{
                        mpImgSet = { maxHeight: 640, orientation: 8};
                    }
					break;
				default:
			}
            mpImg.render(test, mpImgSet);
		}
        // 事件驱动 图片压缩旋转处理
        window.myData = window.myData || {};
        $(window.myData).bind('imgOk', function(e, imgdata){
            $cache.thisImgListLi = $('li:last', $cache.imgListUl);
            var data = {
                imgstr : imgdata,
                taskid : taskid
            };
            $.ajax({
                type : 'POST',
                url : "../uploadtaskimgBase.ashx",
                dataType : 'json',
                data : data,
                xhr : function() {
                     // 计算上传进度
                    var xhrobj = $.ajaxSettings.xhr();
                    if (xhrobj.upload) {
                        xhrobj.upload.addEventListener('progress', function(event) {
                            var percent = 0;
                            var position = event.loaded || event.position;
                            var total = event.total || e.totalSize;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }
                            //$('.cent').html(percent);
                            $cache.thisImgListLi.html(percent+'%');
                        }, false);
                    }
                    return xhrobj;
                },
                success : function(data) {
                    if (data.result == 'success') {
                        $cache.thisImgListLi.removeAttr('style').html('<b>X</b>').css('backgroundImage', 'url("' + imgdata + '")');
                        imgArr.push(data.jsonResponse);
                    }else if(data.result == 'failed') {
                        alert('上传失败!');
                    }else {
                        alert('服务器错误!');
                    }
                },
                error : function() {
                    alert('上传失败,请检查您的网络!');
                }
            });
        });
		
		$cache.imgList.on('click', 'b', function(e) {
			var thisLi = $(this).parent('li');
			var index = thisLi.index();
			var data = {
				taskid : taskid,
				imgurl : imgArr[index] 
			};
			console.log(data);
			$.ajax({
				type : "POST",
				url : "../deltaskimg.ashx",
				dataType : 'json',
				data : data,
				success : function(data) {
					if (data.result == 'success') {
						//alert('ok');
						imgArr.taskRemove(index);
						//console.log(thisLi);
						thisLi.remove();
						//console.log(imgArr);
					} else if (data.result == 'failed') {
						alert('删除失败!');
					} else {
						alert('服务器错误!');
					}
				},
				error : function() {
					alert('加载失败,请检查您的网络!');
				}
			});
		});
		$cache.submit.on('click', function(e) {
			if(submitLock){
				return false;
			}
			if($cache.textCent.val().length == ''){
				alert('请写一些东西吧!');
				$cache.textCent.focus();
				return false;
			}
			var data = {
				content: $cache.textCent.val(),
				taskid: taskid
			};
			for (var i = 0; i <= imgArr.length; i++) {
				var key = 'img' + (i + 1);
				data[key] = imgArr[i];
			}
			$.ajax({
				type : "POST",
				url : "../tasksubmit.ashx",
				dataType : 'json',
				data : data,
				success : function(data) {
					if (data.result == 'success') {
						//alert("发布任务成功!");
						window.location.href = './main.html#type=init&taskid='+$.cookie('taskid');
					} else if (data.result == 'failed') {
						alert('服务器错误!');
					}
				},
				error : function() {
					alert('加载失败,请检查您的网络!');
				}
			});
		});
	};
	pgFun.taskrank = function() {
		this.pubInit();
		this.pubScroll();
		$cache.rankBox = $('#rankBox');
		$cache.tmpHtml = $($('#tmp1').html());
		$cache.rankCent = $('.rankCent', $cache.rankBox);
		$cache.resultHtml = '';
		var data = {
			Taskid : $.cookie('taskid')
		};
		$.ajax({
			type : "POST",
			dataType : 'json',
			url : "../taskrank.ashx",
			//url : "./assets/json/taskrank.js",
			data : data,
			success : function(data) {
				//console.log(data);
				if (data.result == 'success') {
					var result = data.jsonResponse;
					var rows = result.Rows;
					var key;
					for (key in rows) {
						var row = rows[key];
						var img, imgArr = [], imgList = '';
						for (img in row) {
							if (/img\d/.test(img) && row[img] != null) {
								//imgArr.push(row[img]);
								imgList += '<li style="background-image: url(../' + row[img] + ');"></li>';
							}
						}
						//console.log(imgArr);
						//console.log(rows[key]);
						$cache.tmpHtml.attr('id', row.id);
						$cache.tmpHtml.attr('openid', row.openid);
						$('.index', $cache.tmpHtml).html(row.rank);
						$('.name', $cache.tmpHtml).html(row.username);
						if(row.userimg){
							$('.portrait', $cache.tmpHtml).css('backgroundImage', 'url('+row.userimg+')');
						}else{
							$('.portrait', $cache.tmpHtml).css('backgroundImage', 'url(./assets/image/no_img.jpg)');
						}
						$('.tit', $cache.tmpHtml).html(row.taskname);
						$('.cent', $cache.tmpHtml).html(row.content);
						$('.num', $cache.tmpHtml).html(row.lovenum);
						$('.imgBox ul', $cache.tmpHtml).html(imgList);
						$cache.resultHtml += $cache.tmpHtml.prop("outerHTML");
					}
					$cache.rankCent.append($cache.resultHtml);
					pgScroll[0].refresh();
				} else if (data.result == 'failed') {
					var result = data.jsonResponse;
					if(result == "no data"){
						alert("排名未开始!");
						window.location.href = "./index.html";
					}else{
						alert('服务器错误!');
					}
						
				}
				pgFun.onLoad();
			},
			error : function() {
				alert('加载失败,请检查您的网络!');
			}
		});
		$cache.rankCent.on('click', '.rankInfo', function(){
			var $self = $(this);
			var taskid = $self.attr('id');
			window.location.href = "main.html#type=other&taskuserid="+taskid;
		});
	};
	pgFun.taskhistory = function() {
		this.pubInit();
		this.pubScroll();
		$cache.rankBox = $('#rankBox');
		$cache.tmpHtml = $($('#tmp1').html());
		$cache.rankCent = $('.rankCent', $cache.rankBox);
		$cache.resultHtml = '';

		function getMouth(mouth) {
			var mNum = mouth.split('-')[1];
			var test = mNum.split('')[0];
			var num;
			if (test == 0) {
				num = mNum.split('')[1];
			} else {
				num = test;
			}
			return num;
		};
		$.ajax({
			type : "GET",
			dataType : 'json',
			url : "../taskhistory.ashx",
			//url : "./assets/json/taskhistory.js",
			cache : false,
			success : function(data) {
				//console.log(data);
				if (data.result == 'success') {
					var result = data.jsonResponse;
					var rows = result.Rows;
					var key;
					for (key in rows) {
						var row = rows[key];
						//console.log(rows[key]);
						$cache.tmpHtml.attr('id', row.id);
						$('.mouth', $cache.tmpHtml).html(getMouth(row.taskstartdate) + '月');
						$('.rw .cent', $cache.tmpHtml).html(row.taskname);
						$('.jj .cent', $cache.tmpHtml).html(row.taskcontent.replace(/<[^>]+>/g,""));
						$('.imgBox ul', $cache.tmpHtml).html('<li style="background-image: url(../' + row.tasksmallimg + ');"></li>');
						$('.num', $cache.tmpHtml).html(row.usernum);
						$cache.resultHtml += $cache.tmpHtml.prop("outerHTML");
					}
					$cache.rankCent.append($cache.resultHtml);
					pgScroll[0].refresh();
				} else if (data.result == 'failed') {
					alert('服务器错误!');
				}
				pgFun.onLoad();
			},
			error : function() {
				alert('加载失败,请检查您的网络!');
			}
		});
		
		$cache.rankCent.on('click', '.rankInfo', function(){
			var $self = $(this);
			var taskid = $self.attr('id');
			$.cookie('taskid', taskid);
			window.location.href = "taskrank.html";
		});
	};
	pgFun.main = function() {
		this.pubInit();
		this.pubScroll();
		$cache.titBox = $('#titBox');
		$cache.imgBox = $('#imgBox ul');
		$cache.imgBoxLi = $('li', $cache.imgBox);
		$cache.pop = $('#pop');
		$cache.popShare1 = $('.popShare1', $cache.pop);
		$cache.popShare2 = $('.popShare2', $cache.pop);
		$cache.zoomImg = $('#zoomImg');
		$cache.imgBoxX = $('.imgBoxX', '#zoomImg');
		$cache.zoomImgUl = $('ul', $cache.zoomImg);
		var url = $.url();
		var pgType = url.fparam('type');
		
		function zoomImg(){
			$cache.zoomImgLi = $('li', $cache.zoomImgUl);
			$cache.zoomImgUl.width($cache.zoomImgLi.size() * 640);
			pgScroll[1] = new IScroll($cache.zoomImg.get(0), {
				scrollX : true,
				scrollY : false,
				click : true,
				momentum : false,
				snap : true,
				snapSeed : 400,
				keyBindings : true
			});
			//console.log($cache.imgBoxLi);
			$cache.imgBox.on('click', 'li', function(e) {
				pgScroll[0].disable();
				var $self = $(this);
				var index = $self.index();
				$cache.zoomImg.show();
				pgScroll[1].refresh();
				pgScroll[1].scrollToElement($('li', $cache.zoomImgUl).eq(index).get(0), 0);
			});
			$cache.imgBoxX.on('click', function(e) {
				pgScroll[0].enable();
				$cache.zoomImg.hide();
			});
		};
		function getusertask() {
			var taskid = url.fparam('taskid');
			if (!taskid) {
				return false;
			}
			var data = {
				taskid: taskid
			};
			$.ajax({
				type : "POST",
				dataType : 'json',
				url : "../getusertask.ashx",
				data : data,
				success : function(data) {
					//console.log(data);
					if (data.result == 'success') {
						var result = data.jsonResponse;
						var img, imgIndex = 0, imgList = '';
						for (img in result) {
							imgIndex += 1;
							if (/img\d/.test(img) && result[img] != null) {
								imgList += '<li id="img' + imgIndex + '" style="background-image: url(../' + result[img] + ');"></li>';
							}
						}
						$.cookie('taskShareId', result.id);
						//$cache.titBox.attr('taskid', result.id);
						$('.name', $cache.titBox).html(result.username);
						if(result.userimg){
							$('.portrait', $cache.titBox).css('backgroundImage', 'url('+result.userimg+')');
						}
						$('.title', $cache.titBox).html(result.taskname);
						$('.cent', $cache.titBox).html(result.content);
						$('.numBox .num').html(result.lovenum);
						
						$cache.imgBox.html(imgList);
						$cache.zoomImgUl.html(imgList);
						zoomImg();
						pgScroll[0].refresh();
						var taskuserid = $.cookie('taskShareId');
						var share = {
							imgUrl : urlpath.absolute + '../' + result.tasksmallimg,
							timeLineLink : urlpath.absolute + "main.html#source=weixin&type=other&taskuserid="+taskuserid,
							sendFriendLink : urlpath.absolute + "main.html#source=weixin&type=other&taskuserid="+taskuserid,
							weiboLink : urlpath.absolute + "main.html#source=weixin&type=other&taskuserid="+taskuserid,
							tTitle : result.taskdesp,
							tContent : result.taskdesp,
							fTitle : result.taskdesp,
							fContent : result.taskdesp,
							wContent : result.taskdesp,
						};
						window.shareData = share;
						//console.log(share);
						pgFun.setShare();
					} else if (data.result == 'failed') {
						alert('服务器错误!');
					}
					pgFun.onLoad();
				},
				error : function() {
					alert('加载失败,请检查您的网络!');
				}
			});
		};
		
		function getusertaskfriend(){
			var taskuserid = url.fparam('taskuserid');
			if (!taskuserid) {
				return false;
			}
			var data = {
				taskuserid: taskuserid
			};
			//console.log(data);
			$.ajax({
				type : "POST",
				dataType : 'json',
				url : "../getusertaskfriend.ashx",
				data : data,
				success : function(data) {
					//console.log(data);
					if (data.result == 'success') {
						var result = data.jsonResponse;
						var img, imgIndex = 0, imgList = '';
						for (img in result) {
							imgIndex += 1;
							if (/img\d/.test(img) && result[img] != null) {
								imgList += '<li id="img' + imgIndex + '" style="background-image: url(../' + result[img] + ');"></li>';
							}
						}
						$cache.titBox.attr('taskid', result.id);
						$('.name', $cache.titBox).html(result.username);
						if(result.userimg){
							$('.portrait', $cache.titBox).css('backgroundImage', 'url('+result.userimg+')');
						}
						$('.title', $cache.titBox).html(result.taskname);
						$('.cent', $cache.titBox).html(result.content);
						$cache.loveBtn = $('.loveBtn .num');
						$cache.loveBtn.html(result.lovenum);
						$cache.imgBox.html(imgList);
						$cache.zoomImgUl.html(imgList);
						zoomImg();
						pgScroll[0].refresh();
						
						var share = {
							imgUrl : urlpath.absolute + '../' + result.tasksmallimg,
							timeLineLink : urlpath.absolute + "index.html#source=weixin",
							sendFriendLink : urlpath.absolute + "index.html#source=weixin",
							weiboLink : urlpath.absolute + "index.html#source=weixin",
							tTitle : result.taskdesp,
							tContent : result.taskdesp,
							fTitle : result.taskdesp,
							fContent : result.taskdesp,
							wContent : result.taskdesp,
						};
						window.shareData = share;
						pgFun.setShare();
						
					} else if (data.result == 'failed') {
						alert('服务器错误!');
					}
					pgFun.onLoad();
				},
				error : function() {
					alert('加载失败,请检查您的网络!');
				}
			});
		};

		function sharetask(){
			var taskid = $.cookie('taskid');
			if(!taskid){
				window.location.href('./index.html');
			}
			var data = {
				taskid: taskid
			};
			$.ajax({
				type : "POST",
				dataType : 'json',
				url : "../getusertask.ashx",
				cache : false,
				data : data,
				success : function(data) {
					//console.log(data);
					if (data.result == 'success') {
						var result = data.jsonResponse;
						$('.title', $cache.titBox).html('我已经领取本月泉心任务');
						$('.name', $cache.titBox).html(result.username);
						$('.cent', $cache.titBox).html(result.taskname).css({'fontSize': '30px', 'paddingBottom': '80px'});
						if(result.userimg){
							$('.portrait', $cache.titBox).css('backgroundImage', 'url('+result.userimg+')');
						}
						pgScroll[0].refresh();
						var share = {
							imgUrl : urlpath.absolute + '../' + result.tasksmallimg,
							timeLineLink : urlpath.absolute + "index.html#source=weixin",
							sendFriendLink : urlpath.absolute + "index.html#source=weixin",
							weiboLink : urlpath.absolute + "index.html#source=weixin",
							tTitle : result.taskdesp,
							tContent : result.taskdesp,
							fTitle : result.taskdesp,
							fContent : result.taskdesp,
							wContent : result.taskdesp,
						};
						window.shareData = share;
						//console.log(share);
						pgFun.setShare();
					} else if (data.result == 'failed') {
						alert('服务器错误!');
					}
					pgFun.onLoad();
				},
				error : function() {
					alert('加载失败,请检查您的网络!');
				}
			});
		};
		switch(pgType) {
			case 'init':
				$cache.yqdz1 = $('#yqdz1');
				$cache.yqdz1.show().on('click', '.submit', function(e) {
					pgScroll[0].disable();
					$cache.pop.show();
					$cache.popShare1.show();
					setTimeout(function() {
						$cache.pop.hide();
						$cache.popShare1.hide();
						pgScroll[0].enable();
					}, 2000);
				}).on('click', '.goback', function(e){
					window.location.href = "index.html";
				});
				getusertask();
				break;
			case 'self':
				$cache.yqdz2 = $('#yqdz2');
				$cache.yqdz2.show().on('click', '.submit', function(e) {
					pgScroll[0].disable();
					$cache.pop.show();
					$cache.popShare1.show();
					setTimeout(function() {
						$cache.pop.hide();
						$cache.popShare1.hide();
						pgScroll[0].enable();
					}, 2000);
				}).on('click', '.goback', function(e){
					window.location.href = "index.html";
				});;
				getusertask();
				break;
			case 'other':
				/*
				*	开启微信菜单
				*/
				function onBridgeReady(){
					WeixinJSBridge.call('showOptionMenu');
				}
				
				if (typeof WeixinJSBridge == "undefined"){
					if( document.addEventListener ){
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					}else if (document.attachEvent){
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					}
				}else{
					onBridgeReady();
				}
				
				function unfocus() {
					$cache.yqdz3 = $('#yqdz3');
					$cache.yqdz3.show().on('click', '.weixin', function(e) {
						pgScroll[0].disable();
						$cache.pop.show();
						$cache.popShare2.show();
						setTimeout(function() {
							$cache.pop.hide();
							$cache.popShare2.hide();
							pgScroll[0].enable();
						}, 2000);
					}).on('click', '.submit', function(e) {
						window.location.href = "./index.html";
					}).on('click', '.loveBtn', function(e) {
						alert('请先关注,碧欧泉微信!');
					});
					getusertaskfriend();
				};
				var loveBtnLock = false;
				function focus() {
					$cache.yqdz4 = $('#yqdz4');
					$cache.yqdz4.show().on('click', '.submit', function(e) {
						window.location.href = "./index.html";
					}).on('click', '.loveBtn', function(e) {
						if(loveBtnLock){
							return false;
						}
						loveBtnLock = true;
						var taskuserid = url.fparam('taskuserid');
						var data = {
							taskuserid: taskuserid
						};
						$.ajax({
							type : "POST",
							dataType : 'json',
							url : "../lovetask.ashx",
							data : data,
							success : function(data) {
								loveBtnLock = false;
								//console.log(data);
								if (data.result == 'success') {
									alert('点赞成功, 感谢您的支持!');
									$cache.loveBtn.html(parseInt($cache.loveBtn.html()) + 1);
								} else if (data.result == 'failed') {
									switch(data.jsonResponse) {
										case 'have support':
											alert('您已经支持过了!');
											break;
										case 'you cant':
											alert('您不能为自己点赞!');
											break;
										case 'over':
											alert('对不起,活动已过期!');
											break;
										default:
											alert('服务器错误!');
									};
								}
							},
							error : function() {
								loveBtnLock = false;
								alert('加载失败,请检查您的网络!');
							}
						});
					});
					getusertaskfriend();
				};

				$.ajax({
					type : "GET",
					dataType : 'json',
					url : "../issubscribe.ashx",
					cache : false,
					success : function(data) {
						//console.log(data);
						//alert(data.result);
						if (data.result == 'success') {
							focus();
						} else if (data.result == 'failed') {
							switch(data.jsonResponse) {
								case 'no subscribe':
									unfocus();
									break;
								default:
									alert('服务器错误!');
							};
						}
					},
					error : function() {
						focus();
						alert('加载失败,请检查您的网络!');
					}
				});
				break;
			case 'share':
				$cache.yqdz5 = $('#yqdz5');
				$cache.yqdz5.css({
					'display': 'block',
					'marginTop' : '0'
				}).on('click', '.weixin', function(e) {
					pgScroll[0].disable();
					$cache.pop.show();
					$cache.popShare1.show();
					setTimeout(function() {
						$cache.pop.hide();
						$cache.popShare1.hide();
						pgScroll[0].enable();
					}, 2000);
				}).on('click', '.submit', function(e){
					window.location.href = "index.html";
				});
				sharetask();
				break;
			default:
		};
	};
	global[fun] = pgFun;
	global[scroll] = pgScroll;
})('fun', 'pgScroll', this);

;(function($) {

	$(document).ready(function() {
		if (!window.pgLock) {
			return false;
		}
		var pgNameList = {
			'index' : 'index',
			'regmobile' : 'regmobile',
			'upload' : 'upload',
			'taskrank' : 'taskrank',
			'taskhistory' : 'taskhistory',
			'main' : 'main'
		};
		var pgName = window.pgName;
		fun[pgNameList[pgName]]();
	});

})(window.jQuery);
