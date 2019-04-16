cc.Class({
    extends: cc.Component,

    properties: {
        slice_1: cc.Node,
        slice_2: cc.Node,
        slice_3: cc.Node,
    },
    onLoad() {
        if (!cc.yy) {
            cc.yy = require("Global");
        }
        // this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
        //     e.stopPropagation();
        // });
    },
    init(int) {
        switch (int) {
            case 1:
                this.slice_1.active = true;
                break;
            case 2:
                this.slice_2.active = true;
                break;
            case 3:
                this.slice_3.active = true;
                break;
        }
    },
    start() {

    },
});