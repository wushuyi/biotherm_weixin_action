/**
 * @author wjsu
 */
 
 function getPathName(pathName) {
  var flag = "";
  var arr = pathName.split("/");
  arr.pop();
  for (var i = 0; i < arr.length; i++) {
    flag += "/" + arr[i];
  }
  return flag;
} 
 
document.addEventListener('WeixinJSBridgeReady',
  function onBridgeReady() {
    window.shareData = {
      "imgUrl": "http://yaoyiyao.wangfan.com/"+"/img/share.jpg",
      "timeLineLink": 'http://112.124.70.247/weoper/mobile.php?act=module&name=yswfcommon&do=ApiSnsapiBase&weid=9&siteRetUrl='+"http://yaoyiyao.wangfan.com/"+'?source=friends',
      "sendFriendLink": 'http://112.124.70.247/weoper/mobile.php?act=module&name=yswfcommon&do=ApiSnsapiBase&weid=9&siteRetUrl='+"http://yaoyiyao.wangfan.com/"+'?source=friends',
      "weiboLink": 'http://112.124.70.247/weoper/mobile.php?act=module&name=yswfcommon&do=ApiSnsapiBase&weid=9&siteRetUrl='+"http://yaoyiyao.wangfan.com/"+'?source=friends',
      "tTitle": "【碧欧泉】摇出醉人香槟色，庆祝丝滑紧致肌",
      "tContent": "【碧欧泉】摇出醉人香槟色，庆祝丝滑紧致肌",
      "fTitle": "【碧欧泉】摇出醉人香槟色，庆祝丝滑紧致肌",
      "fContent": "碧欧泉全新美肤紧致精华油",
      "wContent": "【碧欧泉】摇出醉人香槟色，庆祝丝滑紧致肌"
    };
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage',
      function(argv) {
        var shareTitle = "";
        if(window.openidweixin) {
          shareTitle = window.openidweixin;
        } else {
          shareTitle = window.shareData.tTitle;
        }
        WeixinJSBridge.invoke('sendAppMessage', {
          "img_url": window.shareData.imgUrl, // "img_width": "640",// "img_height": "640",
          "link": window.shareData.sendFriendLink,
          "desc": window.shareData.fContent,
          "title": shareTitle
        }, function(res) {
          _report('send_msg', res.err_msg);
        })
      });
    // 分享到朋友圈          
    WeixinJSBridge.on('menu:share:timeline', function(argv) {
       var shareTitle = "";
        if(window.openidweixin) {
          shareTitle = window.openidweixin;
        } else {
          shareTitle = window.shareData.tTitle;
        }
      WeixinJSBridge.invoke('shareTimeline', {
        "img_url": window.shareData.imgUrl,
        "img_width": "640",
        "img_height": "640",
        "link": window.shareData.timeLineLink,
        "desc": window.shareData.tContent,
        "title": shareTitle
      }, function(res) {
        _report('timeline', res.err_msg);
      });
    }); // 分享到微博 
    WeixinJSBridge.on('menu:share:weibo', function(argv) {
      var shareUrl = "";
      if(window.openidweixin) {
        shareUrl = "/selects.html?openid="+window.openidweixin;
      }
      WeixinJSBridge.invoke('shareWeibo', {
        "content": window.shareData.wContent,
        "url": window.shareData.weiboLink +shareUrl,
      }, function(res) {
        _report('weibo', res.err_msg);
      });
    });
  }, false);

function UrlEncode(str){
var ret="";
var strSpecial="!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
var tt= "";

for(var i=0;i<str.length;i++){
var chr = str.charAt(i);
var c=str2asc(chr);
tt += chr+":"+c+"n";
if(parseInt("0x"+c) > 0x7f){
ret+="%"+c.slice(0,2)+"%"+c.slice(-2);
}else{
if(chr==" ")
ret+="+";
else if(strSpecial.indexOf(chr)!=-1)
ret+="%"+c.toString(16);
else
ret+=chr;
}
}
return ret;
}
