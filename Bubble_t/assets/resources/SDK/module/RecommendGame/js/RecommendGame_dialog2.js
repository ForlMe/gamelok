
cc.Class({
    extends: cc.Component,

    properties: {
        frame: cc.Node,
        recommend_Item: cc.Prefab,
        contentNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.frame.scale = lieyou._SceneScale;
        var time = Userdefault.getIntForKey("RecommendGameTime", 0);
        var newTime = getTimeDay();
        if (time != newTime) {
            Userdefault.setIntForKey("RecommendGameTime", newTime);
            Userdefault.clearForKey("RecommendGame");
        }
    },

    setData(callback = null) {
        this._callback = callback;

        var data = [];
        var k = 0;
        for (var i = 0; i < wxData.moreGameData.length; i++) {
            if (wxData.moreGameData[i].iconX) {
                data[k] = wxData.moreGameData[i];
                k++;
            } else {
            }
        }
        if (data.length <= 0) {
            this.node.destroy();
            return;
        }
        // data = this.shuffle(data);
        var childNum = 0;
        var key = ["RecommendGame"];
        for (var i = 0; i < data.length; i++) {
            data[i].status = Userdefault.getIntForKey(key, 0, undefined, data[i].jumpData.appId);
        }
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data.length - 1; j++) {
                if (data[j].status > data[j + 1].status) {
                    var temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }
            }
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i].jumpType == 2) {
                var item = cc.instantiate(this.recommend_Item);
                this.contentNode.addChild(item);
                item.getComponent('RecommendGame_item').setData(data[i].iconX, data[i].image, data[i].inGame, data[i].id, data[i].jumpType, data[i].jumpData, 9, i + 1, function (type) {
                    switch (type) {
                        case 0://试玩失败
                        case 1://试玩成功
                        case 4://再次领取失败
                            break;
                        case 2://领取
                        case 3://再次领取成功
                            this._callback(true);
                            break;
                    }
                }.bind(this));//

                childNum++;
            }
        }

        this.contentNode.height = childNum * 150 + 40;
    },

    shuffle: function (array) {
        var input = array;
        for (var i = input.length - 1; i >= 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    },

    closeCallback: function () {
        this.node.destroy();
    }

    // update (dt) {},
});
