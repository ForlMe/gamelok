/**
 * 世界排行 后台 appid openid 用户头像 用户昵称 分数
 * 入口获取来源信息 1 后台 appid openid scene 来源appid 来源路径
 * 退出获取游戏时长
 * 分享来源（谁分享的）
 * wx.triggerGC()
 * wx.openCustomerServiceConversation(Object object)
 * 系统粘贴  wx.setClipboardData({data:'data'}); 有提示
 * wx.onMemoryWarning(function callback)
 * FeedbackButton wx.createFeedbackButton(Object object)
 * 
 * 页面 名字 序号 游戏名 用户id 成功||取消 后台
 * 
 * wx.onUserCaptureScreen(CALLBACK) 截屏 小程序的
 * 视频广告 banner广告 失败原因 后台 视频||banner appid openid yemian type
 */
/**
 * 世界排行 appid（string 微信id） openid（string 用户id） 用户头像（string 头像链接）  用户昵称（string） 分数（int）
游戏推广 页面 名字（string 自己微信id） 序号（int） 游戏名（string 跳转微信id） 用户id（string 用户id） 成功||取消（int 1||0）
入口获取来源信息  appid（string 自己微信id） openid（string 用户id） scene（int ） 来源appid（int 来源信息）
视频广告 banner广告 失败原因  视频||banner（int 0||1） appid（string 自己微信id） openid（string 用户id） 页面（string 场景） type（int）

场景值	scene场景				appId 含义
1020	公众号 profile 页相关小程序列表		来源公众号
1035	公众号自定义菜单			来源公众号
1036	App 分享消息卡片			来源App
1037	小程序打开小程序			来源小程序
1038	从另一个小程序返回			来源小程序
1043	公众号模板消息			来源公众号

type
1000	后端接口调用失败
1001	参数错误
1002	广告单元无效
1003	内部错误
1004	无合适的广告
1005	广告组件审核中
1006	广告组件被驳回
1007	广告组件被封禁
1008	广告单元已关闭
 */
