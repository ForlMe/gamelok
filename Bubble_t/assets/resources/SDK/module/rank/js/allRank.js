

cc.Class({
    extends: cc.Component,

    properties: {
        frame: cc.Node,
        rankingCanvas: cc.Node,
        moreGameBanner: cc.Node,
        closeBtn: cc.Node,
    },



    onLoad() {
        if (cc.winSize.width < 720) {
            this.frame.scale = cc.winSize.width / 720;
        }
        var scale = this.frame.scale;
        var action = cc.sequence(cc.scaleTo(0.2, 1.1 * scale), cc.scaleTo(0.15, 1.0 * scale));
        this.frame.runAction(action);
        // this.closeBtn.active = false;

        // setTimeout(() => {
        //     this.closeBtn.active = true;
        // }, 1000);
    },

    setData: function (key, callBackClose) {
        this._closeCallBack = callBackClose;
        // SdkManager.showMoreGameByBanner({node:this.moreGameBanner});
        // this.rankingCanvas.getComponent('rankingActiveShow').onClick(key);

        SdkManager.updateSubView({ node: this.rankingCanvas, score: 0 });
    },
    closeCallBack: function () {
        this._closeCallBack && this._closeCallBack();
        setTimeout(() => {
            this.node.destroy();
        }, 20);
    },

    callBackGroupRanking: function () {
        SdkManager.share({ name: GameName, source: 4, success: function (type) { } });
    },

    // update (dt) {},
});
