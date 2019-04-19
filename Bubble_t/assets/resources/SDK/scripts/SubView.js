// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        mydistype: "rankAll",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // this.schedule(this.updateData.bind(this), 1);
    },

    updateData() {
        var wxSubView = this.node.getComponent(cc.WXSubContextView);
        wxSubView.enabled = false;
        this._show = true;
        setTimeout(() => {
            if (this._show) {
                wxSubView.enabled = true;
            }
        }, 50);

        // if (this.mydistype != "rankAll") {
        //     setTimeout(() => {
        //         wxSubView.enabled = false;
        //     }, 1000);
        // }
    },

    stopUpdateData() {
        this._show = false;
        var wxSubView = this.node.getComponent(cc.WXSubContextView);
        wxSubView.enabled = false;
    },
    // update (dt) {},
});
