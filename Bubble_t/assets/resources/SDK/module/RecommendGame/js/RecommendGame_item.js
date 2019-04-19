
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Node,
        gameName: cc.Label,
        btn: cc.Node,
        btnType: { type: cc.SpriteFrame, default: [] },
        size: { type: cc.Integer, default: 100 },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setData(img, url, gameName, id, type, data, page, num, callback = null) {
        this._gameNameUrl = img;
        this.moreGameUrl = url;
        this._gameName = gameName;
        this._id = id;
        this.jumpType = type;
        this.jumpData = data;
        this._page = page;
        this._num = num;
        this._callback = callback;
        this.loadSpriteFrame(img);
        if(!window._recommendGame){
            window._recommendGame = ["RecommendGame"];
        }

        var type = Userdefault.getIntForKey(window._recommendGame, 0, undefined, this.jumpData.appId);
        this.setType(type);
    },

    //按钮类型 0:试玩 1:领取 2:再领一次(分享) 3:去玩
    setType(type) {
        this.type = type;
        this.btn.getComponent(cc.Sprite).spriteFrame = this.btnType[this.type];
        Userdefault.setIntForKey(window._recommendGame, this.type, undefined, this.jumpData.appId);
    },

    loadSpriteFrame: function (img) {
        var self = this;
        var loadFile = {
            url: img,
            type: "image"
        };
        cc.loader.load(loadFile, function (err, tex) {
            if (err) {
                return;
            }
            self.icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            self.icon.width = self.size;
            self.icon.height = self.size;
            if (self._gameName) {
                self.gameName.string = self._gameName;
                self.gameName.node.active = true;
            }
        });
    },
    callBackShiWan() {
        if (this.moreGameUrl.length <= 0) {
            return;
        }
        switch (this.type) {
            case 0://试玩
                //cc.game.pause();//cc.game.resume()
                SdkManager.jumpApp(this.jumpData, this.moreGameUrl, this._page, this._num, function (type) {
                    console.log("试玩回调");
                    if (type) {
                        console.log("试玩回调2");
                        SdkManager.onShow(function (time) {
                            console.log("试玩回调3");
                            if (time > 10000) {
                                //成功
                                this._callback && this._callback(1);
                                this.setType(1);
                            }
                            else {
                                SdkManager.addToast("您试玩的时间太短啦,请再玩一玩!");
                            }
                            return true;
                        }.bind(this));
                    }
                    else {
                        this._callback && this._callback(0);
                    }
                }.bind(this));
                try {
                    var gameNameUrl = this._gameNameUrl.split("/");
                    var gameName = gameNameUrl[gameNameUrl.length - 2];
                    wx.aldSendEvent('moreGame', { 'gameName': gameName });
                } catch (err) { }
                break;
            case 1://领取
                this._callback && this._callback(2);
                this.setType(2);
                break;
            case 2://再领一次（分享）
                SdkManager.share({
                    name: window.GameName, source: 6, success: function (type, id) {
                        if (type) {
                            this._callback && this._callback(3);
                            this.setType(3);
                        }
                        else {
                            console.log("通讯失败");
                            this._callback && this._callback(4);
                        }
                    }.bind(this)
                });
                break;
            case 3://去玩
                SdkManager.jumpApp(this.jumpData, this.moreGameUrl, this._page, this._num, function (type) {
                    if (type) {
                        SdkManager.onShow(function (time) {
                            if (time > 15000) {
                                //成功
                                this._callback && this._callback(1);
                            }
                            return true;
                        }.bind(this));
                    }
                    else {
                        this._callback && this._callback(0);
                    }
                }.bind(this));

                try {
                    var gameNameUrl = this._gameNameUrl.split("/");
                    var gameName = gameNameUrl[gameNameUrl.length - 2];
                    wx.aldSendEvent('moreGame', { 'gameName': gameName });
                } catch (err) { }
                break;
        }
    },

});
