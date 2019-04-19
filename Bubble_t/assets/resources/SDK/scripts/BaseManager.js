/***********************
1.常用方法
    init				                //SDK初始化
    showBannerByBottom		            //显示底部广告	
    hideBanner			                //隐藏底部广告
    share				                //分享
    showRewardedVideoAd		            //显示视屏广告
    getCanShare			                //判断是否可以分享
    getHaveVideo			            //判断是否可以视频
    getShareOrViedo                     //获取分享或者视频可用
    showGuessYouLick		            //显示猜你喜欢
    showGameRecommend		            //显示游戏试玩弹窗
    showRecommendIcon		            //显示游戏试玩折叠按钮
    showForum			                //显示论坛
    closeForum			                //隐藏论坛
    onHide				                //游戏进入后台
    onShow			                    //游戏从后台返回游戏
    getAuthorize			            //用户授权
    getUserData			                //获取用户数据
    setRankingData			            //上传游戏分数到排行榜
    showAllRankingLayer		            //显示全部排行榜
    showFailRankingLayer		        //显示失败排行榜
    getInviteFriendData		            //获取邀请好友数据
    removeInviteFriendData		        //删除邀请好友数据(指定某个好友)
    checkResurrNum_2		            //获取复活卡数量
    useResurr			                //使用复活卡
    shareDialog			                //显示获取复活卡分享弹窗

*/

let BaseManager = cc.Class({
    properties: {
        spotADId: "",
        videoId: "",
    },

    init: function (obj) { },
    showBannerByBottom(id) { },
    showBannerByTop(id) { },
    showBannerCustom(obj) { },
    showBanner(obj) { },
    hideBanner() { },
    share(obj) { },
    showRewardedVideoAd(id, closeCallBack) { },
    isShenhe() { },
    getCanShare() { },
    getHaveVideo() { },
    getShareOrViedo() { return 0; },
    showGuessYouLickOne(obj) { },
    showGuessYouLickTow(obj) { },
    showGuessYouLike_3(obj) { },
    showRecommendIcon(obj) { },
    getGameRecommendData(callBack) { },
    showGameRecommend(callBack) { },
    showGameRecommendDialog(callBack) { },
    showForum(obj) { },
    closeForum() { },
    onHide(fun) { },
    onShow(fun) { },
    getAuthorize() { },
    getUserData(fun) { },
    setRankingData(key, score) { },
    showAllRankingLayer(obj) { },
    showFailRankingLayer(obj) { },
    getInviteFriendData(flag, fun) { },
    modifyInviteFriend(friendId) { },
    deleteInviteFriend(id) { },
    addLocalResurr() { },
    useResurr() { },
    checkResurrNum() { return 0; },
    checkResurrNum_2() { return 0; },
    getJumpBtnHaveMove() { return 0; },
    getCdkey(func) { },
    checkCdkey(func) { },
    isGasSwitch(){ },
    getServerTime() {
        if(this.serverTime){
            return this.serverTime + this.gameTime;
        }
        return getTime();
    },


    login() { },
    shareDialog(_node) { },
    showMoreGameByIcon(obj) { },
    showMoreGameByBanner(obj) { },
    showMoreGame() { },
    jumpApp(data, url) { },
    getOnlineSpriteFrame(url, fun) {
        if (url == "") {
            return;
        }
        var loadFile = {
            url: url,
            type: "image"
        };
        cc.loader.load(loadFile, function (err, tex) {
            if (err) {
                return;
            }
            fun(new cc.SpriteFrame(tex));
        });
    },
    addToast(str, size) {
        console.log(str);
        cc.loader.loadRes('SDK/module/toastWord/toastWord', function (err, res) {
            var node = cc.instantiate(res);
            node.getComponent('ToastScript').setString(str, size);
            cc.find('Canvas').addChild(node, 9999);
        })
    },
    setDataForHttp: function (url, fun) {
        console.log(url);
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
    shake(time = 15) {
        if (this.m_platform === Platform.WECHAT) {
            if (time > 500) {
                wx.vibrateLong({
                    success: function () { }, fail: function () { },
                    complete: function () { }.bind(this)
                });
                return;
            }
            var time2 = getTime();
            wx.vibrateShort({
                success: function () { }, fail: function () { },
                complete: function () {
                    time > 0 && this.shake(time - (getTime() - time2));
                }.bind(this)
            });
        }
    },
    // Aldinit = 0x001,
    // AldstarGame = 0x002,
    // AldmoreGame = 0x003,
    // AldplayVideoBegin = 0x004,
    // AldplayVideoSuccess = 0x005,
    // AldplayVideoFail = 0x006,
    // AldOnShare = 0x007,
    // Aldshare = 0x008,

    // aldEvent(type, obj) {
    //     try {
    //         switch (type) {
    //             case Aldinit:
    //                 wx.aldSendEvent('initAld', { '': '' });
    //                 break;
    //             case AldstarGame:
    //                 wx.aldSendEvent('starGame', obj);
    //                 break;
    //             case AldmoreGame:
    //                 wx.aldSendEvent('moreGame', obj);
    //                 break;
    //             case AldplayVideoBegin:
    //                 wx.aldSendEvent('playVideo', { result: 'playBegin' });
    //                 break;
    //             case AldplayVideoSuccess:
    //                 wx.aldSendEvent('playVideo', { result: 'playSuccess' });
    //                 break;
    //             case AldplayVideoFail:
    //                 wx.aldSendEvent('playVideo', { result: 'playFail' });
    //                 break;
    //             case Aldshare:
    //                 wx.aldShareAppMessage(obj);
    //                 break;
    //             case AldOnShare:
    //                 wx.aldOnShareAppMessage(function () { return obj; });
    //                 break;
    //         }
    //     } catch (err) { };
    // },

    showRedPack(obj) { },
    showRedIcon(obj) { },
    getHelpLevel() { return -1; },

    shareHelp(level) { },
    shareHelpSuccess(level) { },
    helpFriendSuccess(level) { },
    getIsHaveFriendHelpMe(level, fun) { },

    getParamByOnline(key, defaultV) { return null; },
    getSDKVersionCanUse(data) { return true; },
    addGetLocakCardDialog(_node) { },

    jumpRefreshBanner(obj) { },
    returnHomeJumpGame() { },



    isOpen(key) { },
    showNativeBanner(top) { },
    hideNativeBanner() { },
    showSpotByBegin(isHaveNative, top) { },
    showSpotByPause(isHaveNative, top) { },
    showSpotByFinish(isHaveNative, top) { },
    showPraise() { },
    callAndroid(action) { },
    callAndroid_2(action, funS) { },
    callPay(action, funS) { },
    backHome() { },
    showRate() { },
    gotoSmallGame(gameName) { },
    gameAction(gameName) { },
    jniLevel(mode, level, action) { },



})
module.exports = BaseManager;