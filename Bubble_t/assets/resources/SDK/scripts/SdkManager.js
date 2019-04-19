const WxManager = require('WxManager');

window.SdkManager = {
	instance: null,
	platform: '',
	init: function (func) {


		console.log('版本：' + _SDKVersion);
		if (!this.instance) {
			console.log(">>>>>>>>>>>>         init sdk");
			this.setNewPlayerData();
			this.initGameData();
			//this.initMainGame();//设置主游戏
			if (cc.sys.platform === cc.sys.WECHAT_GAME) {
				this.instance = new WxManager();
				this.instance.init(func);
			}
		}

	},
	/**
	 * 是否可以看视频
	 */
	getHaveVideo() {
		if (this.instance) {
			return this.instance.getHaveVideo();
		}
		return true;
	},
	/**
	 * 0 微信 1 原生 2 facebook  3 vivo 4 oppo 5 oppoH5 
	 */
	getSysPlatform() {
		if (this.instance) {
			return this.instance.getSysPlatform();
		}
		return -1;
	},
	/**
	 * 初始化游戏数据
	 */
	initGameData() {
		var winSize = cc.winSize;
		var widthS = winSize.height * 0.5625;
		if (winSize.width < widthS) {
			lieyou._SceneScale = winSize.width / widthS;
			lieyou._offsetY = winSize.height * (1 - winSize.width / widthS) / 2;
			lieyou._offsetX = winSize.width * (1 - winSize.width / widthS) / 2;
		}
	},
	isGasSwitch() {
		if (this.instance) {
			return this.instance.isGasSwitch();
		}
		return true;
	},
	/**
	 * 监听进入后台
	 */
	onHide: function (fun) {
		if (this.instance) {
			this.instance.onHide(fun);
		}
	},
	/**
	 * 监听后台返回游戏
	 */
	onShow(fun) {
		if (this.instance) {
			this.instance.onShow(fun);
		}
	},

	getHelpLevel() {
		if (this.instance) {
			return this.instance.getHelpLevel();
		}
		return -1;
	},
	/**
	 * 显示广告 要传位置wxBannerId
	 * showBanner({adUnitId:id,style:{left:0,top:0,width:300,height:105}})
	 */
	showBanner: function (obj = {}) {
		if (this.instance)
			this.instance.showBanner(obj);
	},
	/**
	 * 自定义广告obj(id:0,x:0,y:0,scale:0)
	 */
	showBannerCustom(obj = {}) {
		if (this.instance)
			this.instance.showBannerCustom(obj);
	},
	/**
	 * 显示底部广告 wxBannerId
	 */
	showBannerByBottom: function (node) {
		if (this.instance)
			this.instance.showBannerByBottom(node);
	},
	/**
	 * 显示底部广告 wxBannerId
	 */
	showBannerByNode: function (node) {
		if (this.instance)
			this.instance.showBannerByNode(node);
	},
	/**
	 * 显示顶部广告 wxBannerId
	 */
	showBannerByTop: function (id = '') {
		if (this.instance)
			this.instance.showBannerByTop(id);
	},
	/**
	 * 隐藏广告条
	 */
	hideBanner: function () {
		if (this.instance)
			this.instance.hideBanner();
	},
	/**
	 * 视频广告 wxVideoId function(){}
	 */
	showRewardedVideoAd: function (id, closeCallBack) {
		if (this.instance)
			this.instance.showRewardedVideoAd(id, closeCallBack);
		else
			closeCallBack && closeCallBack(true);
	},
	/**
	 * 获取微信授权 
	 */
	getAuthorize: function () {
		if (this.instance)
			this.instance.getAuthorize();
	},
	/**
	 * 获取用户信息  func(data)  data.name  用户名称   data.icon  用户图像----SpriteFrame
	 */
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
	/**
	 * 微信登陆
	 */
	login: function () {
		if (this.instance)
			this.instance.login();
	},
	/**
	 * 添加本地复活卡
	 */
	addLocalResurr: function () {
		if (this.instance)
			this.instance.addLocalResurr();
	},
	/**
	 * 使用复活卡
	 */
	useResurr: function () {
		if (this.instance)
			this.instance.useResurr();
	},
	/**
	 * 删除邀请到的好友
	 */
	deleteInviteFriend(id) {
		if (this.instance)
			this.instance.deleteInviteFriend(id);
	},
	/**
	 *  修改邀请好友状态
	 */
	modifyInviteFriend(friendId) {
		if (this.instance)
			this.instance.modifyInviteFriend(friendId);
	},
	/**
	 * 获取邀请到的好友列表
	 */
	getInviteFriendData(flag, fun) {
		if (this.instance)
			this.instance.getInviteFriendData(flag, fun);
	},

	/**
	 * 显示邀请到的好友
	 */
	showInviteFriend(_node, _callBack) {
		if (this.instance)
			this.instance.showInviteFriend(_node, _callBack);
	},
	/**
	 * 显示邀请到的好友 已经领取过奖励的
	 */
	showInviteFriendFailure(_node) {
		if (this.instance)
			this.instance.showInviteFriendFailure(_node);
	},
	/**
	 * 查看复活卡 返回复活卡个数 实时
	 */
	checkResurrNum: function () {
		if (this.instance)
			return this.instance.checkResurrNum();
		return 0;
	},
	/**
	 * 查看复活卡 返回复活卡个数 不是实时
	 */
	checkResurrNum_2: function () {
		if (this.instance)
			return this.instance.checkResurrNum_2();

		return 0;
	},
	/**
	 * 分享{name:游戏名,source:1,inviteFriend:bool,success:function(type){1 分享到群  2 个人},getGroupId:true} 
	 * source 1 转发 2 首页分享按钮 3 复活 4 炫耀 5 使用道具 6 双倍奖励 7 解锁 8 帮助 9 帮助成功 10 视频失败调用分享
	 */
	share: function (obj) {
		if (this.instance)
			this.instance.share(obj);
		else
			obj.success && obj.success(true);
	},
	shareHelp(level) {
		if (this.instance)
			this.instance.shareHelp(level);
	},
	shareHelpSuccess(level) {
		if (this.instance)
			this.instance.shareHelpSuccess(level);
	},
	/**
	 * 
	 */
	helpFriendSuccess(level) {
		if (this.instance) {
			this.instance.helpFriendSuccess(level);
		}
	},
	getIsHaveFriendHelpMe(level, fun) {
		if (this.instance)
			this.instance.getIsHaveFriendHelpMe(level, fun);
	},

	/**
	 * 显示更多游戏icon {node:node,x:0,y:0}
	 */
	showMoreGameByIcon: function (obj) {
		if (this.instance) {
			this.instance.showMoreGameByIcon(obj);
		}
	},
	/**
	 * 显示更多游戏banner {node:node,x:0,y:0}
	 */
	showMoreGameByBanner: function (obj) {
		if (this.instance) {
			this.instance.showMoreGameByBanner(obj);
		}
	},
	/**
	 * 显示全部排行榜 {rankKey:key,node:node,closeFun:fun,orderStr:"false",x:0,y:0}
	 * orderStr 默认false
	 */
	showAllRankingLayer: function (obj) {
		if (this.instance)
			this.instance.showAllRankingLayer(obj);
	},
	/**
	 * 显示失败排行榜 {node:node,showAndHideNode:node,orderStr:"false",x:0,y:0}
	 */
	showFailRankingLayer: function (obj) {
		if (this.instance)
			this.instance.showFailRankingLayer(obj);
	},
	/**
	 * 提交排行榜数据 key,score
	 */
	setRankingData: function (score) {
		if (this.instance)
			this.instance.setRankingData(score);
	},
	/**
	 * 显示社区按钮{
            icon: 'white',//green  dark   light
            style: {
                left: 15,
                top: 15,
                width: 40,
                height: 40
            }
        }
	 */
	showForum: function (obj) {
		if (this.instance)
			this.instance.showForum(obj);
	},
	/**
	 * 隐藏社区按钮
	 */
	closeForum: function () {
		if (this.instance)
			this.instance.closeForum();
	},

	showFeedbackButton: function () {
		if (this.instance)
			this.instance.showFeedbackButton();
	},
	hideFeedbackButton: function () {
		if (this.instance)
			this.instance.hideFeedbackButton();
	},
	/**
	 * 显示更多游戏
	 */
	showMoreGame: function () {
		if (this.instance)
			this.instance.showMoreGame();
	},
	/**
	 * 跳转app
	 */
	jumpApp(data, url, page, num, func = null) {
		if (this.instance)
			this.instance.jumpApp(data, url, page, num, func);
	},

	/**
	 * 微信获取版本是否支持此方法 data = “1.6.6”版本号
	 */
	getSDKVersionCanUse: function (data) {
		if (this.instance)
			return this.instance.getSDKVersionCanUse(data);
		return true;
	},

	/**
	 * 设置新玩家数据
	 */
	setNewPlayerData() {
		var beginGameNum = Userdefault.getIntForKey("comeGameNum", 0);
		Userdefault.setDataForKey("comeGameNum", beginGameNum + 1);

		var newPlayer = Userdefault.getBoolForKey(lieyou.Key_NewPlayer, true);//levelStar + level
		if (newPlayer) {
			var nowTime = parseInt(getTime() / 1000);
			Userdefault.setDataForKey(lieyou.Key_OncePlayerTime, nowTime);
			Userdefault.setBoolForKey(lieyou.Key_NewPlayer, false);

			var time = getTimeDay();
			Userdefault.setDataForKey(lieyou.Key_OncePlayerTimeDay, time);

		}
	},

	/**
	 * 游戏开始
	 */
	gameBeginLevel(mode, level) {
		console.log("模式   mode =====  " + mode + "   游戏开始 level = " + level);
		if (this.instance)
			this.instance.jniLevel(mode, level, 0);
	},
	/**
	 * 游戏失败
	 */
	gameFailLevel(mode, level) {
		console.log("模式   mode =====  " + mode + "   游戏失败 level = " + level);
		if (this.instance)
			this.instance.jniLevel(mode, level, 2);
	},
	/**
	 * 游戏过关
	 */
	gameFinishLevel(mode, level) {
		console.log("模式   mode =====  " + mode + "   游戏过关 level = " + level);
		var levelMax = Userdefault.getIntForKey("SDKGameMaxLevel" + mode, 0);
		if (level > levelMax)
			Userdefault.setDataForKey("SDKGameMaxLevel" + mode, level);

		if (this.instance)
			this.instance.jniLevel(mode, level, 1);
	},
	/**
	 * 提交分数 无尽模式需要
	 */
	gameScore(mode, score) {
		console.log("模式   mode =====  " + mode + "   分数 score = " + score);
		var scoreMax = Userdefault.getIntForKey("SDKGameMaxScore" + mode, 0);
		if (score > scoreMax)
			Userdefault.setDataForKey("SDKGameMaxScore" + mode, score);
	},//
	/**
	 * 添加提示
	 */
	addToast(str, fontSize) {
		if (this.instance)
			this.instance.addToast(str, fontSize);
	},
	shareDialog(_node) {
		if (this.instance)
			this.instance.shareDialog(_node);

	},
	addGetLocakCardDialog(_node) {
		if (this.instance)
			this.instance.addGetLocakCardDialog(_node);

	},
	/**
	 * 获取在线参数
	 */
	getParamByOnline(key, defaultV) {
		if (this.instance)
			return this.instance.getParamByOnline(key, defaultV);
	},
	/**
	 *加载网络图片 
	 */

	getOnlineSpriteFrame(url, fun) {
		if (this.instance)
			this.instance.getOnlineSpriteFrame(url, fun);
	},

	/**
	 * 猜你喜欢{node:_node,x:x,y:y,align:0}//0 居中 -1 下 1 上
	 */
	showGuessYouLickOne(obj) {
		if (this.instance)
			this.instance.showGuessYouLickOne(obj);
	},
	showGuessYouLickTow(obj) {
		if (this.instance)
			this.instance.showGuessYouLickTow(obj);
	},

	returnHomeJumpGame() {
		if (this.instance)
			this.instance.returnHomeJumpGame();
	},


	initPhysics(data) {
		cc.game.config.groupList = data["group-list"];
		cc.game.config.collisionMatrix = data["collision-matrix"];

		cc.game._initConfig(cc.game.config);
	},

	//微信
	/**
	 * {callBack:fun}
	 */
	showRedPack(obj = {}) {
		if (this.instance)
			this.instance.showRedPack(obj);
	},
	/**
	 *  obj {node:node,x:0,y:0}
	 */
	showRedIcon(obj = {}) {
		if (this.instance)
			this.instance.showRedIcon(obj);
	},
	showRecommendIcon(obj = {}) {
		if (this.instance)
			this.instance.showRecommendIcon(obj);
	},
	showGameRecommend(callBack = null) {
		if (this.instance)
			this.instance.showGameRecommend(callBack);
		else
			callBack && callBack(1);
	},
	getGameRecommendData() {
		if (this.instance)
			return this.instance.getGameRecommendData();
		else
			return [];
	},
	showGameRecommendDialog(callBack = null) {
		if (this.instance)
			this.instance.showGameRecommendDialog(callBack);
	},
	isShenhe() {
		if (this.instance)
			return !getCanShare();
		else
			return false;
	},
	checkCdkey(cdkey, func) {
		if (this.instance)
			this.instance.checkCdkey(cdkey, func);
		else
			func && func(0);
	},
	getServerTime() {
		if (this.instance) {
			return this.instance.getServerTime();
		} else {
			return getTime();
		}
	},

	updateSubView(obj) {
		if (this.instance) {
			return this.instance.updateSubView(obj);
		}
	},

	/**
	 * 0 没有分享 没有视频 1 分享 2 视频
	 */
	getShareOrViedo() {
		if (this.instance)
			return this.instance.getShareOrViedo();
		return 0;
	},
	getJumpBtnHaveMove() {
		if (this.instance)
			return this.instance.getJumpBtnHaveMove();
		return 0;
	},
	showGuessYouLike_3(obj) {
		if (this.instance)
			this.instance.showGuessYouLike_3(obj);
	},

	/**
	 * 显示自己广告		进入游戏
	 */
	showSpotByBegin(isHaveNative = false, top = 0) {
	},
	/**
	 * 显示自己广告		暂停
	 */
	showSpotByPause(isHaveNative = false, top = 0) {
	},
	/**
	 * 显示自己广告  	游戏结束
	 */
	showSpotByFinish(isHaveNative = false, top = 0) {
	},
	/**
	 * 解析数据
	 */
	parseData(data, str) {
		var a = data.split(',');
		for (var i = 0; i < a.length; i++) {
			if (a[i].split('wait:').length > 1) {
				if (a[i].split('wait:')[1] == str) {
					return true;
				}
			} else if (a[i].split('waitL').length > 1) {
				var b = a[i].split('waitL')[1].split(':');
				var levelMax = Userdefault.getIntForKey("SDKGameMaxLevel", 0);
				if (b[1] == str && levelMax > parseInt(b[0])) {
					return true;
				}
			} else if (a[i].split('waitS').length > 1) {
				var b = a[i].split('waitS')[1].split(':');
				var scoreMax = Userdefault.getIntForKey("SDKGameMaxScore", 0);
				if (b[1] == str && scoreMax > parseInt(b[0])) {
					return true;
				}
			} else if (a[i].split('waitT').length > 1) {
				var b = a[i].split('waitT')[1].split(':');
				var time = Userdefault.getIntForKey(lieyou.Key_OncePlayerTime, 0);
				var nowTime = parseInt(getTime() / 1000);
				if (b[1] == str && nowTime - time > parseInt(b[0])) {
					return true;
				}
			} else if (a[i].split('waitE').length > 1) {
				var b = a[i].split('waitE')[1].split(':');
				var num = Userdefault.getIntForKey("comeGameNum", 0);
				if (b[1] == str && num > parseInt(b[0])) {
					return true;
				}
			} else if (a[i].split('waitD').length > 1) {
				var b = a[i].split('waitD')[1].split(':');
				var time = Userdefault.getIntForKey(lieyou.Key_OncePlayerTimeDay, 0);
				var nowTime = getTimeDay();
				if (b[1] == str && nowTime - time > parseInt(b[0])) {
					return true;
				}
			}
		}
		return false;
	},
	/**
	 * node:跳过按钮 x:moveEndx  y:moveEndy
	 * {node:node,x:0,y:0} 
	 */
	jumpRefreshBanner(obj = {}) {
	},

	/**android ios */
	callAndroid(action) {
	},
	callAndroid_2(action, funS) {
	},
	callPay(action, funS) {
	},
	isOpen(key) {
	},
	getIsNative() {
		return false;
	},
	/**
	 * 子游戏回主页 安卓
	 */
	backHome() {
	},
	/**
	 * 跳转子游戏 安卓
	 */
	gotoSmallGame(gameName) {
	},
	gameAction(gameName) {
	},
	/**
	 * obj  = {x:0,y:0,w:16,h:9}
	 */
	showPraise() {
	},


	showNativeBanner(top) {

	},
	hideNativeBanner() {
	},
}