window.canExperienceGame = 1;//是否可以体验游戏 可在线控制
window.wxServerVersion = 0;//版本 可在线控制
window.wxJumpBtnHaveMove = 1;// 可在线控制
window.wxShareFailTips = '通讯失败'// 可在线控制
window.wxJumpShowBannerDelayTime = 1.5;// 可在线控制
window.videoFailJumpShare = 1;// 可在线控制
window.canShowBanner = 1;// 可在线控制
window.GasSwitch = 2;//鼓励开关，可在线控制
let WxManager = cc.Class({
	extends: require('BaseManager'),
	properties: {
		already: false,
		haveGetAuthorize: false,
		banner: null,
		gameClubButton: null,
		bannerTimeOut: false,
		shareOnShow: false,
		isOnceShare: true,
		shareCallBack: null,
		shareBegTime: 0,
		_shareQuery: '',//分享统计
	},

	/**
	 * {getAuthorize:true}
	 */
	init: function (func) {
		var self = this;

		this.init_func = func;
		// this._beginGameTime = getTime()/1000;
		// wx.exitMiniProgram({success:function(){
		// 	var time = getTime()/1000;
		// 	var runTime = time - self._beginGameTime;//提交游戏时长
		// 	self._beginGameTime = time;
		// 	console.log('退出游戏');
		// }});
		// wx.onUserCaptureScreen(function(){
		// 	console.log('用户截屏');//提交游戏时长
		// });
		this.shareAndVideoAllNum = 0;

		this.canShowRedPack = 1; //是否可以显示红包 可在线控制
		this.showRedPackNum = 10; //每天显示红包次数 可在线控制
		this.shareSuccessProbability = 100;//分享成功概率 可在线控制
		this.shareOrVideoType = 4;//分享 视频 类型   可在线控制
		//1、关闭 2、分享 3、视频 4、分享-视频（循环） 5、视频-分享（循环） 6、0-10点 只视频 10-24点 视频-分享（循环） 
		try {
			wx.aldSendEvent('initAld', { '': '' });
		} catch (err) { };

		var data2 = wx.getSystemInfoSync();
		this.model = data2.model;
		if (typeof wx.getUpdateManager === 'function') {
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
			})

			updateManager.onUpdateReady(function () {
				// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				updateManager.applyUpdate()
			})

			updateManager.onUpdateFailed(function () {
				// 新的版本下载失败
			})
		}

		this.getCdkey(102, function (cdkey) {
			Userdefault.setStringForKey("cdkey", cdkey);
		}.bind(this));
		this.login();
		this.setShareData();
		this.setMoreGameData();
		this.getOnlineData();
		this._onHide = [];
		this._onShow = [];
		wx.getSystemInfo({
			success: function () {

			}.bind(this)
		});
		wx.onHide(function () {
			console.log("SDK------------------------进入后台");
			this._onHideTime = getTime();
			for (var i = 0; i < this._onHide.length; i++) {
				if (this._onHide[i] && this._onHide[i]()) {
					this._onHide.splice(i, 1);
					i--;
				}
			}
		}.bind(this));
		wx.onShow(function (res) {
			console.log("SDK------------------------后台返回游戏");
			this.init_func && this.init_func({ scene: res.scene });
			var time = getTime() - this._onHideTime;
			for (var i = 0; i < this._onShow.length; i++) {
				if (this._onShow[i] && this._onShow[i](time)) {
					this._onShow.splice(i, 1);
					i--;
				}
			}
		}.bind(this));
		this.gameTime = 0;
		this.setDataForHttp("https://api.huaxunbaili.com/sys/gettime", function (data) {
			if (data == "") {
				return;
			}
			this.serverTime = parseInt(data);//获取服务器时间

			console.log("sdk------------------------获取服务器时间" + this.serverTime);
			// setInterval(function () {
			// 	this.gameTime += 1000;
			// }.bind(this), 1000);
		}.bind(this));
		//this.openShare(); 获取到玩家id后调用

	},

	createBanner(node, func) {
		console.log("SDK-----------------初始化广告");
		if (this.banner) {
			var time = getTime();
			if (time - this.banner.time < 60 * 1000) {
				func && func();
				return;
			}
			if (time - this.banner.time < 10 * 60 * 1000 && this.banner.scene == cc.director.getScene().name) {
				func && func();
				return;
			}
		}


		var fs = cc.view.getFrameSize();
		var style = { left: 0, top: fs.height, width: fs.width };

		this.banner = wx.createBannerAd({ adUnitId: wxBannerId, style: style });
		this.banner.time = getTime();
		this.banner.scene = cc.director.getScene().name;
		this.banner.onError(function (res) {
			var scene = cc.director.getScene().name;
			var type = -1;
			if (this.getSDKVersionCanUse('2.2.2')) {
				type = res.errCode;
			}
			var url_n = serverUrl + 'lieyou/wxdata/addGameVideoAdvertis?ad_type=' + 1 + '&appid=' + wxAppId + '&openid=' + openid + '&page=' + scene + '&type=' + type;
			this.setDataForHttp(url_n);
		}.bind(this));
		this.banner.show();
		this.banner.onResize(function () {
			if (func) {
				this.banner.hide();
				func();
				func = null;
			}
			else {
				var style = this.banner.style;
				if (style.width < style.realWidth) {
					// style.left = (fs.width - style.realWidth) / 2;
					this.banner.hide();
				}
				if (style.realHeight > fs.height - style.top) {
					this.banner.hide();
				}
			}
		}.bind(this));

	},

	showBannerByBottom: function (node) {
		if (!this.getSDKVersionCanUse('2.0.4')) {
			return;
		}
		if (!node) {
			return;
		}
		var height = node.convertToWorldSpaceAR(cc.v2()).y - node.height * node.anchorY - 10;
		if (height < 200) {
			return;
		}
		this.createBanner(node, function () {
			var fs = cc.view.getFrameSize();
			var scale = fs.width / cc.winSize.width;
			var style = this.banner.style;
			//计算广告可显示高度
			var h = (height) * scale;
			var width = style.width;
			if (fs.width * 0.8 < 300) {
				style.width = 300;
			}
			else {
				style.width = fs.width * 0.8;
			}
			style.left = (fs.width - style.width) / 2;
			style.top = fs.height - h;

			console.log(this.banner);
			this.banner.show();
		}.bind(this));
	},
	showBannerByNode: function (node) {
		if (!this.getSDKVersionCanUse('2.0.4')) {
			return;
		}
		if (!node) {
			return;
		}
		var height = node.convertToWorldSpaceAR(cc.v2()).y + node.height * (0.5 - node.anchorY);
		this.createBanner(node, function () {
			var fs = cc.view.getFrameSize();
			var scale = fs.width / cc.winSize.width;
			var style = this.banner.style;
			//计算广告可显示高度
			var h = (height) * scale;
			var width = style.width;
			if (fs.width * 0.8 < 300) {
				style.width = 300;
			}
			else {
				style.width = fs.width * 0.8;
			}
			style.left = (fs.width - style.width) / 2;
			style.top = fs.height - h - style.realHeight / 2;

			this.banner.show();
		}.bind(this));

	},
	hideBanner: function () {
		if (this.banner) {
			this.banner.hide();
		}
	},
	share: function (obj) {

		this.shareAndVideoAllNum++;
		// this.shareBegTime = getTime() / 1000;

		// var getGroupId = obj.getGroupId ? obj.getGroupId : true;
		// var self = this;
		var adid = -1;
		var _title = "好玩的游戏，快来一起玩吧";
		var _url = "https://res.igame58.com/wxxyx/commom/shareIcon.png";
		if (wxData.shareData.length > 0 && this.getCanShare()) {
			for (var i = 0; i < wxData.shareData.length; i++) {
				if (wxData.shareData[i].mode == obj.name) {
					var data = wxData.shareData[i].item;
					var random = parseInt(Math.random() * data.length);
					adid = data[random].id;
					_title = data[random].title;
					_url = data[random].img;
				}
			}
		}
		var _query = wxData.putShareDataUrl + "?dsadsa=dsdsd" + "&appId=" + wxData.appId + "&gamerId=" + openid + "&itemId=" + adid + "&source=" + obj.source;

		if (obj.inviteFriend) {
			_query += "&inviteFriend=" + obj.inviteFriend;
		}
		//分享体力码
		if (obj.source == 102) {
			var cdkey = Userdefault.getStringForKey("cdkey", "");
			_title = "@你  好友赠送了你一个体力码：【" + cdkey + "】,点击获取";
			_query += "&cdkey=" + cdkey;
			wx.aldShareAppMessage({ title: _title, imageUrl: _url, query: _query });

		} else {
			wx.aldShareAppMessage({ title: _title, imageUrl: _url, query: _query });
		}
		
		this.onShow(function (time) {
			var result = false;
			if (time > 5000) {
				result = true;
			} else if (time > 2000) {
				if (this.isOnceShare) {
					if (Math.random() > 0.5) {
						result = true;
					}
				} else {
					if (Math.random() * 100 < this.shareSuccessProbability) {
						result = true;
					}
				}
			}
			this.isOnceShare = !this.isOnceShare;
			if (result) {
				obj.success && obj.success(1);
				this.setDataForHttp(_query);
				if (obj.source == 102) {
					this.getCdkey(102, function (cdkey) {
						Userdefault.setStringForKey("cdkey", cdkey);
					}.bind(this));
				}
			}
			else {
				obj.success && obj.success(0);
				if (obj.source != 102) {
					setTimeout(() => {
						this.addToast(wxShareFailTips);
					}, 500);
				}
			}
			return true;
		}.bind(this));
	},
	showRewardedVideoAd: function (id, closeCallBack) {
		this.shareAndVideoAllNum++;
		if (!this.getSDKVersionCanUse('2.0.4')) {
			return;
		}
		var self = this;

		// this.hideBanner();
		try {
			wx.aldSendEvent('playVideo', { 'result': 'playBegin' });
		} catch (err) { }

		var videoAd = wx.createRewardedVideoAd({ adUnitId: id });
		videoAd.load().then(() => videoAd.show()).catch(err => console.log("s"));
		videoAd.offClose();
		videoAd.onClose(function (res) {
			if (self.getSDKVersionCanUse('2.1.0')) {
				// closeCallBack(res.isEnded);
				if (res.isEnded) {
					closeCallBack && closeCallBack(true);
					try {
						wx.aldSendEvent('playVideo', { 'result': 'playSuccess' });
					} catch (err) { }

				}
				else {
					closeCallBack && closeCallBack(false);
					// this.addToast("播放失败");
					try {
						wx.aldSendEvent('playVideo', { 'result': 'playFail' });
					} catch (err) { }
					// try {
					// 	if (!videoFailJumpShare) {
					// 		closeCallBack(false);
					// 	}
					// 	else if (Math.random() > 0.5 && getCanShare()) {
					// 		this.shareAndVideoAllNum--;
					// 		self.share({ name: GameName, source: 10, success: closeCallBack });
					// 	} else {
					// 		self.showGameRecommend(closeCallBack);
					// 	}

					// 	// closeCallBack(false);
					// 	wx.aldSendEvent('playVideo', { 'result': 'playFail' });
					// } catch (err) { }

				}
				return;
			}
			closeCallBack && closeCallBack(true);
			try {
				wx.aldSendEvent('playVideo', { 'result': 'playSuccess' });
			} catch (err) { }

		}.bind(this));
		videoAd.offError();
		videoAd.onError(function (res) {
			var scene = cc.director.getScene().name;
			var type = -1;
			if (self.getSDKVersionCanUse('2.2.2')) {
				type = res.errCode;
			}
			var url_n = serverUrl + 'lieyou/wxdata/addGameVideoAdvertis?ad_type=' + 0 + '&appid=' + wxAppId + '&openid=' + openid + '&page=' + scene + '&type=' + type;
			self.setDataForHttp(url_n);
			try {
				wx.aldSendEvent('playVideo', { 'result': 'getVideoFail' });
			} catch (err) { }
			// closeCallBack(false);
			if (!videoFailJumpShare) {
				closeCallBack(false);
				// this.addToast("播放失败");
			} else if (Math.random() > 0.5 && getCanShare()) {
				self.shareAndVideoAllNum--;
				self.share({ name: GameName, source: 10, success: closeCallBack });
			}
			// else {
			// 	self.showGameRecommend(closeCallBack);
			// }
		}.bind(this))
	},
	isShenhe: function () {
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			// 判断   正式版
			return wxServerVersion < wxGameVersion;
		}
		return false;
	},
	getCanShare: function () {
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			// 判断   正式版
			return wxServerVersion >= wxGameVersion;
		}
		return true;//不是微信小游戏直接返回true
	},

	getHaveVideo() {
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			//判断    正式版 && 视频广告id存在
			return wxServerVersion >= wxGameVersion && wxVideoId != "";
		}
		return true;//不是微信小游戏直接返回true
	},

	getShareOrViedo() {
		if (this.isShenhe()) {
			return 0;
		}
		var nShareAndVideoAllNum = this.shareAndVideoAllNum

		var retType = 0;
		//1、关闭 2、分享 3、视频 4、分享-视频（）循环 5、视频-分享（循环） 6、0-10点 只视频 10-24点 视频-分享（）循环
		if (this.shareOrVideoType == 1) {
			retType = 0;
		} else if (this.shareOrVideoType == 2) {
			retType = 1;
		} else if (this.shareOrVideoType == 3) {
			retType = 2;
		} else if (this.shareOrVideoType == 4) {
			if (nShareAndVideoAllNum % 2 == 0) {
				retType = 1;
			} else {
				retType = 2;
			}
		} else if (this.shareOrVideoType == 5) {
			if (nShareAndVideoAllNum % 2 == 0) {
				retType = 2;
			} else {
				retType = 1;
			}
		} else if (this.shareOrVideoType == 6) {
			var hours = (new Date()).getHours();
			if (hours >= 0 && hours < 10) {
				retType = 2;
			}
			if (nShareAndVideoAllNum % 2 == 0) {
				retType = 2;
			} else {
				retType = 1;
			}
		}
		if (retType == 2) {
			if (wxVideoId == "") {
				if (!this.isShenhe()) {
					retType = 1;
				} else {
					retType = 0;
				}
			}
		} else if (retType == 1) {
			if (this.isShenhe()) {
				if (wxVideoId != "") {
					retType = 2;
				} else {
					retType = 0;
				}
			}
		}

		return retType;
	},

	showGuessYouLickOne(obj) {
		if (this.isShenhe()) {
			return;
		}
		var self = this;
		if (wxData.moreGameData.length <= 0) {
			setTimeout(function () {
				if (obj.node && obj.node.isValid) {
					self.showGuessYouLickOne(obj);
				}
			}, 1000);
			return;
		}
		if (!obj.node) {
			return;
		}
		var data = [];
		var k = 0;
		for (var i = 0; i < wxData.moreGameData.length; i++) {
			if (wxData.moreGameData[i].iconX && wxData.moreGameData[i].jumpData) {
				data[k] = wxData.moreGameData[i];
				k++;
			}
		}
		if (data.length <= 2) {
			cc.loader.loadRes('SDK/module/GuessYouLike/JKZG', function (err, res) {
				if (obj.node && obj.node.isValid) {
					var node = cc.instantiate(res);
					obj.node.addChild(node);
					node.x = obj.x ? obj.x : 0;
					var align = obj.align ? obj.align : 0;
					node.y = (obj.y ? obj.y : 0) - align * 74;
				}
			})
			return;
		}
		cc.loader.loadRes('SDK/module/GuessYouLike/GuessYouLike_once', function (err, res) {
			if (obj.node && obj.node.isValid) {
				var node = cc.instantiate(res);
				obj.node.addChild(node);
				node.x = obj.x ? obj.x : 0;
				var align = obj.align ? obj.align : 0;
				node.y = (obj.y ? obj.y : 0) - align * 100;
			}
		})
	},
	showGuessYouLickTow(obj) {
		if (this.isShenhe()) {
			return;
		}
		var self = this;
		if (wxData.moreGameData.length <= 0) {
			setTimeout(function () {
				if (obj.node.isValid) {
					self.showGuessYouLickTow(obj);
				}
			}, 1000);
			return;
		}
		if (!obj.node) {
			return;
		}
		var data = [];
		var k = 0;
		for (var i = 0; i < wxData.moreGameData.length; i++) {
			if (wxData.moreGameData[i].iconX && wxData.moreGameData[i].jumpData) {
				data[k] = wxData.moreGameData[i];
				k++;
			}
		}
		if (data.length <= 2) {
			cc.loader.loadRes('SDK/module/GuessYouLike/JKZG', function (err, res) {
				if (obj.node && obj.node.isValid) {
					var node = cc.instantiate(res);
					obj.node.addChild(node);
					node.x = obj.x ? obj.x : 0;
					var align = obj.align ? obj.align : 0;
					node.y = (obj.y ? obj.y : 0) - align * 74;
				}
			})
			return;
		}
		if (data.length <= 3) {
			this.showGuessYouLickOne(obj);
			return;
		}
		cc.loader.loadRes('SDK/module/GuessYouLike/GuessYouLike_tow', function (err, res) {
			if (obj.node && obj.node.isValid) {
				var node = cc.instantiate(res);
				obj.node.addChild(node);
				node.x = obj.x ? obj.x : 0;
				var align = obj.align ? obj.align : 0;
				node.y = (obj.y ? obj.y : 0) - align * 160;
			}
		})
	},
	showGuessYouLike_3: function (obj) {
		if (this.isShenhe()) {
			return;
		}
		var self = this;
		if (wxData.moreGameData.length <= 0) {
			setTimeout(function () {
				if (obj.node.isValid) {
					self.showGuessYouLike_3(obj);
				}
			}, 1000);
			return;
		}
		cc.loader.loadRes('SDK/module/GuessYouLike/GuessYouLike_3', function (err, res) {
			if (obj.node && obj.node.isValid) {
				var node = cc.instantiate(res);
				obj.node.addChild(node);
				node.x = obj.x ? obj.x : 0;
				node.y = obj.y ? obj.y : 0;
			}
		})

	},
	//折叠箭头
	showRecommendIcon(obj) {
		if (this.isShenhe()) {
			return;
		}
		var self = this;
		cc.loader.loadRes('SDK/module/RecommendGame/Recommend_show', function (err, res) {
			var node = cc.instantiate(res);
			var fNode = obj.node ? obj.node : cc.find('Canvas');
			node.x = obj.x ? obj.x : 0;
			node.y = obj.y ? obj.y : 0;
			fNode.addChild(node);
		})
	},

	getGameRecommendData() {
		// if (!canExperienceGame) {
		// 	return;
		// }
		// if (this.isShenhe()) {
		// 	return;
		// }
		var time = Userdefault.getIntForKey("RecommendGameTime", 0);
		var newTime = getTimeDay();
		if (time != newTime) {
			Userdefault.setIntForKey("RecommendGameTime", newTime);
			Userdefault.clearForKey("RecommendGame");
		}
		var data = [];
		var k = 0;
		for (var i = 0; i < wxData.moreGameData.length; i++) {
			if (wxData.moreGameData[i].iconX && wxData.moreGameData[i].jumpType == 2) {
				data[k] = wxData.moreGameData[i];
				k++;
			} else {
			}
		}
		var key = ["RecommendGame"];
		for (var i = 0; i < data.length; i++) {
			data[i].status = Userdefault.getIntForKey(key, 0, undefined, data[i].jumpData.appId);
		}
		for (var i = 0; i < data.length; i++) {
			for (var j = i; j < data.length - 1; j++) {
				if (data[j].status > data[j + 1].status) {
					var temp = data[j];
					data[j] = data[j + 1];
					data[j + 1] = temp;
				}
			}
		}
		return data;
	},
	showGameRecommend(callBack = null) {
		if (!canExperienceGame) {

			return;
		}
		if (this.isShenhe()) {
			if (callBack) {
				callBack(false);
			}
			return;
		}

		var timeLast = Userdefault.getIntForKey('SKD_showRecommendDialogTime', 0);
		var timeNow = parseInt(getTime() / 1000);
		if (timeNow - timeLast < 10) {
			if (callBack) {
				callBack(false);
			}
			return;
		}
		Userdefault.setDataForKey('SKD_showRecommendDialogTime', timeNow);
		var self = this;
		cc.loader.loadRes('SDK/module/RecommendGame/Recommend_playVD', function (err, res) {
			var node = cc.instantiate(res);
			var fNode = cc.find('Canvas');
			fNode.addChild(node, 999);
			node.getComponent('RecommendGame_playVD').setData(callBack);
		})
	},
	showGameRecommendDialog(callBack = null) {
		if (!canExperienceGame) {
			if (callBack) {
				callBack(false);
			}
			return;
		}
		if (this.isShenhe()) {
			if (callBack) {
				callBack(false);
			}
			return;
		}
		console.log("SDK----------------试玩弹窗");
		var self = this;
		cc.loader.loadRes('SDK/module/RecommendGame/Recommend_dialog2', function (err, res) {
			var node = cc.instantiate(res);
			var fNode = cc.find('Canvas');
			fNode.addChild(node, 999);
			node.getComponent('RecommendGame_dialog2').setData(callBack);
		})

	},
	showForum: function (obj) {
		var wxSys = wx.getSystemInfoSync();
		if (!this.getSDKVersionCanUse('2.0.3')) {
			return;
		}

		var widths = wxSys.screenWidth;
		var height = wxSys.screenHeight;
		if (!this.gameClubButton) {
			this.gameClubButton = wx.createGameClubButton(obj);
		} else {
			this.gameClubButton.show()
		}
	},
	closeForum: function () {
		if (!this.getSDKVersionCanUse('2.0.3')) {
			return;
		}
		if (this.gameClubButton)
			this.gameClubButton.hide();
	},

	showFeedbackButton: function () {
		if (!this.getSDKVersionCanUse('2.1.2')) {
			return;
		}
		if (!this.feedbackButton) {
			// let image = this._wx.createImage();
			// image.onload = function () {
			// 	console.log("2");
			this.feedbackButton = wx.createFeedbackButton({
				type: "image",
				image: "https://idata.igame58.com/wxxyx/feedback.png",
				style: { left: 10, top: 40, width: 86.1, height: 29.4 }
			});

			console.log(this.feedbackButton);
			this.feedbackButton.show();
			// }.bind(this);
			// image.src = "resources/SDK/module/feedback.png";

			// console.log("1");
		} else {
			console.log(this.feedbackButton);
			this.feedbackButton.show();
		}
	},

	hideFeedbackButton: function () {
		if (!this.getSDKVersionCanUse('2.1.2')) {
			return;
		}
		if (this.feedbackButton) {
			this.feedbackButton.hide();
		}
	},

	onHide: function (fun) {
		this._onHide.push(fun);
	},
	onShow: function (fun) {
		this._onShow.push(fun);
	},

	//微信授权
	getAuthorize: function () {
		var self = this;
		wx.authorize({
			scope: 'scope.userInfo',
			success: function () {
				wx.getUserInfo({
					success: function (res) {
						var userInfo = res.userInfo
						uinfo.nick = userInfo.nickName//昵称
						uinfo.icon = userInfo.avatarUrl//头像链接
						uinfo.sex = userInfo.gender //性别 0：未知、1：男、2：女
						uinfo.province = userInfo.province//省份
						uinfo.city = userInfo.city//城市
						uinfo.country = userInfo.country//国家
						//提交状态

						var query = wx.getLaunchOptionsSync().query;

						var laiyuan_appid = 0;
						if (wx.getLaunchOptionsSync().referrerInfo && wx.getLaunchOptionsSync().referrerInfo.appId) {
							laiyuan_appid = wx.getLaunchOptionsSync().referrerInfo.appId;
						}
						var laiyuan_scene = wx.getLaunchOptionsSync().scene;
						try {
							wx.aldSendEvent('starGame', { 'appid': laiyuan_appid, 'scene': laiyuan_scene });
						} catch (err) { }
						var url_n = serverUrl + 'lieyou/wxdata/addGameSourceInfo?appid=' + wxAppId + '&openid=' + openid + '&scence=' + laiyuan_scene + '&s_appid=' + laiyuan_appid + '&s_path=' + JSON.stringify(query);
						self.setDataForHttp(url_n);
						if (query.source) {
							var str = wxData.putTouchShareDataUrl + "?" + "appId=" + query.appId + "&principal_gamerId=" + query.gamerId + "&assistant_gamerId=" + openid + "&itemId=" + query.itemId + "&source=" + query.source;
							if (query.inviteFriend) {
								str += "&name=" + userInfo.nickName + "&icon=" + userInfo.avatarUrl + "&inviteFriend=" + query.inviteFriend;
							}
							self.setDataForHttp(str);
							if (!Userdefault.getBoolForKey(query.gamerId, false)) {
								canGetLocalCard = true;
								getLocalCareId = "" + query.gamerId;
							}
						} else {
						}

					}
				});
			}
		});
	},
	getUserData: function (func) {
		if (this.instance) {
			wx.getUserInfo({
				success: function (res) {
					var userInfo = res.userInfo
					uinfo.nick = userInfo.nickName//昵称
					uinfo.icon = userInfo.avatarUrl//头像链接
					this.getOnlineSpriteFrame(uinfo.icon, function (spriteFrame) {
						var data = {};
						data.name = uinfo.nick;
						data.icon = spriteFrame;
						func && func(data);
						func = null;
					}.bind(this));
				}.bind(this)
			});
			setTimeout(() => {
				func && func();
			}, 1000);
		}
	},
	setWorldRankData(key, score) {
		var url_n = serverUrl + 'lieyou/wxdata/addRankList?wxGameId=' + wxAppId + '&gamerId=' + openid + '&nikeName=' + uinfo.nick + '&headImagePath=' + uinfo.icon + '&score=' + score + '&rankKey=' + key;
		this.setDataForHttp(url_n);
	},
	setRankingData: function (score) {
		if (!this.getSDKVersionCanUse('1.9.92')) {
			return;
		}
		wx.setUserCloudStorage({
			KVDataList: [{ "key": RankingKey, "value": "" + score }],
			success: function () { console.log("success") },
			fail: function () { console.log("fail") },
			complete: function () { console.log("complete") }
		});
	},
	showAllRankingLayer: function (obj) {
		if (!this.getSDKVersionCanUse('1.9.92')) {
			return;
		}
		var self = this;
		var orderStr = obj.orderStr ? obj.orderStr : "false";
		cc.loader.loadRes('SDK/module/rank/allRanking', function (err, res) {
			var node = cc.instantiate(res);
			obj.node.addChild(node, 9999);
			node.setPosition(obj.x ? obj.x : 0, obj.y ? obj.y : 0);

			node.getComponent('allRank').setData(obj.rankKey, obj.closeFun, orderStr);//this.showAndHideNode.parent
		})
	},
	showFailRankingLayer: function (obj) {
		if (!this.getSDKVersionCanUse('1.9.92')) {
			return;
		}
		var self = this;
		var orderStr = obj.orderStr ? obj.orderStr : "false";
		cc.loader.loadRes('SDK/module/rank/failRanking', function (err, res) {
			var node = cc.instantiate(res);
			obj.node.addChild(node, 9999);
			node.setPosition(obj.x ? obj.x : 0, obj.y ? obj.y : 0);
			node.getComponent('failRank').setData(RankingKey, obj.showAndHideNode, orderStr);
		})
	},
	getInviteFriendData(flag, fun) {
		var url = serverUrl + 'lieyou/wxdata/getFriendInfo/' + wxAppId + "/" + openid + "/" + flag;
		this.setDataForHttp(url, function (response) {
			if (response == "") {
				return;
			}
			var data = JSON.parse(response);
			fun && fun(data);
		});
	},
	modifyInviteFriend(friendId) {
		var url = serverUrl + 'lieyou/wxdata/modifyFlag/' + wxAppId + "/" + openid + "/" + friendId;
		this.setDataForHttp(url);
	},
	deleteInviteFriend(Id) {
		var url = serverUrl + 'lieyou/wxdata/delFriendInfo/' + Id;
		this.setDataForHttp(url);
	},
	addLocalResurr: function () {
		var localCardNum = Userdefault.getIntForKey(localCardKey, 0);

		Userdefault.setDataForKey(localCardKey, localCardNum + 1);

	},
	useResurr: function () {
		var localCardNum = Userdefault.getIntForKey(localCardKey, 0);
		if (localCardNum > 0) {
			var num = localCardNum + netCardNum;
			var delNum = 1;
			if (num >= 5) {
				delNum = num - 4;
			}
			Userdefault.setDataForKey(localCardKey, localCardNum - delNum);
			return;
		}
		netCardNum--;
		//使用复活
		var url = wxData.useResurrDataUrl + "?appId=" + wxData.appId + "&gamerId=" + openid;
		this.setDataForHttp(url);
	},
	checkResurrNum: function () {
		//查看复活数量 
		this.setDataForHttp(wxData.checkResurrDataUrl + "?appId=" + wxData.appId + "&gamerId=" + openid, function (response) {
			netCardNum = parseInt(response);
		});

		var localCardNum = Userdefault.getIntForKey(localCardKey, 0);
		return localCardNum + netCardNum > 5 ? 5 : localCardNum + netCardNum;
	},
	checkResurrNum_2: function () {
		if (canGetNetCardNum) {
			canGetNetCardNum = false;
			setTimeout(function () {
				canGetNetCardNum = true;
			}, getNetCardTime);
			return this.checkResurrNum();
		}

		var localCardNum = Userdefault.getIntForKey(localCardKey, 0);
		return localCardNum + netCardNum > 5 ? 5 : localCardNum + netCardNum;
	},

	getJumpBtnHaveMove() {
		if (!getCanShare() || wxBannerId == "") {
			return 0;
		}
		return wxJumpBtnHaveMove;
	},

	getSysPlatform() {
		return 0;
	},

	getOnlineData() {
		var self = this;
		this.setDataForHttp(wxData.getOnlineData, function (response) {
			if (response == "") {
				return;
			}
			console.log("getOnlineData");
			var data = JSON.parse(response).data;
			if (data.videoFailJumpShare) {
				videoFailJumpShare = parseInt(data.videoFailJumpShare);
			}
			if (data.canShowBanner) {
				canShowBanner = parseInt(data.canShowBanner);
			}

			if (data.wxJumpShowBannerDelayTime) {
				wxJumpShowBannerDelayTime = parseFloat(data.wxJumpShowBannerDelayTime);
			}
			if (data.wxShareFailTips) {
				wxShareFailTips = data.wxShareFailTips;
			}
			if (data.wxJumpBtnHaveMove) {
				wxJumpBtnHaveMove = parseInt(data.wxJumpBtnHaveMove);
			}
			if (data.wxServerVersion) {
				wxServerVersion = parseInt(data.wxServerVersion);
			}
			if (data.canShowRedPack) {
				self.canShowRedPack = parseInt(data.canShowRedPack);
			}
			if (data.showRedPackNum) {
				self.showRedPackNum = parseInt(data.showRedPackNum);
			}
			if (data.canExperienceGame) {
				canExperienceGame = parseInt(data.canExperienceGame);
			}
			if (data.shareOrVideoType) {
				self.shareOrVideoType = parseInt(data.shareOrVideoType);
			}
			if (data.shareSuccessProbability) {
				self.shareSuccessProbability = parseInt(data.shareSuccessProbability);
			}
			if (data.bannerDelayTime && parseInt(data.bannerDelayTime) >= 5) {
				wxData.bannerOnlindDelayTime = parseInt(data.bannerDelayTime);
			}
			if (data.shareSwitch)
				wxData.shareOnlineData = data.shareSwitch;
			if (data.wxVideoId && data.wxVideoId != "") {
				wxVideoId = data.wxVideoId;
			}
			if (data.wxBannerId && data.wxBannerId != "") {
				wxBannerId = data.wxBannerId;
			}
			if (data.forward) {
				wxData.WXforward = JSON.parse(data.forward);
			}
			if (data.spotControl) {
				self.setSpotData(data.spotControl);
			}
			if (data.GasSwitch) {
				window.GasSwitch = parseInt(data.GasSwitch);
			}
			wxData.params = data;
			this.init_func && this.init_func({ getOnlineData: true });
		}.bind(this));
	},
	returnHomeJumpGame() {
		if (wxData.WXforward != "") {
			if (this.getSDKVersionCanUse('2.2.0')) {
				wx.navigateToMiniProgram(wxData.WXforward);
			}
		}
	},
	getParamByOnline(key, defaultV) {
		if (!wxData.params) {
			return defaultV;
		}
		var v = wxData.params[key];
		if (v) {
			return wxData.params[key];
		}

		return defaultV;
	},
	/**
	 * 设置广告显示数据
	 */
	setSpotData(data) {
		if (data.interval) {
			pauseSpotInterval = data.interval;
			resultSpotInterval = data.interval;
		}
		if (data.intervalTime) {
			pauseSpotTime = data.intervalTime;
			resultSpotTime = data.intervalTime;
		}
		if (data.startInterval) {
			pauseSpotStartIndex = data.startInterval;
			resultSpotStartIndex = data.startInterval;
		}

		if (data.items) {
			for (var i = 0; i < data.items.length; i++) {
				if (data.items[i].type && data.items[i].type == 'pause') {
					if (data.items[i].interval) {
						pauseSpotInterval = data.items[i].interval;
					}
					if (data.items[i].intervalTime) {
						pauseSpotTime = data.items[i].intervalTime;
					}
					if (data.items[i].startInterval) {
						pauseSpotStartIndex = data.items[i].startInterval;
					}
				}
				if (data.items[i].type && data.items[i].type == 'result') {
					if (data.items[i].interval) {
						resultSpotInterval = data.items[i].interval;
					}
					if (data.items[i].intervalTime) {
						resultSpotTime = data.items[i].intervalTime;
					}
					if (data.items[i].startInterval) {
						resultSpotStartIndex = data.items[i].startInterval;
					}
				}
			}
		}
	},
	getCdkey(type, func) {
		var url = wxData.getCdkeyDataUrl + "ai=" + wxAppId + "&ui=" + openid + "&pt=" + type;
		this.setDataForHttp(url, function (response) {
			if (response) {
				var cdkey = response;
				func && func(cdkey);
			}
		});
	},
	/**
	 * 检查兑换码
	 * @param {data} func 
	 */
	checkCdkey(cdkey, func) {
		var url = wxData.checkCdkeyDataUrl + "ai=" + wxAppId + "&ui=" + openid + "&pc=" + cdkey;
		console.log(url);

		this.setDataForHttp(url, function (response) {
			if (response) {
				var type = parseInt(response);
				// switch (parseInt(type)) {
				// 	case -1://错误
				// 	case 0://可以使用
				// 	case 1://兑换码超过72小时
				// 	case 2://兑换码使用次数超过5次
				// 	case 3://非法兑换码
				// 	case 5://用户已经使用过该兑换码
				// 		break;
				// 	case 4://兑换码存在，不可用
				// 		break;
				// }
				func && func(type);
			}
		});
	},

	updateSubView(obj) {
		if (!obj || !obj.node) {
			return;
		}
		if (this.subViewObj && this.subViewObj.node == obj.node) {
			this.subViewObj = obj;
			this.updateSubView2(obj);
			return;
		}
		this.subViewObj = obj;
		if (!this.subViewObjList) {
			this.subViewObjList = [];
			setInterval(function () {
				if (!cc.isValid(this.subViewObj.node)) {
					for (var i = this.subViewObjList.length - 1; i >= 0; i--) {
						var subView = this.subViewObjList[i];
						if (cc.isValid(subView.node)) {
							this.subViewObj = subView;
							this.updateSubView2(this.subViewObj);
							this.subViewObj.node.getComponent("SubView").updateData();
							break;
						}
					}
				}
			}.bind(this), 16);
		}
		this.updateSubView2(obj);
		obj.node.getComponent("SubView").updateData();
	},

	updateSubView2(obj) {
		for (var i = 0; i < this.subViewObjList.length; i++) {
			var subView = this.subViewObjList[i];
			//删除不存在或为空的节点，当前节店
			if (!cc.isValid(subView.node) || subView.node == obj.node) {
				this.subViewObjList.splice(i, 1);
				i--;
			} else {
				subView.node.getComponent("SubView").stopUpdateData();
			}
		}
		this.subViewObjList.push(obj);
		wx.postMessage({
			disType: obj.node.getComponent("SubView").mydistype,
			gameMode: window.RankingKey,
			showStr: true,
			score: obj.score
		});
	},


	//微信登录
	login: function () {
		var sef = this;
		wx.login({
			success: function (res) {
				console.log("登录成功");
				sef.getOpenId(res.code);
				console.log(res.code);
			}
		});
	},

	getOpenId: function (code) {
		//获取openid
		var self = this;
		this.setDataForHttp(wxData.getOpenIdUrl + '?appid=' + wxData.appId + '&secret=' + wxData.appSecret + '&js_code=' + code + '&grant_type=authorization_code', function (response) {
			// if (response == "") {
			// 	return;
			// }
			// var data = JSON.parse(response);
			// openid = data.openid;
			// wxData.session_key = data.session_key;
			// uinfo.uid = openid;
			// wsurl += openid;
			// if (self.already) {
			// 	return;
			// }
			// self.openShare();
			// if (self.haveGetAuthorize)
			// 	self.getAuthorize();
			var query = wx.getLaunchOptionsSync().query;
			console.log(query);
			var laiyuan_appid = 0;
			if (wx.getLaunchOptionsSync().referrerInfo && wx.getLaunchOptionsSync().referrerInfo.appId) {
				laiyuan_appid = wx.getLaunchOptionsSync().referrerInfo.appId;
			}
			var laiyuan_scene = wx.getLaunchOptionsSync().scene;
			this.init_func && this.init_func({ scene: laiyuan_scene });
			try {
				wx.aldSendEvent('starGame', { 'appid': laiyuan_appid, 'scene': laiyuan_scene });
			} catch (err) { }
			var url_n = serverUrl + 'lieyou/wxdata/addGameSourceInfo?appid=' + wxAppId + '&openid=' + openid + '&scence=' + laiyuan_scene + '&s_appid=' + laiyuan_appid + '&s_path=' + JSON.stringify(query);
			self.setDataForHttp(url_n);
			var qudao = 'lieyou';
			if (query.channel)
				qudao = query.channel;

			if (query.cdkey) {
				this.init_func && this.init_func({ cdkey: query.cdkey });

			}
			self.setDataForHttp(wxData.putPlayerData + openid + '/' + qudao);
			// self.setDataForHttp(wxData.putPlayerData + openid);

			// self.checkResurrNum();
			// self.already = true;
		}.bind(this));
	},

	setShareData: function () {
		//获取分享数据
		this.setDataForHttp(wxData.shareUrl, function (response) {
			if (response == "") {
				return;
			}
			wxData.shareData = JSON.parse(response);
		});
	},
	setMoreGameData: function () {
		//获取更多游戏数据
		var sysPlatform = 'android'
		if (cc.sys.os == cc.sys.OS_IOS) {
			sysPlatform = 'ios';
		}
		this.setDataForHttp(wxData.moreGameUrl + '&sysPlatForm=' + sysPlatform, function (response) {
			if (response == "") {
				return;
			}
			wxData.moreGameData = JSON.parse(response);
			for (var i = 0; i < wxData.moreGameData.length; i++) {
				if (wxData.moreGameData[i].screen && wxData.moreGameData[i].screen.length > 0 && wxData.moreGameData[i].screen[0].length > 0) {
					spotData.push(wxData.moreGameData[i]);
				}
			}
		});
	},


	showMoreGameByIcon: function (obj) {
		if (this.isShenhe()) {
			return;
		}
		//显示更多游戏  按钮obj = {node:node,x:x,y:y}
		//{img:"",shareImg:["",""]}
		var self = this;
		cc.loader.loadRes('SDK/module/moreGame/iconMoreGame', function (err, res) {
			if (wxData.moreGameData.length <= 0) {
				setTimeout(function () {
					if (obj.node.isValid) {
						self.showMoreGameByIcon(obj);
					}
				}, 1000);
				return;
			}
			var node = cc.instantiate(res);
			obj.node.addChild(node);
			node.setPosition(obj.x ? obj.x : 0, obj.y ? obj.y : 0);
			//node.getComponent('moreGame').setCallBack(self.moreGameCallBackByIcon);

			var random = parseInt(Math.random() * wxData.moreGameData.length);
			var moreData = wxData.moreGameData[random];
			node.getComponent('moreGame').setData(moreData.icon, moreData.image, moreData.jumpType, moreData.jumpData);//{img:moreData.icon,shareImg:moreData.image});
		})
	},
	showMoreGameByBanner: function (obj) {
		if (this.isShenhe()) {
			return;
		}
		obj = {};
		var self = this;
		var nodeF = cc.find('Canvas');

		cc.loader.loadRes('SDK/module/moreGame/bannerMoreGame', function (err, res) {
			if (wxData.moreGameData.length <= 0) {
				setTimeout(function () {
					if (nodeF.isValid) {
						self.showMoreGameByBanner(obj);
					}
				}, 1000);
				return;
			}
			var node = cc.instantiate(res);
			nodeF.addChild(node);

			// var random = parseInt(Math.random() * wxData.moreGameData.length);
			// var moreData = wxData.moreGameData[random];
			// var bannerImg = moreData.banner;
			// var random2 = parseInt(Math.random() * bannerImg.length);
			// var bannerImg1 = bannerImg[random2];
			// node.getComponent('moreGame').setData(bannerImg1,moreData.image,moreData.jumpType,moreData.jumpData);//{,moreData:bannerImg});
		})
	},



	showMoreGame: function () {
		if (wxData.moreGameData.length <= 0) {
			return;
		}
		var random = parseInt(Math.random() * wxData.moreGameData.length);
		var moreData = wxData.moreGameData[random];

		this.jumpApp(moreData.jumpData, moreData.image, 1, 1);
		try {
			var gameNameUrl = moreData.icon.split("/");
			var gameName = gameNameUrl[gameNameUrl.length - 2];
			wx.aldSendEvent('moreGame', { 'gameName': gameName });
		} catch (err) { }

	},
	/**
	 * 帮助成功分享
	 */
	shareHelpSuccess(level) {
		this.shareOnShow = true;
		this.shareBegTime = getTime() / 1000;
		this.shareCallBack = null;
		//source 9
		var self = this;
		if (wxData.shareData.length > 0 && getCanShare()) {
			var adid = 0;
			var _title = "";
			var _url = "";

			for (var i = 0; i < wxData.shareData.length; i++) {
				if (wxData.shareData[i].mode == GameName) {
					var data = wxData.shareData[i].item;
					if (wxData.shareData[i].level && wxData.shareData[i].level.success) {
						data = wxData.shareData[i].level.success;
					}
					var random = parseInt(Math.random() * data.length);
					adid = data[random].id;
					_title = data[random].title;

					_title = _title.replace(/%d/g, level + 1);
					_url = data[random].img;
				}
			}

			var _query = wxData.putShareDataUrl + "?dsadsa=dsdsd" + "&appId=" + wxData.appId + "&gamerId=" + openid + "&itemId=" + adid + "&source=9";
			this._shareQuery = _query;
			wx.aldShareAppMessage({ title: _title, imageUrl: _url, query: _query });
		} else {
			var _query = wxData.putShareDataUrl + "?dsadsa=dsdsd" + "&appId=" + wxData.appId + "&gamerId=" + openid + "&itemId=" + -1 + "&source=9";
			this._shareQuery = _query;
			wx.aldShareAppMessage({
				title: "好玩的游戏，快来一起玩吧",
				imageUrl: "https://res.igame58.com/wxxyx/commom/shareIcon.png",
				query: _query
			});
		}
	},
	/**
	 * 帮助分享
	 */
	shareHelp(level) {
		this.shareOnShow = true;
		this.shareBegTime = getTime() / 1000;
		this.shareCallBack = null;
		//source 8
		var self = this;
		if (wxData.shareData.length > 0 && getCanShare()) {
			var adid = 0;
			var _title = "";
			var _url = "";

			for (var i = 0; i < wxData.shareData.length; i++) {
				if (wxData.shareData[i].mode == GameName) {
					var data = wxData.shareData[i].item;
					if (wxData.shareData[i].level && wxData.shareData[i].level.help) {
						data = wxData.shareData[i].level.help;
					}

					var random = parseInt(Math.random() * data.length);
					adid = data[random].id;
					_title = data[random].title;
					_title = _title.replace(/%d/g, level + 1);
					_url = data[random].img;
				}
			}


			var _query = wxData.putShareDataUrl + "?dsadsa=dsdsd" + "&appId=" + wxData.appId + "&gamerId=" + openid + "&itemId=" + adid + "&source=8" + "&level=" + level;
			this._shareQuery = _query;
			wx.aldShareAppMessage({
				title: _title,
				imageUrl: _url,
				query: _query
			});
		} else {
			var _query = wxData.putShareDataUrl + "?dsadsa=dsdsd" + "&appId=" + wxData.appId + "&gamerId=" + openid + "&itemId=" + -1 + "&source=8" + "&level=" + level;
			this._shareQuery = _query;
			wx.aldShareAppMessage({
				title: "好玩的游戏，快来一起玩吧",
				imageUrl: "https://res.igame58.com/wxxyx/commom/shareIcon.png",
				query: _query
			});
		}
	},
	helpFriendSuccess(level) {
		//wxAppId helpOpenId level uinfo.icon uinfo.nick
		var url = serverUrl + "lieyou/wxdata/addHelpRecord?wxGameId=" + wxAppId + "&gamerId=" + helpOpenId + "&level=" + level + "&icon=" + uinfo.icon + "&name=" + uinfo.nick;
		this.setDataForHttp(url);
	},
	getIsHaveFriendHelpMe(level, fun) {
		//level openid wxAppId   
		var url = serverUrl + "lieyou/wxdata/getClickInfo/" + wxAppId + "/" + openid + "/" + level;
		this.setDataForHttp(url, function (response) {
			if (response == "") {
				return;
			}
			var data = JSON.parse(response);
			if (data.name && data.name != "") {
				fun({ level: level, name: data.name, icon: data.icon });
			}
		});
	},


	/**
	 * 获取帮助关卡 默认返回-1
	 */
	getHelpLevel() {
		var query = wx.getLaunchOptionsSync().query;
		if (query.level && query.source == 8) {
			helpOpenId = query.gamerId;
			return parseInt(query.level);
		}
		return -1;
	},
	openShare: function () {
		//开启被动分享
		var self = this;
		if (!this.haveGetAuthorize) {
			var query = wx.getLaunchOptionsSync().query;
			if (query.source) {
				var str = wxData.putTouchShareDataUrl + "?" + "appId=" + query.appId + "&principal_gamerId=" + query.gamerId + "&assistant_gamerId=" + openid + "&itemId=" + query.itemId + "&source=" + query.source;
				this.setDataForHttp(str);
				if (!Userdefault.getBoolForKey(query.gamerId, false)) {
					canGetLocalCard = true;
					getLocalCareId = "" + query.gamerId;
				}
			} else {
			}
		}
		wx.showShareMenu({ withShareTicket: true });
		wx.aldOnShareAppMessage(function () {

			self.shareOnShow = true;
			self.shareBegTime = getTime() / 1000;
			self.shareCallBack = null

			var adid = -1;
			var _title = "好玩的游戏，快来一起玩吧";
			var _url = "https://res.igame58.com/wxxyx/commom/shareIcon.png";
			for (var i = 0; i < wxData.shareData.length; i++) {
				if (wxData.shareData[i].mode == GameName) {
					var data = wxData.shareData[i].item;
					var random = parseInt(Math.random() * data.length);
					adid = data[random].id;
					_title = data[random].title;
					_url = data[random].img;
				}
			}

			var _query = wxData.putShareDataUrl + "?sdsdsds=dsds" + "&appId=" + wxData.appId + "&gamerId=" + openid + "&itemId=" + adid + "&source=1";
			self._shareQuery = _query;
			return {
				title: _title,
				imageUrl: _url,
				query: _query
			}
		});
	},
	// 1 更多游戏 2 插屏广告 3 三行的猜你喜欢 4 两行的猜你喜欢 5 一行的猜你喜欢 6 banner大图 7 banner小图 8 体验有奖 9 精品推荐 10 icon
	jumpApp(data, url, page, num, func) {
		var self = this;
		if (this.getSDKVersionCanUse('2.2.0')) {
			wx.navigateToMiniProgram({
				appId: data.appId, path: data.path, fail: function (err) {
					var forward_appid = data.appId;
					var url_n = serverUrl + 'lieyou/wxdata/addGamePromotion?page=' + page + '&appid=' + wxAppId + '&s_number=' + num + '&forward_appid=' + forward_appid + '&openid=' + openid + '&status=' + 0;
					self.setDataForHttp(url_n);
					if (err.errMsg != 'navigateToMiniProgram:fail cancel') {
						wx.previewImage({
							current: url[0], // 当前显示图片的http链接 
							urls: url, // 需要预览的图片http链接列表 
							success: function () { }
						})
					}
					func && func(0);
				}, success: function (err) {
					var forward_appid = data.appId;
					var url_n = serverUrl + 'lieyou/wxdata/addGamePromotion?page=' + page + '&appid=' + wxAppId + '&s_number=' + num + '&forward_appid=' + forward_appid + '&openid=' + openid + '&status=' + 1;
					self.setDataForHttp(url_n);
					func && func(1);
				}
			});
		} else {
			wx.previewImage({
				current: url[0], // 当前显示图片的http链接 
				urls: url, // 需要预览的图片http链接列表 
				success: function () { }
			})
		}
	},

	shareDialog(_node) {
		cc.loader.loadRes('SDK/module/shareDialog/shareDialog', function (err, res) {
			if (_node && _node.isValid) {
				var node = cc.instantiate(res);
				_node.addChild(node);
			}
		})
	},
	addGetLocakCardDialog(_node) {
		if (canGetLocalCard) {
			cc.loader.loadRes('SDK/module/shareDialog/addRessousDialog', function (err, res) {
				if (_node && _node.isValid) {
					var node = cc.instantiate(res);
					_node.addChild(node);
				}
			})
		}
	},

	showInviteFriend(_node, _callBack) {
		cc.loader.loadRes('SDK/module/inviteFriend/inveteFriendDialog', function (err, res) {
			if (_node && _node.isValid) {
				var node = cc.instantiate(res);
				if (_callBack) {
					node.getComponent('inveteFriend').setDataCallBack(_callBack);
				}
				node.getComponent('inveteFriend').setData(true);
				_node.addChild(node);
			}
		})
	},
	showInviteFriendFailure(_node) {
		cc.loader.loadRes('SDK/module/inviteFriend/inveteFriendDialog', function (err, res) {
			if (_node && _node.isValid) {
				var node = cc.instantiate(res);
				node.getComponent('inveteFriend').setData(false);
				_node.addChild(node);
			}
		})
	},

	getSDKVersionCanUse: function (data) {
		var wxSys = wx.getSystemInfoSync();

		var version = wxSys.SDKVersion;
		var str = data.split(".");
		var str1 = version.split(".");
		for (var i = 0; i < 3; i++) {
			if (str1[i] < str[i]) {
				return false;
			} else if (str1[i] > str[i]) {
				break;
			}
		}
		return true;
	},

	showRedPack(obj) {
		if (!this.canShowRedPack) {
			return;
		}
		if (this.isShenhe()) {
			return;
		}
		var money = Userdefault.getIntForKey('SDK_redPackManeyNum', 0);
		if (money >= 1900) {
			return;
		}
		var dayNow = getTimeDay();
		var showNum = Userdefault.getIntForKey('SDK_redPackShowNum', 0);
		var dayLast = Userdefault.getIntForKey('SDK_redPackShowDay', 0);
		if (dayLast != dayNow) {
			showNum = 0;
		}
		if (showNum >= this.showRedPackNum) {
			return;
		}
		Userdefault.setDataForKey('SDK_redPackShowDay', dayNow);
		Userdefault.setDataForKey('SDK_redPackShowNum', showNum + 1);

		var self = this;
		cc.loader.loadRes('SDK/module/redPacket/redPackGameOver', function (err, res) {
			var fnode = cc.find('Canvas');
			var node = cc.instantiate(res);
			node.name = "dialog";
			fnode.addChild(node, 999);
			node.getComponent('receiveRedPack').setCallBack(obj.callBack ? obj.callBack : null);
		})
	},

	showRedIcon(obj) {
		if (!this.canShowRedPack) {
			return;
		}
		if (this.isShenhe()) {
			return;
		}
		var self = this;
		cc.loader.loadRes('SDK/module/redPacket/redPack', function (err, res) {
			var node = cc.instantiate(res);
			var fNode = obj.node ? obj.node : cc.find('Canvas');
			node.x = obj.x ? obj.x : 0;
			node.y = obj.y ? obj.y : 0;
			fNode.addChild(node);
		})
	},

	isGasSwitch() {
		return (window.GasSwitch == 1);
	},

	showMySpot() {
		if (this.isShenhe()) {
			return;
		}

		var self = this;
		cc.loader.loadRes('SDK/module/banner/bannerNode', function (err, res) {
			var node = cc.instantiate(res);
			cc.find('Canvas').addChild(node, 9999);
			var bannerRandom = parseInt(Math.random() * spotData.length);
			var data = spotData[bannerRandom];
			var ran = parseInt(Math.random() * data.screen.length);

			node.getComponent('banner').setData(data.screen[ran], data.image, data.jumpType, data.jumpData);
		})
	},

	sendDataToServer(type, func) {
		var url = serverUrl;
		switch (type) {
			case 0:
				url += 'lieyou/wxdata/addGameVideoAdvertis?';
				break;

		}
		//提交数据到服务器 无返回值 
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
				var response = xhr.responseText;
				if (response == '-1') {
				}
				else if (response == '-2') {
				}
				else {
					if (fun) {
						fun(response);
					}
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send();
	},
})
module.exports = WxManager;