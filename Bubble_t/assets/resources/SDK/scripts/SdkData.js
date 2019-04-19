window.spotData = [];
window.pauseSpotInterval = 3;
window.resultSpotInterval = 3;
window.pauseSpotStartIndex = 3;
window.resultSpotStartIndex = 3;
window.pauseSpotTime = 10;
window.resultSpotTime = 10;
window._SDKVersion = '2.1.0';
window.helpOpenId = "";//帮助好友过关 好友的oppnid
window.getOpenid = function () {
    var str = "";
    var char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'
    ];
    for (var i = 0; i < 12; i++) {
        str += char[parseInt(Math.random() * 62)];
    }
    return str;
};//唯一id

window.onHideHaveLoadScene = true;//true 算切入后台  false 不算切入后台
window.openid = getOpenid();

if (!window.wsurl) {
    window.wsurl = 'wss://battle.igame58.com/battle/v2/726f6f6d?uid=' + openid;//'wss://172.18.0.28:8022/battle/v2/726f6f6d';//'ws://battle.igame58.com/battle/v2/726f6f6d';
}
if (!window.uinfo) {
    window.uinfo = { gameid: 100001, uid: openid, nick: '刀客', icon: '', sex: 0, city: '', country: '', province: '', from: 'wechat' };
}

window.matchinfo = { nick: '好友', icon: '', sex: 0, city: '', country: '', province: '', from: 'wechat' };


// window.serverUrl = "http://172.18.1.10:8080/",
window.serverUrl = "https://app.igame58.com/",
    window.mainScneeFromSmallGame = false;
//需要修改  ---
window.wxGameVersion = 14;//本地游戏版本 
window.mainGameScene = 'mainScene';
window.RankingKey = "BubbleDragon",//排行榜key
window.GameName = "BubbleDragon",//游戏名字必须改
window.wxAppId = "wx233f53b7a951fcd3",//游戏id必须改
window.wxAppSecret = "",//要改

window.wxBannerId = "";//广告id
window.wxVideoId = "";//视频id

window.KEY_IS_SHENHE = "isShenhe";

//修改 end  ---
window.localCardKey = "localCardNum";//本地复活卡key
window.netCardNum = 0;//服务器复活卡key
window.canGetNetCardNum = true; //是否可以刷新服务器复活卡个数
window.getNetCardTime = 10 * 1000;//获取复活卡个数时间间隔毫秒
window.canGetLocalCard = false;// 是否可以领取本地复活卡
window.getLocalCareId = "";//领取本地复活卡的好友来源id

window.wxData = {
    WXforward: "",//返回主页跳转游戏
    session_key: "",//用户数据
    appId: wxAppId,//
    appSecret: wxAppSecret,//
    bannerID: "",
    params: null,

    checkShareSuccessNumIntervalTime: 10,//查询分享成功次数 间隔 

    //getOpenIdUrl:"https://api.weixin.qq.com/sns/jscode2session",
    getOpenIdUrl: serverUrl + 'lieyou/wxdata/requstWxAPI',//获取微信唯一id
    moreGameUrl: serverUrl + 'lieyou/wxdata/moreGame?appName=' + GameName,//更多游戏
    shareUrl: serverUrl + 'lieyou/wxdata/getShareImgText?appName=' + GameName,// + 分享
    putShareDataUrl: serverUrl + "lieyou/wxdata/gamerShare",//提交分享数据
    putTouchShareDataUrl: serverUrl + "lieyou/wxdata/userClickImgText",//提交点击分享数据
    checkResurrDataUrl: serverUrl + "lieyou/wxdata/selReviveCard",//查看复活
    useResurrDataUrl: serverUrl + "lieyou/wxdata/useReviveCard",//使用复活

    putPlayerData: serverUrl + "lieyou/wxdata/addGamerLogin/" + GameName + "/" + wxAppId + "/",//提交用户信息

    //在线数据
    getOnlineData: serverUrl + "lieyou/wxdata/getGameParam/" + wxAppId,//获取在线控制参数
    getCdkeyDataUrl: serverUrl + "lieyou/wxdata/getPsCode?",
    checkCdkeyDataUrl: serverUrl + "lieyou/wxdata/candr?",
    shareOnlineData: "",
    bannerOnlindDelayTime: 50,

    shareData: [],
    moreGameData: [],

}


//------------------------------------------- 游戏数据 公共方法
window.PI = 3.141592654;
window.lieyou = {
    Props_Base_Gold: 100,//金币系数
    Key_OncePlayerTime: "begingGameTime",
    Key_OncePlayerTimeDay: "begingGameTimeDay",
    Key_NewPlayer: "isNewPlayer",
    Key_Gold: "Key_Gold",
    Key_Music: "Key_BgMusic",
    Key_Sound: "Key_Sound",
    _SceneScale: 1,
    _offsetX: 0,
    _offsetY: 0,
    Language_ch: true,
}

window.language = require('Chinese');
if (cc.sys.language != cc.sys.LANGUAGE_CHINESE) {
    lieyou.Language_ch = false;
    language = require('English');
}


// function getDataForKey(key,vauleDef = ""){
//     var data = cc.sys.localStorage.getItem(key);
//     if(data === null || data === "") {
//         return vauleDef + "";
//     }
//     return data;
// }

// window.Userdefault = {
//     getBoolForKey : function(key,vauleDef = "false"){
//         if(vauleDef == "false") {
//         }else if(vauleDef) {
//             vauleDef = "true";
//         }else{
//             vauleDef = "false";
//         }
//         var data = getDataForKey(key,vauleDef);

//         if(data == "true") {
//             return true;
//         }else{
//             return false;
//         }
//     },
//     getIntForKey : function(key,vauleDef = 0){
//         var data = getDataForKey(key,vauleDef);
//         return parseInt(data);
//     },
//     getStringForKey : function(key,vauleDef = ""){
//         var data = getDataForKey(key,vauleDef);
//         return data;
//     },
//     getFloatForKey : function(key,vauleDef = 0.0){
//         var data = getDataForKey(key,vauleDef);
//         return parseFloat(data);
//     },

//     setDataForKey : function(key,vaule) {
//         cc.sys.localStorage.setItem(key,vaule);
//     },
//     setBoolForKey : function(key,vaule) {
//         if(vaule) {
//             vaule = "true";
//         }else{
//             vaule = "false";
//         }
//         cc.sys.localStorage.setItem(key,vaule);
//     }
// }


window.getRandom = function (min, max) {
    let diff = max - min;

    let ran = parseInt(Math.random() * diff);
    ran = ran + min;

    return ran;
}
//是否可以分享
window.getCanShare = function () {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        // 判断   正式版
        return wxServerVersion >= wxGameVersion;
    }
    return true;//不是微信小游戏直接返回true
}

window.getTime = function () {
    return (new Date()).getTime();//返回毫秒
}
//返回天
window.getTimeDay = function () {
    var time = new Date();
    var year = time.getYear() + 1900;
    var mouse = time.getMonth() + 1;
    var day = time.getDate();
    
    return year * 10000 + mouse * 100 + day;
}








