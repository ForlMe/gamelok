cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        this.node.on(cc.Node.EventType.TOUCH_START, function(e) {
            console.log('*****************');
            e.stopPropagation();
            });
    },
    start() {

    },

    // update (dt) {},
});