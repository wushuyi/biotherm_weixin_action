;(function(fun, global) {
	var inface = {};
	var pgFun = {};
	var $cache = {};
	var pgScroll = [];
	pgFun.pubInit = function() {
		// 判断浏览器是否为微信浏览器
		var is_weixin = (function() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				return true;
			} else {
				return false;
			}
		})();

		var have_openid = (function() {
			if ($.cookie('taskOpenID')) {
				return true;
			} else {
				return false;
			}
		})();

		/*
		 if (!is_weixin) {
		 alert('请在微信浏览器中打开!');
		 window.location.href = 'http://m.biotherm.com.cn/';
		 } else if (!have_openid) {
		 window.location.href = '/task.ashx';
		 }
		 */

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
		$cache.popHdxq = $('.popHdxq', $cache.pop);
		$cache.popHdxqX = $('.popHdxqX', $cache.popHdxqX);

		function getDate(start, end) {
			var startdate = start.split(' ')[0].split('-').join('.');
			var enddate = end.split(' ')[0].split('-').join('.');
			return startdate + '-' + enddate;
		}


		$.ajax({
			type : "GET",
			dataType : 'json',
			url : "/task.ashx",
			cache : false,
			success : function(data) {
				if (data.result == 'success') {
					var result = data.jsonResponse;
					console.log(result);
					var taskDate = getDate(result.taskstartdate, result.taskdate);
					$cache.taskName.html(result.taskname);
					$cache.taskDate.html(taskDate);
					$cache.taskCent.html(result.taskcontent);
					$cache.mainPic.attr('src', result.taskbigimg);
					$.cookie('taskid', result.id);
					switch(result.state) {
						case 'no get':
							var lqrwBtnLock = false;
							$cache.lqrwBtn.html('领取任务').on('click', function(e) {
								if (lqrwBtnLock) {
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
									url : "/gettask.ashx",
									cache : false,
									success : function(data) {
										lqrwBtnLock = false;
										if (data.result == 'success') {
											alert('任务领取成功!');
											window.location.reload();
										} else if (data.result == 'failed') {
											if (data.jsonResponse == 'have get') {
												alert('您已经领取过该任务!');
											} else if (data.jsonResponse == 'no reg') {
												alert('请先绑定手机再进行任务!');
												window.location.href = './regmobile.html';
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
							$cache.lqrwBtn.html('查看任务').on('click', function() {
								window.location.href = './main.html';
							});
							break;
						case 'over':
							$cache.lqrwBtn.html('活动过期').css('backgroundColor', '#969A9F');
							break;
						default:
					}

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
				url : "/bindinggettask.ashx",
				cache : false,
				data : data,
				success : function(data) {
					subAllLock = false;
					if (data.result == 'success') {
						alert('绑定成功!');
						window.location.href = './index.html';
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
			$.ajax({
				type : "POST",
				dataType : 'json',
				url : "/sendmsg.ashx",
				cache : false,
				data : data,
				success : function(data) {
					if (data.result == 'success') {
						var num = 90;
						var clock = setInterval(function() {
							$cache.subCode.html(num + 's 重新获取');
							num -= 1;
							if (num == 0) {
								clearInterval(clock);
								$cache.subCode.html('获取验证码');
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
		});
	};
	pgFun.upload = function() {
		this.pubInit();
		this.pubScroll(false);
		var imgArr = [];
		$cache.upImg = $('#upImg');
		$cache.imgList = $('.imgList', $cache.upImg);
		$cache.imgListUl = $('ul', $cache.imgList);
		$cache.addImg = $('.add', $cache.upImg);
		$cache.delImg = $('.del', $cache.upImg);
		$cache.subImg = $('.subImg', $cache.upImg);
		var taskid = $.cookie('taskid');

		function ajaxFileUpload() {
			$.ajaxFileUpload({
				url : "/uploadtaskimg.ashx?taskid=" + taskid,
				secureuri : false,
				fileElementId : "upPic",
				dataType : "json",
				beforeSend : function() {
					//$("#loading").show(); //该图用来显示上传图片ing
				},
				complete : function() {
					//$("#loading").hide(); //隐藏该图
					//$("#upPic").val("");
				},
				success : function(data, status) {
					console.log(data);
					if (data.result == "success") {
						var _pic = data.jsonResponse;
						imgArr.push(_pic);
						console.log(_pic);
					} else if (data.result = "failed") {
						alert('上传失败!');
					}

				},
				error : function(data, status, e) {
					//alert("error...");
					//alert(e);
				}
			});
		}


		$cache.subImg.on('change', function(e) {
			if (imgArr.length >= 9) {
				alert('对不起, 最多只能上传9张!');
				return;
			}
			ajaxFileUpload();
			var file = e.target.files[0];
			var reader = new FileReader();
			var image;
			reader.readAsDataURL(file);
			reader.onload = function() {
				toBase64(reader);
			};
			//$(this).val('');
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
				pgScroll[0].refresh();
			}

		});
		$cache.imgList.on('click', 'b', function(e) {
			console.log(e);
			$(this).parent('li').remove();
		});
	};
	pgFun.taskrank = function() {
		this.pubInit();
		this.pubScroll();
		$cache.rankBox = $('#rankBox');
		$cache.tmpHtml = $($('#tmp1').html());
		$cache.rankCent = $('.rankCent', $cache.rankBox);
		$cache.resultHtml = '';
		$.ajax({
			type : "GET",
			dataType : 'json',
			//url : "/taskrank.ashx",
			url : "./assets/json/taskrank.json",
			cache : false,
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
							if (img.match('img')) {
								//imgArr.push(row[img]);
								imgList += '<li style="background-image: url(' + row[img] + '); background-size: 100% auto;"></li>';
							}
						}
						//console.log(imgArr);
						//console.log(rows[key]);
						$cache.tmpHtml.attr('id', row.id);
						$cache.tmpHtml.attr('openid', row.openid);
						$('.index', $cache.tmpHtml).html(row.rank);
						$('.name', $cache.tmpHtml).html(row.username);
						$('.cent', $cache.tmpHtml).html(row.content);
						$('.num', $cache.tmpHtml).html(row.lovenum);
						$('.imgBox ul', $cache.tmpHtml).html(imgList);
						$cache.resultHtml += $cache.tmpHtml.prop("outerHTML");
					}
					$cache.rankCent.append($cache.resultHtml);
					pgScroll[0].refresh();
				} else if (data.result == 'failed') {
					alert('服务器错误!');
				}
			},
			error : function() {
				alert('加载失败,请检查您的网络!');
			}
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
			//url : "/taskhistory.ashx",
			url : "./assets/json/taskhistory.json",
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
						$('.jj .cent', $cache.tmpHtml).html(row.taskcontent);
						$('.imgBox ul', $cache.tmpHtml).html('<li style="background-image: url(' + row.tasksmallimg + '); background-size: 100% auto;"></li>');
						$('.num', $cache.tmpHtml).html(row.usernum);
						$cache.resultHtml += $cache.tmpHtml.prop("outerHTML");
					}
					$cache.rankCent.append($cache.resultHtml);
					pgScroll[0].refresh();
				} else if (data.result == 'failed') {
					alert('服务器错误!');
				}
			},
			error : function() {
				alert('加载失败,请检查您的网络!');
			}
		});
	};
	pgFun.main = function() {
		this.pubInit();
		this.pubScroll();
		$cache.titBox = $('#titBox');
		$cache.imgBox = $('#imgBox ul', $cache.tmpHtml);
		$cache.pop = $('#pop');
		$cache.popShare1 = $('.popShare1', $cache.pop);
		$cache.popShare2 = $('.popShare2', $cache.pop);
		var url = $.url();
		var pgType = url.fparam('type');
		var taskid = url.fparam('taskid');
		function getusertask() {
			if (!taskid) {
				return false;
			}
			$.ajax({
				type : "GET",
				dataType : 'json',
				url : "/getusertask.json",
				cache : false,
				success : function(data) {
					//console.log(data);
					if (data.result == 'success') {
						var result = data.jsonResponse;
						var img, imgArr = [], imgList = '';
						for (img in result) {
							if (img.match('img')) {
								imgList += '<li style="background-image: url(' + row[img] + '); background-size: 100% auto;"></li>';
							}
						}
						$cache.titBox.attr('id', result.id);
						$('.name', $cache.tmpHtml).html(result.username);
						$('.cent', $cache.tmpHtml).html(result.content);
						$cache.imgBox.html(imgList);
					} else if (data.result == 'failed') {
						alert('服务器错误!');
					}
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
				});
				pgScroll[0].refresh();
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
				});
				pgScroll[0].refresh();
				break;
			case 'other':
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
					pgScroll[0].refresh();
				}

				function focus() {
					$cache.yqdz4 = $('#yqdz4');
					$cache.yqdz4.show().on('click', '.submit', function(e) {
						window.location.href = "./index.html";
					}).on('click', '.loveBtn', function(e) {
						var data = {
							taskuserid : $.cookie('taskuserid')
						};
						$.ajax({
							type : "POST",
							dataType : 'json',
							url : "/lovetask.ashx",
							cache : false,
							data : data,
							success : function(data) {
								//console.log(data);
								if (data.result == 'success') {

								} else if (data.result == 'failed') {
									switch(data.jsonResponse) {
										case 'have support':
											alert('您已经支持过了!');
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
								alert('加载失败,请检查您的网络!');
							}
						});
					});
					pgScroll[0].refresh();
				}


				$.ajax({
					type : "POST",
					dataType : 'json',
					url : "/issubscribe.ashx",
					cache : false,
					success : function(data) {
						//console.log(data);
						if (data.result == 'success') {
							focus();
						} else if (data.result == 'failed') {
							switch(data.jsonResponse) {
								case 'no subscribe':
									unfocus();
									alert('您已经支持过了!');
									break;
								default:
									alert('服务器错误!');
							};
						}
					},
					error : function() {
						unfocus();
						alert('加载失败,请检查您的网络!');
					}
				});
				break;
			default:
		};
	};
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
			'taskhistory' : 'taskhistory',
			'main' : 'main'
		};
		var pgName = window.pgName;
		fun[pgNameList[pgName]]();
	});
})(window.jQuery);
