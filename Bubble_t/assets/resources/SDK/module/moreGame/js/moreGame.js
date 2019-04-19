

cc.Class({
    extends: cc.Component,

    properties: {
        needRefresh:false,
        type: 1,
        moreGameUrl:[],
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        //this.moreGameUrl = [];
     },

    start () {

    },
    
    setData: function(img,url,type,data,page,num){
        this._gameNameUrl = img;
        this.moreGameUrl = url;
        this.jumpType = type;
        this.jumpData = data;
        this._page = page;
        this._num = num;
        this.loadSpriteFrame(img);

        var bannerDelayTime = wxData.bannerOnlindDelayTime;
        if(this.needRefresh){
            this.schedule(this.resushImage,bannerDelayTime);
        }
        
    },
    loadSpriteFrame: function(img){
        var self = this;
        var loadFile = {
            url: img,
            type: "image"
        };
        cc.loader.load(loadFile, function (err, tex) {
            if (err) {
                return;
            }
            self.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
        });
    },
    callBack: function(){
        if(this.moreGameUrl.length <= 0) {
            return;
        }
        //cc.game.pause();//cc.game.resume()
       
		SdkManager.jumpApp(this.jumpData,this.moreGameUrl,this._page,this._num);
        
        if(this.needRefresh){
            this.resushImage();
        }

        try{
			var gameNameUrl = this._gameNameUrl.split("/");
			var gameName = gameNameUrl[gameNameUrl.length - 2];
			wx.aldSendEvent('moreGame',{'gameName':gameName});
		}catch(err){}
        
    },

    resushImage(){
        var random = parseInt(Math.random() * wxData.moreGameData.length);
        var moreData = wxData.moreGameData[random];
        this.loadSpriteFrame(moreData.icon);
        this.moreGameUrl = moreData.image;
        this.jumpType = moreData.jumpType;
        this.jumpData = moreData.jumpData;
    },

    // update (dt) {},
});
